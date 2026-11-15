import 'package:material_ui/material_ui.dart';
import '../models/chat_models.dart';
import '../models/user_session.dart';
import '../services/auth_service.dart';
import '../services/chat_service.dart';
import '../services/realtime_service.dart';
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

class MainShellScreen extends StatefulWidget {
  const MainShellScreen({
    super.key,
    required this.user,
    required this.token,
    required this.apiUrl,
    required this.chatClient,
    required this.realtimeClient,
    required this.isDark,
    required this.accent,
    required this.initialPresence,
    required this.onThemeChanged,
    required this.onAccentChanged,
    required this.onPresenceChanged,
    required this.onSignOut,
  });

  final SkyRippleUser user;
  final String token;
  final String apiUrl;
  final ChatApiClient chatClient;
  final RealtimeClient realtimeClient;
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
  String? _selectedId;
  bool _showInspector = true;
  bool _loadingLists = true;
  bool _loadingMessages = false;
  bool _sending = false;
  String? _statusError;

  late UserPresence _myPresence;
  late String _displayName;
  String _bio = 'Construindo ideias para conectar pessoas';

  List<ChatConversation> _directs = [];
  List<ChatConversation> _rooms = [];
  List<FavoriteItem> _favorites = [];
  List<ChatMessage> _messages = [];
  List<RoomMember> _roomMembers = [];
  Set<String> _onlineUserIds = {};

  final _searchController = TextEditingController();
  final _composerController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _myPresence = widget.initialPresence;
    _displayName = widget.user.name;
    _connectRealtime();
    _loadInitialData();
  }

  void _connectRealtime() {
    widget.realtimeClient.connect(
      apiUrl: widget.apiUrl,
      token: widget.token,
      userId: widget.user.id,
      onOnlineUsers: (ids) {
        if (!mounted) return;
        setState(() {
          _onlineUserIds = ids.toSet();
          _directs = _directs.map((d) {
            if (d.partnerId != null && _onlineUserIds.contains(d.partnerId)) {
              return d.copyWith(
                presence: UserPresence.online,
                subtitle: 'Online agora',
              );
            }
            return d;
          }).toList();
        });
      },
      onMessage: (payload) {
        if (!mounted) return;
        final roomId = (payload['room'] ?? payload['roomId'] ?? '').toString();
        final convId = (payload['conversationId'] ?? '').toString();
        final active = _activeConversation;
        if (active == null) return;
        if ((active.isRoom && roomId == active.id) ||
            (!active.isRoom && convId == active.id)) {
          final incoming = ChatMessage.fromJson(
            payload,
            currentUserId: widget.user.id,
          );
          final alreadyExists = _messages.any(
            (m) => m.id.isNotEmpty && m.id == incoming.id,
          );
          if (!alreadyExists) {
            setState(() => _messages = [..._messages, incoming]);
          }
        }
      },
    );
  }

  Future<void> _loadInitialData() async {
    setState(() {
      _loadingLists = true;
      _statusError = null;
    });
    try {
      final results = await Future.wait([
        widget.chatClient.listDirectConversations(
          apiUrl: widget.apiUrl,
          token: widget.token,
        ),
        widget.chatClient.listRooms(
          apiUrl: widget.apiUrl,
          token: widget.token,
        ),
        widget.chatClient.listFavorites(
          apiUrl: widget.apiUrl,
          token: widget.token,
        ),
      ]);
      if (!mounted) return;
      final loadedDirects = results[0] as List<ChatConversation>;
      final loadedRooms = results[1] as List<ChatConversation>;
      final loadedFavorites = results[2] as List<FavoriteItem>;

      String? initialSelected = _selectedId;
      if (initialSelected == null) {
        if (loadedDirects.isNotEmpty) {
          initialSelected = loadedDirects.first.id;
          _rosterFilter = _RosterFilter.directs;
          _navSection = _NavSection.directs;
        } else if (loadedRooms.isNotEmpty) {
          initialSelected = loadedRooms.first.id;
          _rosterFilter = _RosterFilter.rooms;
          _navSection = _NavSection.rooms;
        }
      }

      setState(() {
        _directs = loadedDirects;
        _rooms = loadedRooms;
        _favorites = loadedFavorites;
        _selectedId = initialSelected;
        _loadingLists = false;
      });

      if (initialSelected != null) {
        await _loadConversationDetails(initialSelected);
      }
    } on AuthApiException catch (err) {
      if (!mounted) return;
      setState(() {
        _loadingLists = false;
        _statusError = err.message;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _loadingLists = false;
        _statusError = 'Não foi possível carregar conversas.';
      });
    }
  }

  Future<void> _loadConversationDetails(String conversationId) async {
    final active = _findById(conversationId);
    if (active == null) return;

    if (active.isRoom) {
      widget.realtimeClient.joinRoom(active.id, widget.user.id);
    }

    setState(() {
      _loadingMessages = true;
      _messages = [];
      _roomMembers = [];
    });

    try {
      if (active.isRoom) {
        final msgsFuture = widget.chatClient.listRoomMessages(
          apiUrl: widget.apiUrl,
          token: widget.token,
          roomId: active.id,
          currentUserId: widget.user.id,
        );
        final membersFuture = widget.chatClient.listRoomMembers(
          apiUrl: widget.apiUrl,
          token: widget.token,
          roomId: active.id,
        );
        final results = await Future.wait([msgsFuture, membersFuture]);
        if (!mounted || _selectedId != conversationId) return;
        setState(() {
          _messages = results[0] as List<ChatMessage>;
          _roomMembers = results[1] as List<RoomMember>;
          _loadingMessages = false;
        });
      } else {
        final msgs = await widget.chatClient.listDirectMessages(
          apiUrl: widget.apiUrl,
          token: widget.token,
          conversationId: active.id,
          currentUserId: widget.user.id,
        );
        if (!mounted || _selectedId != conversationId) return;
        setState(() {
          _messages = msgs;
          _loadingMessages = false;
        });
      }
    } catch (_) {
      if (!mounted) return;
      setState(() => _loadingMessages = false);
    }
  }

  Future<void> _selectConversation(ChatConversation item) async {
    final prev = _activeConversation;
    if (prev != null && prev.isRoom && prev.id != item.id) {
      widget.realtimeClient.leaveRoom(prev.id, widget.user.id);
    }
    setState(() {
      _selectedId = item.id;
      _navSection = item.isRoom ? _NavSection.rooms : _NavSection.directs;
    });
    await _loadConversationDetails(item.id);
  }

  @override
  void dispose() {
    widget.realtimeClient.dispose();
    _searchController.dispose();
    _composerController.dispose();
    super.dispose();
  }

  ChatConversation? _findById(String? id) {
    if (id == null) return null;
    for (final item in [..._directs, ..._rooms]) {
      if (item.id == id) return item;
    }
    return null;
  }

  ChatConversation? get _activeConversation => _findById(_selectedId);

  List<ChatConversation> get _visibleItems {
    final query = _searchController.text.trim().toLowerCase();
    final List<ChatConversation> source;
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

  Future<void> _sendMessage() async {
    final active = _activeConversation;
    final text = _composerController.text.trim();
    if (active == null || text.isEmpty || _sending) {
      return;
    }
    setState(() => _sending = true);
    _composerController.clear();
    try {
      final sent = active.isRoom
          ? await widget.chatClient.sendRoomMessage(
              apiUrl: widget.apiUrl,
              token: widget.token,
              roomId: active.id,
              currentUserId: widget.user.id,
              content: text,
            )
          : await widget.chatClient.sendDirectMessage(
              apiUrl: widget.apiUrl,
              token: widget.token,
              conversationId: active.id,
              currentUserId: widget.user.id,
              content: text,
            );
      if (!mounted) return;
      final exists = _messages.any((m) => m.id.isNotEmpty && m.id == sent.id);
      setState(() {
        if (!exists) {
          _messages = [..._messages, sent];
        }
        _sending = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _sending = false;
        _composerController.text = text;
      });
    }
  }

  Future<void> _openNewDirectDialog() async {
    await showDialog<void>(
      context: context,
      barrierColor: const Color(0x730F172A),
      builder: (_) => _NewDirectDialog(
        apiUrl: widget.apiUrl,
        token: widget.token,
        chatClient: widget.chatClient,
        onSelected: (conv) async {
          if (!mounted) return;
          final exists = _directs.any((d) => d.id == conv.id);
          setState(() {
            if (!exists) {
              _directs = [conv, ..._directs];
            }
            _rosterFilter = _RosterFilter.directs;
          });
          await _selectConversation(conv);
        },
      ),
    );
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
                            avatarUrl: widget.user.avatarUrl,
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

  String _resolveMessageSenderName(ChatMessage msg) {
    if (msg.isSent) {
      return 'Você';
    }
    if (msg.senderName.isNotEmpty && msg.senderName != 'Usuário') {
      return msg.senderName;
    }
    for (final m in _roomMembers) {
      if (m.id.isNotEmpty && m.id == msg.senderId) {
        return m.name;
      }
    }
    for (final d in _directs) {
      if (d.partnerId != null && d.partnerId == msg.senderId) {
        return d.title;
      }
    }
    final active = _activeConversation;
    if (active != null && !active.isRoom) {
      return active.title;
    }
    return msg.senderName;
  }

  String? _resolveMessageAvatarUrl(ChatMessage msg) {
    if (msg.isSent) {
      return widget.user.avatarUrl;
    }
    if (msg.senderAvatarUrl != null && msg.senderAvatarUrl!.isNotEmpty) {
      return msg.senderAvatarUrl;
    }
    for (final m in _roomMembers) {
      if (m.id.isNotEmpty && m.id == msg.senderId && m.avatarUrl != null) {
        return m.avatarUrl;
      }
    }
    for (final d in _directs) {
      if (d.partnerId != null &&
          d.partnerId == msg.senderId &&
          d.avatarUrl != null) {
        return d.avatarUrl;
      }
    }
    final active = _activeConversation;
    if (active != null && !active.isRoom) {
      return active.avatarUrl;
    }
    return null;
  }

  UserPresence _resolveMessagePresence(ChatMessage msg) {
    if (msg.isSent) {
      return _myPresence;
    }
    if (msg.senderId.isNotEmpty && _onlineUserIds.contains(msg.senderId)) {
      return UserPresence.online;
    }
    for (final m in _roomMembers) {
      if (m.id.isNotEmpty && m.id == msg.senderId) {
        return m.presence;
      }
    }
    for (final d in _directs) {
      if (d.partnerId != null &&
          d.partnerId == msg.senderId &&
          d.presence != null) {
        return d.presence!;
      }
    }
    return UserPresence.offline;
  }

  Future<void> _openSenderProfileDialog({
    required String userId,
    required String name,
    required String? avatarUrl,
    required String? role,
    required UserPresence presence,
  }) async {
    await showDialog<void>(
      context: context,
      barrierColor: const Color(0x730F172A),
      builder: (dialogContext) {
        final theme = SkyRippleTheme.of(dialogContext);
        final statusLabel =
            presence == UserPresence.online ? 'Online agora' : 'Offline';
        return Dialog(
          backgroundColor: theme.panelSurface,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(18),
            side: BorderSide(color: theme.borderSubtle),
          ),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 400),
            child: Padding(
              padding: const EdgeInsets.all(22),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  UserAvatar(
                    label: name,
                    avatarUrl: avatarUrl,
                    size: 64,
                    presence: presence,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    name,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: theme.textPrimary,
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    statusLabel,
                    style: TextStyle(
                      color: presence == UserPresence.online
                          ? theme.onlineGreen
                          : theme.textMuted,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  if (role != null) ...[
                    const SizedBox(height: 8),
                    _RolePillBadge(role: role),
                  ],
                  const SizedBox(height: 18),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      AeroButton(
                        label: 'Fechar',
                        variant: AeroButtonVariant.secondary,
                        height: 36,
                        onPressed: () => Navigator.of(dialogContext).pop(),
                      ),
                      if (userId.isNotEmpty && userId != widget.user.id) ...[
                        const SizedBox(width: 8),
                        AeroButton(
                          label: 'Enviar Direct',
                          height: 36,
                          onPressed: () async {
                            final nav = Navigator.of(dialogContext);
                            final conv =
                                await widget.chatClient.getOrCreateDirect(
                              apiUrl: widget.apiUrl,
                              token: widget.token,
                              targetUserId: userId,
                            );
                            nav.pop();
                            if (!mounted) return;
                            final exists = _directs.any((d) => d.id == conv.id);
                            setState(() {
                              if (!exists) {
                                _directs = [conv, ..._directs];
                              }
                              _rosterFilter = _RosterFilter.directs;
                            });
                            await _selectConversation(conv);
                          },
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),
          ),
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
              avatarUrl: widget.user.avatarUrl,
              size: 40,
              presence: _myPresence,
            ),
          ),
          const SizedBox(height: 18),
          _RailIconButton(
            icon: Icons.chat_bubble_rounded,
            tooltip: 'Directs',
            active: _navSection == _NavSection.directs,
            onTap: () {
              setState(() {
                _navSection = _NavSection.directs;
                _rosterFilter = _RosterFilter.directs;
              });
              if (_directs.isNotEmpty) {
                _selectConversation(_directs.first);
              }
            },
          ),
          const SizedBox(height: 8),
          _RailIconButton(
            icon: Icons.forum_rounded,
            tooltip: 'Salas',
            active: _navSection == _NavSection.rooms,
            onTap: () {
              setState(() {
                _navSection = _NavSection.rooms;
                _rosterFilter = _RosterFilter.rooms;
              });
              if (_rooms.isNotEmpty) {
                _selectConversation(_rooms.first);
              }
            },
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
            icon: Icons.refresh_rounded,
            tooltip: 'Atualizar conversas',
            onTap: _loadInitialData,
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
    final onlineDirects =
        _directs.where((d) => d.presence == UserPresence.online).toList();

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
                      onPressed: _openNewDirectDialog,
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
                        onTap: () {
                          setState(() {
                            _rosterFilter = _RosterFilter.directs;
                            _navSection = _NavSection.directs;
                          });
                          if (_directs.isNotEmpty) {
                            _selectConversation(_directs.first);
                          }
                        },
                      ),
                      _SegmentTab(
                        label: 'Salas',
                        active: _rosterFilter == _RosterFilter.rooms,
                        onTap: () {
                          setState(() {
                            _rosterFilter = _RosterFilter.rooms;
                            _navSection = _NavSection.rooms;
                          });
                          if (_rooms.isNotEmpty) {
                            _selectConversation(_rooms.first);
                          }
                        },
                      ),
                    ],
                  ),
                ),
                if (onlineDirects.isNotEmpty) ...[
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
                      itemCount: onlineDirects.length,
                      separatorBuilder: (_, _) => const SizedBox(width: 10),
                      itemBuilder: (context, index) {
                        final contact = onlineDirects[index];
                        return UserAvatar(
                          label: contact.title,
                          avatarUrl: contact.avatarUrl,
                          size: 38,
                          presence: contact.presence,
                          onTap: () => _selectConversation(contact),
                        );
                      },
                    ),
                  ),
                ],
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
            child: _loadingLists
                ? Center(
                    child: CircularProgressIndicator(color: theme.palette.main),
                  )
                : (_statusError != null
                    ? Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              _statusError!,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: theme.textMuted,
                                fontSize: 12.5,
                              ),
                            ),
                            const SizedBox(height: 10),
                            AeroButton(
                              label: 'Tentar novamente',
                              variant: AeroButtonVariant.secondary,
                              height: 34,
                              onPressed: _loadInitialData,
                            ),
                          ],
                        ),
                      )
                    : (items.isEmpty
                        ? Center(
                            child: Text(
                              'Nenhuma conversa encontrada.',
                              style: TextStyle(
                                color: theme.textMuted,
                                fontSize: 12.5,
                              ),
                            ),
                          )
                        : ListView.separated(
                            padding: const EdgeInsets.fromLTRB(10, 0, 10, 14),
                            itemCount: items.length,
                            separatorBuilder: (_, _) =>
                                const SizedBox(height: 4),
                            itemBuilder: (context, index) {
                              final item = items[index];
                              return RosterItem(
                                title: item.title,
                                preview: item.preview,
                                timestamp: item.timestamp,
                                presence: item.presence,
                                avatarUrl: item.avatarUrl,
                                isRoom: item.isRoom,
                                isE2ee: item.isE2ee,
                                unreadCount:
                                    item.id == _selectedId ? 0 : item.unread,
                                selected: item.id == _selectedId,
                                onTap: () => _selectConversation(item),
                              );
                            },
                          ))),
          ),
        ],
      ),
    );
  }

  Widget _buildChatStage(SkyRippleTheme theme) {
    final active = _activeConversation;
    if (active == null) {
      return Container(
        color: theme.stageBackground,
        alignment: Alignment.center,
        child: Text(
          _loadingLists
              ? 'Carregando conversas...'
              : 'Selecione uma conversa ou sala para começar.',
          style: TextStyle(color: theme.textMuted, fontSize: 14),
        ),
      );
    }

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
                  avatarUrl: active.avatarUrl,
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
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: theme.textPrimary,
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        active.subtitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: active.presence == UserPresence.offline
                              ? theme.textMuted
                              : theme.onlineGreen,
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
            child: _loadingMessages
                ? Center(
                    child: CircularProgressIndicator(color: theme.palette.main),
                  )
                : (_messages.isEmpty
                    ? Center(
                        child: Text(
                          'Nenhuma mensagem ainda. Envie a primeira!',
                          style: TextStyle(
                            color: theme.textMuted,
                            fontSize: 13.5,
                          ),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 24,
                          vertical: 20,
                        ),
                        itemCount: _messages.length,
                        itemBuilder: (context, index) {
                          final msg = _messages[index];
                          final prevSender =
                              index > 0 ? _messages[index - 1].senderId : null;
                          final showHeader =
                              index == 0 || prevSender != msg.senderId;
                          final senderName = _resolveMessageSenderName(msg);
                          final senderAvatar = _resolveMessageAvatarUrl(msg);
                          final senderPresence =
                              _resolveMessagePresence(msg);

                          return Padding(
                            padding: EdgeInsets.only(top: showHeader ? 12 : 4),
                            child: Column(
                              crossAxisAlignment: msg.isSent
                                  ? CrossAxisAlignment.end
                                  : CrossAxisAlignment.start,
                              children: [
                                if (showHeader) ...[
                                  MouseRegion(
                                    cursor: msg.isSent
                                        ? MouseCursor.defer
                                        : SystemMouseCursors.click,
                                    child: GestureDetector(
                                      onTap: msg.isSent
                                          ? null
                                          : () => _openSenderProfileDialog(
                                                userId: msg.senderId,
                                                name: senderName,
                                                avatarUrl: senderAvatar,
                                                role: msg.role,
                                                presence: senderPresence,
                                              ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          if (!msg.isSent) ...[
                                            UserAvatar(
                                              label: senderName,
                                              avatarUrl: senderAvatar,
                                              size: 22,
                                              presence: senderPresence,
                                            ),
                                            const SizedBox(width: 6),
                                          ],
                                          Text(
                                            senderName,
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
                                          if (msg.isSent) ...[
                                            const SizedBox(width: 6),
                                            UserAvatar(
                                              label: _displayName,
                                              avatarUrl: widget.user.avatarUrl,
                                              size: 22,
                                              presence: _myPresence,
                                            ),
                                          ],
                                        ],
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                ],
                                ChatBubble(
                                  isSent: msg.isSent,
                                  kind: msg.kind,
                                  text: msg.text,
                                  fileName: msg.fileName ?? 'Arquivo',
                                  fileSize: msg.fileSize ?? '',
                                ),
                              ],
                            ),
                          );
                        },
                      )),
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
                    hintText: 'Escreva uma mensagem...',
                    leadingIcon: Icons.attach_file_rounded,
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                const SizedBox(width: 10),
                AeroButton(
                  label: _sending ? 'Enviando...' : 'Enviar',
                  height: 42,
                  onPressed: _sending ? null : _sendMessage,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFavoritesStage(SkyRippleTheme theme) {
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
                    '${_favorites.length} itens salvos',
                    style: TextStyle(color: theme.textMuted, fontSize: 12),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 20),
          Expanded(
            child: _favorites.isEmpty
                ? Center(
                    child: Text(
                      'Nenhum favorito salvo ainda.',
                      style: TextStyle(color: theme.textMuted, fontSize: 13.5),
                    ),
                  )
                : GridView.builder(
                    gridDelegate:
                        const SliverGridDelegateWithMaxCrossAxisExtent(
                      maxCrossAxisExtent: 340,
                      mainAxisExtent: 92,
                      crossAxisSpacing: 14,
                      mainAxisSpacing: 14,
                    ),
                    itemCount: _favorites.length,
                    itemBuilder: (context, index) {
                      final fav = _favorites[index];
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
                              fav.title,
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
                              fav.subtitle,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: theme.textMuted,
                                fontSize: 12,
                              ),
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
    if (active == null) {
      return const SizedBox.shrink();
    }
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
    ChatConversation active,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Center(
          child: Column(
            children: [
              UserAvatar(
                label: active.title,
                avatarUrl: active.avatarUrl,
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
              const SizedBox(height: 4),
              Text(
                active.subtitle,
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
                'Sessão protegida com token JWT',
                style: TextStyle(
                  color: theme.onlineGreen,
                  fontSize: 12,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildRoomMembersInspector(SkyRippleTheme theme) {
    final owners = _roomMembers.where((m) => m.role == 'Dono').toList();
    final mods = _roomMembers.where((m) => m.role == 'Mod').toList();
    final others = _roomMembers.where((m) => m.role == null).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Membros (${_roomMembers.length})',
          style: TextStyle(
            color: theme.textPrimary,
            fontSize: 16,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 14),
        Expanded(
          child: _roomMembers.isEmpty
              ? Text(
                  'Nenhum membro listado.',
                  style: TextStyle(color: theme.textMuted, fontSize: 12.5),
                )
              : ListView(
                  children: [
                    if (owners.isNotEmpty) ...[
                      _MemberGroupHeader(
                        label: 'Dono (${owners.length})',
                        theme: theme,
                      ),
                      for (final m in owners)
                        _MemberRow(
                          name: m.name,
                          avatarUrl: m.avatarUrl,
                          presence: m.presence,
                          role: m.role,
                          theme: theme,
                        ),
                      const SizedBox(height: 12),
                    ],
                    if (mods.isNotEmpty) ...[
                      _MemberGroupHeader(
                        label: 'Moderadores (${mods.length})',
                        theme: theme,
                      ),
                      for (final m in mods)
                        _MemberRow(
                          name: m.name,
                          avatarUrl: m.avatarUrl,
                          presence: m.presence,
                          role: m.role,
                          theme: theme,
                        ),
                      const SizedBox(height: 12),
                    ],
                    if (others.isNotEmpty) ...[
                      _MemberGroupHeader(
                        label: 'Membros (${others.length})',
                        theme: theme,
                      ),
                      for (final m in others)
                        _MemberRow(
                          name: m.name,
                          avatarUrl: m.avatarUrl,
                          presence: m.presence,
                          theme: theme,
                        ),
                    ],
                  ],
                ),
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
          Text(
            'Suas salas e conversas favoritas sincronizadas com a conta.',
            style: TextStyle(color: theme.textMuted, fontSize: 12.5),
          ),
        ],
      ),
    );
  }
}

class _NewDirectDialog extends StatefulWidget {
  const _NewDirectDialog({
    required this.apiUrl,
    required this.token,
    required this.chatClient,
    required this.onSelected,
  });

  final String apiUrl;
  final String token;
  final ChatApiClient chatClient;
  final Future<void> Function(ChatConversation conv) onSelected;

  @override
  State<_NewDirectDialog> createState() => _NewDirectDialogState();
}

class _NewDirectDialogState extends State<_NewDirectDialog> {
  final _queryCtrl = TextEditingController();
  List<DirectoryUser> _users = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _search('');
  }

  @override
  void dispose() {
    _queryCtrl.dispose();
    super.dispose();
  }

  Future<void> _search(String q) async {
    setState(() => _loading = true);
    try {
      final list = await widget.chatClient.listAvailableUsers(
        apiUrl: widget.apiUrl,
        token: widget.token,
        query: q,
      );
      if (!mounted) return;
      setState(() {
        _users = list;
        _loading = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    return Dialog(
      backgroundColor: theme.panelSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: theme.borderSubtle),
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 420, maxHeight: 480),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Nova conversa direta',
                style: TextStyle(
                  color: theme.textPrimary,
                  fontSize: 17,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 12),
              WellInput(
                controller: _queryCtrl,
                hintText: 'Buscar usuário...',
                leadingIcon: Icons.search_rounded,
                onChanged: _search,
              ),
              const SizedBox(height: 12),
              Expanded(
                child: _loading
                    ? Center(
                        child: CircularProgressIndicator(
                          color: theme.palette.main,
                        ),
                      )
                    : (_users.isEmpty
                        ? Center(
                            child: Text(
                              'Nenhum usuário encontrado.',
                              style: TextStyle(color: theme.textMuted),
                            ),
                          )
                        : ListView.separated(
                            itemCount: _users.length,
                            separatorBuilder: (_, _) =>
                                const SizedBox(height: 6),
                            itemBuilder: (context, index) {
                              final u = _users[index];
                              return ListTile(
                                leading: UserAvatar(
                                  label: u.name,
                                  avatarUrl: u.avatarUrl,
                                  size: 36,
                                  presence: u.online
                                      ? UserPresence.online
                                      : UserPresence.offline,
                                ),
                                title: Text(
                                  u.name,
                                  style: TextStyle(
                                    color: theme.textPrimary,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                subtitle: Text(
                                  u.email,
                                  style: TextStyle(
                                    color: theme.textMuted,
                                    fontSize: 12,
                                  ),
                                ),
                                onTap: () async {
                                  final nav = Navigator.of(context);
                                  final conv =
                                      await widget.chatClient.getOrCreateDirect(
                                    apiUrl: widget.apiUrl,
                                    token: widget.token,
                                    targetUserId: u.id,
                                  );
                                  nav.pop();
                                  await widget.onSelected(conv);
                                },
                              );
                            },
                          )),
              ),
              const SizedBox(height: 10),
              Align(
                alignment: Alignment.centerRight,
                child: AeroButton(
                  label: 'Fechar',
                  variant: AeroButtonVariant.secondary,
                  height: 36,
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ),
            ],
          ),
        ),
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
  });

  final IconData icon;
  final String tooltip;
  final VoidCallback onTap;
  final bool active;

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    return Tooltip(
      message: tooltip,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
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
    this.avatarUrl,
    this.role,
  });

  final String name;
  final String? avatarUrl;
  final UserPresence presence;
  final SkyRippleTheme theme;
  final String? role;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          UserAvatar(
            label: name,
            avatarUrl: avatarUrl,
            size: 28,
            presence: presence,
          ),
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
