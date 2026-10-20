import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, KeyRound, Lock, Eye, EyeOff, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';
import OtpCodeInput from '../components/common/OtpCodeInput';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState(null);

    const handleRequestCode = async (e) => {
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
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail);
            if (resetError) {
                setError(resetError.message || 'Não foi possível enviar o código de recuperação. Tente novamente.');
            } else {
                setStep(2);
            }
        } catch (err) {
            setError(err.message || 'Ocorreu um erro inesperado ao conectar com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (codeToVerify) => {
        const token = codeToVerify || code;
        if (!token || token.length < 6) {
            setError('Por favor, digite o código de 6 dígitos completo.');
            return;
        }

        setError(null);
        setLoading(true);
        try {
            const { error: verifyError } = await supabase.auth.verifyOtp({
                email: email.trim(),
                token,
                type: 'recovery',
            });

            if (verifyError) {
                setError(verifyError.message || 'Código de recuperação incorreto ou expirado.');
            } else {
                setStep(3);
            }
        } catch (err) {
            setError(err.message || 'Erro ao validar o código de recuperação.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendRecovery = async () => {
        setError(null);
        setResending(true);
        try {
            const { error: resendError } = await supabase.auth.resetPasswordForEmail(email.trim());
            if (resendError) {
                setError(resendError.message || 'Falha ao reenviar código de recuperação.');
            }
        } catch (err) {
            setError(err.message || 'Erro ao reenviar código.');
        } finally {
            setResending(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError(null);

        if (!newPassword || newPassword.length < 6) {
            setError('A nova senha deve possuir pelo menos 6 caracteres.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('As senhas digitadas não coincidem. Verifique e tente novamente.');
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                setError(updateError.message || 'Não foi possível atualizar a senha. Tente novamente.');
            } else {
                setStep(4);
            }
        } catch (err) {
            setError(err.message || 'Ocorreu um erro ao salvar sua nova senha.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (pwd) => {
        if (!pwd) return { percent: '0%', label: 'Insira sua nova senha', color: 'bg-transparent', textColor: 'text-slate-400 dark:text-slate-500' };
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

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <main className="reveal flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="skeuo-card px-7 py-8 sm:px-9 sm:py-9 w-full text-center max-w-[460px] rounded-[28px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)] relative transition-all">
                {step === 1 && (
                    <div className="animate-fade-in">
                        <div className="skeuo-surface-orb-badge w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400 shadow-md">
                            <KeyRound className="w-7 h-7" />
                        </div>

                        <h1 className="hero-title font-bold text-2xl sm:text-[26px] mb-1.5 tracking-tight text-slate-800 dark:text-slate-100">
                            Recuperar Senha
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-[13px] mb-6 tracking-tight leading-relaxed">
                            Insira o seu e-mail cadastrado e enviaremos um código numérico de 6 dígitos para redefinir a sua senha.
                        </p>

                        <form noValidate onSubmit={handleRequestCode} className="text-left space-y-4">
                            {error && (
                                <div className="p-3 text-xs rounded-xl font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900 flex items-center gap-2 animate-fade-in">
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
                                        <span>Enviando código...</span>
                                    </>
                                ) : (
                                    <span>Enviar Código</span>
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

                {step === 2 && (
                    <div className="animate-fade-in flex flex-col items-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-xs mb-3">
                            <KeyRound className="w-3.5 h-3.5" />
                            CÓDIGO DE RECUPERAÇÃO
                        </span>

                        <h2 className="hero-title font-bold text-2xl sm:text-[26px] mb-1.5 tracking-tight text-slate-800 dark:text-slate-100">
                            Digite o código de 6 dígitos
                        </h2>

                        <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-[13px] mb-5 tracking-tight leading-relaxed max-w-sm mx-auto">
                            Insira o código numérico enviado para <strong className="text-slate-900 dark:text-white font-semibold break-all">{email}</strong>:
                        </p>

                        {error && (
                            <div className="w-full mb-4 p-3 text-xs rounded-xl font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900 flex items-center gap-2 animate-fade-in text-left">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="w-full py-2">
                            <OtpCodeInput
                                value={code}
                                onChange={(val) => {
                                    setCode(val);
                                    if (error) setError(null);
                                }}
                                onComplete={handleVerifyOtp}
                                onResend={handleResendRecovery}
                                disabled={loading}
                                resending={resending}
                                error={Boolean(error)}
                            />
                        </div>

                        <div className="w-full space-y-2.5 mt-5">
                            <button
                                type="button"
                                onClick={() => handleVerifyOtp(code)}
                                disabled={loading || code.length < 6}
                                className="skeuo-btn-primary w-full py-2.5 px-4 text-sm font-semibold text-white rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Validando...</span>
                                    </>
                                ) : (
                                    <span>Validar Código</span>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setError(null);
                                    setCode('');
                                }}
                                disabled={loading}
                                className="btn-secondary-glossy w-full py-2 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
                            >
                                <RefreshCw className="w-3.5 h-3.5" /> Enviar para outro e-mail
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in text-left">
                        <div className="text-center mb-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-xs mb-3">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                NOVA SENHA
                            </span>

                            <h2 className="hero-title font-bold text-2xl sm:text-[26px] mb-1.5 tracking-tight text-slate-800 dark:text-slate-100">
                                Defina sua nova senha
                            </h2>

                            <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-[13px] tracking-tight leading-relaxed">
                                Crie uma nova credencial segura para a sua conta no SkyRipple.
                            </p>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            {error && (
                                <div className="p-3 text-xs rounded-xl font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900 flex items-center gap-2 animate-fade-in">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="new-password">
                                    Nova Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        id="new-password"
                                        placeholder="Digite a nova senha"
                                        required
                                        value={newPassword}
                                        onChange={(e) => {
                                            setNewPassword(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        autoComplete="new-password"
                                        className="skeuo-input w-full pl-9 pr-10 py-2.5 text-sm rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                        tabIndex={-1}
                                        aria-label={showNewPassword ? 'Ocultar senha' : 'Ver senha'}
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1" htmlFor="confirm-password">
                                    Confirmar Senha
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirm-password"
                                        placeholder="Confirme a nova senha"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);
                                            if (error) setError(null);
                                        }}
                                        autoComplete="new-password"
                                        className="skeuo-input w-full pl-9 pr-10 py-2.5 text-sm rounded-xl"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                        tabIndex={-1}
                                        aria-label={showConfirmPassword ? 'Ocultar senha' : 'Ver senha'}
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="skeuo-btn-primary w-full py-2.5 px-4 text-sm font-semibold text-white rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Salvando senha...</span>
                                    </>
                                ) : (
                                    <span>Salvar Nova Senha</span>
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

                {step === 4 && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="skeuo-surface-orb-badge w-16 h-16 rounded-full flex items-center justify-center mb-4 text-emerald-500 dark:text-emerald-400 shadow-md">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>

                        <h2 className="hero-title font-bold text-2xl sm:text-[26px] mb-2 tracking-tight text-slate-800 dark:text-slate-100">
                            Senha alterada com sucesso!
                        </h2>

                        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed mb-6 max-w-sm mx-auto">
                            Sua credencial foi atualizada. Agora você já pode acessar a plataforma com sua nova senha segura.
                        </p>

                        <div className="w-full">
                            <Link
                                to="/login"
                                className="skeuo-btn-primary w-full py-2.5 px-4 text-sm font-semibold text-white rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                            >
                                <ArrowLeft className="w-4 h-4" /> Ir para o Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default ForgotPassword;
