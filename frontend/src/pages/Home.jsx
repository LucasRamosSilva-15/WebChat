import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('chat_token') || localStorage.getItem('token');
        const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';
        if (token || isLoggedIn) {
            return {
                name: localStorage.getItem('chat_displayName') || localStorage.getItem('user_name') || 'explorador',
                email: localStorage.getItem('user_email') || ''
            };
        }
        return null;
    });

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('chat_token') || localStorage.getItem('token');
            const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';
            if (token || isLoggedIn) {
                setUser({
                    name: localStorage.getItem('chat_displayName') || localStorage.getItem('user_name') || 'explorador',
                    email: localStorage.getItem('user_email') || ''
                });
            } else {
                setUser(null);
            }
        };

        window.addEventListener('profileUpdated', checkAuth);
        window.addEventListener('storage', checkAuth);
        return () => {
            window.removeEventListener('profileUpdated', checkAuth);
            window.removeEventListener('storage', checkAuth);
        };
    }, []);

    return (
        <main className="reveal flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="skeuo-card px-7 py-8 sm:px-9 sm:py-9 max-w-[480px] w-full text-center rounded-[28px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)]">
                <div className="flex justify-center mb-4">
                    <img
                        src="/logo_512x512_transparente.svg"
                        alt="SkyRipple Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_8px_20px_rgba(0,102,204,0.2)]"
                    />
                </div>

                <h1 className="hero-title font-bold text-3xl sm:text-4xl text-shadow-sm tracking-tight mb-1">
                    SkyRipple
                </h1>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {user ? (
                        <>Bem-vindo de volta, <strong className="text-sky-600 dark:text-sky-400">{user.name || 'explorador'}</strong>! Pronto para conversar?</>
                    ) : (
                        "O seu espaço para conversas em tempo real. Deixe as suas ideias fluírem livremente."
                    )}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 w-full">
                    {user ? (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate('/rooms')}
                                className="skeuo-btn-primary w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold text-white inline-flex items-center justify-center gap-2 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.99]"
                            >
                                <span>Explorar Salas</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/directs')}
                                className="btn-secondary-glossy w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer transition-all active:scale-[0.99]"
                            >
                                Mensagens Diretas
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => navigate('/register')}
                                className="skeuo-btn-primary w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold text-white inline-flex items-center justify-center gap-2 rounded-xl shadow-md cursor-pointer transition-all active:scale-[0.99]"
                            >
                                <span>Criar conta gratuita</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="btn-secondary-glossy w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 rounded-xl cursor-pointer transition-all active:scale-[0.99]"
                            >
                                Já tenho conta
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 shadow-sm text-[11px] text-slate-500 dark:text-slate-400 backdrop-blur-[4px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Salas temáticas</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>Mensagens instantâneas</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>100% Web</span>
                </div>
            </div>
        </main>
    );
};

export default Home;
