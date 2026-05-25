import React from 'react';

const UserAvatar = ({ src, name = '?', size = 'md', showStatus = false, status = 'online', onClick, className = '' }) => {
    const sizes = {
        xs: 'w-6 h-6 text-[10px]',
        sm: 'w-8 h-8 text-[12px]',
        md: 'w-10 h-10 text-[14px]',
        lg: 'w-14 h-14 text-[18px]',
        xl: 'w-16 h-16 text-[20px]',
        '2xl': 'w-24 h-24 text-[32px]'
    };

    const statusSizes = {
        xs: 'w-2 h-2',
        sm: 'w-2.5 h-2.5',
        md: 'w-3 h-3',
        lg: 'w-3.5 h-3.5',
        xl: 'w-4 h-4',
        '2xl': 'w-5 h-5'
    };

    const sizeClass = sizes[size] || sizes.md;
    const statusClass = statusSizes[size] || statusSizes.md;
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    const statusColors = {
        online: 'from-emerald-400 to-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]',
        offline: 'from-gray-400 to-gray-500 shadow-[0_0_6px_rgba(156,163,175,0.5)]',
        busy: 'from-red-400 to-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]',
        away: 'from-amber-400 to-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]'
    };

    const currentStatusColor = statusColors[status] || statusColors.online;

    const pClass = (size === '2xl') ? 'p-[3px]' : 'p-[2px]';

    return (
        <div
            className={`relative inline-flex shrink-0 ${onClick ? 'cursor-pointer transition-all duration-300 hover:scale-105' : ''} ${className}`}
            onClick={onClick}
        >
            <div className={`${sizeClass} rounded-full ${pClass} bg-gradient-to-b from-sky-400 to-sky-600 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]`}>
                <div className="w-full h-full rounded-full bg-gradient-to-b from-white to-gray-50 flex items-center justify-center font-semibold text-gray-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] overflow-hidden">
                    {src ? (
                        <img src={src} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{initial}</span>
                    )}
                </div>
            </div>
            {showStatus && (
                <span className={`absolute bottom-0 right-0 ${statusClass} bg-gradient-to-b ${currentStatusColor} rounded-full border-2 border-white`} />
            )}
        </div>
    );
};

export default UserAvatar;
