import 'package:material_ui/material_ui.dart';
import '../models/user_session.dart';
import '../theme/skyripple_theme.dart';
import '../widgets/aero_button.dart';
import '../widgets/chat_bubble.dart';
import '../widgets/roster_item.dart';
import '../widgets/user_avatar.dart';
import '../widgets/well_input.dart';

enum _NavSection {
  directs,
  rooms,
  favorites,
}

enum _RosterFilter {
  all,
  directs,
  rooms,
}

class _ConversationSeed {
  const _ConversationSeed({
    required this.id,
    required this.title,
    required this.preview,
    required this.timestamp,
    required this.isRoom,
    this.presence,
    this.isE2ee = false,
    this.unread = 0,
    this.subtitle = '',
  });

  final String id;
  final String title;
  final String preview;
  final String timestamp;
  final bool isRoom;
  final UserPresence? presence;
  final bool isE2ee;
  final int unread;
  final String subtitle;
}

class _MessageSeed {
  const _MessageSeed({
    required this.sender,
    required this.isSent,
    this.role,
    this.kind = ChatBubbleKind.text,
    this.text = '',
  });

  final String sender;
  final bool isSent;
  final String? role;
  final ChatBubbleKind kind;
  final String text;
}

class MainShellScreen extends StatefulWidget {
  const MainShellScreen({
    super.key,
    required this.user,
    required this.isDark,
    required this.accent,
    required this.initialPresence,
    required this.onThemeChanged,
    required this.onAccentChanged,
    required this.onPresenceChanged,
    required this.onSignOut,
  });

  final SkyRippleUser user;
  final bool isDark;
  final SkyRippleAccent accent;
  final UserPresence initialPresence;
  final ValueChanged<bool> onThemeChanged;
  final ValueChanged<SkyRippleAccent> onAccentChanged;
  final ValueChanged<UserPresence> onPresenceChanged;
  final VoidCallback onSignOut;

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  _NavSection _navSection = _NavSection.directs;
  _RosterFilter _rosterFilter = _RosterFilter.directs;
  String _selectedId = 'marina';
  bool _showInspector = true;
  late UserPresence _myPresence;
  late String _displayName;
  String _bio = 'Construindo ideias para conectar pessoas';
  final _searchController = TextEditingController();
  final _composerController = TextEditingController();
  final List<_MessageSeed> _extraDirectMessages = [];
  final List<_MessageSeed> _extraRoomMessages = [];

  @override
  void initState() {
    super.initState();
    _myPresence = widget.initialPresence;
    _displayName = widget.user.name;
  }

  static const _directs = <_ConversationSeed>[
    _ConversationSeed(
      id: 'marina',
      title: 'Marina Oliveira',
      preview: 'Vamos conversar sobre o protótipo?',
      timestamp: '14:32',
      isRoom: false,
      presence: UserPresence.online,
      isE2ee: true,
      subtitle: 'Online agora • digitando...',
    ),
    _ConversationSeed(
      id: 'ana',
      title: 'Ana Beatriz',
      preview: 'Enviei os arquivos para você.',
      timestamp: '13:50',
      isRoom: false,
      presence: UserPresence.online,
      isE2ee: true,
      unread: 3,
      subtitle: 'Online no Desktop',
    ),
    _ConversationSeed(
      id: 'lucas_f',
      title: 'Lucas Ferreira',
      preview: 'Podemos revisar hoje?',
      timestamp: '11:20',
      isRoom: false,
      presence: UserPresence.away,
      isE2ee: true,
      unread: 1,
      subtitle: 'Ausente há 12 min',
    ),
    _ConversationSeed(
      id: 'bruno',
      title: 'Bruno Santos',
      preview: 'Valeu pela ajuda!',
      timestamp: 'Ontem',
      isRoom: false,
      presence: UserPresence.busy,
      isE2ee: true,
      subtitle: 'Ocupado',
    ),
    _ConversationSeed(
      id: 'rafael',
      title: 'Rafael Costa',
      preview: 'Vamos jogar mais tarde?',
      timestamp: 'Seg',
      isRoom: false,
      presence: UserPresence.online,
      isE2ee: true,
      unread: 2,
      subtitle: 'Online agora',
    ),
    _ConversationSeed(
      id: 'carla',
      title: 'Carla Mendes',
      preview: 'Adorei a nova interface.',
      timestamp: 'Seg',
      isRoom: false,
      presence: UserPresence.offline,
      isE2ee: true,
      subtitle: 'Visto por último ontem',
    ),
  ];

  static const _rooms = <_ConversationSeed>[
    _ConversationSeed(
      id: 'tech_flutter',
      title: '# Tecnologia & Flutter',
      preview: 'Vou mostrar o protótipo também.',
      timestamp: '14:32',
      isRoom: true,
      subtitle: '24 online • Desenvolvimento e tecnologia',
    ),
    _ConversationSeed(
      id: 'geral',
      title: '# Geral',
      preview: 'Alguém online para call?',
      timestamp: '13:18',
      isRoom: true,
      unread: 3,
      subtitle: '18 online • Conversas gerais',
    ),
    _ConversationSeed(
      id: 'design_ui',
      title: '# Design & UI',
      preview: 'Tokens atualizados no Figma.',
      timestamp: '11:05',
      isRoom: true,
      unread: 1,
      subtitle: '12 online • Frutiger Aero & Skeuo',
    ),
    _ConversationSeed(
      id: 'jogos',
      title: '# Jogos',
      preview: 'Partida hoje às 21h?',
      timestamp: 'Ontem',
      isRoom: true,
      subtitle: '9 online • Comunidade gamer',
    ),
    _ConversationSeed(
      id: 'skyripple_dev',
      title: 'Comunidade SkyRipple',
      preview: 'Bem-vindos ao cliente desktop!',
      timestamp: 'Seg',
      isRoom: true,
      subtitle: '42 online • Canal oficial',
    ),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    _composerController.dispose();
    super.dispose();
  }

  List<_ConversationSeed> get _visibleItems {
    final query = _searchController.text.trim().toLowerCase();
    final List<_ConversationSeed> source;
    switch (_rosterFilter) {
      case _RosterFilter.all:
        source = [..._directs, ..._rooms];
        break;
      case _RosterFilter.directs:
        source = _directs;
        break;
      case _RosterFilter.rooms:
        source = _rooms;
        break;
    }
    if (query.isEmpty) {
      return source;
    }
    return source
        .where(
          (item) =>
              item.title.toLowerCase().contains(query) ||
              item.preview.toLowerCase().contains(query),
        )
        .toList();
  }

  _ConversationSeed get _activeConversation {
    final all = [..._directs, ..._rooms];
    return all.firstWhere(
      (item) => item.id == _selectedId,
      orElse: () => _directs.first,
    );
  }

  void _sendMessage() {
    final text = _composerController.text.trim();
    if (text.isEmpty) {
      return;
    }
    setState(() {
      if (_activeConversation.isRoom) {
        _extraRoomMessages.add(
          _MessageSeed(sender: 'Você', isSent: true, text: text),
        );
      } else {
        _extraDirectMessages.add(
          _MessageSeed(sender: 'Você', isSent: true, text: text),
        );
      }
      _composerController.clear();
    });
  }

  void _openSettingsModal() {
    var draftName = _displayName;
    var draftBio = _bio;
    var draftDark = widget.isDark;
    var draftAccent = widget.accent;
    var draftPresence = _myPresence;

    final nameCtrl = TextEditingController(text: draftName);
    final bioCtrl = TextEditingController(text: draftBio);

    showDialog<void>(
      context: context,
      barrierColor: const Color(0x730F172A),
      builder: (dialogContext) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            final theme = SkyRippleTheme.of(context);
            return Dialog(
              backgroundColor: theme.panelSurface,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(color: theme.borderSubtle),
              ),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 500),
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Configurações & Perfil',
                        style: TextStyle(
                          color: theme.textPrimary,
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 18),
                      Row(
                        children: [
                          UserAvatar(
                            label: draftName,
                            size: 56,
                            presence: draftPresence,
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: TextButton(
                                onPressed: () {},
                                child: Text(
                                  'Alterar foto de perfil',
                                  overflow: TextOverflow.ellipsis,
                                  style: TextStyle(
                                    color: theme.palette.main,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ),
                          AeroButton(
                            label: 'Sair',
                            variant: AeroButtonVariant.ghost,
                            height: 34,
                            onPressed: () {
                              Navigator.of(dialogContext).pop();
                              widget.onSignOut();
                            },
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Nome de exibição',
                        style: TextStyle(
                          color: theme.textPrimary,
                          fontSize: 12.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 6),
                      WellInput(
                        controller: nameCtrl,
                        onChanged: (v) => draftName = v,
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Recado / Bio',
                        style: TextStyle(
                          color: theme.textPrimary,
                          fontSize: 12.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 6),
                      WellInput(
                        controller: bioCtrl,
                        onChanged: (v) => draftBio = v,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Tema',
                        style: TextStyle(
                          color: theme.textPrimary,
                          fontSize: 12.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: _ThemeChoiceCard(
                              label: 'Claro — Aero Sky',
                              icon: Icons.light_mode_rounded,
                              darkCard: false,
                              selected: !draftDark,
                              accentColor: AccentPalette.of(draftAccent).main,
                              onTap: () => setModalState(() => draftDark = false),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: _ThemeChoiceCard(
                              label: 'Escuro — Midnight',
                              icon: Icons.dark_mode_rounded,
                              darkCard: true,
                              selected: draftDark,
                              accentColor: AccentPalette.of(draftAccent).main,
                              onTap: () => setModalState(() => draftDark = true),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Cor de destaque',
                        style: TextStyle(
                          color: theme.textPrimary,
                          fontSize: 12.5,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          for (final accent in SkyRippleAccent.values) ...[
                            _AccentSphere(
                              palette: AccentPalette.of(accent),
                              selected: draftAccent == accent,
                              onTap: () =>
                                  setModalState(() => draftAccent = accent),
                            ),
                            const SizedBox(width: 10),
                          ],
                        ],
                      ),
                      const SizedBox(height: 16),
                      Wrap(
                        spacing: 12,
                        runSpacing: 6,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          Text(
                            'Status:',
                            style: TextStyle(
                              color: theme.textPrimary,
                              fontSize: 12.5,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          _PresenceChip(
                            label: 'Online',
                            color: theme.onlineGreen,
                            selected: draftPresence == UserPresence.online,
                            onTap: () => setModalState(
                              () => draftPresence = UserPresence.online,
                            ),
                          ),
                          _PresenceChip(
                            label: 'Ocupado',
                            color: theme.busyRed,
                            selected: draftPresence == UserPresence.busy,
                            onTap: () => setModalState(
                              () => draftPresence = UserPresence.busy,
                            ),
                          ),
                          _PresenceChip(
                            label: 'Ausente',
                            color: theme.awayAmber,
                            selected: draftPresence == UserPresence.away,
                            onTap: () => setModalState(
                              () => draftPresence = UserPresence.away,
                            ),
                          ),
                          _PresenceChip(
                            label: 'Invisível',
                            color: theme.offlineSlate,
                            selected: draftPresence == UserPresence.offline,
                            onTap: () => setModalState(
                              () => draftPresence = UserPresence.offline,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 22),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          AeroButton(
                            label: 'Cancelar',
                            variant: AeroButtonVariant.secondary,
                            onPressed: () => Navigator.of(dialogContext).pop(),
                          ),
                          const SizedBox(width: 10),
                          AeroButton(
                            label: 'Salvar Alterações',
                            onPressed: () {
                              setState(() {
                                if (draftName.trim().isNotEmpty) {
                                  _displayName = draftName.trim();
                                }
                                _bio = draftBio.trim();
                                _myPresence = draftPresence;
                              });
                              widget.onThemeChanged(draftDark);
                              widget.onAccentChanged(draftAccent);
                              widget.onPresenceChanged(draftPresence);
                              Navigator.of(dialogContext).pop();
                            },
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    final showRightInspector = _showInspector && width >= 1060;

    return Scaffold(
      body: Row(
        children: [
          _buildLeftRail(theme),
          _buildRosterColumn(theme),
          Expanded(
            child: _navSection == _NavSection.favorites
                ? _buildFavoritesStage(theme)
                : _buildChatStage(theme),
          ),
          if (showRightInspector)
            _navSection == _NavSection.favorites
                ? _buildFavoritesInspector(theme)
                : _buildContextInspector(theme),
        ],
      ),
    );
  }

  Widget _buildLeftRail(SkyRippleTheme theme) {
    return Container(
      width: 68,
      decoration: BoxDecoration(
        color: theme.railBackground,
        border: Border(right: BorderSide(color: theme.borderSubtle)),
      ),
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Column(
        children: [
          PopupMenuButton<UserPresence>(
            tooltip: 'Alterar status',
            onSelected: (value) {
              setState(() => _myPresence = value);
              widget.onPresenceChanged(value);
            },
            itemBuilder: (context) => [
              _presenceMenuItem(
                UserPresence.online,
                'Online',
                theme.onlineGreen,
              ),
              _presenceMenuItem(
                UserPresence.busy,
                'Ocupado',
                theme.busyRed,
              ),
              _presenceMenuItem(
                UserPresence.away,
                'Ausente',
                theme.awayAmber,
              ),
              _presenceMenuItem(
                UserPresence.offline,
                'Invisível',
                theme.offlineSlate,
              ),
            ],
            child: UserAvatar(
              label: _displayName,
              size: 40,
              presence: _myPresence,
            ),
          ),
          const SizedBox(height: 18),
          _RailIconButton(
            icon: Icons.chat_bubble_rounded,
            tooltip: 'Directs',
            active: _navSection == _NavSection.directs,
            onTap: () => setState(() {
              _navSection = _NavSection.directs;
              _rosterFilter = _RosterFilter.directs;
              _selectedId = _directs.first.id;
            }),
          ),
          const SizedBox(height: 8),
          _RailIconButton(
            icon: Icons.forum_rounded,
            tooltip: 'Salas',
            active: _navSection == _NavSection.rooms,
            onTap: () => setState(() {
              _navSection = _NavSection.rooms;
              _rosterFilter = _RosterFilter.rooms;
              _selectedId = _rooms.first.id;
            }),
          ),
          const SizedBox(height: 8),
          _RailIconButton(
            icon: Icons.star_rounded,
            tooltip: 'Favoritos',
            active: _navSection == _NavSection.favorites,
            onTap: () => setState(() => _navSection = _NavSection.favorites),
          ),
          const SizedBox(height: 8),
          _RailIconButton(
            icon: Icons.notifications_rounded,
            tooltip: 'Notificações',
            badgeCount: 3,
            onTap: () {},
          ),
          const Spacer(),
          _RailIconButton(
            icon: theme.isDark
                ? Icons.light_mode_rounded
                : Icons.dark_mode_rounded,
            tooltip: 'Alternar tema',
            onTap: () => widget.onThemeChanged(!theme.isDark),
          ),
          const SizedBox(height: 8),
          _RailIconButton(
            icon: Icons.settings_rounded,
            tooltip: 'Configurações',
            onTap: _openSettingsModal,
          ),
        ],
      ),
    );
  }

  PopupMenuItem<UserPresence> _presenceMenuItem(
    UserPresence value,
    String label,
    Color color,
  ) {
    return PopupMenuItem(
      value: value,
      child: Row(
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 10),
          Text(label),
        ],
      ),
    );
  }

  Widget _buildRosterColumn(SkyRippleTheme theme) {
    final items = _visibleItems;
    return Container(
      width: 296,
      decoration: BoxDecoration(
        color: theme.rosterBackground,
        border: Border(right: BorderSide(color: theme.borderSubtle)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Conversas',
                      style: TextStyle(
                        color: theme.textPrimary,
                        fontSize: 22,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.4,
                      ),
                    ),
                    IconButton(
                      onPressed: () {},
                      icon: Icon(
                        Icons.add_rounded,
                        color: theme.palette.main,
                      ),
                      tooltip: 'Nova conversa',
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                WellInput(
                  controller: _searchController,
                  hintText: 'Buscar pessoas ou salas...',
                  leadingIcon: Icons.search_rounded,
                  height: 38,
                  borderRadius: 19,
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    color: theme.wellTop,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: theme.borderSubtle),
                  ),
                  child: Row(
                    children: [
                      _SegmentTab(
                        label: 'Todos',
                        active: _rosterFilter == _RosterFilter.all,
                        onTap: () => setState(
                          () => _rosterFilter = _RosterFilter.all,
                        ),
                      ),
                      _SegmentTab(
                        label: 'Directs',
                        active: _rosterFilter == _RosterFilter.directs,
                        onTap: () => setState(() {
                          _rosterFilter = _RosterFilter.directs;
                          _navSection = _NavSection.directs;
                          _selectedId = _directs.first.id;
                        }),
                      ),
                      _SegmentTab(
                        label: 'Salas',
                        active: _rosterFilter == _RosterFilter.rooms,
                        onTap: () => setState(() {
                          _rosterFilter = _RosterFilter.rooms;
                          _navSection = _NavSection.rooms;
                          _selectedId = _rooms.first.id;
                        }),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  'ONLINE AGORA',
                  style: TextStyle(
                    color: theme.textMuted,
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.6,
                  ),
                ),
                const SizedBox(height: 8),
                SizedBox(
                  height: 40,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: 5,
                    separatorBuilder: (_, _) => const SizedBox(width: 10),
                    itemBuilder: (context, index) {
                      final contact = _directs[index];
                      return UserAvatar(
                        label: contact.title,
                        size: 38,
                        presence: contact.presence,
                        onTap: () => setState(() {
                          _navSection = _NavSection.directs;
                          _selectedId = contact.id;
                        }),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  _rosterFilter == _RosterFilter.rooms
                      ? 'SUAS SALAS'
                      : 'MENSAGENS RECENTES',
                  style: TextStyle(
                    color: theme.textMuted,
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.6,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.fromLTRB(10, 0, 10, 14),
              itemCount: items.length,
              separatorBuilder: (_, _) => const SizedBox(height: 4),
              itemBuilder: (context, index) {
                final item = items[index];
                return RosterItem(
                  title: item.title,
                  preview: item.preview,
                  timestamp: item.timestamp,
                  presence: item.presence,
                  isRoom: item.isRoom,
                  isE2ee: item.isE2ee,
                  unreadCount: item.id == _selectedId ? 0 : item.unread,
                  selected: item.id == _selectedId,
                  onTap: () => setState(() {
                    _selectedId = item.id;
                    _navSection = item.isRoom
                        ? _NavSection.rooms
                        : _NavSection.directs;
                  }),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChatStage(SkyRippleTheme theme) {
    final active = _activeConversation;
    final messages = active.isRoom
        ? [
            const _MessageSeed(
              sender: 'Bruno Santos',
              isSent: false,
              text: 'Bom dia! Alguma novidade para hoje?',
            ),
            const _MessageSeed(
              sender: 'Marina Oliveira',
              isSent: false,
              role: 'Mod',
              text: 'Estou terminando os componentes da interface.',
            ),
            const _MessageSeed(
              sender: 'Ana Beatriz',
              isSent: false,
              role: 'Dono',
              text: 'Pessoal, alguém já testou o Flutter no Linux?',
            ),
            const _MessageSeed(
              sender: 'Lucas Ferreira',
              isSent: false,
              role: 'Mod',
              text: 'Sim! Preparei o protótipo desktop para compartilhar.',
            ),
            const _MessageSeed(
              sender: 'Você',
              isSent: true,
              text: 'Ótimo! Vou mostrar a base com os tokens do site.',
            ),
            ..._extraRoomMessages,
          ]
        : [
            const _MessageSeed(
              sender: 'Marina Oliveira',
              isSent: false,
              text: 'Oi! Você conseguiu avançar no design?',
            ),
            const _MessageSeed(
              sender: 'Marina Oliveira',
              isSent: false,
              text: 'A nova versão ficou muito boa!',
            ),
            const _MessageSeed(
              sender: 'Você',
              isSent: true,
              text: 'Sim! Estou organizando os componentes no Flutter.',
            ),
            const _MessageSeed(
              sender: 'Você',
              isSent: true,
              text: 'Depois compartilho o build com você.',
            ),
            const _MessageSeed(
              sender: 'Marina Oliveira',
              isSent: false,
              kind: ChatBubbleKind.audio,
            ),
            const _MessageSeed(
              sender: 'Você',
              isSent: true,
              kind: ChatBubbleKind.attachment,
            ),
            ..._extraDirectMessages,
          ];

    return Container(
      color: theme.stageBackground,
      child: Column(
        children: [
          Container(
            height: 68,
            padding: const EdgeInsets.symmetric(horizontal: 20),
            decoration: BoxDecoration(
              border: Border(bottom: BorderSide(color: theme.borderSubtle)),
            ),
            child: Row(
              children: [
                UserAvatar(
                  label: active.title,
                  size: 38,
                  isRoom: active.isRoom,
                  presence: active.isRoom ? null : active.presence,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        active.title,
                        style: TextStyle(
                          color: theme.textPrimary,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        active.subtitle,
                        style: TextStyle(
                          color: theme.onlineGreen,
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                if (active.isE2ee)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 9,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: theme.onlineGreen.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.verified_user_outlined,
                          size: 13,
                          color: theme.onlineGreen,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'E2EE',
                          style: TextStyle(
                            color: theme.onlineGreen,
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.search_rounded, color: theme.textMuted),
                  tooltip: 'Buscar na conversa',
                ),
                IconButton(
                  onPressed: () {},
                  icon: Icon(Icons.star_border_rounded, color: theme.textMuted),
                  tooltip: 'Favoritar',
                ),
                IconButton(
                  onPressed: () =>
                      setState(() => _showInspector = !_showInspector),
                  icon: Icon(
                    Icons.view_sidebar_outlined,
                    color: _showInspector ? theme.palette.main : theme.textMuted,
                  ),
                  tooltip: 'Painel lateral',
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              itemCount: messages.length + 1,
              itemBuilder: (context, index) {
                if (index == 0) {
                  return Center(
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 16),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: theme.rosterBackground,
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(color: theme.borderSubtle),
                      ),
                      child: Text(
                        'Hoje',
                        style: TextStyle(
                          color: theme.textMuted,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  );
                }

                final msg = messages[index - 1];
                final prevSender =
                    index > 1 ? messages[index - 2].sender : null;
                final showHeader = prevSender != msg.sender;

                return Padding(
                  padding: EdgeInsets.only(top: showHeader ? 12 : 4),
                  child: Column(
                    crossAxisAlignment: msg.isSent
                        ? CrossAxisAlignment.end
                        : CrossAxisAlignment.start,
                    children: [
                      if (showHeader) ...[
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              msg.sender,
                              style: TextStyle(
                                color: theme.textMuted,
                                fontSize: 11.5,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                            if (msg.role != null) ...[
                              const SizedBox(width: 6),
                              _RolePillBadge(role: msg.role!),
                            ],
                          ],
                        ),
                        const SizedBox(height: 4),
                      ],
                      ChatBubble(
                        isSent: msg.isSent,
                        kind: msg.kind,
                        text: msg.text,
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.fromLTRB(20, 10, 20, 16),
            decoration: BoxDecoration(
              border: Border(top: BorderSide(color: theme.borderSubtle)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: WellInput(
                    controller: _composerController,
                    hintText: 'Escreva uma mensagem criptografada...',
                    leadingIcon: Icons.attach_file_rounded,
                    onSubmitted: (_) => _sendMessage(),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.sentiment_satisfied_alt_rounded,
                          size: 18,
                          color: theme.textMuted,
                        ),
                        const SizedBox(width: 10),
                        Icon(
                          Icons.mic_none_rounded,
                          size: 18,
                          color: theme.textMuted,
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                AeroButton(
                  label: 'Enviar',
                  height: 42,
                  onPressed: _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFavoritesStage(SkyRippleTheme theme) {
    const saved = [
      ('Apresentação.pdf', 'Arquivo • 1.8 MB • Marina Oliveira'),
      ('Áudio da Marina', 'Áudio • 0:24 • Hoje às 14:12'),
      ('Ideias para o SkyRipple', 'Mensagem • # Tecnologia & Flutter'),
      ('Referência visual.png', 'Imagem • # Design & UI'),
      ('Reunião da equipe', 'Áudio • 1:12 • Ontem'),
      ('Próximos passos', 'Mensagem • Ana Beatriz'),
    ];
    return Container(
      color: theme.stageBackground,
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.star_rounded, color: theme.awayAmber, size: 24),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Favoritos',
                    style: TextStyle(
                      color: theme.textPrimary,
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    '6 itens salvos',
                    style: TextStyle(color: theme.textMuted, fontSize: 12),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                maxCrossAxisExtent: 340,
                mainAxisExtent: 92,
                crossAxisSpacing: 14,
                mainAxisSpacing: 14,
              ),
              itemCount: saved.length,
              itemBuilder: (context, index) {
                final (title, meta) = saved[index];
                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: theme.panelSurface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: theme.borderSubtle),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: theme.textPrimary,
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        meta,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(color: theme.textMuted, fontSize: 12),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildContextInspector(SkyRippleTheme theme) {
    final active = _activeConversation;
    return Container(
      width: 276,
      decoration: BoxDecoration(
        color: theme.inspectorBackground,
        border: Border(left: BorderSide(color: theme.borderSubtle)),
      ),
      padding: const EdgeInsets.all(18),
      child: active.isRoom
          ? _buildRoomMembersInspector(theme)
          : _buildDirectInspector(theme, active),
    );
  }

  Widget _buildDirectInspector(
    SkyRippleTheme theme,
    _ConversationSeed active,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Column(
            children: [
              UserAvatar(
                label: active.title,
                size: 64,
                presence: active.presence,
              ),
              const SizedBox(height: 12),
              Text(
                active.title,
                style: TextStyle(
                  color: theme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                '@${active.id}',
                style: TextStyle(color: theme.textMuted, fontSize: 12),
              ),
              const SizedBox(height: 4),
              Text(
                'Product Designer • Desktop',
                style: TextStyle(color: theme.textSecondary, fontSize: 12),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: theme.panelSurface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: theme.borderSubtle),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(
                    Icons.verified_user_outlined,
                    size: 15,
                    color: theme.onlineGreen,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Segurança E2EE',
                    style: TextStyle(
                      color: theme.textPrimary,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(
                'Chave pública verificada',
                style: TextStyle(
                  color: theme.onlineGreen,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),
        Text(
          'Mídias e arquivos',
          style: TextStyle(
            color: theme.textPrimary,
            fontSize: 13.5,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 10),
        GridView.count(
          crossAxisCount: 3,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
          children: const [
            _MediaTile(Color(0xFF60A5FA), Color(0xFFDBEAFE)),
            _MediaTile(Color(0xFF22D3EE), Color(0xFFCFFAFE)),
            _MediaTile(Color(0xFF818CF8), Color(0xFFE0E7FF)),
            _MediaTile(Color(0xFF38BDF8), Color(0xFFE0F2FE)),
            _MediaTile(Color(0xFF34D399), Color(0xFFD1FAE5)),
            _MediaTile(Color(0xFFC084FC), Color(0xFFF3E8FF)),
          ],
        ),
        const SizedBox(height: 14),
        _FileRow(
          name: 'Apresentação.pdf',
          size: '1.8 MB',
          theme: theme,
        ),
        const SizedBox(height: 6),
        _FileRow(
          name: 'Materiais.zip',
          size: '4.2 MB',
          theme: theme,
        ),
      ],
    );
  }

  Widget _buildRoomMembersInspector(SkyRippleTheme theme) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Membros',
          style: TextStyle(
            color: theme.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 14),
        _MemberGroupHeader(label: 'Dono (1)', theme: theme),
        _MemberRow(
          name: 'Ana Beatriz',
          presence: UserPresence.online,
          role: 'Dono',
          theme: theme,
        ),
        const SizedBox(height: 12),
        _MemberGroupHeader(label: 'Moderadores (2)', theme: theme),
        _MemberRow(
          name: 'Lucas Ferreira',
          presence: UserPresence.online,
          role: 'Mod',
          theme: theme,
        ),
        _MemberRow(
          name: 'Marina Oliveira',
          presence: UserPresence.away,
          role: 'Mod',
          theme: theme,
        ),
        const SizedBox(height: 12),
        _MemberGroupHeader(label: 'Membros online (12)', theme: theme),
        _MemberRow(
          name: 'Bruno Santos',
          presence: UserPresence.busy,
          canModerate: true,
          theme: theme,
        ),
        _MemberRow(
          name: 'Rafael Costa',
          presence: UserPresence.online,
          canModerate: true,
          theme: theme,
        ),
        _MemberRow(
          name: 'Carla Mendes',
          presence: UserPresence.away,
          canModerate: true,
          theme: theme,
        ),
        const SizedBox(height: 12),
        _MemberGroupHeader(label: 'Offline (9)', theme: theme),
        _MemberRow(
          name: 'Pedro Almeida',
          presence: UserPresence.offline,
          canModerate: true,
          theme: theme,
        ),
      ],
    );
  }

  Widget _buildFavoritesInspector(SkyRippleTheme theme) {
    return Container(
      width: 276,
      decoration: BoxDecoration(
        color: theme.inspectorBackground,
        border: Border(left: BorderSide(color: theme.borderSubtle)),
      ),
      padding: const EdgeInsets.all(18),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Itens salvos',
            style: TextStyle(
              color: theme.textPrimary,
              fontSize: 16,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 12),
          const WellInput(
            hintText: 'Filtrar favoritos...',
            leadingIcon: Icons.search_rounded,
            height: 36,
          ),
          const SizedBox(height: 16),
          Text(
            'Clique em qualquer item para abrir a conversa de origem.',
            style: TextStyle(color: theme.textMuted, fontSize: 12.5),
          ),
        ],
      ),
    );
  }
}

class _RailIconButton extends StatelessWidget {
  const _RailIconButton({
    required this.icon,
    required this.tooltip,
    required this.onTap,
    this.active = false,
    this.badgeCount = 0,
  });

  final IconData icon;
  final String tooltip;
  final VoidCallback onTap;
  final bool active;
  final int badgeCount;

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: BoxDecoration(
                color: active
                    ? theme.palette.main.withValues(alpha: 0.14)
                    : Colors.transparent,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(
                icon,
                size: 21,
                color: active ? theme.palette.main : theme.textMuted,
              ),
            ),
            if (badgeCount > 0)
              Positioned(
                right: 2,
                top: 2,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 5),
                  height: 16,
                  decoration: BoxDecoration(
                    color: theme.busyRed,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    '$badgeCount',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _SegmentTab extends StatelessWidget {
  const _SegmentTab({
    required this.label,
    required this.active,
    required this.onTap,
  });

  final String label;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: Container(
            height: 30,
            decoration: BoxDecoration(
              color: active ? theme.panelSurface : Colors.transparent,
              borderRadius: BorderRadius.circular(8),
              boxShadow: active
                  ? [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.06),
                        blurRadius: 3,
                        offset: const Offset(0, 1),
                      ),
                    ]
                  : null,
            ),
            alignment: Alignment.center,
            child: Text(
              label,
              style: TextStyle(
                color: active ? theme.textPrimary : theme.textMuted,
                fontSize: 12,
                fontWeight: active ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _RolePillBadge extends StatelessWidget {
  const _RolePillBadge({required this.role});

  final String role;

  @override
  Widget build(BuildContext context) {
    final isOwner = role == 'Dono';
    final color = isOwner ? const Color(0xFFD97706) : const Color(0xFF7C3AED);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1.5),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.14),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withValues(alpha: 0.35), width: 1),
      ),
      child: Text(
        role,
        style: TextStyle(
          color: color,
          fontSize: 10.5,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _MediaTile extends StatelessWidget {
  const _MediaTile(this.top, this.bottom);

  final Color top;
  final Color bottom;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(10),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [top, bottom],
        ),
      ),
    );
  }
}

class _FileRow extends StatelessWidget {
  const _FileRow({
    required this.name,
    required this.size,
    required this.theme,
  });

  final String name;
  final String size;
  final SkyRippleTheme theme;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(
          Icons.insert_drive_file_outlined,
          size: 15,
          color: theme.textMuted,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            name,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: theme.textPrimary,
              fontSize: 12.5,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
        Text(
          size,
          style: TextStyle(color: theme.textMuted, fontSize: 11.5),
        ),
      ],
    );
  }
}

class _MemberGroupHeader extends StatelessWidget {
  const _MemberGroupHeader({required this.label, required this.theme});

  final String label;
  final SkyRippleTheme theme;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Text(
        label,
        style: TextStyle(
          color: theme.textMuted,
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _MemberRow extends StatelessWidget {
  const _MemberRow({
    required this.name,
    required this.presence,
    required this.theme,
    this.role,
    this.canModerate = false,
  });

  final String name;
  final UserPresence presence;
  final SkyRippleTheme theme;
  final String? role;
  final bool canModerate;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          UserAvatar(label: name, size: 28, presence: presence),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: TextStyle(
                color: theme.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          if (role != null) _RolePillBadge(role: role!),
          if (canModerate)
            PopupMenuButton<String>(
              padding: EdgeInsets.zero,
              icon: Icon(
                Icons.more_horiz_rounded,
                size: 16,
                color: theme.textMuted,
              ),
              itemBuilder: (context) => [
                const PopupMenuItem(
                  value: 'promote',
                  child: Text('Promover a Moderador'),
                ),
                const PopupMenuItem(
                  value: 'mute',
                  child: Text('Silenciar membro'),
                ),
                PopupMenuItem(
                  value: 'remove',
                  child: Text(
                    'Remover da sala',
                    style: TextStyle(color: theme.busyRed),
                  ),
                ),
              ],
            ),
        ],
      ),
    );
  }
}

class _ThemeChoiceCard extends StatelessWidget {
  const _ThemeChoiceCard({
    required this.label,
    required this.icon,
    required this.darkCard,
    required this.selected,
    required this.accentColor,
    required this.onTap,
  });

  final String label;
  final IconData icon;
  final bool darkCard;
  final bool selected;
  final Color accentColor;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
          decoration: BoxDecoration(
            color: darkCard ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: selected ? accentColor : const Color(0xFFCBD5E1),
              width: selected ? 1.8 : 1,
            ),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                size: 16,
                color: darkCard ? Colors.white : accentColor,
              ),
              const SizedBox(width: 8),
              Flexible(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: darkCard ? Colors.white : const Color(0xFF1D1D1F),
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _AccentSphere extends StatelessWidget {
  const _AccentSphere({
    required this.palette,
    required this.selected,
    required this.onTap,
  });

  final AccentPalette palette;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: Container(
          width: 30,
          height: 30,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [palette.light, palette.main, palette.darker],
            ),
            border: Border.all(
              color: selected ? Colors.white : Colors.transparent,
              width: 2.5,
            ),
            boxShadow: [
              if (selected)
                BoxShadow(
                  color: palette.main.withValues(alpha: 0.55),
                  blurRadius: 6,
                  spreadRadius: 1,
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PresenceChip extends StatelessWidget {
  const _PresenceChip({
    required this.label,
    required this.color,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final Color color;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    return GestureDetector(
      onTap: onTap,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: selected ? color.withValues(alpha: 0.14) : Colors.transparent,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: selected ? color : Colors.transparent,
            ),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: 5),
              Text(
                label,
                style: TextStyle(
                  color: selected ? color : theme.textMuted,
                  fontSize: 12,
                  fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
