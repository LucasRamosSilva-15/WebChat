import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    if (location.pathname === '/chat') return null;

    return (
        <footer className="bg-transparent border-t-0 py-8 text-center mt-auto w-full flex flex-col items-center justify-center px-4 gap-3">
            <div className="opacity-70 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs font-medium">
                <a href="#" className="transition-colors duration-200 no-underline hover:opacity-100 hover:text-blue-500 dark:hover:text-sky-400">Documentação API</a>
                <span className="opacity-50">•</span>
                <a href="#" className="transition-colors duration-200 no-underline hover:opacity-100 hover:text-blue-500 dark:hover:text-sky-400">Termos de Uso</a>
                <span className="opacity-50">•</span>
                <a href="#" className="transition-colors duration-200 no-underline hover:opacity-100 hover:text-blue-500 dark:hover:text-sky-400">Política de Privacidade</a>
            </div>
            <p className="font-normal text-black/40 dark:text-white/40 text-xs">
                © 2026 SkyRipple Inc. Todos os direitos reservados.
            </p>
        </footer>
    );
};

export default Footer;
