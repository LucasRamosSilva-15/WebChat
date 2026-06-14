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
        <div className="members-sidebar animate-chat-panel-right hidden xl:flex w-[220px] h-[calc(100vh-48px)] sticky top-[48px] flex-col shrink-0 overflow-y-auto">
            {loading ? (
                <div className="members-sidebar-empty p-4 text-center text-xs">Carregando membros...</div>
            ) : error ? (
                <div className="members-sidebar-error p-4 text-center text-xs">{error}</div>
            ) : members.length === 0 ? (
                <div className="members-sidebar-empty p-4 text-center text-xs">Nenhum membro encontrado</div>
            ) : (
                <>
                    <div className="members-sidebar-header p-4 pt-5">
                        <h3 className="sidebar-title text-[11px] mb-3 ml-2 mt-2">
                            Online — {displayOnlineCount}
                        </h3>
                    </div>
                    <div className="members-list px-3 space-y-1">
                        {finalOnlineMembers.map((member) => (
                            <MemberItem key={member.id} member={member} isMe={member.id === currentUserId} />
                        ))}
                    </div>
                    <div className="members-sidebar-header-offline p-4 mt-4">
                        <h3 className="sidebar-title text-[11px] mb-3 ml-2 mt-2">
                            Offline — {finalOfflineMembers.length}
                        </h3>
                    </div>
                    <div className="members-list-offline px-3 space-y-1">
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
        <div className="member-item flex items-center gap-3 p-2">
            <UserAvatar name={displayName} size="sm" showStatus={true} status={member.online ? 'online' : 'offline'} />
            <div className="member-info flex-1 min-w-0 flex flex-col justify-center">
                <span className="member-name text-[13px] truncate leading-tight">{displayName}</span>
                {member.role === 'owner' && (
                    <span className="member-role member-role-[role] member-role-owner inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 w-fit">
                        <FaCrown size={8} /> DONO
                    </span>
                )}
                {member.role === 'admin' && (
                    <span className="member-role member-role-[role] member-role-admin inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 w-fit">
                        <FaShieldAlt size={8} /> ADMIN
                    </span>
                )}
                {member.role === 'moderator' && (
                    <span className="member-role member-role-[role] member-role-moderator inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 w-fit">
                        <FaShieldAlt size={8} /> MOD
                    </span>
                )}
                {member.role === 'user' && (
                    <p className="member-status-text text-[11px] truncate mt-0.5 leading-none">{statusText}</p>
                )}
            </div>
        </div>
    );
};

export default MembersSidebar;
