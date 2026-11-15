import 'package:flutter_test/flutter_test.dart';
import 'package:material_ui/material_ui.dart';
import 'package:skyripple_desktop/main.dart';
import 'package:skyripple_desktop/models/user_session.dart';
import 'package:skyripple_desktop/services/auth_service.dart';
import 'package:skyripple_desktop/services/session_store.dart';

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

void main() {
  testWidgets('Auth screen logs in via API and transitions to desktop shell', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    final storage = MemorySessionStorage();
    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
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

  testWidgets('Server dialog opens and saves URL without errors', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 800);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);

    final storage = MemorySessionStorage();
    await tester.pumpWidget(
      SkyRippleApp(
        authClient: _FakeAuthClient(),
        sessionStorage: storage,
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
}
