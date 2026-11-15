import 'package:material_ui/material_ui.dart';
import '../theme/skyripple_theme.dart';
import '../widgets/aero_button.dart';
import '../widgets/well_input.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({
    super.key,
    required this.onAuthenticated,
    required this.onToggleTheme,
  });

  final VoidCallback onAuthenticated;
  final VoidCallback onToggleTheme;

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _isRegister = false;
  bool _keepSession = true;
  bool _otpStep = false;

  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _otpController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _otpController.dispose();
    super.dispose();
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
                      _isRegister
                          ? (_otpStep ? 'Verificar código' : 'Criar sua conta')
                          : 'Bem-vindo de volta',
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
                          ? (_otpStep
                              ? 'Digite o código de 6 dígitos enviado para seu e-mail.'
                              : 'Configure seu acesso no SkyRipple Desktop.')
                          : 'Entre para continuar suas conversas.',
                      style: TextStyle(
                        color: theme.textMuted,
                        fontSize: 13.5,
                      ),
                    ),
                    const SizedBox(height: 24),
                    if (_isRegister && _otpStep) ...[
                      _FieldLabel(label: 'Código OTP', theme: theme),
                      const SizedBox(height: 6),
                      WellInput(
                        controller: _otpController,
                        hintText: '000000',
                        leadingIcon: Icons.verified_user_outlined,
                      ),
                      const SizedBox(height: 20),
                      AeroButton(
                        label: 'Confirmar e entrar',
                        expanded: true,
                        onPressed: widget.onAuthenticated,
                      ),
                      const SizedBox(height: 12),
                      AeroButton(
                        label: 'Voltar para cadastro',
                        variant: AeroButtonVariant.ghost,
                        expanded: true,
                        onPressed: () => setState(() => _otpStep = false),
                      ),
                    ] else ...[
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
                        label: _isRegister
                            ? 'Continuar para verificação'
                            : 'Entrar no SkyRipple',
                        expanded: true,
                        onPressed: () {
                          if (_isRegister) {
                            setState(() => _otpStep = true);
                          } else {
                            widget.onAuthenticated();
                          }
                        },
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
                        leading: const Text(
                          'G',
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 15,
                          ),
                        ),
                        onPressed: widget.onAuthenticated,
                      ),
                    ],
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
                                _otpStep = false;
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
                                  theme.isDark ? 'Tema escuro' : 'Tema claro',
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
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF0280FF),
            Color(0xFF42A5FF),
            Color(0xFFB8DCFF),
          ],
          stops: [0.0, 0.55, 1.0],
        ),
      ),
      child: Stack(
        children: [
          const Positioned(
            top: 86,
            right: 52,
            child: _WaterOrb(size: 148),
          ),
          const Positioned(
            bottom: 130,
            right: 78,
            child: _WaterOrb(size: 104),
          ),
          Positioned(
            bottom: -48,
            left: -40,
            right: -40,
            height: 150,
            child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(120),
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.white.withValues(alpha: 0.45),
                    Colors.white.withValues(alpha: 0.12),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(44),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withValues(alpha: 0.30),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.75),
                          width: 1.5,
                        ),
                      ),
                      child: const Center(
                        child: SizedBox(
                          width: 10,
                          height: 10,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),
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
