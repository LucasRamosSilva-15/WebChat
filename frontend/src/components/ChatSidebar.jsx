import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaComments, FaEnvelope, FaStar, FaUser, FaCog, FaTimes } from 'react-icons/fa';
import UserAvatar from './UserAvatar';

const ChatSidebar = ({ isMobileOpen, onClose }) => {
    const location = useLocation();
    const activeTab = location.pathname;

    const displayName = localStorage.getItem('chat_displayName') || 'Usuário';
    const profilePhoto = localStorage.getItem('chat_profilePhoto');

    const navItems = [
        { id: '/', icon: <FaHome size={16} />, label: 'Início', badge: null },
        { id: '/rooms', icon: <FaComments size={16} />, label: 'Salas', badge: null },
        { id: '/chat', icon: <FaEnvelope size={16} />, label: 'Diretas', badge: null },
        { id: '/favorites', icon: <FaStar size={16} />, label: 'Favoritos', badge: null, disabled: true },
        { id: '/custom', icon: <FaUser size={16} />, label: 'Perfil', badge: null },
        { id: '/settings', icon: <FaCog size={16} />, label: 'Ajustes', badge: null },
    ];

    return (
        <div className={`animate-chat-panel-left lg:flex w-[220px] h-[calc(100vh-48px)] sticky top-[48px] flex-col shrink-0 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] border-r border-[#d2d2d7] shadow-[inset_-1px_0_0_rgba(255,255,255,0.8)] dark:from-[#1e293b] dark:to-[#0f172a] dark:border-white/5 dark:shadow-[inset_-1px_0_0_rgba(255,255,255,0.02)] ${isMobileOpen ? 'flex fixed inset-y-0 left-0 z-40 bg-white/95 dark:bg-[#1c1c1e]/95 backdrop-blur-xl shadow-2xl h-[100vh] top-0 pt-12' : 'hidden'}`}>
            {isMobileOpen && (
                <button onClick={onClose} className="absolute top-3 right-3 text-[#86868b] dark:text-[#94a3b8] hover:text-[#0071e3] lg:hidden p-2">
                    <FaTimes size={18} />
                </button>
            )}
            <nav className="flex-1 p-3 overflow-y-auto space-y-1">
                <div className="text-[11px] mb-3 ml-2 mt-2 font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">Navegação</div>
                {navItems.map(item => (
                    item.disabled ? (
                        <span
                            key={item.id}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium opacity-50 cursor-not-allowed text-[#86868b] dark:text-[#94a3b8]"
                        >
                            <span className="flex items-center justify-center w-6 h-6">{item.icon}</span>
                            <span className="text-sm flex-1 text-left">{item.label} (Em breve)</span>
                        </span>
                    ) : (
                    <Link
                        key={item.id}
                        to={item.id}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl font-medium transition-all duration-150 ${activeTab === item.id ? 'bg-gradient-to-b from-[#38bdf8] to-[#0284c7] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.15)] dark:from-[#0284c7] dark:to-[#075985]' : 'text-[#424245] dark:text-[#cbd5e1] hover:bg-white hover:shadow-xs hover:text-[#1d1d1f] dark:hover:bg-slate-700 dark:hover:shadow-sm dark:hover:text-white'}`}
                    >
                        <span className="flex items-center justify-center w-6 h-6">{item.icon}</span>
                        <span className="text-sm flex-1 text-left">{item.label}</span>
                        {item.badge && (
                            <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] rounded-full font-bold ${activeTab === item.id ? 'bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]' : 'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]'}`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                    )
                ))}
            </nav>

            <div className="p-3 bg-gradient-to-b from-[#ebebed] to-[#e0e0e0] border-t border-[#d2d2d7] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] dark:from-[#0f172a] dark:to-[#020617] dark:border-white/5 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
                <Link to="/custom" className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-200 cursor-pointer transition-colors duration-150 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] hover:bg-gray-50 dark:bg-slate-800 dark:border-slate-900 dark:shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] dark:hover:bg-slate-700">
                    <UserAvatar src={profilePhoto} name={displayName} size="sm" showStatus={true} status="online" />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] truncate font-semibold text-[#1d1d1f] dark:text-slate-50">{displayName}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Online</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ChatSidebar;
