import React, { useState, useEffect, useRef } from 'react';
import { Camera, Moon, Sun, LogOut, Check, Palette } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import { supabase } from '../services/supabase';
import { socket } from '../services/socket';

export default function MobileProfile({ onOpenNotifications, unreadCount = 0 }) {
  const fileInputRef = useRef(null);
  const [displayName, setDisplayName] = useState(() => localStorage.getItem('chat_displayName') || localStorage.getItem('chat_name') || 'Usuário');
  const [statusMessage, setStatusMessage] = useState(() => localStorage.getItem('chat_statusMessage') || '');
  const [profilePhoto, setProfilePhoto] = useState(() => localStorage.getItem('chat_profilePhoto') || null);
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('chat_primaryColor') || 'blue');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => document.documentElement.classList.contains('dark'));

  const colorPalettes = [
    { id: 'blue', name: 'Azul Aqua', bg: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #0369a1 100%)', ring: 'ring-sky-400' },
    { id: 'green', name: 'Esmeralda', bg: 'linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%)', ring: 'ring-emerald-400' },
    { id: 'purple', name: 'Púrpura', bg: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #7e22ce 100%)', ring: 'ring-purple-400' },
    { id: 'red', name: 'Rubi', bg: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 50%, #be123c 100%)', ring: 'ring-rose-400' },
    { id: 'slate', name: 'Grafite', bg: 'linear-gradient(135deg, #94a3b8 0%, #64748b 50%, #334155 100%)', ring: 'ring-slate-400' },
  ];

  const applyColorTheme = (colorId) => {
    document.body.classList.remove(
      'color-blue', 'color-green', 'color-purple', 'color-red', 'color-slate',
      'theme-color-blue', 'theme-color-green', 'theme-color-purple', 'theme-color-red', 'theme-color-slate'
    );
    document.body.classList.add(`color-${colorId}`);
    document.body.classList.add(`theme-color-${colorId}`);
  };

  useEffect(() => {
    applyColorTheme(primaryColor);
  }, [primaryColor]);

  const handleColorSelect = (colorId) => {
    setPrimaryColor(colorId);
    localStorage.setItem('chat_primaryColor', colorId);
    applyColorTheme(colorId);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(20);
    }
    window.dispatchEvent(new Event('themeUpdated'));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxSize = 500;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
        setProfilePhoto(compressedBase64);
        localStorage.setItem('chat_profilePhoto', compressedBase64);
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
          navigator.vibrate(20);
        }
        window.dispatchEvent(new Event('profileUpdated'));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('chat_displayName', displayName);
    localStorage.setItem('chat_statusMessage', statusMessage);
    if (profilePhoto) {
      localStorage.setItem('chat_profilePhoto', profilePhoto);
    }
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

      localStorage.removeItem('chat_isLoggedIn');
      localStorage.removeItem('chat_displayName');
      localStorage.removeItem('chat_uniqueUserId');
      localStorage.removeItem('chat_profilePhoto');
      localStorage.removeItem('chat_profileDesc');
      localStorage.removeItem('chat_statusMessage');
      localStorage.removeItem('chat_role');
      localStorage.removeItem('chat_email');
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith('sb-') ||
          key.startsWith('chat_') ||
          key.includes('token') ||
          key.includes('user') ||
          key.includes('auth') ||
          key.includes('skyripple')
        ) {
          if (key !== 'chat_primaryColor' && key !== 'chat_colorMode' && key !== 'chat_bgColor' && key !== 'theme') {
            localStorage.removeItem(key);
          }
        }
      });
      sessionStorage.clear();

      window.location.replace('/login');
    }
  };

  return (
    <div className="anim-page-enter flex flex-col h-[100dvh] overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Perfil do Usuário"
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      <div className="flex-1 overflow-y-auto overscroll-y-contain pb-24 skeuo-scrollbar">
        <div className="anim-stagger-children px-4 pt-4 max-w-md mx-auto w-full space-y-4">
        <div className="skeuo-card p-6 rounded-3xl flex flex-col items-center text-center shadow-md">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handlePhotoSelect}
            className="hidden"
          />

          <div className="relative mb-3">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-22 h-22 rounded-full border-3 border-sky-400 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-extrabold text-3xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(14,165,233,0.35)] cursor-pointer overflow-hidden"
            >
              {profilePhoto ? (
                <img src={profilePhoto} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                (displayName || 'U').charAt(0).toUpperCase()
              )}
            </div>
            <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 shadow-xs pointer-events-none" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -left-1 p-2 rounded-full btn-secondary-glossy !w-9 !h-9 min-h-[36px] !p-0 inline-flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-md cursor-pointer active:scale-90 transition-transform"
              aria-label="Trocar foto de perfil"
            >
              <Camera className="w-4 h-4" />
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
            className="skeuo-btn-primary w-full min-h-[44px] text-xs font-bold text-white rounded-xl shadow-md mt-2 active:scale-95 transition-transform cursor-pointer"
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

        <div className="skeuo-card p-5 rounded-3xl space-y-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-sky-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                Paleta de Cores
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400">
              {colorPalettes.find(c => c.id === primaryColor)?.name || 'Azul Aqua'}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {colorPalettes.map((palette) => {
              const isSelected = primaryColor === palette.id;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => handleColorSelect(palette.id)}
                  style={{ background: palette.bg }}
                  className={`skeuo-surface-orb-badge min-h-[44px] min-w-[44px] h-12 rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer transition-all ${
                    isSelected ? 'ring-3 ring-offset-2 ring-sky-500 scale-105 shadow-md' : 'opacity-85'
                  }`}
                  aria-label={`Selecionar tema ${palette.name}`}
                >
                  {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

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
            className="w-full min-h-[44px] btn-secondary-glossy !text-rose-600 dark:!text-rose-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
