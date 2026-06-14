import { Link } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';

    return (
        <main className="reveal home-page flex-1 flex items-center justify-center px-6">
            <div className="skeuo-card home-hero-panel p-10 max-w-[500px] w-full text-center">
                <h1 className="hero-title text-[56px] md:text-[70px] home-hero-title mb-4">
                    SkyRipple
                </h1>
                {isLoggedIn ? (
                    <>
                        <p className="home-hero-subtitle text-[21px] md:text-[24px] mb-10 max-w-[500px] mx-auto leading-tight">
                            Entre em uma sala para começar a conversar em tempo real.
                        </p>
                        <div className="home-actions-single flex justify-center items-center">
                            <Link to="/rooms" className="skeuo-btn home-action-btn px-8 h-[50px] text-[17px] flex items-center justify-center">
                                Entrar em uma sala
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="home-hero-subtitle text-[21px] md:text-[24px] mb-10 max-w-[500px] mx-auto leading-tight">
                            Crie uma conta para conversar em tempo real.
                        </p>
                        <div className="home-actions flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link to="/login" className="skeuo-btn home-action-btn px-8 h-[50px] text-[17px] flex items-center justify-center">
                                Entrar
                            </Link>
                            <Link to="/register" className="btn-secondary-glossy home-action-btn px-8 h-[50px] text-[17px] flex items-center justify-center gap-1">
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
