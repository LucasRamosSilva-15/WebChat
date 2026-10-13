import React, { useState } from 'react';
import {
    FaRocket, FaUser, FaShieldAlt, FaCog, FaServer,
    FaQuestionCircle, FaChevronDown, FaChevronUp, FaExclamationCircle,
    FaBan, FaHeadset
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
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100/90 dark:bg-sky-950/60 border border-sky-300/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,113,227,0.1)] mb-4">
                        🛠️ SUPORTE AO USUÁRIO
                    </span>

                    <h1 className="text-3xl font-bold admin-hero-title text-sky-500 dark:text-sky-400 mb-2">Central de Ajuda & Suporte</h1>
                    <p className="text-[14px] text-slate-500 dark:text-slate-400 max-w-lg mb-8">
                        Encontre respostas, relate problemas e aprenda a usar o SkyRipple.
                    </p>

                    <div className="relative max-w-xl mx-auto w-full mb-10">
                        <input
                            type="text"
                            placeholder="Como podemos ajudar hoje?"
                            className="skeuo-input w-full pl-5 pr-14 py-3.5 text-sm rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            title="Buscar"
                            className="skeuo-btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 !w-9 !h-9 !p-0 rounded-full inline-flex items-center justify-center text-white shadow-sm"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="skeuo-card p-6 flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1">
                        <div className="skeuo-surface-orb-badge w-12 h-12 flex items-center justify-center mb-3">
                            <FaRocket size={20} className="text-indigo-500" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Primeiros Passos</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Guia básico para novos usuários.</p>
                    </div>

                    <div className="skeuo-card p-6 flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1">
                        <div className="skeuo-surface-orb-badge w-12 h-12 flex items-center justify-center mb-3">
                            <FaUser size={20} className="text-cyan-500" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Minha Conta</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Problemas de login e senha.</p>
                    </div>

                    <div className="skeuo-card p-6 flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1">
                        <div className="skeuo-surface-orb-badge w-12 h-12 flex items-center justify-center mb-3">
                            <FaShieldAlt size={20} className="text-rose-500" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Segurança & Privacidade</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Denúncias e bloqueios.</p>
                    </div>

                    <div className="skeuo-card p-6 flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1">
                        <div className="skeuo-surface-orb-badge w-12 h-12 flex items-center justify-center mb-3">
                            <FaCog size={20} className="text-blue-500" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Problemas Técnicos</h3>
                        <p className="text-[12px] text-slate-500 dark:text-slate-400">Bugs e erros de conexão.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <div className="skeuo-card p-6 flex flex-col h-full">
                            <div className="pb-4 border-b border-slate-200/60 dark:border-slate-700/50 flex items-center gap-2">
                                <FaQuestionCircle size={15} className="text-teal-500" />
                                <h3 className="text-[15px] font-bold admin-hero-title">Perguntas Frequentes</h3>
                            </div>

                            <div className="flex flex-col py-2 flex-grow">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border-b border-slate-200/40 dark:border-slate-700/40 last:border-b-0 flex flex-col py-1">
                                        <button
                                            onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                                            className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors flex items-center justify-between p-3 rounded-lg w-full text-left cursor-pointer"
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
                                            <div className="bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-xl border border-slate-200/50 my-2 animate-fade-in">
                                                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-700/50 flex justify-center mt-auto">
                                <button className="btn-secondary-glossy px-6 py-2 text-xs font-semibold">
                                    Ler mais perguntas
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1 flex flex-col gap-6">
                        <div className="skeuo-card p-6 flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                                <FaServer size={14} className="text-blue-500" />
                                <h3 className="text-[14px] font-bold admin-hero-title">Status dos Servidores</h3>
                            </div>

                            <div className="skeuo-well p-4 rounded-xl my-3 flex flex-col gap-3">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700/50">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-bold admin-hero-title">Sistema Geral</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">Operacional</span>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between px-2">
                                    <div className="flex flex-col items-center">
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Ping Média</span>
                                        <span className="text-[13px] font-bold text-blue-600 dark:text-blue-400">42ms</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Uptime</span>
                                        <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">99.9%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full text-center border-t border-slate-200/60 dark:border-slate-700/50 pt-3">
                                <span className="text-[11px] text-slate-500 dark:text-slate-400">Versão: 6.12.0</span>
                            </div>
                        </div>

                        <div className="skeuo-card p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <FaBan size={14} className="text-gray-400" />
                                    <h3 className="text-[14px] font-bold admin-hero-title">Transparência</h3>
                                </div>
                                <span className="text-[11px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500 dark:text-slate-400 font-medium">
                                    Últimas 24h
                                </span>
                            </div>
                            <p className="text-[12px] text-slate-500 dark:text-slate-400">
                                Salas banidas recentemente por violação dos termos.
                            </p>

                            <div className="flex flex-col gap-1 mt-1">
                                {bannedRooms.map((room, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 my-2">
                                        <div className="flex items-center gap-2">
                                            <FaBan size={12} className="text-rose-500" />
                                            <span className="text-[13px] font-medium admin-table-text">{room.name}</span>
                                        </div>
                                        <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 bg-white/70 dark:bg-slate-900/60 px-2.5 py-1 rounded-md border border-rose-200/60 dark:border-rose-900/40">
                                            {room.reason}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full max-w-4xl mx-auto my-8">
                    <div className="skeuo-card p-6 flex flex-col gap-4">
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
                                className="skeuo-input w-full p-3 text-sm rounded-xl"
                                placeholder="ID do Usuário ou Sala"
                            />
                            <textarea
                                className="skeuo-input w-full p-3 text-sm rounded-xl min-h-[80px] resize-none"
                                placeholder="Descreva o motivo da denúncia..."
                            ></textarea>
                            <button className="btn-secondary-glossy w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 mt-2">
                                Enviar Denúncia Anonimamente
                            </button>
                        </div>
                    </div>
                </div>

                <div className="skeuo-card max-w-2xl mx-auto p-8 text-center mb-8 flex flex-col items-center">
                    <h3 className="text-[16px] font-bold admin-hero-title mb-2">Ainda precisa de ajuda?</h3>
                    <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-md mb-6">
                        Nossa equipe de suporte está disponível para resolver problemas complexos.
                    </p>
                    <button className="skeuo-btn-primary px-8 py-3 text-sm font-semibold text-white inline-flex items-center gap-2">
                        <FaHeadset size={14} /> Abrir Ticket de Suporte
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Suporte;

