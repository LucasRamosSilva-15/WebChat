import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../services/socket';
import { supabase } from '../services/supabase';

export default function MobileRegister() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Erro ao conectar com a Google.');
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

  const handleSubmit = async (e) => {
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
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password })
      });

      if (data?.token) {
        setAuthToken(data.token);
        localStorage.setItem('chat_isLoggedIn', 'true');
        localStorage.setItem('chat_displayName', data.user?.name || name.trim());
        localStorage.setItem('chat_uniqueUserId', data.user?.id || 'user_' + Date.now());

        if (socket) {
          socket.auth = { token: data.token };
          socket.disconnect();
          socket.connect();
        }

        window.dispatchEvent(new Event('profileUpdated'));
        navigate('/rooms', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Erro ao registrar conta. O e-mail pode já estar cadastrado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center px-4 py-8">
      <div className="skeuo-card max-w-md mx-auto w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl border-2 border-sky-400 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(14,165,233,0.35)]">
            SR
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Criar Conta no SkyRipple
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Entre na comunidade com experiência tátil moderna
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-center animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1 ml-1">
              Nome de Exibição
            </label>
            <div className="relative flex items-center">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                required
                className="skeuo-input w-full h-12 min-h-[48px] pl-11 pr-4 text-sm rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1 ml-1">
              E-mail
            </label>
            <div className="relative flex items-center">
              <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                required
                autoComplete="email"
                className="skeuo-input w-full h-12 min-h-[48px] pl-11 pr-4 text-sm rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1 ml-1 mr-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Senha
              </label>
              <span className={`text-[11px] font-bold ${strength.textColor}`}>
                {strength.label}
              </span>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                className="skeuo-input w-full h-12 min-h-[48px] pl-11 pr-12 text-sm rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password && (
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className={`h-full ${strength.color} transition-all duration-300`}
                  style={{ width: strength.percent }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1 ml-1">
              Confirmar Senha
            </label>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita sua senha"
                required
                className="skeuo-input w-full h-12 min-h-[48px] pl-11 pr-12 text-sm rounded-2xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label={showConfirmPassword ? 'Ocultar senha' : 'Ver senha'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1 px-1">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded-md text-sky-600 focus:ring-sky-500 border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="terms" className="text-xs text-slate-600 dark:text-slate-400 select-none">
              Concordo com os <span className="font-semibold text-sky-600 dark:text-sky-400">Termos de Uso</span> e Privacidade.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="skeuo-btn-primary min-h-[48px] w-full rounded-2xl font-bold text-sm text-white shadow-md active:scale-[0.97] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Criando conta...</span>
            ) : (
              <>
                <span>Criar Conta</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest absolute">
            Ou
          </span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn-secondary-glossy min-h-[48px] w-full rounded-2xl font-semibold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-xs cursor-pointer"
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
          <span>Continuar com a Google</span>
        </button>

        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Já possui uma conta?{' '}
          <Link
            to="/login"
            className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
