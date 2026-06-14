import React from 'react';
import { Link } from 'react-router-dom';
import { FaCloud, FaGraduationCap, FaServer, FaUsers, FaPaperPlane, FaCity, FaComments, FaComment, FaPencilRuler } from 'react-icons/fa';

const InfoCard = ({ title, description, icon: Icon, delay }) => (
    <div className={`skeuo-panel about-info-card p-8 h-full flex flex-col items-start text-left animate-fade-in-up`} style={{ animationDelay: delay }}>
        <div className="about-info-icon w-12 h-12 flex items-center justify-center mb-6">
            <Icon size={24} />
        </div>
        <h3 className="about-info-title mb-3 text-[20px]">{title}</h3>
        <p className="about-info-description flex-grow leading-relaxed text-[15px]">{description}</p>
    </div>
);

const About = () => {
    return (
        <main className="reveal about-page flex-1 flex flex-col items-center py-12 px-4 sm:px-6 md:py-20 relative overflow-hidden">
            <div className="about-bg-orb-top absolute -top-[10%] -left-[10%] w-[50%] h-[50%] pointer-events-none"></div>
            <div className="about-bg-orb-bottom absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] pointer-events-none"></div>

            <section className="about-section w-full max-w-[1100px] mb-24 relative z-10">
                <div className="skeuo-panel about-hero-panel p-8 md:p-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 relative z-10">
                    <div className="about-hero-content text-left flex-1 mx-auto lg:mx-0 relative z-10">
                        <div className="about-badge inline-flex items-center gap-2 px-3 py-1.5 mb-6 text-[11px]">
                            <FaGraduationCap size={12} />
                            Projeto Acadêmico
                        </div>
                        <h1 className="about-hero-title mb-6 leading-tight text-[40px] md:text-[50px]">
                            Deixe seus pensamentos <span className="about-hero-highlight relative z-10 inline-block">fluírem livremente.</span>
                        </h1>
                        <p className="about-hero-description text-[17px] leading-relaxed mb-8">
                            O SkyRipple é uma aplicação de chat em tempo real desenvolvida para explorar salas de conversa, mensagens instantâneas via WebSocket e uma interface agradável inspirada na estética clássica da web.
                        </p>
                        <div className="about-actions flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <Link to="/rooms" className="skeuo-btn about-action-btn flex items-center justify-center min-h-[48px] min-w-[160px] px-8 w-full sm:w-auto text-[15px]">
                                Começar agora
                            </Link>
                            <Link to="/" className="btn-secondary-glossy about-action-btn about-action-secondary flex items-center justify-center min-h-[48px] min-w-[160px] px-8 w-full sm:w-auto text-[15px]">
                                Saiba mais
                            </Link>
                        </div>
                    </div>

                    <div className="about-preview flex-1 w-full max-w-[450px] mx-auto relative z-10">
                        <div className="about-preview-glow absolute inset-0 scale-[1.05]"></div>
                        <div className="skeuo-panel about-chat-window p-0 overflow-hidden relative z-10 scale-100 hover:scale-[1.02] transition-transform duration-500">
                            <div className="about-chat-topbar px-5 py-4 flex items-center gap-3">
                                <div className="about-chat-room-icon w-10 h-10 flex items-center justify-center">
                                    <FaCity size={18} />
                                </div>
                                <div>
                                    <h3 className="about-chat-room-title text-[15px]">Campina Grande</h3>
                                    <div className="about-chat-online-row flex items-center gap-1.5 mt-0.5">
                                        <span className="about-chat-status-dot w-1.5 h-1.5"></span>
                                        <span className="about-chat-status-text text-[11px]">158 pessoas online</span>
                                    </div>
                                </div>
                                <div className="about-window-controls ml-auto flex gap-1">
                                    <div className="about-window-dot about-window-dot-red w-2 h-2"></div>
                                    <div className="about-window-dot about-window-dot-yellow w-2 h-2"></div>
                                    <div className="about-window-dot about-window-dot-green w-2 h-2"></div>
                                </div>
                            </div>

                            <div className="about-chat-body p-5 min-h-[250px] flex flex-col justify-end gap-4 relative">
                                <div className="about-chat-pattern absolute inset-0 pointer-events-none"></div>

                                <div className="about-message-incoming self-start max-w-[85%] p-3.5 relative z-10 text-sm">
                                    <p> O clima em Campina Grande está quente hoje</p>
                                </div>

                                <div className="about-message-outgoing self-end max-w-[85%] p-3.5 relative z-10 text-sm">
                                    <p>Concordo</p>
                                    <span className="about-message-time block text-right mt-1 text-[10px]">Entregue</span>
                                </div>

                                <div className="about-typing flex items-center gap-2 mt-2">
                                    <span className="about-typing-text animate-pulse flex items-center gap-1 text-[11px]">
                                        <FaComments size={10} /> Gabriel está digitando...
                                    </span>
                                </div>
                            </div>

                            <div className="about-chat-inputbar p-3 flex gap-2">
                                <div className="skeuo-input about-chat-input flex-1 px-4 py-2 flex items-center text-[13px]">
                                    Enviar uma mensagem...
                                </div>
                                <div className="about-send-btn w-9 h-9 flex items-center justify-center -rotate-12">
                                    <FaPaperPlane size={12} className="ml-[-2px] mt-[2px]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section-heading w-full max-w-[1000px] text-center mb-24 relative z-10">
                <div className="skeuo-panel about-section-heading-panel inline-block px-8 py-6 mb-12">
                    <h2 className="about-section-title mb-3 text-[28px] md:text-[36px]">
                        Projetado para criar atmosfera
                    </h2>
                    <p className="about-section-subtitle max-w-[500px] mx-auto text-base">
                        Experimente um ambiente de conversa onde a tecnologia parece leve, orgânica e tangível.
                    </p>
                </div>

                <div className="about-info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
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

            <section className="about-cta-section w-full max-w-[980px] mb-12 relative z-10 mx-auto">
                <div className="skeuo-panel about-cta overflow-hidden relative p-12 md:p-16 text-center">
                    <div className="about-cta-line absolute top-0 left-0 right-0 h-[2px]"></div>
                    <div className="about-cta-glow absolute inset-0 pointer-events-none"></div>
                    <div className="about-cta-bottom-glow absolute bottom-0 left-0 right-0 h-32 pointer-events-none"></div>

                    <div className="about-cta-icon w-16 h-16 mx-auto flex items-center justify-center mb-6 relative z-10">
                        <FaComment size={32} />
                    </div>

                    <h2 className="about-cta-title mb-4 relative z-10 text-[36px] md:text-[44px]">
                        Pronto para conversar?
                    </h2>

                    <p className="about-cta-subtitle mb-10 max-w-[500px] mx-auto relative z-10 text-[17px]">
                        Entre e encontre seu espaço para conversar com a sua comunidade.
                    </p>

                    <div className="relative z-10">
                        <Link to="/rooms" className="skeuo-btn about-cta-button px-10 py-4 inline-flex items-center gap-2 text-[17px]">
                            Criar meu espaço
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
