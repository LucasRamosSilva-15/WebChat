import 'package:flutter_svg/flutter_svg.dart';
import 'package:material_ui/material_ui.dart';
import '../models/user_session.dart';
import '../services/auth_service.dart';
import '../theme/skyripple_theme.dart';
import '../widgets/aero_button.dart';
import '../widgets/well_input.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({
    super.key,
    required this.authClient,
    required this.apiUrl,
    required this.onApiUrlChanged,
    required this.onAuthenticated,
    required this.onToggleTheme,
  });

  final AuthApiClient authClient;
  final String apiUrl;
  final ValueChanged<String> onApiUrlChanged;
  final void Function(AuthResult result, bool keepSession) onAuthenticated;
  final VoidCallback onToggleTheme;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isRegister = false;
  bool _keepSession = true;
  bool _loading = false;
  String? _errorMessage;

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (_isRegister && name.isEmpty) {
      setState(() => _errorMessage = 'Informe seu nome de exibição.');
      return;
    }
    if (email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Preencha e-mail e senha.');
      return;
    }

    setState(() {
      _loading = true;
      _errorMessage = null;
    });

    try {
      final result = _isRegister
          ? await widget.authClient.register(
              apiUrl: widget.apiUrl,
              name: name,
              email: email,
              password: password,
            )
          : await widget.authClient.login(
              apiUrl: widget.apiUrl,
              email: email,
              password: password,
            );
      if (!mounted) {
        return;
      }
      widget.onAuthenticated(result, _keepSession);
    } on AuthApiException catch (err) {
      if (!mounted) {
        return;
      }
      setState(() => _errorMessage = err.message);
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  Future<void> _editServerUrl() async {
    await showDialog<void>(
      context: context,
      builder: (_) => _ServerUrlDialog(
        initialUrl: widget.apiUrl,
        onSave: widget.onApiUrlChanged,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    final width = MediaQuery.sizeOf(context).width;
    final showHero = width >= 880;

    return Scaffold(
      body: Row(
        children: [
          if (showHero)
            const Expanded(
              flex: 5,
              child: _SkyHeroPanel(),
            ),
          Expanded(
            flex: 6,
            child: Container(
              color: theme.stageBackground,
              alignment: Alignment.center,
              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _isRegister ? 'Criar sua conta' : 'Bem-vindo de volta',
                      style: TextStyle(
                        color: theme.textPrimary,
                        fontSize: 28,
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _isRegister
                          ? 'Configure seu acesso no SkyRipple Desktop.'
                          : 'Entre para continuar suas conversas.',
                      style: TextStyle(
                        color: theme.textMuted,
                        fontSize: 13.5,
                      ),
                    ),
                    const SizedBox(height: 20),
                    if (_errorMessage != null) ...[
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 10,
                        ),
                        decoration: BoxDecoration(
                          color: theme.busyRed.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(
                            color: theme.busyRed.withValues(alpha: 0.45),
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              Icons.error_outline_rounded,
                              size: 16,
                              color: theme.busyRed,
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: TextStyle(
                                  color: theme.busyRed,
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14),
                    ],
                    if (_isRegister) ...[
                      _FieldLabel(label: 'Nome de exibição', theme: theme),
                      const SizedBox(height: 6),
                      WellInput(
                        controller: _nameController,
                        hintText: 'Lucas Ramos',
                        leadingIcon: Icons.person_outline_rounded,
                      ),
                      const SizedBox(height: 14),
                    ],
                    _FieldLabel(label: 'E-mail', theme: theme),
                    const SizedBox(height: 6),
                    WellInput(
                      controller: _emailController,
                      hintText: 'seu@email.com',
                      leadingIcon: Icons.mail_outline_rounded,
                    ),
                    const SizedBox(height: 14),
                    _FieldLabel(label: 'Senha', theme: theme),
                    const SizedBox(height: 6),
                    WellInput(
                      controller: _passwordController,
                      hintText: '••••••••••••',
                      leadingIcon: Icons.lock_outline_rounded,
                      obscureText: true,
                      enableObscureToggle: true,
                      onSubmitted: (_) => _loading ? null : _submit(),
                    ),
                    const SizedBox(height: 12),
                    if (!_isRegister)
                      SizedBox(
                        width: double.infinity,
                        child: Wrap(
                          alignment: WrapAlignment.spaceBetween,
                          crossAxisAlignment: WrapCrossAlignment.center,
                          spacing: 8,
                          runSpacing: 6,
                          children: [
                            InkWell(
                              onTap: () => setState(
                                () => _keepSession = !_keepSession,
                              ),
                              borderRadius: BorderRadius.circular(6),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  SizedBox(
                                    width: 18,
                                    height: 18,
                                    child: Checkbox(
                                      value: _keepSession,
                                      onChanged: (v) => setState(
                                        () => _keepSession = v ?? true,
                                      ),
                                      materialTapTargetSize:
                                          MaterialTapTargetSize.shrinkWrap,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    'Manter sessão ativa',
                                    style: TextStyle(
                                      color: theme.textSecondary,
                                      fontSize: 12.5,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            TextButton(
                              onPressed: () {},
                              child: Text(
                                'Esqueceu a senha?',
                                style: TextStyle(
                                  color: theme.palette.main,
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    const SizedBox(height: 16),
                    AeroButton(
                      label: _loading
                          ? 'Conectando...'
                          : (_isRegister
                              ? 'Criar conta no SkyRipple'
                              : 'Entrar no SkyRipple'),
                      expanded: true,
                      onPressed: _loading ? null : _submit,
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(child: Divider(color: theme.borderSubtle)),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          child: Text(
                            'ou',
                            style: TextStyle(
                              color: theme.textMuted,
                              fontSize: 12,
                            ),
                          ),
                        ),
                        Expanded(child: Divider(color: theme.borderSubtle)),
                      ],
                    ),
                    const SizedBox(height: 16),
                    AeroButton(
                      label: 'Continuar com a Google',
                      variant: AeroButtonVariant.secondary,
                      expanded: true,
                      leading: const _GoogleLogoIcon(size: 17),
                      onPressed: _loading
                          ? null
                          : () => setState(
                                () => _errorMessage =
                                    'Autenticação com Google disponível em breve neste cliente.',
                              ),
                    ),
                    const SizedBox(height: 20),
                    SizedBox(
                      width: double.infinity,
                      child: Wrap(
                        alignment: WrapAlignment.spaceBetween,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        spacing: 8,
                        runSpacing: 6,
                        children: [
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                _isRegister
                                    ? 'Já possui conta? '
                                    : 'Ainda não tem conta? ',
                                style: TextStyle(
                                  color: theme.textMuted,
                                  fontSize: 12.5,
                                ),
                              ),
                              GestureDetector(
                                onTap: () => setState(() {
                                  _isRegister = !_isRegister;
                                  _errorMessage = null;
                                }),
                                child: MouseRegion(
                                  cursor: SystemMouseCursors.click,
                                  child: Text(
                                    _isRegister ? 'Entrar' : 'Criar conta',
                                    style: TextStyle(
                                      color: theme.palette.main,
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              InkWell(
                                onTap: widget.onToggleTheme,
                                borderRadius: BorderRadius.circular(8),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        theme.isDark
                                            ? Icons.dark_mode_rounded
                                            : Icons.light_mode_rounded,
                                        size: 14,
                                        color: theme.textMuted,
                                      ),
                                      const SizedBox(width: 5),
                                      Text(
                                        theme.isDark
                                            ? 'Tema escuro'
                                            : 'Tema claro',
                                        style: TextStyle(
                                          color: theme.textMuted,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                              InkWell(
                                onTap: _editServerUrl,
                                borderRadius: BorderRadius.circular(8),
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 4,
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(
                                        Icons.dns_outlined,
                                        size: 14,
                                        color: theme.textMuted,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Servidor',
                                        style: TextStyle(
                                          color: theme.textMuted,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _FieldLabel extends StatelessWidget {
  const _FieldLabel({required this.label, required this.theme});

  final String label;
  final SkyRippleTheme theme;

  @override
  Widget build(BuildContext context) {
    return Text(
      label,
      style: TextStyle(
        color: theme.textPrimary,
        fontSize: 12.5,
        fontWeight: FontWeight.w600,
      ),
    );
  }
}

class _SkyHeroPanel extends StatelessWidget {
  const _SkyHeroPanel();

  @override
  Widget build(BuildContext context) {
    return ClipRect(
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0066CC),
              Color(0xFF0078E7),
              Color(0xFF2997FF),
            ],
            stops: [0.0, 0.52, 1.0],
          ),
        ),
        child: Stack(
          children: [
            const Positioned(
              top: 68,
              right: 56,
              child: _WaterOrb(size: 128),
            ),
            const Positioned(
              bottom: 152,
              right: 96,
              child: _WaterOrb(size: 86),
            ),
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              height: 150,
              child: CustomPaint(
                painter: _CloudWavePainter(),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(44),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      SvgPicture.asset(
                        'assets/images/logo_32x32_transparente.svg',
                        width: 32,
                        height: 32,
                      ),
                      const SizedBox(width: 10),
                      const Text(
                        'SkyRipple',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          letterSpacing: -0.3,
                        ),
                      ),
                    ],
                  ),
                const Spacer(),
                const Text(
                  'Conversas em tempo real\ncom privacidade absoluta',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 32,
                    fontWeight: FontWeight.w800,
                    height: 1.18,
                    letterSpacing: -0.6,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Um lugar para conectar pessoas, ideias e comunidades.',
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: 0.90),
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 28),
                const _FeatureGlassPill(
                  icon: Icons.auto_awesome_rounded,
                  label: 'Chat Instantâneo',
                ),
                const SizedBox(height: 12),
                const _FeatureGlassPill(
                  icon: Icons.shield_outlined,
                  label: 'Criptografia E2EE',
                ),
                const SizedBox(height: 12),
                const _FeatureGlassPill(
                  icon: Icons.forum_outlined,
                  label: 'Salas Temáticas',
                ),
                const Spacer(flex: 2),
              ],
            ),
          ),
        ],
      ),
      ),
    );
  }
}

class _WaterOrb extends StatelessWidget {
  const _WaterOrb({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          center: const Alignment(-0.32, -0.32),
          radius: 0.85,
          colors: [
            Colors.white.withValues(alpha: 0.35),
            Colors.white.withValues(alpha: 0.08),
          ],
        ),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.55),
          width: 1.4,
        ),
      ),
      child: Align(
        alignment: const Alignment(-0.48, -0.48),
        child: Container(
          width: size * 0.14,
          height: size * 0.08,
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.85),
            borderRadius: BorderRadius.circular(size),
          ),
        ),
      ),
    );
  }
}

class _FeatureGlassPill extends StatelessWidget {
  const _FeatureGlassPill({
    required this.icon,
    required this.label,
  });

  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minWidth: 224),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        color: Colors.white.withValues(alpha: 0.22),
        border: Border.all(
          color: Colors.white.withValues(alpha: 0.52),
          width: 1,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 16),
          const SizedBox(width: 10),
          Text(
            label,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 13.5,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _ServerUrlDialog extends StatefulWidget {
  const _ServerUrlDialog({
    required this.initialUrl,
    required this.onSave,
  });

  final String initialUrl;
  final ValueChanged<String> onSave;

  @override
  State<_ServerUrlDialog> createState() => _ServerUrlDialogState();
}

class _ServerUrlDialogState extends State<_ServerUrlDialog> {
  late final TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.initialUrl);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = SkyRippleTheme.of(context);
    return Dialog(
      backgroundColor: theme.panelSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: theme.borderSubtle),
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 420),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Servidor SkyRipple',
                style: TextStyle(
                  color: theme.textPrimary,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(height: 10),
              WellInput(
                controller: _controller,
                hintText: 'https://webchat-9vqr.onrender.com/api',
                leadingIcon: Icons.dns_outlined,
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  AeroButton(
                    label: 'Cancelar',
                    variant: AeroButtonVariant.secondary,
                    height: 36,
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                  const SizedBox(width: 8),
                  AeroButton(
                    label: 'Salvar',
                    height: 36,
                    onPressed: () {
                      final next = _controller.text.trim();
                      if (next.isNotEmpty) {
                        widget.onSave(next);
                      }
                      Navigator.of(context).pop();
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CloudWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final backWave = Path()
      ..moveTo(0, size.height * 0.58)
      ..quadraticBezierTo(
        size.width * 0.25,
        size.height * 0.18,
        size.width * 0.52,
        size.height * 0.48,
      )
      ..quadraticBezierTo(
        size.width * 0.78,
        size.height * 0.76,
        size.width,
        size.height * 0.36,
      )
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    final backPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Colors.white.withValues(alpha: 0.26),
          Colors.white.withValues(alpha: 0.08),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(backWave, backPaint);

    final frontWave = Path()
      ..moveTo(0, size.height * 0.72)
      ..quadraticBezierTo(
        size.width * 0.30,
        size.height * 0.42,
        size.width * 0.60,
        size.height * 0.66,
      )
      ..quadraticBezierTo(
        size.width * 0.82,
        size.height * 0.84,
        size.width,
        size.height * 0.56,
      )
      ..lineTo(size.width, size.height)
      ..lineTo(0, size.height)
      ..close();

    final frontPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          Colors.white.withValues(alpha: 0.34),
          Colors.white.withValues(alpha: 0.12),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(frontWave, frontPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _GoogleLogoIcon extends StatelessWidget {
  const _GoogleLogoIcon({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: CustomPaint(
        painter: _GoogleLogoPainter(),
      ),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final stroke = size.width * 0.22;
    final rect = Rect.fromCircle(
      center: center,
      radius: (size.width - stroke) / 2,
    );

    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.butt;

    paint.color = const Color(0xFFEA4335);
    canvas.drawArc(rect, -2.55, 1.85, false, paint);

    paint.color = const Color(0xFFFBBC05);
    canvas.drawArc(rect, 2.35, 1.38, false, paint);

    paint.color = const Color(0xFF34A853);
    canvas.drawArc(rect, 0.72, 1.63, false, paint);

    paint.color = const Color(0xFF4285F4);
    canvas.drawArc(rect, -0.10, 0.88, false, paint);

    final barPaint = Paint()
      ..color = const Color(0xFF4285F4)
      ..strokeWidth = stroke
      ..strokeCap = StrokeCap.butt;
    canvas.drawLine(
      Offset(center.dx, center.dy),
      Offset(size.width * 0.94, center.dy),
      barPaint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
