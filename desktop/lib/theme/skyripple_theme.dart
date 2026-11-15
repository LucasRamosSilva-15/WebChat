import 'package:material_ui/material_ui.dart';

enum SkyRippleAccent {
  blue,
  green,
  purple,
  red,
  slate,
}

class AccentPalette {
  const AccentPalette({
    required this.name,
    required this.light,
    required this.main,
    required this.dark,
    required this.darker,
    required this.hoverLight,
    required this.hoverMain,
    required this.hoverDark,
    required this.hoverDarker,
    required this.ring,
    required this.ringFocus,
  });

  final String name;
  final Color light;
  final Color main;
  final Color dark;
  final Color darker;
  final Color hoverLight;
  final Color hoverMain;
  final Color hoverDark;
  final Color hoverDarker;
  final Color ring;
  final Color ringFocus;

  static AccentPalette of(SkyRippleAccent accent) {
    switch (accent) {
      case SkyRippleAccent.blue:
        return const AccentPalette(
          name: 'Blue',
          light: Color(0xFF4DA4FF),
          main: Color(0xFF0071E3),
          dark: Color(0xFF005BB5),
          darker: Color(0xFF004488),
          hoverLight: Color(0xFF66B3FF),
          hoverMain: Color(0xFF1A82FF),
          hoverDark: Color(0xFF006CE6),
          hoverDarker: Color(0xFF0055A3),
          ring: Color(0x1A0071E3),
          ringFocus: Color(0x990071E3),
        );
      case SkyRippleAccent.green:
        return const AccentPalette(
          name: 'Green',
          light: Color(0xFF34D399),
          main: Color(0xFF10B981),
          dark: Color(0xFF059669),
          darker: Color(0xFF047857),
          hoverLight: Color(0xFF6EE7B7),
          hoverMain: Color(0xFF34D399),
          hoverDark: Color(0xFF10B981),
          hoverDarker: Color(0xFF059669),
          ring: Color(0x1A10B981),
          ringFocus: Color(0x9910B981),
        );
      case SkyRippleAccent.purple:
        return const AccentPalette(
          name: 'Purple',
          light: Color(0xFFC084FC),
          main: Color(0xFFA855F7),
          dark: Color(0xFF9333EA),
          darker: Color(0xFF7E22CE),
          hoverLight: Color(0xFFD8B4FE),
          hoverMain: Color(0xFFC084FC),
          hoverDark: Color(0xFFA855F7),
          hoverDarker: Color(0xFF9333EA),
          ring: Color(0x1AA855F7),
          ringFocus: Color(0x99A855F7),
        );
      case SkyRippleAccent.red:
        return const AccentPalette(
          name: 'Red',
          light: Color(0xFFFB7185),
          main: Color(0xFFF43F5E),
          dark: Color(0xFFE11D48),
          darker: Color(0xFFBE123C),
          hoverLight: Color(0xFFFDA4AF),
          hoverMain: Color(0xFFFB7185),
          hoverDark: Color(0xFFF43F5E),
          hoverDarker: Color(0xFFE11D48),
          ring: Color(0x1AF43F5E),
          ringFocus: Color(0x99F43F5E),
        );
      case SkyRippleAccent.slate:
        return const AccentPalette(
          name: 'Slate',
          light: Color(0xFF94A3B8),
          main: Color(0xFF64748B),
          dark: Color(0xFF475569),
          darker: Color(0xFF334155),
          hoverLight: Color(0xFFCBD5E1),
          hoverMain: Color(0xFF94A3B8),
          hoverDark: Color(0xFF64748B),
          hoverDarker: Color(0xFF475569),
          ring: Color(0x1A64748B),
          ringFocus: Color(0x9964748B),
        );
    }
  }
}

class SkyRippleTheme extends ThemeExtension<SkyRippleTheme> {
  const SkyRippleTheme({
    required this.isDark,
    required this.accent,
    required this.palette,
    required this.windowBackgroundTop,
    required this.windowBackgroundBottom,
    required this.railBackground,
    required this.rosterBackground,
    required this.stageBackground,
    required this.inspectorBackground,
    required this.panelSurface,
    required this.wellTop,
    required this.wellBottom,
    required this.wellBorder,
    required this.borderSubtle,
    required this.textPrimary,
    required this.textSecondary,
    required this.textMuted,
    required this.receivedBubbleTop,
    required this.receivedBubbleBottom,
    required this.receivedBubbleBorder,
    required this.receivedBubbleHighlight,
    required this.onlineGreen,
    required this.busyRed,
    required this.awayAmber,
    required this.offlineSlate,
  });

  final bool isDark;
  final SkyRippleAccent accent;
  final AccentPalette palette;
  final Color windowBackgroundTop;
  final Color windowBackgroundBottom;
  final Color railBackground;
  final Color rosterBackground;
  final Color stageBackground;
  final Color inspectorBackground;
  final Color panelSurface;
  final Color wellTop;
  final Color wellBottom;
  final Color wellBorder;
  final Color borderSubtle;
  final Color textPrimary;
  final Color textSecondary;
  final Color textMuted;
  final Color receivedBubbleTop;
  final Color receivedBubbleBottom;
  final Color receivedBubbleBorder;
  final Color receivedBubbleHighlight;
  final Color onlineGreen;
  final Color busyRed;
  final Color awayAmber;
  final Color offlineSlate;

  static SkyRippleTheme light(SkyRippleAccent accent) {
    return SkyRippleTheme(
      isDark: false,
      accent: accent,
      palette: AccentPalette.of(accent),
      windowBackgroundTop: const Color(0xFFDBEAFE),
      windowBackgroundBottom: const Color(0xFFF1F5F9),
      railBackground: const Color(0xFFF1F5F9),
      rosterBackground: const Color(0xFFF8FAFC),
      stageBackground: const Color(0xFFFFFFFF),
      inspectorBackground: const Color(0xFFF8FAFC),
      panelSurface: const Color(0xFFFFFFFF),
      wellTop: const Color(0xFFEFF3F8),
      wellBottom: const Color(0xFFFFFFFF),
      wellBorder: const Color(0xFFCBD5E1),
      borderSubtle: const Color(0xFFE2E8F0),
      textPrimary: const Color(0xFF1D1D1F),
      textSecondary: const Color(0xFF475569),
      textMuted: const Color(0xFF64748B),
      receivedBubbleTop: const Color(0xFFF9F9F9),
      receivedBubbleBottom: const Color(0xFFEBEBEB),
      receivedBubbleBorder: const Color(0xFFCCCCCC),
      receivedBubbleHighlight: const Color(0xFFFFFFFF),
      onlineGreen: const Color(0xFF10B981),
      busyRed: const Color(0xFFEF4444),
      awayAmber: const Color(0xFFF59E0B),
      offlineSlate: const Color(0xFF94A3B8),
    );
  }

  static SkyRippleTheme dark(SkyRippleAccent accent) {
    return SkyRippleTheme(
      isDark: true,
      accent: accent,
      palette: AccentPalette.of(accent),
      windowBackgroundTop: const Color(0xFF111827),
      windowBackgroundBottom: const Color(0xFF0F172A),
      railBackground: const Color(0xFF0B1120),
      rosterBackground: const Color(0xFF0F172A),
      stageBackground: const Color(0xFF111827),
      inspectorBackground: const Color(0xFF0F172A),
      panelSurface: const Color(0xFF1E293B),
      wellTop: const Color(0xFF0B1120),
      wellBottom: const Color(0xFF1E293B),
      wellBorder: const Color(0xFF334155),
      borderSubtle: const Color(0xFF1E293B),
      textPrimary: const Color(0xFFF8FAFC),
      textSecondary: const Color(0xFFCBD5E1),
      textMuted: const Color(0xFF94A3B8),
      receivedBubbleTop: const Color(0xFF334155),
      receivedBubbleBottom: const Color(0xFF1E293B),
      receivedBubbleBorder: const Color(0xFF0F172A),
      receivedBubbleHighlight: const Color(0x14FFFFFF),
      onlineGreen: const Color(0xFF34D399),
      busyRed: const Color(0xFFF87171),
      awayAmber: const Color(0xFFFBBF24),
      offlineSlate: const Color(0xFF64748B),
    );
  }

  static SkyRippleTheme of(BuildContext context) {
    return Theme.of(context).extension<SkyRippleTheme>() ??
        light(SkyRippleAccent.blue);
  }

  static ThemeData buildThemeData({
    required bool isDark,
    required SkyRippleAccent accent,
  }) {
    final extension = isDark ? dark(accent) : light(accent);
    final base = isDark ? ThemeData.dark() : ThemeData.light();
    return base.copyWith(
      scaffoldBackgroundColor: extension.stageBackground,
      colorScheme: (isDark ? const ColorScheme.dark() : const ColorScheme.light())
          .copyWith(
        primary: extension.palette.main,
        secondary: extension.palette.light,
        surface: extension.panelSurface,
      ),
      textTheme: base.textTheme.apply(
        bodyColor: extension.textPrimary,
        displayColor: extension.textPrimary,
      ),
      extensions: [extension],
    );
  }

  @override
  SkyRippleTheme copyWith({
    bool? isDark,
    SkyRippleAccent? accent,
    AccentPalette? palette,
    Color? windowBackgroundTop,
    Color? windowBackgroundBottom,
    Color? railBackground,
    Color? rosterBackground,
    Color? stageBackground,
    Color? inspectorBackground,
    Color? panelSurface,
    Color? wellTop,
    Color? wellBottom,
    Color? wellBorder,
    Color? borderSubtle,
    Color? textPrimary,
    Color? textSecondary,
    Color? textMuted,
    Color? receivedBubbleTop,
    Color? receivedBubbleBottom,
    Color? receivedBubbleBorder,
    Color? receivedBubbleHighlight,
    Color? onlineGreen,
    Color? busyRed,
    Color? awayAmber,
    Color? offlineSlate,
  }) {
    return SkyRippleTheme(
      isDark: isDark ?? this.isDark,
      accent: accent ?? this.accent,
      palette: palette ?? this.palette,
      windowBackgroundTop: windowBackgroundTop ?? this.windowBackgroundTop,
      windowBackgroundBottom:
          windowBackgroundBottom ?? this.windowBackgroundBottom,
      railBackground: railBackground ?? this.railBackground,
      rosterBackground: rosterBackground ?? this.rosterBackground,
      stageBackground: stageBackground ?? this.stageBackground,
      inspectorBackground: inspectorBackground ?? this.inspectorBackground,
      panelSurface: panelSurface ?? this.panelSurface,
      wellTop: wellTop ?? this.wellTop,
      wellBottom: wellBottom ?? this.wellBottom,
      wellBorder: wellBorder ?? this.wellBorder,
      borderSubtle: borderSubtle ?? this.borderSubtle,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      textMuted: textMuted ?? this.textMuted,
      receivedBubbleTop: receivedBubbleTop ?? this.receivedBubbleTop,
      receivedBubbleBottom: receivedBubbleBottom ?? this.receivedBubbleBottom,
      receivedBubbleBorder: receivedBubbleBorder ?? this.receivedBubbleBorder,
      receivedBubbleHighlight:
          receivedBubbleHighlight ?? this.receivedBubbleHighlight,
      onlineGreen: onlineGreen ?? this.onlineGreen,
      busyRed: busyRed ?? this.busyRed,
      awayAmber: awayAmber ?? this.awayAmber,
      offlineSlate: offlineSlate ?? this.offlineSlate,
    );
  }

  @override
  SkyRippleTheme lerp(covariant ThemeExtension<SkyRippleTheme>? other, double t) {
    if (other is! SkyRippleTheme) {
      return this;
    }
    return t < 0.5 ? this : other;
  }
}
