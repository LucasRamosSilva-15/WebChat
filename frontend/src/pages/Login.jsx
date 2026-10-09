import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FiUser, FiLock, FiEye, FiEyeOff, FiKey, FiArrowRight } from 'react-icons/fi';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../socket';

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
                            <Link to="#" className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium">
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

                    <div className="flex items-center my-3.5">
                        <div className="flex-1 border-t border-slate-200 dark:border-white/10"></div>
                        <span className="px-3 text-[11px] font-medium tracking-wide text-slate-400 dark:text-slate-500">ou acesse via</span>
                        <div className="flex-1 border-t border-slate-200 dark:border-white/10"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            className="btn-secondary-glossy py-2 px-3 text-xs flex items-center justify-center gap-2 font-medium opacity-60 cursor-not-allowed rounded-xl"
                            disabled
                        >
                            <FcGoogle className="w-4 h-4 shrink-0" />
                            <span>Google</span>
                        </button>
                        <button
                            type="button"
                            className="btn-secondary-glossy py-2 px-3 text-xs flex items-center justify-center gap-2 font-medium opacity-60 cursor-not-allowed rounded-xl"
                            disabled
                        >
                            <FiKey className="w-4 h-4 shrink-0 text-slate-500" />
                            <span>Chave Passkey</span>
                        </button>
                    </div>
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
