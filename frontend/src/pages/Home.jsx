import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
    const isLoggedIn = localStorage.getItem('chat_isLoggedIn') === 'true';

    return (
        <main className="reveal flex-1 flex flex-col items-center justify-center px-4 py-8">
            <div className="skeuo-card px-7 py-8 sm:px-9 sm:py-9 max-w-[480px] w-full text-center rounded-[28px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.18)]">
                <div className="flex justify-center mb-4">
                    <img
                        src="/logo_512x512_transparente.svg"
                        alt="SkyRipple Logo"
                        className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-[0_8px_20px_rgba(0,102,204,0.2)]"
                    />
                </div>

                <h1 className="hero-title font-bold text-3xl sm:text-4xl text-shadow-sm tracking-tight mb-1">
                    SkyRipple
                </h1>

                {isLoggedIn ? (
                    <>
                        <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm mt-2 mb-7 leading-relaxed">
                            Bem-vindo de volta! Entre em uma sala para continuar suas conversas em tempo real.
                        </p>
                        <div className="flex justify-center items-center w-full">
                            <Link
                                to="/rooms"
                                className="skeuo-btn w-full sm:w-auto px-8 py-2.5 text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                            >
                                <span>Entrar em uma sala</span>
                                <FiArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-slate-500 dark:text-slate-400 font-normal text-xs sm:text-sm mt-2 mb-7 leading-relaxed">
                            O seu espaço para conversas em tempo real. Deixe as suas ideias fluírem livremente.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
                            <Link
                                to="/register"
                                className="skeuo-btn w-full sm:w-auto px-6 py-2.5 text-sm sm:text-[15px] font-semibold flex items-center justify-center gap-2 rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                            >
                                <span>Criar conta gratuita</span>
                                <FiArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/login"
                                className="btn-secondary-glossy w-full sm:w-auto px-6 py-2.5 text-sm sm:text-[15px] flex items-center justify-center gap-2 font-medium rounded-xl shadow-sm transition-all active:scale-[0.99] cursor-pointer"
                            >
                                <span>Já tenho conta</span>
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-4 flex items-center justify-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 dark:bg-slate-800/70 border border-white/80 dark:border-white/10 shadow-sm text-[11px] text-slate-500 dark:text-slate-400 backdrop-blur-[4px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">Salas temáticas</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>Mensagens instantâneas</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span>100% Web</span>
                </div>
            </div>
        </main>
    );
};

export default Home;
