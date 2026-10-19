import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

function AppLayout() {
  const location = useLocation();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const isChatScreen = location.pathname.startsWith('/chat');
  const isAuthScreen = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const showBottomNav = !isChatScreen && !isAuthScreen;

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
            {notifications.map((n) => (
              <div key={n.id} className="p-3 rounded-2xl skeuo-well flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{n.time}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-300">{n.desc}</p>
              </div>
            ))}

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
