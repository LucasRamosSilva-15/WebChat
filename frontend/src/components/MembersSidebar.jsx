import React, { useState, useEffect } from 'react';
import { FaCrown, FaShieldAlt } from 'react-icons/fa';
import UserAvatar from './UserAvatar';
import { apiRequest } from '../services/api';

const MembersSidebar = ({ roomId, currentUserId, onlineUsers = [], onlineCount = 0 }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const fetchMembers = async () => {
            if (!roomId) {
                setMembers([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError('');

            try {
                const data = await apiRequest(`/rooms/${roomId}/members`);

                const safeMembers = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.members)
                        ? data.members
                        : [];

                if (!cancelled) {
                    setMembers(safeMembers);
                }
            } catch (err) {
                console.error("Erro ao buscar membros:", err);
                if (!cancelled) {
                    setMembers([]);
                    setError("Falha ao carregar membros");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchMembers();

        return () => {
            cancelled = true;
        };
    }, [roomId]);

    const safeOnlineUsers = Array.isArray(onlineUsers) ? onlineUsers : [];
    const isSocketOnline = safeOnlineUsers.length > 0;

    const enhancedMembers = members.map(m => {
        const safeId = m.id || m.user_id || m.email || m.name;
        const safeName = m.name || m.user_name || m.email || "Usuário";
        
        let normalizedRole = (m.role || 'user').toString().toLowerCase();
        if (normalizedRole === 'dono') normalizedRole = 'owner';
        if (normalizedRole === 'moderador') normalizedRole = 'moderator';
        if (normalizedRole === 'usuário' || normalizedRole === 'usuario') normalizedRole = 'user';

        return {
            ...m,
            id: safeId,
            name: safeName,
            role: normalizedRole,
            online: isSocketOnline ? safeOnlineUsers.some(ou => ou.id === safeId) : (safeId === currentUserId)
        };
    });

    const finalOnlineMembers = enhancedMembers.filter(m => m.online);
    const finalOfflineMembers = enhancedMembers.filter(m => !m.online);
    const displayOnlineCount = isSocketOnline ? Math.max(onlineCount, finalOnlineMembers.length) : finalOnlineMembers.length;

    return (
        <div className="w-[220px] h-[calc(100vh-48px)] sticky top-[48px] bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a] border-l border-[#d2d2d7] dark:border-white/5 shadow-[inset_1px_0_0_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.02)] hidden xl:flex flex-col shrink-0 overflow-y-auto">
            {loading ? (
                <div className="p-4 text-center text-[12px] text-[#86868b]">Carregando membros...</div>
            ) : error ? (
                <div className="p-4 text-center text-[12px] text-red-500">{error}</div>
            ) : members.length === 0 ? (
                <div className="p-4 text-center text-[12px] text-[#86868b]">Nenhum membro encontrado</div>
            ) : (
                <>
                    <div className="p-4 pt-5">
                        <h3 className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-1">
                            Online — {displayOnlineCount}
                        </h3>
                    </div>
                    <div className="px-3 space-y-1">
                        {finalOnlineMembers.map((member) => (
                            <MemberItem key={member.id} member={member} isMe={member.id === currentUserId} />
                        ))}
                    </div>
                    <div className="p-4 mt-4 border-t border-[#d2d2d7] dark:border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                        <h3 className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-1">
                            Offline — {finalOfflineMembers.length}
                        </h3>
                    </div>
                    <div className="px-3 space-y-1 opacity-60">
                        {finalOfflineMembers.map((member) => (
                            <MemberItem key={member.id} member={member} isMe={member.id === currentUserId} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const MemberItem = ({ member, isMe }) => {
    const displayName = isMe ? 'Você' : member.name;
    const statusText = member.online ? 'Online' : 'Offline';

    return (
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-[#334155] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_1px_2px_rgba(0,0,0,0.3)] cursor-pointer transition-all">
            <UserAvatar name={displayName} size="sm" showStatus={true} status={member.online ? 'online' : 'offline'} />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-[13px] font-semibold text-[#1d1d1f] truncate leading-tight">{displayName}</span>
                {member.role === 'owner' && (
                    <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 w-fit">
                        <FaCrown size={8} /> DONO
                    </span>
                )}
                {member.role === 'admin' && (
                    <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 bg-gradient-to-b from-blue-400 to-blue-600 text-white rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 w-fit">
                        <FaShieldAlt size={8} /> ADMIN
                    </span>
                )}
                {member.role === 'moderator' && (
                    <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 bg-gradient-to-b from-violet-400 to-violet-600 text-white rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 w-fit">
                        <FaShieldAlt size={8} /> MOD
                    </span>
                )}
                {member.role === 'user' && (
                    <p className="text-[11px] text-[#86868b] truncate mt-0.5 leading-none">{statusText}</p>
                )}
            </div>
        </div>
    );
};

export default MembersSidebar;
