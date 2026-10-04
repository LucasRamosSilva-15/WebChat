import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    if (location.pathname === '/chat') return null;

    return (
        <footer className="bg-transparent border-t-0 py-8 text-center mt-auto w-full flex flex-col items-center justify-center px-4 gap-2.5 z-10">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <a href="#" className="transition-colors duration-200 no-underline hover:text-blue-600 dark:hover:text-sky-400">Documentação API</a>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <a href="#" className="transition-colors duration-200 no-underline hover:text-blue-600 dark:hover:text-sky-400">Termos de Uso</a>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <a href="#" className="transition-colors duration-200 no-underline hover:text-blue-600 dark:hover:text-sky-400">Política de Privacidade</a>
            </div>
            <p className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                © 2026 SkyRipple Inc. Todos os direitos reservados.
            </p>
        </footer>
    );
};

export default Footer;
