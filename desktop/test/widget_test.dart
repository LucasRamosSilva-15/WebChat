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
  }) async {
    return ChatMessage(
      id: 'm2',
      senderId: currentUserId,
      senderName: 'Você',
      text: content,
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
  }) async {
    return ChatMessage(
      id: 'rm2',
      senderId: currentUserId,
      senderName: 'Você',
      text: content,
      timestamp: 'Agora',
      isSent: true,
    );
  }
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
}
