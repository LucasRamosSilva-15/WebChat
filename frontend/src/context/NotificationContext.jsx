import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../socket';
import { apiRequest, getAuthToken } from '../services/api';

const NotificationContext = createContext();

const STORAGE_KEY = 'chat_notifications';
const SOUND_KEY = 'chat_notifSound';
const TOAST_KEY = 'chat_notifToasts';

const playChime = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        osc1.frequency.exponentialRampToValueAtTime(880, now + 0.10);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(880, now + 0.10);
        osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.10);
        osc2.start(now + 0.10);
        osc2.stop(now + 0.32);
    } catch {
    }
};

const DEFAULT_NOTIFICATIONS = [
    {
        id: 'notif_welcome',
        type: 'system',
        title: 'Boas-vindas ao SkyRipple! 🎉',
        content: 'Explore as salas de conversação públicas e troque ideias em tempo real.',
        time: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        read: false,
        link: '/rooms'
    },
    {
        id: 'notif_limit_update',
        type: 'info',
        title: 'Novo limitador de mensagens ⚡',
        content: 'As mensagens nas salas agora contam com o limite de 1.000 caracteres e indicador visual.',
        time: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
        read: false,
        link: '/rooms'
    },
    {
        id: 'notif_profile_tip',
        type: 'system',
        title: 'Personalize o seu Perfil ✨',
        content: 'Adicione uma foto e seu recado público na página de personalização.',
        time: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        read: true,
        link: '/custom'
    }
];

const mapNotification = (item) => ({
    id: item.id,
    type: item.type || 'system',
    title: item.title || 'Nova Notificação',
    content: item.content || '',
    time: item.created_at || item.time || new Date().toISOString(),
    read: Boolean(item.read),
    link: item.link || null,
    data: item.data || null
});

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error('Erro ao ler notificações do localStorage:', e);
        }
        return DEFAULT_NOTIFICATIONS;
    });

    const [soundEnabled, setSoundEnabled] = useState(() => {
        const saved = localStorage.getItem(SOUND_KEY);
        return saved !== null ? saved === 'true' : true;
    });

    const [toastsEnabled, setToastsEnabled] = useState(() => {
        const saved = localStorage.getItem(TOAST_KEY);
        return saved !== null ? saved === 'true' : true;
    });

    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
        } catch (e) {
            console.error('Erro ao persistir notificações:', e);
        }
    }, [notifications]);

    useEffect(() => {
        localStorage.setItem(SOUND_KEY, String(soundEnabled));
    }, [soundEnabled]);

    useEffect(() => {
        localStorage.setItem(TOAST_KEY, String(toastsEnabled));
    }, [toastsEnabled]);

    const fetchServerNotifications = useCallback(async () => {
        const token = getAuthToken();
        if (!token) return;
        try {
            const res = await apiRequest('/notifications');
            if (res && Array.isArray(res.notifications)) {
                setNotifications(res.notifications.map(mapNotification));
            }
        } catch (e) {
            console.error('Erro ao buscar notificações do servidor:', e);
        }
    }, []);

    useEffect(() => {
        fetchServerNotifications();

        const handleAuthOrProfileChange = () => {
            fetchServerNotifications();
        };

        const handleStorage = (e) => {
            if (e.key === 'chat_token') {
                fetchServerNotifications();
            }
        };

        window.addEventListener('profileUpdated', handleAuthOrProfileChange);
        window.addEventListener('storage', handleStorage);

        return () => {
            window.removeEventListener('profileUpdated', handleAuthOrProfileChange);
            window.removeEventListener('storage', handleStorage);
        };
    }, [fetchServerNotifications]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const addNotification = useCallback((item) => {
        const newNotif = {
            id: item.id || ('notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
            type: item.type || 'system',
            title: item.title || 'Nova Notificação',
            content: item.content || '',
            time: item.created_at || item.time || new Date().toISOString(),
            read: Boolean(item.read),
            link: item.link || null,
            data: item.data || null
        };

        setNotifications(prev => [newNotif, ...prev.filter(n => n.id !== newNotif.id)].slice(0, 50));

        if (soundEnabled) {
            playChime();
        }

        if (toastsEnabled) {
            setToasts(prev => [newNotif, ...prev].slice(0, 3));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== newNotif.id));
            }, 4500);
        }

        if (getAuthToken() && !item.skipServer) {
            apiRequest('/notifications', {
                method: 'POST',
                body: JSON.stringify({
                    type: newNotif.type,
                    title: newNotif.title,
                    content: newNotif.content,
                    link: newNotif.link,
                    data: newNotif.data
                })
            }).then(res => {
                if (res && res.notification) {
                    const serverNotif = mapNotification(res.notification);
                    setNotifications(prev => prev.map(n => n.id === newNotif.id ? serverNotif : n));
                }
            }).catch(() => {});
        }

        return newNotif;
    }, [soundEnabled, toastsEnabled]);

    const markAsRead = useCallback((id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        );
        if (getAuthToken()) {
            apiRequest(`/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
        }
    }, []);

    const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        if (getAuthToken()) {
            apiRequest('/notifications/read-all', { method: 'PATCH' }).catch(() => {});
        }
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        setToasts(prev => prev.filter(t => t.id !== id));
        if (getAuthToken()) {
            apiRequest(`/notifications/${id}`, { method: 'DELETE' }).catch(() => {});
        }
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        setToasts([]);
        if (getAuthToken()) {
            apiRequest('/notifications/all', { method: 'DELETE' }).catch(() => {});
        }
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const simulateNotification = useCallback(() => {
        const examples = [
            {
                type: 'message',
                title: 'Nova mensagem em #Tecnologia',
                content: 'Marina Silva: "Alguém já testou os novos temas Frutiger Aero?"',
                link: '/rooms'
            },
            {
                type: 'invite',
                title: 'Convite de Sala Privada',
                content: 'Rafael Costa convidou você para a sala "Design & UI".',
                link: '/rooms'
            },
            {
                type: 'reaction',
                title: 'Nova curtida recebida ❤️',
                content: 'Lucas Ramos curtiu a sua mensagem na sala Geral.',
                link: '/rooms'
            },
            {
                type: 'system',
                title: 'Atualização do Sistema SkyRipple',
                content: 'Conexão WebSocket e sincronização em tempo real ativas.',
                link: '/settings'
            }
        ];
        const randomItem = examples[Math.floor(Math.random() * examples.length)];
        return addNotification(randomItem);
    }, [addNotification]);

    useEffect(() => {
        const handleCustomNotify = (e) => {
            if (e.detail) {
                addNotification(e.detail);
            }
        };
        window.addEventListener('skyripple:notification', handleCustomNotify);

        const handleServerNotification = (notif) => {
            if (!notif) return;
            const formatted = mapNotification(notif);
            setNotifications(prev => {
                if (prev.some(n => n.id === formatted.id)) return prev;
                return [formatted, ...prev].slice(0, 50);
            });
            if (soundEnabled) {
                playChime();
            }
            if (toastsEnabled) {
                setToasts(prev => [formatted, ...prev].slice(0, 3));
                setTimeout(() => {
                    setToasts(prev => prev.filter(t => t.id !== formatted.id));
                }, 4500);
            }
        };
        socket.on('new_notification', handleServerNotification);

        const handlePrivateInvite = (invite) => {
            if (invite && invite.from) {
                addNotification({
                    type: 'invite',
                    title: 'Convite para Chat Privado',
                    content: `${invite.from} quer conversar com você em privado.`,
                    link: `/chat?room=${invite.room}`
                });
            }
        };
        socket.on('private_invite', handlePrivateInvite);

        const handleReceiveMessage = (msg) => {
            const currentUserId = localStorage.getItem('chat_uniqueUserId');
            if (!msg || msg.user_id === currentUserId) return;
            const currentPath = window.location.pathname;
            const currentSearch = new URLSearchParams(window.location.search);
            const currentRoom = currentSearch.get('room');

            if (currentPath !== '/chat' || currentRoom !== msg.room_id) {
                addNotification({
                    type: 'message',
                    title: `Nova mensagem em #${msg.room_id || 'sala'}`,
                    content: `${msg.user_name || 'Alguém'}: ${msg.content ? (msg.content.length > 55 ? msg.content.substring(0, 55) + '...' : msg.content) : 'Enviou uma imagem'}`,
                    link: `/chat?room=${msg.room_id}`
                });
            }
        };
        socket.on('receive_message', handleReceiveMessage);

        return () => {
            window.removeEventListener('skyripple:notification', handleCustomNotify);
            socket.off('new_notification', handleServerNotification);
            socket.off('private_invite', handlePrivateInvite);
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [addNotification, soundEnabled, toastsEnabled]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                soundEnabled,
                setSoundEnabled,
                toastsEnabled,
                setToastsEnabled,
                toasts,
                fetchServerNotifications,
                addNotification,
                markAsRead,
                markAllAsRead,
                removeNotification,
                clearAll,
                dismissToast,
                simulateNotification
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications deve ser utilizado dentro de um NotificationProvider');
    }
    return context;
};
