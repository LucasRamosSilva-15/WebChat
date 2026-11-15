import '../widgets/chat_bubble.dart';
import '../widgets/user_avatar.dart';

class ChatConversation {
  const ChatConversation({
    required this.id,
    required this.title,
    required this.preview,
    required this.timestamp,
    required this.isRoom,
    this.presence,
    this.isE2ee = false,
    this.unread = 0,
    this.subtitle = '',
    this.partnerId,
    this.membersCount = 0,
  });

  final String id;
  final String title;
  final String preview;
  final String timestamp;
  final bool isRoom;
  final UserPresence? presence;
  final bool isE2ee;
  final int unread;
  final String subtitle;
  final String? partnerId;
  final int membersCount;

  ChatConversation copyWith({
    String? preview,
    String? timestamp,
    UserPresence? presence,
    int? unread,
    String? subtitle,
  }) {
    return ChatConversation(
      id: id,
      title: title,
      preview: preview ?? this.preview,
      timestamp: timestamp ?? this.timestamp,
      isRoom: isRoom,
      presence: presence ?? this.presence,
      isE2ee: isE2ee,
      unread: unread ?? this.unread,
      subtitle: subtitle ?? this.subtitle,
      partnerId: partnerId,
      membersCount: membersCount,
    );
  }

  factory ChatConversation.fromDirectJson(Map<String, dynamic> json) {
    final isOnline = json['online'] == true;
    final name = (json['name'] ?? json['username'] ?? 'Usuário').toString();
    return ChatConversation(
      id: (json['id'] ?? '').toString(),
      title: name,
      preview: (json['lastMessage'] ?? 'Conversa iniciada').toString(),
      timestamp: (json['time'] ?? '').toString(),
      isRoom: false,
      presence: isOnline ? UserPresence.online : UserPresence.offline,
      isE2ee: true,
      unread: (json['unread'] is num) ? (json['unread'] as num).toInt() : 0,
      subtitle: isOnline ? 'Online agora' : 'Offline',
      partnerId: json['partnerId']?.toString(),
    );
  }

  factory ChatConversation.fromRoomJson(Map<String, dynamic> json) {
    final name = (json['name'] ?? 'Sala').toString();
    final members = (json['members_count'] is num)
        ? (json['members_count'] as num).toInt()
        : 0;
    final desc = (json['description'] ?? json['category'] ?? 'Sala temática')
        .toString();
    return ChatConversation(
      id: (json['id'] ?? '').toString(),
      title: name.startsWith('#') ? name : '# $name',
      preview: desc,
      timestamp: members > 0 ? '$members membros' : '',
      isRoom: true,
      subtitle: members > 0 ? '$members membros • $desc' : desc,
      membersCount: members,
    );
  }
}

class ChatMessage {
  const ChatMessage({
    required this.id,
    required this.senderId,
    required this.senderName,
    required this.text,
    required this.timestamp,
    required this.isSent,
    this.role,
    this.kind = ChatBubbleKind.text,
    this.fileName,
    this.fileSize,
  });

  final String id;
  final String senderId;
  final String senderName;
  final String text;
  final String timestamp;
  final bool isSent;
  final String? role;
  final ChatBubbleKind kind;
  final String? fileName;
  final String? fileSize;

  factory ChatMessage.fromJson(
    Map<String, dynamic> json, {
    required String currentUserId,
  }) {
    final senderId = (json['user_id'] ??
            json['userId'] ??
            json['sender_id'] ??
            json['senderId'] ??
            '')
        .toString();
    final isMe = json['isMe'] == true ||
        (currentUserId.isNotEmpty && senderId == currentUserId);
    final senderName = isMe
        ? 'Você'
        : (json['sender'] ??
                json['sender_name'] ??
                json['author'] ??
                'Usuário')
            .toString();
    final attachment = json['attachment'];
    final hasAttachment = attachment is Map<String, dynamic>;
    final mime = hasAttachment ? (attachment['mimeType'] ?? '').toString() : '';
    final isAudio = mime.startsWith('audio/');
    return ChatMessage(
      id: (json['messageId'] ?? json['id'] ?? '').toString(),
      senderId: senderId,
      senderName: senderName,
      text: (json['text'] ?? json['content'] ?? json['message'] ?? '')
          .toString(),
      timestamp: (json['time'] ?? '').toString(),
      isSent: isMe,
      role: _mapRole(json['role']?.toString()),
      kind: isAudio
          ? ChatBubbleKind.audio
          : (hasAttachment ? ChatBubbleKind.attachment : ChatBubbleKind.text),
      fileName: hasAttachment ? attachment['name']?.toString() : null,
      fileSize: hasAttachment && attachment['size'] is num
          ? '${((attachment['size'] as num) / (1024 * 1024)).toStringAsFixed(1)} MB'
          : null,
    );
  }

  static String? _mapRole(String? raw) {
    if (raw == 'owner') return 'Dono';
    if (raw == 'moderator' || raw == 'mod') return 'Mod';
    return null;
  }
}

class RoomMember {
  const RoomMember({
    required this.id,
    required this.name,
    required this.presence,
    this.role,
  });

  final String id;
  final String name;
  final UserPresence presence;
  final String? role;

  factory RoomMember.fromJson(Map<String, dynamic> json) {
    final userObj = json['user'] is Map<String, dynamic>
        ? json['user'] as Map<String, dynamic>
        : json;
    final rawRole = (json['role'] ?? '').toString();
    String? mappedRole;
    if (rawRole == 'owner') {
      mappedRole = 'Dono';
    } else if (rawRole == 'moderator' || rawRole == 'mod') {
      mappedRole = 'Mod';
    }
    final isOnline =
        json['online'] == true || userObj['status']?.toString() == 'active';
    return RoomMember(
      id: (userObj['id'] ?? json['user_id'] ?? '').toString(),
      name: (userObj['displayName'] ??
              userObj['name'] ??
              userObj['email'] ??
              'Membro')
          .toString(),
      presence: isOnline ? UserPresence.online : UserPresence.offline,
      role: mappedRole,
    );
  }
}

class DirectoryUser {
  const DirectoryUser({
    required this.id,
    required this.name,
    required this.email,
    required this.online,
  });

  final String id;
  final String name;
  final String email;
  final bool online;

  factory DirectoryUser.fromJson(Map<String, dynamic> json) {
    return DirectoryUser(
      id: (json['id'] ?? '').toString(),
      name: (json['displayName'] ??
              json['name'] ??
              json['email'] ??
              'Usuário')
          .toString(),
      email: (json['email'] ?? '').toString(),
      online: json['online'] == true || json['status']?.toString() == 'active',
    );
  }
}

class FavoriteItem {
  const FavoriteItem({
    required this.id,
    required this.title,
    required this.subtitle,
  });

  final String id;
  final String title;
  final String subtitle;

  factory FavoriteItem.fromJson(Map<String, dynamic> json) {
    final itemType = (json['item_type'] ?? json['itemType'] ?? 'item')
        .toString();
    final title = (json['title'] ??
            json['name'] ??
            json['label'] ??
            'Item favoritado')
        .toString();
    return FavoriteItem(
      id: (json['item_id'] ?? json['id'] ?? '').toString(),
      title: title,
      subtitle: itemType == 'room' ? 'Sala temática' : 'Conversa direta',
    );
  }
}
