import 'package:socket_io_client/socket_io_client.dart' as io;

abstract class RealtimeClient {
  void connect({
    required String apiUrl,
    required String token,
    required String userId,
    required void Function(Map<String, dynamic> payload) onMessage,
    required void Function(List<String> onlineUserIds) onOnlineUsers,
    void Function(String messageId)? onMessageDeleted,
    void Function(String messageId, String newContent)? onMessageEdited,
    void Function(String messageId, String userId)? onLikeToggled,
    void Function(String roomId, List<String> onlineUserIds, int onlineCount)?
        onRoomPresenceUpdated,
    void Function(String userId, bool isOnline)? onUserPresenceChanged,
    void Function(Map<String, dynamic> payload)? onNotification,
  });

  void joinRoom(String roomId, String userId);
  void leaveRoom(String roomId, String userId);
  void editMessage({
    required String roomId,
    required String messageId,
    required String content,
  });
  void toggleLike({
    required String roomId,
    required String messageId,
    required String userId,
  });
  void dispose();
}

class SocketIoRealtimeClient implements RealtimeClient {
  io.Socket? _socket;

  @override
  void connect({
    required String apiUrl,
    required String token,
    required String userId,
    required void Function(Map<String, dynamic> payload) onMessage,
    required void Function(List<String> onlineUserIds) onOnlineUsers,
    void Function(String messageId)? onMessageDeleted,
    void Function(String messageId, String newContent)? onMessageEdited,
    void Function(String messageId, String userId)? onLikeToggled,
    void Function(String roomId, List<String> onlineUserIds, int onlineCount)?
        onRoomPresenceUpdated,
    void Function(String userId, bool isOnline)? onUserPresenceChanged,
    void Function(Map<String, dynamic> payload)? onNotification,
  }) {
    dispose();
    final baseUrl = apiUrl.replaceFirst(RegExp(r'/api/?$'), '');
    final socket = io.io(
      baseUrl,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .disableAutoConnect()
          .build(),
    );

    socket.onConnect((_) {
      socket.emit('get_online_users');
    });

    socket.on('online_users_list', (data) {
      if (data is List) {
        onOnlineUsers(data.map((e) => e.toString()).toList());
      }
    });

    socket.on('receive_message', (data) {
      if (data is Map) {
        onMessage(Map<String, dynamic>.from(data));
      }
    });

    socket.on('message_deleted', (data) {
      if (data is Map && onMessageDeleted != null) {
        final msgId = (data['messageId'] ?? data['id'] ?? '').toString();
        if (msgId.isNotEmpty) {
          onMessageDeleted(msgId);
        }
      }
    });

    socket.on('message_edited', (data) {
      if (data is Map && onMessageEdited != null) {
        final msgId = (data['messageId'] ?? data['id'] ?? '').toString();
        final newContent = (data['message'] ?? data['content'] ?? '').toString();
        if (msgId.isNotEmpty) {
          onMessageEdited(msgId, newContent);
        }
      }
    });

    socket.on('like_toggled', (data) {
      if (data is Map && onLikeToggled != null) {
        final msgId = (data['messageId'] ?? data['id'] ?? '').toString();
        final likerId = (data['userId'] ?? '').toString();
        if (msgId.isNotEmpty && likerId.isNotEmpty) {
          onLikeToggled(msgId, likerId);
        }
      }
    });

    socket.on('roomPresenceUpdated', (data) {
      if (data is Map && onRoomPresenceUpdated != null) {
        final roomId = (data['roomId'] ?? data['room'] ?? '').toString();
        final rawUsers = data['onlineUsers'];
        final onlineIds = <String>[];
        if (rawUsers is List) {
          for (final item in rawUsers) {
            if (item is Map) {
              final id = (item['id'] ?? item['userId'] ?? '').toString();
              if (id.isNotEmpty) {
                onlineIds.add(id);
              }
            } else if (item != null) {
              final id = item.toString();
              if (id.isNotEmpty) {
                onlineIds.add(id);
              }
            }
          }
        }
        final count = data['onlineCount'] is num
            ? (data['onlineCount'] as num).toInt()
            : onlineIds.length;
        if (roomId.isNotEmpty) {
          onRoomPresenceUpdated(roomId, onlineIds, count);
        }
      }
    });

    socket.on('user_presence_changed', (data) {
      if (data is Map && onUserPresenceChanged != null) {
        final uid = (data['userId'] ?? '').toString();
        final isOnline = data['isOnline'] == true;
        if (uid.isNotEmpty) {
          onUserPresenceChanged(uid, isOnline);
        }
      }
    });

    socket.on('new_notification', (data) {
      if (data is Map && onNotification != null) {
        onNotification(Map<String, dynamic>.from(data));
      }
    });

    socket.connect();
    _socket = socket;
  }

  @override
  void joinRoom(String roomId, String userId) {
    _socket?.emit('join_room', {'room': roomId, 'userId': userId});
  }

  @override
  void leaveRoom(String roomId, String userId) {
    _socket?.emit('leave_room', {'room': roomId, 'userId': userId});
  }

  @override
  void editMessage({
    required String roomId,
    required String messageId,
    required String content,
  }) {
    _socket?.emit('edit_message', {
      'room': roomId,
      'messageId': messageId,
      'message': content,
    });
  }

  @override
  void toggleLike({
    required String roomId,
    required String messageId,
    required String userId,
  }) {
    _socket?.emit('toggle_like', {
      'room': roomId,
      'messageId': messageId,
      'userId': userId,
    });
  }

  @override
  void dispose() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}

class NoopRealtimeClient implements RealtimeClient {
  @override
  void connect({
    required String apiUrl,
    required String token,
    required String userId,
    required void Function(Map<String, dynamic> payload) onMessage,
    required void Function(List<String> onlineUserIds) onOnlineUsers,
    void Function(String messageId)? onMessageDeleted,
    void Function(String messageId, String newContent)? onMessageEdited,
    void Function(String messageId, String userId)? onLikeToggled,
    void Function(String roomId, List<String> onlineUserIds, int onlineCount)?
        onRoomPresenceUpdated,
    void Function(String userId, bool isOnline)? onUserPresenceChanged,
    void Function(Map<String, dynamic> payload)? onNotification,
  }) {}

  @override
  void joinRoom(String roomId, String userId) {}

  @override
  void leaveRoom(String roomId, String userId) {}

  @override
  void editMessage({
    required String roomId,
    required String messageId,
    required String content,
  }) {}

  @override
  void toggleLike({
    required String roomId,
    required String messageId,
    required String userId,
  }) {}

  @override
  void dispose() {}
}
