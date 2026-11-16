import 'dart:convert';
import 'dart:io';
import 'dart:math';
import 'dart:typed_data';

import 'package:pointycastle/export.dart';

import '../models/chat_models.dart';
import '../widgets/chat_bubble.dart';
import 'chat_service.dart';

abstract class E2eeKeyStore {
  Future<Map<String, dynamic>?> readIdentity(String userId);
  Future<void> writeIdentity(String userId, Map<String, dynamic> jwk);
}

class MemoryE2eeKeyStore implements E2eeKeyStore {
  final Map<String, Map<String, dynamic>> _store = {};

  @override
  Future<Map<String, dynamic>?> readIdentity(String userId) async {
    final value = _store[userId];
    return value == null ? null : Map<String, dynamic>.from(value);
  }

  @override
  Future<void> writeIdentity(String userId, Map<String, dynamic> jwk) async {
    _store[userId] = Map<String, dynamic>.from(jwk);
  }
}

class FileE2eeKeyStore implements E2eeKeyStore {
  FileE2eeKeyStore({this.customPath});

  final String? customPath;

  File _resolveFile() {
    if (customPath != null) {
      return File(customPath!);
    }
    final env = Platform.environment;
    final baseDir = Platform.isWindows
        ? (env['APPDATA'] ?? env['USERPROFILE'] ?? '.')
        : (env['XDG_CONFIG_HOME'] ?? '${env['HOME'] ?? '.'}/.config');
    return File('$baseDir/skyripple_desktop/e2ee_keys.json');
  }

  Map<String, dynamic> _readAllSync() {
    try {
      final file = _resolveFile();
      if (!file.existsSync()) {
        return {};
      }
      final raw = file.readAsStringSync();
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

  @override
  Future<Map<String, dynamic>?> readIdentity(String userId) async {
    final all = _readAllSync();
    final entry = all[userId];
    if (entry is Map<String, dynamic>) {
      return Map<String, dynamic>.from(entry);
    }
    return null;
  }

  @override
  Future<void> writeIdentity(String userId, Map<String, dynamic> jwk) async {
    try {
      final all = _readAllSync();
      all[userId] = jwk;
      final file = _resolveFile();
      file.parent.createSync(recursive: true);
      file.writeAsStringSync(jsonEncode(all));
    } catch (_) {}
  }
}

class E2eeIdentity {
  const E2eeIdentity({
    required this.privateKey,
    required this.publicJwk,
  });

  final ECPrivateKey privateKey;
  final Map<String, dynamic> publicJwk;
}

class ConversationCrypto {
  const ConversationCrypto({
    required this.aesKey,
    required this.safetyNumber,
  });

  final Uint8List aesKey;
  final String safetyNumber;
}

class E2eeService {
  E2eeService({E2eeKeyStore? keyStore})
      : _keyStore = keyStore ?? FileE2eeKeyStore();

  static const String e2eePrefix = 'e2ee:v1:';
  static const String hkdfInfo = 'webchat-e2ee-v1';
  static const String decryptFailedText =
      '🔒 Mensagem criptografada — não foi possível abrir neste dispositivo.';
  static const Duration _missingPeerTtl = Duration(seconds: 15);

  final E2eeKeyStore _keyStore;
  final ECDomainParameters _domainParams = ECDomainParameters('secp256r1');
  final Random _secureRandom = Random.secure();

  final Map<String, Future<E2eeIdentity?>> _identityFutures = {};
  final Map<String, ConversationCrypto> _conversationCache = {};
  final Map<String, DateTime> _missingPeerUntil = {};

  static bool isEncryptedContent(String? value) {
    return value != null && value.startsWith(e2eePrefix);
  }

  void clearCache() {
    _identityFutures.clear();
    _conversationCache.clear();
    _missingPeerUntil.clear();
  }

  Uint8List _randomBytes(int length) {
    final bytes = Uint8List(length);
    for (var i = 0; i < length; i++) {
      bytes[i] = _secureRandom.nextInt(256);
    }
    return bytes;
  }

  Uint8List _bigIntToBytes32(BigInt value) {
    final hex = value.toRadixString(16).padLeft(64, '0');
    final clipped = hex.length > 64 ? hex.substring(hex.length - 64) : hex;
    final out = Uint8List(32);
    for (var i = 0; i < 32; i++) {
      out[i] = int.parse(clipped.substring(i * 2, i * 2 + 2), radix: 16);
    }
    return out;
  }

  BigInt _bytesToBigInt(List<int> bytes) {
    final hex =
        bytes.map((b) => b.toRadixString(16).padLeft(2, '0')).join();
    return BigInt.parse(hex.isEmpty ? '0' : hex, radix: 16);
  }

  String _encodeCoord(BigInt coord) {
    return base64Url.encode(_bigIntToBytes32(coord)).replaceAll('=', '');
  }

  BigInt _decodeCoord(String b64url) {
    final normalized = base64Url.normalize(b64url);
    return _bytesToBigInt(base64Url.decode(normalized));
  }

  bool _sameJwk(Map<String, dynamic>? a, Map<String, dynamic>? b) {
    if (a == null || b == null) {
      return false;
    }
    return a['crv'] == b['crv'] && a['x'] == b['x'] && a['y'] == b['y'];
  }

  Future<E2eeIdentity> generateIdentity() async {
    final fortuna = FortunaRandom()..seed(KeyParameter(_randomBytes(32)));
    final keyGen = ECKeyGenerator()
      ..init(
        ParametersWithRandom(
          ECKeyGeneratorParameters(_domainParams),
          fortuna,
        ),
      );
    final pair = keyGen.generateKeyPair();
    final privateKey = pair.privateKey;
    final publicKey = pair.publicKey;
    final publicJwk = <String, dynamic>{
      'kty': 'EC',
      'crv': 'P-256',
      'x': _encodeCoord(publicKey.Q!.x!.toBigInteger()!),
      'y': _encodeCoord(publicKey.Q!.y!.toBigInteger()!),
    };
    return E2eeIdentity(privateKey: privateKey, publicJwk: publicJwk);
  }

  Future<E2eeIdentity> _loadOrCreateLocalIdentity(String userId) async {
    final stored = await _keyStore.readIdentity(userId);
    if (stored != null &&
        stored['x'] is String &&
        stored['y'] is String &&
        stored['d'] is String) {
      try {
        final dBigInt = _decodeCoord(stored['d'] as String);
        final privateKey = ECPrivateKey(dBigInt, _domainParams);
        final publicJwk = <String, dynamic>{
          'kty': 'EC',
          'crv': 'P-256',
          'x': stored['x'],
          'y': stored['y'],
        };
        return E2eeIdentity(privateKey: privateKey, publicJwk: publicJwk);
      } catch (_) {}
    }

    final generated = await generateIdentity();
    await _keyStore.writeIdentity(userId, {
      'kty': 'EC',
      'crv': 'P-256',
      'x': generated.publicJwk['x'],
      'y': generated.publicJwk['y'],
      'd': _encodeCoord(generated.privateKey.d!),
    });
    return generated;
  }

  Future<E2eeIdentity?> initIdentity({
    required String userId,
    required ChatApiClient chatClient,
    required String apiUrl,
    required String token,
  }) {
    if (userId.isEmpty || token.isEmpty) {
      return Future.value(null);
    }
    return _identityFutures.putIfAbsent(userId, () async {
      try {
        final identity = await _loadOrCreateLocalIdentity(userId);
        final remote = await chatClient.getPublicKey(
          apiUrl: apiUrl,
          token: token,
          userId: userId,
        );
        if (!_sameJwk(remote, identity.publicJwk)) {
          await chatClient.putPublicKey(
            apiUrl: apiUrl,
            token: token,
            publicKey: identity.publicJwk,
          );
        }
        return identity;
      } catch (_) {
        _identityFutures.remove(userId);
        return null;
      }
    });
  }

  Future<Uint8List> deriveConversationKey(
    ECPrivateKey myPrivateKey,
    Map<String, dynamic> peerPublicJwk,
  ) async {
    final x = _decodeCoord(peerPublicJwk['x'] as String);
    final y = _decodeCoord(peerPublicJwk['y'] as String);
    final q = _domainParams.curve.createPoint(x, y);
    final peerPublicKey = ECPublicKey(q, _domainParams);

    final agreement = ECDHBasicAgreement()..init(myPrivateKey);
    final sharedBigInt = agreement.calculateAgreement(peerPublicKey);
    final sharedBytes = _bigIntToBytes32(sharedBigInt);

    final hkdf = HKDFKeyDerivator(SHA256Digest());
    hkdf.init(
      HkdfParameters(
        sharedBytes,
        32,
        Uint8List(32),
        Uint8List.fromList(utf8.encode(hkdfInfo)),
      ),
    );
    final aesKey = Uint8List(32);
    hkdf.deriveKey(null, 0, aesKey, 0);
    return aesKey;
  }

  Future<String> computeSafetyNumber(
    Map<String, dynamic> jwkA,
    Map<String, dynamic> jwkB,
  ) async {
    final list = [jwkA, jwkB]..sort((p, q) {
        final left = '${p['x']}${p['y']}';
        final right = '${q['x']}${q['y']}';
        return left.compareTo(right);
      });
    final first = list[0];
    final second = list[1];
    final payload =
        '${first['x']}.${first['y']}|${second['x']}.${second['y']}';
    final digest =
        SHA256Digest().process(Uint8List.fromList(utf8.encode(payload)));
    final first12 = digest.take(12).toList();
    final hex = first12
        .map((b) => b.toRadixString(16).padLeft(2, '0'))
        .join()
        .toUpperCase();
    final groups = <String>[];
    for (var i = 0; i < hex.length; i += 4) {
      groups.add(hex.substring(i, i + 4));
    }
    return groups.join(' ');
  }

  Future<ConversationCrypto?> getConversationCrypto({
    required String userId,
    required String peerId,
    required ChatApiClient chatClient,
    required String apiUrl,
    required String token,
    bool refresh = false,
  }) async {
    if (userId.isEmpty || peerId.isEmpty) {
      return null;
    }
    final cacheKey = '$userId:$peerId';
    if (!refresh && _conversationCache.containsKey(cacheKey)) {
      return _conversationCache[cacheKey];
    }
    final blockedUntil = _missingPeerUntil[peerId];
    if (!refresh &&
        blockedUntil != null &&
        blockedUntil.isAfter(DateTime.now())) {
      return null;
    }

    try {
      final identity = await initIdentity(
        userId: userId,
        chatClient: chatClient,
        apiUrl: apiUrl,
        token: token,
      );
      if (identity == null) {
        return null;
      }
      final peerPublicJwk = await chatClient.getPublicKey(
        apiUrl: apiUrl,
        token: token,
        userId: peerId,
      );
      if (peerPublicJwk == null) {
        _missingPeerUntil[peerId] = DateTime.now().add(_missingPeerTtl);
        _conversationCache.remove(cacheKey);
        return null;
      }
      _missingPeerUntil.remove(peerId);
      final aesKey = await deriveConversationKey(
        identity.privateKey,
        peerPublicJwk,
      );
      final safety = await computeSafetyNumber(
        identity.publicJwk,
        peerPublicJwk,
      );
      final entry = ConversationCrypto(
        aesKey: aesKey,
        safetyNumber: safety,
      );
      _conversationCache[cacheKey] = entry;
      return entry;
    } catch (_) {
      return null;
    }
  }

  Future<String> encryptPayload({
    required Uint8List key,
    required String conversationId,
    required Map<String, dynamic> payload,
  }) async {
    final iv = _randomBytes(12);
    final plainBytes = Uint8List.fromList(utf8.encode(jsonEncode(payload)));
    final aad = Uint8List.fromList(utf8.encode(conversationId));
    final cipher = GCMBlockCipher(AESEngine())
      ..init(
        true,
        AEADParameters(KeyParameter(key), 128, iv, aad),
      );
    final cipherBytes = cipher.process(plainBytes);
    return '$e2eePrefix${base64.encode(iv)}:${base64.encode(cipherBytes)}';
  }

  Future<Map<String, dynamic>> decryptPayload({
    required Uint8List key,
    required String conversationId,
    required String envelope,
  }) async {
    if (!isEncryptedContent(envelope)) {
      throw const FormatException('Mensagem não está criptografada.');
    }
    final body = envelope.substring(e2eePrefix.length);
    final parts = body.split(':');
    if (parts.length != 2 || parts[0].isEmpty || parts[1].isEmpty) {
      throw const FormatException('Mensagem criptografada malformada.');
    }
    final iv = Uint8List.fromList(base64.decode(parts[0]));
    final combined = Uint8List.fromList(base64.decode(parts[1]));
    if (combined.length < 16) {
      throw const FormatException('Payload criptografado inválido.');
    }
    final aad = Uint8List.fromList(utf8.encode(conversationId));
    final cipher = GCMBlockCipher(AESEngine())
      ..init(
        false,
        AEADParameters(KeyParameter(key), 128, iv, aad),
      );
    final plainBytes = cipher.process(combined);
    final decoded = jsonDecode(utf8.decode(plainBytes));
    if (decoded is Map<String, dynamic>) {
      return decoded;
    }
    throw const FormatException('Conteúdo E2EE inválido.');
  }

  Future<String> encryptMessage({
    required ConversationCrypto crypto,
    required String conversationId,
    required String text,
    String? imageUrl,
    Map<String, dynamic>? attachment,
  }) {
    return encryptPayload(
      key: crypto.aesKey,
      conversationId: conversationId,
      payload: {
        't': text,
        'i': imageUrl,
        'a': attachment,
      },
    );
  }

  Future<ChatMessage> decryptMessage({
    required ChatMessage message,
    required String userId,
    required String peerId,
    required String conversationId,
    required ChatApiClient chatClient,
    required String apiUrl,
    required String token,
  }) async {
    if (!isEncryptedContent(message.text)) {
      return message;
    }
    for (final refresh in [false, true]) {
      final crypto = await getConversationCrypto(
        userId: userId,
        peerId: peerId,
        chatClient: chatClient,
        apiUrl: apiUrl,
        token: token,
        refresh: refresh,
      );
      if (crypto == null) {
        break;
      }
      try {
        final payload = await decryptPayload(
          key: crypto.aesKey,
          conversationId: conversationId,
          envelope: message.text,
        );
        final decryptedText = (payload['t'] ?? '').toString();
        final decryptedImage = payload['i']?.toString();
        final rawAttachment = payload['a'];
        String? attachmentUrl = message.attachmentUrl;
        String? fileName = message.fileName;
        String? fileSize = message.fileSize;
        ChatBubbleKind kind = message.kind;

        if (rawAttachment is Map<String, dynamic>) {
          attachmentUrl = rawAttachment['url']?.toString();
          fileName = rawAttachment['name']?.toString() ??
              rawAttachment['fileName']?.toString();
          fileSize = rawAttachment['size']?.toString();
          final mime = (rawAttachment['mimeType'] ??
                  rawAttachment['type'] ??
                  '')
              .toString();
          if (attachmentUrl != null && attachmentUrl.isNotEmpty) {
            kind = mime.startsWith('audio/')
                ? ChatBubbleKind.audio
                : ChatBubbleKind.attachment;
          }
        } else if (decryptedImage != null && decryptedImage.isNotEmpty) {
          kind = ChatBubbleKind.image;
        }

        return message.copyWith(
          text: decryptedText,
          imageUrl: (decryptedImage != null && decryptedImage.isNotEmpty)
              ? decryptedImage
              : null,
          attachmentUrl: attachmentUrl,
          fileName: fileName,
          fileSize: fileSize,
          kind: kind,
          isEncrypted: true,
          decryptFailed: false,
        );
      } catch (_) {}
    }

    return message.copyWith(
      text: decryptFailedText,
      imageUrl: null,
      attachmentUrl: null,
      fileName: null,
      fileSize: null,
      kind: ChatBubbleKind.text,
      isEncrypted: true,
      decryptFailed: true,
    );
  }
}
