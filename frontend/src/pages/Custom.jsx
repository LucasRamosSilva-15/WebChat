import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import UserAvatar from '../components/UserAvatar';

function Custom() {
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const savedName = localStorage.getItem('chat_displayName');
        const savedStatus = localStorage.getItem('chat_statusMessage');
        const savedPhoto = localStorage.getItem('chat_profilePhoto');
        if (savedName) setDisplayName(savedName);
        if (savedStatus) setStatusMessage(savedStatus);
        if (savedPhoto) setProfilePhoto(savedPhoto);
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        localStorage.setItem('chat_displayName', displayName);
        localStorage.setItem('chat_statusMessage', statusMessage);
        if (profilePhoto) {
            localStorage.setItem('chat_profilePhoto', profilePhoto);
        }
        window.dispatchEvent(new Event('profileUpdated'));
        console.log("Perfil atualizado:", { displayName, statusMessage });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <main className="custom-page flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full z-10 relative">
            <div className="custom-panel w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 reveal">

                <div className="skeuo-card p-8 md:p-10">
                    <div className="mb-8">
                        <h2 className="custom-title text-[28px] md:text-[32px] leading-tight">
                            Customizar Perfil
                        </h2>
                        <p className="custom-subtitle text-[17px] mt-2">
                            Personalize como os outros veem você no chat.
                        </p>
                    </div>

                    <form onSubmit={handleSave} className="custom-form space-y-6">
                        <div className="flex flex-col items-start justify-center mb-6">
                            <label className="custom-label block text-[12px] mb-3 ml-1">
                                Foto de Perfil
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                            <div className="flex items-center gap-6">
                                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                    <UserAvatar src={profilePhoto} name={displayName} size="2xl" />
                                    <div className="custom-avatar-overlay absolute inset-0 flex items-center justify-center m-[3px] pointer-events-none">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                        </svg>
                                    </div>
                                </div>
                                <button type="button" onClick={() => fileInputRef.current.click()} className="custom-link text-[14px] focus:outline-none">
                                    Alterar foto de perfil
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="displayName" className="custom-label block text-[12px] mb-2 ml-1">
                                Nome de Exibição
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Ex: João Silva"
                                className="skeuo-input custom-input w-full px-4 py-3"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="statusMessage" className="custom-label block text-[12px] mb-2 ml-1">
                                Status / Recado
                            </label>
                            <input
                                type="text"
                                id="statusMessage"
                                value={statusMessage}
                                onChange={(e) => setStatusMessage(e.target.value)}
                                placeholder="O que você está pensando?"
                                className="skeuo-input custom-input w-full px-4 py-3"
                            />
                        </div>

                        <div className="pt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-secondary-glossy flex-1 py-3 text-[16px] font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="skeuo-btn flex-1 py-3 text-[16px] font-medium"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>

                <div className="skeuo-card p-8 h-fit">
                    <h3 className="custom-preview-title text-[20px] font-semibold text-[#1d1d1f] mb-4">Prévia do Perfil</h3>
                    <p className="custom-preview-subtitle text-[13px] text-[#86868b] mb-6">Como outros usuários verão seu perfil</p>

                    <div className="custom-preview-card p-6">
                        <div className="flex items-center gap-4">
                            <UserAvatar src={profilePhoto} name={displayName} size="lg" showStatus={true} status="online" />
                            <div className="flex-1 min-w-0">
                                <h4 className="custom-preview-name text-[18px] truncate">{displayName || "Seu Nome"}</h4>
                                <p className="custom-preview-status text-[13px] truncate">{statusMessage || "Sem recado"}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="custom-online-dot w-1.5 h-1.5"></span>
                                    <span className="custom-online-text text-[11px] uppercase">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showToast && (
                <div className="custom-toast skeuo-panel fixed bottom-[88px] left-1/2 -translate-x-1/2 flex items-center gap-3 z-[9999] reveal">
                    <div className="custom-toast-icon w-6 h-6 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="custom-toast-text text-[15px]">Perfil atualizado com sucesso!</span>
                </div>
            )}
        </main>
    );
}

export default Custom;
