import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

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
            <div className="skeuo-card p-10 max-w-[400px] w-full text-center">
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
                        className="btn-secondary-glossy w-full py-3 text-[15px] font-medium flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                        disabled
                    >
                        <FcGoogle className="w-5 h-5 shrink-0" />
                        Entrar com Google (Em breve)
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
