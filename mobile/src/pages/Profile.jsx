import React, { useState } from 'react';
import { User, Camera, Moon, Sun, Shield, LogOut, Check } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import { clearAuthSession } from '../services/api';
import { supabase } from '../services/supabase';
import { socket } from '../services/socket';

export default function MobileProfile({ onOpenNotifications, unreadCount = 0 }) {
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('chat_displayName') || 'Lucas Ramos');
  const [statusMessage, setStatusMessage] = useState(() => localStorage.getItem('chat_statusMessage') || 'Disponível no SkyRipple');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('chat_displayName', displayName);
    localStorage.setItem('chat_statusMessage', statusMessage);
    window.dispatchEvent(new Event('profileUpdated'));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = async () => {
    try {
      if (supabase?.auth?.signOut) {
        await Promise.race([
          supabase.auth.signOut(),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]);
      }
    } catch (err) {
      console.warn('Falha no signOut do Supabase:', err);
    } finally {
      if (typeof socket !== 'undefined' && socket?.disconnect) {
        socket.disconnect();
      }

      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith('sb-') ||
          key.includes('token') ||
          key.includes('user') ||
          key.includes('auth') ||
          key.includes('skyripple')
        ) {
          localStorage.removeItem(key);
        }
      });
      sessionStorage.clear();

      window.location.replace('/login');
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Perfil do Usuário"
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      <div className="px-4 pt-4 max-w-md mx-auto w-full space-y-4">
        <div className="skeuo-card p-6 rounded-3xl flex flex-col items-center text-center shadow-md">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full border-3 border-sky-400 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(14,165,233,0.35)]">
              {(displayName || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-xs" />
            <button
              type="button"
              className="absolute -bottom-1 -left-1 p-2 rounded-full btn-secondary-glossy !w-8 !h-8 !p-0 inline-flex items-center justify-center text-slate-600"
              aria-label="Trocar foto"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {displayName}
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            @{displayName.toLowerCase().replace(/\s+/g, '_')}
          </p>
        </div>

        <form onSubmit={handleSave} className="skeuo-card p-5 rounded-3xl space-y-3 shadow-md">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Informações Pessoais
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="skeuo-input w-full px-4 py-2 text-sm rounded-xl"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              Frase de Status
            </label>
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              className="skeuo-input w-full px-4 py-2 text-sm rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="skeuo-btn-primary w-full min-h-[44px] text-xs font-bold text-white rounded-xl shadow-md mt-2 active:scale-95 transition-transform"
          >
            {savedSuccess ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" /> Salvo com Sucesso!
              </span>
            ) : (
              'Salvar Alterações'
            )}
          </button>
        </form>

        <div className="skeuo-card p-4 rounded-3xl space-y-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isDarkMode ? <Moon className="w-4 h-4 text-sky-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Modo Escuro
              </span>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`w-11 h-6 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer border ${
                isDarkMode ? 'bg-sky-500 border-sky-400' : 'bg-slate-200 border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  isDarkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full min-h-[44px] btn-secondary-glossy !text-rose-600 dark:!text-rose-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 mt-2"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
