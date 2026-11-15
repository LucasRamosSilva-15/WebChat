import '../theme/skyripple_theme.dart';
import '../widgets/user_avatar.dart';

class SkyRippleUser {
  const SkyRippleUser({
    required this.id,
    required this.name,
    required this.email,
    this.avatarUrl,
  });

  final String id;
  final String name;
  final String email;
  final String? avatarUrl;

  factory SkyRippleUser.fromJson(Map<String, dynamic> json) {
    return SkyRippleUser(
      id: (json['id'] ?? json['_id'] ?? '').toString(),
      name: (json['displayName'] ?? json['name'] ?? json['nome'] ?? 'Usuário')
          .toString(),
      email: (json['email'] ?? '').toString(),
      avatarUrl: (json['profilePhoto'] ?? json['avatar_url'])?.toString(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      if (avatarUrl != null) 'avatar_url': avatarUrl,
    };
  }
}

class AuthResult {
  const AuthResult({
    required this.user,
    required this.token,
  });

  final SkyRippleUser user;
  final String token;
}

class DesktopPreferences {
  const DesktopPreferences({
    this.isDark = false,
    this.accent = SkyRippleAccent.blue,
    this.presence = UserPresence.online,
    this.apiUrl = defaultApiUrl,
  });

  static const String defaultApiUrl = String.fromEnvironment(
    'API_URL',
    defaultValue: 'https://webchat-9vqr.onrender.com/api',
  );

  final bool isDark;
  final SkyRippleAccent accent;
  final UserPresence presence;
  final String apiUrl;

  DesktopPreferences copyWith({
    bool? isDark,
    SkyRippleAccent? accent,
    UserPresence? presence,
    String? apiUrl,
  }) {
    return DesktopPreferences(
      isDark: isDark ?? this.isDark,
      accent: accent ?? this.accent,
      presence: presence ?? this.presence,
      apiUrl: apiUrl ?? this.apiUrl,
    );
  }

  factory DesktopPreferences.fromJson(Map<String, dynamic> json) {
    final accentName = json['accent']?.toString();
    final presenceName = json['presence']?.toString();
    return DesktopPreferences(
      isDark: json['isDark'] == true,
      accent: SkyRippleAccent.values.firstWhere(
        (e) => e.name == accentName,
        orElse: () => SkyRippleAccent.blue,
      ),
      presence: UserPresence.values.firstWhere(
        (e) => e.name == presenceName,
        orElse: () => UserPresence.online,
      ),
      apiUrl: (json['apiUrl']?.toString().trim().isNotEmpty ?? false)
          ? json['apiUrl'].toString().trim()
          : defaultApiUrl,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'isDark': isDark,
      'accent': accent.name,
      'presence': presence.name,
      'apiUrl': apiUrl,
    };
  }
}

class StoredSession {
  const StoredSession({
    this.token,
    this.user,
    this.preferences = const DesktopPreferences(),
  });

  final String? token;
  final SkyRippleUser? user;
  final DesktopPreferences preferences;
}
