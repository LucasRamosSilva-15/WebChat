import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { FcGoogle } from 'react-icons/fc';
import { FaTimes, FaCloud } from 'react-icons/fa';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../socket';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [termsModalType, setTermsModalType] = useState('terms');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (!termsAccepted || !privacyAccepted) {
            setError("Você deve concordar com os Termos de Uso e a Política de Privacidade para continuar.");
            return;
        }

        if (username.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
            setLoading(true);
            try {
                const data = await apiRequest('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ name: username, email, password })
                });

                setAuthToken(data.token);
                localStorage.setItem('chat_isLoggedIn', 'true');
                localStorage.setItem('chat_displayName', data.user.name);
                localStorage.setItem('chat_uniqueUserId', data.user.id);

                socket.disconnect();
                socket.connect();

                window.dispatchEvent(new Event('profileUpdated'));
                navigate('/rooms');
            } catch (err) {
                setError(err.message || 'Erro ao criar conta.');
            } finally {
                setLoading(false);
            }
        }
    };
    return (
        <main className="reveal auth-page auth-page-register flex-1 flex items-center justify-center px-6 py-12">
            <div className="skeuo-card auth-panel auth-panel-register p-10 w-full text-center max-w-[500px]">
                <h1 className="hero-title auth-title text-[40px] mb-2">
                    Crie sua conta
                </h1>
                <p className="auth-subtitle text-[17px] mb-10">
                    Preencha os dados para criar sua conta.
                </p>

                <form className="auth-form auth-form-register text-left space-y-4" onSubmit={handleRegister}>
                    {error && (
                        <div className="auth-error p-3 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Nome de usuário" required
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            className="skeuo-input auth-input w-full px-4 py-3" />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" placeholder="E-mail" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="skeuo-input auth-input w-full px-4 py-3" />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Senha" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="skeuo-input auth-input w-full px-4 py-3" />
                    </div>

                    <div className="flex flex-col gap-3 mt-4 text-left">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input type="checkbox" className="appearance-none w-5 h-5 border border-[#c7c7cc] dark:border-[#38383a] rounded bg-white dark:bg-[#1c1c1e] checked:bg-[#0071e3] checked:border-[#0071e3] transition-colors cursor-pointer"
                                    checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                                {termsAccepted && <svg className="absolute w-3 h-3 text-white pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <span className="text-[13px] text-[#86868b] dark:text-[#94a3b8] group-hover:text-[#1d1d1f] dark:group-hover:text-white transition-colors">
                                Li e concordo com os <button type="button" onClick={(e) => { e.preventDefault(); setTermsModalType('terms'); setShowTermsModal(true); }} className="text-[#0071e3] hover:underline">Termos de Uso</button>
                            </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input type="checkbox" className="appearance-none w-5 h-5 border border-[#c7c7cc] dark:border-[#38383a] rounded bg-white dark:bg-[#1c1c1e] checked:bg-[#0071e3] checked:border-[#0071e3] transition-colors cursor-pointer"
                                    checked={privacyAccepted} onChange={(e) => setPrivacyAccepted(e.target.checked)} />
                                {privacyAccepted && <svg className="absolute w-3 h-3 text-white pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L5 9L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <span className="text-[13px] text-[#86868b] dark:text-[#94a3b8] group-hover:text-[#1d1d1f] dark:group-hover:text-white transition-colors">
                                Li e concordo com a <button type="button" onClick={(e) => { e.preventDefault(); setTermsModalType('privacy'); setShowTermsModal(true); }} className="text-[#0071e3] hover:underline">Política de Privacidade</button>
                            </span>
                        </label>
                    </div>

                    <button type="submit" className="skeuo-btn auth-submit auth-submit-register w-full py-3 text-[17px] mt-6" disabled={loading || !termsAccepted || !privacyAccepted}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>

                    <div className="auth-divider flex items-center mt-8 mb-6">
                        <div className="auth-divider-line flex-1"></div>
                        <span className="auth-divider-text px-4 text-xs uppercase">ou continue com</span>
                        <div className="auth-divider-line flex-1"></div>
                    </div>

                    <button
                        type="button"
                        className="btn-secondary-glossy auth-secondary-btn w-full py-3 text-[15px] flex items-center justify-center gap-3"
                        disabled
                    >
                        <FcGoogle className="auth-icon w-5 h-5 shrink-0" />
                        Cadastrar com Google (Em breve)
                    </button>
                </form>

                <div className="auth-footer mt-8">
                    <Link to="/login" className="auth-link text-sm">
                        Já tem uma conta? Entrar ›
                    </Link>
                </div>
            </div>

            {showTermsModal && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 admin-modal-overlay-dark animate-fade-in-up-1" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
                    <div className="skeuo-panel w-full max-w-4xl p-6 flex flex-col gap-4 shadow-2xl relative admin-modal-panel">
                        <button
                            onClick={() => setShowTermsModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors z-10"
                        >
                            <FaTimes size={18} />
                        </button>

                        <div className="flex items-center gap-3 border-b admin-border-muted pb-4">
                            <div>
                                <h3 className="text-[18px] font-bold admin-hero-title">
                                    {termsModalType === 'terms' ? 'Termos de Uso' : 'Política de Privacidade'}
                                </h3>
                                <p className="text-[12px] admin-text-muted">Última atualização: Hoje</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 h-[50vh] min-h-[300px] overflow-y-auto pr-2 chat-container text-left text-[14px] text-[#1d1d1f] dark:text-gray-200 leading-relaxed">
                            <p>
                                <strong>1. Introdução</strong><br />
                                Este é um texto provisório para exemplificar o conteúdo e que só está aqui de exemplo (no futuro vamos mudar tudo que está escrito aqui). Ao utilizar nossos serviços, você concorda com todas as regras aqui descritas.
                            </p>
                            <p>
                                <strong>2. Coleta de Dados</strong><br />
                                Coletamos informações necessárias para o funcionamento básico da aplicação(nome, email, senha). Nenhum dado sensível é compartilhado com terceiros sem a sua autorização explícita.
                            </p>
                            <p>
                                <strong>3. Responsabilidade do Usuário</strong><br />
                                O usuário compromete-se a não utilizar a plataforma para atividades ilegais, discursos de ódio ou qualquer comportamento que viole as leis vigentes.
                            </p>
                            <p>
                                <strong>4. Propriedade Intelectual</strong><br />
                                Todo o código, design e marca são de propriedade exclusiva. A cópia não autorizada pode resultar em suspensão da conta.
                            </p>
                            <p>
                                <strong>5. Alterações nos Termos</strong><br />
                                Reservamo-nos o direito de alterar este documento a qualquer momento. Você será notificado sobre mudanças significativas.
                            </p>
                            <p>
                                <strong>6. Mais Informações</strong><br />
                                Para criar mais texto e demonstrar a barra de rolagem (a rodinha direita puxando para baixo), estamos adicionando este parágrafo extra. Role para baixo para ver todo o conteúdo.
                                <br /><br />
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </main>
    );
};

export default Register;
