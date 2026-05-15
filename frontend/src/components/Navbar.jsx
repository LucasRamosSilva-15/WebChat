import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

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
        <header className="apple-nav sticky top-0 z-50 w-full h-[48px] flex items-center justify-center">
            <nav className="max-w-[980px] w-full flex justify-between items-center px-4 relative">
                <span className="font-semibold tracking-tight text-[17px]">WebChat</span>
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
                        className={`absolute right-0 top-[40px] w-48 bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-[22px] overflow-hidden transition-all duration-300 origin-top-right ${isMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'
                            }`}
                    >
                        <div className="flex flex-col py-2">
                            <Link to="/" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors">Home</Link>
                            <Link to="/rooms" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors border-t border-black/5">Rooms</Link>
                            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors border-t border-black/5">Sobre</Link>
                            <Link to="/custom" onClick={() => setIsMenuOpen(false)} className="px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-black/5 transition-colors border-t border-black/5">Custom</Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
