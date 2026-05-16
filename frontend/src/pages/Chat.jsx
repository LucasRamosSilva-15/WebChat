import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Send } from 'lucide-react';
import CryptoJS from 'crypto-js';

const socket = io('http://localhost:3001');
// Código de criptografia
// Não pode ser alterado!!!!!!!!!!!!!!!!!!!!!
const SECRET_KEY = "WebChat_E2EE_Secret_Key_Minix";

const Avatar = () => (
    <div className="w-8 h-8 rounded-full bg-gray-100 border border-[#d2d2d7] shrink-0 flex items-center justify-center overflow-hidden shadow-sm mb-4">
        <svg className="w-5 h-5 text-[#86868b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    </div>
);

const MessageBubble = ({ msg }) => {
    const msgTime = msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (msg.isMe) {
        return (
            <div className="flex items-end justify-end gap-2 animate-fade-in-up">
                <div className="flex flex-col items-end max-w-[70%]">
                    <div className="bg-[#0071e3] text-white px-4 py-2 rounded-[18px] rounded-br-sm shadow-sm">
                        <p className="text-[16px] leading-snug">{msg.text}</p>
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
                <Avatar />
            </div>
        );
    }

    return (
        <div className="flex items-end justify-start gap-2 animate-fade-in-up">
            <Avatar />
            <div className="flex flex-col items-start max-w-[70%]">
                <span className="text-[12px] text-[#86868b] ml-1 mb-1 font-medium">{msg.sender}</span>
                <div className="bg-white/70 backdrop-blur-sm text-[#1d1d1f] px-4 py-2 rounded-[18px] rounded-bl-sm shadow-sm border border-white/20">
                    <p className="text-[16px] leading-snug">{msg.text}</p>
                </div>
                <span className="text-[11px] text-[#86868b] mt-1 ml-1 uppercase tracking-widest">{msgTime}</span>
            </div>
        </div>
    );
};

const Chat = () => {
    const [messages, setMessages] = useState([
        { text: "Bem-vindo ao chat!", sender: "Sistema", isMe: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [currentMessage, setCurrentMessage] = useState("");
    const chatContainerRef = useRef(null);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const room = queryParams.get('room') || 'general';

    useEffect(() => {
        socket.emit("join_room", { room });

        socket.on("receive_message", (data) => {
            try {
                // Código de criptografia
                // Não pode ser alterado!!!
                const bytes = CryptoJS.AES.decrypt(data.message, SECRET_KEY);
                const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
                // Código de criptografia
                // Não pode ser alterado!!!
                if (decryptedMessage) {
                    setMessages((list) => [...list, { messageId: data.messageId, text: decryptedMessage, sender: data.sender, isMe: false, time: data.time, readBy: [] }]);

                    // Emite recibo de leitura para a sala
                    const currentReader = localStorage.getItem('chat_displayName') || "Usuário";
                    if (data.messageId) {
                        socket.emit("read_message", { room: data.room, messageId: data.messageId, reader: currentReader });
                    }
                } else {
                    setMessages((list) => [...list, { messageId: data.messageId, text: data.message, sender: data.sender, isMe: false, time: data.time, readBy: [] }]);
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
        if (currentMessage.trim() !== "") {
            const currentSender = localStorage.getItem('chat_displayName') || "Usuário";

            // Código de criptografia
            // Não pode ser alterado!!!
            const encryptedMessage = CryptoJS.AES.encrypt(currentMessage, SECRET_KEY).toString();

            // Gerar ID único para a mensagem para rastrear visualizações
            const messageId = Date.now().toString() + Math.random().toString(36).substring(7);

            const messageData = {
                room: room,
                messageId: messageId,
                sender: currentSender,
                message: encryptedMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            await socket.emit("send_message", messageData);
            setMessages((list) => [...list, { messageId: messageId, text: currentMessage, sender: currentSender, isMe: true, time: messageData.time, readBy: [] }]);
            setCurrentMessage("");
        }
    };

    return (
        <main className="reveal flex-grow flex flex-col max-w-[1000px] mx-auto w-full p-4 md:p-6 h-[calc(100vh-120px)] overflow-hidden">

            <div className="bg-white/80 backdrop-blur-xl rounded-[28px] shadow-2xl p-5 mb-6 max-w-[500px] mx-auto w-full text-center shrink-0">
                <h1 className="hero-title text-[24px] font-semibold text-[#1d1d1f]">{room.toUpperCase()}</h1>
            </div>

            <div ref={chatContainerRef} className="bg-white/80 backdrop-blur-xl rounded-[28px] shadow-2xl p-10 flex-grow overflow-y-auto space-y-4 mb-6 pr-2 chat-container">

                {messages.map((msg, index) => (
                    <MessageBubble key={index} msg={msg} />
                ))}

            </div>

            <footer className="pb-4 shrink-0">
                <form onSubmit={sendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Message"
                        autoComplete="off"
                        className="apple-input w-full bg-white/50 border border-[#d2d2d7] rounded-[22px] py-3 pl-5 pr-12 text-[16px] focus:outline-none focus:bg-white transition-all shadow-sm"
                    />

                    <button type="submit" className="absolute right-2 bg-[#0071e3] text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#0077ed] transition shadow-sm">
                        <Send size={18} />
                    </button>
                </form>
            </footer>

        </main>
    );
};

export default Chat;
