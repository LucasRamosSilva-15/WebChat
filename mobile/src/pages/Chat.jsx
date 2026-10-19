import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, ArrowLeft, Info, Users, Check, CheckCheck } from 'lucide-react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { socket } from '../services/socket';
import { apiRequest } from '../services/api';
import RoomMembersSheet from '../components/mobile/RoomMembersSheet';

export default function MobileChat() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const room = roomId || searchParams.get('room') || 'Geral';
  const currentUserId = localStorage.getItem('chat_uniqueUserId') || 'guest';
  const displayName = localStorage.getItem('chat_displayName') || 'Usuário';

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Sistema SkyRipple',
      text: `Bem-vindo à sala ${room}! Toque para conversar.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('join_room', { room, userId: currentUserId });

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, {
        id: msg.id || String(Date.now()),
        sender: msg.sender || msg.userName || 'Membro',
        text: msg.text || msg.message || '',
        timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: msg.userId === currentUserId || msg.sender === displayName,
        image: msg.image || null
      }]);
    };

    socket.on('receive_message', handleNewMessage);
    socket.on('chat_message', handleNewMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
      socket.off('chat_message', handleNewMessage);
    };
  }, [room, currentUserId, displayName]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !imagePreview) return;

    const newMsg = {
      id: String(Date.now()),
      room,
      userId: currentUserId,
      sender: displayName,
      text: inputText.trim(),
      image: imagePreview,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };

    setMessages((prev) => [...prev, newMsg]);
    socket.emit('send_message', newMsg);

    setInputText('');
    setImagePreview(null);
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden relative shadow-2xl">
      <header className="shrink-0 pt-[calc(env(safe-area-inset-top,0px)+8px)] px-3 pb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="btn-secondary-glossy !w-10 !h-10 !p-0 rounded-full inline-flex items-center justify-center text-slate-700 dark:text-slate-200"
            aria-label="Voltar para Salas"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold leading-tight">
              #{room}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Ao Vivo
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsMembersSheetOpen(true)}
          className="btn-secondary-glossy !w-10 !h-10 !p-0 rounded-full inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-sky-600"
          title="Ver membros da sala"
          aria-label="Ver membros da sala"
        >
          <Users className="w-4 h-4" />
        </button>
      </header>

      <main
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 pt-3 pb-24 skeuo-scrollbar space-y-2.5"
      >
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full shadow-xs">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}
            >
              {!msg.isMine && (
                <span className="text-[10px] font-semibold text-slate-500 ml-2 mb-0.5">
                  {msg.sender}
                </span>
              )}
              <div
                className={`max-w-[82%] p-3 rounded-2xl text-sm leading-relaxed shadow-md ${
                  msg.isMine
                    ? 'skeuo-btn-primary rounded-br-xs text-white'
                    : 'skeuo-card rounded-bl-xs text-slate-800 dark:text-slate-100'
                }`}
              >
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Upload"
                    className="rounded-xl max-h-48 w-full object-cover mb-1.5 border border-white/20"
                  />
                )}
                <p className="break-words">{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                    msg.isMine ? 'text-sky-100' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.isMine && <CheckCheck className="w-3 h-3 text-sky-200" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-20 pb-[calc(env(safe-area-inset-bottom,12px)+8px)] pt-2 px-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.06)]">
        {imagePreview && (
          <div className="relative inline-block mb-2 ml-1">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-14 h-14 object-cover rounded-xl border border-sky-400 shadow-md"
            />
            <button
              type="button"
              onClick={() => setImagePreview(null)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-md mx-auto">
          <label className="btn-secondary-glossy !w-11 !h-11 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center cursor-pointer text-slate-600 dark:text-slate-300 active:scale-95 transition-transform">
            <Image className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />
          </label>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setTimeout(scrollToBottom, 150)}
            placeholder="Digite uma mensagem..."
            className="skeuo-input flex-1 min-h-[44px] px-4 py-2 text-sm rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !imagePreview}
            className="skeuo-btn-primary !w-11 !h-11 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-white disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-transform shadow-md"
            aria-label="Enviar mensagem"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </footer>

      <RoomMembersSheet
        isOpen={isMembersSheetOpen}
        onClose={() => setIsMembersSheetOpen(false)}
        roomId={room}
        members={members}
        currentUserId={currentUserId}
      />
    </div>
  );
}
