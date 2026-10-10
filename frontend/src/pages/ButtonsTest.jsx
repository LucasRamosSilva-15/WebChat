import React, { useState } from 'react';
import { 
    FaDownload, FaGavel, FaTrash, FaCheck, FaHeart, FaShare, 
    FaSearch, FaBell, FaSun, FaMoon, FaCog, FaRocket, FaStar
} from 'react-icons/fa';
import { FiBell, FiAlertTriangle, FiArrowRight, FiShield, FiSend, FiCopy } from 'react-icons/fi';

const ButtonsTest = () => {
    const [clickCount, setClickCount] = useState(0);
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
            
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                        <FaRocket className="text-sky-500" /> Catálogo de Botões & Visuais
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Galeria de testes com todos os botões e componentes táteis de <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sky-600 dark:text-sky-400 font-mono text-xs">skeuo.css</code>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleTheme}
                        className="skeuo-btn-white px-4 py-2 text-xs font-semibold flex items-center gap-2 rounded-xl cursor-pointer"
                    >
                        {isDark ? <FaSun className="text-amber-500" /> : <FaMoon className="text-indigo-500" />}
                        {isDark ? 'Modo Claro' : 'Modo Escuro'}
                    </button>
                    <div className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/60 text-xs font-semibold text-sky-700 dark:text-sky-300">
                        Cliques: {clickCount}
                    </div>
                </div>
            </div>

            {copiedClass && (
                <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-bounce">
                    <FaCheck className="text-emerald-400 dark:text-emerald-600" /> Classe copiada: {copiedClass}
                </div>
            )}

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
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Branco Clássico</span>
                            <button onClick={() => copyToClipboard('.btn-white-glossy')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                <FiCopy /> .btn-white-glossy
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Branco Glossy Clássico</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Botão neutro com gradiente claro suave de 4 paradas e contorno acinzentado.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button onClick={handleClick} className="btn-white-glossy text-sm px-4 py-2">
                            Opção Neutra
                        </button>
                        <button onClick={handleClick} className="btn-white-glossy text-sm px-4 py-2 flex items-center gap-2">
                            <FaShare size={12} /> Compartilhar
                        </button>
                        <button disabled className="btn-white-glossy text-sm px-4 py-2 opacity-50 cursor-not-allowed">
                            Desativado
                        </button>
                    </div>
                </div>

                <div className="skeuo-panel p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Moderno Translúcido</span>
                            <button onClick={() => copyToClipboard('.btn-secondary-modern')} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs flex items-center gap-1 cursor-pointer">
                                <FiCopy /> .btn-secondary-modern
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Secundário Modern / Smooth</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                            Visual leve translúcido em vidro esbranquiçado suave com transições delicadas.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button onClick={handleClick} className="btn-secondary-modern text-sm px-4 py-2">
                            Ação Suave
                        </button>
                        <button onClick={handleClick} className="btn-secondary-smooth text-sm px-4 py-2 flex items-center gap-2">
                            <FaStar size={12} className="text-amber-500" /> Favoritar
                        </button>
                        <button disabled className="btn-secondary-modern text-sm px-4 py-2 opacity-50 cursor-not-allowed">
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
                            Botão perfeitamente redondo para barras de ferramentas, ações flutuantes e mini-interações.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
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
                            {['todos', 'populares', 'recentes', 'arquivados'].map((tab) => {
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

            <div className="w-full mt-10 skeuo-panel p-6">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <FiShield className="text-sky-500" /> Demonstração em Cartões de Ação Completa
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
