import React from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MobileHeader({
  title,
  showBack = false,
  onBack,
  onOpenNotifications,
  unreadCount = 0
}) {
  const navigate = useNavigate();
  const displayName = localStorage.getItem('chat_displayName') || 'Usuário';
  const profilePhoto = localStorage.getItem('chat_profilePhoto');

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 w-full max-w-md mx-auto pt-[calc(env(safe-area-inset-top,0px)+8px)] px-3 pb-2.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-white/60 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          <div className="flex items-center gap-2.5">
            {showBack ? (
              <button
                type="button"
                onClick={onBack || (() => navigate(-1))}
                className="btn-secondary-glossy !w-10 !h-10 !p-0 rounded-full inline-flex items-center justify-center text-slate-700 dark:text-slate-200"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="relative w-10 h-10 rounded-full border-2 border-sky-400 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-[inset_0_2px_3px_rgba(255,255,255,0.7),0_3px_6px_rgba(14,165,233,0.3)]">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{(displayName || 'U').charAt(0).toUpperCase()}</span>
                )}
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
            )}

            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[190px]">
                {title || displayName}
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Online
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenNotifications}
            className="btn-secondary-glossy relative !w-10 !h-10 !p-0 rounded-full inline-flex items-center justify-center text-slate-700 dark:text-slate-200"
            aria-label="Notificações"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border border-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>
      <div className="w-full shrink-0 h-[calc(env(safe-area-inset-top,0px)+59px)] pointer-events-none" aria-hidden="true" />
    </>
  );
}
