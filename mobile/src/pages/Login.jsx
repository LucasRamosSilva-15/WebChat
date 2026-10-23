import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../services/socket';
import { supabase, handleGoogleSignIn } from '../services/supabase';

export default function MobileLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password })
      });

      if (data?.token) {
        setAuthToken(data.token);
        localStorage.setItem('chat_isLoggedIn', 'true');
        localStorage.setItem('chat_displayName', data.user?.name || data.user?.displayName || 'Usuário');
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
      setError(err.message || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anim-page-enter h-[100dvh] overflow-y-auto overscroll-y-contain skeuo-scrollbar bg-slate-100 dark:bg-slate-950 flex flex-col px-4 pt-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <div className="anim-fade-rise skeuo-card max-w-md mx-auto my-auto w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <img
            src="/logo_512x512_transparente.svg"
            alt="SkyRipple Logo"
            className="w-16 h-16 mx-auto mb-3 object-contain drop-shadow-[0_8px_20px_rgba(0,102,204,0.25)] select-none"
          />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            SkyRipple Mobile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conecte-se à sua nuvem em qualquer lugar
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-center animate-fade-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 block mb-1.5 ml-1">
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
            <div className="flex items-center justify-between mb-1.5 ml-1 mr-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Palavra-passe
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Esqueceu-se?
              </Link>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="skeuo-btn-primary min-h-[48px] w-full rounded-2xl font-bold text-sm text-white shadow-md active:scale-[0.97] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar no SkyRipple</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-5 flex items-center justify-center">
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

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          Ainda não tem conta?{' '}
          <Link
            to="/register"
            className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
