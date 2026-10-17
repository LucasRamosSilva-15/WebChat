import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const cleanEmail = email.trim();
        if (!cleanEmail) {
            setError('Por favor, informe o seu endereço de e-mail.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            setError('Por favor, insira um formato de e-mail válido.');
            return;
        }

        setLoading(true);

        try {
            const redirectUrl = `${window.location.origin}/login`;
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
                redirectTo: redirectUrl,
            });

            if (resetError) {
                setError(resetError.message || 'Não foi possível solicitar a recuperação. Tente novamente mais tarde.');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError(err.message || 'Ocorreu um erro inesperado ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="reveal flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="skeuo-card px-7 py-8 sm:px-9 sm:py-9 w-full text-center max-w-[460px] rounded-[28px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)] relative transition-all">
                {success ? (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="skeuo-surface-orb-badge w-16 h-16 rounded-full flex items-center justify-center mb-4 text-emerald-500 dark:text-emerald-400 shadow-md">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <h2 className="hero-title font-bold text-2xl sm:text-[26px] mb-2 tracking-tight text-slate-800 dark:text-slate-100">
                            Verifique o seu e-mail
                        </h2>

                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-sm mx-auto">
                            Enviamos um link com as instruções de redefinição para{' '}
                            <strong className="text-slate-900 dark:text-white font-semibold break-all">{email}</strong>.
                            Por favor, verifique a sua caixa de entrada e pasta de spam.
                        </p>

                        <div className="w-full space-y-3">
                            <Link
                                to="/login"
                                className="skeuo-btn-primary w-full py-2.5 px-4 text-sm font-semibold text-white rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                            >
                                <ArrowLeft className="w-4 h-4" /> Voltar para o Login
                            </Link>

                            <button
                                type="button"
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail('');
                                }}
                                className="btn-secondary-glossy w-full py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> Enviar para outro e-mail
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="skeuo-surface-orb-badge w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400 shadow-md">
                            <KeyRound className="w-7 h-7" />
                        </div>

                        <h1 className="hero-title font-bold text-2xl sm:text-[26px] mb-1.5 tracking-tight text-slate-800 dark:text-slate-100">
                            Recuperar Senha
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-[13px] mb-6 tracking-tight leading-relaxed">
                            Insira o seu e-mail cadastrado e enviaremos um link de acesso seguro para redefinir a sua senha.
                        </p>

                        <form noValidate onSubmit={handleSubmit} className="text-left space-y-4">
                            {error && (
                                <div className="p-3 text-xs rounded-xl font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 flex items-center gap-2 animate-fade-in">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label
                                    className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                                    htmlFor="forgot-email"
                                >
                                    E-mail da sua conta
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="email"
                                        id="forgot-email"
                                        placeholder="seuemail@exemplo.com"
                                        required
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        disabled={loading}
                                        className="skeuo-input w-full pl-9 pr-3.5 py-2.5 text-sm rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="skeuo-btn-primary w-full py-2.5 px-4 text-sm font-semibold text-white rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Enviando link...</span>
                                    </>
                                ) : (
                                    <span>Enviar Link de Recuperação</span>
                                )}
                            </button>

                            <Link
                                to="/login"
                                className="btn-secondary-glossy w-full py-2.5 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o Login
                            </Link>
                        </form>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ForgotPassword;
