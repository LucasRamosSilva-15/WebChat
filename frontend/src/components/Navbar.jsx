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
                    <span className="font-bold tracking-tight text-[17px] text-shadow-sm">SkyRipple</span>

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
                                className={`navbar-dropdown-panel skeuo-panel ${isMenuOpen ? 'navbar-dropdown-panel-open' : 'navbar-dropdown-panel-closed'}`}
                            >
                                <div className="navbar-dropdown-list">
                                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="navbar-dropdown-item">
                                        <FaHome className="navbar-dropdown-icon" size={16} /> Início
                                    </Link>
                                    <Link to="/rooms" onClick={() => setIsMenuOpen(false)} className="navbar-dropdown-item navbar-dropdown-item-bordered">
                                        <FaComments className="navbar-dropdown-icon" size={16} /> Salas
                                    </Link>
                                    <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="navbar-dropdown-item navbar-dropdown-item-bordered">
                                        <FaEnvelope className="navbar-dropdown-icon" size={16} /> Diretas
                                    </Link>
                                    <span className="navbar-dropdown-item navbar-dropdown-item-bordered navbar-dropdown-item-disabled">
                                        <FaStar className="navbar-dropdown-icon" size={16} /> Favoritos (Em breve)
                                    </span>
                                    <Link to="/custom" onClick={() => setIsMenuOpen(false)} className="navbar-dropdown-item navbar-dropdown-item-bordered">
                                        <FaUser className="navbar-dropdown-icon" size={16} /> Perfil
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setIsSettingsOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="navbar-dropdown-item navbar-dropdown-item-bordered"
                                    >
                                        <FaCog className="navbar-dropdown-icon" size={16} /> Ajustes
                                    </button>
                                    <Link to="/about" onClick={() => setIsMenuOpen(false)} className="navbar-dropdown-item navbar-dropdown-item-bordered">
                                        <FaInfoCircle className="navbar-dropdown-icon" size={16} /> Sobre
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
                                        }} className="navbar-dropdown-item navbar-dropdown-item-bordered navbar-dropdown-item-danger">
                                            <FaSignOutAlt className="navbar-dropdown-icon-danger" size={16} /> Sair
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {isLoggedIn && (
                            <div className="relative" ref={profileRef}>
                                <div
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="navbar-profile-trigger"
                                >
                                    <UserAvatar src={profilePhoto} name={profileName} size="sm" showStatus={false} />
                                    <div className="navbar-profile-info">
                                        <span
                                            className="navbar-profile-name"
                                            title={profileName}
                                        >
                                            {profileName}
                                        </span>
                                        <span className="navbar-profile-status">Online</span>
                                    </div>
                                </div>

                                <div
                                    className={`navbar-profile-panel skeuo-panel ${isProfileOpen ? 'navbar-profile-panel-open' : 'navbar-profile-panel-closed'}`}
                                >
                                    <div className="navbar-profile-card">
                                        <UserAvatar src={profilePhoto} name={profileName} size="xl" className="mb-3" showStatus={false} />
                                        <h3 className="navbar-profile-title">{profileName}</h3>
                                        <p className="navbar-profile-desc">{profileDesc}</p>
                                    </div>
                                    <div className="navbar-profile-footer">
                                        <Link to="/custom" onClick={() => setIsProfileOpen(false)} className="btn-secondary-glossy navbar-profile-edit-btn">Editar Perfil</Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </nav>
            </header>

            <div
                className={`navbar-settings-overlay ${isSettingsOpen ? 'navbar-settings-overlay-open' : 'navbar-settings-overlay-closed'}`}
                onClick={() => setIsSettingsOpen(false)}
            >
                <div
                    className={`skeuo-panel navbar-settings-panel ${isSettingsOpen ? 'navbar-settings-panel-open' : 'navbar-settings-panel-closed'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="navbar-settings-header">
                        <h2 className="navbar-settings-title">Configurações</h2>
                        <button onClick={() => setIsSettingsOpen(false)} className="navbar-settings-close-btn">
                            <FaTimes className="navbar-settings-close-icon" size={14} />
                        </button>
                    </div>

                    <div className="navbar-settings-content">
                        <div className="navbar-settings-section">
                            <label className="navbar-settings-label">Cor Principal</label>
                            <div className="space-y-2">
                                <div className="navbar-settings-color-grid">
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
                                            className={`navbar-settings-color-btn ${colorOpt.color} ${primaryColor === colorOpt.id ? 'navbar-settings-color-btn-active' : 'navbar-settings-color-btn-inactive'}`}
                                            title={colorOpt.name}
                                            aria-label={`Selecionar cor ${colorOpt.name}`}
                                        >
                                            {primaryColor === colorOpt.id && (
                                                <div className="navbar-settings-color-dot"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="navbar-settings-section">
                            <label className="navbar-settings-label">Modo de Cor</label>
                            <div className="navbar-settings-options">
                                <label className={`navbar-settings-option ${colorMode === 'light' ? 'navbar-settings-option-active' : 'navbar-settings-option-inactive'}`}>
                                    <input
                                        type="radio"
                                        name="colorMode"
                                        checked={colorMode === 'light'}
                                        onChange={() => setColorMode('light')}
                                        className="navbar-settings-radio"
                                    />
                                    <div className="navbar-settings-option-text">
                                        <span className="navbar-settings-option-title">Modo Claro</span>
                                        <span className="navbar-settings-option-desc">Cores claras, fundo branco clássico.</span>
                                    </div>
                                </label>

                                <label className={`navbar-settings-option ${colorMode === 'dark' ? 'navbar-settings-option-active' : 'navbar-settings-option-inactive'}`}>
                                    <input
                                        type="radio"
                                        name="colorMode"
                                        checked={colorMode === 'dark'}
                                        onChange={() => setColorMode('dark')}
                                        className="navbar-settings-radio"
                                    />
                                    <div className="navbar-settings-option-text">
                                        <span className="navbar-settings-option-title">Modo Escuro</span>
                                        <span className="navbar-settings-option-desc">Cores escuras para conforto visual noturno.</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {colorMode === 'light' && (
                            <div className="navbar-settings-section">
                                <label className="navbar-settings-label">Fundo da Aplicação</label>
                                <div className="navbar-settings-options">
                                    <label className={`navbar-settings-option ${bgColor === 'neutral' ? 'navbar-settings-option-active' : 'navbar-settings-option-inactive'}`}>
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            checked={bgColor === 'neutral'}
                                            onChange={() => setBgColor('neutral')}
                                            className="navbar-settings-radio"
                                        />
                                        <div className="navbar-settings-option-text">
                                            <span className="navbar-settings-option-title">Ardósia Padrão</span>
                                            <span className="navbar-settings-option-desc">Fundo cinza-azulado suave original.</span>
                                        </div>
                                    </label>

                                    <label className={`navbar-settings-option ${bgColor === 'classic_blue' ? 'navbar-settings-option-active' : 'navbar-settings-option-inactive'}`}>
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            checked={bgColor === 'classic_blue'}
                                            onChange={() => setBgColor('classic_blue')}
                                            className="navbar-settings-radio"
                                        />
                                        <div className="navbar-settings-option-text">
                                            <span className="navbar-settings-option-title">Azul Clássico</span>
                                            <span className="navbar-settings-option-desc">Gradiente listrado inspirado no clássico.</span>
                                        </div>
                                    </label>

                                    <label className={`navbar-settings-option ${bgColor === 'smooth_gradient' ? 'navbar-settings-option-active' : 'navbar-settings-option-inactive'}`}>
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            checked={bgColor === 'smooth_gradient'}
                                            onChange={() => setBgColor('smooth_gradient')}
                                            className="navbar-settings-radio"
                                        />
                                        <div className="navbar-settings-option-text">
                                            <span className="navbar-settings-option-title">Gradiente Suave</span>
                                            <span className="navbar-settings-option-desc">Tons muito sutis de cinza prateado.</span>
                                        </div>
                                    </label>

                                    <label className={`navbar-settings-option ${bgColor === 'clean_light' ? 'navbar-settings-option-active' : 'navbar-settings-option-inactive'}`}>
                                        <input
                                            type="radio"
                                            name="bgColor"
                                            checked={bgColor === 'clean_light'}
                                            onChange={() => setBgColor('clean_light')}
                                            className="navbar-settings-radio"
                                        />
                                        <div className="navbar-settings-option-text">
                                            <span className="navbar-settings-option-title">Claro Limpo</span>
                                            <span className="navbar-settings-option-desc">Fundo minimalista acinzentado sólido.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="navbar-settings-footer">
                        <button onClick={() => setIsSettingsOpen(false)} className="skeuo-btn navbar-settings-save-btn">Salvar e Fechar</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
