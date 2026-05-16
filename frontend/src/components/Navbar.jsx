import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profileName, setProfileName] = useState("Minha Conta");
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [theme, setTheme] = useState(localStorage.getItem('chat_theme') || 'skeuo');

    useEffect(() => {
        if (theme === 'skeuo') {
            document.body.classList.add('theme-skeuo');
        } else {
            document.body.classList.remove('theme-skeuo');
        }
        localStorage.setItem('chat_theme', theme);
    }, [theme]);

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
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="skeuo-nav sticky top-0 z-50 w-full h-[48px] flex items-center justify-center">
            <nav className="max-w-[980px] w-full flex justify-between items-center px-4 relative">
                <span className="font-bold tracking-tight text-[17px] text-shadow-sm">WebChat</span>

                <div className="flex items-center gap-4">
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={toggleMenu}
                            className="p-1 focus:outline-none flex flex-col justify-center items-center gap-[4px] cursor-pointer"
                            aria-label="Abrir Menu"
                        >
                            <div className={`w-5 h-[2px] bg-black/80 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></div>
                            <div className={`w-5 h-[2px] bg-black/80 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                            <div className={`w-5 h-[2px] bg-black/80 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></div>
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
                                        setTheme(theme === 'glass' ? 'skeuo' : 'glass');
                                        setIsMenuOpen(false);
                                    }} 
                                    className="px-5 py-3 text-[15px] font-medium text-[#0071e3] hover:bg-black/5 transition-colors border-t border-black/5 text-left w-full"
                                >
                                    Tema: {theme === 'glass' ? 'Glass (Antigo)' : 'Esquimorfismo'}
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
                        <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
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
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
