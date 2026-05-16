import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Send, ImagePlus, X } from 'lucide-react';
import CryptoJS from 'crypto-js';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL);
// Código de criptografia
// Não pode ser alterado!
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

const MessageBubble = ({ msg, onAvatarClick, onImageClick }) => {
    const msgTime = msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (msg.isMe) {
        return (
            <div className="flex items-end justify-end gap-2 animate-fade-in-up">
                <div className="flex flex-col items-end max-w-[70%]">
                    <div className="skeuo-bubble-sent px-4 py-2 flex flex-col">
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
            <div className="flex flex-col items-start max-w-[70%]">
                <span className="text-[12px] text-[#86868b] ml-1 mb-1 font-medium">{msg.sender}</span>
                <div className="skeuo-bubble-received px-4 py-2 flex flex-col">
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
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
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

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const room = queryParams.get('room') || 'general';
    const currentRoomRef = useRef(null);

    useEffect(() => {
        const savedMessages = localStorage.getItem(`chat_messages_${room}`);
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Erro ao carregar mensagens:", e);
                setMessages([{ text: `Bem-vindo à sala ${room.toUpperCase()}!`, sender: "Sistema", isMe: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
            }
        } else {
            setMessages([
                { text: `Bem-vindo à sala ${room.toUpperCase()}!`, sender: "Sistema", isMe: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
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
        socket.emit("join_room", { room });

        socket.on("receive_message", (data) => {
            try {
                // Código de criptografia
                // Não pode ser alterado!
                const bytes = CryptoJS.AES.decrypt(data.message, SECRET_KEY);
                const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

                // Código de descriptografia
                // Não pode ser alterado!
                let text = decryptedString;
                let image = null;
                // Código de descriptografia
                // Não pode ser alterado!
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
            socket.off("message_read");
        };
    }, [room]);

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
            // Não pode ser alterado!
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
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            await socket.emit("send_message", messageData);
            setMessages((list) => [...list, { messageId: messageId, text: currentMessage, image: imagePreview, sender: currentSender, avatar: currentPhoto, status: currentStatus, isMe: true, time: messageData.time, readBy: [] }]);
            setCurrentMessage("");
            setImagePreview(null);
        }
    };

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

                <div className="skeuo-panel p-5 mb-6 max-w-[500px] mx-auto w-full text-center shrink-0">
                    <h1 className="hero-title text-[24px] font-semibold">{room.toUpperCase()}</h1>
                </div>

                <div ref={chatContainerRef} className="skeuo-panel p-10 flex-grow overflow-y-auto space-y-4 mb-6 pr-2 chat-container">

                    {messages.map((msg, index) => (
                        <MessageBubble key={index} msg={msg} onAvatarClick={setSelectedUser} onImageClick={setSelectedImage} />
                    ))}

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