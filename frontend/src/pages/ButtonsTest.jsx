import React, { useState } from 'react';
import { 
    FaDownload, FaTrash, FaCheck, FaHeart, FaShare, 
    FaSearch, FaBell, FaSun, FaMoon, FaCog, FaRocket, FaStar,
    FaUsers, FaChartLine, FaShieldAlt, FaComments, FaUser, FaDoorOpen, FaLock, FaExternalLinkAlt
} from 'react-icons/fa';
import { FiBell, FiAlertTriangle, FiArrowRight, FiShield, FiSend, FiCopy, FiLayers, FiGrid, FiBox } from 'react-icons/fi';

const ButtonsTest = () => {
    const [clickCount, setClickCount] = useState(0);
    const [activeSection, setActiveSection] = useState('todos');
    const [selectedTab, setSelectedTab] = useState('todos');
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    const [copiedClass, setCopiedClass] = useState('');

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
                <div className="skeuo-segmented-track">
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

                        <div className="skeuo-card-dialog md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Card Dialog / Login</span>
                                    <button onClick={() => copyToClipboard('.skeuo-card-dialog')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                        <FiCopy /> .skeuo-card-dialog
                                    </button>
                                </div>
                                <h3 className="skeuo-card-dialog-title">Admin Login</h3>
                                <div className="mb-4">
                                    <input 
                                        type="password" 
                                        placeholder="Senha Mestra" 
                                        className="skeuo-dialog-input"
                                    />
                                </div>
                            </div>
                            <button onClick={handleClick} className="skeuo-btn-aqua-pill mt-2">
                                Login
                            </button>
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

        </div>
    );
};

export default ButtonsTest;
