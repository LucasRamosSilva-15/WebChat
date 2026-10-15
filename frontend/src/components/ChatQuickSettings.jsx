import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

const ChatQuickSettings = () => {
    const [enterToSend, setEnterToSend] = useState(() => {
        const saved = localStorage.getItem('chat_enterToSend');
        return saved !== null ? saved === 'true' : true;
    });

    const [soundEnabled, setSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('chat_soundEnabled');
        return saved !== null ? saved === 'true' : true;
    });

    const [showTimestamps, setShowTimestamps] = useState(() => {
        const saved = localStorage.getItem('chat_showTimestamps');
        return saved !== null ? saved === 'true' : true;
    });

    useEffect(() => {
        const syncSettings = () => {
            const savedEnter = localStorage.getItem('chat_enterToSend');
            const savedSound = localStorage.getItem('chat_soundEnabled');
            const savedTime = localStorage.getItem('chat_showTimestamps');
            if (savedEnter !== null) setEnterToSend(savedEnter === 'true');
            if (savedSound !== null) setSoundEnabled(savedSound === 'true');
            if (savedTime !== null) setShowTimestamps(savedTime === 'true');
        };

        window.addEventListener('chatSettingsUpdated', syncSettings);
        return () => window.removeEventListener('chatSettingsUpdated', syncSettings);
    }, []);

    const toggleSetting = (key) => {
        if (key === 'enterToSend') {
            const next = !enterToSend;
            setEnterToSend(next);
            localStorage.setItem('chat_enterToSend', String(next));
        } else if (key === 'soundEnabled') {
            const next = !soundEnabled;
            setSoundEnabled(next);
            localStorage.setItem('chat_soundEnabled', String(next));
        } else if (key === 'showTimestamps') {
            const next = !showTimestamps;
            setShowTimestamps(next);
            localStorage.setItem('chat_showTimestamps', String(next));
        }
        window.dispatchEvent(new Event('chatSettingsUpdated'));
    };

    return (
        <div className="pt-2">
            <div className="text-[11px] mb-2 ml-2 font-bold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">
                Ajustes Rápidos
            </div>
            <div className="skeuo-well p-3 rounded-2xl flex flex-col gap-2.5 border border-slate-200/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Enter envia</span>
                    <button
                        type="button"
                        onClick={() => toggleSetting('enterToSend')}
                        className={`w-9 h-5 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer border ${
                            enterToSend
                                ? 'bg-sky-500 border-sky-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]'
                                : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-inner'
                        }`}
                        title="Pressionar Enter para enviar mensagem"
                        aria-label="Alternar Enter para enviar"
                    >
                        <div
                            className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                                enterToSend ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Sons</span>
                    <button
                        type="button"
                        onClick={() => toggleSetting('soundEnabled')}
                        className={`w-9 h-5 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer border ${
                            soundEnabled
                                ? 'bg-sky-500 border-sky-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]'
                                : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-inner'
                        }`}
                        title="Tocar sons de notificações"
                        aria-label="Alternar sons de notificações"
                    >
                        <div
                            className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                                soundEnabled ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Horários</span>
                    <button
                        type="button"
                        onClick={() => toggleSetting('showTimestamps')}
                        className={`w-9 h-5 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer border ${
                            showTimestamps
                                ? 'bg-sky-500 border-sky-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]'
                                : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600 shadow-inner'
                        }`}
                        title="Exibir horário das mensagens"
                        aria-label="Alternar exibição de horários"
                    >
                        <div
                            className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                                showTimestamps ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                    </button>
                </div>

                <div className="pt-1.5 border-t border-slate-200/60 dark:border-slate-700/50 mt-0.5">
                    <Link
                        to="/settings"
                        className="btn-secondary-glossy w-full py-2 px-2.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                    >
                        <FaCog size={12} className="text-sky-500" />
                        Mais Configurações
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ChatQuickSettings;
