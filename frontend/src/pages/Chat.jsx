import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';
import { FaPaperPlane, FaCamera, FaTimes, FaStar, FaSignOutAlt, FaTrash, FaPencilAlt, FaHeart, FaRegHeart, FaThumbtack, FaEllipsisV, FaFlag, FaCommentAlt, FaCrown, FaShieldAlt, FaUser, FaComments, FaSearch, FaChevronUp, FaChevronDown, FaBars, FaUsers } from 'react-icons/fa';
import { socket } from '../socket';
import { apiRequest } from '../services/api';
import ChatSidebar from '../components/ChatSidebar';
import MembersSidebar from '../components/MembersSidebar';
import UserAvatar from '../components/UserAvatar';
import SkeuoLoading from '../components/SkeuoLoading';
// Código de criptografia
// Provisório! deve ser mudado para JWT e bcrypt no futuro
const SECRET_KEY = "WebChat_E2EE_Secret_Key_Minix";



const formatMessageTime = (timeStr) => {
    if (!timeStr) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (timeStr.includes('T')) {
        const msgDate = new Date(timeStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const isToday = msgDate.getDate() === today.getDate() &&
            msgDate.getMonth() === today.getMonth() &&
            msgDate.getFullYear() === today.getFullYear();

        const isYesterday = msgDate.getDate() === yesterday.getDate() &&
            msgDate.getMonth() === yesterday.getMonth() &&
            msgDate.getFullYear() === yesterday.getFullYear();

        if (isToday) {
            return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (isYesterday) {
            return "Ontem às " + msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return msgDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + " " + msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }

    return timeStr;
};

const MessageBubble = ({ msg, onAvatarClick, onImageClick, onToggleFavorite, onDeleteMessage, onEditClick, onToggleLike, currentUserId, mockRoles, onReportClick, searchTerm, isCurrentSearch, innerRef, openMenuId, setOpenMenuId }) => {
    const msgTime = formatMessageTime(msg.time);

    let canDelete = false;
    if (msg.isMe && msg.time && msg.messageId) {
        const msgDate = new Date(msg.time);
        const now = new Date();
        const diffHours = (now - msgDate) / (1000 * 60 * 60);
        if (diffHours < 24) canDelete = true;
    }

    const isMatch = searchTerm && msg.text && msg.text.toLowerCase().includes(searchTerm);
    const matchClass = isMatch ? (isCurrentSearch ? 'message-search-current scale-[1.02]' : 'message-search-match') : '';

    if (msg.isMe) {
        return (
            <div ref={innerRef} className="px-3 py-0.5 flex justify-end group animate-fade-in-up relative z-1 hover:z-50" style={{ zIndex: openMenuId === msg.messageId ? 9999 : undefined, position: openMenuId === msg.messageId ? 'relative' : undefined }}>
                <div className="flex flex-col max-w-[80%] items-end group/msg relative z-1 hover:z-50">
                    <div className={`px-3 py-1.5 flex flex-col relative transition-all duration-300 rounded-[14px] rounded-tr-[2px] skeuo-bubble-sent ${matchClass}`}>
                        <div onMouseEnter={() => setOpenMenuId(msg.messageId)} onMouseLeave={() => setOpenMenuId(null)} className="message-bubble-actions absolute top-2 right-full mr-2 z-10">
                            <button className="message-bubble-more-btn p-1 flex items-center justify-center rounded-full text-[#86868b] dark:text-slate-400 opacity-0 group-hover/msg:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer">
                                <FaEllipsisV size={12} className="drop-shadow-xs" />
                            </button>

                            <div className={`absolute top-0 right-full mr-2 min-w-[140px] flex flex-col rounded-xl bg-[#f4f5f7] dark:bg-slate-800 border border-black/5 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-200 z-[10000] ${openMenuId === msg.messageId ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                                <button onClick={onToggleFavorite} className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl">
                                    <FaStar size={10} className={`drop-shadow-xs transition-colors ${msg.isFavorite ? 'text-amber-500' : 'text-[#86868b] dark:text-slate-400'}`} /> {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                                </button>
                                {canDelete && (
                                    <>
                                        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                        <button onClick={() => onEditClick(msg)} className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-sky-50 dark:hover:bg-sky-500/20 first:rounded-t-xl last:rounded-b-xl">
                                            <FaPencilAlt size={10} className="text-[#0071e3] drop-shadow-xs" /> Editar
                                        </button>
                                        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                        <button onClick={() => onDeleteMessage(msg.messageId)} className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 first:rounded-t-xl last:rounded-b-xl">
                                            <FaTrash size={10} className="drop-shadow-xs" /> Apagar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {msg.image && (
                            <img onClick={() => onImageClick(msg.image)} src={msg.image} alt="Sent" className="max-w-[240px] mb-1 mt-0.5 object-cover rounded-md border border-white/20 dark:border-white/5 cursor-pointer hover:opacity-90 transition-opacity" />
                        )}
                        {msg.text && <p className="text-[13px] leading-[1.25] break-words whitespace-pre-wrap">{msg.text}</p>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 px-1 w-full justify-end">
                        <button
                            onClick={() => onToggleLike(msg.messageId)}
                            className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-all border ${
                                (msg.likes && msg.likes.includes(currentUserId))
                                    ? '!opacity-100 !text-red-500 dark:!text-red-400 !bg-red-50 dark:!bg-red-950/40 !border-red-100 dark:!border-red-900/40 shadow-xs'
                                    : (msg.likes && msg.likes.length > 0)
                                        ? 'opacity-100 bg-white dark:bg-slate-700 text-[#86868b] dark:text-slate-400 border-gray-200 dark:border-slate-600 shadow-xs hover:bg-black/5 dark:hover:bg-slate-600'
                                        : 'opacity-0 group-hover/msg:opacity-100 border-transparent text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1d1d1f] dark:hover:text-[#f8fafc]'
                            }`}
                        >
                            {(msg.likes && msg.likes.includes(currentUserId)) ? <FaHeart size={10} className="drop-shadow-xs" /> : <FaRegHeart size={10} />}
                            {msg.likes && msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                        </button>
                        <span className="text-[10px] font-medium flex items-center gap-1.5 text-[#86868b] dark:text-slate-400">
                            {mockRoles && mockRoles[msg.sender] === 'Dono' && (
                                <span className="inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 bg-gradient-to-b from-amber-400 to-amber-500 text-amber-800">
                                    <FaCrown size={8} /> DONO
                                </span>
                            )}
                            {mockRoles && mockRoles[msg.sender] === 'Moderador' && (
                                <span className="inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-blue-200 bg-gradient-to-b from-blue-200 to-blue-100 text-blue-700">
                                    <FaShieldAlt size={8} /> MOD
                                </span>
                            )}
                            {msgTime} {msg.isEdited && "(editada)"} <span className="text-[10px] ml-0.5 text-sky-500">✓✓</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={innerRef} className="px-3 py-0.5 flex justify-start gap-2 group animate-fade-in-up relative z-1 hover:z-50" style={{ zIndex: openMenuId === msg.messageId ? 9999 : undefined, position: openMenuId === msg.messageId ? 'relative' : undefined }}>
            <UserAvatar src={msg.avatar} name={msg.sender} onClick={() => onAvatarClick(msg)} size="sm" className="mt-1 transition-opacity hover:opacity-80 cursor-pointer" />
            <div className="flex flex-col max-w-[80%] items-start group/msg relative z-1 hover:z-50">
                <span className="text-[11.5px] font-bold flex items-center gap-1.5 mb-0.5 ml-1 leading-none text-[#1d1d1f] dark:text-[#f8fafc]">
                    {msg.sender}
                    {mockRoles && mockRoles[msg.sender] === 'Dono' && (
                        <span className="inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 bg-gradient-to-b from-amber-400 to-amber-500 text-amber-800">
                            <FaCrown size={8} /> DONO
                        </span>
                    )}
                    {mockRoles && mockRoles[msg.sender] === 'Moderador' && (
                        <span className="inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-blue-200 bg-gradient-to-b from-blue-200 to-blue-100 text-blue-700">
                            <FaShieldAlt size={8} /> MOD
                        </span>
                    )}
                </span>
                <div className={`px-3 py-1.5 flex flex-col relative transition-all duration-300 rounded-[14px] rounded-tl-[2px] skeuo-bubble-received ${matchClass}`}>
                    <div onMouseEnter={() => setOpenMenuId(msg.messageId)} onMouseLeave={() => setOpenMenuId(null)} className="message-bubble-actions absolute top-2 left-full ml-2 z-10">
                        <button className="message-bubble-more-btn p-1 flex items-center justify-center rounded-full text-[#86868b] dark:text-slate-400 opacity-0 group-hover/msg:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer">
                            <FaEllipsisV size={12} className="drop-shadow-xs" />
                        </button>

                        <div className={`absolute top-0 left-full ml-2 min-w-[140px] flex flex-col rounded-xl bg-[#f4f5f7] dark:bg-slate-800 border border-black/5 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-200 z-[10000] ${openMenuId === msg.messageId ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}`}>
                            <button onClick={onToggleFavorite} className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10 first:rounded-t-xl last:rounded-b-xl">
                                <FaStar size={10} className={`drop-shadow-xs transition-colors ${msg.isFavorite ? 'text-amber-500' : 'text-[#86868b] dark:text-slate-400'}`} /> {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                            </button>
                            <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                            <button onClick={() => onReportClick({ type: 'message', target: msg })} className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 first:rounded-t-xl last:rounded-b-xl">
                                <FaFlag size={10} className="drop-shadow-xs" /> Denunciar
                            </button>
                        </div>
                    </div>
                    {msg.image && (
                        <img onClick={() => onImageClick(msg.image)} src={msg.image} alt="Sent" className="max-w-[240px] mb-1 mt-0.5 object-cover rounded-md border border-white/20 dark:border-white/5 cursor-pointer hover:opacity-90 transition-opacity" />
                    )}
                    {msg.text && <p className="text-[13px] leading-[1.25] break-words whitespace-pre-wrap text-[#1d1d1f] dark:text-[#f8fafc]">{msg.text}</p>}
                </div>
                <div className="flex items-center gap-2 mt-0.5 px-1 w-full justify-start ml-1">
                    <span className="text-[10px] font-medium flex items-center gap-1.5 text-[#86868b] dark:text-slate-400">{msgTime} {msg.isEdited && "(editada)"}</span>
                    <button
                        onClick={() => onToggleLike(msg.messageId)}
                        className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-all border ${
                            (msg.likes && msg.likes.includes(currentUserId))
                                ? '!opacity-100 !text-red-500 dark:!text-red-400 !bg-red-50 dark:!bg-red-950/40 !border-red-100 dark:!border-red-900/40 shadow-xs'
                                : (msg.likes && msg.likes.length > 0)
                                    ? 'opacity-100 bg-white dark:bg-slate-700 text-[#86868b] dark:text-slate-400 border-gray-200 dark:border-slate-600 shadow-xs hover:bg-black/5 dark:hover:bg-slate-600'
                                    : 'opacity-0 group-hover/msg:opacity-100 border-transparent text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1d1d1f] dark:hover:text-[#f8fafc]'
                        }`}
                    >
                        {(msg.likes && msg.likes.includes(currentUserId)) ? <FaHeart size={10} className="drop-shadow-xs" /> : <FaRegHeart size={10} />}
                        {msg.likes && msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Chat = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const room = queryParams.get('room');

    const [currentRoom, setCurrentRoom] = useState(null);
    const [roomLoading, setRoomLoading] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobileMembersOpen, setIsMobileMembersOpen] = useState(false);

    const [hasJoined, setHasJoined] = useState(() => {
        try {
            const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
            return joinedRooms.includes(room);
        } catch {
            return false;
        }
    });

    useEffect(() => {
        try {
            const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
            setHasJoined(joinedRooms.includes(room));
        } catch {
            setHasJoined(false);
        }
    }, [room]);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
    const messageRefs = useRef({});

    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState("");
    const [openMenuId, setOpenMenuId] = useState(null);

    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchResults([]);
            setSearchError("");
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setSearchLoading(true);
            setSearchError("");
            try {
                const results = await apiRequest(`/rooms/${room}/messages/search?q=${encodeURIComponent(searchTerm.trim())}`);
                setSearchResults(results.map(r => ({ id: r.id })));
                setCurrentSearchIndex(0);
            } catch (error) {
                console.error("Erro na busca:", error);
                setSearchError("Não foi possível buscar mensagens.");
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, room]);

    useEffect(() => {
        setCurrentSearchIndex(0);
    }, [normalizedSearchTerm, messages.length]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.message-bubble-actions')) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);


    useEffect(() => {
        if (searchOpen && searchResults.length > 0) {
            const resultMsg = searchResults[currentSearchIndex];
            if (resultMsg && messageRefs.current[resultMsg.id]) {
                messageRefs.current[resultMsg.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [searchOpen, currentSearchIndex, searchResults]);

    const handleNextSearch = () => {
        if (searchResults.length === 0) return;
        setCurrentSearchIndex((prev) => (prev + 1) % searchResults.length);
    };

    const handlePrevSearch = () => {
        if (searchResults.length === 0) return;
        setCurrentSearchIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    };
    const [imagePreview, setImagePreview] = useState(null);
    const [mockRoles, setMockRoles] = useState(() => {
        return JSON.parse(localStorage.getItem(`chat_roles_${room}`) || '{}');
    });

    const [reportModalData, setReportModalData] = useState(null);
    const [reportReason, setReportReason] = useState('Spam');
    const [reportDetails, setReportDetails] = useState('');

    const handleReportSubmit = (e) => {
        e.preventDefault();
        alert(`Denúncia simulada enviada ao servidor!\nTipo: ${reportModalData.type}\nMotivo: ${reportReason}`);
        setReportModalData(null);
        setReportReason('Spam');
        setReportDetails('');
    };

    const handleRoleChange = (sender, newRole) => {
        setMockRoles(prev => {
            const updated = { ...prev, [sender]: newRole };
            localStorage.setItem(`chat_roles_${room}`, JSON.stringify(updated));
            return updated;
        });
    };
    const [onlinePresence, setOnlinePresence] = useState({ users: [], count: 0 });
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [privateInvite, setPrivateInvite] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [roomFullError, setRoomFullError] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [pinnedMessage, setPinnedMessage] = useState({ text: "Bem-vindos! Lembrem-se de manter o respeito e ler as regras da sala.", sender: "Admin" });
    const [currentUserId, setCurrentUserId] = useState(() => localStorage.getItem('chat_uniqueUserId') || 'user_' + Math.random().toString(36).substr(2, 9));
    const fileInputRef = useRef(null);
    const chatContainerRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 2560;
                    const MAX_HEIGHT = 2560;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
                    setImagePreview(dataUrl);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const clearImagePreview = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const toggleFavorite = (index) => {
        setMessages(prev => {
            const updated = prev.map((m, i) => i === index ? { ...m, isFavorite: !m.isFavorite } : m);
            try {
                const messagesToSave = updated.slice(-50);
                localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messagesToSave));
            } catch (e) { }
            return updated;
        });
    };

    const deleteMessage = (messageId) => {
        socket.emit("delete_message", { room, messageId });
        setMessages(prev => {
            const updated = prev.filter(m => m.messageId !== messageId);
            try {
                const messagesToSave = updated.slice(-50);
                localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messagesToSave));
            } catch (e) { }
            return updated;
        });
    };

    const handleEditClick = (msg) => {
        setEditingMessageId(msg.messageId);
        setCurrentMessage(msg.text || "");
    };

    const cancelEdit = () => {
        setEditingMessageId(null);
        setCurrentMessage("");
    };

    const toggleLike = (messageId) => {
        socket.emit("toggle_like", { room, messageId, userId: currentUserId });

        setMessages(prev => {
            const updated = prev.map(m => {
                if (m.messageId === messageId) {
                    const likes = m.likes || [];
                    const hasLiked = likes.includes(currentUserId);
                    const newLikes = hasLiked ? likes.filter(id => id !== currentUserId) : [...likes, currentUserId];
                    return { ...m, likes: newLikes };
                }
                return m;
            });
            try { localStorage.setItem(`chat_messages_${room}`, JSON.stringify(updated.slice(-50))); } catch (e) { }
            return updated;
        });
    };

    const currentRoomRef = useRef(null);



    useEffect(() => {
        const loadRoomAndMessages = async () => {
            setRoomLoading(true);
            let roomDisplayName = room;

            try {
                const roomData = await apiRequest(`/rooms/${room}`);
                setCurrentRoom(roomData);
                roomDisplayName = roomData?.name || room;
            } catch (err) {
                console.error("Erro ao carregar detalhes da sala:", err);
                setCurrentRoom({ name: room });
            }

            try {
                const apiMessages = await apiRequest(`/rooms/${room}/messages`);
                const mappedMessages = Array.isArray(apiMessages) ? apiMessages.map(msg => ({
                    messageId: msg.id,
                    text: msg.content,
                    sender: msg.user_name || 'Usuário',
                    userId: msg.user_id,
                    isMe: msg.user_id === currentUserId,
                    time: msg.created_at,
                    image: msg.image_url || null,
                    avatar: null,
                    likes: [],
                    isFavorite: false,
                    isEdited: false
                })) : [];

                if (mappedMessages.length > 0) {
                    setMessages(mappedMessages);
                } else {
                    setMessages([{ messageId: "system-welcome", text: `Bem-vindo à sala ${roomDisplayName}!`, sender: "Sistema", isMe: false, time: new Date().toISOString() }]);
                }
            } catch (error) {
                console.error("Erro ao carregar mensagens da API:", error);
                const savedMessages = localStorage.getItem(`chat_messages_${room}`);
                if (savedMessages) {
                    try {
                        setMessages(JSON.parse(savedMessages));
                    } catch (e) {
                        console.error("Erro ao fazer parse de mensagens locais:", e);
                        setMessages([{ messageId: "system-error", text: "Não foi possível carregar as mensagens agora.", sender: "Sistema", isMe: false, time: new Date().toISOString() }]);
                    }
                } else {
                    setMessages([{ messageId: "system-error", text: "Não foi possível carregar as mensagens agora.", sender: "Sistema", isMe: false, time: new Date().toISOString() }]);
                }
            } finally {
                setRoomLoading(false);
            }
        };

        loadRoomAndMessages();
        currentRoomRef.current = room;
    }, [room, currentUserId]);

    useEffect(() => {
        if (currentRoomRef.current === room && messages.length > 0) {
            try {
                const messagesToSave = messages.slice(-50);
                localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messagesToSave));
            } catch (error) {
                console.error("Erro ao salvar mensagens:", error);
            }
        }
    }, [messages, room]);

    useEffect(() => {
        let userId = localStorage.getItem('chat_uniqueUserId');
        if (!userId) {
            userId = currentUserId;
            localStorage.setItem('chat_uniqueUserId', userId);
        }
        const storedName = localStorage.getItem('chat_displayName');
        const userName = (storedName && storedName !== 'null') ? storedName : 'Usuário';

        socket.emit("joinRoom", {
            roomId: room,
            user: { id: userId, name: userName }
        });

        socket.on("roomPresenceUpdated", (data) => {
            if (data.roomId === room) {
                setOnlinePresence({ users: data.onlineUsers, count: data.onlineCount });
            }
        });

        socket.on("room_full_error", (err) => {
            setRoomFullError(err.message);
        });

        socket.on("receive_private_invite", (data) => {
            setPrivateInvite(data);
        });

        socket.on("message_deleted", (data) => {
            setMessages(prev => {
                const updated = prev.filter(m => m.messageId !== data.messageId);
                try {
                    const messagesToSave = updated.slice(-50);
                    localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messagesToSave));
                } catch (e) { }
                return updated;
            });
        });

        socket.on("message_edited", (data) => {
            setMessages(prev => {
                const updated = prev.map(m => {
                    if (m.messageId === data.messageId) {
                        try {
                            // Código de criptografia
                            // Provisório! deve ser mudado para JWT e bcrypt no futuro
                            const bytes = CryptoJS.AES.decrypt(data.message, SECRET_KEY);
                            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
                            let text = decryptedString;
                            let image = m.image;
                            if (decryptedString) {
                                try {
                                    const parsed = JSON.parse(decryptedString);
                                    if (parsed.text !== undefined || parsed.image !== undefined) {
                                        text = parsed.text || "";
                                        image = parsed.image || null;
                                    }
                                } catch (e) { }
                            }
                            return { ...m, text, image, isEdited: true };
                        } catch (e) {
                            return { ...m, text: data.message, isEdited: true };
                        }
                    }
                    return m;
                });
                try {
                    const messagesToSave = updated.slice(-50);
                    localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messagesToSave));
                } catch (e) { }
                return updated;
            });
        });

        socket.on("like_toggled", (data) => {
            setMessages(prev => {
                const updated = prev.map(m => {
                    if (m.messageId === data.messageId) {
                        const likes = m.likes || [];
                        const hasLiked = likes.includes(data.userId);
                        const newLikes = hasLiked ? likes.filter(id => id !== data.userId) : [...likes, data.userId];
                        return { ...m, likes: newLikes };
                    }
                    return m;
                });
                try {
                    const messagesToSave = updated.slice(-50);
                    localStorage.setItem(`chat_messages_${room}`, JSON.stringify(messagesToSave));
                } catch (e) { }
                return updated;
            });
        });

        socket.on("receive_message", (data) => {
            setMessages((list) => {
                if (list.some(m => m.messageId === data.id)) return list;

                return [...list, {
                    messageId: data.id,
                    text: data.content,
                    image: data.image_url,
                    sender: data.user_name || 'Usuário',
                    userId: data.user_id,
                    avatar: null,
                    status: "Disponível",
                    isMe: data.user_id === currentUserId,
                    time: data.created_at,
                    readBy: [],
                    likes: []
                }];
            });
        });



        socket.on("message_read", (data) => {
            setMessages((list) => list.map(msg => {
                if (msg.messageId === data.messageId) {
                    const readBy = msg.readBy || [];
                    if (!readBy.includes(data.reader)) {
                        return { ...msg, readBy: [...readBy, data.reader] };
                    }
                }
                return msg;
            }));
        });

        socket.on("message_error", (data) => {
            alert(`Erro no Chat: ${data.error}`);
        });

        socket.on("rate_limit_error", (data) => {
            alert(`Aviso: ${data.error}`);
        });

        return () => {
            socket.emit("leaveRoom", { roomId: room, userId: localStorage.getItem('chat_uniqueUserId') || currentUserId });
            socket.off("roomPresenceUpdated");
            socket.off("receive_message");
            socket.off("message_read");
            socket.off("message_error");
            socket.off("rate_limit_error");
            socket.off("room_full_error");
            socket.off("message_deleted");
            socket.off("message_edited");
            socket.off("like_toggled");
        };
    }, [room, currentUserId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (currentMessage.trim() !== "" || imagePreview) {
            const storedName = localStorage.getItem('chat_displayName');
            const currentSender = (storedName && storedName !== 'null') ? storedName : 'Usuário';
            const currentPhoto = localStorage.getItem('chat_profilePhoto');
            const currentStatus = localStorage.getItem('chat_statusMessage') || "Disponível";

            if (editingMessageId) {
                const msgToEdit = messages.find(m => m.messageId === editingMessageId);
                const payload = JSON.stringify({ text: currentMessage, image: imagePreview || (msgToEdit ? msgToEdit.image : null) });
                const encryptedMessage = CryptoJS.AES.encrypt(payload, SECRET_KEY).toString();

                const editData = {
                    room: room,
                    messageId: editingMessageId,
                    message: encryptedMessage,
                    time: new Date().toISOString()
                };

                await socket.emit("edit_message", editData);
                setMessages((prev) => {
                    const updated = prev.map(m => m.messageId === editingMessageId ? { ...m, text: currentMessage, image: imagePreview || m.image, isEdited: true } : m);
                    try { localStorage.setItem(`chat_messages_${room}`, JSON.stringify(updated.slice(-50))); } catch (e) { }
                    return updated;
                });

                setCurrentMessage("");
                setImagePreview(null);
                setEditingMessageId(null);
            } else {
                const messageData = {
                    room: room,
                    userId: currentUserId,
                    userName: currentSender,
                    content: currentMessage,
                    imageUrl: imagePreview || null
                };

                socket.emit("send_message", messageData);

                setCurrentMessage("");
                setImagePreview(null);
            }
        }
    };

    const handleDeleteRoom = async () => {
        if (!window.confirm("Atenção! Você é o dono desta sala. Tem certeza que deseja excluí-la permanentemente? Todas as mensagens serão perdidas.")) {
            return;
        }

        try {
            await apiRequest(`/rooms/${room}`, { method: 'DELETE' });
            alert("Sala excluída com sucesso.");
            navigate('/rooms');
        } catch (error) {
            console.error("Erro ao excluir sala:", error);
            alert("Não foi possível excluir a sala: " + (error.message || "Erro desconhecido"));
        }
    };

    if (!room) {
        return (
            <main className="reveal flex-grow flex items-center justify-center px-6">
                <div className="skeuo-panel p-10 max-w-[400px] w-full text-center">
                    <h1 className="hero-title text-[#1d1d1f] dark:text-[#f8fafc] text-[28px] font-semibold mb-2">Sala inválida</h1>
                    <p className="text-[#86868b] dark:text-slate-400 text-[15px] mb-8">Nenhuma sala foi informada.</p>
                    <button onClick={() => navigate('/rooms')} className="skeuo-btn w-full py-3 text-[15px]">
                        Voltar para Salas
                    </button>
                </div>
            </main>
        );
    }

    if (roomLoading) {
        return (
            <SkeuoLoading
                title="Carregando conversa..."
                subtitle="Sincronizando sala, mensagens e membros."
                variant="chat"
            />
        );
    }

    if (roomFullError) {
        return (
            <main className="reveal flex-grow flex items-center justify-center px-6">
                <div className="skeuo-panel animate-fade-in-up p-10 max-w-[400px] w-full text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-[36px] shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] bg-red-50 text-red-500 border border-red-100 dark:bg-red-500/10 dark:border-red-500/20">
                        <FaSignOutAlt />
                    </div>
                    <h1 className="hero-title text-[#1d1d1f] dark:text-[#f8fafc] text-[28px] font-semibold mb-2">
                        Acesso Negado
                    </h1>
                    <p className="text-[#86868b] dark:text-slate-400 leading-relaxed text-[15px] mb-8">
                        {roomFullError}
                    </p>
                    <button onClick={() => navigate('/rooms')} className="skeuo-btn w-full py-3 text-[15px]">Voltar para Salas</button>
                </div>
            </main>
        );
    }

    if (!hasJoined && !roomFullError) {
        return (
            <main className="reveal flex-grow flex items-center justify-center px-6">
                <div className="skeuo-panel animate-fade-in-up p-10 max-w-[400px] w-full text-center">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-[36px] shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] bg-[#f4f5f7] text-[#86868b] border border-black/5 dark:bg-[#1e293b] dark:border-white/5 dark:text-slate-400">
                        <FaSignOutAlt />
                    </div>

                    <h1 className="hero-title text-[#1d1d1f] dark:text-[#f8fafc] text-[28px] font-semibold mb-2">
                        Entrar na Sala
                    </h1>

                    <p className="text-[#86868b] dark:text-slate-400 tracking-tight leading-snug text-[15px] mb-8">
                        Você está prestes a entrar nesta sala de bate-papo. Deseja continuar?
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
                                if (!joinedRooms.includes(room)) {
                                    joinedRooms.push(room);
                                    localStorage.setItem('chat_joinedRooms', JSON.stringify(joinedRooms));
                                }
                                setHasJoined(true);
                            }}
                            className="skeuo-btn font-medium w-full py-3 text-[15px]"
                        >
                            Entrar na Sala
                        </button>

                        <button
                            onClick={() => {
                                setRoomFullError(false);
                                navigate('/rooms');
                            }}
                            className="w-full py-3 text-base font-medium rounded-xl text-red-500 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <>
            {selectedImage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 rounded-full p-2 text-white bg-white/10 hover:bg-white/20 transition-colors">
                        <FaTimes size={20} />
                    </button>
                    <img src={selectedImage} alt="Full Screen" className="max-w-[90vw] max-h-[90vh] object-contain rounded-xs shadow-2xl" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            {selectedUser && selectedUser.sender !== "Sistema" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in" onClick={() => setSelectedUser(null)}>
                    <div className="skeuo-panel animate-fade-in-up p-8 max-w-[350px] w-full text-center relative" onClick={(e) => e.stopPropagation()}>
                        <UserAvatar src={selectedUser.avatar} name={selectedUser.sender} size="2xl" className="mx-auto mb-4 border-2 border-white dark:border-white/20 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.18)]" />
                        <h3 className="text-[22px] font-semibold mb-1 flex items-center justify-center gap-2 text-[#1d1d1f] dark:text-[#f8fafc]">
                            {selectedUser.sender}
                            {mockRoles[selectedUser.sender] === 'Dono' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] leading-none font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20 bg-gradient-to-b from-amber-400 to-amber-500 text-amber-800">
                                    <FaCrown size={10} className="shrink-0" aria-hidden="true" />
                                    Dono
                                </span>
                            )}
                            {mockRoles[selectedUser.sender] === 'Moderador' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] leading-none font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-blue-200 bg-gradient-to-b from-blue-200 to-blue-100 text-blue-700">
                                    <FaShieldAlt size={10} className="shrink-0" aria-hidden="true" />
                                    Mod
                                </span>
                            )}
                        </h3>
                        <p className="text-[15px] mb-6 text-[#86868b] dark:text-slate-400">{selectedUser.status || "Sem recado"}</p>

                        <div className="p-4 rounded-xl mb-6 text-left border bg-black/5 border-black/5 dark:border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]">
                            <label className="block text-[11px] font-bold uppercase tracking-widest mb-2 text-[#86868b] dark:text-slate-400">Cargos e Moderação</label>
                            <select
                                value={mockRoles[selectedUser.sender] || 'Usuário'}
                                onChange={(e) => handleRoleChange(selectedUser.sender, e.target.value)}
                                className="skeuo-input w-full px-3 py-2 text-[14px] cursor-pointer mb-3 bg-white dark:bg-slate-800"
                            >
                                <option value="Usuário">👤 Usuário Comum</option>
                                <option value="Moderador">🛡️ Moderador da Sala</option>
                                <option value="Dono">👑 Dono da Sala</option>
                            </select>

                            <div className="flex gap-2 flex-wrap">
                                <button className="flex-1 btn-secondary-glossy py-1.5 text-[12px] whitespace-nowrap text-red-500 opacity-50 cursor-not-allowed" disabled>Silenciar (Em breve)</button>
                                <button className="flex-1 btn-secondary-glossy py-1.5 text-[12px] whitespace-nowrap text-red-500 opacity-50 cursor-not-allowed" disabled>Banir (Em breve)</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                            {selectedUser.sender !== ((localStorage.getItem('chat_displayName') && localStorage.getItem('chat_displayName') !== 'null') ? localStorage.getItem('chat_displayName') : 'Usuário') && (
                                <button onClick={() => {
                                    const storedName = localStorage.getItem('chat_displayName');
                                    const currentUser = (storedName && storedName !== 'null') ? storedName : 'Usuário';
                                    const targetId = selectedUser.userId || selectedUser.sender;
                                    const privateRoomName = `privado-${[currentUserId, targetId].sort().join('-')}`;

                                    const savedRooms = JSON.parse(localStorage.getItem('chat_customRooms') || '[]');
                                    if (!savedRooms.find(r => r.roomParam === privateRoomName)) {
                                        savedRooms.push({
                                            title: `Chat Privado: ${selectedUser.sender}`,
                                            description: `Mensagens diretas.`,
                                            roomParam: privateRoomName,
                                            category: "Privado",
                                            status: "Ativa",
                                            members: 2,
                                            date: new Date().toLocaleDateString('pt-BR')
                                        });
                                        localStorage.setItem('chat_customRooms', JSON.stringify(savedRooms));
                                    }

                                    socket.emit("private_invite", {
                                        to: targetId,
                                        from: currentUser,
                                        room: privateRoomName,
                                        senderId: currentUserId
                                    });

                                    navigate(`/chat?room=${privateRoomName}`);
                                    setSelectedUser(null);
                                rebellion:
                                    setSelectedUser(null);
                                }} className="btn-secondary-glossy w-full py-2 flex items-center justify-center gap-2 text-[#0071e3] hover:bg-[#e6f0ff]">
                                    <FaCommentAlt size={12} /> Mensagem Privada
                                </button>
                            )}
                            <div className="flex gap-3">
                                <button onClick={() => setReportModalData({ type: 'user', target: selectedUser })} className="btn-secondary-glossy flex-1 py-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-100">
                                    <FaFlag size={12} /> Denunciar
                                </button>
                                <button onClick={() => setSelectedUser(null)} className="skeuo-btn flex-1 py-2">Fechar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {reportModalData && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setReportModalData(null)}>
                </div>
            )}

            <div className="animate-chat-shell flex w-full h-[calc(100vh-48px)] overflow-hidden">
                <ChatSidebar isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
                <main className="animate-chat-panel-main flex-1 min-w-0 flex flex-col h-full relative bg-[#f8fafc] dark:bg-[#020617]">
                    <div className="absolute top-0 left-0 right-0 h-1 z-10 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 dark:from-sky-600 dark:via-sky-700 dark:to-sky-600 shadow-[0_1px_2px_rgba(14,165,233,0.3)]" />

                    <div className="px-4 py-2.5 flex items-center justify-between shrink-0 border-b border-[#d2d2d7] dark:border-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a]">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center text-[#86868b] dark:text-[#94a3b8] hover:text-[#0071e3] transition-colors rounded-full active:bg-black/5 dark:active:bg-white/5">
                                <FaBars size={16} />
                            </button>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center hidden sm:flex overflow-hidden bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] border border-sky-500">
                                {currentRoom && currentRoom.image_url ? (
                                    <img src={currentRoom.image_url} alt="Room Icon" className="w-full h-full object-cover" />
                                ) : (
                                    <FaCommentAlt size={12} />
                                )}
                            </div>
                            <div className="flex flex-col justify-center">
                                <h2 className="font-bold text-[15px] leading-tight text-[#1d1d1f] dark:text-[#f8fafc]">
                                    {roomLoading ? "Carregando..." : (currentRoom ? currentRoom.name : "Sala não encontrada")}
                                </h2>
                                <p className="text-[11px] flex items-center gap-1.5 mt-0.5 text-[#86868b] dark:text-slate-400">
                                    <span className="flex items-center gap-1 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]" />
                                        {Number.isFinite(onlinePresence?.count) ? onlinePresence.count : 0} online
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={() => setIsMobileMembersOpen(true)}
                                className="xl:hidden w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border border-gray-200/50 dark:border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-600 dark:text-slate-300 hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
                                title="Ver membros"
                            >
                                <FaUsers size={14} className="text-gray-500 dark:text-slate-400" />
                            </button>
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                    searchOpen
                                        ? '!bg-gradient-to-b !from-sky-400 !to-sky-600 dark:!from-sky-600 dark:!to-sky-800 !text-white !border-transparent !shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]'
                                        : 'border border-gray-200/50 dark:border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-600 dark:text-slate-300 hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 dark:hover:from-slate-600 dark:hover:to-slate-700'
                                }`}
                                title="Buscar mensagens"
                            >
                                <FaSearch size={14} className={searchOpen ? 'text-white' : 'text-gray-500 dark:text-slate-400'} />
                            </button>
                            <button
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                    showFavoritesOnly
                                        ? '!bg-gradient-to-b !from-sky-400 !to-sky-600 dark:!from-sky-600 dark:!to-sky-800 !text-white !border-transparent !shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]'
                                        : 'border border-gray-200/50 dark:border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-600 dark:text-slate-300 hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 dark:hover:from-slate-600 dark:hover:to-slate-700'
                                }`}
                                title={showFavoritesOnly ? "Mostrar todas as mensagens" : "Mostrar apenas favoritas"}
                            >
                                <FaStar size={14} className={showFavoritesOnly ? 'text-white' : 'text-gray-500 dark:text-slate-400'} />
                            </button>
                            <button
                                onClick={() => navigate('/rooms')}
                                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border border-gray-200/50 dark:border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-600 dark:text-slate-300 hover:!from-rose-50 hover:!to-rose-100 hover:!text-rose-600 dark:hover:!from-rose-950/40 dark:hover:!to-rose-950/60 dark:hover:!text-rose-400 transition-all"
                                title="Sair da sala"
                            >
                                <FaSignOutAlt size={14} className="text-gray-500 hover:text-rose-500" />
                            </button>
                            {currentRoom && currentRoom.created_by === currentUserId && (
                                <button
                                    onClick={handleDeleteRoom}
                                    className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border border-gray-200/50 dark:border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                    title="Excluir Sala (Apenas Dono)"
                                >
                                    <FaTrash size={14} className="text-rose-500" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={`overflow-hidden shrink-0 z-10 transition-all duration-300 ease-out bg-[#f5f5f7]/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xs border-b ${searchOpen ? 'max-h-20 py-2 opacity-100 translate-y-0 border-b-[#d2d2d7] dark:border-b-white/5' : 'max-h-0 py-0 opacity-0 -translate-y-2 border-b-transparent pointer-events-none'}`}>
                        <div className="px-4 flex items-center gap-3">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] dark:text-slate-400" size={12} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar mensagens..."
                                    className="skeuo-input w-full px-8 py-1.5 text-[13px] rounded-full"
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer">
                                        <FaTimes size={12} />
                                    </button>
                                )}
                            </div>
                            {searchResults.length > 0 ? (
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-[11px] whitespace-nowrap text-[#86868b] dark:text-slate-400">
                                        {currentSearchIndex + 1} de {searchResults.length}
                                    </span>
                                    <div className="border border-[#d2d2d7] dark:border-white/10 rounded-full shadow-xs flex items-center overflow-hidden">
                                        <button onClick={handlePrevSearch} className="px-2 py-1 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#86868b] dark:text-slate-400 transition-colors first:border-r first:border-[#d2d2d7] dark:first:border-r-white/10 cursor-pointer" title="Resultado anterior">
                                            <FaChevronUp size={10} />
                                        </button>
                                        <button onClick={handleNextSearch} className="px-2 py-1 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#86868b] dark:text-slate-400 transition-colors cursor-pointer" title="Próximo resultado">
                                            <FaChevronDown size={10} />
                                        </button>
                                    </div>
                                </div>
                            ) : searchLoading ? (
                                <span className="font-medium text-[11px] whitespace-nowrap text-[#86868b] dark:text-slate-400">Buscando...</span>
                            ) : searchError ? (
                                <span className="font-medium text-[11px] whitespace-nowrap text-red-500 dark:text-red-400">{searchError}</span>
                            ) : searchTerm ? (
                                <span className="font-medium text-[11px] whitespace-nowrap text-[#86868b] dark:text-slate-400">Nenhuma mensagem encontrada</span>
                            ) : null}
                            <button onClick={() => { setSearchOpen(false); setSearchTerm(''); }} className="font-medium text-xs whitespace-nowrap text-[#0071e3] hover:underline transition-colors cursor-pointer">
                                Fechar
                            </button>
                        </div>
                    </div>

                    {pinnedMessage && (
                        <div className="px-4 pt-3 shrink-0">
                            <div className="relative p-2.5 flex items-start gap-3 rounded-lg border border-amber-200/80 dark:border-amber-700/50 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/40 dark:to-amber-950/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)]">
                                <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-b from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 border border-amber-300 dark:border-amber-500 shadow-[0_1px_3px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4)]">
                                    <FaThumbtack className="w-2.5 h-2.5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-[11px] text-amber-900 dark:text-amber-200">{pinnedMessage.sender}</span>
                                        </div>
                                        <button onClick={() => setPinnedMessage(null)} className="p-0.5 rounded-full shrink-0 flex items-center justify-center text-amber-800/50 hover:text-amber-700 hover:bg-amber-100 dark:text-amber-400/50 dark:hover:text-amber-300 dark:hover:bg-amber-900/50 transition-colors cursor-pointer">
                                            <FaTimes size={10} />
                                        </button>
                                    </div>
                                    <p className="text-[12.5px] leading-[1.375] text-amber-800 dark:text-amber-100">{pinnedMessage.text}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatContainerRef} className="chat-container flex-grow overflow-y-auto pt-2 pr-2 mb-2 space-y-0.5">

                        {messages.length === 0 && !showFavoritesOnly && (
                            <div className="opacity-80 animate-fade-in-up flex flex-col items-center justify-center h-full min-h-[250px] text-center px-4">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-b from-gray-50 to-gray-200 border border-[#d2d2d7] shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.05)] text-[#86868b] dark:text-slate-400">
                                    <FaComments size={24} className="drop-shadow-xs text-[#0071e3]/60" />
                                </div>
                                <h3 className="text-[15px] font-semibold mb-1 text-[#1d1d1f] dark:text-[#f8fafc]">Nenhuma mensagem ainda</h3>
                                <p className="text-[13px] text-[#86868b] dark:text-slate-400">Seja o primeiro a conversar nesta sala.</p>
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            if (showFavoritesOnly && !msg.isFavorite) return null;
                            const isCurrentSearch = searchResults.length > 0 && searchResults[currentSearchIndex]?.id === msg.messageId;
                            return (
                                <div key={index} className="animate-fade-in-up" style={{ zIndex: openMenuId === msg.messageId ? 9999 : 1, position: 'relative' }}>
                                    <MessageBubble
                                        msg={msg}
                                        innerRef={(el) => messageRefs.current[msg.messageId] = el}
                                        onAvatarClick={setSelectedUser}
                                        onImageClick={setSelectedImage}
                                        onToggleFavorite={() => toggleFavorite(index)}
                                        onDeleteMessage={deleteMessage}
                                        onEditClick={handleEditClick}
                                        onToggleLike={toggleLike}
                                        currentUserId={currentUserId}
                                        mockRoles={mockRoles}
                                        onReportClick={setReportModalData}
                                        searchTerm={normalizedSearchTerm}
                                        isCurrentSearch={isCurrentSearch}
                                        openMenuId={openMenuId}
                                        setOpenMenuId={setOpenMenuId}
                                    />
                                </div>
                            );
                        })}

                        {showFavoritesOnly && messages.filter(msg => msg.isFavorite).length === 0 && (
                            <div className="text-center mt-10 text-sm text-[#86868b] dark:text-slate-400">
                                Você ainda não tem nenhuma mensagem favorita nesta sala.
                            </div>
                        )}

                    </div>

                    <footer className="shrink-0 relative p-3 border-t border-[#d2d2d7] dark:border-t-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a]">
                        {imagePreview && !editingMessageId && (
                            <div className="absolute left-0 bottom-[calc(100%+10px)] p-2 flex items-center gap-2 z-10 skeuo-panel shadow-lg animate-fade-in-up">
                                <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
                                <button type="button" onClick={clearImagePreview} className="p-1.5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-[#1d1d1f] transition-colors cursor-pointer">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}
                        {editingMessageId && (
                            <div className="absolute left-0 bottom-[calc(100%+10px)] p-2 flex items-center gap-2 z-10 px-4 text-sm skeuo-panel shadow-lg animate-fade-in-up text-[#86868b] dark:text-slate-400 font-medium">
                                <FaPencilAlt /> Editando mensagem...
                                <button type="button" onClick={() => { setEditingMessageId(null); setCurrentMessage(""); setImagePreview(null); }} className="p-1.5 flex items-center justify-center ml-2 rounded-full bg-gray-200 hover:bg-gray-300 text-[#1d1d1f] transition-colors cursor-pointer">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}
                        <form onSubmit={sendMessage} className="flex gap-2">
                            <label className="w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer rounded-full bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 dark:from-slate-700 dark:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-700 text-[#86868b] hover:text-[#1d1d1f] dark:text-slate-300 dark:hover:text-white border border-gray-200 dark:border-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)] transition-all">
                                <FaCamera size={14} className="drop-shadow-xs" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            <input
                                type="text"
                                className="skeuo-input w-full px-4 py-2 flex-grow"
                                placeholder={editingMessageId ? "Editar mensagem..." : "Digite uma mensagem..."}
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!currentMessage.trim() && !imagePreview}
                                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[0_2px_4px_rgba(14,165,233,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all enabled:hover:scale-105 enabled:active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale cursor-pointer"
                                title={editingMessageId ? "Salvar Edição" : "Enviar Mensagem"}
                            >
                                <FaPaperPlane size={12} className="ml-[-2px]" />
                            </button>
                        </form>
                    </footer>
                </main>
                <MembersSidebar
                    roomId={room}
                    currentUserId={currentUserId}
                    onlineUsers={onlinePresence.users}
                    onlineCount={onlinePresence.count}
                    isMobileOpen={isMobileMembersOpen}
                    onClose={() => setIsMobileMembersOpen(false)}
                />
            </div>

            {privateInvite && (
                <div className="fixed bottom-6 right-6 z-[200] skeuo-panel p-4 animate-fade-in-up border-l-4 border-[#0071e3] shadow-2xl w-80">
                    <h4 className="text-[14px] font-bold text-[#1d1d1f] mb-1">Convite de Chat Privado</h4>
                    <p className="text-[13px] text-[#86868b] mb-4">
                        <strong className="text-[#1d1d1f]">{privateInvite.from}</strong> quer conversar com você no privado.
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => {
                            const savedRooms = JSON.parse(localStorage.getItem('chat_customRooms') || '[]');
                            if (!savedRooms.find(r => r.roomParam === privateInvite.room)) {
                                savedRooms.push({
                                    title: `Chat Privado: ${privateInvite.from}`,
                                    description: `Mensagens diretas.`,
                                    roomParam: privateInvite.room,
                                    category: "Privado",
                                    status: "Ativa",
                                    members: 2,
                                    date: new Date().toLocaleDateString('pt-BR')
                                });
                                localStorage.setItem('chat_customRooms', JSON.stringify(savedRooms));
                            }
                            navigate(`/chat?room=${privateInvite.room}`);
                            setPrivateInvite(null);
                        }} className="skeuo-btn flex-1 py-1.5 text-[12px]">Aceitar</button>
                        <button onClick={() => setPrivateInvite(null)} className="btn-secondary-glossy flex-1 py-1.5 text-[12px]">Recusar</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chat;