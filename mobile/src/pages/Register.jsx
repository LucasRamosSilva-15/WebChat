import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, MailCheck, ArrowLeft } from 'lucide-react';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../services/socket';
import { supabase, syncOAuthUserSession, handleGoogleSignIn } from '../services/supabase';
import OtpCodeInput from '../components/common/OtpCodeInput';

export default function MobileRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      localStorage.setItem('auth_source', 'mobile');
      const synced = await handleGoogleSignIn();
      if (synced?.token) {
        navigate('/rooms', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Erro ao conectar com a Google.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { percent: '0%', label: 'Insira a senha', color: 'bg-transparent', textColor: 'text-slate-400' };
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score += 25;

    if (score <= 25) return { percent: '25%', label: 'Muito Fraca', color: 'bg-rose-500', textColor: 'text-rose-500' };
    if (score <= 50) return { percent: '50%', label: 'Razoável', color: 'bg-amber-500', textColor: 'text-amber-500' };
    if (score <= 75) return { percent: '75%', label: 'Boa', color: 'bg-sky-500', textColor: 'text-sky-500' };
    return { percent: '100%', label: 'Forte & Segura', color: 'bg-emerald-500', textColor: 'text-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (!termsAccepted) {
      setError('É necessário concordar com os Termos de Uso do SkyRipple.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            full_name: name.trim()
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      setStep(2);
    } catch (err) {
      try {
        const fallback = await apiRequest('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
        });
        if (fallback?.token) {
          setAuthToken(fallback.token);
          localStorage.setItem('chat_isLoggedIn', 'true');
          localStorage.setItem('chat_displayName', fallback.user?.name || name.trim());
          localStorage.setItem('chat_uniqueUserId', fallback.user?.id || 'user_' + Date.now());
          if (socket) {
            socket.auth = { token: fallback.token };
            socket.disconnect();
            socket.connect();
          }
          window.dispatchEvent(new Event('profileUpdated'));
          navigate('/rooms', { replace: true });
          return;
        }
      } catch {
      }
      setError(err.message || 'Erro ao registrar conta. O e-mail pode já estar cadastrado.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify) => {
    const code = codeToVerify || otpCode;
    if (!code || code.length < 6) {
      setError('Por favor, digite o código de 6 dígitos completo.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'signup'
      });

      if (verifyError) {
        throw verifyError;
      }

      if (data?.session) {
        try {
          await syncOAuthUserSession(data.session);
        } catch (syncErr) {
          console.warn('Falha na sincronização após OTP:', syncErr.message);
        }
      }

      localStorage.setItem('chat_isLoggedIn', 'true');
      localStorage.setItem('chat_displayName', data?.user?.user_metadata?.name || name.trim());
      localStorage.setItem('chat_uniqueUserId', data?.user?.id || 'user_' + Date.now());

      if (socket) {
        socket.disconnect();
        socket.connect();
      }

      window.dispatchEvent(new Event('profileUpdated'));
      navigate('/rooms', { replace: true });
    } catch (err) {
      setError(err.message || 'Código de verificação incorreto ou expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setResending(true);
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim()
      });

      if (resendError) {
        await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
              full_name: name.trim()
            }
          }
        });
      }
    } catch (err) {
      setError(err.message || 'Erro ao reenviar código de confirmação.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="anim-page-enter min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center px-4 pt-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <div className="anim-fade-rise skeuo-card max-w-md mx-auto w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {step === 1 ? (
          <>
            <div className="text-center mb-6">
              <img
                src="/logo_512x512_transparente.svg"
                alt="SkyRipple Logo"
                className="w-16 h-16 mx-auto mb-3 object-contain drop-shadow-[0_8px_20px_rgba(0,102,204,0.25)] select-none"
              />
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Criar Conta no SkyRipple
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Etapa 1 de 2: Seus dados cadastrais
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-center animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmitStep1} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Nome Completo
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="skeuo-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                    required
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  E-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="skeuo-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
                    required
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="skeuo-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Ver senha"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Força da senha:</span>
                      <span className={`font-bold ${strength.textColor}`}>{strength.label}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.percent }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    className="skeuo-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                    required
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="Ver confirmação de senha"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    Concordo com os Termos de Serviço e Política de Privacidade do SkyRipple.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="skeuo-btn-primary w-full min-h-[48px] rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>{loading ? 'Preparando cadastro...' : 'Continuar para Verificação'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold text-[10px] tracking-wider">
                  ou registre com
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="btn-secondary-glossy w-full min-h-[44px] rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 active:scale-95 transition-transform cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar com Google</span>
            </button>

            <div className="text-center mt-5">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Já possui uma conta?{' '}
                <Link
                  to="/login"
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-2 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-sky-50 dark:bg-sky-950/60 border-2 border-sky-400 flex items-center justify-center text-sky-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(14,165,233,0.3)] mb-4">
              <MailCheck className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              Confirme seu e-mail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Digite o código de 6 dígitos enviado para <br />
              <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-center animate-fade-in">
                {error}
              </div>
            )}

            <div className="mb-6">
              <OtpCodeInput
                length={6}
                value={otpCode}
                onChange={setOtpCode}
                onComplete={handleVerifyOtp}
                onResend={handleResendOtp}
                disabled={loading}
                error={Boolean(error)}
                resending={resending}
              />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleVerifyOtp(otpCode)}
                disabled={loading || otpCode.length < 6}
                className="skeuo-btn-primary w-full min-h-[48px] rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Validando código...' : 'Confirmar e Entrar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep(1);
                }}
                className="btn-secondary-glossy w-full min-h-[44px] rounded-2xl font-semibold text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 active:scale-95 transition-transform cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar e alterar dados</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
