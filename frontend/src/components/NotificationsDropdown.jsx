import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import {
    Bell,
    CheckCheck,
    Trash2,
    X,
    MessageSquare,
    Mail,
    Heart,
    Info,
    Sparkles,
    Sliders,
    PlusCircle
} from 'lucide-react';

const formatRelativeTime = (timeStr) => {
    if (!timeStr) return '';
    try {
        const date = new Date(timeStr);
        const now = new Date();
        const diffSec = Math.floor((now - date) / 1000);
        if (diffSec < 60) return 'Agora';
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `Há ${diffMin} min`;
        const diffHours = Math.floor(diffMin / 60);
        if (diffHours < 24) return `Há ${diffHours} h`;
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `Há ${diffDays} dias`;
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    } catch {
        return '';
    }
};

const getNotificationIcon = (type) => {
    switch (type) {
        case 'message':
            return <MessageSquare className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
        case 'invite':
            return <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
        case 'reaction':
            return <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400 fill-rose-500/20" />;
        case 'info':
            return <Info className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
        case 'system':
        default:
            return <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
    }
};

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [filterTab, setFilterTab] = useState('all');
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        simulateNotification
    } = useNotifications();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredNotifications = notifications.filter(item => {
        if (filterTab === 'unread') return !item.read;
        if (filterTab === 'system') return item.type === 'system' || item.type === 'info';
        return true;
    });

    const handleItemClick = (item) => {
        markAsRead(item.id);
        setIsOpen(false);
        if (item.link) {
            navigate(item.link);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`btn-secondary-glossy !w-8 !h-8 !p-0 rounded-full inline-flex items-center justify-center transition-all cursor-pointer relative ${
                    unreadCount > 0
                        ? 'text-sky-600 dark:text-sky-400'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
                title="Notificações"
                aria-label="Abrir Notificações"
                aria-expanded={isOpen}
            >
                <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'animate-bounce-short' : ''}`} />

                {unreadCount > 0 && (
                    <span
                        className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-gradient-to-b from-rose-500 to-rose-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs border border-white dark:border-slate-800 leading-none"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            <div
                className={`fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-[52px] sm:top-[48px] max-w-[calc(100vw-24px)] sm:w-[380px] overflow-hidden transition-all duration-300 origin-top-right rounded-2xl !p-0 skeuo-panel shadow-2xl z-[160] ${
                    isOpen ? 'scale-100 opacity-100 visible pointer-events-auto' : 'scale-95 opacity-0 invisible pointer-events-none'
                }`}
            >
                <div className="p-4 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between bg-gradient-to-b from-white/90 to-slate-50/80 dark:from-slate-850 dark:to-slate-900">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            Notificações
                        </h3>
                        {unreadCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300/60 dark:border-sky-700/60">
                                {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                Em dia
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => simulateNotification()}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 dark:text-slate-400 dark:hover:text-sky-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                            title="Simular nova notificação de teste"
                            aria-label="Simular notificação"
                        >
                            <PlusCircle className="w-3.5 h-3.5" />
                        </button>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
                                title="Marcar todas como lidas"
                                aria-label="Marcar todas como lidas"
                            >
                                <CheckCheck className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-900/60 border-b border-slate-200/70 dark:border-white/5 flex gap-1">
                    {[
                        { id: 'all', label: 'Todas', count: notifications.length },
                        { id: 'unread', label: 'Não Lidas', count: unreadCount },
                        { id: 'system', label: 'Sistema', count: notifications.filter(n => n.type === 'system' || n.type === 'info').length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setFilterTab(tab.id)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                filterTab === tab.id
                                    ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-xs border border-slate-200 dark:border-slate-700'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            <span>{tab.label}</span>
                            {tab.count > 0 && (
                                <span className={`text-[9px] px-1 rounded-full ${
                                    filterTab === tab.id
                                        ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="max-h-[340px] overflow-y-auto skeuo-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredNotifications.length === 0 ? (
                        <div className="py-10 px-4 text-center flex flex-col items-center justify-center">
                            <div className="skeuo-surface-orb-badge w-12 h-12 rounded-full flex items-center justify-center mb-3 text-slate-400 dark:text-slate-500">
                                <Bell className="w-5 h-5 opacity-60" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                Nenhuma notificação encontrada
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 max-w-[220px]">
                                {filterTab === 'unread'
                                    ? 'Você já leu todas as suas mensagens e avisos.'
                                    : 'Avisos e mensagens de salas aparecerão aqui.'}
                            </p>
                            <button
                                type="button"
                                onClick={() => simulateNotification()}
                                className="mt-3 text-[11px] text-sky-600 dark:text-sky-400 font-semibold hover:underline cursor-pointer"
                            >
                                + Criar notificação de teste
                            </button>
                        </div>
                    ) : (
                        filteredNotifications.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => handleItemClick(item)}
                                className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group relative ${
                                    !item.read
                                        ? 'bg-sky-50/70 dark:bg-sky-950/25 hover:bg-sky-100/60 dark:hover:bg-sky-950/40'
                                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                }`}
                            >
                                <div className="skeuo-surface-orb-badge w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    {getNotificationIcon(item.type)}
                                </div>

                                <div className="flex-1 min-w-0 pr-6">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <h4 className={`text-xs truncate ${!item.read ? 'font-bold text-slate-900 dark:text-slate-50' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                            {item.title}
                                        </h4>
                                        {!item.read && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 shadow-[0_0_6px_rgba(14,165,233,0.8)]" />
                                        )}
                                    </div>
                                    <p className="text-[11.5px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {item.content}
                                    </p>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                                        {formatRelativeTime(item.time)}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeNotification(item.id);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 focus:opacity-100 absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                                    title="Remover notificação"
                                    aria-label="Remover notificação"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="p-3 bg-gradient-to-b from-[#f8fafc] to-[#eef2f6] dark:from-[#0f172a] dark:to-[#090d16] border-t border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/settings');
                        }}
                        className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1.5 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                        <Sliders className="w-3.5 h-3.5" />
                        Ajustes de Som
                    </button>

                    {notifications.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3 h-3" />
                            Limpar Tudo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsDropdown;
