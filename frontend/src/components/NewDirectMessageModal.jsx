import React, { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';

const DEFAULT_SUGGESTED_USERS = [
    { id: 'user_sup', name: 'Suporte SkyRipple', username: 'suporte', email: 'suporte@chat.com', isOnline: true },
    { id: 'user_mod', name: 'Moderação Geral', username: 'moderacao', email: 'mod@chat.com', isOnline: true },
    { id: 'user_ana', name: 'Ana Oliveira', username: 'ana', email: 'ana@chat.com', isOnline: true },
    { id: 'user_carlos', name: 'Carlos Santos', username: 'carlos', email: 'carlos@chat.com', isOnline: false }
];

const NewDirectMessageModal = ({ isOpen, onClose, onStartConversation, registeredUsers = [], currentUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setSelectedUser(null);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const baseList = Array.isArray(registeredUsers) && registeredUsers.length > 0
        ? registeredUsers
        : DEFAULT_SUGGESTED_USERS;

    const availableUsers = baseList.filter(u => u.id !== currentUserId);

    const filteredUsers = availableUsers.filter(u => {
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase();
        const nameMatch = u.name && u.name.toLowerCase().includes(term);
        const usernameMatch = u.username && u.username.toLowerCase().includes(term);
        const emailMatch = u.email && u.email.toLowerCase().includes(term);
        return nameMatch || usernameMatch || emailMatch;
    });

    const handleSubmit = (e) => {
        e?.preventDefault();
        const target = selectedUser || searchTerm.trim();
        if (!target) return;
        onStartConversation(target);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
            onClick={onClose}
        >
            <div
                className="skeuo-card max-w-md w-full p-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary-glossy !w-8 !h-8 !p-0 rounded-full inline-flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors absolute right-4 top-4 cursor-pointer"
                    title="Fechar modal"
                    aria-label="Fechar"
                >
                    <X className="w-4 h-4" />
                </button>

                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Nova Conversa Direta</h3>

                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="relative mt-2 mb-4">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (selectedUser && selectedUser.name !== e.target.value) {
                                    setSelectedUser(null);
                                }
                            }}
                            placeholder="Digite um nome, @usuário ou e-mail..."
                            className="skeuo-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                            autoFocus
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Utilizadores sugeridos
                    </div>

                    <div className="skeuo-well p-2 rounded-2xl max-h-56 overflow-y-auto skeuo-scrollbar flex flex-col gap-1.5">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => {
                                const isSelected = selectedUser?.id === user.id;
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                setSelectedUser(null);
                                                setSearchTerm('');
                                            } else {
                                                setSelectedUser(user);
                                                setSearchTerm(user.name);
                                            }
                                        }}
                                        className={`w-full p-2 rounded-xl flex items-center justify-between transition-all text-left cursor-pointer ${
                                            isSelected
                                                ? 'bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/40 dark:to-slate-800 border border-sky-400/80 shadow-[0_2px_6px_rgba(14,165,233,0.15)]'
                                                : 'hover:bg-white/70 dark:hover:bg-slate-700/50 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-8 h-8 rounded-full border border-sky-400/60 bg-white dark:bg-slate-800 flex items-center justify-center font-bold text-sky-600 dark:text-sky-400 text-xs shadow-xs">
                                                {user.name.charAt(0).toUpperCase()}
                                                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-800 ${
                                                    user.isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                                                }`} />
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                                    {user.name}
                                                </div>
                                                <div className="text-[11px] text-slate-400">
                                                    @{user.username || user.email}
                                                </div>
                                            </div>
                                        </div>

                                        {isSelected && (
                                            <Check className="w-4 h-4 text-sky-600 dark:text-sky-400 mr-2" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="py-6 text-center text-xs text-slate-400">
                                Nenhum utilizador encontrado com "{searchTerm}".
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-200/50 dark:border-white/5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary-glossy px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!searchTerm.trim() && !selectedUser}
                            className="skeuo-btn-primary px-6 py-2 text-xs font-bold text-white rounded-xl shadow-md disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                            Iniciar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewDirectMessageModal;
