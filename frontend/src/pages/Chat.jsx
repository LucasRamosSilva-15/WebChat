import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client';
import { Send } from 'lucide-react';

const socket = io('http://localhost:3001');

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
            setMessages((list) => [...list, { text: data.message, sender: data.sender, isMe: false, time: data.time }]);
        });

        return () => {
            socket.off("receive_message");
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
            const messageData = {
                room: room,
                sender: currentSender,
                message: currentMessage,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            await socket.emit("send_message", messageData);
            setMessages((list) => [...list, { text: currentMessage, sender: currentSender, isMe: true, time: messageData.time }]);
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
