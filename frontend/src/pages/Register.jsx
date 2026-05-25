import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

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
            <div className="skeuo-card p-10 max-w-[500px] w-full text-center">
                <h1 className="hero-title text-[40px] font-semibold mb-2">
                    Crie sua conta
                </h1>
                <p className="text-[17px] font-normal text-[#86868b] mb-10 tracking-tight">
                    Preencha os dados para criar sua conta.
                </p>
                
                <form className="space-y-4 text-left" onSubmit={handleRegister}>
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Nome de usuário" required 
                               value={username} onChange={(e) => setUsername(e.target.value)}
                               className="skeuo-input w-full px-4 py-3" />
                    </div>
                    <div className="input-group">
                        <input type="email" id="email" placeholder="E-mail" required 
                               value={email} onChange={(e) => setEmail(e.target.value)}
                               className="skeuo-input w-full px-4 py-3" />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Senha" required 
                               value={password} onChange={(e) => setPassword(e.target.value)}
                               className="skeuo-input w-full px-4 py-3" />
                    </div>
                    
                    <button type="submit" className="skeuo-btn w-full py-3 text-[17px] mt-6">
                        Cadastrar
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
                        Cadastrar com Google (Em breve)
                    </button>
                </form>

                <div className="mt-8">
                    <Link to="/login" className="text-[14px] text-[#0066cc] hover:underline">
                        Já tem uma conta? Entrar ›
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Register;
