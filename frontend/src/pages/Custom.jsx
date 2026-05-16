import React, { useState, useEffect, useRef } from 'react';

function Custom() {
    const [displayName, setDisplayName] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
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
        // Provisório para feedback (vai ser melhorado no futuro com um Toast depois)
        alert("Perfil salvo com sucesso!");
    };

    return (
        <main className="flex-1 flex items-center justify-center p-4 md:p-6 w-full z-10 relative">
            <div className="w-full max-w-[500px] bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] p-8 md:p-10 shadow-2xl reveal">

                <div className="text-center mb-8">
                    <h2 className="text-[28px] md:text-[32px] font-semibold text-[#1d1d1f] tracking-tight leading-tight">
                        Customizar Perfil
                    </h2>
                    <p className="text-[17px] text-[#424245] mt-2 font-normal">
                        Personalize como os outros veem você no chat.
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="flex flex-col items-center justify-center mb-2">
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            onChange={handlePhotoChange} 
                            className="hidden" 
                        />
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                            <div className="w-[100px] h-[100px] rounded-full bg-gray-100 border border-[#d2d2d7] shadow-sm flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-[#0071e3]/50">
                                {profilePhoto ? (
                                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <svg className="w-12 h-12 text-[#86868b] transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                    </svg>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                            </div>
                        </div>
                        <button type="button" onClick={() => fileInputRef.current.click()} className="mt-3 text-[13px] font-medium text-[#0071e3] hover:text-[#0077ed] hover:underline focus:outline-none transition-colors">
                            Alterar foto de perfil
                        </button>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="displayName" className="block text-[11px] md:text-[12px] font-medium text-[#86868b] ml-1 uppercase tracking-widest">
                            Nome de Exibição
                        </label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Ex: João Silva"
                            className="w-full bg-white/50 border border-[#d2d2d7] rounded-[12px] px-4 py-3 text-[17px] text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] placeholder-[#86868b] transition-all duration-300"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="statusMessage" className="block text-[11px] md:text-[12px] font-medium text-[#86868b] ml-1 uppercase tracking-widest">
                            Status / Recado
                        </label>
                        <input
                            type="text"
                            id="statusMessage"
                            value={statusMessage}
                            onChange={(e) => setStatusMessage(e.target.value)}
                            placeholder="O que você está pensando?"
                            className="w-full bg-white/50 border border-[#d2d2d7] rounded-[12px] px-4 py-3 text-[17px] text-[#1d1d1f] outline-none focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] placeholder-[#86868b] transition-all duration-300"
                        />
                    </div>

                    <div className="pt-6 space-y-3">
                        <button
                            type="submit"
                            className="btn-pill btn-primary w-full py-3.5 text-[17px] font-medium shadow-sm flex justify-center items-center"
                        >
                            Salvar Alterações
                        </button>

                        <button
                            type="button"
                            className="btn-pill w-full py-3.5 text-[17px] font-medium text-[#424245] bg-transparent border border-transparent hover:bg-black/5 flex justify-center items-center"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

export default Custom;
