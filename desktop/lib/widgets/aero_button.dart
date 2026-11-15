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
        } else {
          colors = _pressed
              ? [const Color(0xFFE2E8F0), const Color(0xFFF1F5F9)]
              : [
                  const Color(0xFFFFFFFF),
                  const Color(0xFFF8FAFC),
                  const Color(0xFFF1F5F9),
                  const Color(0xFFE2E8F0),
                ];
          borderColor = const Color(0xFFCBD5E1);
          textColor = theme.textPrimary;
        }
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
        break;
    }

    final stops = colors.length == 4 ? const [0.0, 0.50, 0.51, 1.0] : null;
    final radius = BorderRadius.circular(12);

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
          child: ClipRRect(
            borderRadius: radius,
            child: Container(
              height: widget.height,
              padding: widget.padding,
              decoration: BoxDecoration(
                borderRadius: radius,
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: colors,
                  stops: stops,
                ),
                border: Border.all(color: borderColor, width: 1),
              ),
              child: Row(
                mainAxisSize:
                    widget.expanded ? MainAxisSize.max : MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (widget.leading != null) ...[
                    widget.leading!,
                    const SizedBox(width: 10),
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
