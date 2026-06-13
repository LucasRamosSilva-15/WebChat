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
            <div ref={innerRef} className="message-bubble-row message-bubble-row-own group animate-fade-in-up">
                <div className="message-bubble-wrapper message-bubble-wrapper-own group/msg">
                    <div className={`message-bubble-card message-bubble-card-own skeuo-bubble-sent ${matchClass}`}>
                        <div className="message-bubble-actions message-bubble-actions-own">
                            <button className="message-bubble-more-btn">
                                <FaEllipsisV size={12} className="drop-shadow-sm" />
                            </button>

                            <div className="message-bubble-menu">
                                <button onClick={onToggleFavorite} className="message-bubble-menu-item">
                                    <FaStar size={10} className={`drop-shadow-sm ${msg.isFavorite ? 'text-[#f59e0b]' : 'text-[#86868b]'}`} /> {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                                </button>
                                {canDelete && (
                                    <>
                                        <div className="message-bubble-menu-divider"></div>
                                        <button onClick={() => onEditClick(msg)} className="message-bubble-menu-item message-bubble-menu-item-edit">
                                            <FaPencilAlt size={10} className="text-[#0071e3] drop-shadow-sm" /> Editar
                                        </button>
                                        <div className="message-bubble-menu-divider"></div>
                                        <button onClick={() => onDeleteMessage(msg.messageId)} className="message-bubble-menu-item message-bubble-menu-item-danger">
                                            <FaTrash size={10} className="drop-shadow-sm" /> Apagar
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {msg.image && (
                            <img onClick={() => onImageClick(msg.image)} src={msg.image} alt="Sent" className="max-w-[200px] md:max-w-[240px] rounded-[6px] mb-1 mt-0.5 object-cover cursor-pointer hover:opacity-90 transition-opacity border border-white/20 shadow-sm" />
                        )}
                        {msg.text && <p className="message-bubble-text">{msg.text}</p>}
                    </div>
                    <div className="message-bubble-footer message-bubble-footer-own">
                        <button onClick={() => onToggleLike(msg.messageId)} className={`message-bubble-like-btn ${(msg.likes && msg.likes.length > 0) ? 'message-bubble-like-btn-visible' : ''} ${(msg.likes && msg.likes.includes(currentUserId)) ? 'message-bubble-like-btn-active' : ''}`}>
                            {(msg.likes && msg.likes.includes(currentUserId)) ? <FaHeart size={10} className="drop-shadow-sm" /> : <FaRegHeart size={10} />}
                            {msg.likes && msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                        </button>
                        <span className="message-bubble-time">
                            {mockRoles && mockRoles[msg.sender] === 'Dono' && (
                                <span className="inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20">
                                    <FaCrown size={8} /> DONO
                                </span>
                            )}
                            {mockRoles && mockRoles[msg.sender] === 'Moderador' && (
                                <span className="inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 bg-gradient-to-b from-violet-400 to-violet-600 text-white rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20">
                                    <FaShieldAlt size={8} /> MOD
                                </span>
                            )}
                            {msgTime} {msg.isEdited && "(editada)"} <span className="text-sky-500 text-[10px] ml-0.5">✓✓</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={innerRef} className="message-bubble-row message-bubble-row-other group animate-fade-in-up">
            <UserAvatar src={msg.avatar} name={msg.sender} onClick={() => onAvatarClick(msg)} size="sm" className="mt-1 hover:opacity-80 transition-opacity" />
            <div className="message-bubble-wrapper message-bubble-wrapper-other group/msg">
                <span className="message-bubble-author">
                    {msg.sender}
                    {mockRoles && mockRoles[msg.sender] === 'Dono' && (
                        <span className="inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 text-amber-900 rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20">
                            <FaCrown size={8} /> DONO
                        </span>
                    )}
                    {mockRoles && mockRoles[msg.sender] === 'Moderador' && (
                        <span className="inline-flex items-center text-[8px] px-1 py-0.5 gap-0.5 bg-gradient-to-b from-violet-400 to-violet-600 text-white rounded-full font-bold uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)] border border-white/20">
                            <FaShieldAlt size={8} /> MOD
                        </span>
                    )}
                </span>
                <div className={`message-bubble-card message-bubble-card-other skeuo-bubble-received ${matchClass}`}>
                    <div className="message-bubble-actions message-bubble-actions-other">
                        <button className="message-bubble-more-btn">
                            <FaEllipsisV size={12} className="drop-shadow-sm" />
                        </button>

                        <div className="message-bubble-menu">
                            <button onClick={onToggleFavorite} className="message-bubble-menu-item">
                                <FaStar size={10} className={`drop-shadow-sm ${msg.isFavorite ? 'text-[#f59e0b]' : 'text-[#86868b]'}`} /> {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                            </button>
                            <div className="message-bubble-menu-divider"></div>
                            <button onClick={() => onReportClick({ type: 'message', target: msg })} className="message-bubble-menu-item message-bubble-menu-item-danger">
                                <FaFlag size={10} className="drop-shadow-sm" /> Denunciar
                            </button>
                        </div>
                    </div>
                    {msg.image && (
                        <img onClick={() => onImageClick(msg.image)} src={msg.image} alt="Sent" className="max-w-[200px] md:max-w-[240px] rounded-[6px] mb-1 mt-0.5 object-cover cursor-pointer hover:opacity-90 transition-opacity border border-black/5 dark:border-white/5 shadow-sm" />
                    )}
                    {msg.text && <p className="message-bubble-text">{msg.text}</p>}
                </div>
                <div className="message-bubble-footer message-bubble-footer-other">
                    <span className="message-bubble-time">{msgTime} {msg.isEdited && "(editada)"}</span>
                    <button onClick={() => onToggleLike(msg.messageId)} className={`message-bubble-like-btn ${(msg.likes && msg.likes.length > 0) ? 'message-bubble-like-btn-visible' : ''} ${(msg.likes && msg.likes.includes(currentUserId)) ? 'message-bubble-like-btn-active' : ''}`}>
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
            <main className="reveal chat-state-page">
                <div className="skeuo-panel chat-state-panel">
                    <h1 className="hero-title chat-error-title">Sala inválida</h1>
                    <p className="chat-error-desc">Nenhuma sala foi informada.</p>
                    <button onClick={() => navigate('/rooms')} className="skeuo-btn chat-state-btn">
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
            <main className="reveal chat-state-page">
                <div className="skeuo-panel chat-state-panel animate-fade-in-up">
                    <div className="chat-error-icon chat-error-icon-red">
                        <FaSignOutAlt />
                    </div>
                    <h1 className="hero-title chat-error-title text-[#1d1d1f] dark:text-[#f8fafc]">
                        Acesso Negado
                    </h1>
                    <p className="chat-error-desc leading-relaxed">
                        {roomFullError}
                    </p>
                    <button onClick={() => navigate('/rooms')} className="skeuo-btn chat-state-btn">Voltar para Salas</button>
                </div>
            </main>
        );
    }

    if (!hasJoined && !roomFullError) {
        return (
            <main className="reveal chat-state-page">
                <div className="skeuo-panel chat-state-panel animate-fade-in-up">
                    <div className="chat-error-icon chat-error-icon-gray">
                        <FaSignOutAlt />
                    </div>

                    <h1 className="hero-title chat-error-title">
                        Entrar na Sala
                    </h1>

                    <p className="chat-error-desc tracking-tight leading-snug">
                        Você está prestes a entrar nesta sala de bate-papo. Deseja continuar?
                    </p>

                    <div className="chat-confirm-actions">
                        <button
                            onClick={() => {
                                const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
                                if (!joinedRooms.includes(room)) {
                                    joinedRooms.push(room);
                                    localStorage.setItem('chat_joinedRooms', JSON.stringify(joinedRooms));
                                }
                                setHasJoined(true);
                            }}
                            className="skeuo-btn chat-state-btn font-medium"
                        >
                            Entrar na Sala
                        </button>

                        <button
                            onClick={() => {
                                setRoomFullError(false);
                                navigate('/rooms');
                            }}
                            className="chat-confirm-cancel-btn"
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
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedImage(null)}>
                    <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors">
                        <FaTimes size={20} />
                    </button>
                    <img src={selectedImage} alt="Full Screen" className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl rounded-sm" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            {selectedUser && selectedUser.sender !== "Sistema" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedUser(null)}>
                    <div className="skeuo-panel p-8 max-w-[350px] w-full text-center relative" onClick={(e) => e.stopPropagation()}>
                        <UserAvatar src={selectedUser.avatar} name={selectedUser.sender} size="2xl" className="mx-auto mb-4 border-2 border-white shadow-md" />
                        <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-1 flex items-center justify-center gap-2">
                            {selectedUser.sender}
                            {mockRoles[selectedUser.sender] === 'Dono' && <span className="bg-amber-100 text-amber-700 text-[11px] uppercase font-bold px-2 py-0.5 rounded-[6px] tracking-wider border border-amber-200 shadow-sm flex items-center gap-1">👑 Dono</span>}
                            {mockRoles[selectedUser.sender] === 'Moderador' && <span className="bg-blue-100 text-blue-700 text-[11px] uppercase font-bold px-2 py-0.5 rounded-[6px] tracking-wider border border-blue-200 shadow-sm flex items-center gap-1">🛡️ Mod</span>}
                        </h3>
                        <p className="text-[15px] text-[#86868b] mb-6">{selectedUser.status || "Sem recado"}</p>

                        <div className="bg-black/5 p-4 rounded-[12px] mb-6 text-left border border-black/5 dark:border-white/5 shadow-inner">
                            <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-2">Cargos e Moderação</label>
                            <select
                                value={mockRoles[selectedUser.sender] || 'Usuário'}
                                onChange={(e) => handleRoleChange(selectedUser.sender, e.target.value)}
                                className="skeuo-input w-full px-3 py-2 text-[14px] bg-white dark:bg-[#1e293b] cursor-pointer mb-3"
                            >
                                <option value="Usuário">👤 Usuário Comum</option>
                                <option value="Moderador">🛡️ Moderador da Sala</option>
                                <option value="Dono">👑 Dono da Sala</option>
                            </select>

                            <div className="flex gap-2 flex-wrap">
                                <button className="flex-1 btn-secondary-glossy py-1.5 text-[12px] text-[#ef4444] opacity-50 cursor-not-allowed whitespace-nowrap" disabled>Silenciar (Em breve)</button>
                                <button className="flex-1 btn-secondary-glossy py-1.5 text-[12px] text-[#ef4444] opacity-50 cursor-not-allowed whitespace-nowrap" disabled>Banir (Em breve)</button>
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
                                }} className="btn-secondary-glossy w-full py-2 flex items-center justify-center gap-2 text-[#0071e3] hover:bg-[#e6f0ff]">
                                    <FaCommentAlt size={12} /> Mensagem Privada
                                </button>
                            )}
                            <div className="flex gap-3">
                                <button onClick={() => setReportModalData({ type: 'user', target: selectedUser })} className="btn-secondary-glossy flex-1 py-2 flex items-center justify-center gap-2 text-[#ef4444] hover:bg-[#fee2e2]">
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

            <div className="chat-shell animate-chat-shell">
                <ChatSidebar />
                <main className="chat-main animate-chat-panel-main">
                    <div className="chat-header-divider" />

                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="chat-header-icon">
                                <FaCommentAlt size={12} />
                            </div>
                            <div className="chat-header-title-wrapper">
                                <h2 className="chat-header-title">
                                    {roomLoading ? "Carregando..." : (currentRoom ? currentRoom.name : "Sala não encontrada")}
                                </h2>
                                <p className="chat-header-subtitle">
                                    <span className="chat-header-online">
                                        <span className="chat-header-online-dot" />
                                        {Number.isFinite(onlinePresence?.count) ? onlinePresence.count : 0} online
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="chat-header-actions">
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className={`chat-header-btn ${searchOpen ? 'chat-header-btn-active' : ''}`}
                                title="Buscar mensagens"
                            >
                                <FaSearch size={14} className={searchOpen ? 'text-white' : 'text-gray-500 dark:text-slate-400'} />
                            </button>
                            <button
                                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                className={`chat-header-btn ${showFavoritesOnly ? 'chat-header-btn-active' : ''}`}
                                title={showFavoritesOnly ? "Mostrar todas as mensagens" : "Mostrar apenas favoritas"}
                            >
                                <FaStar size={14} className={showFavoritesOnly ? 'text-white' : 'text-gray-500 dark:text-slate-400'} />
                            </button>
                            <button
                                onClick={() => navigate('/rooms')}
                                className="chat-header-btn chat-header-btn-exit"
                                title="Sair da sala"
                            >
                                <FaSignOutAlt size={14} className="text-gray-500 hover:text-rose-500" />
                            </button>
                        </div>
                    </div>

                    <div className={`chat-search-panel ${searchOpen ? 'chat-search-panel-open' : 'chat-search-panel-closed'}`}>
                        <div className="chat-search-inner">
                            <div className="chat-search-input-wrapper">
                                <FaSearch className="chat-search-icon" size={12} />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar mensagens..."
                                    className="chat-search-input skeuo-input"
                                />
                                {searchTerm && (
                                    <button onClick={() => setSearchTerm('')} className="chat-search-clear-btn">
                                        <FaTimes size={12} />
                                    </button>
                                )}
                            </div>
                            {searchResults.length > 0 ? (
                                <div className="chat-search-results">
                                    <span className="chat-search-result-count">
                                        {currentSearchIndex + 1} de {searchResults.length}
                                    </span>
                                    <div className="chat-search-navigation">
                                        <button onClick={handlePrevSearch} className="chat-search-nav-btn" title="Resultado anterior">
                                            <FaChevronUp size={10} />
                                        </button>
                                        <button onClick={handleNextSearch} className="chat-search-nav-btn" title="Próximo resultado">
                                            <FaChevronDown size={10} />
                                        </button>
                                    </div>
                                </div>
                            ) : searchLoading ? (
                                <span className="chat-search-empty">Buscando...</span>
                            ) : searchError ? (
                                <span className="chat-search-error">{searchError}</span>
                            ) : searchTerm ? (
                                <span className="chat-search-empty">Nenhuma mensagem encontrada</span>
                            ) : null}
                            <button onClick={() => { setSearchOpen(false); setSearchTerm(''); }} className="chat-search-close-btn">
                                Fechar
                            </button>
                        </div>
                    </div>

                    {pinnedMessage && (
                        <div className="chat-pinned-wrapper">
                            <div className="chat-pinned-message">
                                <div className="chat-pinned-icon">
                                    <FaThumbtack className="w-2.5 h-2.5 text-white" />
                                </div>
                                <div className="chat-pinned-content">
                                    <div className="chat-pinned-header">
                                        <div className="flex items-center gap-2">
                                            <span className="chat-pinned-author">{pinnedMessage.sender}</span>
                                        </div>
                                        <button onClick={() => setPinnedMessage(null)} className="chat-pinned-close">
                                            <FaTimes size={10} />
                                        </button>
                                    </div>
                                    <p className="chat-pinned-text">{pinnedMessage.text}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={chatContainerRef} className="chat-messages-area chat-container">

                        {messages.length === 0 && !showFavoritesOnly && (
                            <div className="chat-messages-empty animate-fade-in-up">
                                <div className="chat-messages-empty-icon">
                                    <FaComments size={24} className="drop-shadow-sm text-[#0071e3]/60" />
                                </div>
                                <h3 className="chat-messages-empty-title">Nenhuma mensagem ainda</h3>
                                <p className="chat-messages-empty-desc">Seja o primeiro a conversar nesta sala.</p>
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
                            <div className="chat-messages-empty-fav">
                                Você ainda não tem nenhuma mensagem favorita nesta sala.
                            </div>
                        )}

                    </div>

                    <footer className="chat-input-footer">
                        {imagePreview && !editingMessageId && (
                            <div className="chat-input-panel skeuo-panel animate-fade-in-up">
                                <img src={imagePreview} alt="Preview" className="chat-input-preview-image" />
                                <button type="button" onClick={clearImagePreview} className="chat-input-preview-remove">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}
                        {editingMessageId && (
                            <div className="chat-input-panel chat-input-editing-bar skeuo-panel animate-fade-in-up">
                                <FaPencilAlt /> Editando mensagem...
                                <button type="button" onClick={() => { setEditingMessageId(null); setCurrentMessage(""); setImagePreview(null); }} className="chat-input-cancel-edit-btn">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        )}
                        <form onSubmit={sendMessage} className="chat-input-form">
                            <label className="chat-input-attach-btn">
                                <FaCamera size={14} className="drop-shadow-sm" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                            <input
                                type="text"
                                className="chat-input-field skeuo-input"
                                placeholder={editingMessageId ? "Editar mensagem..." : "Digite uma mensagem..."}
                                value={currentMessage}
                                onChange={(e) => setCurrentMessage(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!currentMessage.trim() && !imagePreview}
                                className="chat-input-send-btn"
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