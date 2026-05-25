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
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full z-10 relative">
            <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 reveal">

                <div className="skeuo-card p-8 md:p-10">
                    <div className="mb-8">
                        <h2 className="text-[28px] md:text-[32px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                            Customizar Perfil
                        </h2>
                        <p className="text-[17px] text-[#424245] mt-2 font-normal">
                            Personalize como os outros veem você no chat.
                        </p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="flex flex-col items-start justify-center mb-6">
                            <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-widest mb-3 ml-1">
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
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 m-[3px] pointer-events-none">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                        </svg>
                                    </div>
                                </div>
                                <button type="button" onClick={() => fileInputRef.current.click()} className="text-[14px] font-medium text-[#0071e3] hover:text-[#0077ed] hover:underline focus:outline-none transition-colors">
                                    Alterar foto de perfil
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="displayName" className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-widest mb-2 ml-1">
                                Nome de Exibição
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Ex: João Silva"
                                className="skeuo-input w-full px-4 py-3 bg-[#fbfbfd]"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="statusMessage" className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-widest mb-2 ml-1">
                                Status / Recado
                            </label>
                            <input
                                type="text"
                                id="statusMessage"
                                value={statusMessage}
                                onChange={(e) => setStatusMessage(e.target.value)}
                                placeholder="O que você está pensando?"
                                className="skeuo-input w-full px-4 py-3 bg-[#fbfbfd]"
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
                    <h3 className="text-[20px] font-semibold text-[#1d1d1f] mb-4">Prévia do Perfil</h3>
                    <p className="text-[13px] text-[#86868b] mb-6">Como outros usuários verão seu perfil</p>

                    <div className="bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] rounded-[16px] p-6 border border-[#d2d2d7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-4">
                            <UserAvatar src={profilePhoto} name={displayName} size="lg" showStatus={true} status="online" />
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[18px] font-semibold text-[#1d1d1f] truncate">{displayName || "Seu Nome"}</h4>
                                <p className="text-[13px] text-[#86868b] truncate">{statusMessage || "Sem recado"}</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                                    <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wide">Online</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showToast && (
                <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 skeuo-panel px-6 py-4 flex items-center gap-3 z-50 reveal" style={{ borderRadius: '980px', padding: '12px 24px' }}>
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 shadow-inner">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="text-[15px] font-semibold text-[#1d1d1f]">Perfil atualizado com sucesso!</span>
                </div>
            )}
        </main>
    );
}

export default Custom;
