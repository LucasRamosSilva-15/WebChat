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
        <div className="chat-sidebar animate-chat-panel-left hidden lg:flex w-[220px] h-[calc(100vh-48px)] sticky top-[48px] flex-col shrink-0">
            <nav className="chat-sidebar-list flex-1 p-3 overflow-y-auto space-y-1">
                <div className="sidebar-title text-[11px] mb-3 ml-2 mt-2">Navegação</div>
                {navItems.map(item => (
                    item.disabled ? (
                        <span
                            key={item.id}
                            className="chat-sidebar-item chat-sidebar-item-disabled w-full flex items-center gap-3 px-3 py-2"
                        >
                            <span className="chat-sidebar-item-icon flex items-center justify-center w-6 h-6">{item.icon}</span>
                            <span className="chat-sidebar-item-label text-sm flex-1 text-left">{item.label} (Em breve)</span>
                        </span>
                    ) : (
                    <Link
                        key={item.id}
                        to={item.id}
                        className={`chat-sidebar-item w-full flex items-center gap-3 px-3 py-2 ${activeTab === item.id ? 'chat-sidebar-item-active' : ''}`}
                    >
                        <span className="chat-sidebar-item-icon flex items-center justify-center w-6 h-6">{item.icon}</span>
                        <span className="chat-sidebar-item-label text-sm flex-1 text-left">{item.label}</span>
                        {item.badge && (
                            <span className={`chat-sidebar-badge min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] ${activeTab === item.id ? 'chat-sidebar-badge-active' : 'chat-sidebar-badge-inactive'}`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                    )
                ))}
            </nav>

            <div className="chat-sidebar-footer p-3">
                <Link to="/custom" className="chat-sidebar-profile flex items-center gap-3 p-2.5">
                    <UserAvatar src={profilePhoto} name={displayName} size="sm" showStatus={true} status="online" />
                    <div className="flex-1 min-w-0">
                        <h4 className="chat-sidebar-profile-name text-[13px] truncate">{displayName}</h4>
                        <div className="chat-sidebar-profile-status-row flex items-center gap-1.5 mt-0.5">
                            <span className="chat-sidebar-status-dot w-1.5 h-1.5"></span>
                            <span className="chat-sidebar-status-text text-[10px]">Online</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ChatSidebar;
