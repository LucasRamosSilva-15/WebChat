import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:skyripple_desktop/main.dart';
import 'package:skyripple_desktop/models/chat_models.dart';
import 'package:skyripple_desktop/models/user_session.dart';
import 'package:skyripple_desktop/services/auth_service.dart';
import 'package:skyripple_desktop/services/chat_service.dart';
import 'package:skyripple_desktop/services/realtime_service.dart';
import 'package:skyripple_desktop/services/session_store.dart';
import 'package:skyripple_desktop/widgets/user_avatar.dart';

class _FakeAuthClient implements AuthApiClient {
  _FakeAuthClient({this.failLogin = false});

  final bool failLogin;

  @override
  Future<SkyRippleUser> fetchMe({
    required String apiUrl,
    required String token,
  }) async {
    return const SkyRippleUser(
      id: '1',
      name: 'Lucas Ramos',
      email: 'lucas@example.com',
    );
  }

  @override
  Future<AuthResult> login({
    required String apiUrl,
    required String email,
    required String password,
  }) async {
    if (failLogin) {
      throw const AuthApiException('Credenciais inválidas.', statusCode: 401);
    }
    return AuthResult(
      token: 'jwt-test-token',
      user: SkyRippleUser(
        id: '1',
        name: 'Lucas Ramos',
        email: email,
      ),
    );
  }

  @override
  Future<AuthResult> register({
    required String apiUrl,
    required String name,
    required String email,
    required String password,
  }) async {
    return AuthResult(
      token: 'jwt-test-token',
      user: SkyRippleUser(
        id: '2',
        name: name,
        email: email,
      ),
    );
  }
}

class _FakeChatClient implements ChatApiClient {
  @override
  Future<ChatConversation> getOrCreateDirect({
    required String apiUrl,
    required String token,
    required String targetUserId,
  }) async {
    return const ChatConversation(
      id: 'd2',
      title: 'Ana Beatriz',
      preview: 'Conversa iniciada',
      timestamp: 'Agora',
      isRoom: false,
      presence: UserPresence.online,
      isE2ee: true,
    );
  }

  @override
  Future<List<DirectoryUser>> listAvailableUsers({
    required String apiUrl,
    required String token,
    String query = '',
  }) async {
    return const [
      DirectoryUser(
        id: 'u2',
        name: 'Ana Beatriz',
        email: 'ana@example.com',
        online: true,
      ),
    ];
  }

  @override
  Future<List<ChatConversation>> listDirectConversations({
    required String apiUrl,
    required String token,
  }) async {
    return const [
      ChatConversation(
        id: 'd1',
        title: 'Marina Oliveira',
        preview: 'Oi! Tudo certo?',
        timestamp: '14:32',
        isRoom: false,
        presence: UserPresence.online,
        isE2ee: true,
        subtitle: 'Online agora',
      ),
    ];
  }

  @override
  Future<MessageHistoryPage> listDirectMessagesPage({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
    String? before,
  }) async {
    if (before == 'c1') {
      return MessageHistoryPage(
        messages: [
          ChatMessage(
            id: 'm0',
            senderId: 'u2',
            senderName: 'Marina Oliveira',
            text: 'Mensagem antiga do histórico!',
            timestamp: '09:15',
            isSent: false,
            createdAt: DateTime(2026, 10, 15, 9, 15),
          ),
        ],
        hasMore: false,
      );
    }
    final msgs = await listDirectMessages(
      apiUrl: apiUrl,
      token: token,
      conversationId: conversationId,
      currentUserId: currentUserId,
    );
    return MessageHistoryPage(
      messages: msgs,
      hasMore: true,
      nextCursor: 'c1',
    );
  }

  @override
  Future<List<ChatMessage>> listDirectMessages({
    required String apiUrl,
    required String token,
    required String conversationId,
    required String currentUserId,
  }) async {
    return const [
      ChatMessage(
        id: 'm1',
        senderId: 'u2',
        senderName: 'Marina Oliveira',
        text: 'Oi! Você conseguiu avançar?',
        timestamp: '14:32',
        isSent: false,
      ),
    ];
  }

  @override
  Future<List<FavoriteItem>> listFavorites({
    required String apiUrl,
    required String token,
  }) async {
    return const [
      FavoriteItem(
        id: 'r1',
        title: '# Tecnologia & Flutter',
        subtitle: 'Sala temática',
      ),
    ];
  }

  @override
  Future<List<RoomMember>> listRoomMembers({
    required String apiUrl,
    required String token,
    required String roomId,
  }) async {
    return const [
      RoomMember(
        id: 'u3',
        name: 'Ana Beatriz',
        presence: UserPresence.online,
        role: 'Dono',
      ),
    ];
  }

  @override
  Future<MessageHistoryPage> listRoomMessagesPage({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
    String? before,
  }) async {
    final msgs = await listRoomMessages(
      apiUrl: apiUrl,
      token: token,
      roomId: roomId,
      currentUserId: currentUserId,
    );
    return MessageHistoryPage(messages: msgs, hasMore: false);
  }

  @override
  Future<List<ChatMessage>> listRoomMessages({
    required String apiUrl,
    required String token,
    required String roomId,
    required String currentUserId,
  }) async {
    return const [
      ChatMessage(
        id: 'rm1',
        senderId: 'u3',
        senderName: 'Ana Beatriz',
        text: 'Bem-vindos à sala!',
        timestamp: '14:00',
        isSent: false,
        role: 'Dono',
      ),
    ];
  }

  @override
  Future<List<ChatConversation>> listRooms({
    required String apiUrl,
    required String token,
  }) async {
    return const [
      ChatConversation(
        id: 'r1',
        title: '# Tecnologia & Flutter',
        preview: 'Desenvolvimento desktop',
        timestamp: '24 membros',
        isRoom: true,
        subtitle: '24 membros • Desenvolvimento desktop',
        membersCount: 24,
      ),
    ];
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
    return ChatMessage(
      id: 'm2',
      senderId: currentUserId,
      senderName: 'Você',
      text: content,
      imageUrl: imageUrl,
      attachmentUrl: attachment?['url']?.toString(),
      timestamp: 'Agora',
      isSent: true,
    );
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
    return ChatMessage(
      id: 'rm2',
      senderId: currentUserId,
      senderName: 'Você',
      text: content,
      imageUrl: imageUrl,
      attachmentUrl: attachment?['url']?.toString(),
      timestamp: 'Agora',
      isSent: true,
    );
  }

  @override
  Future<void> deleteRoomMessage({
    required String apiUrl,
    required String token,
    required String messageId,
  }) async {}

  @override
  Future<ChatConversation> createRoom({
    required String apiUrl,
    required String token,
    required String name,
    String? description,
    String? category,
  }) async {
    return ChatConversation(
      id: 'r2',
      title: name.startsWith('#') ? name : '# $name',
      preview: description ?? 'Sala temática',
      timestamp: '1 membros',
      isRoom: true,
      subtitle: '1 membros • ${description ?? 'Geral'}',
      membersCount: 1,
    );
  }

  @override
  Future<void> joinRoom({
    required String apiUrl,
    required String token,
    required String roomId,
  }) async {}

  @override
  Future<FavoriteItem> addFavorite({
    required String apiUrl,
    required String token,
    required String itemType,
    required String itemId,
    required String title,
    String? content,
  }) async {
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
  }) async {}

  List<AppNotification> notifications = [
    AppNotification(
      id: 'n1',
      type: 'message',
      title: 'Nova mensagem de Marina',
      content: 'Oi! Tudo certo?',
      read: false,
      createdAt: DateTime(2026, 11, 15, 14, 32),
    ),
  ];

  bool markAllCalled = false;

  @override
  Future<List<AppNotification>> listNotifications({
    required String apiUrl,
    required String token,
  }) async {
    return List<AppNotification>.from(notifications);
  }

  @override
  Future<void> markNotificationRead({
    required String apiUrl,
    required String token,
    required String notificationId,
  }) async {
    notifications = notifications
        .map((n) => n.id == notificationId ? n.copyWith(read: true) : n)
        .toList();
  }

  @override
  Future<void> markAllNotificationsRead({
    required String apiUrl,
    required String token,
  }) async {
    markAllCalled = true;
    notifications = notifications.map((n) => n.copyWith(read: true)).toList();
  }

  @override
  Future<void> clearNotifications({
    required String apiUrl,
    required String token,
  }) async {
    notifications = [];
  }
}

class _ControllableRealtimeClient implements RealtimeClient {
  void Function(Map<String, dynamic> payload)? _onMessage;
  void Function(Map<String, dynamic> payload)? _onNotification;

  @override
  void connect({
    required String apiUrl,
    required String token,
    required String userId,
    required void Function(Map<String, dynamic> payload) onMessage,
    required void Function(List<String> onlineUserIds) onOnlineUsers,
    void Function(String messageId)? onMessageDeleted,
    void Function(Map<String, dynamic> payload)? onNotification,
  }) {
    _onMessage = onMessage;
    _onNotification = onNotification;
  }

  void emitMessage(Map<String, dynamic> payload) {
    _onMessage?.call(payload);
  }

  void emitNotification(Map<String, dynamic> payload) {
    _onNotification?.call(payload);
  }

  @override
  void joinRoom(String roomId, String userId) {}

  @override
  void leaveRoom(String roomId, String userId) {}

  @override
  void dispose() {}
}

void main() {
  testWidgets('Auth screen logs in and loads real directs and rooms', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    final storage = MemorySessionStorage();
    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        chatClient: _FakeChatClient(),
        realtimeClient: NoopRealtimeClient(),
        sessionStorage: storage,
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Bem-vindo de volta'), findsOneWidget);

    await tester.enterText(find.byType(TextField).at(0), 'lucas@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'SenhaForte#2026');
    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    expect(find.text('Conversas'), findsOneWidget);
    expect(find.text('Marina Oliveira'), findsWidgets);
    expect(find.text('Oi! Você conseguiu avançar?'), findsOneWidget);

    await tester.enterText(find.byType(TextField).last, 'Tudo certo por aqui!');
    await tester.tap(find.text('Enviar'));
    await tester.pumpAndSettle();
    expect(find.text('Tudo certo por aqui!'), findsOneWidget);

    final saved = await storage.load();
    expect(saved.token, 'jwt-test-token');
    expect(saved.user?.email, 'lucas@example.com');

    await tester.tap(find.text('Salas').first);
    await tester.pumpAndSettle();

    expect(find.text('# Tecnologia & Flutter'), findsWidgets);
    expect(find.text('Dono'), findsWidgets);

    await tester.tap(find.byIcon(Icons.settings_rounded));
    await tester.pumpAndSettle();
    expect(find.text('Configurações & Perfil'), findsOneWidget);

    await tester.tap(find.text('Salvar Alterações'));
    await tester.pumpAndSettle();
    expect(find.text('Configurações & Perfil'), findsNothing);
  });

  testWidgets('Server dialog and password visibility toggle work cleanly', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        chatClient: _FakeChatClient(),
        realtimeClient: NoopRealtimeClient(),
        sessionStorage: MemorySessionStorage(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Servidor'));
    await tester.pumpAndSettle();
    expect(find.text('Servidor SkyRipple'), findsOneWidget);

    await tester.tap(find.text('Salvar'));
    await tester.pumpAndSettle();
    expect(find.text('Servidor SkyRipple'), findsNothing);

    await tester.tap(find.byIcon(Icons.visibility_outlined));
    await tester.pump();
    expect(find.byIcon(Icons.visibility_off_outlined), findsOneWidget);
  });

  testWidgets('Auth screen displays API error message on failed login', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(failLogin: true),
        chatClient: _FakeChatClient(),
        realtimeClient: NoopRealtimeClient(),
        sessionStorage: MemorySessionStorage(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).at(0), 'lucas@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'errada');
    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    expect(find.text('Credenciais inválidas.'), findsOneWidget);
    expect(find.text('Bem-vindo de volta'), findsOneWidget);
  });

  testWidgets('Theme toggle, resize, settings dark mode, and sign out work', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        chatClient: _FakeChatClient(),
        realtimeClient: NoopRealtimeClient(),
        sessionStorage: MemorySessionStorage(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.light_mode_rounded));
    await tester.pumpAndSettle();

    tester.view.physicalSize = const Size(700, 800);
    await tester.pumpAndSettle();
    tester.view.physicalSize = const Size(1280, 800);
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).at(0), 'lucas@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'SenhaForte#2026');
    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.light_mode_rounded));
    await tester.pumpAndSettle();

    tester.view.physicalSize = const Size(900, 800);
    await tester.pumpAndSettle();
    tester.view.physicalSize = const Size(1280, 800);
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.settings_rounded));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Escuro — Midnight'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Salvar Alterações'));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.settings_rounded));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Sair'));
    await tester.pumpAndSettle();

    expect(find.text('Bem-vindo de volta'), findsOneWidget);
  });

  testWidgets('Room message resolves nested user displayName and opens profile', (
    tester,
  ) async {
    final parsed = ChatMessage.fromJson(
      {
        'id': 'm99',
        'user_id': 'u9',
        'content': 'Olá pessoal!',
        'user': {
          'id': 'u9',
          'displayName': 'Carlos Eduardo',
          'profilePhoto': 'https://example.com/carlos.png',
        },
      },
      currentUserId: 'u1',
    );
    expect(parsed.senderName, 'Carlos Eduardo');
    expect(parsed.senderAvatarUrl, 'https://example.com/carlos.png');
    expect(parsed.isSent, isFalse);

    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        chatClient: _FakeChatClient(),
        realtimeClient: NoopRealtimeClient(),
        sessionStorage: MemorySessionStorage(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).at(0), 'lucas@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'SenhaForte#2026');
    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Salas').first);
    await tester.pumpAndSettle();

    await tester.tap(find.text('Ana Beatriz').first);
    await tester.pumpAndSettle();
    expect(find.text('Enviar Direct'), findsOneWidget);
  });

  testWidgets('Create room, toggle favorite, and persist profile updates', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    final storage = MemorySessionStorage();
    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        chatClient: _FakeChatClient(),
        realtimeClient: NoopRealtimeClient(),
        sessionStorage: storage,
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).at(0), 'lucas@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'SenhaForte#2026');
    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    await tester.tap(find.byIcon(Icons.group_add_outlined));
    await tester.pumpAndSettle();
    expect(find.text('Criar nova sala'), findsOneWidget);

    await tester.enterText(
      find.widgetWithText(TextField, 'Ex.: Design & Aero'),
      'Aero Lab',
    );
    await tester.tap(find.text('Criar sala'));
    await tester.pumpAndSettle();
    expect(find.text('# Aero Lab'), findsWidgets);

    await tester.tap(find.byIcon(Icons.star_border_rounded));
    await tester.pumpAndSettle();
    expect(find.byIcon(Icons.star_rounded), findsWidgets);

    await tester.tap(find.byIcon(Icons.settings_rounded));
    await tester.pumpAndSettle();
    await tester.enterText(find.widgetWithText(TextField, 'Lucas Ramos'), 'Lucas Dev');
    await tester.tap(find.text('Salvar Alterações'));
    await tester.pumpAndSettle();

    final saved = await storage.load();
    expect(saved.user?.name, 'Lucas Dev');
  });

  testWidgets('Message history formats date/month dividers and loads older messages', (
    tester,
  ) async {
    final refNow = DateTime(2026, 11, 15, 19, 30);
    expect(formatMessageDateDivider(DateTime(2026, 11, 15, 10, 0), now: refNow), 'Hoje');
    expect(formatMessageDateDivider(DateTime(2026, 11, 14, 18, 0), now: refNow), 'Ontem');
    expect(formatMessageDateDivider(DateTime(2026, 10, 15, 9, 15), now: refNow), '15 de outubro');
    expect(formatMessageDateDivider(DateTime(2024, 10, 15, 9, 15), now: refNow), '15 de outubro de 2024');
    expect(formatConversationRosterTimestamp(DateTime(2026, 11, 15, 17, 29), '17:29', now: refNow), '17:29');
    expect(formatConversationRosterTimestamp(DateTime(2026, 11, 14, 15, 4), '15:04', now: refNow), 'Ontem');
    expect(formatConversationRosterTimestamp(DateTime(2026, 10, 15, 13, 23), '13:23', now: refNow), '15/10');
    expect(formatConversationRosterTimestamp(DateTime(2024, 10, 15, 13, 23), '13:23', now: refNow), '15/10/24');
    final directWithOldDate = ChatConversation.fromDirectJson({
      'id': 'd-old',
      'name': 'wssi',
      'time': '13:23',
      'lastMessageAt': '2025-10-15T16:23:00.000Z',
    });
    expect(directWithOldDate.timestamp.contains('/'), isTrue);
    final startedWithoutDate = ChatConversation.fromDirectJson({
      'id': 'd-started',
      'name': 'ArturRodent',
      'lastMessage': 'Conversa iniciada',
      'time': '15:04',
    });
    expect(startedWithoutDate.timestamp, '');
    final startedWithCreatedAt = ChatConversation.fromDirectJson({
      'id': 'd-started-date',
      'name': 'ArturRodent',
      'lastMessage': 'Conversa iniciada',
      'time': '15:04',
      'createdAt': '2025-10-23T18:04:00.000Z',
    });
    expect(startedWithCreatedAt.timestamp.contains('/'), isTrue);

    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        chatClient: _FakeChatClient(),
        realtimeClient: NoopRealtimeClient(),
        sessionStorage: MemorySessionStorage(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).at(0), 'lucas@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'SenhaForte#2026');
    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    expect(find.text('Carregar mensagens anteriores'), findsOneWidget);
    await tester.tap(find.text('Carregar mensagens anteriores'));
    await tester.pumpAndSettle();

    expect(find.text('Mensagem antiga do histórico!'), findsOneWidget);
    expect(find.text('09:15'), findsOneWidget);
    expect(find.text('15 de outubro'), findsOneWidget);
    expect(find.text('📌 Início do histórico da conversa alcançado'), findsOneWidget);
  });

  testWidgets('Image message parsing and room message deletion work cleanly', (
    tester,
  ) async {
    final imgMsg = ChatMessage.fromJson(
      {
        'id': 'm-img',
        'user_id': 'u2',
        'content': 'Olha essa foto',
        'image_url':
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWrcAAAAASUVORK5CYII=',
      },
      currentUserId: 'u1',
    );
    expect(imgMsg.imageUrl, isNotNull);

    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        chatClient: _FakeChatClient(),
        realtimeClient: NoopRealtimeClient(),
        sessionStorage: MemorySessionStorage(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).at(0), 'lucas@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'SenhaForte#2026');
    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    await tester.tap(find.text('Salas').first);
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).last, 'Mensagem para apagar');
    await tester.tap(find.text('Enviar'));
    await tester.pumpAndSettle();
    expect(find.text('Mensagem para apagar'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.delete_outline_rounded).last);
    await tester.pumpAndSettle();
    expect(find.text('Excluir mensagem'), findsOneWidget);

    await tester.tap(find.text('Excluir'));
    await tester.pumpAndSettle();
    expect(find.text('Mensagem para apagar'), findsNothing);
  });

  testWidgets('Notifications dialog and unread message badges update', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    final chatClient = _FakeChatClient();
    final realtimeClient = _ControllableRealtimeClient();

    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        chatClient: chatClient,
        realtimeClient: realtimeClient,
        sessionStorage: MemorySessionStorage(),
      ),
    );
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField).at(0), 'lucas@example.com');
    await tester.enterText(find.byType(TextField).at(1), 'SenhaForte#2026');
    await tester.tap(find.text('Entrar no SkyRipple'));
    await tester.pumpAndSettle();

    expect(find.text('1'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.notifications_rounded));
    await tester.pumpAndSettle();
    expect(find.text('Notificações'), findsOneWidget);
    expect(find.text('Nova mensagem de Marina'), findsOneWidget);

    await tester.tap(find.text('Marcar todas como lidas'));
    await tester.pumpAndSettle();
    expect(chatClient.markAllCalled, isTrue);

    await tester.tap(find.byIcon(Icons.close_rounded));
    await tester.pumpAndSettle();
    expect(find.text('1'), findsNothing);

    realtimeClient.emitMessage({
      'id': 'm-room-1',
      'roomId': 'r1',
      'senderId': 'u2',
      'senderName': 'Marina Oliveira',
      'content': 'Mensagem na sala',
      'timestamp': '15:10',
    });
    await tester.pumpAndSettle();
    expect(find.text('1'), findsWidgets);

    await tester.tap(find.text('Salas').first);
    await tester.pumpAndSettle();
    expect(find.text('1'), findsNothing);
  });
}
