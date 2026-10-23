import { createClient } from '@supabase/supabase-js';
import { apiRequest, setAuthToken } from './api';
import { socket } from './socket';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qwdfrjsbljrnujskknqv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bAA4cyt55miKJ3ZGdCd_Sg__FiUEead';
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handleGoogleSignIn = async () => {
  try {
    let idToken = null;

    try {
      if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform()) {
        await GoogleAuth.initialize({
          clientId: googleClientId || undefined,
          scopes: ['profile', 'email'],
          grantOfflineAccess: true
        });
        const googleUser = await GoogleAuth.signIn();
        idToken = googleUser?.authentication?.idToken;
      }
    } catch (nativeErr) {
      console.warn('Native Google sign-in fallback:', nativeErr.message || nativeErr);
    }

    if (idToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken
      });
      if (error) throw error;
      if (data?.session) {
        return await syncOAuthUserSession(data.session);
      }
    }

    try {
      localStorage.setItem('auth_source', 'mobile');
    } catch (_) {}

    const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform();
    const webBase = isNative
      ? (import.meta.env.VITE_FRONTEND_URL || 'https://web-chat-project-web2.vercel.app')
      : window.location.origin;

    const redirectUrl = `${webBase}/auth/callback?source=mobile`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro na autenticação com a Google:', error.message);
    throw error;
  }
};

export const syncOAuthUserSession = async (session) => {
  if (!session?.user) return null;
  const user = session.user;
  const metadata = user.user_metadata || {};

  const realName =
    metadata.full_name ||
    metadata.name ||
    user.displayName ||
    user.name ||
    (user.email ? user.email.split('@')[0] : 'Usuário');

  const usernameHandle =
    metadata.user_name ||
    user.username ||
    (user.email ? user.email.split('@')[0] : 'usuario');

  const avatar_url = metadata.avatar_url || metadata.picture || null;
  const email = user.email;

  const data = await apiRequest('/auth/oauth-sync', {
    method: 'POST',
    body: JSON.stringify({ email, name: realName, avatar_url })
  });

  if (data?.token) {
    setAuthToken(data.token);
    const resolvedName = data.user?.displayName || data.user?.name || realName;
    const resolvedHandle = data.user?.username || usernameHandle;

    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_displayName', resolvedName);
    localStorage.setItem('chat_uniqueUserId', data.user?.id || user.id);

    const photo = data.user?.profilePhoto || avatar_url;
    if (photo) {
      localStorage.setItem('chat_profilePhoto', photo);
    }

    const normalizedUser = {
      ...(data.user || {}),
      ...user,
      id: data.user?.id || user.id,
      displayName: resolvedName,
      name: resolvedName,
      username: resolvedHandle,
      handle: resolvedHandle,
      email: email,
      avatar_url: photo
    };
    localStorage.setItem('user', JSON.stringify(normalizedUser));

    if (socket) {
      socket.auth = { token: data.token };
      socket.disconnect();
      socket.connect();
    }

    window.dispatchEvent(new Event('profileUpdated'));
    return data;
  }
  return null;
};
