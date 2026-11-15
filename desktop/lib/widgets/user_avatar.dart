import 'package:material_ui/material_ui.dart';
import '../theme/skyripple_theme.dart';

enum UserPresence {
  online,
  busy,
  away,
  offline,
}

class UserAvatar extends StatelessWidget {
  const UserAvatar({
    super.key,
    required this.label,
    this.avatarUrl,
    this.size = 40,
    this.presence,
    this.isRoom = false,
    this.ringColor,
    this.onTap,
  });

  final String label;
  final String? avatarUrl;
  final double size;
  final UserPresence? presence;
  final bool isRoom;
  final Color? ringColor;
  final VoidCallback? onTap;

  Color _presenceColor(SkyRippleTheme theme) {
    switch (presence) {
      case UserPresence.online:
        return theme.onlineGreen;
      case UserPresence.busy:
        return theme.busyRed;
      case UserPresence.away:
        return theme.awayAmber;
      case UserPresence.offline:
      case null:
        return theme.offlineSlate;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    final palette = theme.palette;
    final ledSize = (size * 0.28).clamp(8.0, 14.0);
    final displayChar =
        isRoom ? '#' : (label.isNotEmpty ? label.trim()[0].toUpperCase() : '?');

    final hasPhoto = !isRoom &&
        avatarUrl != null &&
        avatarUrl!.trim().isNotEmpty &&
        (avatarUrl!.startsWith('http://') || avatarUrl!.startsWith('https://'));

    final fallbackContent = Stack(
      children: [
        Positioned(
          top: 2,
          left: size * 0.18,
          right: size * 0.18,
          height: size * 0.32,
          child: DecoratedBox(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(size),
              gradient: const LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Color(0x66FFFFFF),
                  Color(0x00FFFFFF),
                ],
              ),
            ),
          ),
        ),
        Center(
          child: Text(
            displayChar,
            style: TextStyle(
              color: Colors.white,
              fontSize: size * 0.40,
              fontWeight: FontWeight.w700,
              height: 1,
            ),
          ),
        ),
      ],
    );

    final avatar = SizedBox(
      width: size,
      height: size,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            width: size,
            height: size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  palette.light,
                  palette.main,
                ],
              ),
              border: Border.all(
                color: ringColor ??
                    (theme.isDark
                        ? const Color(0x33FFFFFF)
                        : const Color(0xCCFFFFFF)),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: palette.main.withValues(alpha: 0.28),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: hasPhoto
                ? ClipOval(
                    child: Image.network(
                      avatarUrl!.trim(),
                      width: size,
                      height: size,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => fallbackContent,
                    ),
                  )
                : fallbackContent,
          ),
          if (presence != null)
            Positioned(
              right: -1,
              bottom: -1,
              child: Container(
                width: ledSize,
                height: ledSize,
                decoration: BoxDecoration(
                  color: _presenceColor(theme),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: theme.panelSurface,
                    width: 2,
                  ),
                ),
              ),
            ),
        ],
      ),
    );

    if (onTap == null) {
      return avatar;
    }

    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onTap,
        child: avatar,
      ),
    );
  }
}
