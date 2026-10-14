import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

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
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full z-10 relative">
            <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6 reveal">

                <div className="skeuo-card p-8 md:p-10">
                    <div className="mb-8">
                        <h2 className="font-semibold text-[#1d1d1f] dark:text-[#f8fafc] tracking-tight text-[28px] md:text-[32px] leading-tight">
                            Customizar Perfil
                        </h2>
                        <p className="font-normal text-[#424245] dark:text-[#94a3b8] text-[17px] mt-2">
                            Personalize como os outros veem você no chat.
                        </p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="flex flex-col items-start justify-center mb-6">
                            <label className="font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-wider block text-[12px] mb-3 ml-1">
                                Foto de Perfil
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                            <div className="flex items-center gap-4">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative w-16 h-16 rounded-full border-2 border-sky-400/80 bg-gradient-to-b from-white to-sky-50 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center font-bold text-2xl text-sky-600 dark:text-sky-400 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9),0_4px_8px_rgba(14,165,233,0.15)] shrink-0 overflow-hidden cursor-pointer"
                                >
                                    {profilePhoto ? (
                                        <img src={profilePhoto} alt="Foto de perfil" className="w-full h-full object-cover" />
                                    ) : (
                                        (displayName ? displayName.charAt(0).toUpperCase() : 'L')
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="btn-secondary-glossy px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <Camera className="w-3.5 h-3.5 text-slate-500" />
                                        Alterar foto
                                    </button>
                                    <span className="text-[11px] text-slate-400">JPG, PNG ou GIF até 5MB</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="displayName" className="font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-wider block text-[12px] mb-2 ml-1">
                                Nome de Exibição
                            </label>
                            <input
                                type="text"
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Ex: João Silva"
                                className="skeuo-input w-full px-4 py-2.5 text-sm rounded-xl"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="statusMessage" className="font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-wider block text-[12px] mb-2 ml-1">
                                Status / Recado
                            </label>
                            <input
                                type="text"
                                id="statusMessage"
                                value={statusMessage}
                                onChange={(e) => setStatusMessage(e.target.value)}
                                placeholder="O que você está pensando?"
                                className="skeuo-input w-full px-4 py-2.5 text-sm rounded-xl"
                            />
                        </div>

                        <div className="pt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-secondary-glossy flex-1 py-3 text-[16px] font-medium cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="skeuo-btn flex-1 py-3 text-[16px] font-medium cursor-pointer"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>

                <div className="skeuo-card p-8 h-fit">
                    <h3 className="text-[20px] font-semibold text-[#1d1d1f] dark:text-[#f8fafc] mb-4">Prévia do Perfil</h3>
                    <p className="text-[13px] text-[#86868b] dark:text-[#94a3b8] mb-6">Como outros usuários verão seu perfil</p>

                    <div className="skeuo-well p-4 rounded-2xl flex items-center gap-3 border border-slate-200/80 dark:border-slate-700/60">
                        <div className="relative w-12 h-12 shrink-0">
                            <div className="w-full h-full rounded-full border-2 border-sky-400 bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-lg shadow-sm overflow-hidden">
                                {profilePhoto ? (
                                    <img src={profilePhoto} alt="Prévia" className="w-full h-full object-cover" />
                                ) : (
                                    (displayName ? displayName.charAt(0).toUpperCase() : 'L')
                                )}
                            </div>
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                                {displayName || "Lucas Ramos Silva"}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {statusMessage || "Sem recado"}
                            </p>
                            <div className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                ONLINE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showToast && (
                <div className="rounded-full py-3 px-6 skeuo-panel fixed bottom-[88px] left-1/2 -translate-x-1/2 flex items-center gap-3 z-[9999] reveal">
                    <div className="rounded-full bg-green-500 shadow-inner w-6 h-6 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="font-semibold text-[#1d1d1f] dark:text-[#f8fafc] text-[15px]">Perfil atualizado com sucesso!</span>
                </div>
            )}
        </main>
    );
}

export default Custom;
