import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { apiRequest, setAuthToken } from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

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
        <main className="reveal auth-page auth-page-register">
            <div className="skeuo-card auth-panel auth-panel-register">
                <h1 className="hero-title auth-title">
                    Crie sua conta
                </h1>
                <p className="auth-subtitle">
                    Preencha os dados para criar sua conta.
                </p>
                
                <form className="auth-form auth-form-register" onSubmit={handleRegister}>
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Nome de usuário" required 
                               value={username} onChange={(e) => setUsername(e.target.value)}
                               className="skeuo-input auth-input" />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" placeholder="E-mail" required 
                               value={email} onChange={(e) => setEmail(e.target.value)}
                               className="skeuo-input auth-input" />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Senha" required 
                               value={password} onChange={(e) => setPassword(e.target.value)}
                               className="skeuo-input auth-input" />
                    </div>
                    
                    <button type="submit" className="skeuo-btn auth-submit auth-submit-register" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
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
                        Cadastrar com Google (Em breve)
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/login" className="auth-link">
                        Já tem uma conta? Entrar ›
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Register;
