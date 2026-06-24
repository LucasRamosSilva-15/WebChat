import React, { useState } from 'react';
import {
    FaSearch, FaRocket, FaUser, FaShieldAlt, FaCog, FaServer,
    FaQuestionCircle, FaChevronDown, FaChevronUp, FaExclamationCircle,
    FaBan, FaLifeRing, FaHeadset
} from 'react-icons/fa';
import '../styles/suporte.css';

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
        <div className="flex-1 w-full flex flex-col items-center suporte-page-bg">
            <div className="w-full max-w-[1000px] px-4 py-8 md:py-12 animate-fade-in-up-1">

                <div className="flex flex-col items-center text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full suporte-badge-blue border mb-4">
                        <FaLifeRing size={12} className="suporte-icon-blue" />
                        <span className="text-[11px] font-bold suporte-icon-blue uppercase tracking-wide">
                            Suporte ao Usuário (Em Desenvolvimento)
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold admin-hero-title suporte-blue-title mb-2">Central de Ajuda & Suporte</h1>
                    <p className="text-[14px] suporte-text-muted max-w-lg mb-8">
                        Encontre respostas, relate problemas e aprenda a usar o SkyRipple.
                    </p>

                    <div className="suporte-search-container flex items-center w-full max-w-2xl relative">
                        <FaSearch className="suporte-search-icon" />
                        <input
                            type="text"
                            placeholder="Como podemos ajudar hoje?"
                            className="suporte-search-input"
                        />
                        <button className="skeuo-btn absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-1.5 text-[13px]">
                            Buscar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="suporte-category-card flex flex-col items-center text-center p-6">
                        <div className="w-12 h-12 rounded-full suporte-icon-box flex items-center justify-center mb-4">
                            <FaRocket size={20} className="suporte-icon-indigo" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Primeiros Passos</h3>
                        <p className="text-[12px] suporte-text-muted">Guia básico para novos usuários.</p>
                    </div>

                    <div className="suporte-category-card flex flex-col items-center text-center p-6">
                        <div className="w-12 h-12 rounded-full suporte-icon-box flex items-center justify-center mb-4">
                            <FaUser size={20} className="suporte-icon-cyan" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Minha Conta</h3>
                        <p className="text-[12px] suporte-text-muted">Problemas de login e senha.</p>
                    </div>

                    <div className="suporte-category-card flex flex-col items-center text-center p-6">
                        <div className="w-12 h-12 rounded-full suporte-icon-box flex items-center justify-center mb-4">
                            <FaShieldAlt size={20} className="suporte-icon-rose" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Segurança & Privacidade</h3>
                        <p className="text-[12px] suporte-text-muted">Denúncias e bloqueios.</p>
                    </div>

                    <div className="suporte-category-card flex flex-col items-center text-center p-6">
                        <div className="w-12 h-12 rounded-full suporte-icon-box flex items-center justify-center mb-4">
                            <FaCog size={20} className="suporte-icon-blue" />
                        </div>
                        <h3 className="text-[14px] font-bold admin-hero-title mb-1">Problemas Técnicos</h3>
                        <p className="text-[12px] suporte-text-muted">Bugs e erros de conexão.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">

                    <div className="md:col-span-4 flex flex-col gap-6">

                        <div className="skeuo-panel p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaServer size={14} className="suporte-icon-blue" />
                                <h3 className="text-[14px] font-bold admin-hero-title">Status dos Servidores</h3>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-xl suporte-status-box border">
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold admin-hero-title">Sistema Geral</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[12px] font-bold suporte-icon-emerald">Operacional</span>
                                    <div className="suporte-status-dot"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 px-2">
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] suporte-text-muted">Ping Média</span>
                                    <span className="text-[13px] font-bold suporte-stats-blue">42ms</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="text-[11px] suporte-text-muted">Uptime</span>
                                    <span className="text-[13px] font-bold suporte-stats-emerald">99.9%</span>
                                </div>
                            </div>

                            <div className="w-full text-center mt-2 border-t suporte-border-top pt-3">
                                <span className="text-[11px] suporte-text-muted">Versão: 6.12.0</span>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-2 mb-1">
                                <FaExclamationCircle size={14} className="suporte-icon-rose" />
                                <h3 className="text-[14px] font-bold admin-hero-title">Relatar Usuário ou Sala</h3>
                            </div>
                            <p className="text-[12px] suporte-text-muted">
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
                                <button className="btn-secondary-glossy py-2.5 text-[13px] font-bold suporte-btn-text w-full mt-2">
                                    Enviar Denúncia Anonimamente
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 flex flex-col gap-6">

                        <div className="skeuo-panel p-0 flex flex-col overflow-hidden">
                            <div className="p-5 border-b suporte-border-bottom flex items-center gap-2">
                                <FaQuestionCircle size={15} className="suporte-icon-teal" />
                                <h3 className="text-[15px] font-bold admin-hero-title">Perguntas Frequentes</h3>
                            </div>

                            <div className="flex flex-col">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="suporte-faq-item flex flex-col">
                                        <button
                                            onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                                            className="suporte-faq-header flex items-center justify-between p-4 md:px-6 w-full text-left"
                                        >
                                            <span className={`text-[13px] font-bold ${faqOpen === idx ? 'suporte-faq-active-text' : 'admin-table-text'}`}>
                                                {faq.question}
                                            </span>
                                            {faqOpen === idx ? (
                                                <FaChevronUp size={12} className="suporte-faq-active-text" />
                                            ) : (
                                                <FaChevronDown size={12} className="suporte-text-muted" />
                                            )}
                                        </button>

                                        {faqOpen === idx && (
                                            <div className="suporte-faq-content p-4 md:px-6 animate-fade-in">
                                                <p className="text-[13px] suporte-text-muted leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t suporte-border-top flex justify-center">
                                <button className="btn-secondary-glossy px-6 py-2 text-[13px] font-bold suporte-btn-text">
                                    Ler mais perguntas
                                </button>
                            </div>
                        </div>

                        <div className="skeuo-panel p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                    <FaBan size={14} className="suporte-icon-gray" />
                                    <h3 className="text-[14px] font-bold admin-hero-title">Transparência</h3>
                                </div>
                                <span className="text-[11px] px-2 py-1 suporte-badge-gray rounded-md suporte-text-muted">
                                    Últimas 24h
                                </span>
                            </div>
                            <p className="text-[12px] suporte-text-muted">
                                Salas banidas recentemente por violação dos termos.
                            </p>

                            <div className="flex flex-col gap-2 mt-2">
                                {bannedRooms.map((room, idx) => (
                                    <div key={idx} className="suporte-banned-item flex items-center justify-between p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <FaBan size={12} className="suporte-icon-red" />
                                            <span className="text-[13px] font-medium admin-table-text">{room.name}</span>
                                        </div>
                                        <span className="text-[11px] suporte-text-muted">{room.reason}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="skeuo-panel p-8 flex flex-col items-center text-center mb-8 suporte-bottom-panel">
                    <h3 className="text-[16px] font-bold admin-hero-title mb-2">Ainda precisa de ajuda?</h3>
                    <p className="text-[13px] suporte-text-muted max-w-md mb-6">
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
