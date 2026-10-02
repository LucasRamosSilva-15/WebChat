import React, { useState } from 'react';
import {
    FaSearch, FaRocket, FaUser, FaShieldAlt, FaCog, FaServer,
    FaQuestionCircle, FaChevronDown, FaChevronUp, FaExclamationCircle,
    FaBan, FaLifeRing, FaHeadset
} from 'react-icons/fa';

const Suporte = () => {
    const [faqOpen, setFaqOpen] = useState(0);

    const faqs = [
        {
            question: "Como mudar meu tema?",
            answer: "Para alterar seu tema, vá até Configurações > Aparência. Lá você encontrará opções para Modo Claro, Modo Escuro e nossa seleção exclusiva de temas Frutiger Aero."
        },
        {
            question: "Minha conta foi banida, o que fazer?",
            answer: "Se você acredita que seu banimento foi injusto, abra um ticket de suporte detalhando o ocorrido para análise da nossa equipe."
        },
        {
            question: "Como criar uma sala privada?",
            answer: "No momento as salas privadas estão em desenvolvimento. Fique de olho nas próximas atualizações do SkyRipple!"
        },
        {
            question: "O SkyRipple é gratuito?",
            answer: "Sim! O SkyRipple é um projeto acadêmico e de código aberto 100% gratuito."
        }
    ];

    const bannedRooms = [
        { name: "Sala_VIP_Vazame...", reason: "Spam/Phishing" },
        { name: "Hacks_Free_2024", reason: "Malware" },
        { name: "Bot_Net_Test", reason: "Abuso de API" }
    ];

    return (
        <div className="flex-1 w-full flex flex-col items-center min-h-[calc(100vh-64px)] relative z-1">
            <div className="w-full max-w-[1000px] px-4 py-8 md:py-12 animate-fade-in-up-1">

                <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 mb-4">
                        <FaLifeRing size={12} className="text-blue-500" />
                        <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wide">
                            Suporte ao Usuário (Em Desenvolvimento)
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold admin-hero-title text-sky-500 dark:text-sky-400 mb-2">Central de Ajuda & Suporte</h1>
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 max-w-lg mb-8">
                        Encontre respostas, relate problemas e aprenda a usar o SkyRipple.
                    </p>

                    <div className="flex items-center w-full max-w-2xl relative">
                        <FaSearch className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Como podemos ajudar hoje?"
                            className="w-full py-3 pr-24 pl-12 rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-xs text-[15px] text-slate-700 dark:text-slate-100 focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                        />
                        <button className="skeuo-btn absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-1.5 text-[13px]">
                            Buscar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-black/5 dark:border-white/5 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500/30 transition-all cursor-pointer flex flex-col items-center text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-slate-300 dark:border-slate-600 shadow-inner flex items-center justify-center mb-4">
                            <FaRocket size={20} className="text-indigo-500" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Primeiros Passos</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Guia básico para novos usuários.</p>
                    </div>

                    <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-black/5 dark:border-white/5 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500/30 transition-all cursor-pointer flex flex-col items-center text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-slate-300 dark:border-slate-600 shadow-inner flex items-center justify-center mb-4">
                            <FaUser size={20} className="text-cyan-500" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Minha Conta</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Problemas de login e senha.</p>
                    </div>

                    <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-black/5 dark:border-white/5 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500/30 transition-all cursor-pointer flex flex-col items-center text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-slate-300 dark:border-slate-600 shadow-inner flex items-center justify-center mb-4">
                            <FaShieldAlt size={20} className="text-rose-500" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Segurança & Privacidade</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Denúncias e bloqueios.</p>
                    </div>

                    <div className="bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-black/5 dark:border-white/5 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-sky-500/30 transition-all cursor-pointer flex flex-col items-center text-center p-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border border-slate-300 dark:border-slate-600 shadow-inner flex items-center justify-center mb-4">
                            <FaCog size={20} className="text-blue-500" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Problemas Técnicos</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Bugs e erros de conexão.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">

                    <div className="md:col-span-4 flex flex-col gap-6">

                        <div className="skeuo-panel p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaServer size={14} className="text-blue-500" />
                                <h3 className="text-[14px] font-bold admin-hero-title">Status dos Servidores</h3>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50">
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold admin-hero-title">Sistema Geral</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">Operacional</span>
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 px-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Ping Média</span>
                                    <span className="text-[13px] font-bold text-blue-600 dark:text-blue-400">42ms</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Uptime</span>
                                    <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">99.9%</span>
                                </div>
                            </div>

                            <div className="w-full text-center mt-2 border-t border-gray-100 dark:border-slate-700/50 pt-3">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">Versão: 6.12.0</span>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-1">
                                <FaExclamationCircle size={14} className="text-rose-500" />
                                <h3 className="text-[14px] font-bold admin-hero-title">Relatar Usuário ou Sala</h3>
                            </div>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400">
                                Ajude a manter o SkyRipple seguro. Suas denúncias são anônimas.
                            </p>

                            <div className="flex flex-col gap-3 mt-1">
                                <input
                                    type="text"
                                    className="skeuo-input p-2.5 text-[13px]"
                                    placeholder="ID do Usuário ou Sala"
                                />
                                <textarea
                                    className="skeuo-input p-2.5 text-[13px] min-h-[80px] resize-none"
                                    placeholder="Descreva o motivo da denúncia..."
                                ></textarea>
                                <button className="btn-secondary-glossy py-2.5 text-[13px] font-bold text-gray-700 dark:text-gray-300 w-full mt-2">
                                    Enviar Denúncia Anonimamente
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 flex flex-col gap-6">

                        <div className="skeuo-panel p-0 flex flex-col overflow-hidden">
                            <div className="p-5 border-b border-gray-100 dark:border-slate-700/50 flex items-center gap-2">
                                <FaQuestionCircle size={15} className="text-teal-500" />
                                <h3 className="text-[15px] font-bold admin-hero-title">Perguntas Frequentes</h3>
                            </div>

                            <div className="flex flex-col">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border-b border-black/5 dark:border-white/5 last:border-b-0 flex flex-col">
                                        <button
                                            onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                                            className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors flex items-center justify-between p-4 md:px-6 w-full text-left"
                                        >
                                            <span className={`text-[13px] font-bold ${faqOpen === idx ? 'text-blue-500 dark:text-sky-400' : 'admin-table-text'}`}>
                                                {faq.question}
                                            </span>
                                            {faqOpen === idx ? (
                                                <FaChevronUp size={12} className="text-blue-500 dark:text-sky-400" />
                                            ) : (
                                                <FaChevronDown size={12} className="text-slate-500 dark:text-slate-400" />
                                            )}
                                        </button>

                                        {faqOpen === idx && (
                                            <div className="bg-black/[0.01] dark:bg-black/20 border-t border-dashed border-black/5 dark:border-white/5 p-4 md:px-6 animate-fade-in">
                                                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-gray-100 dark:border-slate-700/50 flex justify-center">
                                <button className="btn-secondary-glossy px-6 py-2 text-[13px] font-bold text-gray-700 dark:text-gray-300">
                                    Ler mais perguntas
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <FaBan size={14} className="text-gray-400" />
                                    <h3 className="text-[14px] font-bold admin-hero-title">Transparência</h3>
                                </div>
                                <span className="text-[11px] px-2 py-1 bg-gray-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400">
                                    Últimas 24h
                                </span>
                            </div>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400">
                                Salas banidas recentemente por violação dos termos.
                            </p>

                            <div className="flex flex-col gap-2 mt-2">
                                {bannedRooms.map((room, idx) => (
                                    <div key={idx} className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 dark:border-red-500/20 hover:bg-red-500/10 dark:hover:bg-red-500/15 transition-all flex items-center justify-between p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <FaBan size={12} className="text-red-500" />
                                            <span className="text-[13px] font-medium admin-table-text">{room.name}</span>
                                        </div>
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">{room.reason}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="skeuo-panel p-8 flex flex-col items-center text-center mb-8 bg-gradient-to-b from-transparent to-blue-50/60 dark:to-slate-800/50">
                    <h3 className="text-[16px] font-bold admin-hero-title mb-2">Ainda precisa de ajuda?</h3>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-md mb-6">
                        Nossa equipe de suporte está disponível para resolver problemas complexos.
                    </p>
                    <button className="skeuo-btn px-6 py-2.5 text-[14px] flex items-center gap-2 rounded-full">
                        <FaHeadset size={14} /> Abrir Ticket de Suporte
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Suporte;
