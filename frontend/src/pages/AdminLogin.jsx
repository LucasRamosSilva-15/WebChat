import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(apiUrl + '/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('admin_token', data.token);
                navigate('/admin');
            } else {
                setError(data.error || 'Senha incorreta.');
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="reveal flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="skeuo-card px-7 py-8 sm:px-9 sm:py-9 w-full text-center max-w-[440px] rounded-[28px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)]">
                <div className="flex justify-center mb-3">
                    <img
                        src="/admin_shield.svg"
                        alt="Escudo de Segurança SkyRipple"
                        className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_10px_25px_rgba(0,102,204,0.3)] hover:scale-105 transition-transform duration-300"
                    />
                </div>

                <h1 className="hero-title font-bold text-2xl sm:text-[28px] mb-1 tracking-tight">
                    Painel Administrativo
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-[13px] mb-6 tracking-tight">
                    Acesso restrito para controle e segurança da nuvem SkyRipple
                </p>

                <form onSubmit={handleLogin} className="text-left space-y-4">
                    {error && (
                        <div className="p-2.5 text-xs rounded-lg font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="admin-password">
                            Senha Mestra
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <FiLock className="w-4 h-4" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="admin-password"
                                placeholder="Digite a senha mestra"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="off"
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

                    <button
                        type="submit"
                        disabled={loading}
                        aria-label="Acessar Painel"
                        className="skeuo-btn w-full py-2.5 text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 rounded-xl shadow-md transition-all active:scale-[0.99] mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Autenticando...' : (
                            <>
                                <span>Entrar no Painel</span>
                                <FiArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-5 pt-1 text-center">
                    <Link to="/" className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium">
                        ‹ Voltar para o Início
                    </Link>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 shadow-sm text-[11px] text-slate-500 dark:text-slate-400 backdrop-blur-[4px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">SkyRipple Security Shield</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>Criptografia AES-256 e Acesso Root</span>
                </div>
            </div>
        </main>
    );
};

export default AdminLogin;
