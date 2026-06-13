import React from 'react';
import { Link } from 'react-router-dom';
import { FaCloud, FaGraduationCap, FaServer, FaUsers, FaPaperPlane, FaCity, FaComments, FaComment, FaPencilRuler } from 'react-icons/fa';

const InfoCard = ({ title, description, icon: Icon, delay }) => (
    <div className={`skeuo-panel p-8 h-full flex flex-col items-start text-left bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm border border-white dark:border-white/10 shadow-[0_8px_25px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1),inset_0_0_20px_rgba(255,255,255,0.5)] dark:shadow-[0_8px_25px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.05)] animate-fade-in-up`} style={{ animationDelay: delay }}>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-sky-100 to-white dark:from-sky-900 dark:to-slate-800 text-sky-500 flex items-center justify-center mb-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.05)] border border-sky-100 dark:border-sky-800">
            <Icon size={24} />
        </div>
        <h3 className="text-[20px] font-bold text-[#1d1d1f] dark:text-[#f8fafc] mb-3 text-shadow-[0_1px_0_rgba(255,255,255,0.8)] dark:text-shadow-[0_1px_0_rgba(0,0,0,0.8)]">{title}</h3>
        <p className="text-[15px] text-[#424245] dark:text-[#94a3b8] leading-relaxed flex-grow">{description}</p>
    </div>
);

const About = () => {
    return (
        <main className="reveal flex-grow flex flex-col items-center px-4 sm:px-6 py-12 md:py-20 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sky-200/20 dark:bg-sky-900/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>

            <section className="max-w-[1100px] w-full mb-24 relative z-10">
                <div className="skeuo-panel p-8 md:p-12 bg-white/70 dark:bg-[#1e293b]/70 backdrop-blur-md border border-white/80 dark:border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] rounded-[32px] md:rounded-[40px] flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
                    <div className="text-left flex-1 mx-auto lg:mx-0 relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[11px] font-bold uppercase tracking-widest mb-6 border border-sky-100/50 dark:border-sky-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-none">
                            <FaGraduationCap size={12} />
                            Projeto Acadêmico
                        </div>
                        <h1 className="text-[40px] md:text-[50px] font-bold text-[#1d1d1f] dark:text-[#f8fafc] mb-6 leading-[1.15] tracking-tight text-shadow-[0_2px_0_rgba(255,255,255,0.8)] dark:text-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                            Deixe seus pensamentos <span className="text-[#0284c7] dark:text-[#38bdf8] [text-shadow:0_1px_1px_rgba(255,255,255,1)] dark:[text-shadow:0_2px_4px_rgba(0,0,0,0.6)] relative z-10 inline-block">fluírem livremente.</span>
                        </h1>
                        <p className="text-[17px] text-[#424245] dark:text-[#94a3b8] leading-relaxed mb-8">
                            O SkyRipple é uma aplicação de chat em tempo real desenvolvida para explorar salas de conversa, mensagens instantâneas via WebSocket e uma interface agradável inspirada na estética clássica da web.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link to="/rooms" className="skeuo-btn flex items-center justify-center min-h-[48px] min-w-[160px] px-8 text-[15px] w-full sm:w-auto rounded-full">
                                Começar agora
                            </Link>
                            <Link to="/" className="btn-secondary-glossy flex items-center justify-center min-h-[48px] min-w-[160px] px-8 text-[15px] font-medium text-[#1d1d1f] dark:text-white bg-white dark:bg-[#1e293b] rounded-full border border-black/5 dark:border-white/5 shadow-[0_2px_5px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.8)] w-full sm:w-auto">
                                Saiba mais
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-[450px] mx-auto perspective-1000 relative z-10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-sky-300/30 to-blue-400/20 rounded-3xl blur-2xl transform scale-105"></div>
                        <div className="skeuo-panel p-0 overflow-hidden relative z-10 transform transition-transform hover:scale-[1.02] duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,1)]">
                            <div className="px-5 py-4 border-b border-[#d2d2d7] dark:border-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a] flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]">
                                    <FaCity size={18} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#1d1d1f] dark:text-[#f8fafc] text-[15px]">Campina Grande</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                                        <span className="text-[11px] text-[#86868b]">158 exploradores online</span>
                                    </div>
                                </div>
                                <div className="ml-auto flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-rose-400 shadow-inner"></div>
                                    <div className="w-2 h-2 rounded-full bg-amber-400 shadow-inner"></div>
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-inner"></div>
                                </div>
                            </div>

                            <div className="p-5 bg-[#f8fafc] dark:bg-[#020617] min-h-[250px] flex flex-col justify-end gap-4 relative">
                                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                                <div className="self-start max-w-[85%] bg-white dark:bg-[#1e293b] p-3.5 rounded-2xl rounded-tl-sm border border-black/5 dark:border-white/5 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] relative z-10">
                                    <p className="text-[14px] text-[#1d1d1f] dark:text-[#f8fafc]"> O clima em Campina Grande está quente hoje</p>
                                </div>

                                <div className="self-end max-w-[85%] bg-gradient-to-b from-sky-400 to-sky-600 text-white p-3.5 rounded-2xl rounded-tr-sm shadow-[0_4px_12px_rgba(14,165,233,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] text-shadow-[0_-1px_0_rgba(0,0,0,0.2)] relative z-10">
                                    <p className="text-[14px]">Concordo</p>
                                    <span className="block text-right text-[10px] text-sky-100 mt-1 opacity-80">Entregue</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[11px] text-sky-500 font-medium animate-pulse flex items-center gap-1">
                                        <FaComments size={10} /> Gabriel está digitando...
                                    </span>
                                </div>
                            </div>

                            <div className="p-3 bg-white dark:bg-[#1e293b] border-t border-[#d2d2d7] dark:border-white/5 flex gap-2">
                                <div className="skeuo-input flex-1 bg-[#f4f5f7] dark:bg-[#0f172a] rounded-full px-4 py-2 text-[13px] text-[#86868b] flex items-center">
                                    Enviar uma mensagem...
                                </div>
                                <div className="w-9 h-9 rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] transform -rotate-12">
                                    <FaPaperPlane size={12} className="ml-[-2px] mt-[2px]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-[1000px] w-full text-center mb-24 relative z-10">
                <div className="inline-block skeuo-panel px-8 py-6 mb-12 bg-white/60 dark:bg-[#1e293b]/60 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-[0_8px_20px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] rounded-3xl">
                    <h2 className="text-[28px] md:text-[36px] font-bold text-[#1d1d1f] dark:text-[#f8fafc] mb-3 text-shadow-[0_1px_0_rgba(255,255,255,0.8)] dark:text-shadow-[0_1px_0_rgba(0,0,0,0.8)]">
                        Projetado para criar atmosfera
                    </h2>
                    <p className="text-[16px] text-[#6e6e73] dark:text-[#94a3b8] max-w-[500px] mx-auto">
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

            <section className="w-full max-w-[980px] mb-12 relative z-10">
                <div className="skeuo-panel overflow-hidden relative bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-xl p-12 md:p-16 text-center border border-white dark:border-white/10 shadow-[0_20px_50px_rgba(0,113,227,0.08),inset_0_1px_0_rgba(255,255,255,1),inset_0_0_30px_rgba(255,255,255,0.5)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-sky-300 to-transparent opacity-50"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-100/30 to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sky-100/50 to-transparent dark:from-sky-900/20 pointer-events-none"></div>

                    <div className="w-16 h-16 mx-auto rounded-2xl bg-white dark:bg-slate-800 text-sky-500 flex items-center justify-center mb-6 shadow-[0_4px_15px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] border border-black/5 dark:border-white/10 relative z-10">
                        <FaComment size={32} />
                    </div>

                    <h2 className="text-[36px] md:text-[44px] font-bold text-[#1d1d1f] dark:text-[#f8fafc] mb-4 relative z-10 text-shadow-[0_2px_0_rgba(255,255,255,0.8)] dark:text-shadow-[0_2px_0_rgba(0,0,0,0.8)]">
                        Pronto para conversar?
                    </h2>

                    <p className="text-[17px] text-[#424245] dark:text-[#94a3b8] mb-10 max-w-[500px] mx-auto relative z-10">
                        Entre e encontre seu espaço para conversar com a sua comunidade.
                    </p>

                    <div className="relative z-10">
                        <Link to="/rooms" className="skeuo-btn px-10 py-4 text-[17px] inline-flex items-center gap-2 shadow-[0_4px_10px_rgba(0,113,227,0.3)]">
                            Criar meu espaço
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
