import { Link } from 'react-router-dom';

const Home = () => {
    const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';

    return (
        <main className="reveal home-page">
            <div className="skeuo-card home-hero-panel">
                <h1 className="hero-title text-[56px] md:text-[70px] home-hero-title">
                    SkyRipple
                </h1>
                {isLoggedIn ? (
                    <>
                        <p className="home-hero-subtitle text-[21px] md:text-[24px]">
                            Entre em uma sala para começar a conversar em tempo real.
                        </p>
                        <div className="home-actions-single">
                            <Link to="/rooms" className="skeuo-btn home-action-btn">
                                Entrar em uma sala
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="home-hero-subtitle text-[21px] md:text-[24px]">
                            Crie uma conta para conversar em tempo real.
                        </p>
                        <div className="home-actions">
                            <Link to="/login" className="skeuo-btn home-action-btn">
                                Entrar
                            </Link>
                            <Link to="/register" className="btn-secondary-glossy home-action-btn gap-1">
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
