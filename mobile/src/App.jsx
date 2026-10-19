import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MobileBottomNav from './components/mobile/MobileBottomNav';
import MobileSheet from './components/mobile/MobileSheet';
import MobileRooms from './pages/Rooms';
import MobileChat from './pages/Chat';
import MobileDirects from './pages/Directs';
import MobileProfile from './pages/Profile';
import MobileSettings from './pages/Settings';
import MobileLogin from './pages/Login';
import MobileRegister from './pages/Register';
import MobileForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { supabase, syncOAuthUserSession } from './services/supabase';
import { clearAuthSession } from './services/api';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const syncedSessionRef = useRef(null);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const isChatScreen = location.pathname.startsWith('/chat');
  const isAuthScreen = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const showBottomNav = !isChatScreen && !isAuthScreen;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || (!session && event !== 'INITIAL_SESSION')) {
        syncedSessionRef.current = null;
        Object.keys(localStorage).forEach((key) => {
          if (
            key.startsWith('sb-') ||
            key.includes('token') ||
            key.includes('user') ||
            key.includes('auth') ||
            key.includes('skyripple')
          ) {
            localStorage.removeItem(key);
          }
        });
        sessionStorage.clear();
        clearAuthSession();
        return;
      }

      if (session?.access_token && syncedSessionRef.current !== session.access_token) {
        syncedSessionRef.current = session.access_token;

        const existingToken = localStorage.getItem('chat_token');
        if (!existingToken) {
          try {
            const synced = await syncOAuthUserSession(session);
            if (synced?.token) {
              if (window.location.hash) {
                window.history.replaceState(null, '', window.location.pathname);
              }
              navigate('/rooms', { replace: true });
            }
          } catch (err) {
            console.warn('Sincronização OAuth adiada ou limitada:', err.message);
          }
        } else if (['/login', '/register', '/forgot-password', '/'].includes(window.location.pathname)) {
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          navigate('/rooms', { replace: true });
        }
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-200/60 dark:bg-slate-950 flex justify-center font-sans select-none">
      <div className="w-full max-w-md min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col relative shadow-2xl overflow-x-hidden">
        <Routes>
          <Route path="/login" element={<MobileLogin />} />
          <Route path="/register" element={<MobileRegister />} />
          <Route path="/forgot-password" element={<MobileForgotPassword />} />
          <Route path="/" element={<Navigate to="/rooms" replace />} />

          <Route element={<PrivateRoute />}>
            <Route path="/rooms" element={<MobileRooms onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={unreadCount} />} />
            <Route path="/chat" element={<MobileChat />} />
            <Route path="/chat/:roomId" element={<MobileChat />} />
            <Route path="/directs" element={<MobileDirects onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={unreadCount} />} />
            <Route path="/profile" element={<MobileProfile onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={unreadCount} />} />
            <Route path="/settings" element={<MobileSettings onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={unreadCount} />} />
          </Route>

          <Route path="*" element={<Navigate to="/rooms" replace />} />
        </Routes>

        {showBottomNav && (
          <MobileBottomNav
            unreadCount={unreadCount}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}

        <MobileSheet
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          title="Avisos e Notificações"
        >
          <div className="space-y-2.5">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Nenhuma notificação no momento.
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="p-3 rounded-2xl skeuo-well flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{n.title}</h4>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300">{n.desc}</p>
                </div>
              ))
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  markAllAsRead();
                  setIsNotificationsOpen(false);
                }}
                className="skeuo-btn-primary w-full min-h-[44px] text-xs font-bold text-white rounded-xl mt-3"
              >
                Marcar Todas como Lidas
              </button>
            )}
          </div>
        </MobileSheet>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <AppLayout />
      </Router>
    </NotificationProvider>
  );
}
