import 'package:material_ui/material_ui.dart';
import '../theme/skyripple_theme.dart';
import 'user_avatar.dart';

class RosterItem extends StatefulWidget {
  const RosterItem({
    super.key,
    required this.title,
    required this.preview,
    required this.timestamp,
    required this.onTap,
    this.presence,
    this.isRoom = false,
    this.isE2ee = false,
    this.unreadCount = 0,
    this.selected = false,
  });

  final String title;
  final String preview;
  final String timestamp;
  final VoidCallback onTap;
  final UserPresence? presence;
  final bool isRoom;
  final bool isE2ee;
  final int unreadCount;
  final bool selected;

  @override
  State<RosterItem> createState() => _RosterItemState();
}

class _RosterItemState extends State<RosterItem> {
  bool _hovered = false;

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    final palette = theme.palette;

    final Color bg;
    final Color border;
    if (widget.selected) {
      bg = theme.isDark
          ? palette.main.withValues(alpha: 0.22)
          : palette.main.withValues(alpha: 0.10);
      border = palette.main.withValues(alpha: 0.55);
    } else if (_hovered) {
      bg = theme.isDark
          ? const Color(0x0FFFFFFF)
          : const Color(0x0A0F172A);
      border = theme.borderSubtle;
    } else {
      bg = Colors.transparent;
      border = Colors.transparent;
    }

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      onEnter: (_) => setState(() => _hovered = true),
      onExit: (_) => setState(() => _hovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 120),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: border, width: 1),
          ),
          child: Row(
            children: [
              UserAvatar(
                label: widget.title,
                size: 40,
                presence: widget.isRoom ? null : widget.presence,
                isRoom: widget.isRoom,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Row(
                            children: [
                              Flexible(
                                child: Text(
                                  widget.title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    color: theme.textPrimary,
                                    fontSize: 13.5,
                                    fontWeight: widget.selected ||
                                            widget.unreadCount > 0
                                        ? FontWeight.w700
                                        : FontWeight.w600,
                                  ),
                                ),
                              ),
                              if (widget.isE2ee) ...[
                                const SizedBox(width: 5),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 5,
                                    vertical: 1.5,
                                  ),
                                  decoration: BoxDecoration(
                                    color: theme.onlineGreen
                                        .withValues(alpha: 0.14),
                                    borderRadius: BorderRadius.circular(5),
                                  ),
                                  child: Text(
                                    'E2EE',
                                    style: TextStyle(
                                      color: theme.onlineGreen,
                                      fontSize: 9.5,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          widget.timestamp,
                          style: TextStyle(
                            color: widget.unreadCount > 0
                                ? palette.main
                                : theme.textMuted,
                            fontSize: 11,
                            fontWeight: widget.unreadCount > 0
                                ? FontWeight.w600
                                : FontWeight.w400,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            widget.preview,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: widget.unreadCount > 0
                                  ? theme.textSecondary
                                  : theme.textMuted,
                              fontSize: 12,
                              fontWeight: widget.unreadCount > 0
                                  ? FontWeight.w500
                                  : FontWeight.w400,
                            ),
                          ),
                        ),
                        if (widget.unreadCount > 0) ...[
                          const SizedBox(width: 6),
                          Container(
                            constraints: const BoxConstraints(minWidth: 19),
                            height: 19,
                            padding: const EdgeInsets.symmetric(horizontal: 5),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                begin: Alignment.topCenter,
                                end: Alignment.bottomCenter,
                                colors: [palette.light, palette.main],
                              ),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            alignment: Alignment.center,
                            child: Text(
                              '${widget.unreadCount}',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10.5,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
