import { createClient } from '@supabase/supabase-js';
import { apiRequest, setAuthToken } from './api';
import { socket } from './socket';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qwdfrjsbljrnujskknqv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_bAA4cyt55miKJ3ZGdCd_Sg__FiUEead';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const handleGoogleSignIn = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  } catch (error) {
    console.error('Erro na autenticação com a Google:', error.message);
  }
};

export const syncOAuthUserSession = async (session) => {
  if (!session?.user) return null;
  const user = session.user;
  const metadata = user.user_metadata || {};

  const name = metadata.full_name || metadata.name || user.email?.split('@')[0] || 'Usuário';
  const avatar_url = metadata.avatar_url || metadata.picture || null;
  const email = user.email;

  const data = await apiRequest('/auth/oauth-sync', {
    method: 'POST',
    body: JSON.stringify({ email, name, avatar_url })
  });

  if (data?.token) {
    setAuthToken(data.token);
    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_displayName', data.user?.displayName || data.user?.name || name);
    localStorage.setItem('chat_uniqueUserId', data.user?.id || user.id);
    if (data.user?.profilePhoto || avatar_url) {
      localStorage.setItem('chat_profilePhoto', data.user?.profilePhoto || avatar_url);
    }

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
