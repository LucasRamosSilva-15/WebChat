import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaComments, FaSearch, FaTrash, FaExternalLinkAlt, FaCopy, FaCheck, FaBars, FaBookmark, FaDoorOpen } from 'react-icons/fa';
import ChatSidebar from '../components/ChatSidebar';
import { apiRequest } from '../services/api';
import SkeuoLoading from '../components/SkeuoLoading';

const Favorites = () => {
    const navigate = useNavigate();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('rooms');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [favoriteRoomParams, setFavoriteRoomParams] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [savedMessages, setSavedMessages] = useState([]);
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        const loadFavoritesData = async () => {
            setLoading(true);
            try {
                const storedFavs = localStorage.getItem('chat_favorites');
                const parsedFavs = storedFavs ? JSON.parse(storedFavs) : [];
                setFavoriteRoomParams(parsedFavs);

                const storedMsgs = localStorage.getItem('chat_saved_messages');
                const parsedMsgs = storedMsgs ? JSON.parse(storedMsgs) : [];
                setSavedMessages(parsedMsgs);

                const [backendFavs, fetchedRooms] = await Promise.allSettled([
                    apiRequest('/favorites'),
                    apiRequest('/rooms')
                ]);

                if (backendFavs.status === 'fulfilled' && backendFavs.value) {
                    const serverRooms = backendFavs.value.rooms || [];
                    const serverMsgs = backendFavs.value.messages || [];

                    const mergedRoomParams = Array.from(new Set([
                        ...parsedFavs,
                        ...serverRooms.map(r => r.roomId)
                    ]));
                    setFavoriteRoomParams(mergedRoomParams);
                    localStorage.setItem('chat_favorites', JSON.stringify(mergedRoomParams));

                    if (serverMsgs.length > 0) {
                        setSavedMessages(serverMsgs);
                        localStorage.setItem('chat_saved_messages', JSON.stringify(serverMsgs));
                    }
                }

                if (fetchedRooms.status === 'fulfilled' && fetchedRooms.value) {
                    const roomsList = Array.isArray(fetchedRooms.value)
                        ? fetchedRooms.value
                        : (fetchedRooms.value.rooms || []);
                    setRooms(roomsList);
                }
            } catch (err) {
                console.error("Erro ao carregar favoritos:", err);
            } finally {
                setLoading(false);
            }
        };

        loadFavoritesData();
    }, []);

    const removeRoomFavorite = (roomParam) => {
        const updated = favoriteRoomParams.filter(param => param !== roomParam);
        setFavoriteRoomParams(updated);
        localStorage.setItem('chat_favorites', JSON.stringify(updated));
        apiRequest(`/favorites/room/${roomParam}`, { method: 'DELETE' }).catch(() => {});
    };

    const removeMessageFavorite = (idOrIndex) => {
        const targetMsg = savedMessages.find((msg, idx) => (msg.id !== undefined ? msg.id === idOrIndex : idx === idOrIndex));
        const updated = savedMessages.filter((msg, idx) => (msg.id !== undefined ? msg.id !== idOrIndex : idx !== idOrIndex));
        setSavedMessages(updated);
        localStorage.setItem('chat_saved_messages', JSON.stringify(updated));
        const itemId = targetMsg?.messageId || targetMsg?.id || idOrIndex;
        if (itemId) {
            apiRequest(`/favorites/message/${itemId}`, { method: 'DELETE' }).catch(() => {});
        }
    };

    const handleCopyText = (text, index) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const favoriteRooms = rooms.filter(room => {
        const param = room.roomParam || room.id || room.name;
        const isFav = favoriteRoomParams.includes(param) || favoriteRoomParams.includes(room.roomParam);
        if (!isFav) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (room.name && room.name.toLowerCase().includes(q)) ||
            (room.description && room.description.toLowerCase().includes(q)) ||
            (room.category && room.category.toLowerCase().includes(q));
    });

    const filteredMessages = savedMessages.filter(msg => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (msg.text && msg.text.toLowerCase().includes(q)) ||
            (msg.sender && msg.sender.toLowerCase().includes(q)) ||
            (msg.roomName && msg.roomName.toLowerCase().includes(q));
    });

    return (
        <div className="animate-chat-shell flex w-full h-[calc(100vh-48px)] overflow-hidden">
            <ChatSidebar isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

            <main className="animate-chat-panel-main flex-1 min-w-0 flex flex-col h-full relative bg-[#f8fafc] dark:bg-[#020617] overflow-y-auto skeuo-scrollbar">
                <div className="sticky top-0 z-20 px-4 md:px-6 py-3 border-b border-[#d2d2d7] dark:border-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="lg:hidden w-8 h-8 flex items-center justify-center text-[#86868b] dark:text-[#94a3b8] hover:text-[#0071e3] transition-colors rounded-full active:bg-black/5 dark:active:bg-white/5"
                            aria-label="Abrir menu"
                        >
                            <FaBars size={16} />
                        </button>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-amber-400 to-amber-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] border border-amber-500">
                            <FaStar size={14} />
                        </div>
                        <div>
                            <h1 className="font-bold text-base md:text-lg leading-tight text-[#1d1d1f] dark:text-[#f8fafc]">
                                Favoritos
                            </h1>
                            <p className="text-[11px] text-[#86868b] dark:text-slate-400">
                                Suas salas e mensagens destacadas para acesso rápido
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="relative hidden sm:block">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={12} />
                            <input
                                type="text"
                                placeholder="Buscar nos favoritos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="skeuo-input pl-8 pr-3 py-1.5 text-xs w-48 lg:w-60 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 rounded-xl"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="skeuo-segmented-track flex w-full sm:w-auto p-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('rooms')}
                                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                                    activeTab === 'rooms'
                                        ? 'skeuo-segmented-item-active'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <FaDoorOpen size={13} />
                                Salas Favoritas ({favoriteRooms.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('messages')}
                                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                                    activeTab === 'messages'
                                        ? 'skeuo-segmented-item-active'
                                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <FaBookmark size={12} />
                                Mensagens Salvas ({filteredMessages.length})
                            </button>
                        </div>

                        <div className="sm:hidden w-full relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={12} />
                            <input
                                type="text"
                                placeholder="Buscar nos favoritos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="skeuo-input pl-8 pr-3 py-2 text-xs w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 rounded-xl"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="py-16">
                            <SkeuoLoading />
                        </div>
                    ) : activeTab === 'rooms' ? (
                        <div>
                            {favoriteRooms.length === 0 ? (
                                <div className="skeuo-card p-10 text-center flex flex-col items-center justify-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-500 flex items-center justify-center shadow-inner">
                                        <FaStar size={28} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                        Nenhuma sala favoritada
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                        Você pode clicar no ícone de estrela de qualquer sala na lista de salas para guardá-la aqui.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/rooms')}
                                        className="btn-primary-glossy px-5 py-2.5 text-xs font-semibold rounded-xl mt-2 flex items-center gap-2"
                                    >
                                        <FaComments size={14} />
                                        Explorar Salas
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {favoriteRooms.map(room => {
                                        const roomKey = room.roomParam || room.id || room.name;
                                        return (
                                            <div
                                                key={roomKey}
                                                className="skeuo-card p-4 flex flex-col justify-between gap-3 group hover:border-sky-300 dark:hover:border-sky-700 transition-all"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="skeuo-avatar-badge w-12 h-12 flex items-center justify-center text-white font-bold text-base rounded-2xl shrink-0 overflow-hidden shadow-md">
                                                        {room.image_url ? (
                                                            <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>#</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-2">
                                                            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                                                                {room.name}
                                                            </h4>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRoomFavorite(room.roomParam || room.id)}
                                                                className="text-amber-500 hover:text-amber-600 dark:hover:text-amber-400 p-1 rounded-lg transition-transform active:scale-90"
                                                                title="Remover dos favoritos"
                                                                aria-label="Remover sala dos favoritos"
                                                            >
                                                                <FaStar size={15} />
                                                            </button>
                                                        </div>
                                                        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-sky-600 dark:text-sky-400 mt-0.5">
                                                            {room.category || 'Geral'}
                                                        </span>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                                                            {room.description || 'Sem descrição informada.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                                        {room.user_count ? `${room.user_count} online` : 'Disponível'}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => navigate(`/chat?room=${encodeURIComponent(room.roomParam || room.id)}`)}
                                                        className="btn-primary-glossy px-3.5 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                                                    >
                                                        <span>Entrar</span>
                                                        <FaExternalLinkAlt size={10} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {filteredMessages.length === 0 ? (
                                <div className="skeuo-card p-10 text-center flex flex-col items-center justify-center gap-3">
                                    <div className="w-16 h-16 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center shadow-inner">
                                        <FaBookmark size={26} />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                        Nenhuma mensagem salva
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
                                        No chat, use o menu de opções em qualquer mensagem e clique em "Favoritar" para guardá-la aqui.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/chat')}
                                        className="btn-primary-glossy px-5 py-2.5 text-xs font-semibold rounded-xl mt-2 flex items-center gap-2"
                                    >
                                        <FaComments size={14} />
                                        Ir para o Chat
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredMessages.map((msg, idx) => (
                                        <div
                                            key={msg.id || idx}
                                            className="skeuo-card p-4 flex flex-col gap-2.5 border-l-4 border-l-amber-500"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-slate-800 dark:text-slate-100">
                                                        {msg.sender || 'Usuário'}
                                                    </span>
                                                    {msg.roomName && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                                            {msg.roomName}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                                                    {msg.time || ''}
                                                </span>
                                            </div>

                                            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                                                {msg.text}
                                            </p>

                                            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopyText(msg.text, idx)}
                                                    className="btn-secondary-glossy px-2.5 py-1 text-[11px] font-medium rounded-lg flex items-center gap-1 cursor-pointer text-slate-600 dark:text-slate-300"
                                                >
                                                    {copiedIndex === idx ? <FaCheck size={11} className="text-emerald-500" /> : <FaCopy size={11} />}
                                                    <span>{copiedIndex === idx ? 'Copiado!' : 'Copiar'}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMessageFavorite(msg.id !== undefined ? msg.id : idx)}
                                                    className="btn-secondary-glossy px-2.5 py-1 text-[11px] font-medium rounded-lg flex items-center gap-1 cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                                                >
                                                    <FaTrash size={10} />
                                                    <span>Remover</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Favorites;
