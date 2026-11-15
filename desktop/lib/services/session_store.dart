import 'dart:convert';
import 'dart:io';
import '../models/user_session.dart';

abstract class SessionStorage {
  Future<StoredSession> load();
  Future<void> saveSession({String? token, SkyRippleUser? user});
  Future<void> savePreferences(DesktopPreferences preferences);
  Future<void> clearAuth();
}

class FileSessionStorage implements SessionStorage {
  FileSessionStorage({this.customPath});

  final String? customPath;

  File _resolveFile() {
    if (customPath != null) {
      return File(customPath!);
    }
    final env = Platform.environment;
    final baseDir = Platform.isWindows
        ? (env['APPDATA'] ?? env['USERPROFILE'] ?? '.')
        : (env['XDG_CONFIG_HOME'] ?? '${env['HOME'] ?? '.'}/.config');
    return File('$baseDir/skyripple_desktop/session.json');
  }

  Future<Map<String, dynamic>> _readRaw() async {
    try {
      final file = _resolveFile();
      if (!await file.exists()) {
        return {};
      }
      final raw = await file.readAsString();
      if (raw.trim().isEmpty) {
        return {};
      }
      final decoded = jsonDecode(raw);
      if (decoded is Map<String, dynamic>) {
        return decoded;
      }
      return {};
    } catch (_) {
      return {};
    }
  }

  Future<void> _writeRaw(Map<String, dynamic> data) async {
    try {
      final file = _resolveFile();
      await file.parent.create(recursive: true);
      await file.writeAsString(jsonEncode(data));
    } catch (_) {}
  }

  @override
  Future<StoredSession> load() async {
    final raw = await _readRaw();
    final token = raw['token']?.toString();
    final userMap = raw['user'];
    final prefsMap = raw['preferences'];
    return StoredSession(
      token: (token != null && token.isNotEmpty) ? token : null,
      user: userMap is Map<String, dynamic>
          ? SkyRippleUser.fromJson(userMap)
          : null,
      preferences: prefsMap is Map<String, dynamic>
          ? DesktopPreferences.fromJson(prefsMap)
          : const DesktopPreferences(),
    );
  }

  @override
  Future<void> saveSession({String? token, SkyRippleUser? user}) async {
    final raw = await _readRaw();
    if (token == null) {
      raw.remove('token');
    } else {
      raw['token'] = token;
    }
    if (user == null) {
      raw.remove('user');
    } else {
      raw['user'] = user.toJson();
    }
    await _writeRaw(raw);
  }

  @override
  Future<void> savePreferences(DesktopPreferences preferences) async {
    final raw = await _readRaw();
    raw['preferences'] = preferences.toJson();
    await _writeRaw(raw);
  }

  @override
  Future<void> clearAuth() async {
    final raw = await _readRaw();
    raw.remove('token');
    raw.remove('user');
    await _writeRaw(raw);
  }
}

class MemorySessionStorage implements SessionStorage {
  String? _token;
  SkyRippleUser? _user;
  DesktopPreferences _preferences = const DesktopPreferences();

  @override
  Future<StoredSession> load() async {
    return StoredSession(
      token: _token,
      user: _user,
      preferences: _preferences,
    );
  }

  @override
  Future<void> saveSession({String? token, SkyRippleUser? user}) async {
    _token = token;
    _user = user;
  }

  @override
  Future<void> savePreferences(DesktopPreferences preferences) async {
    _preferences = preferences;
  }

  @override
  Future<void> clearAuth() async {
    _token = null;
    _user = null;
  }
}
