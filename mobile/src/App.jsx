import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import MobileBottomNav from './components/mobile/MobileBottomNav';
import MobileSheet from './components/mobile/MobileSheet';
import MobileRooms from './pages/Rooms';
import MobileChat from './pages/Chat';
import MobileDirects from './pages/Directs';
import MobileProfile from './pages/Profile';
import MobileSettings from './pages/Settings';
import MobileFavorites from './pages/Favorites';
import MobileFeedback from './pages/Feedback';
import MobileSuporte from './pages/Suporte';
import MobileLogin from './pages/Login';
import MobileRegister from './pages/Register';
import MobileForgotPassword from './pages/ForgotPassword';
import PrivateRoute from './components/PrivateRoute';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { supabase, syncOAuthUserSession } from './services/supabase';
import { clearAuthSession } from './services/api';
import { socket } from './services/socket';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard, KeyboardResize } from '@capacitor/keyboard';
import { App as CapApp } from '@capacitor/app';

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const syncedSessionRef = useRef(null);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isDirectChatOpen, setIsDirectChatOpen] = useState(false);
  const isChatScreen = location.pathname.startsWith('/chat');
  const isAuthScreen = ['/login', '/register', '/forgot-password'].includes(location.pathname);
  const isInsideChat = isChatScreen || (location.pathname === '/directs' && isDirectChatOpen);
  const showBottomNav = !isInsideChat && !isAuthScreen;

  useEffect(() => {
    const setupDeepLinkListener = async () => {
      try {
        const handle = await CapApp.addListener('appUrlOpen', async (event) => {
          try {
            const rawUrl = event?.url;
            if (!rawUrl) return;

            // Suporte a skyripple://auth/callback?token=... ou #access_token=...
            const formattedUrl = rawUrl.replace('#', '?');
            let urlObj;
            try {
              urlObj = new URL(formattedUrl);
            } catch (parseErr) {
              // Fallback para URIs com esquemas não padronizados
              const queryPart = formattedUrl.includes('?') ? formattedUrl.substring(formattedUrl.indexOf('?')) : '';
              urlObj = new URL('https://auth' + queryPart);
            }

            const isAuthCallback =
              urlObj.host === 'auth' ||
              urlObj.pathname.includes('callback') ||
              rawUrl.startsWith('skyripple://') ||
              rawUrl.startsWith('com.skyripple.app://');

            if (isAuthCallback) {
              const token =
                urlObj.searchParams.get('token') ||
                urlObj.searchParams.get('access_token');
              const refreshToken = urlObj.searchParams.get('refresh_token');
              const userParam = urlObj.searchParams.get('user');

              if (token) {
                localStorage.setItem('chat_token', token);
                localStorage.setItem('token', token);
                localStorage.setItem('chat_isLoggedIn', 'true');

                if (refreshToken) {
                  localStorage.setItem('refresh_token', refreshToken);
                }

                if (userParam) {
                  try {
                    const decodedUser = typeof userParam === 'string' ? decodeURIComponent(userParam) : userParam;
                    const parsedUser = typeof decodedUser === 'string' ? JSON.parse(decodedUser) : decodedUser;

                    const realName =
                      parsedUser?.user_metadata?.full_name ||
                      parsedUser?.user_metadata?.name ||
                      parsedUser?.displayName ||
                      parsedUser?.name ||
                      (parsedUser?.email ? parsedUser.email.split('@')[0] : 'Usuário');

                    const usernameHandle =
                      parsedUser?.user_metadata?.user_name ||
                      parsedUser?.username ||
                      parsedUser?.handle ||
                      (parsedUser?.email ? parsedUser.email.split('@')[0] : 'usuario');

                    const normalizedUser = {
                      ...parsedUser,
                      displayName: realName,
                      name: realName,
                      username: usernameHandle,
                      handle: usernameHandle
                    };

                    localStorage.setItem('user', JSON.stringify(normalizedUser));
                    localStorage.setItem('chat_displayName', realName);

                    if (parsedUser.id || parsedUser.uniqueUserId) {
                      localStorage.setItem('chat_uniqueUserId', parsedUser.id || parsedUser.uniqueUserId);
                    }
                    const photo =
                      parsedUser.profilePhoto ||
                      parsedUser.avatar_url ||
                      parsedUser?.user_metadata?.avatar_url ||
                      parsedUser?.user_metadata?.picture;
                    if (photo) {
                      localStorage.setItem('chat_profilePhoto', photo);
                    }
                  } catch (userErr) {
                    console.warn('[DeepLink] Erro ao extrair dados de user:', userErr);
                  }
                }

                if (refreshToken) {
                  try {
                    await supabase.auth.setSession({
                      access_token: token,
                      refresh_token: refreshToken
                    });
                  } catch (supabaseErr) {
                    console.warn('[DeepLink] Erro ao sincronizar sessão Supabase:', supabaseErr);
                  }
                }

                if (socket) {
                  socket.auth = { token };
                  socket.disconnect();
                  socket.connect();
                }

                window.dispatchEvent(new Event('profileUpdated'));

                // Redireciona diretamente para a tela de salas
                navigate('/rooms', { replace: true });
              }
            }
          } catch (err) {
            console.error('[DeepLink] Erro ao processar URL de autenticação:', err);
          }
        });

        return handle;
      } catch (e) {
        console.warn('[DeepLink] Falha ao registrar listener CapApp:', e);
        return null;
      }
    };

    const listenerPromise = setupDeepLinkListener();
    return () => {
      listenerPromise.then((handle) => handle?.remove?.()).catch(() => {});
    };
  }, [navigate]);

  useEffect(() => {
    if (location.pathname !== '/directs') {
      setIsDirectChatOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentPath = location.pathname || window.location.pathname;

      // Não interceptar nem redirecionar se o usuário estiver no fluxo de recuperação de senha
      if (event === 'PASSWORD_RECOVERY' || currentPath === '/forgot-password') {
        return;
      }

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
        } else if (['/login', '/register', '/'].includes(currentPath)) {
          if (window.location.hash) {
            window.history.replaceState(null, '', window.location.pathname);
          }
          navigate('/rooms', { replace: true });
        }
      }
    });

    return () => subscription?.unsubscribe();
  }, [navigate, location.pathname]);

  return (
    <div className="h-[100dvh] bg-slate-200/60 dark:bg-slate-950 flex justify-center font-sans select-none overflow-hidden">
      <div className="w-full max-w-md h-[100dvh] bg-slate-100 dark:bg-slate-900 flex flex-col relative shadow-2xl overflow-hidden">
        <Routes>
          <Route path="/login" element={<MobileLogin />} />
          <Route path="/register" element={<MobileRegister />} />
          <Route path="/forgot-password" element={<MobileForgotPassword />} />
          <Route path="/" element={<Navigate to="/rooms" replace />} />

          <Route element={<PrivateRoute />}>
            <Route path="/rooms" element={<MobileRooms onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={unreadCount} />} />
            <Route path="/chat" element={<MobileChat />} />
            <Route path="/chat/:roomId" element={<MobileChat />} />
            <Route path="/directs" element={<MobileDirects onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={unreadCount} onChatOpenChange={setIsDirectChatOpen} />} />
            <Route path="/profile" element={<MobileProfile onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={unreadCount} />} />
            <Route path="/settings" element={<MobileSettings onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={unreadCount} />} />
            <Route path="/favorites" element={<MobileFavorites />} />
            <Route path="/feedback" element={<MobileFeedback />} />
            <Route path="/support" element={<MobileSuporte />} />
            <Route path="/suporte" element={<MobileSuporte />} />
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
          <div className="anim-stagger-children space-y-2.5">
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
    const isDark = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const configureNativeApp = async () => {
      try {
        await StatusBar.setOverlaysWebView({ overlay: true });
        await StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light });
        await Keyboard.setResizeMode({ mode: KeyboardResize.Native });
      } catch (e) { }
    };

    configureNativeApp();
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <AppLayout />
      </Router>
    </NotificationProvider>
  );
}
