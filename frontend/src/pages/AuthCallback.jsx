import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, syncOAuthUserSession } from '../services/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('Autenticando...');
  const [deepLinkUrl, setDeepLinkUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const processAuth = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        const isMobile =
          urlParams.get('source') === 'mobile' ||
          localStorage.getItem('auth_source') === 'mobile';

        // Tenta obter a sessão ativa do Supabase
        let { data: { session } } = await supabase.auth.getSession();

        // Se ainda não estiver carregada na chamada imediata, aguarda brevemente
        if (!session && (window.location.hash || window.location.search)) {
          const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 2000));
          const sessionPromise = new Promise((resolve) => {
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
              if (s) {
                subscription?.unsubscribe();
                resolve(s);
              }
            });
          });
          const resolved = await Promise.race([sessionPromise, timeoutPromise]);
          if (resolved) {
            session = resolved;
          }
        }

        let synced = null;
        if (session) {
          try {
            synced = await syncOAuthUserSession(session);
          } catch (syncErr) {
            console.warn('[AuthCallback] Erro ao sincronizar sessão:', syncErr);
          }
        }

        const token =
          synced?.token ||
          session?.access_token ||
          urlParams.get('token') ||
          hashParams.get('access_token');

        const refreshToken =
          session?.refresh_token ||
          urlParams.get('refresh_token') ||
          hashParams.get('refresh_token');

        const rawUser = synced?.user || session?.user || null;
        let userToSend = null;
        if (rawUser) {
          const realName =
            rawUser?.user_metadata?.full_name ||
            rawUser?.user_metadata?.name ||
            rawUser?.displayName ||
            rawUser?.name ||
            (rawUser?.email ? rawUser.email.split('@')[0] : 'Usuário');

          const usernameHandle =
            rawUser?.user_metadata?.user_name ||
            rawUser?.username ||
            (rawUser?.email ? rawUser.email.split('@')[0] : 'usuario');

          userToSend = {
            ...rawUser,
            displayName: realName,
            name: realName,
            username: usernameHandle,
            handle: usernameHandle
          };
        }

        if (isMobile && token) {
          localStorage.removeItem('auth_source');
          setStatusMessage('Retornando para o aplicativo SkyRipple...');

          let deepLink = `skyripple://auth/callback?token=${encodeURIComponent(token)}`;
          if (userToSend) {
            deepLink += `&user=${encodeURIComponent(JSON.stringify(userToSend))}`;
          }
          if (refreshToken) {
            deepLink += `&refresh_token=${encodeURIComponent(refreshToken)}`;
          }
          if (session?.access_token && session.access_token !== token) {
            deepLink += `&access_token=${encodeURIComponent(session.access_token)}`;
          }

          if (isMounted) {
            setDeepLinkUrl(deepLink);
          }

          // Redireciona imediatamente para o app nativo
          window.location.href = deepLink;
        } else {
          // Fluxo normal da Web para utilizadores de desktop
          if (token) {
            navigate('/rooms', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        }
      } catch (err) {
        console.error('[AuthCallback] Erro ao processar callback de autenticação:', err);
        navigate('/login', { replace: true });
      }
    };

    processAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="skeuo-card max-w-sm w-full p-8 rounded-3xl shadow-xl flex flex-col items-center">
        <img
          src="/logo_512x512_transparente.svg"
          alt="SkyRipple Logo"
          className="w-16 h-16 object-contain mb-4 animate-bounce"
        />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {statusMessage}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Por favor, aguarde enquanto validamos o seu acesso.
        </p>

        {deepLinkUrl && (
          <a
            href={deepLinkUrl}
            className="skeuo-btn-primary w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all block text-center"
          >
            Abrir aplicativo SkyRipple
          </a>
        )}
      </div>
    </div>
  );
}
