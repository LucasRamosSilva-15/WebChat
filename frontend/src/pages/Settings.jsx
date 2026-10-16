import { useState, useEffect } from 'react';
import {
    FaUserCircle,
    FaPalette,
    FaBell,
    FaLock,
    FaCommentAlt,
    FaUniversalAccess,
    FaShieldAlt,
    FaUndo,
    FaSave,
    FaUserCog
} from 'react-icons/fa';
import { Sun, Moon, Check } from 'lucide-react';
import UserAvatar from '../components/UserAvatar';
import { useNotifications } from '../context/NotificationContext';

const Settings = () => {
    const {
        notifications,
        unreadCount,
        soundEnabled,
        setSoundEnabled,
        toastsEnabled,
        setToastsEnabled,
        simulateNotification,
        clearAll
    } = useNotifications();
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

    const [bubbleFormat, setBubbleFormat] = useState(() => {
        const saved = localStorage.getItem('chat_bubbleFormat');
        return saved === 'classico' ? 'classico' : 'grande';
    });

    const toggleBubbleFormat = () => {
        const nextFormat = bubbleFormat === 'classico' ? 'grande' : 'classico';
        setBubbleFormat(nextFormat);
        localStorage.setItem('chat_bubbleFormat', nextFormat);
        window.dispatchEvent(new Event('themeUpdated'));
    };

    useEffect(() => {
        const syncTheme = () => {
            setPrimaryColor(localStorage.getItem('chat_primaryColor') || 'blue');
            setColorMode(localStorage.getItem('chat_colorMode') || 'light');
            setBgColor(localStorage.getItem('chat_bgColor') || 'neutral');
            const savedFormat = localStorage.getItem('chat_bubbleFormat');
            setBubbleFormat(savedFormat === 'classico' ? 'classico' : 'grande');
        };
        window.addEventListener('themeUpdated', syncTheme);
        return () => window.removeEventListener('themeUpdated', syncTheme);
    }, []);

    const tabs = [
        { id: 'Account', label: 'Conta', icon: <FaUserCircle /> },
        { id: 'Appearance', label: 'Aparência', icon: <FaPalette /> },
        { id: 'Notifications', label: 'Notificações', icon: <FaBell /> },
        { id: 'Privacy', label: 'Privacidade', icon: <FaLock /> },
        { id: 'Chat', label: 'Chat', icon: <FaCommentAlt /> },
        { id: 'Accessibility', label: 'Acessibilidade', icon: <FaUniversalAccess /> },
        { id: 'Security', label: 'Segurança', icon: <FaShieldAlt /> }
    ];

    const colors = [
        { id: 'blue', gradient: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)' },
        { id: 'green', gradient: 'linear-gradient(135deg, #34d399 0%, #059669 50%, #047857 100%)' },
        { id: 'purple', gradient: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #7e22ce 100%)' },
        { id: 'red', gradient: 'linear-gradient(135deg, #fb7185 0%, #e11d48 50%, #be123c 100%)' },
        { id: 'slate', gradient: 'linear-gradient(135deg, #94a3b8 0%, #475569 50%, #334155 100%)' }
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

                <div className="skeuo-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
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
                        <button type="button" className="btn-secondary-glossy px-4 py-2 text-[13px] flex items-center gap-2 cursor-pointer">
                            <FaUndo size={12} className="opacity-70" /> Restaurar padrões
                        </button>
                        <button type="button" className="skeuo-btn px-4 py-2 text-[13px] flex items-center gap-2 cursor-pointer">
                            <FaSave size={12} /> Salvar alterações
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-64 flex flex-col gap-1 skeuo-panel p-2 self-start sticky top-24">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm w-full text-left transition-all cursor-pointer ${activeTab === tab.id
                                    ? 'text-white bg-gradient-to-b from-sky-400 to-sky-500 shadow-[0_2px_6px_rgba(14,165,233,0.35),inset_0_1px_0_rgba(255,255,255,0.45)] border border-sky-400/80'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 border border-transparent font-normal'
                                    }`}
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
                                        <button
                                            type="button"
                                            onClick={() => setColorMode('light')}
                                            className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all cursor-pointer ${colorMode === 'light'
                                                ? 'skeuo-card ring-2 ring-sky-500/80 shadow-[0_4px_12px_rgba(14,165,233,0.18)]'
                                                : 'bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className="w-full h-20 rounded-xl bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]">
                                                <Sun className="w-6 h-6 text-sky-500 drop-shadow-[0_1px_2px_rgba(14,165,233,0.3)]" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Claro</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setColorMode('dark')}
                                            className={`p-4 rounded-2xl flex flex-col items-center gap-3 transition-all cursor-pointer ${colorMode === 'dark'
                                                ? 'skeuo-card ring-2 ring-sky-500/80 shadow-[0_4px_12px_rgba(14,165,233,0.18)]'
                                                : 'bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className="w-full h-20 rounded-xl bg-slate-800 dark:bg-slate-950 flex items-center justify-center border border-slate-700/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
                                                <Moon className="w-6 h-6 text-sky-400 drop-shadow-[0_1px_2px_rgba(56,189,248,0.3)]" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Escuro</span>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">Fundo da Aplicação</h4>
                                    <div className="p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 grid grid-cols-2 sm:grid-cols-4 gap-1">
                                        {bgOptions.map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setBgColor(opt.id)}
                                                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all cursor-pointer ${bgColor === opt.id
                                                    ? 'btn-secondary-glossy text-sky-700 dark:text-sky-300 shadow-sm'
                                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                                    }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">Cor Principal</h4>
                                    <div className="flex items-center gap-4">
                                        {colors.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => setPrimaryColor(c.id)}
                                                style={{ background: c.gradient }}
                                                className={`w-9 h-9 rounded-full relative transition-transform active:scale-95 shadow-[0_2px_5px_rgba(0,0,0,0.15),inset_0_1.5px_1px_rgba(255,255,255,0.7),inset_0_-1.5px_2px_rgba(0,0,0,0.2)] border border-white/40 flex items-center justify-center cursor-pointer ${primaryColor === c.id ? 'ring-2 ring-offset-2 ring-sky-500 scale-105' : 'hover:scale-105'
                                                    }`}
                                            >
                                                {primaryColor === c.id && <Check className="w-4 h-4 text-white drop-shadow-sm stroke-[3]" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">PREVIEW</h4>
                                    <div className="w-full rounded-[24px] p-6 bg-gray-100/80 dark:bg-slate-900/60 border border-gray-200/80 dark:border-white/5 flex flex-col gap-5 shadow-xs transition-all">
                                        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar name="Alex Ripple" size="md" status="online" />
                                                <div>
                                                    <span className="text-sm font-bold admin-hero-title block">Alex Ripple</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">Online agora</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleBubbleFormat}
                                                className="skeuo-btn px-3.5 py-1.5 text-xs flex items-center gap-1.5 cursor-pointer shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-transform"
                                                title="Alternar entre formato Grande e Clássico"
                                            >
                                                <span>Mudar Formato</span>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 uppercase font-bold tracking-tight">
                                                    {bubbleFormat === 'classico' ? 'Clássico' : 'Grande'}
                                                </span>
                                            </button>
                                        </div>

                                        {bubbleFormat === 'grande' ? (
                                            <div className="flex flex-col gap-4 animate-fade-in">
                                                <div className="flex items-end gap-2.5 max-w-[80%] sm:max-w-[70%]">
                                                    <UserAvatar name="Alex Ripple" size="sm" showStatus={false} />

                                                    <div className="flex flex-col items-start">
                                                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-2">
                                                            Alex Ripple
                                                        </span>
                                                        <div className="bg-gradient-to-b from-[#f9f9f9] to-[#ebebeb] dark:from-[#334155] dark:to-[#1e293b] text-[#1d1d1f] dark:text-[#f8fafc] border border-slate-300/80 dark:border-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[18px] px-5 py-2.5 text-sm leading-relaxed">
                                                            Ei! A nova atualização da interface ficou incrível.
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 mt-1 ml-3">10:42 AM</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end max-w-[80%] sm:max-w-[70%] ml-auto mt-1">
                                                    <div className="bg-gradient-to-b from-sky-400 to-sky-600 dark:from-sky-500 dark:to-blue-700 text-white shadow-[0_2px_5px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4)] border border-sky-600/70 dark:border-sky-400/60 rounded-[18px] px-5 py-2.5 text-sm font-medium [text-shadow:0_-1px_0_rgba(0,0,0,0.2)]">
                                                        Concordo! Formato grande ativo.
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1 mr-3 text-[10px] text-slate-400 dark:text-slate-500">
                                                        <span>10:44 AM</span>
                                                        <span className="text-sky-500 font-bold">✓✓</span>
                                                    </div>
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

                        {activeTab === 'Notifications' && (
                            <div className="flex flex-col gap-8 animate-fade-in">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-slate-800 text-amber-500 flex items-center justify-center">
                                        <FaBell size={14} />
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold admin-hero-title">Notificações</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Controle sons, avisos flutuantes e veja o estado das notificações
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-4">Comportamento e Alertas</h4>
                                    <div className="flex flex-col gap-4 skeuo-panel p-5 max-w-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-semibold admin-table-text block">Sons de Notificação</span>
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400">Tocar um sino sutil quando chegar uma nova mensagem ou aviso.</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSoundEnabled(!soundEnabled)}
                                                className={`w-11 h-6 rounded-full relative flex items-center px-1 transition-colors cursor-pointer shrink-0 ${
                                                    soundEnabled ? 'bg-sky-500 shadow-inner' : 'bg-slate-300 dark:bg-slate-700'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                                                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                                                }`}></div>
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-200/70 dark:border-white/5 pt-3">
                                            <div>
                                                <span className="text-sm font-semibold admin-table-text block">Avisos Flutuantes (Toasts)</span>
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400">Exibir balão temporário no canto superior da tela.</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setToastsEnabled(!toastsEnabled)}
                                                className={`w-11 h-6 rounded-full relative flex items-center px-1 transition-colors cursor-pointer shrink-0 ${
                                                    toastsEnabled ? 'bg-sky-500 shadow-inner' : 'bg-slate-300 dark:bg-slate-700'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                                                    toastsEnabled ? 'translate-x-5' : 'translate-x-0'
                                                }`}></div>
                                            </button>
                                        </div>

                                        <div className="border-t border-slate-200/70 dark:border-white/5 pt-3 flex items-center justify-between">
                                            <div>
                                                <span className="text-sm font-semibold admin-table-text block">Histórico</span>
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400">{notifications.length} armazenadas ({unreadCount} não lidas)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => simulateNotification()}
                                                    className="btn-secondary-glossy text-xs px-3 py-1.5 cursor-pointer text-sky-600 dark:text-sky-400"
                                                >
                                                    Testar
                                                </button>
                                                {notifications.length > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={clearAll}
                                                        className="btn-secondary-glossy text-xs px-3 py-1.5 cursor-pointer text-rose-500 dark:text-rose-400"
                                                    >
                                                        Limpar
                                                    </button>
                                                )}
                                            </div>
                                        </div>
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
