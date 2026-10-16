import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { MessageSquare, Mail, Heart, Info, Sparkles, X, ExternalLink } from 'lucide-react';

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

const NotificationToastContainer = () => {
    const { toasts, dismissToast, markAsRead } = useNotifications();
    const navigate = useNavigate();

    if (!toasts || toasts.length === 0) return null;

    return (
        <aside
            aria-label="Notificações em tempo real"
            className="fixed top-14 right-4 z-[200] flex flex-col gap-2.5 max-w-[360px] w-full pointer-events-none"
        >
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    onClick={() => {
                        markAsRead(toast.id);
                        dismissToast(toast.id);
                        if (toast.link) {
                            navigate(toast.link);
                        }
                    }}
                    role="alert"
                    tabIndex={0}
                    className="pointer-events-auto cursor-pointer skeuo-panel p-3.5 rounded-2xl flex items-start gap-3 shadow-[0_8px_24px_rgba(0,102,204,0.18),inset_0_1px_0_rgba(255,255,255,0.95)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] border border-sky-300/50 dark:border-sky-500/30 transition-all hover:scale-[1.02] active:scale-[0.99] animate-fade-in-up"
                >
                    <div className="skeuo-surface-orb-badge w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        {getNotificationIcon(toast.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                        <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                {toast.title}
                            </h4>
                        </div>
                        <p className="text-[12px] text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                            {toast.content}
                        </p>
                        {toast.link && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-600 dark:text-sky-400 mt-1.5 hover:underline">
                                Acessar <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            dismissToast(toast.id);
                        }}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer shrink-0"
                        title="Fechar notificação"
                        aria-label="Fechar notificação"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </aside>
    );
};

export default NotificationToastContainer;
