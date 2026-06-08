import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaComments, FaEnvelope, FaStar, FaUser, FaCog, FaInfoCircle, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { removeAuthToken } from '../services/api';
import UserAvatar from './UserAvatar';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
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
    }, [primaryColor]);

    useEffect(() => {
        if (colorMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('chat_colorMode', colorMode);
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
    }, [bgColor]);

    useEffect(() => {
        const loadProfile = () => {
            const loggedInStatus = localStorage.getItem('chat_isLoggedIn') === 'true';
            setIsLoggedIn(loggedInStatus);

            const savedName = localStorage.getItem('chat_displayName');
            if (savedName) {
                setProfileName(savedName);
            } else {
                setProfileName("Minha Conta");
            }

            const savedPhoto = localStorage.getItem('chat_profilePhoto');
            setProfilePhoto(savedPhoto || null);

            const savedDesc = localStorage.getItem('chat_status');
            setProfileDesc(savedDesc || "Sem recado");
        };

        loadProfile();
        window.addEventListener('profileUpdated', loadProfile);

        return () => {
            window.removeEventListener('profileUpdated', loadProfile);
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
                <span className="font-bold tracking-tight text-[17px] text-shadow-sm">WebChat</span>

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
                            className={`absolute right-0 top-[48px] w-52 skeuo-panel !rounded-[16px] !p-0 overflow-hidden transition-all duration-300 origin-top-right ${isMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                                }`}
                        >
                            <div className="flex flex-col py-2">
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-gradient-to-r hover:from-[#e8f4ff] dark:hover:from-[#334155] hover:to-transparent transition-colors flex items-center gap-3">
                                    <FaHome className="text-[#86868b]" size={16} /> Início
                                </Link>
                                <Link to="/rooms" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-gradient-to-r hover:from-[#e8f4ff] dark:hover:from-[#334155] hover:to-transparent transition-colors border-t border-[#e5e5e5] dark:border-white/5 flex items-center gap-3">
                                    <FaComments className="text-[#86868b]" size={16} /> Salas
                                </Link>
                                <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-gradient-to-r hover:from-[#e8f4ff] dark:hover:from-[#334155] hover:to-transparent transition-colors border-t border-[#e5e5e5] dark:border-white/5 flex items-center gap-3">
                                    <FaEnvelope className="text-[#86868b]" size={16} /> Diretas
                                </Link>
                                <span className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-[#f8fafc] border-t border-[#e5e5e5] dark:border-white/5 flex items-center gap-3 opacity-50 cursor-not-allowed">
                                    <FaStar className="text-[#86868b]" size={16} /> Favoritos (Em breve)
                                </span>
                                <Link to="/custom" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-gradient-to-r hover:from-[#e8f4ff] dark:hover:from-[#334155] hover:to-transparent transition-colors border-t border-[#e5e5e5] dark:border-white/5 flex items-center gap-3">
                                    <FaUser className="text-[#86868b]" size={16} /> Perfil
                                </Link>
                                <button 
                                    onClick={() => {
                                        setIsSettingsOpen(true);
                                        setIsMenuOpen(false);
                                    }} 
                                    className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-gradient-to-r hover:from-[#e8f4ff] dark:hover:from-[#334155] hover:to-transparent transition-colors border-t border-[#e5e5e5] dark:border-white/5 text-left w-full flex items-center gap-3"
                                >
                                    <FaCog className="text-[#86868b]" size={16} /> Ajustes
                                </button>
                                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-gradient-to-r hover:from-[#e8f4ff] dark:hover:from-[#334155] hover:to-transparent transition-colors border-t border-[#e5e5e5] dark:border-white/5 flex items-center gap-3">
                                    <FaInfoCircle className="text-[#86868b]" size={16} /> Sobre
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
                                    }} className="px-5 py-3 text-[15px] font-medium text-[#ff3b30] hover:bg-gradient-to-r hover:from-[#fee2e2] dark:hover:from-[#7f1d1d]/40 hover:to-transparent transition-colors border-t border-[#e5e5e5] dark:border-white/5 text-left w-full flex items-center gap-3">
                                        <FaSignOutAlt className="text-[#ff3b30]" size={16} /> Sair
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {isLoggedIn && (
                        <div className="relative" ref={profileRef}>
                            <div 
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                            >
                                <UserAvatar src={profilePhoto} name={profileName} size="sm" showStatus={false} />
                                <div className="flex flex-col items-start hidden sm:flex">
                                    <span 
                                        className="text-[13px] font-semibold text-[#1d1d1f] leading-none truncate max-w-[180px] md:max-w-[240px]" 
                                        title={profileName}
                                    >
                                        {profileName}
                                    </span>
                                    <span className="text-[10px] text-green-600 uppercase tracking-widest mt-[2px] font-bold">Online</span>
                                </div>
                            </div>
                            
                            <div
                                className={`absolute right-0 top-[48px] w-[260px] skeuo-panel !rounded-[16px] !p-0 overflow-hidden transition-all duration-300 origin-top-right ${isProfileOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                                    }`}
                            >
                                <div className="flex flex-col text-center p-5 items-center">
                                    <UserAvatar src={profilePhoto} name={profileName} size="xl" className="mb-3" showStatus={false} />
                                    <h3 className="text-[18px] font-semibold text-[#1d1d1f] dark:text-[#f8fafc] mb-1 leading-tight">{profileName}</h3>
                                    <p className="text-[13px] text-[#86868b] dark:text-[#94a3b8] leading-snug">{profileDesc}</p>
                                </div>
                                <div className="p-3 bg-gradient-to-b from-[#f0f0f0] to-[#e5e5e5] dark:from-[#0f172a] dark:to-[#020617] border-t border-[#d2d2d7] dark:border-white/5">
                                    <Link to="/custom" onClick={() => setIsProfileOpen(false)} className="btn-secondary-glossy w-full py-2 block text-center text-[13px]">Editar Perfil</Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            </header>

            {isSettingsOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsSettingsOpen(false)}>
                    <div className="skeuo-panel p-8 max-w-[500px] w-full relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[24px] font-semibold text-[#1d1d1f] dark:text-[#f8fafc] text-shadow-[0_1px_0_rgba(255,255,255,0.8)] dark:text-shadow-[0_1px_0_rgba(0,0,0,0.8)]">Configurações</h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 border border-gray-300 dark:border-slate-600 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)] hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all">
                                <FaTimes className="text-[#86868b]" size={14} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-black/5 dark:bg-black/20 p-4 rounded-[16px] border border-black/5 dark:border-white/5 shadow-inner text-left">
                                <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Cor Principal</label>
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
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${colorOpt.color} ${primaryColor === colorOpt.id ? 'ring-2 ring-offset-2 ring-black/20 dark:ring-white/20 dark:ring-offset-[#1e293b] scale-110 shadow-lg' : 'opacity-80 hover:opacity-100 hover:scale-105 shadow-md border border-white/20'}`}
                                                title={colorOpt.name}
                                                aria-label={`Selecionar cor ${colorOpt.name}`}
                                            >
                                                {primaryColor === colorOpt.id && (
                                                    <div className="w-3 h-3 bg-white rounded-full shadow-inner"></div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/5 dark:bg-black/20 p-4 rounded-[16px] border border-black/5 dark:border-white/5 shadow-inner text-left">
                                <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Modo de Cor</label>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${colorMode === 'light' ? 'bg-white dark:bg-[#1e293b] border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'bg-white dark:bg-[#1e293b] border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                        <input 
                                            type="radio" 
                                            name="colorMode" 
                                            checked={colorMode === 'light'} 
                                            onChange={() => setColorMode('light')}
                                            className="w-4 h-4 accent-[var(--primary-main)]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-medium text-[#1d1d1f]">Modo Claro</span>
                                            <span className="text-[12px] text-[#86868b]">Cores claras, fundo branco clássico.</span>
                                        </div>
                                    </label>

                                    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${colorMode === 'dark' ? 'bg-white dark:bg-[#1e293b] border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'bg-white dark:bg-[#1e293b] border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                        <input 
                                            type="radio" 
                                            name="colorMode" 
                                            checked={colorMode === 'dark'} 
                                            onChange={() => setColorMode('dark')}
                                            className="w-4 h-4 accent-[var(--primary-main)]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-medium text-[#1d1d1f]">Modo Escuro</span>
                                            <span className="text-[12px] text-[#86868b]">Cores escuras para conforto visual noturno.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {colorMode === 'light' && (
                                <div className="bg-black/5 dark:bg-black/20 p-4 rounded-[16px] border border-black/5 dark:border-white/5 shadow-inner text-left">
                                    <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Fundo da Aplicação</label>
                                    <div className="space-y-3">
                                        <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${bgColor === 'neutral' ? 'bg-white dark:bg-[#1e293b] border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'bg-white dark:bg-[#1e293b] border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                            <input 
                                                type="radio" 
                                                name="bgColor" 
                                                checked={bgColor === 'neutral'} 
                                                onChange={() => setBgColor('neutral')}
                                                className="w-4 h-4 accent-[var(--primary-main)]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-medium text-[#1d1d1f]">Ardósia Padrão</span>
                                                <span className="text-[12px] text-[#86868b]">Fundo cinza-azulado suave original.</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${bgColor === 'classic_blue' ? 'bg-white dark:bg-[#1e293b] border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'bg-white dark:bg-[#1e293b] border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                            <input 
                                                type="radio" 
                                                name="bgColor" 
                                                checked={bgColor === 'classic_blue'} 
                                                onChange={() => setBgColor('classic_blue')}
                                                className="w-4 h-4 accent-[var(--primary-main)]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-medium text-[#1d1d1f]">Azul Clássico</span>
                                                <span className="text-[12px] text-[#86868b]">Gradiente listrado inspirado no clássico.</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${bgColor === 'smooth_gradient' ? 'bg-white dark:bg-[#1e293b] border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'bg-white dark:bg-[#1e293b] border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                            <input 
                                                type="radio" 
                                                name="bgColor" 
                                                checked={bgColor === 'smooth_gradient'} 
                                                onChange={() => setBgColor('smooth_gradient')}
                                                className="w-4 h-4 accent-[var(--primary-main)]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-medium text-[#1d1d1f]">Gradiente Suave</span>
                                                <span className="text-[12px] text-[#86868b]">Tons muito sutis de cinza prateado.</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${bgColor === 'clean_light' ? 'bg-white dark:bg-[#1e293b] border-[var(--primary-main)] shadow-[0_0_0_3px_var(--primary-ring)]' : 'bg-white dark:bg-[#1e293b] border-[#d2d2d7] dark:border-white/10 hover:border-[var(--primary-main)]'}`}>
                                            <input 
                                                type="radio" 
                                                name="bgColor" 
                                                checked={bgColor === 'clean_light'} 
                                                onChange={() => setBgColor('clean_light')}
                                                className="w-4 h-4 accent-[var(--primary-main)]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-medium text-[#1d1d1f]">Claro Limpo</span>
                                                <span className="text-[12px] text-[#86868b]">Fundo minimalista acinzentado sólido.</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6">
                            <button onClick={() => setIsSettingsOpen(false)} className="skeuo-btn w-full py-3 text-[16px] font-medium">Salvar e Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
