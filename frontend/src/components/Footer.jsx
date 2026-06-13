import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    if (location.pathname === '/chat') return null;

    return (
        <footer className="app-footer">
            <p className="app-footer-text">
                Copyright © 2026 SkyRipple Inc. Todos os direitos reservados.
            </p>
        </footer>
    );
};

export default Footer;
