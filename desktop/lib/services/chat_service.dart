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

  Future<MessageHistoryPage> listDirectMessagesPage({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
    String? before,
  });

  Future<ChatMessage> sendDirectMessage({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
    required String content,
    String? imageUrl,
    Map<String, dynamic>? attachment,
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

  Future<MessageHistoryPage> listRoomMessagesPage({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
    String? before,
  });

  Future<ChatMessage> sendRoomMessage({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
    required String content,
    String? imageUrl,
    Map<String, dynamic>? attachment,
  });

  Future<void> deleteRoomMessage({
    required String apiUrl,
    required String token,
    required String messageId,
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

  Future<ChatConversation> createRoom({
    required String apiUrl,
    required String token,
    required String name,
    String? description,
    String? category,
  });

  Future<void> joinRoom({
    required String apiUrl,
    required String token,
    required String roomId,
  });

  Future<FavoriteItem> addFavorite({
    required String apiUrl,
    required String token,
    required String itemType,
    required String itemId,
    required String title,
    String? content,
  });

  Future<void> removeFavorite({
    required String apiUrl,
    required String token,
    required String itemType,
    required String itemId,
  });

  Future<List<AppNotification>> listNotifications({
    required String apiUrl,
    required String token,
  });

  Future<void> markNotificationRead({
    required String apiUrl,
    required String token,
    required String notificationId,
  });

  Future<void> markAllNotificationsRead({
    required String apiUrl,
    required String token,
  });

  Future<void> clearNotifications({
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
    final page = await listDirectMessagesPage(
      apiUrl: apiUrl,
      token: token,
      conversationId: conversationId,
      currentUserId: currentUserId,
    );
    return page.messages;
  }

  @override
  Future<MessageHistoryPage> listDirectMessagesPage({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
    String? before,
  }) async {
    final query = (before != null && before.isNotEmpty)
        ? '?before=${Uri.encodeQueryComponent(before)}'
        : '';
    final decoded = await _request(
      method: 'GET',
      url:
          '${_normalize(apiUrl)}/directs/conversations/$conversationId/messages$query',
      token: token,
    );
    return _parseMessagePage(decoded, currentUserId);
  }

  @override
  Future<ChatMessage> sendDirectMessage({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
    required String content,
    String? imageUrl,
    Map<String, dynamic>? attachment,
  }) async {
    final decoded = await _request(
      method: 'POST',
      url: '${_normalize(apiUrl)}/directs/conversations/$conversationId/messages',
      token: token,
      body: {
        'content': content,
        if (imageUrl != null && imageUrl.isNotEmpty) 'imageUrl': imageUrl,
        'attachment': ?attachment,
      },
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
    final page = await listRoomMessagesPage(
      apiUrl: apiUrl,
      token: token,
      roomId: roomId,
      currentUserId: currentUserId,
    );
    return page.messages;
  }

  @override
  Future<MessageHistoryPage> listRoomMessagesPage({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
    String? before,
  }) async {
    final query = (before != null && before.isNotEmpty)
        ? '?before=${Uri.encodeQueryComponent(before)}'
        : '';
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/rooms/$roomId/messages$query',
      token: token,
    );
    return _parseMessagePage(decoded, currentUserId);
  }

  @override
  Future<ChatMessage> sendRoomMessage({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
    required String content,
    String? imageUrl,
    Map<String, dynamic>? attachment,
  }) async {
    final decoded = await _request(
      method: 'POST',
      url: '${_normalize(apiUrl)}/rooms/$roomId/messages',
      token: token,
      body: {
        'content': content,
        if (imageUrl != null && imageUrl.isNotEmpty) 'imageUrl': imageUrl,
        'attachment': ?attachment,
      },
    );
    if (decoded is Map<String, dynamic>) {
      return ChatMessage.fromJson(decoded, currentUserId: currentUserId);
    }
    throw const AuthApiException('Resposta inválida ao enviar mensagem.');
  }

  @override
  Future<void> deleteRoomMessage({
    required String apiUrl,
    required String token,
    required String messageId,
  }) async {
    await _request(
      method: 'DELETE',
      url: '${_normalize(apiUrl)}/messages/$messageId',
      token: token,
    );
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

  @override
  Future<ChatConversation> createRoom({
    required String apiUrl,
    required String token,
    required String name,
    String? description,
    String? category,
  }) async {
    final decoded = await _request(
      method: 'POST',
      url: '${_normalize(apiUrl)}/rooms',
      token: token,
      body: {
        'name': name,
        if (description != null && description.trim().isNotEmpty)
          'description': description.trim(),
        if (category != null && category.trim().isNotEmpty)
          'category': category.trim(),
        'type': 'public',
      },
    );
    if (decoded is Map<String, dynamic>) {
      final roomMap = decoded['room'] is Map<String, dynamic>
          ? decoded['room'] as Map<String, dynamic>
          : decoded;
      return ChatConversation.fromRoomJson(roomMap);
    }
    throw const AuthApiException('Resposta inválida ao criar sala.');
  }

  @override
  Future<void> joinRoom({
    required String apiUrl,
    required String token,
    required String roomId,
  }) async {
    await _request(
      method: 'POST',
      url: '${_normalize(apiUrl)}/rooms/$roomId/join',
      token: token,
    );
  }

  @override
  Future<FavoriteItem> addFavorite({
    required String apiUrl,
    required String token,
    required String itemType,
    required String itemId,
    required String title,
    String? content,
  }) async {
    final decoded = await _request(
      method: 'POST',
      url: '${_normalize(apiUrl)}/favorites',
      token: token,
      body: {
        'item_type': itemType,
        'item_id': itemId,
        'title': title,
        if (content != null && content.trim().isNotEmpty)
          'content': content.trim(),
      },
    );
    if (decoded is Map<String, dynamic>) {
      return FavoriteItem.fromJson(decoded);
    }
    return FavoriteItem(
      id: itemId,
      title: title,
      subtitle: itemType == 'room' ? 'Sala temática' : 'Conversa direta',
      itemType: itemType,
    );
  }

  @override
  Future<void> removeFavorite({
    required String apiUrl,
    required String token,
    required String itemType,
    required String itemId,
  }) async {
    await _request(
      method: 'DELETE',
      url: '${_normalize(apiUrl)}/favorites/$itemType/$itemId',
      token: token,
    );
  }

  @override
  Future<List<AppNotification>> listNotifications({
    required String apiUrl,
    required String token,
  }) async {
    final decoded = await _request(
      method: 'GET',
      url: '${_normalize(apiUrl)}/notifications',
      token: token,
    );
    if (decoded is! List) {
      return const [];
    }
    return decoded
        .whereType<Map<String, dynamic>>()
        .map(AppNotification.fromJson)
        .toList();
  }

  @override
  Future<void> markNotificationRead({
    required String apiUrl,
    required String token,
    required String notificationId,
  }) async {
    await _request(
      method: 'PATCH',
      url: '${_normalize(apiUrl)}/notifications/$notificationId/read',
      token: token,
    );
  }

  @override
  Future<void> markAllNotificationsRead({
    required String apiUrl,
    required String token,
  }) async {
    await _request(
      method: 'PATCH',
      url: '${_normalize(apiUrl)}/notifications/read-all',
      token: token,
    );
  }

  @override
  Future<void> clearNotifications({
    required String apiUrl,
    required String token,
  }) async {
    await _request(
      method: 'DELETE',
      url: '${_normalize(apiUrl)}/notifications/all',
      token: token,
    );
  }

  MessageHistoryPage _parseMessagePage(dynamic decoded, String currentUserId) {
    if (decoded is List) {
      return MessageHistoryPage(
        messages: decoded
            .whereType<Map<String, dynamic>>()
            .map((m) => ChatMessage.fromJson(m, currentUserId: currentUserId))
            .toList(),
      );
    }
    if (decoded is Map<String, dynamic> && decoded['messages'] is List) {
      final list = (decoded['messages'] as List<dynamic>)
          .whereType<Map<String, dynamic>>()
          .map((m) => ChatMessage.fromJson(m, currentUserId: currentUserId))
          .toList();
      return MessageHistoryPage(
        messages: list,
        hasMore: decoded['hasMore'] == true,
        nextCursor: decoded['nextCursor']?.toString(),
      );
    }
    return const MessageHistoryPage(messages: []);
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
