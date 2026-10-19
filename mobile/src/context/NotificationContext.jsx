import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../services/socket';

const NotificationContext = createContext();

const STORAGE_KEY = 'skyripple_mobile_notifs';

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

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.30);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.10);
    osc2.start(now + 0.10);
    osc2.stop(now + 0.30);
  } catch {
  }
};

const triggerHaptic = () => {
  try {
    if (window.Capacitor?.isPluginAvailable('Haptics')) {
      window.Capacitor.Plugins.Haptics.impact({ style: 'light' });
    } else if (navigator.vibrate) {
      navigator.vibrate(40);
    }
  } catch {
  }
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    title: 'Boas-vindas ao SkyRipple Mobile! 🎉',
    desc: 'Explore as salas de conversação públicas e troque ideias em tempo real com fluidez tátil.',
    time: 'Agora',
    read: false,
    link: '/rooms'
  },
  {
    id: 'notif_dock',
    title: 'Dock Flutuante Ativo ⚡',
    desc: 'Navegue facilmente entre salas, mensagens diretas e ajustes na base da tela.',
    time: '1h atrás',
    read: false,
    link: '/rooms'
  }
];

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
    }
    return INITIAL_NOTIFICATIONS;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
    }
  }, [notifications]);

  const addNotification = useCallback((notif) => {
    const item = {
      id: notif.id || 'notif_' + Date.now(),
      title: notif.title || 'Nova Notificação',
      desc: notif.desc || notif.content || '',
      time: notif.time || 'Agora',
      read: false,
      link: notif.link || '/rooms'
    };

    setNotifications(prev => [item, ...prev]);

    const soundEnabled = localStorage.getItem('chat_soundEnabled') !== 'false';
    if (soundEnabled) {
      playChime();
    }
    triggerHaptic();
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    triggerHaptic();
  }, []);

  useEffect(() => {
    const handleNewMessage = (msg) => {
      const currentUserId = localStorage.getItem('chat_uniqueUserId');
      if (msg.userId && msg.userId !== currentUserId) {
        addNotification({
          title: `Nova mensagem em #${msg.room || 'Geral'}`,
          desc: `${msg.sender || 'Usuário'}: ${msg.text?.slice(0, 50) || 'Enviou uma mídia'}`,
          time: 'Agora',
          link: `/chat?room=${encodeURIComponent(msg.room || 'Geral')}`
        });
      }
    };

    socket.on('receive_message', handleNewMessage);
    socket.on('chat_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
      socket.off('chat_message', handleNewMessage);
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        playChime,
        triggerHaptic
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    return {
      notifications: [],
      unreadCount: 0,
      addNotification: () => {},
      markAsRead: () => {},
      markAllAsRead: () => {},
      playChime: () => {},
      triggerHaptic: () => {}
    };
  }
  return context;
};
