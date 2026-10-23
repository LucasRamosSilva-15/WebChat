import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, KeyRound, ArrowRight, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabase';
import OtpCodeInput from '../components/common/OtpCodeInput';

export default function MobileForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Por favor, informe o seu endereço de e-mail.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail);
      if (resetError) {
        setError(resetError.message || 'Não foi possível enviar o código de recuperação.');
      } else {
        setStep(2);
      }
    } catch (err) {
      setError(err.message || 'Erro ao processar solicitação de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify) => {
    const token = codeToVerify || otpCode;
    if (!token || token.length < 8) {
      setError('Por favor, digite o código de 8 dígitos completo.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token,
        type: 'recovery'
      });

      if (verifyError) {
        setError(verifyError.message || 'Código de recuperação incorreto ou expirado.');
      } else {
        setStep(3);
      }
    } catch (err) {
      setError(err.message || 'Erro ao validar código de recuperação.');
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
        setError(resendError.message || 'Falha ao reenviar código.');
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
      setError('As senhas digitadas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        setError(updateError.message || 'Não foi possível atualizar a senha.');
      } else {
        await supabase.auth.signOut();
        setStep(4);
      }
    } catch (err) {
      setError(err.message || 'Erro ao salvar nova senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anim-page-enter h-[100dvh] overflow-y-auto overscroll-y-contain skeuo-scrollbar bg-slate-100 dark:bg-slate-950 flex flex-col px-4 pt-8 pb-[calc(6.5rem+env(safe-area-inset-bottom))]">
      <div className="anim-fade-rise skeuo-card max-w-md mx-auto my-auto w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-400/50 text-[10px] font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest shadow-xs mb-3">
                <KeyRound className="w-3.5 h-3.5" />
                RECUPERAÇÃO DE ACESSO
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                Esqueceu sua senha?
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Insira o seu e-mail para receber um código de 8 dígitos
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-center animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  E-mail Cadastrado
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

              <button
                type="submit"
                disabled={loading}
                className="skeuo-btn-primary w-full min-h-[48px] rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Enviando código...' : 'Receber Código de 8 Dígitos'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar ao Login
              </Link>
            </div>
          </>
        )}

        {step === 2 && (
          <div className="text-center py-2 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-sky-50 dark:bg-sky-950/60 border-2 border-sky-400 flex items-center justify-center text-sky-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(14,165,233,0.3)] mb-4">
              <KeyRound className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
              Código de Recuperação
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Digite o código de 8 dígitos enviado para <br />
              <strong className="text-slate-800 dark:text-slate-200">{email}</strong>
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-center animate-fade-in">
                {error}
              </div>
            )}

            <div className="mb-6">
              <OtpCodeInput
                length={8}
                value={otpCode}
                onChange={setOtpCode}
                onComplete={handleVerifyOtp}
                onResend={handleResendRecovery}
                disabled={loading}
                error={Boolean(error)}
                resending={resending}
              />
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleVerifyOtp(otpCode)}
                disabled={loading || otpCode.length < 8}
                className="skeuo-btn-primary w-full min-h-[48px] rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{loading ? 'Verificando...' : 'Avançar para Nova Senha'}</span>
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
                <span>Alterar e-mail informado</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="py-2 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-sky-50 dark:bg-sky-950/60 border-2 border-sky-400 flex items-center justify-center text-sky-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(14,165,233,0.3)] mb-4">
                <Lock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                Criar Nova Senha
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Defina sua nova credencial de segurança
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-center animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="skeuo-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Ver nova senha"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha"
                    className="skeuo-input w-full pl-10 pr-10 py-2.5 text-sm rounded-xl"
                    required
                  />
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Ver confirmação de nova senha"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="skeuo-btn-primary w-full min-h-[48px] rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? 'Salvando nova senha...' : 'Salvar Nova Senha'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="text-center py-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 flex items-center justify-center text-emerald-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(16,185,129,0.3)] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
              Senha Atualizada!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Sua senha foi redefinida com sucesso. Você já pode acessar sua conta com a nova credencial.
            </p>

            <Link
              to="/login"
              className="skeuo-btn-primary min-h-[48px] w-full rounded-2xl font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              Ir para o Login
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
