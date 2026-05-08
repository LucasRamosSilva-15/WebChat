import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <main className="reveal flex-grow flex items-center justify-center px-6">        
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] shadow-2xl p-10 max-w-[400px] w-full text-center">
                <h1 className="hero-title text-[40px] font-semibold mb-2 text-[#1d1d1f]">
                    Acesse o WebChat
                </h1>
                <p className="text-[17px] font-normal text-[#86868b] mb-10 tracking-tight">
                    Insira seus detalhes abaixo
                </p>
                <form className="space-y-6 text-left" onSubmit={(e) => e.preventDefault()}>
                    <div className="input-group">
                        <input type="text" id="username" placeholder="Username" required 
                               className="apple-input w-full px-4 py-3 rounded-[12px] border border-[#d2d2d7] bg-white/50 focus:outline-none" />
                    </div>
                    <div className="input-group">
                        <input type="password" id="password" placeholder="Password" required 
                               className="apple-input w-full px-4 py-3 rounded-[12px] border border-[#d2d2d7] bg-white/50 focus:outline-none" />
                    </div>
                    <button type="submit" className="btn-pill btn-primary w-full py-3 text-[17px] font-normal mt-4">
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
