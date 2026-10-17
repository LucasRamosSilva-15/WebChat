import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaComments, FaEnvelope, FaStar, FaUser, FaCog, FaInfoCircle, FaSignOutAlt, FaTimes, FaLightbulb, FaLifeRing, FaSlidersH, FaShieldAlt } from 'react-icons/fa';
import { X } from 'lucide-react';
import { removeAuthToken } from '../services/api';
import UserAvatar from './UserAvatar';
import NotificationsDropdown from './NotificationsDropdown';
import { supabase } from '../services/supabase';
import { socket } from '../socket';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileName, setProfileName] = useState("Minha Conta");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [profileDesc, setProfileDesc] = useState("Sem recado");
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const profileRef = useRef(null);
    const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('chat_primaryColor') || 'blue');
    const [colorMode, setColorMode] = useState(localStorage.getItem('chat_colorMode') || 'light');
    const [bgColor, setBgColor] = useState(localStorage.getItem('chat_bgColor') || 'neutral');

    useEffect(() => {
        document.body.classList.remove('color-blue', 'color-green', 'color-purple', 'color-red', 'color-slate');
        if (primaryColor !== 'blue') {
            document.body.classList.add(`color-${primaryColor}`);
        }
        localStorage.setItem('chat_primaryColor', primaryColor);
        window.dispatchEvent(new Event('themeUpdated'));
    }, [primaryColor]);

    useEffect(() => {
        if (colorMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('chat_colorMode', colorMode);
        window.dispatchEvent(new Event('themeUpdated'));
    }, [colorMode]);

    useEffect(() => {
        document.body.classList.remove('bg-classic-blue', 'bg-smooth-gradient', 'bg-clean-light');
        if (bgColor === 'classic_blue') {
            document.body.classList.add('bg-classic-blue');
        } else if (bgColor === 'smooth_gradient') {
            document.body.classList.add('bg-smooth-gradient');
        } else if (bgColor === 'clean_light') {
            document.body.classList.add('bg-clean-light');
        }
        localStorage.setItem('chat_bgColor', bgColor);
        window.dispatchEvent(new Event('themeUpdated'));
    }, [bgColor]);

    useEffect(() => {
        const loadProfile = () => {
            const loggedInStatus = localStorage.getItem('chat_isLoggedIn') === 'true';
            setIsLoggedIn(loggedInStatus);
            setIsAdmin(!!localStorage.getItem('admin_token'));

            const savedName = localStorage.getItem('chat_displayName');
            if (savedName) {
                setProfileName(savedName);
            } else {
                setProfileName("Minha Conta");
            }

            const savedPhoto = localStorage.getItem('chat_profilePhoto');
            setProfilePhoto(savedPhoto || null);

            const savedDesc = localStorage.getItem('chat_profileDesc');
            setProfileDesc(savedDesc || "Sem recado");
        };

        const syncTheme = () => {
            setPrimaryColor(localStorage.getItem('chat_primaryColor') || 'blue');
            setColorMode(localStorage.getItem('chat_colorMode') || 'light');
            setBgColor(localStorage.getItem('chat_bgColor') || 'neutral');
        };

        loadProfile();
        window.addEventListener('profileUpdated', loadProfile);
        window.addEventListener('themeUpdated', syncTheme);

        return () => {
            window.removeEventListener('profileUpdated', loadProfile);
            window.removeEventListener('themeUpdated', syncTheme);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            if (supabase?.auth?.signOut) {
                await supabase.auth.signOut();
            }

            if (socket?.disconnect) {
                socket.disconnect();
            }

            removeAuthToken();
            localStorage.removeItem('chat_isLoggedIn');
            localStorage.removeItem('chat_displayName');
            localStorage.removeItem('chat_uniqueUserId');
            localStorage.removeItem('chat_profilePhoto');
            localStorage.removeItem('chat_profileDesc');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('skyripple_session');
            localStorage.removeItem('admin_token');
            sessionStorage.clear();

            setIsLoggedIn(false);
            setIsMenuOpen(false);
            setIsProfileOpen(false);

            window.dispatchEvent(new Event('profileUpdated'));

            window.location.href = '/login';
        } catch (err) {
            console.error('Erro ao sair:', err);
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="skeuo-nav sticky top-0 z-50 w-full h-[48px] flex items-center justify-center">
                <nav className="max-w-[980px] w-full flex justify-between items-center px-4 relative">
                    <div className="flex items-center gap-2">
                        <img src="/logo_32x32_transparente.svg" alt="SkyRipple Logo" className="w-8 h-8 drop-shadow-sm" />
                        <span className="font-bold tracking-tight text-[17px] text-shadow-sm dark:text-[#f8fafc]">SkyRipple</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={toggleMenu}
                                className="w-8 h-8 focus:outline-none flex items-center justify-center cursor-pointer relative"
                                aria-label="Abrir Menu"
                            >
                                <div className={`absolute bg-black/80 dark:bg-white/80 transition-all duration-300 ${isMenuOpen ? 'translate-y-0 opacity-0 scale-50 w-5 h-[2px]' : '-translate-y-[6px] opacity-100 scale-100 w-5 h-[2px] rounded-sm'}`}></div>
                                <div className={`absolute transition-all duration-300 box-border ${isMenuOpen ? 'w-5 h-5 bg-transparent border-[2px] border-black/80 dark:border-white/80 rounded-full' : 'w-5 h-[2px] bg-black/80 dark:bg-white/80 border-0 border-transparent rounded-sm'}`}></div>
                                <div className={`absolute bg-black/80 dark:bg-white/80 transition-all duration-300 ${isMenuOpen ? 'translate-y-0 opacity-0 scale-50 w-5 h-[2px]' : 'translate-y-[6px] opacity-100 scale-100 w-5 h-[2px] rounded-sm'}`}></div>
                            </button>
                            <div
                                className={`absolute right-0 top-[48px] w-52 overflow-hidden transition-all duration-300 origin-top-right rounded-2xl !p-0 skeuo-panel ${isMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}
                            >
                                <div className="flex flex-col py-2 max-h-[350px] overflow-y-auto">
                                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent">
                                        <FaHome className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Início
                                    </Link>
                                    <Link to="/rooms" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaComments className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Salas
                                    </Link>
                                    <Link to="/directs" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaEnvelope className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Diretas
                                    </Link>
                                    <Link to="/favorites" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaStar className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Favoritos
                                    </Link>
                                    <Link to="/custom" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaUser className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Perfil
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsSettingsOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5"
                                    >
                                        <FaCog className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Ajustes (Rápido)
                                    </button>
                                    <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaSlidersH className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Configurações
                                    </Link>
                                    <Link to="/feedback" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaLightbulb className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Feedback
                                    </Link>
                                    <Link to="/suporte" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaLifeRing className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Suporte
                                    </Link>
                                    <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaInfoCircle className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Sobre
                                    </Link>
                                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaShieldAlt className="text-red-500" size={16} /> Área Admin
                                    </Link>
                                    {isLoggedIn && (
                                        <button onClick={handleLogout} className="px-5 py-3 text-[15px] font-medium transition-colors duration-150 flex items-center gap-3 w-full text-left border-t border-[#e5e5e5] dark:border-white/5 text-red-500 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-100 dark:hover:from-red-950/40 hover:to-transparent cursor-pointer">
                                            <FaSignOutAlt className="text-red-500 dark:text-red-400" size={16} /> Sair
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isLoggedIn && <NotificationsDropdown />}

                        {isLoggedIn && (
                            <div className="relative" ref={profileRef}>
                                <div
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 cursor-pointer transition-opacity duration-150 hover:opacity-80"
                                >
                                    <UserAvatar src={profilePhoto} name={profileName} size="sm" showStatus={false} />
                                    <div className="hidden sm:flex flex-col items-start">
                                        <span
                                            className="text-[13px] font-semibold text-[#1d1d1f] dark:text-slate-50 leading-none truncate max-w-[180px] md:max-w-[240px]"
                                            title={profileName}
                                        >
                                            {profileName} {isAdmin && <span className="ml-1 inline-flex items-center gap-1 bg-red-500/10 text-red-600 border border-red-500/20 text-[9px] px-1.5 py-[1px] rounded font-bold uppercase"><FaShieldAlt size={8} /> Admin</span>}
                                        </span>
                                        <span className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-widest mt-0.5 font-bold">Online</span>
                                    </div>
                                </div>

                                <div
                                    className={`absolute right-0 top-[48px] w-[260px] overflow-hidden transition-all duration-300 origin-top-right rounded-2xl !p-0 skeuo-panel ${isProfileOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}
                                >
                                    <div className="flex flex-col text-center p-5 items-center">
                                        <UserAvatar src={profilePhoto} name={profileName} size="xl" className="mb-3" showStatus={false} />
                                        <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-slate-50 mb-1 leading-snug">{profileName}</h3>
                                        <p className="text-[13px] text-[#86868b] dark:text-[#94a3b8] leading-snug">{profileDesc}</p>
                                    </div>
                                    <div className="p-3 bg-gradient-to-b from-[#f0f0f0] to-[#e5e5e5] border-t border-[#d2d2d7] dark:from-[#0f172a] dark:to-[#020617] dark:border-white/5 flex flex-col gap-2">
                                        <Link to="/custom" onClick={() => setIsProfileOpen(false)} className="btn-secondary-glossy w-full py-2 block text-center text-[13px]">Editar Perfil</Link>
                                        <button onClick={handleLogout} className="btn-secondary-glossy w-full py-2 block text-center text-[13px] !text-red-500 hover:!text-red-600 flex items-center justify-center gap-2 cursor-pointer">
                                            <FaSignOutAlt size={12} /> Sair da Conta
                                        </button>
                                        {isAdmin && (
                                            <button onClick={() => {
                                                localStorage.removeItem('admin_token');
                                                setIsAdmin(false);
                                                setIsProfileOpen(false);
                                                alert('Você saiu do modo Administrador.');
                                                if (window.location.pathname.includes('/admin') && window.location.pathname !== '/admin-login') window.location.href = '/';
                                            }} className="btn-secondary-glossy w-full py-2 block text-center text-[13px] mt-2 !text-red-600 flex items-center justify-center gap-2">
                                                <FaShieldAlt size={12} /> Sair do Admin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <div
                className={`fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-all duration-300 ${isSettingsOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'}`}
                onClick={() => setIsSettingsOpen(false)}
            >
                <div
                    className={`skeuo-panel p-5 max-w-[500px] w-full max-h-[90vh] flex flex-col relative transition-all duration-300 origin-center ${isSettingsOpen ? 'translate-y-0 scale-100' : '-translate-y-2 scale-95'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-4 shrink-0">
                        <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-slate-50 text-shadow-sm">Configurações</h2>
                        <button
                            type="button"
                            onClick={() => setIsSettingsOpen(false)}
                            className="btn-secondary-glossy !w-8 !h-8 !p-0 rounded-full inline-flex items-center justify-center text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700 transition-colors cursor-pointer"
                            title="Fechar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="overflow-y-auto max-h-[80vh] skeuo-scrollbar pr-1 space-y-4">
                        <div className="bg-black/5 dark:bg-black/20 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] text-left">
                            <label className="block text-[11px] font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest mb-2.5">Cor Principal</label>
                            <div className="flex items-center gap-3 mt-2">
                                {[
                                    { id: 'blue', gradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)', name: 'Azul' },
                                    { id: 'green', gradient: 'linear-gradient(135deg, #34d399 0%, #059669 50%, #047857 100%)', name: 'Verde' },
                                    { id: 'purple', gradient: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7e22ce 100%)', name: 'Roxo' },
                                    { id: 'red', gradient: 'linear-gradient(135deg, #fb7185 0%, #e11d48 50%, #be123c 100%)', name: 'Vermelho' },
                                    { id: 'slate', gradient: 'linear-gradient(135deg, #94a3b8 0%, #475569 50%, #334155 100%)', name: 'Cinza' }
                                ].map((c) => {
                                    const isSelected = primaryColor === c.id;
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => setPrimaryColor(c.id)}
                                            style={{ background: c.gradient }}
                                            className={`w-9 h-9 rounded-full relative transition-transform active:scale-95 shadow-[0_3px_8px_rgba(0,0,0,0.5),inset_0_1.5px_1px_rgba(255,255,255,0.6),inset_0_-1.5px_2px_rgba(0,0,0,0.4)] border border-white/20 flex items-center justify-center cursor-pointer ${isSelected
                                                    ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-sky-400 scale-105'
                                                    : 'opacity-85 hover:opacity-100 hover:scale-105'
                                                }`}
                                            title={c.name}
                                            aria-label={`Selecionar cor ${c.name}`}
                                        >
                                            {isSelected && (
                                                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.4)]" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-black/5 dark:bg-black/20 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] text-left">
                            <label className="block text-[11px] font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest mb-2.5">Modo de Cor</label>
                            <div className="flex flex-col gap-2">
                                <div
                                    onClick={() => setColorMode('light')}
                                    className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-3.5 ${colorMode === 'light'
                                            ? 'bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/80 dark:to-slate-900/90 border-2 border-sky-400 shadow-[0_2px_8px_rgba(14,165,233,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_0_15px_rgba(14,165,233,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]'
                                            : 'bg-white/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${colorMode === 'light'
                                            ? 'border-sky-400 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6),inset_0_1px_1px_rgba(255,255,255,0.6)]'
                                            : 'border-slate-300 dark:border-slate-500 bg-slate-100 dark:bg-slate-900/80'
                                        }`}>
                                        {colorMode === 'light' && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Modo Claro</div>
                                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Cores claras, fundo branco clássico.</div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setColorMode('dark')}
                                    className={`p-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-3.5 ${colorMode === 'dark'
                                            ? 'bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/80 dark:to-slate-900/90 border-2 border-sky-400 shadow-[0_2px_8px_rgba(14,165,233,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_0_15px_rgba(14,165,233,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]'
                                            : 'bg-white/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${colorMode === 'dark'
                                            ? 'border-sky-400 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6),inset_0_1px_1px_rgba(255,255,255,0.6)]'
                                            : 'border-slate-300 dark:border-slate-500 bg-slate-100 dark:bg-slate-900/80'
                                        }`}>
                                        {colorMode === 'dark' && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-bold text-slate-800 dark:text-white">Modo Escuro</div>
                                        <div className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5">Cores escuras para conforto visual noturno.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {colorMode === 'light' && (
                            <div className="bg-black/5 dark:bg-black/20 p-3.5 rounded-2xl border border-black/5 dark:border-white/5 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] text-left">
                                <label className="block text-[11px] font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest mb-2.5">Fundo da Aplicação</label>
                                <div className="flex flex-col gap-2">
                                    {[
                                        { id: 'neutral', label: 'Ardósia Padrão', desc: 'Fundo cinza-azulado suave original.' },
                                        { id: 'classic_blue', label: 'Azul Clássico', desc: 'Gradiente listrado inspirado no clássico.' },
                                        { id: 'smooth_gradient', label: 'Gradiente Suave', desc: 'Tons muito sutis de cinza prateado.' },
                                        { id: 'clean_light', label: 'Claro Limpo', desc: 'Fundo minimalista acinzentado sólido.' }
                                    ].map((bgOpt) => (
                                        <div
                                            key={bgOpt.id}
                                            onClick={() => setBgColor(bgOpt.id)}
                                            className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 ${bgColor === bgOpt.id
                                                    ? 'bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/80 dark:to-slate-900/90 border-2 border-sky-400 shadow-[0_2px_8px_rgba(14,165,233,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_0_15px_rgba(14,165,233,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]'
                                                    : 'bg-white/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full flex items-center justify-center border shrink-0 ${bgColor === bgOpt.id
                                                    ? 'border-sky-400 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.6),inset_0_1px_1px_rgba(255,255,255,0.6)]'
                                                    : 'border-slate-300 dark:border-slate-500 bg-slate-100 dark:bg-slate-900/80'
                                                }`}>
                                                {bgColor === bgOpt.id && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-xs" />}
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">{bgOpt.label}</div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400">{bgOpt.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 shrink-0">
                        <button
                            type="button"
                            onClick={() => setIsSettingsOpen(false)}
                            className="skeuo-btn-primary w-full py-2.5 text-sm font-semibold text-white rounded-xl shadow-md cursor-pointer"
                        >
                            Salvar e Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
