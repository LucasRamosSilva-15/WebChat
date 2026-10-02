import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../socket';

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

                socket.auth = { token: data.token };
                socket.disconnect();
                socket.connect();

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
        <main className="reveal flex-1 flex items-center justify-center px-6">
            <div className="skeuo-card p-10 w-full text-center max-w-[400px]">
                <h1 className="hero-title font-semibold text-[40px] mb-2">
                    Entre na sua conta
                </h1>
                <p className="text-[#86868b] dark:text-[#94a3b8] font-normal text-[17px] mb-10 tracking-tight">
                    Digite os dados da sua conta
                </p>
                <form className="text-left space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="p-3 text-sm rounded-lg font-medium bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                            {error}
                        </div>
                    )}
                    <div>
                        <input type="email" id="email" placeholder="E-mail" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="skeuo-input w-full px-4 py-3" />
                    </div>
                    <div>
                        <input type="password" id="password" placeholder="Password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="skeuo-input w-full px-4 py-3" />
                    </div>
                    <button type="submit" className="skeuo-btn w-full py-3 text-[17px] mt-4" disabled={loading}>
                        {loading ? 'Entrando...' : 'Continuar'}
                    </button>

                    <div className="text-center mt-6">
                        <Link to="#" className="text-sm text-[#0066cc] dark:text-blue-400 hover:underline">
                            Esqueceu a senha? ›
                        </Link>
                    </div>

                    <div className="flex items-center mt-8 mb-6">
                        <div className="flex-1 border-t border-[#d2d2d7] dark:border-white/10"></div>
                        <span className="px-4 text-xs uppercase font-medium tracking-wider text-[#86868b] dark:text-[#94a3b8]">ou continue com</span>
                        <div className="flex-1 border-t border-[#d2d2d7] dark:border-white/10"></div>
                    </div>

                    <button
                        type="button"
                        className="btn-secondary-glossy w-full py-3 text-[15px] flex items-center justify-center gap-3 opacity-50 cursor-not-allowed font-medium"
                        disabled
                    >
                        <FcGoogle className="w-5 h-5 shrink-0" />
                        Entrar com Google (Em breve)
                    </button>
                </form>

                <div className="mt-8">
                    <Link to="/register" className="text-sm text-[#0066cc] dark:text-blue-400 hover:underline">
                        Ainda não tem uma conta? Crie a sua aqui ›
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Login;
