import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    if (location.pathname === '/chat') return null;

    return (
        <footer className="py-10 text-center mt-auto relative z-10">
            <p className="text-[12px] text-black/40 dark:text-white/40 font-normal">
                Copyright © 2026 SkyRipple Inc. Todos os direitos reservados.
            </p>
        </footer>
    );
};

export default Footer;
