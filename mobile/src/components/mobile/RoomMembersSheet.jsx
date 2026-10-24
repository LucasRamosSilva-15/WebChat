import React from 'react';
import { Shield, Crown, VolumeX, UserX } from 'lucide-react';
import MobileSheet from './MobileSheet';

export default function RoomMembersSheet({
  isOpen,
  onClose,
  roomId = 'Geral',
  members = [],
  onlineCount: onlineCountProp,
  currentUserId,
  currentUserRole = 'user',
  onMuteMember,
  onRemoveMember
}) {
  const memberList = Array.isArray(members) ? members : [];

  const sortedMembers = [...memberList].sort((a, b) => {
    const isSelfA = Boolean(a.isSelf || a.id === currentUserId);
    const isSelfB = Boolean(b.isSelf || b.id === currentUserId);
    if (isSelfA && !isSelfB) return -1;
    if (!isSelfA && isSelfB) return 1;

    const isOnlineA = Boolean(a.isOnline || a.online || isSelfA);
    const isOnlineB = Boolean(b.isOnline || b.online || isSelfB);
    if (isOnlineA && !isOnlineB) return -1;
    if (!isOnlineA && isOnlineB) return 1;

    return (a.name || '').localeCompare(b.name || '');
  });

  const computedOnlineCount = sortedMembers.filter(
    (m) => m.isOnline || m.online || m.isSelf || m.id === currentUserId
  ).length;

  const actualOnlineCount =
    typeof onlineCountProp === 'number'
      ? Math.max(onlineCountProp, computedOnlineCount, sortedMembers.length > 0 ? 1 : 0)
      : Math.max(computedOnlineCount, sortedMembers.length > 0 ? 1 : 0);

  const canModerate = currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Membros da Sala #${roomId}`}
    >
      <div className="flex items-center justify-between px-1 mb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Participantes
        </span>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
          </span>
          <span>{actualOnlineCount} {actualOnlineCount === 1 ? 'online' : 'onlines'}</span>
          <span className="text-slate-400 dark:text-slate-500 font-normal">de {sortedMembers.length}</span>
        </div>
      </div>

      {sortedMembers.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          Nenhum membro listado no momento.
        </div>
      ) : (
        <div className="skeuo-well p-2 rounded-2xl max-h-[60vh] overflow-y-auto skeuo-scrollbar flex flex-col gap-2">
          {sortedMembers.map((member) => {
            const isOwner = member.role === 'owner' || member.role === 'creator';
            const isAdmin = member.role === 'admin' || member.role === 'moderator';
            const isSelf = Boolean(member.isSelf || member.id === currentUserId);
            const isOnline = Boolean(member.isOnline || member.online || isSelf);

            return (
              <div
                key={member.id}
                className="skeuo-card p-2.5 rounded-xl flex items-center justify-between shadow-xs transition-transform active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0 w-10 h-10 rounded-full border border-sky-400/60 bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-sm">
                    {member.avatarUrl ? (
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{(member.name || 'U').charAt(0).toUpperCase()}</span>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                        isOnline
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                          : 'bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {member.name}
                      </span>
                      {isSelf && (
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                          Você
                        </span>
                      )}
                      {isOwner && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-xs">
                          <Crown className="w-2.5 h-2.5 text-amber-600" />
                          DONO
                        </span>
                      )}
                      {isAdmin && !isOwner && (
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-xs">
                          <Shield className="w-2.5 h-2.5 text-rose-600" />
                          ADMIN
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
                        @{member.username || member.name?.toLowerCase().replace(/\s+/g, '')}
                      </span>
                      <span className="text-slate-300 dark:text-slate-700 text-[10px]">·</span>
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]" />
                          Online agora
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400/60 dark:bg-slate-600" />
                          Offline
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {canModerate && !isOwner && !isSelf && (
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (onMuteMember) onMuteMember(member);
                        else alert(`Membro ${member.name} silenciado.`);
                      }}
                      title="Silenciar membro"
                      aria-label="Silenciar"
                      className="btn-secondary-glossy !w-8 !h-8 !p-0 rounded-full inline-flex items-center justify-center text-slate-500 hover:text-amber-600"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onRemoveMember) onRemoveMember(member);
                        else alert(`Membro ${member.name} expulso da sala.`);
                      }}
                      title="Expulsar da sala"
                      aria-label="Expulsar"
                      className="btn-secondary-glossy !w-8 !h-8 !p-0 rounded-full inline-flex items-center justify-center text-slate-500 hover:text-rose-600"
                    >
                      <UserX className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </MobileSheet>
  );
}
