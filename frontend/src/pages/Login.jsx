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
        <main className="reveal auth-page">
            <div className="skeuo-card auth-panel auth-panel-login">
                <h1 className="hero-title auth-title">
                    Entre na sua conta
                </h1>
                <p className="auth-subtitle">
                    Digite os dados da sua conta
                </p>
                <form className="auth-form auth-form-login" onSubmit={handleLogin}>
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}
                    <div className="input-group">
                        <input type="email" id="email" placeholder="E-mail" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="skeuo-input auth-input" />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="skeuo-input auth-input" />
                    </div>
                    <button type="submit" className="skeuo-btn auth-submit auth-submit-login" disabled={loading}>
                        {loading ? 'Entrando...' : 'Continuar'}
                    </button>

                    <div className="auth-divider">
                        <div className="auth-divider-line"></div>
                        <span className="auth-divider-text">ou continue com</span>
                        <div className="auth-divider-line"></div>
                    </div>

                    <button
                        type="button"
                        className="btn-secondary-glossy auth-secondary-btn"
                        disabled
                    >
                        <FcGoogle className="auth-icon" />
                        Entrar com Google (Em breve)
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/register" className="auth-link">
                        Ainda não tem uma conta? Crie a sua aqui ›
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Login;
