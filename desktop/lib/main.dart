import 'package:material_ui/material_ui.dart';
import 'screens/auth_screen.dart';
import 'screens/main_shell_screen.dart';
import 'theme/skyripple_theme.dart';

void main() {
  runApp(const SkyRippleApp());
}

class SkyRippleApp extends StatefulWidget {
  const SkyRippleApp({super.key});

  @override
  State<SkyRippleApp> createState() => _SkyRippleAppState();
}

class _SkyRippleAppState extends State<SkyRippleApp> {
  bool _isDark = false;
  SkyRippleAccent _accent = SkyRippleAccent.blue;
  bool _authenticated = false;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SkyRipple Desktop',
      debugShowCheckedModeBanner: false,
      theme: SkyRippleTheme.buildThemeData(
        isDark: _isDark,
        accent: _accent,
      ),
      home: _authenticated
          ? MainShellScreen(
              isDark: _isDark,
              accent: _accent,
              onThemeChanged: (value) => setState(() => _isDark = value),
              onAccentChanged: (value) => setState(() => _accent = value),
              onSignOut: () => setState(() => _authenticated = false),
            )
          : AuthScreen(
              onAuthenticated: () => setState(() => _authenticated = true),
              onToggleTheme: () => setState(() => _isDark = !_isDark),
            ),
    );
  }
}
