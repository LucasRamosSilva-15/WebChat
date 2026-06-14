import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';
import { FaPaperPlane, FaCamera, FaTimes, FaStar, FaSignOutAlt, FaTrash, FaPencilAlt, FaHeart, FaRegHeart, FaThumbtack, FaEllipsisV, FaFlag, FaCommentAlt, FaCrown, FaShieldAlt, FaUser, FaComments, FaSearch, FaChevronUp, FaChevronDown } from 'react-icons/fa';
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

const MessageBubble = ({ msg, onAvatarClick, onImageClick, onToggleFavorite, onDeleteMessage, onEditClick, onToggleLike, currentUserId, mockRoles, onReportClick, searchTerm, isCurrentSearch, innerRef }) => {
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
            <div ref={innerRef} className="message-bubble-row px-3 py-0.5 flex message-bubble-row-own justify-end group animate-fade-in-up">
                <div className="message-bubble-wrapper flex flex-col max-w-[80%] message-bubble-wrapper-own items-end group/msg">
                    <div className={`message-bubble-card px-3 py-1.5 flex flex-col relative message-bubble-card-own skeuo-bubble-sent ${matchClass}`}>
                        <div className="message-bubble-actions message-bubble-actions-own">
                            <button className="message-bubble-more-btn p-1 flex items-center justify-center">
                                <FaEllipsisV size={12} className="drop-shadow-sm" />
                            </button>

                            <div className="message-bubble-menu flex flex-col overflow-hidden">
                                <button onClick={onToggleFavorite} className="message-bubble-menu-item px-3 py-2 text-left text-xs whitespace-nowrap flex items-center gap-2">
                                    <FaStar size={10} className={`message-favorite-menu-icon ${msg.isFavorite ? 'message-favorite-menu-icon-active' : ''}`} /> {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                                </button>
                                {canDelete && (
                                    <>
                                        <div className="message-bubble-menu-divider h-[1px] w-full"></div>
                                        <button onClick={() => onEditClick(msg)} className="message-bubble-menu-item message-bubble-menu-item-edit px-3 py-2 text-left text-xs whitespace-nowrap flex items-center gap-2">
                                            <FaPencilAlt size={10} className="message-edit-menu-icon" /> Editar
                                        </button>
                                        <div className="message-bubble-menu-divider h-[1px] w-full"></div>
                                        <button onClick={() => onDeleteMessage(msg.messageId)} className="message-bubble-menu-item message-bubble-menu-item-danger px-3 py-2 text-left text-xs whitespace-nowrap flex items-center gap-2">
                                            <FaTrash size={10} className="drop-shadow-sm" /> Apagar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {msg.image && (
                            <img onClick={() => onImageClick(msg.image)} src={msg.image} alt="Sent" className="message-bubble-image max-w-[240px] mb-1 mt-0.5 object-cover" />
                        )}
                        {msg.text && <p className="message-bubble-text text-[13px] leading-[1.25] break-words whitespace-pre-wrap">{msg.text}</p>}
                    </div>
                    <div className="message-bubble-footer flex items-center gap-2 mt-0.5 px-1 w-full message-bubble-footer-own justify-end">
                        <button onClick={() => onToggleLike(msg.messageId)} className={`message-bubble-like-btn flex items-center gap-1 text-[10px] px-1.5 py-0.5 ${(msg.likes && msg.likes.length > 0) ? 'message-bubble-like-btn-visible' : ''} ${(msg.likes && msg.likes.includes(currentUserId)) ? 'message-bubble-like-btn-active' : ''}`}>
                            {(msg.likes && msg.likes.includes(currentUserId)) ? <FaHeart size={10} className="drop-shadow-sm" /> : <FaRegHeart size={10} />}
                            {msg.likes && msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                        </button>
                        <span className="message-bubble-time text-[10px] font-medium flex items-center gap-1.5">
                            {mockRoles && mockRoles[msg.sender] === 'Dono' && (
                                <span className="message-role-badge inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 rounded-full font-bold uppercase tracking-wide message-role-badge-owner">
                                    <FaCrown size={8} /> DONO
                                </span>
                            )}
                            {mockRoles && mockRoles[msg.sender] === 'Moderador' && (
                                <span className="message-role-badge inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 rounded-full font-bold uppercase tracking-wide message-role-badge-mod">
                                    <FaShieldAlt size={8} /> MOD
                                </span>
                            )}
                            {msgTime} {msg.isEdited && "(editada)"} <span className="message-read-indicator text-[10px] ml-0.5">✓✓</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={innerRef} className="message-bubble-row px-3 py-0.5 flex message-bubble-row-other justify-start gap-2 group animate-fade-in-up">
            <UserAvatar src={msg.avatar} name={msg.sender} onClick={() => onAvatarClick(msg)} size="sm" className="message-avatar-interactive mt-1" />
            <div className="message-bubble-wrapper flex flex-col max-w-[80%] message-bubble-wrapper-other items-start group/msg">
                <span className="message-bubble-author text-[11.5px] flex items-center gap-1.5 mb-0.5 ml-1 leading-none">
                    {msg.sender}
                    {mockRoles && mockRoles[msg.sender] === 'Dono' && (
                        <span className="message-role-badge inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 rounded-full font-bold uppercase tracking-wide message-role-badge-owner">
                            <FaCrown size={8} /> DONO
                        </span>
                    )}
                    {mockRoles && mockRoles[msg.sender] === 'Moderador' && (
                        <span className="message-role-badge inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 rounded-full font-bold uppercase tracking-wide message-role-badge-mod">
                            <FaShieldAlt size={8} /> MOD
                        </span>
                    )}
                </span>
                <div className={`message-bubble-card px-3 py-1.5 flex flex-col relative message-bubble-card-other skeuo-bubble-received ${matchClass}`}>
                    <div className="message-bubble-actions message-bubble-actions-other">
                        <button className="message-bubble-more-btn p-1 flex items-center justify-center">
                            <FaEllipsisV size={12} className="drop-shadow-sm" />
                        </button>

                        <div className="message-bubble-menu flex flex-col overflow-hidden">
                            <button onClick={onToggleFavorite} className="message-bubble-menu-item px-3 py-2 text-left text-xs whitespace-nowrap flex items-center gap-2">
                                <FaStar size={10} className={`message-favorite-menu-icon drop-shadow-sm ${msg.isFavorite ? 'message-favorite-menu-icon-active' : ''}`} /> {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                            </button>
                            <div className="message-bubble-menu-divider h-[1px] w-full"></div>
                            <button onClick={() => onReportClick({ type: 'message', target: msg })} className="message-bubble-menu-item message-bubble-menu-item-danger px-3 py-2 text-left text-xs whitespace-nowrap flex items-center gap-2">
                                <FaFlag size={10} className="drop-shadow-sm" /> Denunciar
                            </button>
                        </div>
                    </div>
                    {msg.image && (
                        <img onClick={() => onImageClick(msg.image)} src={msg.image} alt="Sent" className="message-bubble-image max-w-[240px] mb-1 mt-0.5 object-cover" />
                    )}
                    {msg.text && <p className="message-bubble-text text-[13px] leading-[1.25] break-words whitespace-pre-wrap">{msg.text}</p>}
                </div>
                <div className="message-bubble-footer flex items-center gap-2 mt-0.5 px-1 w-full message-bubble-footer-other justify-start ml-1">
                    <span className="message-bubble-time text-[10px] font-medium flex items-center gap-1.5">{msgTime} {msg.isEdited && "(editada)"}</span>
                    <button onClick={() => onToggleLike(msg.messageId)} className={`message-bubble-like-btn flex items-center gap-1 text-[10px] px-1.5 py-0.5 ${(msg.likes && msg.likes.length > 0) ? 'message-bubble-like-btn-visible' : ''} ${(msg.likes && msg.likes.includes(currentUserId)) ? 'message-bubble-like-btn-active' : ''}`}>
                        {(msg.likes && msg.likes.includes(currentUserId)) ? <FaHeart size={10} className="drop-shadow-sm" /> : <FaRegHeart size={10} />}
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
                    const MAX_WIDTH = 1280;
                    const MAX_HEIGHT = 1280;
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

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
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
        const userName = localStorage.getItem('chat_displayName') || 'Usuário';

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

        return () => {
            socket.emit("leaveRoom", { roomId: room, userId: localStorage.getItem('chat_uniqueUserId') || currentUserId });
            socket.off("roomPresenceUpdated");
            socket.off("receive_message");
            socket.off("message_read");
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
            const currentSender = localStorage.getItem('chat_displayName') || "Usuário";
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

    if (!room) {
        return (
            <main className="reveal chat-state-page flex-grow flex items-center justify-center px-6">
                <div className="skeuo-panel chat-state-panel p-10 max-w-[400px] w-full text-center">
                    <h1 className="hero-title chat-error-title text-[28px] font-semibold mb-2">Sala inválida</h1>
                    <p className="chat-error-desc text-[15px] mb-8">Nenhuma sala foi informada.</p>
                    <button onClick={() => navigate('/rooms')} className="skeuo-btn chat-state-btn w-full py-3 text-[15px]">
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
            <main className="reveal chat-state-page flex-grow flex items-center justify-center px-6">
                <div className="skeuo-panel chat-state-panel animate-fade-in-up p-10 max-w-[400px] w-full text-center">
                    <div className="chat-error-icon chat-error-icon-red w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-[36px]">
                        <FaSignOutAlt />
                    </div>
                    <h1 className="hero-title chat-error-title text-[#1d1d1f] dark:text-[#f8fafc] text-[28px] font-semibold mb-2">
                        Acesso Negado
                    </h1>
                    <p className="chat-error-desc leading-relaxed text-[15px] mb-8">
                        {roomFullError}
                    </p>
                    <button onClick={() => navigate('/rooms')} className="skeuo-btn chat-state-btn w-full py-3 text-[15px]">Voltar para Salas</button>
                </div>
            </main>
        );
    }

    if (!hasJoined && !roomFullError) {
        return (
            <main className="reveal chat-state-page flex-grow flex items-center justify-center px-6">
                <div className="skeuo-panel chat-state-panel animate-fade-in-up p-10 max-w-[400px] w-full text-center">
                    <div className="chat-error-icon chat-error-icon-gray w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-[36px]">
                        <FaSignOutAlt />
                    </div>

                    <h1 className="hero-title chat-error-title text-[28px] font-semibold mb-2">
                        Entrar na Sala
                    </h1>

                    <p className="chat-error-desc tracking-tight leading-snug text-[15px] mb-8">
                        Você está prestes a entrar nesta sala de bate-papo. Deseja continuar?
                    </p>

                    <div className="chat-confirm-actions flex flex-col gap-3">
                        <button
                            onClick={() => {
                                const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
                                if (!joinedRooms.includes(room)) {
                                    joinedRooms.push(room);
                                    localStorage.setItem('chat_joinedRooms', JSON.stringify(joinedRooms));
                                }
                                setHasJoined(true);
                            }}
                            className="skeuo-btn chat-state-btn font-medium w-full py-3 text-[15px]"
                        >
                            Entrar na Sala
                        </button>

                        <button
                            onClick={() => {
                                setRoomFullError(false);
                                navigate('/rooms');
                            }}
                            className="chat-confirm-cancel-btn w-full py-3 text-base font-medium"
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
                <div className="chat-image-lightbox fixed inset-0 z-[200] flex items-center justify-center animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <button onClick={() => setSelectedImage(null)} className="chat-image-lightbox-close absolute top-6 right-6 rounded-full p-2">
                        <FaTimes size={20} />
                    </button>
                    <img src={selectedImage} alt="Full Screen" className="chat-image-lightbox-image max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            {selectedUser && selectedUser.sender !== "Sistema" && (
                <div className="chat-user-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedUser(null)}>
                    <div className="skeuo-panel p-8 max-w-[350px] w-full text-center relative" onClick={(e) => e.stopPropagation()}>
                        <UserAvatar src={selectedUser.avatar} name={selectedUser.sender} size="2xl" className="chat-user-modal-avatar mx-auto mb-4" />
                        <h3 className="chat-user-modal-name text-[22px] font-semibold mb-1 flex items-center justify-center gap-2">
                            {selectedUser.sender}
                            {mockRoles[selectedUser.sender] === 'Dono' && (
                                <span className="chat-user-modal-role-badge chat-user-modal-role-badge-owner inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] leading-none font-bold uppercase tracking-wide">
                                    <FaCrown size={10} className="shrink-0" aria-hidden="true" />
                                    Dono
                                </span>
                            )}
                            {mockRoles[selectedUser.sender] === 'Moderador' && (
                                <span className="chat-user-modal-role-badge chat-user-modal-role-badge-mod inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] leading-none font-bold uppercase tracking-wide">
                                    <FaShieldAlt size={10} className="shrink-0" aria-hidden="true" />
                                    Mod
                                </span>
                            )}
                        </h3>
                        <p className="chat-user-modal-status text-[15px] mb-6">{selectedUser.status || "Sem recado"}</p>

                        <div className="chat-user-modal-role-panel p-4 rounded-[12px] mb-6 text-left border">
                            <label className="chat-user-modal-role-label block text-[11px] font-bold uppercase tracking-widest mb-2">Cargos e Moderação</label>
                            <select
                                value={mockRoles[selectedUser.sender] || 'Usuário'}
                                onChange={(e) => handleRoleChange(selectedUser.sender, e.target.value)}
                                className="chat-user-modal-select skeuo-input w-full px-3 py-2 text-[14px] cursor-pointer mb-3"
                            >
                                <option value="Usuário">👤 Usuário Comum</option>
                                <option value="Moderador">🛡️ Moderador da Sala</option>
                                <option value="Dono">👑 Dono da Sala</option>
                            </select>

                            <div className="flex gap-2 flex-wrap">
                                <button className="chat-user-modal-disabled-action flex-1 btn-secondary-glossy py-1.5 text-[12px] whitespace-nowrap" disabled>Silenciar (Em breve)</button>
                                <button className="chat-user-modal-disabled-action flex-1 btn-secondary-glossy py-1.5 text-[12px] whitespace-nowrap" disabled>Banir (Em breve)</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 mt-4">
                            {selectedUser.sender !== (localStorage.getItem('chat_displayName') || 'Usuário') && (
                                <button onClick={() => {
                                    const currentUser = localStorage.getItem('chat_displayName') || 'Usuário';
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
                                }} className="chat-user-modal-private-btn btn-secondary-glossy w-full py-2 flex items-center justify-center gap-2">
                                    <FaCommentAlt size={12} /> Mensagem Privada
                                </button>
                            )}
                            <div className="flex gap-3">
                                <button onClick={() => setReportModalData({ type: 'user', target: selectedUser })} className="chat-user-modal-report-btn btn-secondary-glossy flex-1 py-2 flex items-center justify-center gap-2">
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

            <div className="chat-shell animate-chat-shell flex w-full h-[calc(100vh-48px)] overflow-hidden">
                <ChatSidebar />
                <main className="chat-main animate-chat-panel-main flex-1 min-w-0 flex flex-col h-full relative">
                    <div className="chat-header-divider absolute top-0 left-0 right-0 h-1 z-10" />

                    <div className="chat-header px-4 py-2.5 flex items-center justify-between shrink-0">
                        <div className="chat-header-info flex items-center gap-3">
                            <div className="chat-header-icon w-8 h-8 rounded-full flex items-center justify-center">
                                <FaCommentAlt size={12} />
                            </div>
                            <div className="chat-header-title-wrapper flex flex-col justify-center">
                                <h2 className="chat-header-title font-bold text-[15px] leading-tight">
                                    {roomLoading ? "Carregando..." : (currentRoom ? currentRoom.name : "Sala não encontrada")}
                                </h2>
                                <p className="chat-header-subtitle text-[11px] flex items-center gap-1.5 mt-0.5">
                                    <span className="chat-header-online flex items-center gap-1 font-medium">
                                        <span className="chat-header-online-dot w-1.5 h-1.5 rounded-full" />
                                        {Number.isFinite(onlinePresence?.count) ? onlinePresence.count : 0} online
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="chat-header-actions flex items-center gap-2">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className={`chat-header-btn w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${searchOpen ? 'chat-header-btn-active' : ''}`}
                                title="Buscar mensagens"
                            >
                                <FaSearch size={14} className={searchOpen ? 'text-white' : 'text-gray-500 dark:text-slate-400'} />
                            </button>
                            <button
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                className={`chat-header-btn w-9 h-9 rounded-full flex items-center justify-center cursor-pointer ${showFavoritesOnly ? 'chat-header-btn-active' : ''}`}
                                title={showFavoritesOnly ? "Mostrar todas as mensagens" : "Mostrar apenas favoritas"}
                            >
                                <FaStar size={14} className={showFavoritesOnly ? 'text-white' : 'text-gray-500 dark:text-slate-400'} />
                            </button>
                            <button
                                onClick={() => navigate('/rooms')}
                                className="chat-header-btn chat-header-btn-exit w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                                title="Sair da sala"
                            >
                                <FaSignOutAlt size={14} className="text-gray-500 hover:text-rose-500" />
                            </button>
                        </div>
                    </div>

                    <div className={`chat-search-panel overflow-hidden shrink-0 z-10 transition-all duration-300 ease-out ${searchOpen ? 'chat-search-panel-open max-h-20 py-2' : 'chat-search-panel-closed max-h-0 py-0 pointer-events-none'}`}>
                        <div className="chat-search-inner px-4 flex items-center gap-3">
                            <div className="chat-search-input-wrapper relative flex-1">
                                <FaSearch className="chat-search-icon absolute left-3 top-1/2 -translate-y-1/2" size={12} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar mensagens..."
                                    className="chat-search-input skeuo-input w-full px-8 py-1.5 text-[13px] rounded-full"
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="chat-search-clear-btn absolute right-3 top-1/2 -translate-y-1/2">
                                        <FaTimes size={12} />
                                    </button>
                                )}
                            </div>
                            {searchResults.length > 0 ? (
                                <div className="chat-search-results flex items-center gap-2">
                                    <span className="chat-search-result-count text-[11px] whitespace-nowrap">
                                        {currentSearchIndex + 1} de {searchResults.length}
                                    </span>
                                    <div className="chat-search-navigation flex items-center overflow-hidden">
                                        <button onClick={handlePrevSearch} className="chat-search-nav-btn px-2 py-1" title="Resultado anterior">
                                            <FaChevronUp size={10} />
                                        </button>
                                        <button onClick={handleNextSearch} className="chat-search-nav-btn px-2 py-1" title="Próximo resultado">
                                            <FaChevronDown size={10} />
                                        </button>
                                    </div>
                                </div>
                            ) : searchLoading ? (
                                <span className="chat-search-empty text-[11px] whitespace-nowrap">Buscando...</span>
                            ) : searchError ? (
                                <span className="chat-search-error text-[11px] whitespace-nowrap">{searchError}</span>
                            ) : searchTerm ? (
                                <span className="chat-search-empty text-[11px] whitespace-nowrap">Nenhuma mensagem encontrada</span>
                            ) : null}
                            <button onClick={() => { setSearchOpen(false); setSearchTerm(''); }} className="chat-search-close-btn text-xs whitespace-nowrap">
                                Fechar
                            </button>
                        </div>
                    </div>

                    {pinnedMessage && (
                        <div className="chat-pinned-wrapper px-4 pt-3 shrink-0">
                            <div className="chat-pinned-message relative p-2.5 flex items-start gap-3">
                                <div className="chat-pinned-icon shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center">
                                    <FaThumbtack className="w-2.5 h-2.5 text-white" />
                                </div>
                                <div className="chat-pinned-content flex-1 min-w-0">
                                    <div className="chat-pinned-header flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="chat-pinned-author text-[11px]">{pinnedMessage.sender}</span>
                                        </div>
                                        <button onClick={() => setPinnedMessage(null)} className="chat-pinned-close p-0.5 rounded-full shrink-0 flex items-center justify-center">
                                            <FaTimes size={10} />
                                        </button>
                                    </div>
                                    <p className="chat-pinned-text text-[12.5px] leading-[1.375]">{pinnedMessage.text}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatContainerRef} className="chat-messages-area chat-container flex-grow overflow-y-auto pt-2 pr-2 mb-2 space-y-0.5">

                        {messages.length === 0 && !showFavoritesOnly && (
                            <div className="chat-messages-empty animate-fade-in-up flex flex-col items-center justify-center h-full min-h-[250px] text-center px-4">
                                <div className="chat-messages-empty-icon w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <FaComments size={24} className="drop-shadow-sm text-[#0071e3]/60" />
                                </div>
                                <h3 className="chat-messages-empty-title text-[15px] font-semibold mb-1">Nenhuma mensagem ainda</h3>
                                <p className="chat-messages-empty-desc text-[13px]">Seja o primeiro a conversar nesta sala.</p>
                            </div>
                        )}

                        {messages.map((msg, index) => {
                            if (showFavoritesOnly && !msg.isFavorite) return null;
                            const isCurrentSearch = searchResults.length > 0 && searchResults[currentSearchIndex]?.id === msg.messageId;
                            return (
                                <MessageBubble
                                    key={index}
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
                                />
                            );
                        })}

                        {showFavoritesOnly && messages.filter(msg => msg.isFavorite).length === 0 && (
                            <div className="chat-messages-empty-fav text-center mt-10 text-sm">
                                Você ainda não tem nenhuma mensagem favorita nesta sala.
                            </div>
                        )}

                    </div>

                    <footer className="chat-input-footer shrink-0 relative p-3">
                        {imagePreview && !editingMessageId && (
                            <div className="chat-input-panel absolute left-0 bottom-[calc(100%+10px)] p-2 flex items-center gap-2 z-10 skeuo-panel animate-fade-in-up">
                                <img src={imagePreview} alt="Preview" className="chat-input-preview-image h-16 w-16 object-cover" />
                                <button type="button" onClick={clearImagePreview} className="chat-input-preview-remove p-1.5 flex items-center justify-center">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}
                        {editingMessageId && (
                            <div className="chat-input-panel chat-input-editing-bar absolute left-0 bottom-[calc(100%+10px)] p-2 flex items-center gap-2 z-10 px-4 text-sm skeuo-panel animate-fade-in-up">
                                <FaPencilAlt /> Editando mensagem...
                                <button type="button" onClick={() => { setEditingMessageId(null); setCurrentMessage(""); setImagePreview(null); }} className="chat-input-cancel-edit-btn p-1.5 flex items-center justify-center ml-2">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}
                        <form onSubmit={sendMessage} className="chat-input-form flex gap-2">
                            <label className="chat-input-attach-btn w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer">
                                <FaCamera size={14} className="drop-shadow-sm" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            <input
                                type="text"
                                className="chat-input-field skeuo-input w-full px-4 py-2 flex-grow"
                                placeholder={editingMessageId ? "Editar mensagem..." : "Digite uma mensagem..."}
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!currentMessage.trim() && !imagePreview}
                                className="chat-input-send-btn w-10 h-10 shrink-0 flex items-center justify-center"
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