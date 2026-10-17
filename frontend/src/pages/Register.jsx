import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { FaTimes } from 'react-icons/fa';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../socket';
import { supabase } from '../services/supabase';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsModalType, setTermsModalType] = useState('terms');

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

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!termsAccepted || !privacyAccepted) {
            setError("Você deve concordar com os Termos de Uso e a Política de Privacidade para continuar.");
            return;
        }

        if (username.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
            setLoading(true);
            try {
                const data = await apiRequest('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name: username, email, password })
                });

                setAuthToken(data.token);
                localStorage.setItem('chat_isLoggedIn', 'true');
                localStorage.setItem('chat_displayName', data.user.displayName || data.user.name || username);
                localStorage.setItem('chat_uniqueUserId', data.user.id);

                socket.auth = { token: data.token };
                socket.disconnect();
                socket.connect();

                window.dispatchEvent(new Event('profileUpdated'));
                navigate('/rooms');
            } catch (err) {
                setError(err.message || 'Erro ao criar conta.');
            } finally {
                setLoading(false);
            }
        }
    };

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { percent: '0%', label: 'Insira sua senha', color: 'bg-transparent', textColor: 'text-slate-400 dark:text-slate-500' };
        let score = 0;
        if (pwd.length >= 6) score += 1;
        if (pwd.length >= 10) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (score <= 1) return { percent: '25%', label: 'Fraca', color: 'bg-red-500', textColor: 'text-red-500 dark:text-red-400' };
        if (score === 2) return { percent: '50%', label: 'Razoável', color: 'bg-amber-500', textColor: 'text-amber-500 dark:text-amber-400' };
        if (score === 3 || score === 4) return { percent: '75%', label: 'Boa', color: 'bg-sky-500', textColor: 'text-sky-600 dark:text-sky-400' };
        return { percent: '100%', label: 'Forte', color: 'bg-emerald-500', textColor: 'text-emerald-600 dark:text-emerald-400' };
    };

    const passwordStrength = getPasswordStrength(password);

    return (
        <main className="reveal flex-1 flex flex-col items-center justify-center px-4 py-6">
            <div className="skeuo-card px-7 py-6 sm:px-9 sm:py-7 w-full text-center max-w-[480px] rounded-[28px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)]">
                <h1 className="hero-title font-bold text-2xl sm:text-[28px] mb-1 tracking-tight">
                    Crie a sua conta
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-[13px] mb-5 tracking-tight">
                    Preencha os campos abaixo para iniciar sua jornada
                </p>

                <form className="text-left space-y-3.5" onSubmit={handleRegister}>
                    {error && (
                        <div className="p-2.5 text-xs rounded-lg font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="username">
                            Nome de usuário
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <FiUser className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                id="username"
                                placeholder="Nome de usuário"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                className="skeuo-input w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="email">
                            E-mail
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <FiMail className="w-4 h-4" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                placeholder="E-mail"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="off"
                                className="skeuo-input w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="password">
                            Senha
                        </label>
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
                                autoComplete="new-password"
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
                        <div className="mt-1.5 px-0.5">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">Segurança da chave</span>
                                <span className={`font-semibold ${passwordStrength.textColor}`}>{passwordStrength.label}</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 rounded-full ${passwordStrength.color}`}
                                    style={{ width: passwordStrength.percent }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-0.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                Li e concordo com os{' '}
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setTermsModalType('terms'); setShowTermsModal(true); }}
                                    className="text-sky-600 dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                                >
                                    Termos de Uso
                                </button>
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                                checked={privacyAccepted}
                                onChange={(e) => setPrivacyAccepted(e.target.checked)}
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                                Li e concordo com a{' '}
                                <button
                                    type="button"
                                    onClick={(e) => { e.preventDefault(); setTermsModalType('privacy'); setShowTermsModal(true); }}
                                    className="text-sky-600 dark:text-sky-400 hover:underline font-semibold cursor-pointer"
                                >
                                    Política de Privacidade
                                </button>
                            </span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        aria-label="Cadastrar"
                        className="skeuo-btn w-full py-2.5 text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 rounded-xl shadow-md transition-all active:scale-[0.99] mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || !termsAccepted || !privacyAccepted}
                    >
                        {loading ? 'Cadastrando...' : (
                            <>
                                <span>Criar Conta no SkyRipple</span>
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
                    <Link to="/login" className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium">
                        Já possui uma conta? Entrar aqui ›
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

            {showTermsModal && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up-1">
                    <div className="skeuo-card w-full max-w-2xl p-6 sm:p-7 flex flex-col gap-4 shadow-2xl relative rounded-[24px]">
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors z-10 cursor-pointer"
                            aria-label="Fechar"
                        >
                            <FaTimes size={18} />
                        </button>

                        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                                    {termsModalType === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">SkyRipple Security</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3.5 h-[50vh] min-h-[260px] overflow-y-auto pr-2 chat-container text-left text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                            <p>
                                <strong>1. Introdução</strong><br />
                                Ao utilizar nossos serviços, você concorda com as diretrizes e regras de utilização da plataforma SkyRipple.
                            </p>
                            <p>
                                <strong>2. Coleta de Dados</strong><br />
                                Coletamos apenas as informações estritamente necessárias para a autenticação e funcionamento do chat (nome de usuário, e-mail e credenciais protegidas).
                            </p>
                            <p>
                                <strong>3. Responsabilidade do Usuário</strong><br />
                                O usuário compromete-se a não utilizar a plataforma para atividades ilícitas, spam ou discursos de ódio.
                            </p>
                            <p>
                                <strong>4. Propriedade Intelectual</strong><br />
                                Todo o código, identidade visual e marca são de propriedade exclusiva do SkyRipple.
                            </p>
                            <p>
                                <strong>5. Alterações nos Termos</strong><br />
                                Reservamo-nos o direito de atualizar estas diretrizes periodicamente, notificando os utilizadores sobre mudanças substanciais.
                            </p>
                        </div>

                        <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowTermsModal(false)}
                                className="skeuo-btn py-1.5 px-5 text-xs font-semibold rounded-xl cursor-pointer"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </main>
    );
};

export default Register;
