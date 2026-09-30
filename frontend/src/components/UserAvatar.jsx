import React from 'react';

const UserAvatar = ({ src, name = '?', size = 'md', showStatus = false, status = 'online', onClick, className = '' }) => {
    const validSize = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].includes(size) ? size : 'md';
    const validStatus = ['online', 'offline', 'busy', 'away'].includes(status) ? status : 'online';
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div
            className={`avatar-wrapper ${onClick ? 'avatar-wrapper-clickable' : ''} ${className}`}
            onClick={onClick}
        >
            <div className={`avatar-${validSize} avatar-ring avatar-ring-${validSize}`}>
                <div className="webchat-avatar-inner">
                    {src ? (
                        <img src={src} alt={name} className="avatar-image" />
                    ) : (
                        <span>{initial}</span>
                    )}
                </div>
            </div>
            {showStatus && (
                <span className={`avatar-status avatar-status-${validSize} avatar-status-${validStatus}`} />
            )}
        </div>
    );
};

export default UserAvatar;
