import React, { useState } from 'react';
import {
    FaDownload, FaTrash, FaCheck, FaHeart, FaShare,
    FaSearch, FaBell, FaSun, FaMoon, FaCog, FaRocket, FaStar,
    FaUsers, FaChartLine, FaShieldAlt, FaComments, FaUser, FaDoorOpen, FaLock, FaExternalLinkAlt, FaPaperPlane
} from 'react-icons/fa';
import {
    FiBell, FiAlertTriangle, FiArrowRight, FiShield, FiSend, FiCopy, FiLayers, FiGrid, FiBox,
    FiStar, FiMessageSquare, FiCompass, FiChevronDown, FiChevronUp, FiPaperclip, FiSliders, FiHelpCircle, FiCheck as FiCheckIcon, FiInfo, FiActivity
} from 'react-icons/fi';

const ButtonsTest = () => {
    const [clickCount, setClickCount] = useState(0);
    const [activeSection, setActiveSection] = useState('principais');
    const [selectedTab, setSelectedTab] = useState('todos');
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [copiedClass, setCopiedClass] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [adminActiveTab, setAdminActiveTab] = useState('usuarios');
    const [faqOpen, setFaqOpen] = useState(true);
    const [chatPreviewInput, setChatPreviewInput] = useState('Olá! Como posso ajudar na sala?');
    const [searchRoomValue, setSearchRoomValue] = useState('');

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            setIsDark(true);
        }
    };

    const copyToClipboard = (className) => {
        navigator.clipboard.writeText(className);
        setCopiedClass(className);
        setTimeout(() => setCopiedClass(''), 2000);
    };

    const handleClick = () => {
        setClickCount(prev => prev + 1);
    };

    return (
        <div className="flex-1 w-full flex flex-col items-center py-10 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in-up-1">

            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <FaRocket className="text-sky-500" /> Catálogo Design System SkyRipple
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Mostruário interativo de botões, cartões táteis e superfícies em <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sky-600 dark:text-sky-400 font-mono text-xs">skeuo.css</code>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="btn-secondary-glossy px-4 py-2 text-xs font-semibold flex items-center gap-2 rounded-xl cursor-pointer"
                    >
                        {isDark ? <FaSun className="text-amber-500" /> : <FaMoon className="text-indigo-500" />}
                        {isDark ? 'Modo Claro' : 'Modo Escuro'}
                    </button>
                    <div className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs font-semibold text-sky-700 dark:text-sky-300">
                        Cliques: {clickCount}
                    </div>
                </div>
            </div>

            <div className="w-full flex justify-center mb-8">
                <div className="skeuo-segmented-track flex-wrap sm:flex-nowrap">
                    <button
                        type="button"
                        onClick={() => setActiveSection('principais')}
                        className={`skeuo-segmented-item flex items-center gap-2 px-5 ${activeSection === 'principais' ? 'skeuo-segmented-item-active' : ''}`}
                    >
                        <FiStar size={14} className="text-amber-500" /> Principais por Página
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('todos')}
                        className={`skeuo-segmented-item flex items-center gap-2 px-5 ${activeSection === 'todos' ? 'skeuo-segmented-item-active' : ''}`}
                    >
                        <FiGrid size={14} /> Todos os Componentes
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('botoes')}
                        className={`skeuo-segmented-item flex items-center gap-2 px-5 ${activeSection === 'botoes' ? 'skeuo-segmented-item-active' : ''}`}
                    >
                        <FiBox size={14} /> Botões & Controles
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSection('cards')}
                        className={`skeuo-segmented-item flex items-center gap-2 px-5 ${activeSection === 'cards' ? 'skeuo-segmented-item-active' : ''}`}
                    >
                        <FiLayers size={14} /> Catálogo de Cards
                    </button>
                </div>
            </div>

            {copiedClass && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
                    <FaCheck className="text-emerald-400 dark:text-emerald-600" /> Classe copiada: {copiedClass}
                </div>
            )}

            {(activeSection === 'todos' || activeSection === 'principais') && (
                <div className="w-full mb-14 animate-fade-in-up-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                    <FiStar size={13} /> Tier 1 • Componentes Fundamentais de Produção
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800/60">
                                    Prioridade Máxima
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
                                Principais Componentes por Página
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                                Estruturas táteis definitivas extraídas de cada página do WebChat (<code className="font-mono text-sky-600 dark:text-sky-400">Rooms</code>, <code className="font-mono text-sky-600 dark:text-sky-400">Chat</code>, <code className="font-mono text-sky-600 dark:text-sky-400">Suporte</code>, <code className="font-mono text-sky-600 dark:text-sky-400">Admin</code> e <code className="font-mono text-sky-600 dark:text-sky-400">About</code>) com as classes prioritárias de <code className="font-mono text-sky-600 dark:text-sky-400">skeuo.css</code> aplicadas em primeiro plano.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                Copie as classes com 1 clique
                            </span>
                        </div>
                    </div>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-7">

                        <div className="skeuo-card p-6 flex flex-col justify-between border-slate-200/80 dark:border-slate-700/80">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                        Página Rooms.jsx • Métrica Tátil
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => copyToClipboard('.skeuo-card')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-card
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-well')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-well
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-surface-orb-badge')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-surface-orb-badge
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                                    StatCard de Salas & Atividade
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                    Card métrico de produção que combina elevação física externa com cavidade invertida interna (<code className="font-mono text-sky-600 dark:text-sky-400">.skeuo-well</code>) e orbe vítreo com reflexo de luz superior a 90°.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-3.5 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="skeuo-surface-orb-badge w-10 h-10 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                            <FaUsers size={16} />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                                                Salas Conectadas
                                            </span>
                                            <span className="text-[10px] text-slate-400">Atualizado ao vivo</span>
                                        </div>
                                    </div>
                                    <span className="skeuo-badge skeuo-badge-ativa text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                        Ativo
                                    </span>
                                </div>

                                <div className="skeuo-well p-3.5 rounded-xl flex items-baseline justify-between">
                                    <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                                        128 Salas
                                    </span>
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                        <FaChartLine size={11} /> +18.4%
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                <span className="text-[11px] text-slate-400">Usado em: Estatísticas de Salas</span>
                                <button type="button" onClick={handleClick} className="btn-secondary-glossy text-xs px-3.5 py-1.5 flex items-center gap-1.5">
                                    Ver Detalhes <FiArrowRight size={11} />
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-card p-6 flex flex-col justify-between border-slate-200/80 dark:border-slate-700/80">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                        Página Rooms.jsx • Controle & Filtro
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => copyToClipboard('.skeuo-input')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-input
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-btn-primary')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-btn-primary
                                        </button>
                                        <button onClick={() => copyToClipboard('.btn-secondary-glossy')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .btn-secondary-glossy
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                                    Toolbar de Busca & Criação de Salas
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                    Barra de ferramentas de alta fidelidade integrando cavidade de busca tátil com auto-relevo e botão primário com luz gel aqua translúcida.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-3 mb-4">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                                    <div className="relative flex-1">
                                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={13} />
                                        <input
                                            type="text"
                                            value={searchRoomValue}
                                            onChange={(e) => setSearchRoomValue(e.target.value)}
                                            placeholder="Buscar sala por nome ou tag..."
                                            className="skeuo-input w-full pl-9 pr-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                        />
                                    </div>
                                    <button type="button" onClick={handleClick} className="btn-secondary-glossy px-3 py-2 text-xs flex items-center justify-center gap-1.5 shrink-0">
                                        <FiSliders size={12} /> Filtros
                                    </button>
                                    <button type="button" onClick={handleClick} className="skeuo-btn-primary px-4 py-2 text-xs font-semibold text-white flex items-center justify-center gap-1.5 shrink-0">
                                        <FaRocket size={12} /> Criar Sala
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="text-[10px] text-slate-400">Atalhos rápidos:</span>
                                    <span className="skeuo-badge skeuo-badge-online text-[9px] px-2 py-0.5 rounded-full cursor-pointer">Públicas (94)</span>
                                    <span className="skeuo-badge text-[9px] px-2 py-0.5 rounded-full cursor-pointer bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">Privadas (34)</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                <span className="text-[11px] text-slate-400">Usado em: Topo de Rooms.jsx</span>
                                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400">input + action primary</span>
                            </div>
                        </div>

                        <div className="skeuo-card p-6 flex flex-col justify-between border-slate-200/80 dark:border-slate-700/80">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                        Página Chat.jsx • Balões de Conversa
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => copyToClipboard('.bubble-smooth')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .bubble-smooth
                                        </button>
                                        <button onClick={() => copyToClipboard('.bubble-smooth-sent')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .bubble-smooth-sent
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-avatar-badge')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-avatar-badge
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                                    Balões Táteis "Estilo Suave" (Recebido / Enviado)
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                    Formato orgânico de pílula arredondada com aro de destaque do avatar, reflexo especular na parte superior e sombra de oclusão de base.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-4 mb-4">
                                <div className="flex items-end gap-2.5 max-w-[85%]">
                                    <div className="skeuo-avatar-badge w-8 h-8 rounded-full border-2 border-sky-400 bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-300 text-xs shadow-sm shrink-0">
                                        LR
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] font-semibold text-slate-500 mb-1 ml-2">
                                            Lucas Ramos
                                        </span>
                                        <div className="bubble-smooth px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 rounded-2xl shadow-sm">
                                            Tudo pronto com a nova iluminação tátil no chat!
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1 ml-2">14:32</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end self-end max-w-[85%]">
                                    <div className="bubble-smooth-sent px-3.5 py-2 text-xs text-white rounded-2xl shadow-sm">
                                        Perfeito! Os gradientes e reflexos ficaram impecáveis.
                                    </div>
                                    <div className="flex items-center gap-1 mt-1 mr-1">
                                        <span className="text-[9px] text-slate-400">14:33</span>
                                        <FaCheck className="text-sky-500" size={9} />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                <span className="text-[11px] text-slate-400">Usado em: MessageItem.jsx</span>
                                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400">.bubble-smooth + .bubble-smooth-sent</span>
                            </div>
                        </div>

                        <div className="skeuo-card p-6 flex flex-col justify-between border-slate-200/80 dark:border-slate-700/80">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                        Página Chat.jsx • Console de Envio
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => copyToClipboard('.skeuo-input')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-input
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-btn-primary')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-btn-primary
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-icon-btn')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-icon-btn
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                                    Barra de Mensagem & Botão Circular Gel
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                    Console de composição com campo cavitário em gradiente suave e botão de envio em cápsula cilíndrica de gel azul com foco e relevo.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={handleClick} className="skeuo-icon-btn w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-sky-600 dark:text-slate-400 shrink-0">
                                        <FiPaperclip size={15} />
                                    </button>
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={chatPreviewInput}
                                            onChange={(e) => setChatPreviewInput(e.target.value)}
                                            placeholder="Digite sua mensagem tátil..."
                                            className="skeuo-input w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleClick}
                                        className="skeuo-btn-primary w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-md cursor-pointer"
                                    >
                                        <FiSend size={13} className="ml-0.5" />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                                    <span>Pressione Enter para enviar</span>
                                    <span>Markdown ativo • Status seguro</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                <span className="text-[11px] text-slate-400">Usado em: MessageInput.jsx</span>
                                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400">.skeuo-input + .skeuo-btn-primary</span>
                            </div>
                        </div>

                        <div className="skeuo-card p-6 flex flex-col justify-between border-slate-200/80 dark:border-slate-700/80">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                        Página Suporte.jsx • Central de Ajuda
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => copyToClipboard('.skeuo-card-aqua')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-card-aqua
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-card-aqua-btn')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-card-aqua-btn
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                                    Banner Aqua Glossy & FAQ Expansível
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                    Placa com saturação ciano e reflexo polarizado Mac OS X Aqua para cabeçalhos de suporte e acordeão com cavidade invertida interna.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3.5 mb-4">
                                <div className="skeuo-card-aqua p-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold text-sky-950 dark:text-sky-100">Como podemos ajudar você?</h4>
                                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-white/40 dark:bg-slate-900/40 text-sky-900 dark:text-sky-200">Suporte 24/7</span>
                                    </div>
                                    <div className="skeuo-card-aqua-body !pt-2">
                                        <button type="button" onClick={handleClick} className="skeuo-card-aqua-btn text-[11px] py-1">FAQ</button>
                                        <button type="button" onClick={handleClick} className="skeuo-card-aqua-btn text-[11px] py-1">Denúncias</button>
                                        <button type="button" onClick={handleClick} className="skeuo-card-aqua-btn text-[11px] py-1">Segurança</button>
                                    </div>
                                </div>

                                <div className="skeuo-well p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setFaqOpen(!faqOpen)}
                                        className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 dark:text-slate-100 cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2">
                                            <FiHelpCircle className="text-sky-500" size={13} /> O WebChat armazena histórico persistente?
                                        </span>
                                        {faqOpen ? <FiChevronUp size={13} /> : <FiChevronDown size={13} />}
                                    </button>
                                    {faqOpen && (
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800 leading-relaxed">
                                            Sim, as mensagens de salas públicas e privadas são sincronizadas criptograficamente e mantidas em tempo real conforme as políticas de segurança.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                <span className="text-[11px] text-slate-400">Usado em: Suporte.jsx</span>
                                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400">.skeuo-card-aqua + .skeuo-well</span>
                            </div>
                        </div>

                        <div className="skeuo-card p-6 flex flex-col justify-between border-slate-200/80 dark:border-slate-700/80">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                        Página Admin.jsx • Painel de Controle
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button onClick={() => copyToClipboard('.skeuo-segmented-track')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-segmented-track
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-badge-admin')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-badge-admin
                                        </button>
                                        <button onClick={() => copyToClipboard('.skeuo-btn-danger')} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                            <FiCopy size={9} /> .skeuo-btn-danger
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
                                    Trilho de Abas & Badges de Autoridade
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                                    Sistema segmentado cavitário com deslocamento de luz e insígnias físicas táteis para perfis com permissões de moderação e ações de risco.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 flex flex-col gap-3.5 mb-4">
                                <div className="skeuo-segmented-track w-full flex justify-between p-1">
                                    <button
                                        type="button"
                                        onClick={() => setAdminActiveTab('usuarios')}
                                        className={`skeuo-segmented-item flex-1 text-center py-1.5 text-xs ${adminActiveTab === 'usuarios' ? 'skeuo-segmented-item-active' : ''}`}
                                    >
                                        Usuários
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAdminActiveTab('salas')}
                                        className={`skeuo-segmented-item flex-1 text-center py-1.5 text-xs ${adminActiveTab === 'salas' ? 'skeuo-segmented-item-active' : ''}`}
                                    >
                                        Salas
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setAdminActiveTab('denuncias')}
                                        className={`skeuo-segmented-item flex-1 text-center py-1.5 text-xs ${adminActiveTab === 'denuncias' ? 'skeuo-segmented-item-active' : ''}`}
                                    >
                                        Denúncias
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="skeuo-badge skeuo-badge-dono text-[10px] px-2.5 py-0.5 rounded-full font-bold">Dono</span>
                                        <span className="skeuo-badge skeuo-badge-admin text-[10px] px-2.5 py-0.5 rounded-full font-bold">Admin</span>
                                        <span className="skeuo-badge skeuo-badge-mod text-[10px] px-2.5 py-0.5 rounded-full font-bold">Mod</span>
                                    </div>
                                    <button type="button" onClick={handleClick} className="skeuo-btn-danger px-3 py-1.5 text-[11px] rounded-xl flex items-center gap-1.5 cursor-pointer">
                                        <FaTrash size={10} /> Suspender
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 dark:border-slate-800">
                                <span className="text-[11px] text-slate-400">Usado em: Admin.jsx</span>
                                <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400">.skeuo-segmented-track + .skeuo-badge-*</span>
                            </div>
                        </div>

                    </div>

                    <div className="w-full mt-8 p-6 rounded-3xl bg-gradient-to-r from-sky-500/10 via-blue-500/5 to-transparent border border-sky-300/40 dark:border-sky-700/40 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
                                <FaShieldAlt size={18} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                    Matriz de Prioridade CSS Tier-1 (Ordem de Precedência)
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Superfícies táteis fundamentais (<code className="font-mono text-sky-600 dark:text-sky-400">.skeuo-card</code>, <code className="font-mono text-sky-600 dark:text-sky-400">.skeuo-well</code>, <code className="font-mono text-sky-600 dark:text-sky-400">.skeuo-btn-primary</code>) implementadas com iluminação zenital a 90°.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => copyToClipboard('.skeuo-card .skeuo-well .skeuo-btn-primary')}
                                className="btn-secondary-glossy text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer"
                            >
                                <FiCopy size={12} /> Copiar Stack Essencial
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {(activeSection === 'todos' || activeSection === 'botoes') && (
                <div className="w-full mb-12">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <FiBox className="text-sky-500" /> Família de Botões & Ações
                        </h2>
                        <span className="text-xs text-slate-400">Clique para testar interações</span>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                        <div className="skeuo-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Primário</span>
                                    <button onClick={() => copyToClipboard('.skeuo-btn')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-btn
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Botão Gel Azul Primário</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Botão principal com gradiente multicamadas dinâmico, volume vítreo e relevo tátil físico.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={handleClick} className="skeuo-btn px-4 py-2 text-sm rounded-xl">
                                    Ação Primária
                                </button>
                                <button onClick={handleClick} className="skeuo-btn px-4 py-2 text-sm rounded-xl flex items-center gap-2">
                                    <FaDownload size={12} /> Com Ícone
                                </button>
                                <button disabled className="skeuo-btn px-4 py-2 text-sm rounded-xl opacity-50 cursor-not-allowed">
                                    Desativado
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">White Gel</span>
                                    <button onClick={() => copyToClipboard('.skeuo-btn-white')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-btn-white
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">White Gel / Aqua Gloss</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Construção cilíndrica perolada em off-white com chanfro de luz superior e sombras internas suaves.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={handleClick} className="skeuo-btn-white px-4 py-2 text-sm">
                                    Secundário White
                                </button>
                                <button onClick={handleClick} className="skeuo-btn-white px-4 py-2 text-sm flex items-center gap-2">
                                    <FiBell size={14} className="text-sky-500" /> Aviso
                                </button>
                                <button disabled className="skeuo-btn-white px-4 py-2 text-sm opacity-50 cursor-not-allowed">
                                    Desativado
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Branco Glossy</span>
                                    <button onClick={() => copyToClipboard('.btn-secondary-glossy')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .btn-secondary-glossy
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Secundário Branco Glossy</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Gradiente clássico de 4 paradas, borda neutra e relevo vítreo padrão (alias: <code className="font-mono text-[11px]">.btn-white-glossy</code>).
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={handleClick} className="btn-secondary-glossy text-sm px-4 py-2">
                                    Entrar
                                </button>
                                <button onClick={handleClick} className="btn-secondary-glossy text-sm px-4 py-2 flex items-center gap-2">
                                    <FaShare size={12} /> Compartilhar
                                </button>
                                <button disabled className="btn-secondary-glossy text-sm px-4 py-2 opacity-50 cursor-not-allowed">
                                    Desativado
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">Perigo</span>
                                    <button onClick={() => copyToClipboard('.skeuo-btn-danger')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-btn-danger
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Botão Perigo / Destrutivo</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Acabamento vermelho vítreo profundo para ações críticas, banimentos ou exclusões.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={handleClick} className="skeuo-btn-danger px-4 py-2 text-sm">
                                    Excluir
                                </button>
                                <button onClick={handleClick} className="skeuo-btn-danger px-4 py-2 text-sm flex items-center gap-2">
                                    <FaTrash size={12} /> Remover Sala
                                </button>
                                <button disabled className="skeuo-btn-danger px-4 py-2 text-sm opacity-50 cursor-not-allowed">
                                    Desativado
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Metálico</span>
                                    <button onClick={() => copyToClipboard('.btn-metallic-glossy')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .btn-metallic-glossy
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Glossy Metálico</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Visual Web 2.0 metálico clássico com corte biselado a 50% e sombra profunda.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={handleClick} className="btn-metallic-glossy text-sm px-4 py-2">
                                    Ação Metálica
                                </button>
                                <button onClick={handleClick} className="btn-metallic-glossy text-sm px-4 py-2 flex items-center gap-2">
                                    <FaCog size={12} /> Ajustes
                                </button>
                                <button disabled className="btn-metallic-glossy text-sm px-4 py-2 opacity-50 cursor-not-allowed">
                                    Desativado
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Ícone Circular</span>
                                    <button onClick={() => copyToClipboard('.skeuo-icon-btn')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-icon-btn
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Botão Circular de Ícone</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Botão perfeitamente redondo com resposta mecânica côncava no clique (:active) e anel de foco suave.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={handleClick} className="skeuo-icon-btn w-9 h-9 flex items-center justify-center">
                                    <FaHeart size={14} className="text-rose-500" />
                                </button>
                                <button onClick={handleClick} className="skeuo-icon-btn w-9 h-9 flex items-center justify-center">
                                    <FaSearch size={14} />
                                </button>
                                <button onClick={handleClick} className="skeuo-icon-btn w-9 h-9 flex items-center justify-center">
                                    <FaBell size={14} className="text-amber-500" />
                                </button>
                                <button onClick={handleClick} className="skeuo-icon-btn w-9 h-9 flex items-center justify-center">
                                    <FaCog size={14} />
                                </button>
                                <button disabled className="skeuo-icon-btn w-9 h-9 flex items-center justify-center opacity-50 cursor-not-allowed">
                                    <FaTrash size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Icon Badge / Pod</span>
                                    <button onClick={() => copyToClipboard('.skeuo-icon-badge')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-icon-badge
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Caixa Redonda de Ícone</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Recipiente tátil circular nas cores de <code className="font-mono text-[11px]">.btn-secondary-glossy</code> para métricas e botões de tabela (estrelas).
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <button onClick={handleClick} className="skeuo-icon-badge !w-9 !h-9 text-amber-500">
                                    <FaStar size={14} />
                                </button>
                                <div className="skeuo-icon-badge !w-9 !h-9 text-blue-500">
                                    <FaUsers size={14} />
                                </div>
                                <div className="skeuo-icon-badge !w-9 !h-9 text-purple-500">
                                    <FaDoorOpen size={14} />
                                </div>
                                <div className="skeuo-icon-badge !w-9 !h-9 text-emerald-500">
                                    <FaShieldAlt size={14} />
                                </div>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col justify-between md:col-span-2">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Trilho Tátil</span>
                                    <button onClick={() => copyToClipboard('.skeuo-segmented-track')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-segmented-track
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Seletor Segmentado / Chave Seletora</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                                    Calha rebaixada com pastilha ativa tátil em relevo para alternância de abas e estados.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="skeuo-segmented-track">
                                    {['geral', 'notificações', 'segurança', 'privacidade'].map((tab) => {
                                        const isActive = selectedTab === tab;
                                        return (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setSelectedTab(tab)}
                                                className={`skeuo-segmented-item capitalize px-4 ${isActive ? 'skeuo-segmented-item-active' : ''}`}
                                            >
                                                {tab}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {(activeSection === 'todos' || activeSection === 'cards') && (
                <div className="w-full mb-12 animate-fade-in-up-2">
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200/60 dark:border-slate-800">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <FiLayers className="text-sky-500" /> Catálogo de Cards & Superfícies Táteis
                        </h2>
                        <span className="text-xs text-slate-400">Variantes estruturais de skeuo.css</span>
                    </div>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div className="skeuo-card p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Superfície Elevada</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Card Clássico Skeuomórfico</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Cantos amplos arredondados (28px), reflexo superior especular sutil e profundidade difusa em múltiplas camadas.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400">Status Ativo</span>
                                <button className="skeuo-btn text-xs px-3.5 py-1.5 rounded-xl">
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-card skeuo-card-accent p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Com Borda Superior</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card.skeuo-card-accent')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card-accent
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Card Accent Frutiger</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Acabamento com fita superior vítrea em gradiente azul ciano reflexivo, ideal para seções em destaque ou chamadas de ação.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200/80 dark:border-sky-800/60 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg">
                                    Em Destaque
                                </span>
                                <button className="skeuo-btn-white text-xs px-3.5 py-1.5 flex items-center gap-1.5">
                                    Acessar <FiArrowRight size={12} />
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-card-glass p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Vidro Translúcido</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card-glass')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card-glass
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Card Glass Aero</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Superfície de vidro jateado com desfoque de fundo (<code className="font-mono text-[11px]">backdrop-blur-md</code>), reflexo de borda cristalino e halo sutil.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <FaLock size={11} className="text-sky-500" /> Seguro
                                </div>
                                <button className="btn-secondary-glossy text-xs px-3.5 py-1.5">
                                    Configurar
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-card skeuo-card-interactive p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Microinteração</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card-interactive')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card-interactive
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Card Tátil Interativo</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Projetado para navegação e cliques com elevação suave (<code className="font-mono text-[11px]">-translate-y-0.5</code>) e iluminação de borda ativa ao passar o mouse.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400">Passe o mouse</span>
                                <span className="skeuo-icon-btn w-7 h-7 flex items-center justify-center">
                                    <FaExternalLinkAlt size={10} />
                                </span>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Painel Base</span>
                                    <button onClick={() => copyToClipboard('.skeuo-panel')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-panel
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Painel Elevado Neutro</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Superfície padronizada com gradiente vertical off-white suave e duplo chanfro interno, ideal para agrupar formulários e configurações.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400">Container Base</span>
                                <button className="btn-secondary-glossy text-xs px-3.5 py-1.5">
                                    Explorar
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel-inset p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Baixo-Relevo</span>
                                    <button onClick={() => copyToClipboard('.skeuo-panel-inset')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-panel-inset
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Painel Côncavo Inset</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Superfície rebaixada com sombra interna (<code className="font-mono text-[11px]">inset shadow</code>), excelente para áreas de listagem, logs ou caixas de digitação.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-mono text-slate-500">calha_côncava</span>
                                <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold">Rebaixado</span>
                            </div>
                        </div>

                        <div className="skeuo-card-glass p-5 relative overflow-hidden flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-4">
                                <div className="skeuo-icon-badge">
                                    <FaUsers size={16} className="text-blue-500" />
                                </div>
                                <span className="bg-red-50 text-red-600 border border-red-200/80 dark:bg-red-500/20 dark:border-red-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
                                    <FaChartLine size={8} /> +12%
                                </span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">1,248</h2>
                                <p className="text-[12px] text-gray-500 dark:text-gray-400 font-medium">Usuários Ativos</p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                                <span>Card de Métrica</span>
                                <button onClick={() => copyToClipboard('.skeuo-icon-badge')} className="hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer">
                                    <FiCopy /> .skeuo-icon-badge
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 dark:bg-blue-400/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                        </div>

                        <div className="skeuo-card p-5 flex flex-col justify-between">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-11 h-11 rounded-full bg-gradient-to-b from-sky-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                    LR
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Lucas Ramos</h4>
                                        <span className="skeuo-badge skeuo-badge-dono text-[10px] px-2 py-0.5 rounded-full">Dono</span>
                                    </div>
                                    <p className="text-xs text-slate-400">@lucasramos</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                                Exemplo de card de usuário integrando badges táteis e botões secundários em harmonia.
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="skeuo-btn text-xs py-1.5 px-3 flex-1">
                                    Mensagem
                                </button>
                                <button className="btn-secondary-glossy text-xs py-1.5 px-3 flex-1">
                                    Perfil
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-card p-5 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FaComments className="text-sky-500" />
                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Sala Geral</h4>
                                </div>
                                <span className="skeuo-badge skeuo-badge-online text-[10px] px-2 py-0.5 rounded-full">
                                    Online
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                                Canal comunitário para discussões gerais e suporte em tempo real.
                            </p>
                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button className="skeuo-icon-badge !w-8 !h-8 text-amber-500">
                                    <FaStar size={13} />
                                </button>
                                <button className="btn-secondary-glossy text-xs px-4 py-1.5">
                                    Entrar na Sala
                                </button>
                            </div>
                        </div>

                        <div className="glass-panel p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Glass Panel (Home)</span>
                                    <button onClick={() => copyToClipboard('.glass-panel')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .glass-panel
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Painel de Vidro Jateado</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Superfície de vidro semitransparente com <code className="font-mono text-[11px]">blur(12px)</code> e cantos de 24px, utilizado no centro da página inicial.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400">Home Design</span>
                                <button className="skeuo-btn text-xs px-3.5 py-1.5">
                                    Entrar
                                </button>
                            </div>
                        </div>

                        <div className="glass-card p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Glass Card</span>
                                    <button onClick={() => copyToClipboard('.glass-card')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .glass-card
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Cartão de Vidro Compacto</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Vidro branco opalescente com halo interno suave (<code className="font-mono text-[11px]">inset 0 0 20px</code>) e cantos de 16px.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400">Halo Vítreo</span>
                                <button className="btn-secondary-glossy text-xs px-3.5 py-1.5">
                                    Opção
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-card-type2 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Card Tipo 2</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card-type2')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card-type2
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Cartão Translúcido Suave</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Gradiente leve de 90% para 60% de opacidade com cantos de 16px e reflexo superior suave.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400">Minimalista</span>
                                <button className="btn-secondary-glossy text-xs px-3.5 py-1.5">
                                    Acessar
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-card-aqua md:col-span-2 lg:col-span-2 flex flex-col">
                            <div className="skeuo-card-aqua-header">
                                <div className="w-full flex items-center justify-between mb-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900/70 dark:text-sky-300/70">Aqua Glossy</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card-aqua')} className="text-sky-900/70 hover:text-sky-950 dark:text-sky-300/70 dark:hover:text-white text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card-aqua
                                    </button>
                                </div>
                                <h3 className="skeuo-card-aqua-title">Central de Ajuda & Suporte</h3>
                                <div className="skeuo-card-aqua-input">
                                    <FaSearch className="text-sky-600/60 dark:text-sky-400/60 ml-1.5 mr-1" size={13} />
                                    <input type="text" placeholder="Buscar na ajuda..." />
                                </div>
                            </div>
                            <div className="skeuo-card-aqua-body">
                                <button onClick={handleClick} className="skeuo-card-aqua-btn">Ajuda</button>
                                <button onClick={handleClick} className="skeuo-card-aqua-btn">FAQ</button>
                                <button onClick={handleClick} className="skeuo-card-aqua-btn">Comunidade</button>
                                <button onClick={handleClick} className="skeuo-card-aqua-btn">Status</button>
                            </div>
                        </div>

                        <div className="skeuo-card p-6 flex flex-col justify-between md:col-span-2 lg:col-span-1">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Card Oficial</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                                    <button onClick={() => copyToClipboard('.skeuo-surface-orb-badge')} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                        <FiCopy size={9} /> .skeuo-surface-orb-badge
                                    </button>
                                    <button onClick={() => copyToClipboard('.skeuo-surface-field')} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                        <FiCopy size={9} /> .skeuo-surface-field
                                    </button>
                                    <button onClick={() => copyToClipboard('.skeuo-btn-primary')} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer">
                                        <FiCopy size={9} /> .skeuo-btn-primary
                                    </button>
                                </div>

                                <div className="w-full flex flex-col items-center">
                                    <div className="skeuo-surface-orb-badge w-11 h-11 mb-3 pointer-events-none flex items-center justify-center">
                                        <span className="text-sky-600 dark:text-sky-400 text-base font-bold">🔒</span>
                                    </div>

                                    <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1 text-center">
                                        Admin Login
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
                                        Introduza a palavra-passe mestra para aceder.
                                    </p>

                                    <div className="w-full mb-4">
                                        <input
                                            type="password"
                                            placeholder="Senha Mestra"
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                            className="skeuo-surface-field w-full px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100"
                                        />
                                    </div>

                                    <div className="w-full grid grid-cols-2 gap-2">
                                        <button type="button" onClick={handleClick} className="btn-secondary-glossy py-2 text-xs font-medium">
                                            Cancelar
                                        </button>
                                        <button type="button" onClick={handleClick} className="skeuo-btn-primary py-2 text-xs font-semibold text-white">
                                            Entrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="skeuo-card-dialog p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Card Dialog</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card-dialog')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card-dialog
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Diálogo Translúcido</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                    Painel com <code className="font-mono text-[11px]">blur(16px)</code>, borda suave e chanfro especular superior de 1.5px.
                                </p>
                            </div>
                            <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-slate-400">Modal Base</span>
                                <button className="btn-secondary-glossy text-xs px-3.5 py-1.5">
                                    Confirmar
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <div className="w-full mt-4 skeuo-panel p-6">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <FiShield className="text-sky-500" /> Demonstração em Cartões de Ação
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-3">
                        <span className="text-xs font-semibold text-slate-500">Ação de Suporte</span>
                        <button className="skeuo-btn text-xs py-2 px-3 rounded-xl w-full flex items-center justify-center gap-2">
                            <FiSend size={13} /> Enviar Mensagem
                        </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-3">
                        <span className="text-xs font-semibold text-slate-500">Relatório Administrativo</span>
                        <button className="skeuo-btn-white text-xs py-2 px-3 w-full flex items-center justify-center gap-2">
                            <FaDownload size={11} className="text-slate-600 dark:text-slate-300" /> Exportar Dados
                        </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-3">
                        <span className="text-xs font-semibold text-slate-500">Revisão Crítica</span>
                        <button className="skeuo-btn-white text-xs py-2 px-3 w-full flex items-center justify-center gap-2">
                            <FiAlertTriangle size={13} className="text-red-500" /> Denúncias (0)
                        </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex flex-col gap-3">
                        <span className="text-xs font-semibold text-slate-500">Área de Exclusão</span>
                        <button className="skeuo-btn-danger text-xs py-2 px-3 rounded-xl w-full flex items-center justify-center gap-2">
                            <FaTrash size={11} /> Banir Conta
                        </button>
                    </div>
                </div>
            </div>

            <section className="w-full my-12 border-t border-slate-200/80 dark:border-slate-800 pt-8">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold tracking-wider uppercase text-sky-600 dark:text-sky-400">Superfícies Isoladas</span>
                        <span className="text-xs text-slate-400 font-mono">.skeuo-card</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Showcase de Cards</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Modelos construídos com novas classes personalizadas para testes de luz, cavidades e profundidade.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <div className="skeuo-card w-full p-6 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Utilizadores Totais
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-300/70 dark:border-emerald-800/60 shadow-sm">
                                +12%
                            </span>
                        </div>

                        <div className="skeuo-surface-cavity p-4 flex items-baseline justify-between mb-5">
                            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                                1.420
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Tempo real</span>
                        </div>

                        <div className="flex justify-end pt-3 border-t border-slate-200/50 dark:border-slate-800">
                            <button type="button" onClick={handleClick} className="btn-secondary-glossy px-3.5 py-1.5 text-xs font-medium">
                                Ver relatório
                            </button>
                        </div>
                    </div>

                    <div className="skeuo-card w-full max-w-sm p-6 flex flex-col items-center mx-auto">
                        <div className="skeuo-surface-orb-badge w-11 h-11 mb-3 pointer-events-none flex items-center justify-center">
                            <span className="text-sky-600 dark:text-sky-400 text-base font-bold">🔒</span>
                        </div>

                        <h4 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1 text-center">
                            Admin Login
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
                            Introduza a palavra-passe mestra para aceder.
                        </p>

                        <div className="w-full mb-4">
                            <input
                                type="password"
                                placeholder="Senha Mestra"
                                className="skeuo-surface-field w-full px-3.5 py-2 text-sm text-slate-800 dark:text-slate-100"
                                readOnly
                                value="••••••••••••"
                            />
                        </div>

                        <div className="w-full grid grid-cols-2 gap-2">
                            <button type="button" onClick={handleClick} className="btn-secondary-glossy py-2 text-xs font-medium">
                                Cancelar
                            </button>
                            <button type="button" onClick={handleClick} className="skeuo-btn-primary py-2 text-xs font-semibold text-white">
                                Entrar
                            </button>
                        </div>
                    </div>

                    <div className="skeuo-card skeuo-surface-panel-interactive w-full p-5 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="skeuo-surface-avatar-box w-11 h-11 flex items-center justify-center font-bold text-white text-base flex-shrink-0">
                                #1
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                    Sala Geral
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    28 participantes online
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/50 dark:border-slate-800">
                            <span className="text-xs text-slate-400 font-medium">Acesso livre</span>
                            <button type="button" onClick={handleClick} className="skeuo-btn-primary px-4 py-1.5 text-xs font-semibold text-white">
                                Entrar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default ButtonsTest;
