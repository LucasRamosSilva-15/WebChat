import React from 'react';
import { Link } from 'react-router-dom';
import { FaCloud, FaGraduationCap, FaServer, FaUsers, FaPaperPlane, FaCity, FaComments, FaComment, FaPencilRuler } from 'react-icons/fa';

const InfoCard = ({ title, description, icon: Icon, delay }) => (
    <div className={`skeuo-panel about-info-card animate-fade-in-up`} style={{ animationDelay: delay }}>
        <div className="about-info-icon">
            <Icon size={24} />
        </div>
        <h3 className="about-info-title">{title}</h3>
        <p className="about-info-description">{description}</p>
    </div>
);

const About = () => {
    return (
        <main className="reveal about-page">
            <div className="about-bg-orb-top"></div>
            <div className="about-bg-orb-bottom"></div>

            <section className="about-section">
                <div className="skeuo-panel about-hero-panel">
                    <div className="about-hero-content">
                        <div className="about-badge">
                            <FaGraduationCap size={12} />
                            Projeto Acadêmico
                        </div>
                        <h1 className="about-hero-title">
                            Deixe seus pensamentos <span className="about-hero-highlight">fluírem livremente.</span>
                        </h1>
                        <p className="about-hero-description">
                            O SkyRipple é uma aplicação de chat em tempo real desenvolvida para explorar salas de conversa, mensagens instantâneas via WebSocket e uma interface agradável inspirada na estética clássica da web.
                        </p>
                        <div className="about-actions">
                            <Link to="/rooms" className="skeuo-btn about-action-btn">
                                Começar agora
                            </Link>
                            <Link to="/" className="btn-secondary-glossy about-action-btn about-action-secondary">
                                Saiba mais
                            </Link>
                        </div>
                    </div>

                    <div className="about-preview">
                        <div className="about-preview-glow"></div>
                        <div className="skeuo-panel about-chat-window">
                            <div className="about-chat-topbar">
                                <div className="about-chat-room-icon">
                                    <FaCity size={18} />
                                </div>
                                <div>
                                    <h3 className="about-chat-room-title">Campina Grande</h3>
                                    <div className="about-chat-online-row">
                                        <span className="about-chat-status-dot"></span>
                                        <span className="about-chat-status-text">158 exploradores online</span>
                                    </div>
                                </div>
                                <div className="about-window-controls">
                                    <div className="about-window-dot about-window-dot-red"></div>
                                    <div className="about-window-dot about-window-dot-yellow"></div>
                                    <div className="about-window-dot about-window-dot-green"></div>
                                </div>
                            </div>

                            <div className="about-chat-body">
                                <div className="about-chat-pattern"></div>

                                <div className="about-message-incoming">
                                    <p> O clima em Campina Grande está quente hoje</p>
                                </div>

                                <div className="about-message-outgoing">
                                    <p>Concordo</p>
                                    <span className="about-message-time">Entregue</span>
                                </div>

                                <div className="about-typing">
                                    <span className="about-typing-text animate-pulse">
                                        <FaComments size={10} /> Gabriel está digitando...
                                    </span>
                                </div>
                            </div>

                            <div className="about-chat-inputbar">
                                <div className="skeuo-input about-chat-input">
                                    Enviar uma mensagem...
                                </div>
                                <div className="about-send-btn">
                                    <FaPaperPlane size={12} className="ml-[-2px] mt-[2px]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="about-section-heading">
                <div className="skeuo-panel about-section-heading-panel">
                    <h2 className="about-section-title">
                        Projetado para criar atmosfera
                    </h2>
                    <p className="about-section-subtitle">
                        Experimente um ambiente de conversa onde a tecnologia parece leve, orgânica e tangível.
                    </p>
                </div>

                <div className="about-info-grid">
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

            <section className="about-cta-section">
                <div className="skeuo-panel about-cta">
                    <div className="about-cta-line"></div>
                    <div className="about-cta-glow"></div>
                    <div className="about-cta-bottom-glow"></div>

                    <div className="about-cta-icon">
                        <FaComment size={32} />
                    </div>

                    <h2 className="about-cta-title">
                        Pronto para conversar?
                    </h2>

                    <p className="about-cta-subtitle">
                        Entre e encontre seu espaço para conversar com a sua comunidade.
                    </p>

                    <div className="relative z-10">
                        <Link to="/rooms" className="skeuo-btn about-cta-button">
                            Criar meu espaço
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default About;
