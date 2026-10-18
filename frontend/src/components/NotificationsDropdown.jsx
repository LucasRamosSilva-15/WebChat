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
    Plus
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

    const filterTabs = [
        { id: 'all', label: 'Todas', count: notifications.length },
        { id: 'unread', label: 'Não Lidas', count: unreadCount },
        { id: 'system', label: 'Sistema', count: notifications.filter(n => n.type === 'system' || n.type === 'info').length }
    ];

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
                        className="notification-badge absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-gradient-to-b from-rose-500 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white dark:border-slate-800 leading-none select-none [text-shadow:none]"
                        style={{ textShadow: 'none' }}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            <div
                className={`skeuo-card w-96 max-w-[calc(100vw-2rem)] p-0 overflow-hidden shadow-[0_20px_50px_rgba(15,23,42,0.18)] border border-white/80 dark:border-slate-700/80 fixed sm:absolute left-3 right-3 sm:left-auto sm:right-0 top-[52px] sm:top-[48px] origin-top-right z-[160] transition-all duration-300 ${
                    isOpen ? 'scale-100 opacity-100 visible pointer-events-auto' : 'scale-95 opacity-0 invisible pointer-events-none'
                }`}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                            Notificações
                        </h3>
                        {unreadCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold text-sky-700 dark:text-sky-300 bg-sky-100/90 dark:bg-sky-950/60 border border-sky-300/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                                {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                                Em dia
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => simulateNotification()}
                            title="Criar notificação ou anúncio"
                            aria-label="Simular notificação"
                            className="btn-secondary-glossy !w-7 !h-7 !p-0 rounded-full inline-flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                title="Marcar todas como lidas"
                                aria-label="Marcar todas como lidas"
                                className="btn-secondary-glossy !w-7 !h-7 !p-0 rounded-full inline-flex items-center justify-center text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-50/60 dark:bg-slate-900/40 border-b border-slate-200/60 dark:border-slate-800/40">
                    <div className="p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700/60 flex items-center gap-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                        {filterTabs.map((tab) => {
                            const isActive = filterTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setFilterTab(tab.id)}
                                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                        isActive
                                            ? 'btn-secondary-glossy text-sky-700 dark:text-sky-300 shadow-xs'
                                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                                        isActive ? 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-bold' : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="max-h-[340px] overflow-y-auto skeuo-scrollbar divide-y divide-slate-100 dark:divide-slate-800/50">
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
                                className={`p-4 border-b border-slate-100 dark:border-slate-800/50 flex items-start gap-3.5 transition-colors relative group cursor-pointer ${
                                    !item.read
                                        ? 'bg-sky-50/50 dark:bg-sky-950/20'
                                        : 'bg-transparent hover:bg-slate-50/60 dark:hover:bg-slate-850/40'
                                }`}
                            >
                                <div className="skeuo-surface-orb-badge w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-amber-500 shadow-sm">
                                    {getNotificationIcon(item.type)}
                                </div>

                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                            {item.title}
                                        </h4>
                                        {!item.read && (
                                            <span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.7),inset_0_0.5px_0.5px_rgba(255,255,255,0.9)] shrink-0" />
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                        {item.content}
                                    </p>
                                    <span className="text-[10px] text-slate-400 mt-1.5 block">
                                        {formatRelativeTime(item.time)}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeNotification(item.id);
                                    }}
                                    aria-label="Remover notificação"
                                    title="Remover notificação"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-white/80 dark:hover:bg-slate-800 absolute right-3 top-3 cursor-pointer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div className="px-4 py-3 bg-slate-50/70 dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/settings');
                        }}
                        className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                    >
                        <Sliders className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                        Ajustes de Som
                    </button>
                    {notifications.length > 0 && (
                        <button
                            type="button"
                            onClick={clearAll}
                            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Limpar Tudo
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsDropdown;
