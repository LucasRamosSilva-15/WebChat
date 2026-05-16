import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <main className="reveal flex-grow flex items-center justify-center px-6">
            <div className="skeuo-panel p-10 max-w-[500px] w-full text-center">
                <h1 className="hero-title text-[56px] md:text-[70px] font-semibold mb-4">
                    WebChat
                </h1>
                <p className="text-[21px] md:text-[24px] font-normal text-[#86868b] mb-10 max-w-[500px] mx-auto leading-tight">
                    Uma aplicação de WebChat em tempo real.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/login" className="skeuo-btn px-8 py-3 text-[17px] font-normal min-w-[120px]">
                        Entrar
                    </Link>
                    <Link to="/register" className="btn-secondary-glossy px-8 py-3 text-[17px] font-normal flex items-center gap-1">
                        Criar conta <span className="text-[14px]">›</span>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Home;
