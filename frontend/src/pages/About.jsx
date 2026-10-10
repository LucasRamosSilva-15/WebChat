import React from 'react';
import { Link } from 'react-router-dom';
import { FaCloud, FaGraduationCap, FaServer, FaUsers, FaPaperPlane, FaCity, FaComments, FaComment, FaPencilRuler } from 'react-icons/fa';

const InfoCard = ({ title, description, icon: Icon, delay }) => (
    <div
        className="skeuo-card p-6 flex flex-col justify-between text-left animate-fade-in-up"
        style={{ animationDelay: delay }}
    >
        <div>
            <div className="skeuo-surface-orb-badge w-12 h-12 flex items-center justify-center mb-6 shrink-0">
                <Icon size={22} className="text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="font-bold text-[#1d1d1f] dark:text-[#f8fafc] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_0_rgba(0,0,0,0.8)] mb-3 text-[18px]">{title}</h3>
            <p className="text-[#424245] dark:text-[#94a3b8] leading-relaxed text-[14px]">{description}</p>
        </div>
    </div>
);

const About = () => {
    return (
        <main className="reveal flex-1 flex flex-col items-center py-12 px-4 sm:px-6 md:py-20 relative overflow-hidden">
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] pointer-events-none rounded-full blur-3xl bg-sky-200/20 dark:bg-sky-950/10"></div>
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] pointer-events-none rounded-full blur-3xl bg-blue-200/20 dark:bg-blue-950/10"></div>

            <section className="w-full max-w-[1100px] mb-24 relative z-10">
                <div className="skeuo-panel rounded-[32px] md:rounded-[40px] bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
                    <div className="text-left flex-1 mx-auto lg:mx-0 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-sky-700 bg-gradient-to-b from-sky-100 to-sky-200/80 border border-sky-300/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,113,227,0.08)] mb-4">
                            <span className="text-sky-600"><FaGraduationCap size={12} /></span>
                            PROJETO ACADÊMICO
                        </span>
                        <h1 className="font-bold text-[#1d1d1f] dark:text-[#f8fafc] tracking-tight drop-shadow-[0_2px_0_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] mb-6 leading-tight text-[40px] md:text-[50px]">
                            Deixe seus pensamentos <span className="text-[#0284c7] dark:text-[#38bdf8] drop-shadow-[0_1px_1px_rgba(255,255,255,1)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] relative z-10 inline-block">fluírem livremente.</span>
                        </h1>
                        <p className="text-[17px] leading-relaxed mb-8 text-[#424245] dark:text-[#94a3b8]">
                            O SkyRipple é uma aplicação de chat em tempo real desenvolvida para explorar salas de conversa, mensagens instantâneas via WebSocket e uma interface agradável inspirada na estética clássica da web.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                            <Link to="/rooms" className="skeuo-btn-primary px-6 py-2.5 text-sm font-semibold text-white flex items-center justify-center">
                                Começar agora
                            </Link>
                            <Link to="/" className="btn-secondary-glossy px-6 py-2.5 text-sm font-medium flex items-center justify-center">
                                Saiba mais
                            </Link>
                        </div>
                    </div>

                    <div className="[perspective:1000px] flex-1 w-full max-w-[450px] mx-auto relative z-10">
                        <div className="absolute inset-0 scale-105 bg-gradient-to-tr from-sky-300/30 to-blue-400/20 rounded-3xl blur-[40px]"></div>
                        <div className="skeuo-card overflow-hidden relative z-10 scale-100 hover:scale-[1.02] transition-transform duration-500">
                            <div className="px-5 py-4 flex items-center gap-3 border-b border-[#d2d2d7] dark:border-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-slate-800 dark:to-slate-900">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-b from-[#38bdf8] to-[#0284c7] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]">
                                    <FaCity size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[15px] text-[#1d1d1f] dark:text-[#f8fafc]">Campina Grande</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                                        <span className="text-[11px] text-[#86868b] dark:text-[#94a3b8]">158 pessoas online</span>
                                    </div>
                                </div>
                                <div className="ml-auto flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]"></div>
                                </div>
                            </div>

                            <div className="bg-[#f8fafc] dark:bg-[#020617] p-5 min-h-[250px] flex flex-col justify-end gap-4 relative">
                                <div className="absolute inset-0 pointer-events-none opacity-10 dark:opacity-5 [background-image:radial-gradient(#64748b_1.2px,transparent_1.2px)] [background-size:20px_20px]"></div>

                                <div className="self-start max-w-[85%] p-3 relative z-10 text-sm bg-white/90 dark:bg-slate-800/90 text-[#1d1d1f] dark:text-[#f8fafc] rounded-2xl rounded-tl-xs border border-slate-200/80 dark:border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                                    <p>O clima em Campina Grande está quente hoje</p>
                                </div>

                                <div className="self-end max-w-[85%] p-3 relative z-10 text-sm bg-gradient-to-b from-sky-400 to-sky-600 text-white rounded-2xl rounded-tr-xs shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_4px_rgba(0,113,227,0.25)]">
                                    <p>Concordo</p>
                                    <span className="block text-right mt-1 text-[10px] text-sky-100 opacity-90">Entregue</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2 relative z-10">
                                    <span className="text-[#0ea5e9] dark:text-[#38bdf8] font-medium text-[11px] flex items-center gap-1.5 animate-pulse">
                                        <FaComments size={10} /> Gabriel está digitando...
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 flex items-center gap-2 relative z-10 bg-white dark:bg-slate-800 border-t border-[#d2d2d7] dark:border-white/5">
                                <input
                                    type="text"
                                    placeholder="Enviar uma mensagem..."
                                    readOnly
                                    className="skeuo-input flex-1 px-4 py-2 text-sm rounded-full"
                                />
                                <div className="skeuo-icon-btn w-9 h-9 shrink-0 cursor-pointer -rotate-12 hover:scale-105 transition-all">
                                    <FaPaperPlane size={12} className="ml-[-2px] mt-[2px] text-sky-600 dark:text-sky-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-[1000px] text-center mb-24 relative z-10">
                <div className="skeuo-card p-8 max-w-2xl mx-auto text-center my-12">
                    <h2 className="font-bold text-[#1d1d1f] dark:text-[#f8fafc] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_0_rgba(0,0,0,0.8)] mb-3 text-[28px] md:text-[36px]">
                        Projetado para criar atmosfera
                    </h2>
                    <p className="text-[#6e6e73] dark:text-[#94a3b8] max-w-[500px] mx-auto text-base">
                        Experimente um ambiente de conversa onde a tecnologia parece leve, orgânica e tangível.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    <InfoCard
                        icon={FaComments}
                        title="Salas de conversa fluidas"
                        description="Salas criadas para conversas em tempo real, onde os usuários podem entrar em espaços e trocar mensagens instantaneamente."
                        delay="0s"
                    />
                    <InfoCard
                        icon={FaCloud}
                        title="Sincronia em tempo real"
                        description="Construído com comunicação via WebSocket (Socket.IO), permitindo que mensagens e atualizações apareçam sem recarregar a página."
                        delay="0.1s"
                    />
                    <InfoCard
                        icon={FaPencilRuler}
                        title="Visual clássico e tátil"
                        description="O SkyRipple usa uma interface inspirada na web dos anos 2000, com botões em relevo, cartões com profundidade, sombras suaves e detalhes skeuomórficos que deixam a navegação mais física e menos genérica."
                        delay="0.2s"
                    />
                    <InfoCard
                        icon={FaServer}
                        title="Infraestrutura Robusta"
                        description="O SkyRipple utiliza Node.js, React, Express e PostgreSQL (via Supabase) para garantir armazenamento seguro e gerenciamento persistente das salas."
                        delay="0.3s"
                    />
                    <InfoCard
                        icon={FaUsers}
                        title="A Equipe"
                        description="Este projeto foi idealizado e desenvolvido por Lucas Ramos Silva, Wssihélio Vasconcelos, Ruan Victor e Gabriel Lobão."
                        delay="0.4s"
                    />
                    <InfoCard
                        icon={FaGraduationCap}
                        title="Base Acadêmica"
                        description="Criado como projeto acadêmico para a disciplina de Web 2, ministrada pelo professor Wemerson Thayne no IFPB — Campus Campina Grande."
                        delay="0.5s"
                    />
                </div>
            </section>

            <section className="w-full max-w-[980px] mb-12 relative z-10 mx-auto">
                <div className="skeuo-card overflow-hidden relative p-12 md:p-16 text-center">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-transparent opacity-50"></div>
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-sky-100/30 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-sky-100/50 dark:from-sky-900/20 to-transparent"></div>

                    <div className="skeuo-surface-orb-badge w-16 h-16 mx-auto flex items-center justify-center mb-6 relative z-10">
                        <FaComment size={28} className="text-sky-600 dark:text-sky-400" />
                    </div>

                    <h2 className="font-bold text-[#1d1d1f] dark:text-[#f8fafc] drop-shadow-[0_2px_0_rgba(255,255,255,0.8)] dark:drop-shadow-[0_2px_0_rgba(0,0,0,0.8)] mb-4 relative z-10 text-[36px] md:text-[44px]">
                        Pronto para conversar?
                    </h2>

                    <p className="text-[#424245] dark:text-[#94a3b8] mb-10 max-w-[500px] mx-auto relative z-10 text-[17px]">
                        Entre e encontre seu espaço para conversar com a sua comunidade.
                    </p>

                    <div className="relative z-10">
                        <Link to="/rooms" className="skeuo-btn-primary px-8 py-3 text-sm font-semibold text-white inline-flex items-center gap-2">
                            Criar meu espaço
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
