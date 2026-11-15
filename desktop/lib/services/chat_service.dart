import 'dart:convert';
import 'dart:io';
import '../models/chat_models.dart';
import 'auth_service.dart';

abstract class ChatApiClient {
  Future<List<ChatConversation>> listDirectConversations({
    required String apiUrl,
    required String token,
  });

  Future<List<ChatMessage>> listDirectMessages({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
  });

  Future<ChatMessage> sendDirectMessage({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
    required String content,
  });

  Future<List<DirectoryUser>> listAvailableUsers({
    required String apiUrl,
    required String token,
    String query = '',
  });

  Future<ChatConversation> getOrCreateDirect({
    required String apiUrl,
    required String token,
    required String targetUserId,
  });

  Future<List<ChatConversation>> listRooms({
    required String apiUrl,
    required String token,
  });

  Future<List<ChatMessage>> listRoomMessages({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
  });

  Future<ChatMessage> sendRoomMessage({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
    required String content,
  });

  Future<List<RoomMember>> listRoomMembers({
    required String apiUrl,
    required String token,
    required String roomId,
  });

  Future<List<FavoriteItem>> listFavorites({
    required String apiUrl,
    required String token,
  });
}

class HttpChatApiClient implements ChatApiClient {
  HttpChatApiClient({HttpClient? httpClient}) : _externalClient = httpClient;

  final HttpClient? _externalClient;

  @override
  Future<List<ChatConversation>> listDirectConversations({
    required String apiUrl,
    required String token,
  }) async {
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/directs/conversations',
      token: token,
    );
    if (decoded is! List) {
      return const [];
    }
    return decoded
        .whereType<Map<String, dynamic>>()
        .map(ChatConversation.fromDirectJson)
        .toList();
  }

  @override
  Future<List<ChatMessage>> listDirectMessages({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
  }) async {
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/directs/conversations/$conversationId/messages',
      token: token,
    );
    return _parseMessageList(decoded, currentUserId);
  }

  @override
  Future<ChatMessage> sendDirectMessage({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
    required String content,
  }) async {
    final decoded = await _request(
      method: 'POST',
      url: '${_normalize(apiUrl)}/directs/conversations/$conversationId/messages',
      token: token,
      body: {'content': content},
    );
    if (decoded is Map<String, dynamic>) {
      return ChatMessage.fromJson(decoded, currentUserId: currentUserId);
    }
    throw const AuthApiException('Resposta inválida ao enviar mensagem.');
  }

  @override
  Future<List<DirectoryUser>> listAvailableUsers({
    required String apiUrl,
    required String token,
    String query = '',
  }) async {
    final encoded = Uri.encodeQueryComponent(query);
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/directs/users?q=$encoded',
      token: token,
    );
    if (decoded is! List) {
      return const [];
    }
    return decoded
        .whereType<Map<String, dynamic>>()
        .map(DirectoryUser.fromJson)
        .toList();
  }

  @override
  Future<ChatConversation> getOrCreateDirect({
    required String apiUrl,
    required String token,
    required String targetUserId,
  }) async {
    final decoded = await _request(
      method: 'POST',
      url: '${_normalize(apiUrl)}/directs/conversations',
      token: token,
      body: {'targetUserId': targetUserId},
    );
    if (decoded is Map<String, dynamic>) {
      return ChatConversation.fromDirectJson(decoded);
    }
    throw const AuthApiException('Erro ao abrir conversa direta.');
  }

  @override
  Future<List<ChatConversation>> listRooms({
    required String apiUrl,
    required String token,
  }) async {
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/rooms',
      token: token,
    );
    if (decoded is! List) {
      return const [];
    }
    return decoded
        .whereType<Map<String, dynamic>>()
        .map(ChatConversation.fromRoomJson)
        .toList();
  }

  @override
  Future<List<ChatMessage>> listRoomMessages({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
  }) async {
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/rooms/$roomId/messages',
      token: token,
    );
    return _parseMessageList(decoded, currentUserId);
  }

  @override
  Future<ChatMessage> sendRoomMessage({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
    required String content,
  }) async {
    final decoded = await _request(
      method: 'POST',
      url: '${_normalize(apiUrl)}/rooms/$roomId/messages',
      token: token,
      body: {'content': content},
    );
    if (decoded is Map<String, dynamic>) {
      return ChatMessage.fromJson(decoded, currentUserId: currentUserId);
    }
    throw const AuthApiException('Resposta inválida ao enviar mensagem.');
  }

  @override
  Future<List<RoomMember>> listRoomMembers({
    required String apiUrl,
    required String token,
    required String roomId,
  }) async {
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/rooms/$roomId/members',
      token: token,
    );
    if (decoded is! List) {
      return const [];
    }
    return decoded
        .whereType<Map<String, dynamic>>()
        .map(RoomMember.fromJson)
        .toList();
  }

  @override
  Future<List<FavoriteItem>> listFavorites({
    required String apiUrl,
    required String token,
  }) async {
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/favorites',
      token: token,
    );
    if (decoded is! List) {
      return const [];
    }
    return decoded
        .whereType<Map<String, dynamic>>()
        .map(FavoriteItem.fromJson)
        .toList();
  }

  List<ChatMessage> _parseMessageList(dynamic decoded, String currentUserId) {
    final List<dynamic> list;
    if (decoded is List) {
      list = decoded;
    } else if (decoded is Map<String, dynamic> && decoded['messages'] is List) {
      list = decoded['messages'] as List<dynamic>;
    } else {
      return const [];
    }
    return list
        .whereType<Map<String, dynamic>>()
        .map((m) => ChatMessage.fromJson(m, currentUserId: currentUserId))
        .toList();
  }

  String _normalize(String apiUrl) {
    final trimmed = apiUrl.trim();
    return trimmed.endsWith('/')
        ? trimmed.substring(0, trimmed.length - 1)
        : trimmed;
  }

  Future<dynamic> _request({
    required String method,
    required String url,
    required String token,
    Map<String, dynamic>? body,
  }) async {
    final client = _externalClient ?? HttpClient();
    client.connectionTimeout = const Duration(seconds: 15);
    try {
      final request = await client.openUrl(method, Uri.parse(url));
      request.headers.set(HttpHeaders.contentTypeHeader, 'application/json');
      request.headers.set(HttpHeaders.acceptHeader, 'application/json');
      if (token.isNotEmpty) {
        request.headers.set(HttpHeaders.authorizationHeader, 'Bearer $token');
      }
      if (body != null) {
        request.add(utf8.encode(jsonEncode(body)));
      }
      final response = await request.close();
      final raw = await utf8.decodeStream(response);
      final dynamic parsed = raw.trim().isNotEmpty ? jsonDecode(raw) : null;
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return parsed;
      }
      final msg = parsed is Map<String, dynamic>
          ? (parsed['error']?.toString() ??
              parsed['message']?.toString() ??
              'Erro na requisição (${response.statusCode}).')
          : 'Erro na requisição (${response.statusCode}).';
      throw AuthApiException(msg, statusCode: response.statusCode);
    } on AuthApiException {
      rethrow;
    } on SocketException {
      throw const AuthApiException(
        'Não foi possível conectar ao servidor SkyRipple.',
      );
    } finally {
      if (_externalClient == null) {
        client.close();
      }
    }
  }
}
