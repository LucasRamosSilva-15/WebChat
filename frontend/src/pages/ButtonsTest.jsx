import React, { useState } from 'react';
import UserAvatar from '../components/UserAvatar';
import {
    FaRocket, FaSun, FaMoon, FaCheck, FaTrash, FaSearch,
    FaUsers, FaComments, FaStar, FaShieldAlt, FaExternalLinkAlt,
    FaDownload, FaLock, FaChartLine
} from 'react-icons/fa';
import {
    FiCopy, FiSend, FiPaperclip, FiSliders, FiHelpCircle,
    FiBell, FiAlertTriangle, FiArrowRight, FiCheck as FiCheckIcon,
    FiLayers, FiGrid, FiBox, FiActivity, FiInfo
} from 'react-icons/fi';

const badges = [
    { tone: 'online', label: 'Online', cls: 'skeuo-badge-online' },
    { tone: 'ativa', label: 'Ativa', cls: 'skeuo-badge-ativa' },
    { tone: 'dono', label: 'Dono', cls: 'skeuo-badge-dono' },
    { tone: 'admin', label: 'Admin', cls: 'skeuo-badge-admin' },
    { tone: 'mod', label: 'Moderador', cls: 'skeuo-badge-mod' },
    { tone: 'warning', label: 'Aviso', cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60' },
    { tone: 'error', label: 'Erro', cls: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300/80 dark:border-rose-700/60' },
    { tone: 'info', label: 'Info', cls: 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300/80 dark:border-sky-700/60' },
];

const initialRooms = [
    { name: "Sala Geral", status: "Aberta", users: 42, type: "Pública" },
    { name: "Desenvolvimento & UI", status: "Ativa", users: 18, type: "Moderada" },
    { name: "Suporte Técnico", status: "Ativa", users: 7, type: "Oficial" },
];

const mockUsers = [
    { name: "Lucas Ramos", role: "Dono", online: true, initials: "LR" },
    { name: "Marina Silva", role: "Admin", online: true, initials: "MS" },
    { name: "Rafael Costa", role: "Moderador", online: true, initials: "RC" },
    { name: "Bianca Oliveira", role: "Membro", online: false, initials: "BO" }
];

const ButtonsTest = () => {
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [copiedClass, setCopiedClass] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [clickCount, setClickCount] = useState(0);

    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, sender: "Marina Silva", text: "Olá pessoal! A bancada Aero / SkyRipple está sincronizada.", sent: false, time: "15:20" },
        { id: 2, sender: "Rafael Costa", text: "Os reflexos e relevos nos balões no formato grande ficaram perfeitos.", sent: false, time: "15:21" },
        { id: 3, sender: "Lucas Ramos", text: "Show! Vou validar a lista de presença e os comandos.", sent: true, time: "15:22" }
    ]);

    const [roomSearch, setRoomSearch] = useState('');
    const [saveSession, setSaveSession] = useState(true);
    const [onlineStatus, setOnlineStatus] = useState(true);
    const [roomTypeRadio, setRoomTypeRadio] = useState('public');
    const [selectedRoomType, setSelectedRoomType] = useState('classic');

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

    const handleActionClick = () => {
        setClickCount(prev => prev + 1);
    };

    const handleSendMessage = (e) => {
        if (e) e.preventDefault();
        if (!chatInput.trim()) return;

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        setMessages(prev => [
            ...prev,
            { id: Date.now(), sender: "Você", text: chatInput.trim(), sent: true, time: timeStr }
        ]);
        setChatInput('');
    };

    const handlePointerMove = (e) => {
        const card = e.currentTarget;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
    };

    const filteredRooms = initialRooms.filter(r =>
        r.name.toLowerCase().includes(roomSearch.toLowerCase())
    );

    return (
        <div className="flex-1 w-full flex flex-col items-center py-8 px-4 md:px-8 max-w-7xl mx-auto animate-fade-in-up-1">

            {copiedClass && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce border border-slate-700/60 dark:border-slate-300">
                    <FaCheck className="text-emerald-400 dark:text-emerald-600" />
                    <span>Classe copiada: <code className="font-mono">{copiedClass}</code></span>
                </div>
            )}

            <div
                onPointerMove={handlePointerMove}
                className="w-full skeuo-card p-6 md:p-8 mb-10 border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between relative overflow-hidden"
            >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                        <span className="skeuo-badge skeuo-badge-ativa text-[11px] px-3 py-1 font-bold uppercase tracking-wider">
                            Bancada SkyRipple
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                            AeroGlass UI Showcase
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="btn-secondary-glossy px-4 py-2 text-xs font-semibold flex items-center gap-2 rounded-xl cursor-pointer"
                        >
                            {isDark ? <FaSun className="text-amber-500" /> : <FaMoon className="text-indigo-500" />}
                            {isDark ? 'Modo Claro' : 'Modo Escuro'}
                        </button>
                        <div className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs font-semibold text-sky-700 dark:text-sky-300">
                            Ações: {clickCount}
                        </div>
                    </div>
                </div>

                <div className="max-w-3xl mb-6">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                        <FaRocket className="text-sky-500" /> Bancada de Componentes WebChat
                    </h1>
                    <p className="text-base text-slate-600 dark:text-slate-300 mt-2 font-medium">
                        Vitrine viva de janelas, comandos, formulários, presença e conversas inspirada na arquitetura física AeroGlass & SkyRipple.
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Projetada para inspeção direta dos componentes fundamentais em produção, com luz zenital difusa a 90°, chanfros especulares e suporte integral ao modo escuro.
                    </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" /> Compilação visual 7.0
                        </span>
                        <span>•</span>
                        <span>Vidro tátil ativado</span>
                        <span>•</span>
                        <span>Tema: WebChat SkyRipple</span>
                    </div>
                    <button
                        type="button"
                        onClick={() => copyToClipboard('.skeuo-card .skeuo-well .skeuo-btn-primary')}
                        className="btn-secondary-glossy px-3 py-1 text-[11px] flex items-center gap-1.5 cursor-pointer"
                    >
                        <FiCopy size={11} /> Copiar Stack Central
                    </button>
                </div>
            </div>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Comandos"
                    note="Botões com relevo tátil, luz superior especular e resposta física de clique."
                    tag=".skeuo-btn-*"
                />
                <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden">
                    <WindowHeader
                        title="Barra de ações & comandos"
                        meta="controles"
                        onCopy={() => copyToClipboard('.skeuo-btn-primary')}
                        copyClass=".skeuo-btn-primary"
                    />
                    <div className="p-6 flex flex-wrap items-center gap-4">
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="skeuo-btn-primary px-5 py-2.5 text-sm font-semibold text-white flex items-center gap-2 cursor-pointer"
                        >
                            <FaRocket size={13} /> Entrar na Sala
                        </button>
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="btn-secondary-glossy px-4 py-2.5 text-sm font-medium cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="skeuo-btn-white px-4 py-2.5 text-sm font-semibold cursor-pointer"
                        >
                            White Gel
                        </button>
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="skeuo-btn-danger px-4 py-2.5 text-sm font-semibold rounded-xl flex items-center gap-2 cursor-pointer"
                        >
                            <FaTrash size={12} /> Remover
                        </button>
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="btn-secondary-glossy px-3 py-1.5 text-xs font-semibold cursor-pointer"
                        >
                            Ping (sm)
                        </button>
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="skeuo-btn-primary px-6 py-3 text-base font-bold text-white flex items-center gap-2 cursor-pointer"
                        >
                            Conectar (lg) <FiArrowRight size={14} />
                        </button>
                        <button
                            type="button"
                            disabled
                            className="skeuo-btn-primary px-4 py-2 text-sm text-white opacity-50 cursor-not-allowed"
                        >
                            Desativado
                        </button>
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="skeuo-icon-btn w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
                        >
                            <FiBell size={16} />
                        </button>
                    </div>
                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Entrada de dados"
                    note="Campos embutidos em cavidade reversa, foco azul límpido e seletores táteis."
                    tag=".skeuo-input"
                />
                <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden">
                    <WindowHeader
                        title="Conexão da sala & credenciais"
                        meta="formulários"
                        onCopy={() => copyToClipboard('.skeuo-input')}
                        copyClass=".skeuo-input"
                    />
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                Nome da Sala
                            </label>
                            <input
                                type="text"
                                defaultValue="Aero Lobby"
                                placeholder="Digite o nome da sala..."
                                className="skeuo-input w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                Convite por E-mail
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    defaultValue="suporte@webchat.com"
                                    placeholder="email@dominio.com"
                                    className="skeuo-input w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                Palavra-Passe da Sala
                            </label>
                            <input
                                type="password"
                                defaultValue="senha1234"
                                placeholder="••••••••"
                                className="skeuo-input w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                Busca Rápida com Ícone
                            </label>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                                <input
                                    type="text"
                                    placeholder="Buscar participante..."
                                    className="skeuo-input w-full pl-8 pr-3.5 py-2 text-xs text-slate-800 dark:text-slate-100"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                Canal Bloqueado (Disabled)
                            </label>
                            <input
                                type="text"
                                disabled
                                defaultValue="Reservado ao Host"
                                className="skeuo-input w-full px-3.5 py-2 text-xs text-slate-500 opacity-60 cursor-not-allowed"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                Tipo de Sala
                            </label>
                            <select
                                value={selectedRoomType}
                                onChange={(e) => setSelectedRoomType(e.target.value)}
                                className="skeuo-input w-full px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                            >
                                <option value="classic">Sala Clássica (Geral)</option>
                                <option value="public">Sala Pública</option>
                                <option value="private">Sala Privada (Host)</option>
                            </select>
                        </div>

                        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                                Mensagem Fixada do Canal
                            </label>
                            <textarea
                                rows={2}
                                defaultValue="Aviso da sessão: Esta sala utiliza sincronização de presença em tempo real."
                                className="skeuo-input w-full px-3.5 py-2 text-xs text-slate-800 dark:text-slate-100 resize-none"
                            />
                        </div>

                        <div className="flex flex-col justify-center gap-3 p-3 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
                                <input
                                    type="checkbox"
                                    checked={saveSession}
                                    onChange={(e) => setSaveSession(e.target.checked)}
                                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                                />
                                <span>Salvar sessão no navegador</span>
                            </label>

                            <div className="flex items-center gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="room-mode"
                                        checked={roomTypeRadio === 'public'}
                                        onChange={() => setRoomTypeRadio('public')}
                                        className="text-sky-600 cursor-pointer"
                                    />
                                    <span>Pública</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="room-mode"
                                        checked={roomTypeRadio === 'invite'}
                                        onChange={() => setRoomTypeRadio('invite')}
                                        className="text-sky-600 cursor-pointer"
                                    />
                                    <span>Convite</span>
                                </label>
                            </div>

                            <label className="flex items-center justify-between cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-200/50 dark:border-slate-800">
                                <span>Status Online Visível</span>
                                <input
                                    type="checkbox"
                                    checked={onlineStatus}
                                    onChange={(e) => setOnlineStatus(e.target.checked)}
                                    className="cursor-pointer"
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Painéis de sistema"
                    note="Variações físicas de vidro e cavidade para janelas, cartões métricos e terminais de log."
                    tag=".skeuo-card • .glass-panel"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden flex flex-col justify-between">
                        <WindowHeader
                            title="Nota da sessão"
                            meta="texto tátil"
                            onCopy={() => copyToClipboard('.skeuo-card')}
                            copyClass=".skeuo-card"
                        />
                        <div className="p-5">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">
                                Superfície com Vidro Físico
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                                A placa mantém a transparência sem perder a oclusão inferior e o chanfro branco de 90° no topo.
                            </p>
                        </div>
                        <div className="p-4 pt-0 flex justify-end">
                            <button type="button" onClick={handleActionClick} className="btn-secondary-glossy text-xs px-3.5 py-1.5 cursor-pointer">
                                Inspecionar
                            </button>
                        </div>
                    </div>

                    <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden flex flex-col justify-between">
                        <WindowHeader
                            title="Sala selecionada"
                            meta="foco ativo"
                            onCopy={() => copyToClipboard('.skeuo-well')}
                            copyClass=".skeuo-well"
                        />
                        <div className="p-5">
                            <div className="skeuo-well p-3.5 rounded-xl flex items-center justify-between mb-3">
                                <div>
                                    <strong className="text-sm font-bold text-slate-800 dark:text-slate-100 block">
                                        Canal Geral #1
                                    </strong>
                                    <span className="text-[11px] text-slate-400">28 participantes online</span>
                                </div>
                                <span className="skeuo-badge skeuo-badge-online text-[10px] px-2.5 py-0.5 rounded-full">
                                    Conectado
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Módulo com cavidade de luz invertida que aproxima as ações do usuário.
                            </p>
                        </div>
                        <div className="p-4 pt-0 flex items-center gap-2">
                            <button type="button" onClick={handleActionClick} className="skeuo-btn-primary flex-1 text-xs py-2 text-white font-semibold cursor-pointer">
                                Abrir Chat
                            </button>
                            <button type="button" onClick={handleActionClick} className="btn-secondary-glossy text-xs py-2 px-3 cursor-pointer">
                                Fixar
                            </button>
                        </div>
                    </div>

                    <div onPointerMove={handlePointerMove} className="glass-panel p-5 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                                Vidro Jateado
                            </span>
                            <button
                                type="button"
                                onClick={() => copyToClipboard('.glass-panel')}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer"
                            >
                                <FiCopy size={11} /> .glass-panel
                            </button>
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                            Resumo Translúcido
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                            Superfície jateada com desfoque de 12px, ideal para cartões flutuantes sobre planos ricos em cor.
                        </p>
                        <div className="flex items-baseline justify-between pt-3 border-t border-slate-200/50 dark:border-slate-800">
                            <span className="text-xs text-slate-400">Mensagens hoje</span>
                            <strong className="text-2xl font-black text-slate-800 dark:text-slate-100">1.420</strong>
                        </div>
                    </div>

                    <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden md:col-span-2 lg:col-span-3">
                        <WindowHeader
                            title="Console de atividade & logs"
                            meta="painel de terminal"
                            onCopy={() => copyToClipboard('.skeuo-card')}
                            copyClass=".skeuo-card"
                        />
                        <div className="p-4 bg-slate-900/90 dark:bg-black/80 font-mono text-xs text-sky-300/90 flex flex-col gap-1.5">
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">[15:18:04]</span>
                                <span className="text-emerald-400">SESSÃO:</span>
                                <span>Ambiente SkyRipple inicializado com sucesso.</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">[15:18:12]</span>
                                <span className="text-sky-400">SALA:</span>
                                <span>Conexão WebSocket autorizada com sala "Aero Lobby".</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">[15:18:18]</span>
                                <span className="text-amber-400">PRESENÇA:</span>
                                <span>4 usuários sincronizados no canal (Lucas, Marina, Rafael, Bianca).</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500">[15:18:25]</span>
                                <span className="text-emerald-400">LIVRE:</span>
                                <span>Latência nominal 18ms • Modo de iluminação física a 90°.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Estados & Badges"
                    note="Marcadores pequenos com relevo para listas de usuários, canais e janelas."
                    tag=".skeuo-badge-*"
                />
                <div onPointerMove={handlePointerMove} className="skeuo-card p-5 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Estado da Sessão:
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                        {badges.map((b) => (
                            <button
                                key={b.tone}
                                type="button"
                                onClick={() => copyToClipboard(`.${b.cls}`)}
                                className={`skeuo-badge ${b.cls} text-[11px] px-3 py-0.5 rounded-full font-bold cursor-pointer transition-transform hover:scale-105`}
                                title={`Clique para copiar .${b.cls}`}
                            >
                                {b.label}
                            </button>
                        ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                        15:24 GMT-3
                    </span>
                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Avisos do sistema"
                    note="Alertas táteis integrados à física do vidro, categorizados por severidade."
                    tag="Alertas Táteis"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Alert
                        tone="success"
                        title="Sala criada com sucesso"
                        text="Os convidados e moderadores já podem encontrar o lobby na lista pública."
                    />
                    <Alert
                        tone="error"
                        title="Conexão interrompida"
                        text="Tentativa automática de reconexão agendada em 5 segundos."
                    />
                    <Alert
                        tone="warning"
                        title="Permissão restrita"
                        text="Apenas administradores e moderadores podem fixar mensagens neste canal."
                    />
                    <Alert
                        tone="info"
                        title="Design System sincronizado"
                        text="O mostruário está operando com os tokens de iluminação a 90° ativos."
                    />
                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Pessoas & Presença"
                    note="Avatares táteis com anel gradiente, perfis de autoridade e listas ativas de presença."
                    tag="UserAvatar.jsx"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div onPointerMove={handlePointerMove} className="skeuo-card p-5 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                                Faixa de Presença
                            </span>
                            <div className="flex items-center justify-between gap-2 mb-4 px-1">
                                <div className="flex flex-col items-center gap-1.5">
                                    <UserAvatar name="Lucas Ramos" size="md" showStatus={true} status="online" />
                                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">Dono</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <UserAvatar name="Marina Silva" size="md" showStatus={true} status="online" />
                                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">Admin</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <UserAvatar name="Rafael Costa" size="md" showStatus={true} status="online" />
                                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">Mod</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <UserAvatar name="Bianca Oliveira" size="md" showStatus={true} status="offline" />
                                    <span className="text-[10px] font-semibold text-slate-400">Membro</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Componente oficial <code className="font-mono text-sky-600 dark:text-sky-400">&lt;UserAvatar /&gt;</code> com anel tátil gradiente e status em tempo real.
                        </p>
                    </div>

                    <div onPointerMove={handlePointerMove} className="skeuo-card p-5 flex items-center gap-4">
                        <UserAvatar name="Lucas Ramos" size="lg" showStatus={true} status="online" />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Lucas Ramos</h3>
                                <span className="skeuo-badge skeuo-badge-dono text-[10px] px-2 py-0.5 rounded-full font-bold">Dono</span>
                            </div>
                            <p className="text-xs text-slate-400">Host do ecossistema WebChat</p>
                            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Ativo agora
                            </span>
                        </div>
                    </div>

                    <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden">
                        <WindowHeader
                            title="Online agora"
                            meta="4 participantes"
                            onCopy={() => copyToClipboard('.skeuo-badge-admin')}
                            copyClass=".skeuo-badge-admin"
                        />
                        <div className="p-3 flex flex-col gap-2 max-h-40 overflow-y-auto">
                            {mockUsers.map((u) => (
                                <div key={u.name} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800">
                                    <div className="flex items-center gap-2.5">
                                        <UserAvatar name={u.name} size="xs" showStatus={true} status={u.online ? 'online' : 'offline'} />
                                        <span className="text-xs font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
                                    </div>
                                    <span className="text-[10px] font-semibold text-slate-400">{u.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Prévia do chat"
                    note="Módulo completo e funcional de conversa com balões no formato grande, anexo e botão circular gel."
                    tag="Formato Grande • Balões Físicos"
                />
                <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden">
                    <WindowHeader
                        title="Sala Geral - conversa ativa"
                        meta="módulo vivo"
                        onCopy={() => copyToClipboard('Formato Grande')}
                        copyClass="Formato Grande"
                    />

                    <div className="p-4 border-b border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <UserAvatar name="Sala Geral" size="sm" showStatus={true} status="online" />
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Sala Geral</h3>
                                <p className="text-xs text-slate-400">42 participantes conectados no momento</p>
                            </div>
                        </div>
                        <span className="skeuo-badge skeuo-badge-online text-xs px-3 py-1 rounded-full font-bold">
                            Ao Vivo
                        </span>
                    </div>

                    <div className="p-6 flex flex-col gap-4 bg-slate-50/50 dark:bg-slate-950/40 min-h-[220px]">
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={`flex items-end gap-2.5 ${m.sent ? 'self-end flex-row-reverse max-w-[85%]' : 'items-start max-w-[85%]'}`}
                            >
                                {!m.sent && <UserAvatar name={m.sender} size="xs" showStatus={false} />}
                                <div className={`flex flex-col ${m.sent ? 'items-end' : 'items-start'}`}>
                                    {!m.sent && (
                                        <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-2">
                                            {m.sender}
                                        </span>
                                    )}
                                    <div
                                        className={`${m.sent ? 'bg-gradient-to-b from-sky-400 to-sky-600 dark:from-sky-500 dark:to-blue-700 text-white shadow-[0_2px_5px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4)] border border-sky-600/70 dark:border-sky-400/60 [text-shadow:0_-1px_0_rgba(0,0,0,0.2)] font-medium' : 'bg-gradient-to-b from-[#f9f9f9] to-[#ebebeb] dark:from-[#334155] dark:to-[#1e293b] text-[#1d1d1f] dark:text-[#f8fafc] border border-slate-300/80 dark:border-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]'} px-4 py-2 text-xs rounded-[18px] leading-relaxed`}
                                    >
                                        {m.text}
                                    </div>
                                    <div className={`flex items-center gap-1 mt-1 text-[10px] text-slate-400 ${m.sent ? 'mr-1' : 'ml-2'}`}>
                                        <span>{m.time}</span>
                                        {m.sent && <FaCheck className="text-sky-500" size={9} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2.5 bg-white/40 dark:bg-slate-900/40">
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="skeuo-icon-btn w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-sky-600 dark:text-slate-400 shrink-0 cursor-pointer"
                        >
                            <FiPaperclip size={16} />
                        </button>
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Digite uma mensagem para testar o chat..."
                            className="skeuo-input flex-1 px-4 py-2 text-xs text-slate-800 dark:text-slate-100"
                        />
                        <button
                            type="submit"
                            className="skeuo-btn-primary w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-md cursor-pointer"
                            title="Enviar mensagem"
                        >
                            <FiSend size={13} className="ml-0.5" />
                        </button>
                    </form>
                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Navegador de salas"
                    note="Lista compacta com leitura desktop, badges de capacidade e ação rápida de conexão."
                    tag="Salas Desktop"
                />
                <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden">
                    <WindowHeader
                        title="Navegador de salas"
                        meta={`${filteredRooms.length} ativas`}
                        onCopy={() => copyToClipboard('.skeuo-badge-ativa')}
                        copyClass=".skeuo-badge-ativa"
                    />
                    <div className="p-4 border-b border-slate-200/50 dark:border-slate-800">
                        <div className="relative">
                            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                            <input
                                type="text"
                                value={roomSearch}
                                onChange={(e) => setRoomSearch(e.target.value)}
                                placeholder="Filtrar salas ativas..."
                                className="skeuo-input w-full pl-9 pr-3.5 py-2 text-xs text-slate-800 dark:text-slate-100"
                            />
                        </div>
                    </div>
                    <div className="divide-y divide-slate-200/50 dark:divide-slate-800">
                        {filteredRooms.map((r) => (
                            <div key={r.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="skeuo-surface-orb-badge w-9 h-9 flex items-center justify-center text-sky-600 dark:text-sky-400 font-bold text-xs shrink-0">
                                        #
                                    </div>
                                    <div>
                                        <strong className="text-sm font-bold text-slate-800 dark:text-slate-100 block">{r.name}</strong>
                                        <span className="text-xs text-slate-400">{r.type} • {r.status}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                        <FaUsers size={12} className="text-sky-500" /> {r.users} participantes
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleActionClick}
                                        className="skeuo-btn-primary px-4 py-1.5 text-xs font-semibold text-white cursor-pointer"
                                    >
                                        Entrar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Carregamento & Transição"
                    note="Indicadores de espera físicos, skeletons cavitários e barras de progresso ciano."
                    tag="Loading States"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <div onPointerMove={handlePointerMove} className="skeuo-card p-5 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full border-3 border-sky-400/30 border-t-sky-500 animate-spin shrink-0" />
                        <div>
                            <strong className="text-sm font-bold text-slate-800 dark:text-slate-100 block">Abrindo sala...</strong>
                            <span className="text-xs text-slate-400">Preparando presença e histórico criptografado.</span>
                        </div>
                    </div>

                    <div onPointerMove={handlePointerMove} className="skeuo-card p-5 flex flex-col gap-2.5 justify-center">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded-md animate-pulse w-3/4" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md animate-pulse w-full" />
                        <div className="h-3 bg-slate-200 dark:bg-slate-700/60 rounded-md animate-pulse w-1/2" />
                    </div>

                    <div onPointerMove={handlePointerMove} className="skeuo-card p-5 flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-2">
                                Sincronizando Contatos
                            </span>
                            <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200/60 dark:border-slate-700/60 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-sky-400 to-blue-600 rounded-full w-[68%]" />
                            </div>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono text-right mt-3 block">68% concluído</span>
                    </div>

                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Diálogo modal"
                    note="Janela de confirmação e alerta sobre fundo translúcido com cabeçalho de sistema."
                    tag="Modal Aero"
                />
                <div onPointerMove={handlePointerMove} className="skeuo-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                            Janela Modal de Confirmação
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Dispara um diálogo com moldura física de janela, título e botões duplos de confirmação.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="skeuo-btn-primary px-5 py-2.5 text-xs font-semibold text-white shrink-0 cursor-pointer"
                    >
                        Abrir Modal de Teste
                    </button>
                </div>
            </section>

            <section className="w-full mb-12">
                <SectionTitle
                    title="Erro de rota"
                    note="Estado visual para navegações inexistentes com botão de regresso."
                    tag="404 State"
                />
                <div onPointerMove={handlePointerMove} className="skeuo-card overflow-hidden max-w-md mx-auto text-center">
                    <WindowHeader title="Navegação" meta="não encontrada" />
                    <div className="p-8 flex flex-col items-center">
                        <strong className="text-5xl font-black text-sky-500 mb-2">404</strong>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                            Página Não Encontrada
                        </span>
                        <p className="text-xs text-slate-400 mb-5 max-w-xs">
                            O canal ou rota solicitada não existe ou foi arquivada pelo host.
                        </p>
                        <button
                            type="button"
                            onClick={handleActionClick}
                            className="btn-secondary-glossy px-5 py-2 text-xs font-semibold cursor-pointer"
                        >
                            Voltar ao Início
                        </button>
                    </div>
                </div>
            </section>

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="skeuo-card overflow-hidden w-full max-w-md shadow-2xl animate-scale-in"
                    >
                        <WindowHeader title="Confirmar entrada" meta="diálogo" />
                        <div className="p-6">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
                                Entrar na Sala Geral?
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                Você está prestes a abrir a Sala Geral com o seu status online visível para todos os participantes do canal.
                            </p>
                            <div className="flex justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn-secondary-glossy px-4 py-2 text-xs font-medium cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="skeuo-btn-primary px-4 py-2 text-xs font-semibold text-white cursor-pointer"
                                >
                                    Confirmar Entrada
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

function WindowHeader({ title, meta, onCopy, copyClass }) {
    return (
        <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-2.5 border-b border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700 inline-block" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {title}
                </span>
            </div>
            <div className="flex items-center gap-2">
                {copyClass && onCopy && (
                    <button
                        type="button"
                        onClick={onCopy}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-1 cursor-pointer"
                    >
                        <FiCopy size={9} /> {copyClass}
                    </button>
                )}
                <small className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                    {meta}
                </small>
            </div>
        </div>
    );
}

function SectionTitle({ title, note, tag }) {
    return (
        <header className="mb-4">
            <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                    {title}
                </h2>
                {tag && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300/60 dark:border-sky-800/60">
                        {tag}
                    </span>
                )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
                {note}
            </p>
        </header>
    );
}

function Alert({ tone, title, text }) {
    const toneStyles = {
        success: 'border-emerald-300/80 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200',
        error: 'border-rose-300/80 dark:border-rose-800/60 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200',
        warning: 'border-amber-300/80 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200',
        info: 'border-sky-300/80 dark:border-sky-800/60 bg-sky-50/70 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200'
    };

    return (
        <div className={`p-4 rounded-2xl border ${toneStyles[tone] || toneStyles.info} flex flex-col gap-1 shadow-sm`}>
            <strong className="text-xs font-bold">{title}</strong>
            <span className="text-[11px] opacity-90 leading-relaxed">{text}</span>
        </div>
    );
}

export default ButtonsTest;
