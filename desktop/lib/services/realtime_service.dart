import 'package:socket_io_client/socket_io_client.dart' as io;

abstract class RealtimeClient {
  void connect({
    required String apiUrl,
    required String token,
    required String userId,
    required void Function(Map<String, dynamic> payload) onMessage,
    required void Function(List<String> onlineUserIds) onOnlineUsers,
    void Function(String messageId)? onMessageDeleted,
  });

  void joinRoom(String roomId, String userId);
  void leaveRoom(String roomId, String userId);
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
  }) {}

  @override
  void joinRoom(String roomId, String userId) {}

  @override
  void leaveRoom(String roomId, String userId) {}

  @override
  void dispose() {}
}
