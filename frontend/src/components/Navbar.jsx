import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaComments, FaEnvelope, FaStar, FaUser, FaCog, FaInfoCircle, FaSignOutAlt, FaTimes, FaLightbulb, FaLifeRing, FaSlidersH, FaShieldAlt } from 'react-icons/fa';
import { removeAuthToken } from '../services/api';
import UserAvatar from './UserAvatar';

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
                                    <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 transition-colors duration-150 flex items-center gap-3 w-full text-left hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent dark:hover:from-slate-700 dark:hover:to-transparent border-t border-[#e5e5e5] dark:border-white/5">
                                        <FaEnvelope className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Diretas
                                    </Link>
                                    <span className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-slate-50 flex items-center gap-3 w-full text-left border-t border-[#e5e5e5] dark:border-white/5 opacity-50 cursor-not-allowed">
                                        <FaStar className="text-[#86868b] dark:text-[#94a3b8]" size={16} /> Favoritos (Em breve)
                                    </span>
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
                                        <button onClick={() => {
                                            localStorage.removeItem('chat_isLoggedIn');
                                            localStorage.removeItem('chat_displayName');
                                            localStorage.removeItem('chat_uniqueUserId');
                                            removeAuthToken();
                                            window.dispatchEvent(new Event('profileUpdated'));
                                            setIsMenuOpen(false);
                                            window.location.href = '/login';
                                        }} className="px-5 py-3 text-[15px] font-medium transition-colors duration-150 flex items-center gap-3 w-full text-left border-t border-[#e5e5e5] dark:border-white/5 text-red-500 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-100 dark:hover:from-red-950/40 hover:to-transparent">
                                            <FaSignOutAlt className="text-red-500 dark:text-red-400" size={16} /> Sair
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

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
                    className={`skeuo-panel p-8 max-w-[500px] w-full max-h-[90vh] flex flex-col relative transition-all duration-300 origin-center ${isSettingsOpen ? 'translate-y-0 scale-100' : '-translate-y-2 scale-95'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <h2 className="text-2xl font-semibold text-[#1d1d1f] dark:text-slate-50 text-shadow-sm">Configurações</h2>
                        <button onClick={() => setIsSettingsOpen(false)} className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-150 hover:from-gray-200 hover:to-gray-300 dark:from-slate-700 dark:to-slate-800 dark:border-slate-600 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)] dark:hover:from-slate-600 dark:hover:to-slate-700">
                            <FaTimes className="text-[#86868b] dark:text-[#94a3b8]" size={14} />
                        </button>
                    </div>

                    <div className="overflow-y-auto pr-1 space-y-6">
                        <div className="bg-black/5 dark:bg-black/20 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] text-left">
                            <label className="block text-[11px] font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest mb-3">Cor Principal</label>
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { id: 'blue', color: 'bg-blue-500', name: 'Azul' },
                                        { id: 'green', color: 'bg-emerald-500', name: 'Verde' },
                                        { id: 'purple', color: 'bg-purple-500', name: 'Roxo' },
                                        { id: 'red', color: 'bg-rose-500', name: 'Vermelho' },
                                        { id: 'slate', color: 'bg-slate-500', name: 'Cinza' }
                                    ].map((colorOpt) => (
                                        <button
                                            key={colorOpt.id}
                                            onClick={() => setPrimaryColor(colorOpt.id)}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-150 ${colorOpt.color} ${primaryColor === colorOpt.id ? 'shadow-[0_0_0_2px_#ffffff,0_0_0_4px_rgba(0,0,0,0.2),0_10px_15px_-3px_rgba(0,0,0,0.1)] dark:shadow-[0_0_0_2px_#1e293b,0_0_0_4px_rgba(255,255,255,0.2)] scale-110' : 'opacity-80 shadow-md border border-white/20 hover:opacity-100 hover:scale-105'}`}
                                            title={colorOpt.name}
                                            aria-label={`Selecionar cor ${colorOpt.name}`}
                                        >
                                            {primaryColor === colorOpt.id && (
                                                <div className="w-3 h-3 bg-white rounded-full shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)]"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-black/5 dark:bg-black/20 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] text-left">
                            <label className="block text-[11px] font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest mb-3">Modo de Cor</label>
                            <div className="flex flex-col gap-3">
                                <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all duration-150 bg-white dark:bg-slate-800 ${colorMode === 'light' ? 'border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                    <input
                                        type="radio"
                                        name="colorMode"
                                        checked={colorMode === 'light'}
                                        onChange={() => setColorMode('light')}
                                        className="w-4 h-4 accent-[var(--primary-main)]"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-[#1d1d1f] dark:text-slate-50">Modo Claro</span>
                                        <span className="text-xs text-[#86868b] dark:text-[#94a3b8]">Cores claras, fundo branco clássico.</span>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all duration-150 bg-white dark:bg-slate-800 ${colorMode === 'dark' ? 'border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                    <input
                                        type="radio"
                                        name="colorMode"
                                        checked={colorMode === 'dark'}
                                        onChange={() => setColorMode('dark')}
                                        className="w-4 h-4 accent-[var(--primary-main)]"
                                    />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-[#1d1d1f] dark:text-slate-50">Modo Escuro</span>
                                        <span className="text-xs text-[#86868b] dark:text-[#94a3b8]">Cores escuras para conforto visual noturno.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {colorMode === 'light' && (
                            <div className="bg-black/5 dark:bg-black/20 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] text-left">
                                <label className="block text-[11px] font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest mb-3">Fundo da Aplicação</label>
                                <div className="flex flex-col gap-3">
                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all duration-150 bg-white dark:bg-slate-800 ${bgColor === 'neutral' ? 'border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            checked={bgColor === 'neutral'}
                                            onChange={() => setBgColor('neutral')}
                                            className="w-4 h-4 accent-[var(--primary-main)]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#1d1d1f] dark:text-slate-50">Ardósia Padrão</span>
                                            <span className="text-xs text-[#86868b] dark:text-[#94a3b8]">Fundo cinza-azulado suave original.</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all duration-150 bg-white dark:bg-slate-800 ${bgColor === 'classic_blue' ? 'border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            checked={bgColor === 'classic_blue'}
                                            onChange={() => setBgColor('classic_blue')}
                                            className="w-4 h-4 accent-[var(--primary-main)]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#1d1d1f] dark:text-slate-50">Azul Clássico</span>
                                            <span className="text-xs text-[#86868b] dark:text-[#94a3b8]">Gradiente listrado inspirado no clássico.</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all duration-150 bg-white dark:bg-slate-800 ${bgColor === 'smooth_gradient' ? 'border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            checked={bgColor === 'smooth_gradient'}
                                            onChange={() => setBgColor('smooth_gradient')}
                                            className="w-4 h-4 accent-[var(--primary-main)]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#1d1d1f] dark:text-slate-50">Gradiente Suave</span>
                                            <span className="text-xs text-[#86868b] dark:text-[#94a3b8]">Tons muito sutis de cinza prateado.</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border transition-all duration-150 bg-white dark:bg-slate-800 ${bgColor === 'clean_light' ? 'border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            checked={bgColor === 'clean_light'}
                                            onChange={() => setBgColor('clean_light')}
                                            className="w-4 h-4 accent-[var(--primary-main)]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-[#1d1d1f] dark:text-slate-50">Claro Limpo</span>
                                            <span className="text-xs text-[#86868b] dark:text-[#94a3b8]">Fundo minimalista acinzentado sólido.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 shrink-0">
                        <button onClick={() => setIsSettingsOpen(false)} className="skeuo-btn w-full py-3 text-base font-medium">Salvar e Fechar</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
