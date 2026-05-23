import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (username.trim() !== "" && password.trim() !== "") {
            localStorage.setItem('chat_isLoggedIn', 'true');
            localStorage.setItem('chat_displayName', username);
            window.dispatchEvent(new Event('profileUpdated'));
            navigate('/rooms');
        }
    };
    return (
        <main className="reveal flex-grow flex items-center justify-center px-6">
            <div className="skeuo-panel p-10 max-w-[400px] w-full text-center">
                <h1 className="hero-title text-[40px] font-semibold mb-2">
                    Entre na sua conta
                </h1>
                <p className="text-[17px] font-normal text-[#86868b] mb-10 tracking-tight">
                    Digite os dados da sua conta
                </p>
                <form className="space-y-6 text-left" onSubmit={handleLogin}>
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Username" required
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            className="skeuo-input w-full px-4 py-3" />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="skeuo-input w-full px-4 py-3" />
                    </div>
                    <button type="submit" className="skeuo-btn w-full py-3 text-[17px] mt-4">
                        Continuar
                    </button>

                    <div className="flex items-center mt-8 mb-6">
                        <div className="flex-grow border-t border-[#d2d2d7]"></div>
                        <span className="px-4 text-[12px] text-[#86868b] font-medium uppercase tracking-wider">ou continue com</span>
                        <div className="flex-grow border-t border-[#d2d2d7]"></div>
                    </div>

                    <button
                        type="button"
                        className="btn-white-glossy w-full py-3 text-[15px] font-medium flex items-center justify-center gap-3 cursor-pointer"
                        onClick={() => alert("Login com Google em desenvolvimento!")}
                    >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Entrar com Google
                    </button>
                </form>

                <div className="mt-8">
                    <Link to="/register" className="text-[14px] text-[#0066cc] hover:underline">
                        Ainda não tem uma conta? Crie a sua aqui ›
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Login;
