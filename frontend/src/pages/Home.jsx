import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <main className="reveal flex-grow flex items-center justify-center px-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] shadow-2xl p-10 max-w-[500px] w-full text-center">
                <h1 className="hero-title text-[56px] md:text-[70px] font-semibold mb-4 text-[#1d1d1f]">
                    WebChat
                </h1>
                <p className="text-[21px] md:text-[24px] font-normal text-[#86868b] mb-10 max-w-[500px] mx-auto leading-tight">
                    Uma aplicação de WebChat em tempo real.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/login" className="btn-pill btn-primary px-8 py-3 text-[17px] font-normal min-w-[120px]">
                        Entrar
                    </Link>
                    <Link to="/register" className="btn-pill btn-secondary px-8 py-3 text-[17px] font-normal flex items-center gap-1">
                        Criar conta <span className="text-[14px]">›</span>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Home;
