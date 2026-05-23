import React from 'react';
import { FaCrown, FaShieldAlt } from 'react-icons/fa';

const MembersSidebar = ({ onlineCount, mockRoles = {} }) => {
    // Mock members (deve ser removido no futuro)
    const mockMembers = [
        { name: 'Você', status: 'Online', role: 'Usuário', online: true },
        { name: 'Admin', status: 'Disponível', role: 'Dono', online: true },
        { name: 'Moderador', status: 'Vigiando', role: 'Moderador', online: true }
    ];

    return (
        <div className="w-[220px] h-[calc(100vh-48px)] sticky top-[48px] bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] border-l border-[#d2d2d7] shadow-[inset_1px_0_0_rgba(255,255,255,0.8)] hidden xl:flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 pt-5">
                <h3 className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-1">
                    Online — {onlineCount || mockMembers.filter(m => m.online).length}
                </h3>
            </div>
            <div className="px-3 space-y-1">
                {mockMembers.filter(m => m.online).map((member, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer transition-all">
                        <div className="relative inline-flex shrink-0">
                            <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-b from-sky-400 to-sky-600 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]">
                                <div className="w-full h-full rounded-full bg-gradient-to-b from-white to-gray-50 flex items-center justify-center font-semibold text-gray-700 text-[12px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gradient-to-b from-emerald-400 to-emerald-500 rounded-full border-2 border-white shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <span className="text-[13px] font-semibold text-[#1d1d1f] truncate leading-tight">{member.name}</span>
                            {member.role === 'Dono' && (
                                <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 w-fit">
                                    <FaCrown size={8} /> DONO
                                </span>
                            )}
                            {member.role === 'Moderador' && (
                                <span className="inline-flex items-center text-[9px] px-1.5 py-0.5 mt-0.5 gap-1 bg-gradient-to-b from-violet-400 to-violet-600 text-white rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 w-fit">
                                    <FaShieldAlt size={8} /> MOD
                                </span>
                            )}
                            {member.role === 'Usuário' && (
                                <p className="text-[11px] text-[#86868b] truncate mt-0.5 leading-none">{member.status}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 mt-4 border-t border-[#d2d2d7] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <h3 className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-1">
                    Offline — 0
                </h3>
            </div>
            <div className="px-3 space-y-1 opacity-60">
            </div>
        </div>
    );
};

export default MembersSidebar;
