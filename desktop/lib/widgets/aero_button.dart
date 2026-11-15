import 'package:material_ui/material_ui.dart';
import '../theme/skyripple_theme.dart';

enum AeroButtonVariant {
  primary,
  secondary,
  ghost,
  danger,
}

class AeroButton extends StatefulWidget {
  const AeroButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = AeroButtonVariant.primary,
    this.leading,
    this.height = 40,
    this.padding = const EdgeInsets.symmetric(horizontal: 18),
    this.expanded = false,
  });

  final String label;
  final VoidCallback? onPressed;
  final AeroButtonVariant variant;
  final Widget? leading;
  final double height;
  final EdgeInsetsGeometry padding;
  final bool expanded;

  @override
  State<AeroButton> createState() => _AeroButtonState();
}

class _AeroButtonState extends State<AeroButton> {
  bool _hovered = false;
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    final palette = theme.palette;
    final enabled = widget.onPressed != null;

    List<Color> colors;
    Color borderColor;
    Color textColor;
    Color topHighlight;
    List<BoxShadow> shadows;

    switch (widget.variant) {
      case AeroButtonVariant.primary:
        colors = _pressed
            ? [palette.darker, palette.dark]
            : _hovered
                ? [
                    palette.hoverLight,
                    palette.hoverMain,
                    palette.hoverDark,
                    palette.hoverDarker,
                  ]
                : [
                    palette.light,
                    palette.main,
                    palette.dark,
                    palette.darker,
                  ];
        borderColor = palette.darker;
        textColor = Colors.white;
        topHighlight = const Color(0x66FFFFFF);
        shadows = [
          BoxShadow(
            color: palette.main.withValues(alpha: _hovered ? 0.35 : 0.22),
            blurRadius: _hovered ? 10 : 5,
            offset: const Offset(0, 2),
          ),
        ];
        break;
      case AeroButtonVariant.secondary:
        if (theme.isDark) {
          colors = _pressed
              ? [const Color(0xFF0F172A), const Color(0xFF1E293B)]
              : _hovered
                  ? [
                      const Color(0xFF334155),
                      const Color(0xFF283548),
                      const Color(0xFF1E293B),
                      const Color(0xFF172030),
                    ]
                  : [
                      const Color(0xFF283548),
                      const Color(0xFF1E293B),
                      const Color(0xFF172030),
                      const Color(0xFF0F172A),
                    ];
          borderColor = const Color(0xFF334155);
          textColor = theme.textPrimary;
          topHighlight = const Color(0x1FFFFFFF);
        } else {
          colors = _pressed
              ? [const Color(0xFFE2E8F0), const Color(0xFFF1F5F9)]
              : _hovered
                  ? [
                      const Color(0xFFFFFFFF),
                      const Color(0xFFF8FAFC),
                      const Color(0xFFEFF3F8),
                      const Color(0xFFE2E8F0),
                    ]
                  : [
                      const Color(0xFFFFFFFF),
                      const Color(0xFFF1F5F9),
                      const Color(0xFFE5EAF0),
                      const Color(0xFFDCE3EC),
                    ];
          borderColor = const Color(0xFFCBD5E1);
          textColor = theme.textPrimary;
          topHighlight = const Color(0xFFFFFFFF);
        }
        shadows = [
          BoxShadow(
            color: Colors.black.withValues(alpha: theme.isDark ? 0.25 : 0.06),
            blurRadius: 4,
            offset: const Offset(0, 1),
          ),
        ];
        break;
      case AeroButtonVariant.ghost:
        final bg = _hovered
            ? (theme.isDark
                ? const Color(0x1AFFFFFF)
                : const Color(0x140F172A))
            : Colors.transparent;
        colors = [bg, bg];
        borderColor = _hovered ? theme.borderSubtle : Colors.transparent;
        textColor = theme.textSecondary;
        topHighlight = Colors.transparent;
        shadows = const [];
        break;
      case AeroButtonVariant.danger:
        colors = _pressed
            ? [const Color(0xFFBE123C), const Color(0xFFE11D48)]
            : _hovered
                ? [
                    const Color(0xFFFDA4AF),
                    const Color(0xFFFB7185),
                    const Color(0xFFF43F5E),
                    const Color(0xFFE11D48),
                  ]
                : [
                    const Color(0xFFFB7185),
                    const Color(0xFFF43F5E),
                    const Color(0xFFE11D48),
                    const Color(0xFFBE123C),
                  ];
        borderColor = const Color(0xFFBE123C);
        textColor = Colors.white;
        topHighlight = const Color(0x55FFFFFF);
        shadows = [
          BoxShadow(
            color: const Color(0xFFF43F5E).withValues(alpha: 0.28),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ];
        break;
    }

    final stops = colors.length == 4 ? const [0.0, 0.50, 0.51, 1.0] : null;

    final button = MouseRegion(
      cursor: enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() {
        _hovered = false;
        _pressed = false;
      }),
      child: GestureDetector(
        onTapDown: enabled ? (_) => setState(() => _pressed = true) : null,
        onTapUp: enabled ? (_) => setState(() => _pressed = false) : null,
        onTapCancel: () => setState(() => _pressed = false),
        onTap: widget.onPressed,
        child: AnimatedOpacity(
          duration: const Duration(milliseconds: 120),
          opacity: enabled ? 1.0 : 0.5,
          child: Container(
            height: widget.height,
            padding: widget.padding,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: colors,
                stops: stops,
              ),
              border: Border.all(color: borderColor, width: 1),
              boxShadow: shadows,
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                if (topHighlight != Colors.transparent)
                  Positioned(
                    top: 0,
                    left: 4,
                    right: 4,
                    height: 1,
                    child: ColoredBox(color: topHighlight),
                  ),
                Row(
                  mainAxisSize:
                      widget.expanded ? MainAxisSize.max : MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    if (widget.leading != null) ...[
                      widget.leading!,
                      const SizedBox(width: 8),
                    ],
                    Flexible(
                      child: Text(
                        widget.label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: textColor,
                          fontSize: 13.5,
                          fontWeight: FontWeight.w600,
                          letterSpacing: -0.1,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );

    if (widget.expanded) {
      return SizedBox(width: double.infinity, child: button);
    }
    return button;
  }
}
