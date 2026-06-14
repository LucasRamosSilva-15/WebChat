import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    if (location.pathname === '/chat') return null;

    return (
        <footer className="app-footer py-10 text-center mt-auto relative z-10 w-full flex items-center justify-center px-4">
            <p className="app-footer-text text-xs">
                Copyright © 2026 SkyRipple Inc. Todos os direitos reservados.
            </p>
        </footer>
    );
};

export default Footer;
