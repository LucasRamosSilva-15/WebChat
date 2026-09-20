import React, { useState, useEffect } from 'react';
import { FaCookieBite, FaTimes } from 'react-icons/fa';

const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookieConsent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[400px] z-[9999] animate-fade-in-up-1">
            <div className="skeuo-panel p-5 flex flex-col gap-4 shadow-2xl relative border-[rgba(255,255,255,0.8)] border-[2px]">

                <button
                    onClick={handleDecline}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Fechar"
                >
                    <FaTimes size={16} />
                </button>

                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full admin-icon-box-blue flex-shrink-0 flex items-center justify-center shadow-inner">
                        <FaCookieBite className="text-[#0ea5e9]" size={22} />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-bold admin-hero-title mb-1">Valorizamos sua privacidade</h3>
                        <p className="text-[12px] text-gray-600 dark:text-gray-300 leading-relaxed">
                            Nós utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência, analisar o tráfego do site e personalizar o conteúdo.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-1">
                    <button
                        onClick={handleDecline}
                        className="btn-white-glossy px-4 py-2 text-[12px] font-bold text-gray-600 transition-all hover:bg-gray-100"
                    >
                        Recusar
                    </button>
                    <button
                        onClick={handleAccept}
                        className="skeuo-btn px-5 py-2 text-[12px] font-bold flex items-center gap-2"
                    >
                        Aceitar Cookies
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CookieBanner;
