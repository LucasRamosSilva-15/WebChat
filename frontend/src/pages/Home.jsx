import { Link } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';

    return (
        <main className="reveal flex-1 flex items-center justify-center px-6">
            <div className="skeuo-card p-10 max-w-[500px] w-full text-center">
                <h1 className="hero-title text-[56px] md:text-[70px] font-semibold mb-4">
                    SkyRipple
                </h1>
                {isLoggedIn ? (
                    <>
                        <p className="text-[#86868b] dark:text-[#94a3b8] font-normal text-[21px] md:text-[24px] mb-10 max-w-[500px] mx-auto leading-tight">
                            Entre em uma sala para começar a conversar em tempo real.
                        </p>
                        <div className="flex justify-center items-center">
                            <Link to="/rooms" className="skeuo-btn font-normal px-8 h-[50px] text-[17px] flex items-center justify-center">
                                Entrar em uma sala
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-[#86868b] dark:text-[#94a3b8] font-normal text-[21px] md:text-[24px] mb-10 max-w-[500px] mx-auto leading-tight">
                            Crie uma conta para conversar em tempo real.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link to="/login" className="skeuo-btn font-normal px-8 h-[50px] text-[17px] flex items-center justify-center">
                                Entrar
                            </Link>
                            <Link to="/register" className="btn-secondary-glossy font-normal px-8 h-[50px] text-[17px] flex items-center justify-center gap-1">
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
