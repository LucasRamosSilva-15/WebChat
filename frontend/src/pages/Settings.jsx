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

    const [bubbleFormat, setBubbleFormat] = useState(() => localStorage.getItem('chat_bubbleFormat') || 'suave');

    const toggleBubbleFormat = () => {
        const nextFormat = bubbleFormat === 'suave' ? 'classico' : 'suave';
        setBubbleFormat(nextFormat);
        localStorage.setItem('chat_bubbleFormat', nextFormat);
        window.dispatchEvent(new Event('themeUpdated'));
    };

    useEffect(() => {
        const syncTheme = () => {
            setPrimaryColor(localStorage.getItem('chat_primaryColor') || 'blue');
            setColorMode(localStorage.getItem('chat_colorMode') || 'light');
            setBgColor(localStorage.getItem('chat_bgColor') || 'neutral');
            setBubbleFormat(localStorage.getItem('chat_bubbleFormat') || 'suave');
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
        <div className="flex-1 w-full flex flex-col items-center">
            <div className="w-full max-w-[1200px] px-4 py-8 md:py-10 animate-fade-in-up-1">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 mb-3">
                            <FaUserCog size={12} className="text-sky-500" />
                            <span className="text-[11px] font-bold text-sky-500 uppercase tracking-wide">
                                Preferências do Usuário
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold admin-hero-title mb-1">Configurações (Em Desenvolvimento)</h2>
                        <p className="text-[14px] text-gray-500 dark:text-gray-400">
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
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm w-full text-left transition-all ${activeTab === tab.id ? 'bg-cyan-500 dark:bg-cyan-600 text-white! font-semibold shadow-md shadow-cyan-500/20' : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'}`}
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
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-slate-800 text-cyan-500 flex items-center justify-center">
                                        <FaPalette size={14} />
                                    </div>
                                    <h3 className="text-[16px] font-bold admin-hero-title">Aparência</h3>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">Modo de Cor</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div
                                            onClick={() => setColorMode('light')}
                                            className={`rounded-xl p-4 cursor-pointer flex flex-col gap-3 items-center border-2 transition-all ${colorMode === 'light' ? 'border-sky-500 bg-sky-500/5 ring-1 ring-sky-500/20' : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xs'}`}
                                        >
                                            <div className="w-full h-20 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner flex items-center justify-center">
                                                <FaSun className="text-blue-600 opacity-50" size={24} />
                                            </div>
                                            <span className="text-sm font-semibold admin-table-text">Claro</span>
                                        </div>

                                        <div
                                            onClick={() => setColorMode('dark')}
                                            className={`rounded-xl p-4 cursor-pointer flex flex-col gap-3 items-center border-2 transition-all ${colorMode === 'dark' ? 'border-sky-500 bg-sky-500/5 ring-1 ring-sky-500/20' : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xs'}`}
                                        >
                                            <div className="w-full h-20 rounded-lg bg-gradient-to-br from-gray-800 to-gray-950 shadow-inner flex items-center justify-center">
                                                <FaMoon className="text-gray-400 opacity-50" size={24} />
                                            </div>
                                            <span className="text-sm font-semibold admin-table-text">Escuro</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">Fundo da Aplicação</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {bgOptions.map((bg) => (
                                            <div
                                                key={bg.id}
                                                onClick={() => setBgColor(bg.id)}
                                                className={`rounded-xl p-3 cursor-pointer flex flex-col items-center justify-center text-center h-full border-2 transition-all ${bgColor === bg.id ? 'border-sky-500 bg-sky-500/5 ring-1 ring-sky-500/20' : 'border-transparent bg-gray-50 dark:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xs'}`}
                                            >
                                                <span className="text-xs font-semibold admin-table-text">{bg.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">Cor Principal</h4>
                                    <div className="flex items-center gap-4">
                                        {colors.map((c) => (
                                            <button
                                                key={c.id}
                                                onClick={() => setPrimaryColor(c.id)}
                                                style={{ backgroundColor: c.value }}
                                                className={`w-10 h-10 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.1)] hover:scale-110 transition-transform flex items-center justify-center ${primaryColor === c.id ? 'outline-2 outline-sky-500 outline-offset-2' : ''}`}
                                            >
                                                {primaryColor === c.id && <FaCheck className="text-white text-xs" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">PREVIEW</h4>
                                    <div className="w-full rounded-[24px] p-6 bg-gray-100/80 dark:bg-slate-900/60 border border-gray-200/80 dark:border-white/5 flex flex-col gap-5 shadow-xs transition-all">
                                        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                                            <div className="flex items-center gap-3">
                                                {bubbleFormat === 'suave' ? (
                                                    <UserAvatar name="Alex Ripple" size="md" status="online" />
                                                ) : (
                                                    <UserAvatar name="Alex Ripple" size="md" status="online" />
                                                )}
                                                <div>
                                                    <span className="text-sm font-bold admin-hero-title block">Alex Ripple</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Online agora</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleBubbleFormat}
                                                className="skeuo-btn px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-transform"
                                                title="Alternar entre formato Suave e Clássico"
                                            >
                                                <span>Mudar Formato</span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 uppercase font-bold tracking-tight">
                                                    {bubbleFormat === 'suave' ? 'Suave' : 'Clássico'}
                                                </span>
                                            </button>
                                        </div>

                                        {bubbleFormat === 'suave' ? (
                                            <div className="flex flex-col gap-4 animate-fade-in">
                                                <div className="flex items-start gap-3 self-start max-w-[92%] md:max-w-[80%]">
                                                    <UserAvatar name="Alex Ripple" size="sm" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[12.5px] font-bold text-[#1d1d1f] dark:text-slate-200 mb-1 ml-1 leading-none">
                                                            Alex Ripple
                                                        </span>
                                                        <div className="px-5 py-2.5 rounded-full md:rounded-[24px] bg-gradient-to-b from-white to-[#eceef1] dark:from-slate-800 dark:to-slate-900 border border-[#d2d2d7] dark:border-white/10 shadow-[0_2px_4px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] text-[14px] text-[#1d1d1f] dark:text-[#f8fafc] leading-relaxed">
                                                            Ei! A nova atualização da interface ficou incrível.
                                                        </div>
                                                        <span className="text-[11px] text-[#86868b] dark:text-slate-400 mt-1 ml-2">
                                                            10:42 AM
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end self-end max-w-[92%] md:max-w-[80%] mt-1">
                                                    <div className="px-6 py-2.5 rounded-full md:rounded-[24px] bg-gradient-to-b from-[#38bdf8] via-[#0ea5e9] to-[#0284c7] dark:from-[#0284c7] dark:via-[#0369a1] dark:to-[#075985] text-white font-medium text-[14px] leading-relaxed shadow-[0_4px_12px_rgba(14,165,233,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.7)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] border border-sky-400/40 dark:border-sky-500/20">
                                                        Concordo! Muito suave.
                                                    </div>
                                                    <span className="text-[11px] text-[#86868b] dark:text-slate-400 mt-1 mr-2 flex items-center gap-1.5">
                                                        10:44 AM <span className="text-sky-400 dark:text-sky-300 font-semibold tracking-tighter">✓✓</span>
                                                    </span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3 animate-fade-in">
                                                <div className="flex flex-col items-start self-start max-w-[80%]">
                                                    <span className="text-[11.5px] font-bold text-[#1d1d1f] dark:text-[#f8fafc] mb-1 ml-1">
                                                        Alex Ripple
                                                    </span>
                                                    <div className="skeuo-bubble-received p-3 text-sm">
                                                        Essa é uma mensagem de exemplo recebida!
                                                    </div>
                                                    <span className="text-[10px] text-[#86868b] dark:text-slate-400 mt-0.5 ml-1">
                                                        10:42 AM
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end self-end max-w-[80%]">
                                                    <div className="skeuo-bubble-sent p-3 text-sm">
                                                        E essa é a sua resposta com o estilo ativo!
                                                    </div>
                                                    <span className="text-[10px] text-[#86868b] dark:text-slate-400 mt-0.5 mr-1 flex items-center gap-1">
                                                        10:44 AM <span className="text-sky-500 font-semibold">✓✓</span>
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Account' && (
                            <div className="flex flex-col gap-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-slate-800 text-cyan-500 flex items-center justify-center">
                                        <FaUserCircle size={14} />
                                    </div>
                                    <h3 className="text-[16px] font-bold admin-hero-title">Conta</h3>
                                </div>

                                <div className="flex items-center gap-6">
                                    <UserAvatar name="Lucas Ramos" size="xl" status="online" />
                                    <div className="flex flex-col gap-2">
                                        <h4 className="text-lg font-bold admin-hero-title">Lucas Ramos</h4>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">lucas@exemplo.com</span>
                                        <button className="btn-secondary-glossy text-xs px-3 py-1.5 self-start mt-1">
                                            Alterar Foto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Chat' && (
                            <div className="flex flex-col gap-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-500 flex items-center justify-center">
                                        <FaCommentAlt size={14} />
                                    </div>
                                    <h3 className="text-[16px] font-bold admin-hero-title">Chat</h3>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">Comportamento do Chat</h4>
                                    <div className="flex flex-col gap-4 skeuo-panel p-5 max-w-lg">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium admin-table-text">Pressionar Enter para enviar</span>
                                            <button
                                                className="w-11 h-6 rounded-full relative flex items-center px-1 bg-sky-400 shadow-inner pointer-events-none"
                                            >
                                                <div className="w-4 h-4 rounded-full bg-white shadow-xs transition-transform translate-x-5"></div>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed" title="Em desenvolvimento">
                                            <span className="text-sm font-medium admin-table-text">Sons de nova mensagem</span>
                                            <button className="w-11 h-6 rounded-full relative flex items-center px-1 bg-gray-200 dark:bg-gray-700 shadow-inner pointer-events-none">
                                                <div className="w-4 h-4 rounded-full bg-white shadow-xs"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Privacy' && (
                            <div className="flex flex-col gap-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-slate-800 text-rose-500 flex items-center justify-center">
                                        <FaLock size={14} />
                                    </div>
                                    <h3 className="text-[16px] font-bold admin-hero-title">Privacidade</h3>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">Gerenciar Privacidade</h4>
                                    <div className="flex flex-col gap-4 skeuo-panel p-5 max-w-lg">
                                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed" title="Em desenvolvimento">
                                            <span className="text-sm font-medium admin-table-text">Mostrar status online</span>
                                            <button className="w-11 h-6 rounded-full relative flex items-center px-1 bg-sky-400 shadow-inner pointer-events-none">
                                                <div className="w-4 h-4 rounded-full bg-white shadow-xs transition-transform translate-x-5"></div>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between opacity-50 cursor-not-allowed" title="Em desenvolvimento">
                                            <span className="text-sm font-medium admin-table-text">Confirmações de leitura</span>
                                            <button className="w-11 h-6 rounded-full relative flex items-center px-1 bg-sky-400 shadow-inner pointer-events-none">
                                                <div className="w-4 h-4 rounded-full bg-white shadow-xs transition-transform translate-x-5"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!['Appearance', 'Account', 'Chat', 'Privacy'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center text-center py-16 animate-fade-in">
                                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 flex items-center justify-center mb-4">
                                    <FaUserCog size={24} />
                                </div>
                                <h3 className="text-lg font-bold admin-hero-title mb-2">Seção em Desenvolvimento</h3>
                                <p className="text-[13px] text-gray-500 dark:text-gray-400 max-w-[300px]">
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
