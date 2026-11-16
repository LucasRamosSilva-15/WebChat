import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';

class RecordedAudio {
  const RecordedAudio({
    required this.bytes,
    required this.mimeType,
    required this.fileName,
    required this.duration,
  });

  final Uint8List bytes;
  final String mimeType;
  final String fileName;
  final Duration duration;

  String get dataUrl => 'data:$mimeType;base64,${base64Encode(bytes)}';
}

abstract class AudioService {
  Future<bool> get isRecordingSupported;
  Future<bool> get isPlaybackSupported;
  Future<void> startRecording();
  Future<RecordedAudio?> stopRecording();
  Future<void> cancelRecording();
  Future<void> play(
    String url, {
    required String messageId,
    VoidCallback? onCompleted,
  });
  Future<void> stopPlayback();
  void dispose();
}

class SystemAudioService implements AudioService {
  Process? _recordProcess;
  String? _recordFilePath;
  DateTime? _recordStartedAt;

  Process? _playProcess;
  String? _playTempFilePath;
  String? _cachedRecorderTool;
  String? _cachedPlayerTool;
  bool _toolsResolved = false;

  Future<String?> _findTool(List<String> candidates) async {
    for (final tool in candidates) {
      try {
        final result = await Process.run('which', [tool]);
        if (result.exitCode == 0 &&
            result.stdout.toString().trim().isNotEmpty) {
          return tool;
        }
      } catch (_) {}
    }
    return null;
  }

  Future<void> _resolveTools() async {
    if (_toolsResolved) return;
    _toolsResolved = true;
    if (Platform.isLinux) {
      _cachedRecorderTool = await _findTool([
        'pw-record',
        'parecord',
        'arecord',
      ]);
      _cachedPlayerTool = await _findTool([
        'ffplay',
        'pw-play',
        'paplay',
        'aplay',
      ]);
    }
  }

  @override
  Future<bool> get isRecordingSupported async {
    await _resolveTools();
    return _cachedRecorderTool != null;
  }

  @override
  Future<bool> get isPlaybackSupported async {
    await _resolveTools();
    return _cachedPlayerTool != null;
  }

  @override
  Future<void> startRecording() async {
    await _resolveTools();
    final tool = _cachedRecorderTool;
    if (tool == null) {
      throw StateError('Nenhuma ferramenta de gravação de áudio disponível.');
    }
    await cancelRecording();

    final ts = DateTime.now().millisecondsSinceEpoch;
    final path = '${Directory.systemTemp.path}/skyripple_rec_$ts.wav';
    final List<String> args;
    switch (tool) {
      case 'pw-record':
        args = ['--format', 's16', '--rate', '16000', '--channels', '1', path];
        break;
      case 'parecord':
        args = ['--file-format=wav', '--rate=16000', '--channels=1', path];
        break;
      default:
        args = ['-f', 'S16_LE', '-r', '16000', '-c', '1', '-t', 'wav', path];
        break;
    }

    _recordFilePath = path;
    _recordStartedAt = DateTime.now();
    _recordProcess = await Process.start(tool, args);
  }

  @override
  Future<RecordedAudio?> stopRecording() async {
    final proc = _recordProcess;
    final path = _recordFilePath;
    final startedAt = _recordStartedAt;
    _recordProcess = null;
    _recordFilePath = null;
    _recordStartedAt = null;

    if (proc == null || path == null) {
      return null;
    }

    proc.kill(ProcessSignal.sigint);
    try {
      await proc.exitCode.timeout(const Duration(milliseconds: 1500));
    } catch (_) {
      proc.kill(ProcessSignal.sigkill);
    }

    final file = File(path);
    if (!await file.exists()) {
      return null;
    }
    final bytes = await file.readAsBytes();
    try {
      await file.delete();
    } catch (_) {}

    if (bytes.isEmpty) {
      return null;
    }
    final duration = startedAt != null
        ? DateTime.now().difference(startedAt)
        : Duration.zero;
    final ts = DateTime.now().millisecondsSinceEpoch;
    return RecordedAudio(
      bytes: bytes,
      mimeType: 'audio/wav',
      fileName: 'audio-$ts.wav',
      duration: duration,
    );
  }

  @override
  Future<void> cancelRecording() async {
    final proc = _recordProcess;
    final path = _recordFilePath;
    _recordProcess = null;
    _recordFilePath = null;
    _recordStartedAt = null;

    if (proc != null) {
      proc.kill(ProcessSignal.sigkill);
    }
    if (path != null) {
      final file = File(path);
      try {
        if (await file.exists()) {
          await file.delete();
        }
      } catch (_) {}
    }
  }

  String _extFromMime(String mime) {
    final lower = mime.toLowerCase();
    if (lower.contains('wav')) return 'wav';
    if (lower.contains('webm')) return 'webm';
    if (lower.contains('ogg')) return 'ogg';
    if (lower.contains('mpeg') || lower.contains('mp3')) return 'mp3';
    if (lower.contains('mp4') || lower.contains('m4a')) return 'm4a';
    if (lower.contains('aac')) return 'aac';
    return 'bin';
  }

  @override
  Future<void> play(
    String url, {
    required String messageId,
    VoidCallback? onCompleted,
  }) async {
    await _resolveTools();
    final tool = _cachedPlayerTool;
    if (tool == null) {
      throw StateError('Nenhum reprodutor de áudio disponível.');
    }
    await stopPlayback();

    String target = url;
    if (url.startsWith('data:')) {
      final comma = url.indexOf(',');
      if (comma < 0 || comma >= url.length - 1) {
        throw const FormatException('Áudio em formato inválido.');
      }
      final header = url.substring(5, comma);
      final mime = header.split(';').first;
      final bytes = base64Decode(url.substring(comma + 1));
      final ts = DateTime.now().millisecondsSinceEpoch;
      final ext = _extFromMime(mime);
      final tempPath = '${Directory.systemTemp.path}/skyripple_play_$ts.$ext';
      await File(tempPath).writeAsBytes(bytes);
      _playTempFilePath = tempPath;
      target = tempPath;
    }

    final List<String> args;
    if (tool == 'ffplay') {
      args = ['-nodisp', '-autoexit', '-loglevel', 'quiet', target];
    } else {
      args = [target];
    }

    final proc = await Process.start(tool, args);
    _playProcess = proc;
    final createdTemp = _playTempFilePath;
    proc.exitCode.then((_) async {
      if (_playProcess == proc) {
        _playProcess = null;
      }
      if (createdTemp != null) {
        try {
          final f = File(createdTemp);
          if (await f.exists()) {
            await f.delete();
          }
        } catch (_) {}
        if (_playTempFilePath == createdTemp) {
          _playTempFilePath = null;
        }
      }
      onCompleted?.call();
    });
  }

  @override
  Future<void> stopPlayback() async {
    final proc = _playProcess;
    final tempPath = _playTempFilePath;
    _playProcess = null;
    _playTempFilePath = null;

    if (proc != null) {
      proc.kill(ProcessSignal.sigkill);
    }
    if (tempPath != null) {
      try {
        final f = File(tempPath);
        if (await f.exists()) {
          await f.delete();
        }
      } catch (_) {}
    }
  }

  @override
  void dispose() {
    cancelRecording();
    stopPlayback();
  }
}
