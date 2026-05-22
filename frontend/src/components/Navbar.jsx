import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    const [theme, setTheme] = useState(localStorage.getItem('chat_theme') || 'skeuo');
    const [colorMode, setColorMode] = useState(localStorage.getItem('chat_colorMode') || 'light');

    useEffect(() => {
        if (theme === 'skeuo') {
            document.body.classList.add('theme-skeuo');
        } else {
            document.body.classList.remove('theme-skeuo');
        }
        localStorage.setItem('chat_theme', theme);
    }, [theme]);

    useEffect(() => {
        if (colorMode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('chat_colorMode', colorMode);
    }, [colorMode]);

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
                            className={`absolute right-0 top-[40px] w-48 skeuo-panel overflow-hidden transition-all duration-300 origin-top-right ${isMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                                }`}
                        >
                            <div className="flex flex-col py-2">
                                <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors">Home</Link>
                                <Link to="/rooms" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors border-t border-black/5">Rooms</Link>
                                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors border-t border-black/5">Sobre</Link>
                                <Link to="/custom" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors border-t border-black/5">Custom</Link>
                                <button 
                                    onClick={() => {
                                        setIsSettingsOpen(true);
                                        setIsMenuOpen(false);
                                    }} 
                                    className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors border-t border-black/5 text-left w-full flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4 text-[#86868b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> Configurações
                                </button>
                                {isLoggedIn && (
                                    <button onClick={() => {
                                        localStorage.removeItem('chat_isLoggedIn');
                                        localStorage.removeItem('chat_displayName');
                                        window.dispatchEvent(new Event('profileUpdated'));
                                        setIsMenuOpen(false);
                                        window.location.href = '/login';
                                    }} className="px-5 py-3 text-[15px] font-medium text-[#ff3b30] hover:bg-black/5 transition-colors border-t border-black/5 text-left w-full">Sair</button>
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
                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-[#d2d2d7] shadow-sm flex items-center justify-center overflow-hidden">
                                    {profilePhoto ? (
                                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <svg className="w-5 h-5 text-[#86868b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    )}
                                </div>
                                <div className="flex flex-col items-start hidden sm:flex">
                                    <span className="text-[13px] font-semibold text-[#1d1d1f] leading-none truncate max-w-[100px]">{profileName}</span>
                                    <span className="text-[10px] text-[#86868b] uppercase tracking-widest mt-[2px]">Online</span>
                                </div>
                            </div>
                            
                            <div
                                className={`absolute right-0 top-[40px] w-[240px] skeuo-panel overflow-hidden transition-all duration-300 origin-top-right ${isProfileOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                                    }`}
                            >
                                <div className="flex flex-col text-center p-5 items-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 border border-[#d2d2d7] shadow-sm flex items-center justify-center overflow-hidden mb-3">
                                        {profilePhoto ? (
                                            <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <svg className="w-8 h-8 text-[#86868b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                            </svg>
                                        )}
                                    </div>
                                    <h3 className="text-[18px] font-semibold text-[#1d1d1f] mb-1 leading-tight">{profileName}</h3>
                                    <p className="text-[13px] text-[#86868b] leading-snug">{profileDesc}</p>
                                </div>
                                <div className="p-3 bg-black/5 border-t border-black/5">
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
                            <h2 className="text-[24px] font-semibold text-[#1d1d1f]">Configurações</h2>
                            <button onClick={() => setIsSettingsOpen(false)} className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-[#86868b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-black/5 p-4 rounded-[12px] border border-black/5 shadow-inner text-left">
                                <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Aparência do WebChat</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-[8px] border border-black/5 hover:border-[#0071e3] transition-colors">
                                        <input 
                                            type="radio" 
                                            name="theme" 
                                            checked={theme === 'skeuo'} 
                                            onChange={() => setTheme('skeuo')}
                                            className="w-4 h-4 text-[#0071e3] focus:ring-[#0071e3]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-medium text-[#1d1d1f]">Esquimorfismo (Recomendado)</span>
                                            <span className="text-[12px] text-[#86868b]">Visual premium, botões com profundidade e sombras detalhadas.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-[8px] border border-black/5 hover:border-[#0071e3] transition-colors">
                                        <input 
                                            type="radio" 
                                            name="theme" 
                                            checked={theme === 'glass'} 
                                            onChange={() => setTheme('glass')}
                                            className="w-4 h-4 text-[#0071e3] focus:ring-[#0071e3]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-medium text-[#1d1d1f]">Glassmorphism (Antigo)</span>
                                            <span className="text-[12px] text-[#86868b]">Visual translúcido, desfocado e limpo.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-black/5 p-4 rounded-[12px] border border-black/5 shadow-inner text-left">
                                <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Modo de Cor</label>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-[8px] border border-black/5 hover:border-[#0071e3] transition-colors">
                                        <input 
                                            type="radio" 
                                            name="colorMode" 
                                            checked={colorMode === 'light'} 
                                            onChange={() => setColorMode('light')}
                                            className="w-4 h-4 text-[#0071e3] focus:ring-[#0071e3]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-medium text-[#1d1d1f]">Modo Claro</span>
                                            <span className="text-[12px] text-[#86868b]">Cores claras, fundo branco clássico.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-[8px] border border-black/5 hover:border-[#0071e3] transition-colors">
                                        <input 
                                            type="radio" 
                                            name="colorMode" 
                                            checked={colorMode === 'dark'} 
                                            onChange={() => setColorMode('dark')}
                                            className="w-4 h-4 text-[#0071e3] focus:ring-[#0071e3]"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-[14px] font-medium text-[#1d1d1f]">Modo Escuro</span>
                                            <span className="text-[12px] text-[#86868b]">Cores escuras para conforto visual noturno.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <button onClick={() => setIsSettingsOpen(false)} className="mt-8 skeuo-btn w-full py-3 text-[15px] font-medium">Salvar e Fechar</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
