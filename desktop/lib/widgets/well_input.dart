import 'package:material_ui/material_ui.dart';
import '../theme/skyripple_theme.dart';

class WellInput extends StatefulWidget {
  const WellInput({
    super.key,
    this.controller,
    this.hintText,
    this.leadingIcon,
    this.trailing,
    this.obscureText = false,
    this.enableObscureToggle = false,
    this.onChanged,
    this.onSubmitted,
    this.height = 42,
    this.borderRadius = 11,
  });

  final TextEditingController? controller;
  final String? hintText;
  final IconData? leadingIcon;
  final Widget? trailing;
  final bool obscureText;
  final bool enableObscureToggle;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final double height;
  final double borderRadius;

  @override
  State<WellInput> createState() => _WellInputState();
}

class _WellInputState extends State<WellInput> {
  final FocusNode _focusNode = FocusNode();
  bool _focused = false;
  late bool _obscured;

  @override
  void initState() {
    super.initState();
    _obscured = widget.obscureText;
    _focusNode.addListener(_handleFocusChange);
  }

  @override
  void didUpdateWidget(covariant WellInput oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.obscureText != widget.obscureText) {
      _obscured = widget.obscureText;
    }
  }

  void _handleFocusChange() {
    if (mounted) {
      setState(() => _focused = _focusNode.hasFocus);
    }
  }

  @override
  void dispose() {
    _focusNode.removeListener(_handleFocusChange);
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    final palette = theme.palette;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 140),
      height: widget.height,
      padding: const EdgeInsets.symmetric(horizontal: 12),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(widget.borderRadius),
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [theme.wellTop, theme.wellBottom],
        ),
        border: Border.all(
          color: _focused ? palette.main : theme.wellBorder,
          width: _focused ? 1.4 : 1.0,
        ),
        boxShadow: _focused
            ? [
                BoxShadow(
                  color: palette.ringFocus.withValues(alpha: 0.25),
                  blurRadius: 0,
                  spreadRadius: 2.5,
                ),
              ]
            : [
                BoxShadow(
                  color: Colors.black.withValues(
                    alpha: theme.isDark ? 0.24 : 0.04,
                  ),
                  blurRadius: 2,
                  offset: const Offset(0, 1),
                ),
              ],
      ),
      child: Row(
        children: [
          if (widget.leadingIcon != null) ...[
            Icon(
              widget.leadingIcon,
              size: 16,
              color: _focused ? palette.main : theme.textMuted,
            ),
            const SizedBox(width: 9),
          ],
          Expanded(
            child: TextField(
              controller: widget.controller,
              focusNode: _focusNode,
              obscureText: widget.enableObscureToggle
                  ? _obscured
                  : widget.obscureText,
              onChanged: widget.onChanged,
              onSubmitted: widget.onSubmitted,
              style: TextStyle(
                color: theme.textPrimary,
                fontSize: 13.5,
              ),
              decoration: InputDecoration(
                isDense: true,
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero,
                hintText: widget.hintText,
                hintStyle: TextStyle(
                  color: theme.textMuted,
                  fontSize: 13.5,
                ),
              ),
            ),
          ),
          if (widget.enableObscureToggle && widget.obscureText) ...[
            const SizedBox(width: 6),
            MouseRegion(
              cursor: SystemMouseCursors.click,
              child: GestureDetector(
                onTap: () => setState(() => _obscured = !_obscured),
                child: Padding(
                  padding: const EdgeInsets.all(4),
                  child: Icon(
                    _obscured
                        ? Icons.visibility_outlined
                        : Icons.visibility_off_outlined,
                    size: 17,
                    color: theme.textMuted,
                  ),
                ),
              ),
            ),
          ] else if (widget.trailing != null) ...[
            const SizedBox(width: 8),
            widget.trailing!,
          ],
        ],
      ),
    );
  }
}
