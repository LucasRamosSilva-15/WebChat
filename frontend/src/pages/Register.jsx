import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = (e) => {
        e.preventDefault();
        if (username.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
            localStorage.setItem('chat_isLoggedIn', 'true');
            localStorage.setItem('chat_displayName', username);
            window.dispatchEvent(new Event('profileUpdated'));
            navigate('/rooms');
        }
    };
    return (
        <main className="reveal flex-grow flex items-center justify-center px-6 py-12">
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] shadow-2xl p-10 max-w-[500px] w-full text-center">
                <h1 className="hero-title text-[40px] font-semibold mb-2 text-[#1d1d1f]">
                    Crie sua conta
                </h1>
                <p className="text-[17px] font-normal text-[#86868b] mb-10 tracking-tight">
                    Insira seus detalhes abaixo para criar uma nova conta
                </p>
                
                <form className="space-y-4 text-left" onSubmit={handleRegister}>
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Nome de usuário" required 
                               value={username} onChange={(e) => setUsername(e.target.value)}
                               className="apple-input w-full px-4 py-3 rounded-[12px] border border-[#d2d2d7] bg-white/50 focus:outline-none" />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" placeholder="E-mail" required 
                               value={email} onChange={(e) => setEmail(e.target.value)}
                               className="apple-input w-full px-4 py-3 rounded-[12px] border border-[#d2d2d7] bg-white/50 focus:outline-none" />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Senha" required 
                               value={password} onChange={(e) => setPassword(e.target.value)}
                               className="apple-input w-full px-4 py-3 rounded-[12px] border border-[#d2d2d7] bg-white/50 focus:outline-none" />
                    </div>
                    
                    <button type="submit" className="btn-pill btn-primary w-full py-3 text-[17px] font-normal mt-6">
                        Cadastrar
                    </button>
                </form>

                <div className="mt-8">
                    <Link to="/login" className="text-[14px] text-[#0066cc] hover:underline">
                        Já possui uma conta? Inicie sessão aqui ›
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Register;
