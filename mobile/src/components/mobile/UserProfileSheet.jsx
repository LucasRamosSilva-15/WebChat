import React from 'react';
import { MessageSquare, Shield, Crown, User, CheckCircle2 } from 'lucide-react';
import MobileSheet from './MobileSheet';

export default function UserProfileSheet({
  isOpen,
  onClose,
  user,
  onStartDirect
}) {
  if (!user) return null;

  const displayName = user.name || user.displayName || user.sender || 'Membro';
  const username = user.username || `@${displayName.toLowerCase().replace(/\s+/g, '_')}`;
  const statusMessage = user.status || user.statusMessage || 'Disponível no SkyRipple';
  const role = user.role || 'user';
  const avatar = user.avatar || user.profilePhoto || null;
  const isOnline = user.isOnline ?? true;

  const handleStartDirectClick = () => {
    if (onStartDirect) {
      onStartDirect(user);
    }
    onClose();
  };

  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Perfil do Usuário"
    >
      <div className="space-y-4 py-2">
        <div className="skeuo-card p-5 rounded-3xl flex flex-col items-center text-center space-y-3">
          <div className="relative">
            <div className="skeuo-surface-orb-badge w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 bg-gradient-to-b from-sky-400 to-sky-600 text-white font-extrabold text-2xl shadow-lg">
              {avatar ? (
                <img
                  src={avatar}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{displayName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <span
              className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                isOnline ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
              title={isOnline ? 'Online' : 'Offline'}
            />
          </div>

          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center justify-center gap-1.5">
              <span>{displayName}</span>
              {isOnline && <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />}
            </h3>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              {username}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {role === 'owner' ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-amber-800 bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 shadow-xs inline-flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-600" />
                <span>DONO</span>
              </span>
            ) : role === 'moderator' || role === 'admin' ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold text-sky-800 bg-gradient-to-b from-sky-100 to-sky-200 border border-sky-300 shadow-xs inline-flex items-center gap-1">
                <Shield className="w-3 h-3 text-sky-600" />
                <span>MODERADOR</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700 shadow-xs inline-flex items-center gap-1">
                <User className="w-3 h-3 text-slate-500" />
                <span>MEMBRO</span>
              </span>
            )}
          </div>

          <div className="skeuo-well p-3 rounded-2xl w-full text-xs text-slate-600 dark:text-slate-300 italic">
            "{statusMessage}"
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartDirectClick}
          className="skeuo-btn-primary min-h-[44px] w-full text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-transform"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Conversar no Privado</span>
        </button>
      </div>
    </MobileSheet>
  );
}
