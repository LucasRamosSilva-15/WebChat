import { Link } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';

    return (
        <main className="reveal flex-1 flex items-center justify-center px-4 py-8">
            <div className="skeuo-card p-10 sm:p-12 max-w-[480px] w-full text-center rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-gray-100 dark:border-white/10">
                <h1 className="text-[52px] sm:text-[60px] font-bold text-[#1d1d1f] dark:text-[#f8fafc] tracking-tight mb-4 leading-none">
                    SkyRipple
                </h1>
                {isLoggedIn ? (
                    <>
                        <p className="text-[#86868b] dark:text-[#94a3b8] font-normal text-[18px] sm:text-[20px] mb-8 max-w-[350px] mx-auto leading-snug">
                            Entre em uma sala para começar a conversar em tempo real.
                        </p>
                        <div className="flex justify-center items-center">
                            <Link to="/rooms" className="skeuo-btn px-8 h-[44px] text-[15px] font-medium flex items-center justify-center">
                                Entrar em uma sala
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-[#86868b] dark:text-[#94a3b8] font-normal text-[18px] sm:text-[20px] mb-8 max-w-[350px] mx-auto leading-snug">
                            Crie uma conta para conversar em tempo real.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5">
                            <Link to="/login" className="skeuo-btn px-8 h-[44px] text-[15px] font-medium flex items-center justify-center">
                                Entrar
                            </Link>
                            <Link to="/register" className="btn-secondary-glossy px-8 h-[44px] text-[15px] font-medium flex items-center justify-center gap-1">
                                Criar conta <span className="text-[14px]">›</span>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
};

export default Home;
