import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    if (location.pathname === '/chat') return null;

    return (
        <footer className="app-footer py-8 text-center mt-auto relative z-10 w-full flex flex-col items-center justify-center px-4 gap-3">
            <div className="app-footer-links-container flex flex-wrap items-center justify-center gap-3 md:gap-4 text-xs font-medium">
                <a href="#" className="app-footer-link">Documentação API</a>
                <span className="app-footer-separator">•</span>
                <a href="#" className="app-footer-link">Termos de Uso</a>
                <span className="app-footer-separator">•</span>
                <a href="#" className="app-footer-link">Política de Privacidade</a>
            </div>
            <p className="app-footer-text text-xs">
                © 2026 SkyRipple Inc. Todos os direitos reservados.
            </p>
        </footer>
    );
};

export default Footer;
