import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaComments, FaEnvelope, FaStar, FaUser, FaCog } from 'react-icons/fa';
import UserAvatar from './UserAvatar';

const ChatSidebar = () => {
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
        { id: '/settings', icon: <FaCog size={16} />, label: 'Ajustes', badge: null, disabled: true },
    ];

    return (
        <div className="w-[220px] h-[calc(100vh-48px)] sticky top-[48px] flex flex-col bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] border-r border-[#d2d2d7] shadow-[inset_-1px_0_0_rgba(255,255,255,0.8)] hidden lg:flex shrink-0">
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                <div className="text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3 ml-2 mt-2">Navegação</div>
                {navItems.map(item => (
                    item.disabled ? (
                        <span
                            key={item.id}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[#86868b] opacity-50 cursor-not-allowed font-medium"
                        >
                            <span className="flex items-center justify-center w-6 h-6">{item.icon}</span>
                            <span className="text-[14px] flex-1 text-left">{item.label} (Em breve)</span>
                        </span>
                    ) : (
                    <Link
                        key={item.id}
                        to={item.id}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-150 ${activeTab === item.id ? 'bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.15)] font-medium' : 'text-[#424245] hover:bg-white hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:text-[#1d1d1f] font-medium'}`}
                    >
                        <span className="flex items-center justify-center w-6 h-6">{item.icon}</span>
                        <span className="text-[14px] flex-1 text-left">{item.label}</span>
                        {item.badge && (
                            <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center ${activeTab === item.id ? 'bg-white/20 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]' : 'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]'}`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                    )
                ))}
            </nav>

            <div className="p-3 bg-gradient-to-b from-[#ebebed] to-[#e0e0e0] border-t border-[#d2d2d7] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <Link to="/custom" className="block bg-white rounded-xl p-2.5 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <UserAvatar src={profilePhoto} name={displayName} size="sm" showStatus={true} status="online" />
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[13px] font-semibold text-[#1d1d1f] truncate">{displayName}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">Online</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ChatSidebar;
