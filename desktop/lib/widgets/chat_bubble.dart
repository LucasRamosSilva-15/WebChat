import 'dart:convert';
import 'dart:typed_data';
import 'package:material_ui/material_ui.dart';
import '../theme/skyripple_theme.dart';

enum ChatBubbleKind {
  text,
  image,
  audio,
  attachment,
}

Uint8List? decodeDataUrlBytes(String? raw) {
  if (raw == null || !raw.startsWith('data:')) return null;
  final comma = raw.indexOf(',');
  if (comma < 0 || comma >= raw.length - 1) return null;
  try {
    return base64Decode(raw.substring(comma + 1));
  } catch (_) {
    return null;
  }
}

class ChatBubble extends StatelessWidget {
  const ChatBubble({
    super.key,
    required this.isSent,
    this.kind = ChatBubbleKind.text,
    this.text = '',
    this.imageUrl,
    this.audioDuration = '0:24 • 1x',
    this.fileName = 'Apresentação.pdf',
    this.fileSize = '1.8 MB',
    this.onActionTap,
    this.onImageTap,
  });

  final bool isSent;
  final ChatBubbleKind kind;
  final String text;
  final String? imageUrl;
  final String audioDuration;
  final String fileName;
  final String fileSize;
  final VoidCallback? onActionTap;
  final VoidCallback? onImageTap;

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    final palette = theme.palette;

    final List<Color> gradientColors;
    final Color borderColor;
    final Color highlightColor;
    final Color textColor;

    if (isSent) {
      if (theme.isDark) {
        gradientColors = [
          Color.lerp(palette.main, Colors.black, 0.10)!,
          Color.lerp(palette.main, Colors.black, 0.40)!,
        ];
        borderColor = const Color(0x29FFFFFF);
        highlightColor = const Color(0x1AFFFFFF);
        textColor = const Color(0xFFF8FAFC);
      } else {
        gradientColors = [palette.hoverLight, palette.main];
        borderColor = palette.dark;
        highlightColor = const Color(0x66FFFFFF);
        textColor = Colors.white;
      }
    } else {
      gradientColors = [theme.receivedBubbleTop, theme.receivedBubbleBottom];
      borderColor = theme.receivedBubbleBorder;
      highlightColor = theme.receivedBubbleHighlight;
      textColor = theme.textPrimary;
    }

    final radius = BorderRadius.only(
      topLeft: const Radius.circular(18),
      topRight: const Radius.circular(18),
      bottomLeft: Radius.circular(isSent ? 18 : 2),
      bottomRight: Radius.circular(isSent ? 2 : 18),
    );

    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 440),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: radius,
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: gradientColors,
          ),
          border: Border.all(color: borderColor, width: 1),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: theme.isDark ? 0.30 : 0.12),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Stack(
          children: [
            Positioned(
              top: 0,
              left: 12,
              right: 12,
              height: 1,
              child: ColoredBox(color: highlightColor),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: _buildContent(theme, palette, textColor),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContent(
    SkyRippleTheme theme,
    AccentPalette palette,
    Color textColor,
  ) {
    switch (kind) {
      case ChatBubbleKind.text:
        return Text(
          text,
          style: TextStyle(
            color: textColor,
            fontSize: 13.5,
            height: 1.4,
          ),
        );
      case ChatBubbleKind.image:
        final bytes = decodeDataUrlBytes(imageUrl);
        final hasNetUrl = imageUrl != null &&
            (imageUrl!.startsWith('http://') ||
                imageUrl!.startsWith('https://'));
        Widget imgWidget;
        if (bytes != null) {
          imgWidget = Image.memory(
            bytes,
            width: 260,
            height: 190,
            fit: BoxFit.cover,
          );
        } else if (hasNetUrl) {
          imgWidget = Image.network(
            imageUrl!,
            width: 260,
            height: 190,
            fit: BoxFit.cover,
            errorBuilder: (_, _, _) => Container(
              width: 260,
              height: 120,
              color: Colors.black12,
              alignment: Alignment.center,
              child: Icon(Icons.broken_image_outlined, color: textColor),
            ),
          );
        } else {
          imgWidget = Container(
            width: 220,
            height: 110,
            color: Colors.black12,
            alignment: Alignment.center,
            child: Icon(Icons.image_outlined, color: textColor),
          );
        }
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            MouseRegion(
              cursor: onImageTap != null
                  ? SystemMouseCursors.click
                  : MouseCursor.defer,
              child: GestureDetector(
                onTap: onImageTap,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(10),
                  child: imgWidget,
                ),
              ),
            ),
            if (text.trim().isNotEmpty) ...[
              const SizedBox(height: 8),
              Text(
                text,
                style: TextStyle(
                  color: textColor,
                  fontSize: 13.5,
                  height: 1.4,
                ),
              ),
            ],
          ],
        );
      case ChatBubbleKind.audio:
        const heights = <double>[
          6,
          12,
          18,
          9,
          20,
          14,
          8,
          16,
          22,
          11,
          15,
          19,
          10,
          14,
          7,
          12,
          17,
          9,
          13,
          6,
        ];
        final activeBarColor = isSent ? Colors.white : palette.main;
        final idleBarColor = isSent
            ? Colors.white.withValues(alpha: 0.45)
            : (theme.isDark
                ? const Color(0xFF94A3B8)
                : const Color(0xFF94A3B8));
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            GestureDetector(
              onTap: onActionTap,
              child: Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isSent ? Colors.white : palette.main,
                ),
                child: Icon(
                  Icons.play_arrow_rounded,
                  size: 20,
                  color: isSent ? palette.main : Colors.white,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                for (var i = 0; i < heights.length; i++)
                  Container(
                    width: 3,
                    height: heights[i],
                    margin: const EdgeInsets.symmetric(horizontal: 1.5),
                    decoration: BoxDecoration(
                      color: i < 9 ? activeBarColor : idleBarColor,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
              ],
            ),
            const SizedBox(width: 10),
            Text(
              audioDuration,
              style: TextStyle(
                color: textColor.withValues(alpha: 0.85),
                fontSize: 11.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        );
      case ChatBubbleKind.attachment:
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [palette.light, const Color(0xFFBAE6FD)],
                ),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.55),
                ),
              ),
              child: const Icon(
                Icons.insert_drive_file_rounded,
                color: Colors.white,
                size: 22,
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  fileName,
                  style: TextStyle(
                    color: textColor,
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  fileSize,
                  style: TextStyle(
                    color: textColor.withValues(alpha: 0.75),
                    fontSize: 11.5,
                  ),
                ),
              ],
            ),
            const SizedBox(width: 16),
            GestureDetector(
              onTap: onActionTap,
              child: Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isSent ? Colors.white : palette.main,
                ),
                child: Icon(
                  Icons.arrow_downward_rounded,
                  size: 17,
                  color: isSent ? palette.main : Colors.white,
                ),
              ),
            ),
          ],
        );
    }
  }
}
