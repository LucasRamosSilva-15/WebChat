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
                    Acesse o WebChat
                </h1>
                <p className="text-[17px] font-normal text-[#86868b] mb-10 tracking-tight">
                    Insira seus detalhes abaixo
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
