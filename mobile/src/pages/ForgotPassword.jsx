import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, KeyRound, ArrowRight } from 'lucide-react';
import { apiRequest } from '../services/api';
import { supabase } from '../services/supabase';

export default function MobileForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Por favor, informe o seu endereço de e-mail.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let isSuccess = false;
      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${window.location.origin}/login`
        });
        if (!resetError) isSuccess = true;
      } catch {
      }

      if (!isSuccess) {
        try {
          await apiRequest('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email: cleanEmail })
          });
          isSuccess = true;
        } catch {
          isSuccess = true;
        }
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erro ao processar solicitação de recuperação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col justify-center px-4 py-8">
      <div className="skeuo-card max-w-md mx-auto w-full p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {success ? (
          <div className="text-center py-4 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 flex items-center justify-center text-emerald-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(16,185,129,0.3)] mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
              Verifique o seu e-mail
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Enviamos um link com instruções para redefinição de senha para <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>.
            </p>

            <Link
              to="/login"
              className="btn-secondary-glossy min-h-[48px] w-full rounded-2xl font-bold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Login
            </Link>
          </div>
        ) : (
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
                Insira o seu e-mail para receber as instruções de redefinição
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
                  E-mail Cadastrado
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

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="skeuo-btn-primary min-h-[48px] w-full rounded-2xl font-bold text-sm text-white shadow-md active:scale-[0.97] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <span>Enviando link...</span>
                ) : (
                  <>
                    <span>Enviar Link de Recuperação</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <Link
                to="/login"
                className="btn-secondary-glossy min-h-[48px] w-full rounded-2xl font-semibold text-xs text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <ArrowLeft className="w-4 h-4" />
                Lembrei minha senha
              </Link>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
