import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { Send, ImagePlus, X, Star, LogOut, Trash2 } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { socket } from '../socket';
// Código de criptografia
// Provisório! deve ser mudado para JWT e bcrypt no futuro
const SECRET_KEY = "WebChat_E2EE_Secret_Key_Minix";

const Avatar = ({ src, onClick }) => (
    <div onClick={onClick} className="w-8 h-8 rounded-full bg-gray-100 border border-[#d2d2d7] shrink-0 flex items-center justify-center overflow-hidden shadow-sm mb-4 cursor-pointer hover:opacity-80 transition-opacity">
        {src ? (
            <img src={src} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
            <svg className="w-5 h-5 text-[#86868b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        )}
    </div>
);

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

const MessageBubble = ({ msg, onAvatarClick, onImageClick, onToggleFavorite, onDeleteMessage }) => {
    const msgTime = formatMessageTime(msg.time);

    let canDelete = false;
    if (msg.isMe && msg.time && msg.messageId) {
        const msgDate = new Date(msg.time);
        const now = new Date();
        const diffHours = (now - msgDate) / (1000 * 60 * 60);
        if (diffHours < 24) canDelete = true;
    }

    if (msg.isMe) {
        return (
            <div className="flex items-end justify-end gap-2 animate-fade-in-up">
                <div className="flex flex-col items-end max-w-[70%] group/msg">
                    <div className="skeuo-bubble-sent px-4 py-2 flex flex-col relative">
                        <button
                            onClick={onToggleFavorite}
                            className={`absolute top-2 right-full mr-2 p-1.5 rounded-full transition-all opacity-0 group-hover/msg:opacity-100 ${msg.isFavorite ? 'text-[#f59e0b] opacity-100' : 'text-[#86868b] hover:bg-black/5 hover:text-[#1d1d1f]'}`}
                            title={msg.isFavorite ? "Remover dos Favoritos" : "Marcar como Favorita"}
                        >
                            <Star size={16} fill={msg.isFavorite ? "currentColor" : "none"} />
                        </button>
                        {canDelete && (
                            <button
                                onClick={() => onDeleteMessage(msg.messageId)}
                                className={`absolute top-10 right-full mr-2 p-1.5 rounded-full transition-all opacity-0 group-hover/msg:opacity-100 text-[#ef4444] hover:bg-[#fee2e2] hover:text-[#dc2626]`}
                                title="Apagar mensagem"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                        {msg.image && (
                            <img onClick={() => onImageClick(msg.image)} src={msg.image} alt="Sent" className="max-w-[200px] md:max-w-[280px] rounded-[12px] mb-2 object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                        )}
                        {msg.text && <p className="text-[16px] leading-snug">{msg.text}</p>}
                    </div>
                    <span className="text-[11px] text-[#86868b] mt-1 uppercase tracking-widest">{msgTime} • Enviado</span>
                    {msg.readBy && msg.readBy.length > 0 && (
                        <div className="text-[10px] text-[#0071e3] mt-0.5 text-right font-medium relative group cursor-help transition-all">
                            ✓ Lido por {msg.readBy.length}
                            <div className="absolute bottom-full right-0 mb-1 w-max bg-black/80 text-white text-[11px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg backdrop-blur-md">
                                Visto por: {msg.readBy.join(", ")}
                            </div>
                        </div>
                    )}
                </div>
                <Avatar src={msg.avatar} onClick={() => onAvatarClick(msg)} />
            </div>
        );
    }

    return (
        <div className="flex items-end justify-start gap-2 animate-fade-in-up">
            <Avatar src={msg.avatar} onClick={() => onAvatarClick(msg)} />
            <div className="flex flex-col items-start max-w-[70%] group/msg">
                <span className="text-[12px] text-[#86868b] ml-1 mb-1 font-medium">{msg.sender}</span>
                <div className="skeuo-bubble-received px-4 py-2 flex flex-col relative">
                    <button
                        onClick={onToggleFavorite}
                        className={`absolute top-2 left-full ml-2 p-1.5 rounded-full transition-all opacity-0 group-hover/msg:opacity-100 ${msg.isFavorite ? 'text-[#f59e0b] opacity-100' : 'text-[#86868b] hover:bg-black/5 hover:text-[#1d1d1f]'}`}
                        title={msg.isFavorite ? "Remover dos Favoritos" : "Marcar como Favorita"}
                    >
                        <Star size={16} fill={msg.isFavorite ? "currentColor" : "none"} />
                    </button>
                    {msg.image && (
                        <img onClick={() => onImageClick(msg.image)} src={msg.image} alt="Sent" className="max-w-[200px] md:max-w-[280px] rounded-[12px] mb-2 object-cover cursor-pointer hover:opacity-90 transition-opacity" />
                    )}
                    {msg.text && <p className="text-[16px] leading-snug">{msg.text}</p>}
                </div>
                <span className="text-[11px] text-[#86868b] mt-1 ml-1 uppercase tracking-widest">{msgTime}</span>
            </div>
        </div>
    );
};

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState("...");
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [roomFullError, setRoomFullError] = useState(false);
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

    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const room = queryParams.get('room') || 'general';
    const currentRoomRef = useRef(null);

    const [hasJoined, setHasJoined] = useState(() => {
        const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
        return joinedRooms.includes(room);
    });

    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat_messages_${room}`);
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Erro ao carregar mensagens:", e);
                setMessages([{ text: `Bem-vindo à sala ${room.toUpperCase()}!`, sender: "Sistema", isMe: false, time: new Date().toISOString() }]);
            }
        } else {
            setMessages([
                { text: `Bem-vindo à sala ${room.toUpperCase()}!`, sender: "Sistema", isMe: false, time: new Date().toISOString() }
            ]);
        }
        currentRoomRef.current = room;
    }, [room]);

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
        if (!hasJoined) return;

        let userId = localStorage.getItem('chat_uniqueUserId');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chat_uniqueUserId', userId);
        }

        socket.emit("join_room", { room, userId });

        socket.on("room_full_error", (err) => {
            setRoomFullError(err.message);
            setHasJoined(false);
            const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
            const updated = joinedRooms.filter(r => r !== room);
            localStorage.setItem('chat_joinedRooms', JSON.stringify(updated));
        });

        socket.on("active_users_count", (count) => {
            setOnlineUsers(count);
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

        socket.on("receive_message", (data) => {
            try {
                // Código de criptografia
                // Provisório! deve ser mudado para JWT e bcrypt no futuro
                const bytes = CryptoJS.AES.decrypt(data.message, SECRET_KEY);
                const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

                // Código de descriptografia
                // Provisório! deve ser mudado para JWT e bcrypt no futuro
                let text = decryptedString;
                let image = null;
                // Código de descriptografia
                // Provisório! deve ser mudado para JWT e bcrypt no futuro
                if (decryptedString) {
                    try {
                        const parsed = JSON.parse(decryptedString);
                        if (parsed.text !== undefined || parsed.image !== undefined) {
                            text = parsed.text || "";
                            image = parsed.image || null;
                        }
                    } catch (e) {

                    }

                    setMessages((list) => [...list, { messageId: data.messageId, text: text, image: image, sender: data.sender, avatar: data.avatar, status: data.status, isMe: false, time: data.time, readBy: [] }]);

                    const currentReader = localStorage.getItem('chat_displayName') || "Usuário";
                    if (data.messageId) {
                        socket.emit("read_message", { room: data.room, messageId: data.messageId, reader: currentReader });
                    }
                } else {
                    setMessages((list) => [...list, { messageId: data.messageId, text: data.message, sender: data.sender, avatar: data.avatar, status: data.status, isMe: false, time: data.time, readBy: [] }]);
                }
            } catch (error) {
                console.error("Erro ao descriptografar mensagem:", error);
                setMessages((list) => [...list, { messageId: data.messageId, text: data.message, sender: data.sender, isMe: false, time: data.time, readBy: [] }]);
            }
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
            socket.off("receive_message");
            socket.off("active_users_count");
            socket.off("message_read");
            socket.off("room_full_error");
            socket.off("message_deleted");
        };
    }, [room, hasJoined]);

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

            // Código de criptografia
            // Provisório! deve ser mudado para JWT e bcrypt no futuro
            const payload = JSON.stringify({ text: currentMessage, image: imagePreview });
            const encryptedMessage = CryptoJS.AES.encrypt(payload, SECRET_KEY).toString();

            const messageId = Date.now().toString() + Math.random().toString(36).substring(7);

            const messageData = {
                room: room,
                messageId: messageId,
                sender: currentSender,
                avatar: currentPhoto,
                status: currentStatus,
                message: encryptedMessage,
                time: new Date().toISOString()
            };

            await socket.emit("send_message", messageData);
            setMessages((list) => [...list, { messageId: messageId, text: currentMessage, image: imagePreview, sender: currentSender, avatar: currentPhoto, status: currentStatus, isMe: true, time: messageData.time, readBy: [] }]);
            setCurrentMessage("");
            setImagePreview(null);
        }
    };

    if (!hasJoined || roomFullError) {
        return (
            <main className="reveal flex-grow flex items-center justify-center px-6">
                <div className="skeuo-panel p-10 max-w-[400px] w-full text-center animate-fade-in-up">
                    <div className="w-20 h-20 bg-[#f4f5f7] rounded-full mx-auto flex items-center justify-center border border-black/5 mb-6 shadow-inner">
                        <span className="text-[36px]">🚪</span>
                    </div>
                    <h1 className="hero-title text-[28px] font-semibold mb-2">
                        {room.toUpperCase()}
                    </h1>

                    {roomFullError ? (
                        <p className="text-[15px] font-medium text-[#ef4444] mb-8 tracking-tight leading-snug p-3 bg-[#fee2e2] rounded-[12px]">
                            {roomFullError}
                        </p>
                    ) : (
                        <p className="text-[15px] font-normal text-[#86868b] mb-8 tracking-tight leading-snug">
                            Você está prestes a entrar nesta sala de bate-papo. Deseja continuar?
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        {!roomFullError && (
                            <button 
                                onClick={() => {
                                    const joinedRooms = JSON.parse(localStorage.getItem('chat_joinedRooms') || '[]');
                                    if (!joinedRooms.includes(room)) {
                                        joinedRooms.push(room);
                                        localStorage.setItem('chat_joinedRooms', JSON.stringify(joinedRooms));
                                    }
                                    setHasJoined(true);
                                }} 
                                className="skeuo-btn w-full py-3 text-[16px] font-medium"
                            >
                                Entrar na Sala
                            </button>
                        )}
                        <button 
                            onClick={() => {
                                setRoomFullError(false);
                                navigate('/rooms');
                            }} 
                            className="w-full py-3 text-[16px] font-medium text-[#ef4444] hover:bg-[#fee2e2] rounded-[12px] transition-colors"
                        >
                            {roomFullError ? "Voltar para Salas" : "Cancelar"}
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
                        <X size={24} />
                    </button>
                    <img src={selectedImage} alt="Full Screen" className="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl rounded-sm" onClick={(e) => e.stopPropagation()} />
                </div>
            )}

            {selectedUser && selectedUser.sender !== "Sistema" && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedUser(null)}>
                    <div className="skeuo-panel p-8 max-w-[350px] w-full text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden mb-4">
                            {selectedUser.avatar ? (
                                <img src={selectedUser.avatar} alt={selectedUser.sender} className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-12 h-12 text-[#86868b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                </svg>
                            )}
                        </div>
                        <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-1">{selectedUser.sender}</h3>
                        <p className="text-[15px] text-[#86868b]">{selectedUser.status || "Sem recado"}</p>
                        <button onClick={() => setSelectedUser(null)} className="mt-6 btn-secondary-glossy w-full py-2">Fechar</button>
                    </div>
                </div>
            )}

            <main className="reveal flex-grow flex flex-col max-w-[1000px] mx-auto w-full p-4 md:p-6 h-[calc(100vh-120px)] overflow-hidden">

                <div className="skeuo-panel p-5 mb-6 max-w-[500px] mx-auto w-full text-center shrink-0 relative flex items-center justify-center">
                    <button 
                        onClick={() => navigate('/rooms')}
                        className={`absolute left-4 w-9 h-9 rounded-full transition-all flex items-center justify-center bg-[#f4f5f7] text-[#ef4444] hover:bg-[#fee2e2] hover:text-[#dc2626] shadow-sm border border-black/5`}
                        title="Sair da sala"
                    >
                        <LogOut size={16} />
                    </button>
                    <button 
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`absolute right-4 w-9 h-9 rounded-full transition-all flex items-center justify-center ${showFavoritesOnly ? 'bg-[#f59e0b]/10 text-[#f59e0b] shadow-inner' : 'bg-[#f4f5f7] text-[#86868b] hover:bg-[#e8e9eb] hover:text-[#1d1d1f] shadow-sm border border-black/5'}`}
                        title={showFavoritesOnly ? "Mostrar todas as mensagens" : "Mostrar apenas favoritas"}
                    >
                        <Star size={16} fill={showFavoritesOnly ? "currentColor" : "none"} />
                    </button>
                    <div>
                        <h1 className="hero-title text-[24px] font-semibold">{room.toUpperCase()}</h1>
                        <p className="text-[13px] text-[#86868b] mt-1 font-medium tracking-wide">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></span>
                            {onlineUsers} online no servidor
                        </p>
                    </div>
                </div>

                <div ref={chatContainerRef} className="skeuo-panel p-10 flex-grow overflow-y-auto space-y-4 mb-6 pr-2 chat-container">

                    {messages.map((msg, index) => {
                        if (showFavoritesOnly && !msg.isFavorite) return null;
                        return (
                            <MessageBubble
                                key={index}
                                msg={msg}
                                onAvatarClick={setSelectedUser}
                                onImageClick={setSelectedImage}
                                onToggleFavorite={() => toggleFavorite(index)}
                                onDeleteMessage={deleteMessage}
                            />
                        );
                    })}

                    {showFavoritesOnly && messages.filter(msg => msg.isFavorite).length === 0 && (
                        <div className="text-center text-[#86868b] mt-10 text-[14px]">
                            Você ainda não tem nenhuma mensagem favorita nesta sala.
                        </div>
                    )}

                </div>

                <footer className="pb-4 shrink-0 relative">
                    {imagePreview && (
                        <div className="absolute bottom-[calc(100%+10px)] left-0 skeuo-panel p-2 flex items-center gap-2 z-10 animate-fade-in-up">
                            <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-[8px]" />
                            <button type="button" onClick={clearImagePreview} className="p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition text-[#1d1d1f]">
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <form onSubmit={sendMessage} className="relative flex items-center">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current.click()} className="absolute left-4 text-[#86868b] hover:text-[#0071e3] transition-colors focus:outline-none">
                            <ImagePlus size={20} />
                        </button>

                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Mensagem..."
                            autoComplete="off"
                            className="skeuo-input w-full py-3 pl-12 pr-12 text-[16px]"
                        />

                        <button type="submit" disabled={!currentMessage.trim() && !imagePreview} className={`absolute right-2 text-white w-9 h-9 rounded-full flex items-center justify-center transition shadow-sm ${currentMessage.trim() || imagePreview ? 'skeuo-btn px-0 py-0' : 'bg-gray-300 cursor-not-allowed'}`}>
                            <Send size={18} />
                        </button>
                    </form>
                </footer>

            </main>
        </>
    );
};

export default Chat;