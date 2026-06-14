import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { apiRequest, setAuthToken } from '../services/api';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (email.trim() !== "" && password.trim() !== "") {
            setLoading(true);
            try {
                const data = await apiRequest('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                setAuthToken(data.token);
                localStorage.setItem('chat_isLoggedIn', 'true');
                localStorage.setItem('chat_displayName', data.user.name);
                localStorage.setItem('chat_uniqueUserId', data.user.id);
                
                window.dispatchEvent(new Event('profileUpdated'));
                navigate('/rooms');
            } catch (err) {
                setError(err.message || 'Erro ao fazer login.');
            } finally {
                setLoading(false);
            }
        }
    };
    return (
        <main className="reveal auth-page flex-1 flex items-center justify-center px-6">
            <div className="skeuo-card auth-panel auth-panel-login p-10 w-full text-center max-w-[400px]">
                <h1 className="hero-title auth-title text-[40px] mb-2">
                    Entre na sua conta
                </h1>
                <p className="auth-subtitle text-[17px] mb-10">
                    Digite os dados da sua conta
                </p>
                <form className="auth-form auth-form-login text-left space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="auth-error p-3 text-sm">
                            {error}
                        </div>
                    )}
                    <div className="input-group">
                        <input type="email" id="email" placeholder="E-mail" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="skeuo-input auth-input w-full px-4 py-3" />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="skeuo-input auth-input w-full px-4 py-3" />
                    </div>
                    <button type="submit" className="skeuo-btn auth-submit auth-submit-login w-full py-3 text-[17px] mt-4" disabled={loading}>
                        {loading ? 'Entrando...' : 'Continuar'}
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
                        Entrar com Google (Em breve)
                    </button>
                </form>

                <div className="auth-footer mt-8">
                    <Link to="/register" className="auth-link text-sm">
                        Ainda não tem uma conta? Crie a sua aqui ›
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Login;
