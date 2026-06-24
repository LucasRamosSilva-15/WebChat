import { useState, useEffect } from 'react';
import {
    FaUserCircle,
    FaPalette,
    FaBell,
    FaLock,
    FaCommentAlt,
    FaUniversalAccess,
    FaShieldAlt,
    FaSun,
    FaMoon,
    FaUndo,
    FaSave,
    FaCheck,
    FaEllipsisV,
    FaUserCog
} from 'react-icons/fa';
import UserAvatar from '../components/UserAvatar';

import '../styles/settings.css';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Appearance');

    const [colorMode, setColorMode] = useState(localStorage.getItem('chat_colorMode') || 'light');
    const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('chat_primaryColor') || 'blue');
    const [bgColor, setBgColor] = useState(localStorage.getItem('chat_bgColor') || 'neutral');

    const [density, setDensity] = useState('Confortável');
    const [glossy, setGlossy] = useState(true);
    const [shadows, setShadows] = useState(true);
    const [animations, setAnimations] = useState(true);

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
        const syncTheme = () => {
            setPrimaryColor(localStorage.getItem('chat_primaryColor') || 'blue');
            setColorMode(localStorage.getItem('chat_colorMode') || 'light');
            setBgColor(localStorage.getItem('chat_bgColor') || 'neutral');
        };
        window.addEventListener('themeUpdated', syncTheme);
        return () => window.removeEventListener('themeUpdated', syncTheme);
    }, []);

    const tabs = [
        { id: 'Account', label: 'Account', icon: <FaUserCircle /> },
        { id: 'Appearance', label: 'Appearance', icon: <FaPalette /> },
        { id: 'Notifications', label: 'Notifications', icon: <FaBell /> },
        { id: 'Privacy', label: 'Privacy', icon: <FaLock /> },
        { id: 'Chat', label: 'Chat', icon: <FaCommentAlt /> },
        { id: 'Accessibility', label: 'Accessibility', icon: <FaUniversalAccess /> },
        { id: 'Security', label: 'Security', icon: <FaShieldAlt /> }
    ];

    const colors = [
        { id: 'blue', value: '#3b82f6' },
        { id: 'green', value: '#10b981' },
        { id: 'purple', value: '#a855f7' },
        { id: 'red', value: '#f43f5e' },
        { id: 'slate', value: '#64748b' }
    ];

    const bgOptions = [
        { id: 'neutral', label: 'Ardósia Padrão' },
        { id: 'classic_blue', label: 'Azul Clássico' },
        { id: 'smooth_gradient', label: 'Gradiente Suave' },
        { id: 'clean_light', label: 'Claro Limpo' }
    ];

    return (
        <div className="flex-1 w-full flex flex-col items-center settings-page-bg">
            <div className="w-full max-w-[1200px] px-4 py-8 md:py-10 animate-fade-in-up-1">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full settings-badge-top border mb-3">
                            <FaUserCog size={12} className="settings-badge-icon" />
                            <span className="text-[11px] font-bold settings-badge-text uppercase tracking-wide">
                                Preferências do Usuário
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold admin-hero-title mb-1">Configurações (Em Desenvolvimento)</h2>
                        <p className="text-[14px] settings-text-muted">
                            Ajuste sua conta, aparência, privacidade e experiência no SkyRipple
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="btn-secondary-glossy px-4 py-2 text-[13px] flex items-center gap-2">
                            <FaUndo size={12} className="opacity-70" /> Restaurar padrões
                        </button>
                        <button className="skeuo-btn px-4 py-2 text-[13px] flex items-center gap-2">
                            <FaSave size={12} /> Salvar alterações
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 flex flex-col gap-1 skeuo-panel p-2 self-start sticky top-24">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full text-left settings-tab ${activeTab === tab.id ? 'settings-tab-active' : ''}`}
                            >
                                <span className={activeTab === tab.id ? '' : 'opacity-70'}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 skeuo-panel p-6 md:p-8">
                        {activeTab === 'Appearance' && (
                            <div className="flex flex-col gap-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full settings-icon-box-cyan flex items-center justify-center">
                                        <FaPalette size={14} />
                                    </div>
                                    <h3 className="text-[16px] font-bold admin-hero-title">Aparência</h3>
                                </div>

                                <div>
                                    <h4 className="settings-section-title mb-4">Modo de Cor</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setColorMode('light')}
                                            className={`settings-theme-card rounded-xl p-4 cursor-pointer flex flex-col gap-3 items-center ${colorMode === 'light' ? 'settings-theme-card-active' : ''}`}
                                        >
                                            <div className="w-full h-20 rounded-lg settings-theme-preview-light flex items-center justify-center">
                                                <FaSun className="settings-preview-icon-light" size={24} />
                                            </div>
                                            <span className="text-sm font-semibold admin-table-text">Modo Claro</span>
                                        </div>
                                        <div
                                            onClick={() => setColorMode('dark')}
                                            className={`settings-theme-card rounded-xl p-4 cursor-pointer flex flex-col gap-3 items-center ${colorMode === 'dark' ? 'settings-theme-card-active' : ''}`}
                                        >
                                            <div className="w-full h-20 rounded-lg settings-theme-preview-dark flex items-center justify-center">
                                                <FaMoon className="settings-preview-icon-dark" size={24} />
                                            </div>
                                            <span className="text-sm font-semibold admin-table-text">Modo Escuro</span>
                                        </div>
                                    </div>
                                </div>

                                {colorMode === 'light' && (
                                    <div>
                                        <h4 className="settings-section-title mb-4">Fundo da Aplicação</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {bgOptions.map((bg) => (
                                                <div
                                                    key={bg.id}
                                                    onClick={() => setBgColor(bg.id)}
                                                    className={`settings-theme-card rounded-xl p-3 cursor-pointer flex flex-col items-center justify-center text-center h-full ${bgColor === bg.id ? 'settings-theme-card-active' : ''}`}
                                                >
                                                    <span className="text-[12px] font-semibold admin-table-text">{bg.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="settings-section-title mb-4">Cor Principal</h4>
                                    <div className="flex gap-4">
                                        {colors.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setPrimaryColor(c.id)}
                                                className={`w-10 h-10 rounded-full settings-color-circle flex items-center justify-center ${primaryColor === c.id ? 'settings-color-circle-active' : ''}`}
                                                style={{ backgroundColor: c.value }}
                                            >
                                            </button>
                                        ))}
                                    </div>
                                </div>



                                <div>
                                    <h4 className="settings-section-title mb-4">Preview</h4>
                                    <div className="w-full rounded-2xl p-6 settings-preview-area flex flex-col gap-4">

                                        <div className="message-bubble-row px-0 py-0.5 flex message-bubble-row-other justify-start gap-2 group animate-fade-in-up">
                                            <UserAvatar src={null} name="Alex Ripple" size="sm" className="message-avatar-interactive mt-1" />
                                            <div className="message-bubble-wrapper flex flex-col max-w-[80%] message-bubble-wrapper-other items-start group/msg">
                                                <span className="message-bubble-author text-[11.5px] flex items-center gap-1.5 mb-0.5 ml-1 leading-none">
                                                    Alex Ripple
                                                </span>
                                                <div className={`message-bubble-card px-3 py-1.5 flex flex-col relative message-bubble-card-other skeuo-bubble-received`}>
                                                    <div className="message-bubble-actions message-bubble-actions-other">
                                                        <button className="message-bubble-more-btn p-1 flex items-center justify-center">
                                                            <FaEllipsisV size={12} className="drop-shadow-sm" />
                                                        </button>
                                                    </div>
                                                    <p className="message-bubble-text text-[13px] leading-[1.25] break-words whitespace-pre-wrap">Ei! A nova atualização da interface ficou incrível.</p>
                                                </div>
                                                <div className="message-bubble-footer flex items-center gap-2 mt-0.5 px-1 w-full message-bubble-footer-other justify-start">
                                                    <span className="message-bubble-time text-[10px] font-medium flex items-center gap-1.5">
                                                        10:42 AM
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="message-bubble-row px-0 py-0.5 flex message-bubble-row-own justify-end group animate-fade-in-up">
                                            <div className="message-bubble-wrapper flex flex-col max-w-[80%] message-bubble-wrapper-own items-end group/msg">
                                                <div className={`message-bubble-card px-3 py-1.5 flex flex-col relative message-bubble-card-own skeuo-bubble-sent`}>
                                                    <div className="message-bubble-actions message-bubble-actions-own">
                                                        <button className="message-bubble-more-btn p-1 flex items-center justify-center">
                                                            <FaEllipsisV size={12} className="drop-shadow-sm" />
                                                        </button>
                                                    </div>
                                                    <p className="message-bubble-text text-[13px] leading-[1.25] break-words whitespace-pre-wrap">Concordo! Muito suave.</p>
                                                </div>
                                                <div className="message-bubble-footer flex items-center gap-2 mt-0.5 px-1 w-full message-bubble-footer-own justify-end">
                                                    <span className="message-bubble-time text-[10px] font-medium flex items-center gap-1.5">
                                                        10:44 AM <span className="message-read-indicator text-[10px] ml-0.5">✓✓</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Chat' && (
                            <div className="flex flex-col gap-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full settings-icon-box-blue flex items-center justify-center">
                                        <FaCommentAlt size={14} />
                                    </div>
                                    <h3 className="text-[16px] font-bold admin-hero-title">Chat</h3>
                                </div>
                                
                                <div>
                                    <h4 className="settings-section-title mb-4">Comportamento do Chat</h4>
                                    <div className="flex flex-col gap-4 skeuo-panel p-5 max-w-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium admin-table-text">Pressionar Enter para enviar</span>
                                            <button
                                                className={`w-11 h-6 rounded-full relative flex items-center px-1 settings-toggle-bg settings-toggle-bg-active pointer-events-none`}
                                            >
                                                <div className={`w-4 h-4 rounded-full settings-toggle-knob settings-toggle-knob-active`}></div>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed" title="Em desenvolvimento">
                                            <span className="text-sm font-medium admin-table-text">Sons de nova mensagem</span>
                                            <button className="w-11 h-6 rounded-full relative flex items-center px-1 settings-toggle-bg pointer-events-none">
                                                <div className="w-4 h-4 rounded-full settings-toggle-knob"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Privacy' && (
                            <div className="flex flex-col gap-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full settings-icon-box-rose flex items-center justify-center">
                                        <FaLock size={14} />
                                    </div>
                                    <h3 className="text-[16px] font-bold admin-hero-title">Privacidade</h3>
                                </div>
                                
                                <div>
                                    <h4 className="settings-section-title mb-4">Gerenciar Privacidade</h4>
                                    <div className="flex flex-col gap-4 skeuo-panel p-5 max-w-lg">
                                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed" title="Em desenvolvimento">
                                            <span className="text-sm font-medium admin-table-text">Mostrar status online</span>
                                            <button className="w-11 h-6 rounded-full relative flex items-center px-1 settings-toggle-bg settings-toggle-bg-active pointer-events-none">
                                                <div className="w-4 h-4 rounded-full settings-toggle-knob settings-toggle-knob-active"></div>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed" title="Em desenvolvimento">
                                            <span className="text-sm font-medium admin-table-text">Confirmações de leitura</span>
                                            <button className="w-11 h-6 rounded-full relative flex items-center px-1 settings-toggle-bg settings-toggle-bg-active pointer-events-none">
                                                <div className="w-4 h-4 rounded-full settings-toggle-knob settings-toggle-knob-active"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!['Appearance', 'Chat', 'Privacy'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in">
                                <div className="w-16 h-16 rounded-full settings-icon-box-gray flex items-center justify-center mb-4">
                                    <FaUserCog size={24} />
                                </div>
                                <h3 className="text-lg font-bold admin-hero-title mb-2">Seção em Desenvolvimento</h3>
                                <p className="text-[13px] settings-text-muted max-w-[300px]">
                                    As opções para "{tabs.find(t => t.id === activeTab)?.label}" estarão disponíveis em breve.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Settings;
