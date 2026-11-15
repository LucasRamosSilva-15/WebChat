import 'package:material_ui/material_ui.dart';
import 'models/user_session.dart';
import 'screens/auth_screen.dart';
import 'screens/main_shell_screen.dart';
import 'services/auth_service.dart';
import 'services/chat_service.dart';
import 'services/realtime_service.dart';
import 'services/session_store.dart';
import 'theme/skyripple_theme.dart';
import 'widgets/user_avatar.dart';

void main() {
  runApp(const SkyRippleApp());
}

class SkyRippleApp extends StatefulWidget {
  const SkyRippleApp({
    super.key,
    this.authClient,
    this.chatClient,
    this.realtimeClient,
    this.sessionStorage,
  });

  final AuthApiClient? authClient;
  final ChatApiClient? chatClient;
  final RealtimeClient? realtimeClient;
  final SessionStorage? sessionStorage;

  @override
  State<SkyRippleApp> createState() => _SkyRippleAppState();
}

class _SkyRippleAppState extends State<SkyRippleApp> {
  late final AuthApiClient _authClient;
  late final ChatApiClient _chatClient;
  late final RealtimeClient _realtimeClient;
  late final SessionStorage _storage;
  DesktopPreferences _preferences = const DesktopPreferences();
  SkyRippleUser? _user;
  String _token = '';
  bool _restoring = true;

  @override
  void initState() {
    super.initState();
    _authClient = widget.authClient ?? HttpAuthApiClient();
    _chatClient = widget.chatClient ?? HttpChatApiClient();
    _realtimeClient = widget.realtimeClient ?? SocketIoRealtimeClient();
    _storage = widget.sessionStorage ?? FileSessionStorage();
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    final stored = await _storage.load();
    var validUser = stored.user;
    var validToken = stored.token ?? '';
    if (validToken.isNotEmpty) {
      try {
        validUser = await _authClient.fetchMe(
          apiUrl: stored.preferences.apiUrl,
          token: validToken,
        );
        await _storage.saveSession(token: validToken, user: validUser);
      } on AuthApiException catch (err) {
        if (err.statusCode == 401 || err.statusCode == 403) {
          validUser = null;
          validToken = '';
          await _storage.clearAuth();
        }
      }
    } else {
      validUser = null;
    }

    if (!mounted) {
      return;
    }
    setState(() {
      _preferences = stored.preferences;
      _user = validUser;
      _token = validToken;
      _restoring = false;
    });
  }

  Future<void> _updatePreferences(DesktopPreferences next) async {
    setState(() => _preferences = next);
    await _storage.savePreferences(next);
  }

  Future<void> _handleAuthenticated(AuthResult result, bool keepSession) async {
    if (keepSession) {
      await _storage.saveSession(token: result.token, user: result.user);
    } else {
      await _storage.clearAuth();
    }
    if (!mounted) {
      return;
    }
    setState(() {
      _user = result.user;
      _token = result.token;
    });
  }

  Future<void> _handleSignOut() async {
    _realtimeClient.dispose();
    await _storage.clearAuth();
    if (!mounted) {
      return;
    }
    setState(() {
      _user = null;
      _token = '';
    });
  }

  @override
  Widget build(BuildContext context) {
    final themeData = SkyRippleTheme.buildThemeData(
      isDark: _preferences.isDark,
      accent: _preferences.accent,
    );
    final theme = themeData.extension<SkyRippleTheme>()!;

    return MaterialApp(
      title: 'SkyRipple Desktop',
      debugShowCheckedModeBanner: false,
      theme: themeData,
      home: _restoring
          ? Scaffold(
              backgroundColor: theme.stageBackground,
              body: Center(
                child: CircularProgressIndicator(color: theme.palette.main),
              ),
            )
          : (_user != null
              ? MainShellScreen(
                  user: _user!,
                  token: _token,
                  apiUrl: _preferences.apiUrl,
                  chatClient: _chatClient,
                  realtimeClient: _realtimeClient,
                  isDark: _preferences.isDark,
                  accent: _preferences.accent,
                  initialPresence: _preferences.presence,
                  onThemeChanged: (value) => _updatePreferences(
                    _preferences.copyWith(isDark: value),
                  ),
                  onAccentChanged: (value) => _updatePreferences(
                    _preferences.copyWith(accent: value),
                  ),
                  onPresenceChanged: (UserPresence value) => _updatePreferences(
                    _preferences.copyWith(presence: value),
                  ),
                  onSignOut: _handleSignOut,
                )
              : AuthScreen(
                  authClient: _authClient,
                  apiUrl: _preferences.apiUrl,
                  onApiUrlChanged: (url) => _updatePreferences(
                    _preferences.copyWith(apiUrl: url),
                  ),
                  onAuthenticated: _handleAuthenticated,
                  onToggleTheme: () => _updatePreferences(
                    _preferences.copyWith(isDark: !_preferences.isDark),
                  ),
                )),
    );
  }
}
