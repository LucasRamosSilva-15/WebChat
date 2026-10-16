import React, { useState, useEffect } from 'react';
import { FaCrown, FaShieldAlt, FaTimes, FaEllipsisV, FaUserSlash, FaUserCheck, FaExchangeAlt, FaUser } from 'react-icons/fa';
import UserAvatar from './UserAvatar';
import { apiRequest } from '../services/api';

const MembersSidebar = ({ roomId, currentUserId, onlineUsers = [], onlineCount = 0, isMobileOpen, onClose, onMembersChange, socket }) => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');

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
                    if (typeof onMembersChange === 'function') {
                        onMembersChange(safeMembers);
                    }
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

    useEffect(() => {
        if (!socket || !roomId) return;

        const handleRoleUpdated = (data) => {
            if (data?.roomId === roomId) {
                setMembers(prev => {
                    const updated = prev.map(m => {
                        const mid = m.id || m.user_id;
                        if (mid === data.userId) {
                            return { ...m, role: data.role };
                        }
                        return m;
                    });
                    if (typeof onMembersChange === 'function') {
                        onMembersChange(updated);
                    }
                    return updated;
                });
                if (selectedMember && (selectedMember.id === data.userId || selectedMember.user_id === data.userId)) {
                    setSelectedMember(prev => prev ? { ...prev, role: data.role } : null);
                }
            }
        };

        const handleMemberKicked = (data) => {
            if (data?.roomId === roomId) {
                setMembers(prev => {
                    const updated = prev.filter(m => (m.id !== data.userId && m.user_id !== data.userId));
                    if (typeof onMembersChange === 'function') {
                        onMembersChange(updated);
                    }
                    return updated;
                });
                if (selectedMember && (selectedMember.id === data.userId || selectedMember.user_id === data.userId)) {
                    setSelectedMember(null);
                }
            }
        };

        const handleOwnershipTransferred = (data) => {
            if (data?.roomId === roomId) {
                setMembers(prev => {
                    const updated = prev.map(m => {
                        const mid = m.id || m.user_id;
                        if (mid === data.newOwnerId) return { ...m, role: 'owner' };
                        if (mid === data.oldOwnerId) return { ...m, role: 'user' };
                        return m;
                    });
                    if (typeof onMembersChange === 'function') {
                        onMembersChange(updated);
                    }
                    return updated;
                });
                setSelectedMember(null);
            }
        };

        socket.on('member_role_updated', handleRoleUpdated);
        socket.on('member_kicked', handleMemberKicked);
        socket.on('ownership_transferred', handleOwnershipTransferred);

        return () => {
            socket.off('member_role_updated', handleRoleUpdated);
            socket.off('member_kicked', handleMemberKicked);
            socket.off('ownership_transferred', handleOwnershipTransferred);
        };
    }, [roomId, selectedMember, onMembersChange]);

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

    const currentUserMember = enhancedMembers.find(m => m.id === currentUserId);
    const currentUserRole = currentUserMember?.role || 'user';
    const isOwner = currentUserRole === 'owner' || currentUserRole === 'admin';
    const isModerator = currentUserRole === 'moderator';

    const finalOnlineMembers = enhancedMembers.filter(m => m.online);
    const finalOfflineMembers = enhancedMembers.filter(m => !m.online);
    const displayOnlineCount = isSocketOnline ? Math.max(onlineCount, finalOnlineMembers.length) : finalOnlineMembers.length;

    const canModerate = (targetMember) => {
        if (!targetMember || targetMember.id === currentUserId) return false;
        if (isOwner) return true;
        if (isModerator && targetMember.role === 'user') return true;
        return false;
    };

    const handleUpdateRole = async (targetUserId, newRole) => {
        setActionLoading(true);
        setActionError('');
        try {
            await apiRequest(`/rooms/${roomId}/members/${targetUserId}/role`, {
                method: 'PATCH',
                body: JSON.stringify({ role: newRole })
            });
            setMembers(prev => {
                const updated = prev.map(m => {
                    const mid = m.id || m.user_id;
                    if (mid === targetUserId) {
                        return { ...m, role: newRole };
                    }
                    return m;
                });
                if (typeof onMembersChange === 'function') {
                    onMembersChange(updated);
                }
                return updated;
            });
            setSelectedMember(null);
        } catch (err) {
            setActionError(err.message || "Erro ao atualizar permissão");
        } finally {
            setActionLoading(false);
        }
    };

    const handleKick = async (targetUserId, targetName) => {
        if (!window.confirm(`Deseja realmente expulsar ${targetName} desta sala?`)) {
            return;
        }

        setActionLoading(true);
        setActionError('');
        try {
            await apiRequest(`/rooms/${roomId}/members/${targetUserId}`, {
                method: 'DELETE'
            });
            setMembers(prev => {
                const updated = prev.filter(m => (m.id !== targetUserId && m.user_id !== targetUserId));
                if (typeof onMembersChange === 'function') {
                    onMembersChange(updated);
                }
                return updated;
            });
            setSelectedMember(null);
        } catch (err) {
            setActionError(err.message || "Erro ao expulsar membro");
        } finally {
            setActionLoading(false);
        }
    };

    const handleTransfer = async (targetUserId, targetName) => {
        if (!window.confirm(`ATENÇÃO: Você passará a posse e controle total desta sala para ${targetName}. Tem certeza?`)) {
            return;
        }

        setActionLoading(true);
        setActionError('');
        try {
            await apiRequest(`/rooms/${roomId}/transfer-ownership`, {
                method: 'POST',
                body: JSON.stringify({ targetUserId })
            });
            setMembers(prev => {
                const updated = prev.map(m => {
                    const mid = m.id || m.user_id;
                    if (mid === targetUserId) return { ...m, role: 'owner' };
                    if (mid === currentUserId) return { ...m, role: 'user' };
                    return m;
                });
                if (typeof onMembersChange === 'function') {
                    onMembersChange(updated);
                }
                return updated;
            });
            setSelectedMember(null);
        } catch (err) {
            setActionError(err.message || "Erro ao transferir dono da sala");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className={`animate-chat-panel-right xl:flex w-[220px] h-[calc(100vh-48px)] sticky top-[48px] flex-col shrink-0 overflow-y-auto bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] border-l border-[#d2d2d7] shadow-[inset_1px_0_0_rgba(255,255,255,0.8)] dark:from-[#1e293b] dark:to-[#0f172a] dark:border-white/5 dark:shadow-[inset_1px_0_0_rgba(255,255,255,0.02)] ${isMobileOpen ? 'flex fixed inset-y-0 right-0 z-40 bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl shadow-2xl h-[100vh] top-0 pt-12' : 'hidden'}`}>
            {isMobileOpen && (
                <button onClick={onClose} className="absolute top-3 right-3 text-[#86868b] dark:text-[#94a3b8] hover:text-[#0071e3] xl:hidden p-2">
                    <FaTimes size={18} />
                </button>
            )}
            {loading ? (
                <div className="p-4 text-center text-xs text-[#86868b] dark:text-[#94a3b8]">Carregando membros...</div>
            ) : error ? (
                <div className="p-4 text-center text-xs text-red-500 dark:text-red-400">{error}</div>
            ) : members.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#86868b] dark:text-[#94a3b8]">Nenhum membro encontrado</div>
            ) : (
                <>
                    <div className="p-4 pt-5">
                        <h3 className="text-[11px] mb-3 ml-2 mt-2 font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">
                            Online — {displayOnlineCount}
                        </h3>
                    </div>
                    <div className="px-3 space-y-1">
                        {finalOnlineMembers.map((member) => (
                            <MemberItem
                                key={member.id}
                                member={member}
                                isMe={member.id === currentUserId}
                                canModerate={canModerate(member)}
                                onOpenModeration={() => {
                                    setActionError('');
                                    setSelectedMember(member);
                                }}
                            />
                        ))}
                    </div>
                    <div className="p-4 mt-4 border-t border-[#d2d2d7] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:border-white/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                        <h3 className="text-[11px] mb-3 ml-2 mt-2 font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">
                            Offline — {finalOfflineMembers.length}
                        </h3>
                    </div>
                    <div className="px-3 space-y-1 opacity-60">
                        {finalOfflineMembers.map((member) => (
                            <MemberItem
                                key={member.id}
                                member={member}
                                isMe={member.id === currentUserId}
                                canModerate={canModerate(member)}
                                onOpenModeration={() => {
                                    setActionError('');
                                    setSelectedMember(member);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            {selectedMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in-up">
                    <div className="skeuo-panel p-5 w-full max-w-sm border border-black/10 dark:border-white/10 shadow-2xl bg-white dark:bg-slate-900 rounded-2xl">
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/10 dark:border-white/10">
                            <h4 className="text-sm font-bold text-[#1d1d1f] dark:text-slate-100 flex items-center gap-2">
                                <FaShieldAlt size={14} className="text-[#0071e3]" /> Moderação de Membro
                            </h4>
                            <button
                                onClick={() => setSelectedMember(null)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mb-4 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-white/5">
                            <UserAvatar name={selectedMember.name} size="sm" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold truncate text-[#1d1d1f] dark:text-slate-100">{selectedMember.name}</p>
                                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 capitalize">
                                    Papel atual: {selectedMember.role === 'owner' ? 'Dono' : selectedMember.role === 'moderator' ? 'Moderador' : 'Membro'}
                                </span>
                            </div>
                        </div>

                        {actionError && (
                            <div className="mb-3 p-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-900/40">
                                {actionError}
                            </div>
                        )}

                        <div className="space-y-2">
                            {isOwner && selectedMember.role === 'user' && (
                                <button
                                    onClick={() => handleUpdateRole(selectedMember.id, 'moderator')}
                                    disabled={actionLoading}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-gradient-to-b from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-sm border border-purple-600 cursor-pointer disabled:opacity-50"
                                >
                                    <FaUserCheck size={12} /> Promover a Moderador
                                </button>
                            )}

                            {isOwner && selectedMember.role === 'moderator' && (
                                <button
                                    onClick={() => handleUpdateRole(selectedMember.id, 'user')}
                                    disabled={actionLoading}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-300 dark:border-slate-600 cursor-pointer disabled:opacity-50"
                                >
                                    <FaUser size={12} /> Rebaixar para Membro Regular
                                </button>
                            )}

                            {(isOwner || (isModerator && selectedMember.role === 'user')) && (
                                <button
                                    onClick={() => handleKick(selectedMember.id, selectedMember.name)}
                                    disabled={actionLoading}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-gradient-to-b from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-sm border border-red-600 cursor-pointer disabled:opacity-50"
                                >
                                    <FaUserSlash size={12} /> Expulsar da Sala
                                </button>
                            )}

                            {isOwner && selectedMember.role !== 'owner' && (
                                <button
                                    onClick={() => handleTransfer(selectedMember.id, selectedMember.name)}
                                    disabled={actionLoading}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 shadow-sm border border-amber-500/50 cursor-pointer disabled:opacity-50"
                                >
                                    <FaExchangeAlt size={12} /> Transferir Dono da Sala
                                </button>
                            )}

                            <button
                                onClick={() => setSelectedMember(null)}
                                className="w-full py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-medium cursor-pointer"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MemberItem = ({ member, isMe, canModerate, onOpenModeration }) => {
    const displayName = isMe ? 'Você' : member.name;
    const statusText = member.online ? 'Online' : 'Offline';

    return (
        <div
            onClick={() => {
                if (canModerate) onOpenModeration();
            }}
            className={`group/member flex items-center gap-3 p-2 rounded-xl transition-all duration-150 ${canModerate ? 'cursor-pointer hover:bg-white hover:shadow-xs dark:hover:bg-slate-700 dark:hover:shadow-sm' : 'hover:bg-white/50 dark:hover:bg-slate-800/50'}`}
        >
            <UserAvatar name={displayName} size="sm" showStatus={true} status={member.online ? 'online' : 'offline'} />
            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <span className="text-[13px] truncate leading-tight font-semibold text-[#1d1d1f] dark:text-slate-50">{displayName}</span>
                {member.role === 'owner' && (
                    <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 w-fit rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-amber-900">
                        <FaCrown size={8} /> DONO
                    </span>
                )}
                {member.role === 'admin' && (
                    <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 w-fit rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 bg-gradient-to-b from-blue-400 to-blue-600 text-white">
                        <FaShieldAlt size={8} /> ADMIN
                    </span>
                )}
                {member.role === 'moderator' && (
                    <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 w-fit rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 bg-gradient-to-b from-purple-400 to-purple-600 text-white">
                        <FaShieldAlt size={8} /> MOD
                    </span>
                )}
                {member.role === 'user' && (
                    <p className="text-[11px] truncate mt-0.5 leading-none text-[#86868b] dark:text-[#94a3b8]">{statusText}</p>
                )}
            </div>
            {canModerate && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onOpenModeration();
                    }}
                    className="opacity-0 group-hover/member:opacity-100 p-1 text-[#86868b] hover:text-[#0071e3] transition-opacity cursor-pointer rounded-md hover:bg-black/5 dark:hover:bg-white/10"
                    title="Moderar membro"
                >
                    <FaEllipsisV size={11} />
                </button>
            )}
        </div>
    );
};

export default MembersSidebar;
