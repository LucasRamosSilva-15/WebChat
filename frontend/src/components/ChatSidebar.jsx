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
        <div className="chat-sidebar animate-chat-panel-left">
            <nav className="chat-sidebar-list">
                <div className="sidebar-title">Navegação</div>
                {navItems.map(item => (
                    item.disabled ? (
                        <span
                            key={item.id}
                            className="chat-sidebar-item chat-sidebar-item-disabled"
                        >
                            <span className="chat-sidebar-item-icon">{item.icon}</span>
                            <span className="chat-sidebar-item-label">{item.label} (Em breve)</span>
                        </span>
                    ) : (
                    <Link
                        key={item.id}
                        to={item.id}
                        className={`chat-sidebar-item ${activeTab === item.id ? 'chat-sidebar-item-active' : ''}`}
                    >
                        <span className="chat-sidebar-item-icon">{item.icon}</span>
                        <span className="chat-sidebar-item-label">{item.label}</span>
                        {item.badge && (
                            <span className={`chat-sidebar-badge ${activeTab === item.id ? 'chat-sidebar-badge-active' : 'chat-sidebar-badge-inactive'}`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                    )
                ))}
            </nav>

            <div className="chat-sidebar-footer">
                <Link to="/custom" className="chat-sidebar-profile">
                    <UserAvatar src={profilePhoto} name={displayName} size="sm" showStatus={true} status="online" />
                    <div className="flex-1 min-w-0">
                        <h4 className="chat-sidebar-profile-name">{displayName}</h4>
                        <div className="chat-sidebar-profile-status-row">
                            <span className="chat-sidebar-status-dot"></span>
                            <span className="chat-sidebar-status-text">Online</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ChatSidebar;
