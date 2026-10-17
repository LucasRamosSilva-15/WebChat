import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../socket';
import { supabase } from '../services/supabase';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [sessionExpiredNotice, setSessionExpiredNotice] = useState(() => {
        return !!(location.state?.sessionExpired || new URLSearchParams(window.location.search).get('expired') === 'true');
    });
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/`,
                },
            });
            if (error) throw error;
        } catch (error) {
            console.error('Erro na autenticação com a Google:', error.message);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setSessionExpiredNotice(false);

        if (email.trim() !== "" && password.trim() !== "") {
            setLoading(true);
            try {
                const data = await apiRequest('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                setAuthToken(data.token);
                localStorage.setItem('chat_isLoggedIn', 'true');
                localStorage.setItem('chat_displayName', data.user.name);
                localStorage.setItem('chat_uniqueUserId', data.user.id);

                socket.auth = { token: data.token };
                socket.disconnect();
                socket.connect();

                window.dispatchEvent(new Event('profileUpdated'));
                navigate('/rooms');
            } catch (err) {
                setError(err.message || 'Erro ao fazer login.');
            } finally {
                setLoading(false);
            }
        }
    };
    return (
        <main className="reveal flex-1 flex flex-col items-center justify-center px-4 py-6">
            <div className="skeuo-card px-7 py-6 sm:px-9 sm:py-7 w-full text-center max-w-[480px] rounded-[28px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)]">
                <h1 className="hero-title font-bold text-2xl sm:text-[28px] mb-1 tracking-tight">
                    Bem-vindo de volta
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-[13px] mb-5 tracking-tight">
                    Insira suas credenciais para navegar na sua nuvem
                </p>
                <form className="text-left space-y-3.5" onSubmit={handleLogin}>
                    {sessionExpiredNotice && !error && (
                        <div className="p-2.5 text-xs rounded-lg font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            Sua sessão expirou. Por favor, faça login novamente para continuar.
                        </div>
                    )}
                    {error && (
                        <div className="p-2.5 text-xs rounded-lg font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
                            E-mail ou Utilizador
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <FiUser className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                placeholder="E-mail"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="skeuo-input w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300" htmlFor="password">
                                Senha
                            </label>
                            <Link to="/forgot-password" className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium">
                                Esqueceu a senha?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <FiLock className="w-4 h-4" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                placeholder="Senha"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="skeuo-input w-full pl-9 pr-10 py-2.5 text-sm rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                tabIndex={-1}
                                aria-label={showPassword ? "Ocultar senha" : "Ver senha"}
                            >
                                {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                                defaultChecked
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                Manter sessão ativa
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        aria-label="Continuar"
                        className="skeuo-btn w-full py-2.5 text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 rounded-xl shadow-md transition-all active:scale-[0.99] mt-2 cursor-pointer"
                        disabled={loading}
                    >
                        {loading ? 'Entrando...' : (
                            <>
                                <span>Entrar no SkyRipple</span>
                                <FiArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200/80 dark:border-slate-700/60" />
                        </div>
                        <div className="relative flex justify-center text-[11px] uppercase">
                            <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">
                                ou
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="btn-secondary-glossy w-full py-2.5 px-4 text-xs sm:text-sm flex items-center justify-center gap-2.5 font-medium rounded-xl hover:opacity-90 transition-opacity cursor-pointer text-slate-700 dark:text-slate-200"
                    >
                        <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        </svg>
                        <span>Continuar com a Google</span>
                    </button>
                </form>

                <div className="mt-4 pt-1">
                    <Link to="/register" className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium">
                        Ainda não tem uma conta? Crie a sua aqui ›
                    </Link>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 shadow-sm text-[11px] text-slate-500 dark:text-slate-400 backdrop-blur-[4px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">SkyRipple ID v2.4</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>Autenticação biométrica e nuvem resiliente</span>
                </div>
            </div>
        </main>
    );
};

export default Login;
