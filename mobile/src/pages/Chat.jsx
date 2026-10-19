import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, ArrowLeft, Users, Check, CheckCheck, Copy, Trash2 } from 'lucide-react';
import { useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { socket } from '../services/socket';
import { apiRequest } from '../services/api';
import RoomMembersSheet from '../components/mobile/RoomMembersSheet';
import MobileSheet from '../components/mobile/MobileSheet';

export default function MobileChat() {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const roomState = location.state?.room;

  const currentRoomId = roomId || searchParams.get('roomId') || searchParams.get('room');
  const roomTitle = roomState?.name || searchParams.get('name') || (currentRoomId ? `${currentRoomId}` : 'Geral');
  const currentUserId = localStorage.getItem('chat_uniqueUserId') || 'guest';
  const displayName = localStorage.getItem('chat_displayName') || 'Usuário';

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const touchTimerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTouchStart = (e, msg) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      setSelectedMessage(msg);
      setIsActionSheetOpen(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  const handleTouchMove = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentRoomId) return;
    apiRequest(`/rooms/${currentRoomId}/messages`)
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data.map(m => ({
            id: m.id || String(m._id || Date.now()),
            sender: m.user?.displayName || m.sender || m.userName || m.user_name || 'Membro',
            text: m.content || m.text || m.message || '',
            content: m.content || m.text || m.message || '',
            time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (m.timestamp || ''),
            timestamp: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (m.timestamp || ''),
            isMine: m.user_id === currentUserId || m.userId === currentUserId || m.sender === displayName,
            image: m.image_url || m.image || null
          })));
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar mensagens da sala:', err.message);
      });
  }, [currentRoomId, currentUserId, displayName]);

  useEffect(() => {
    if (!currentRoomId) return;
    if (!socket.connected) {
      socket.connect();
    }
    socket.emit('join_room', { room: String(currentRoomId), roomId: currentRoomId, userId: currentUserId });

    const handleNewMessage = (msg) => {
      setMessages((prev) => [...prev, {
        id: msg.id || String(Date.now()),
        sender: msg.user?.displayName || msg.sender || msg.userName || 'Membro',
        text: msg.content || msg.text || msg.message || '',
        content: msg.content || msg.text || msg.message || '',
        time: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: msg.user_id === currentUserId || msg.userId === currentUserId || msg.sender === displayName,
        image: msg.image_url || msg.image || null
      }]);
    };

    const handleDeleteMessage = ({ messageId }) => {
      setMessages((prev) => prev.filter(m => m.id !== messageId));
    };

    socket.on('receive_message', handleNewMessage);
    socket.on('chat_message', handleNewMessage);
    socket.on('message_deleted', handleDeleteMessage);
    socket.on('delete_message', handleDeleteMessage);

    return () => {
      socket.off('receive_message', handleNewMessage);
      socket.off('chat_message', handleNewMessage);
      socket.off('message_deleted', handleDeleteMessage);
      socket.off('delete_message', handleDeleteMessage);
    };
  }, [currentRoomId, currentUserId, displayName]);

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !imagePreview) return;

    const contentText = inputText.trim();
    const tempMsg = {
      id: String(Date.now()),
      room: String(currentRoomId),
      roomId: currentRoomId,
      userId: currentUserId,
      sender: displayName,
      text: contentText,
      content: contentText,
      image: imagePreview,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText('');
    setImagePreview(null);

    socket.emit('send_message', tempMsg);

    try {
      await apiRequest(`/rooms/${currentRoomId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: contentText,
          imageUrl: imagePreview
        })
      });
    } catch (err) {
      console.warn('Falha ao persistir mensagem na API:', err.message);
    }
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
              #{roomTitle}
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
        {messages.length === 0 && (
          <div className="py-20 text-center px-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              Nenhuma mensagem nesta sala
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Envie a primeira mensagem para iniciar a conversa!
            </p>
          </div>
        )}
        {messages.map((msg, index) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id || index} className="flex justify-center my-2">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full shadow-xs">
                  {msg.content || msg.text}
                </span>
              </div>
            );
          }

          if (msg.isMine) {
            return (
              <div
                key={msg.id || index}
                onTouchStart={(e) => handleTouchStart(e, msg)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                className="flex flex-col items-end max-w-[80%] ml-auto my-1.5 select-none"
              >
                <div className="bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-[0_3px_8px_rgba(14,165,233,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] border border-sky-400/70 rounded-3xl rounded-tr-md px-4 py-2 text-sm leading-relaxed relative break-words">
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Upload"
                      className="rounded-2xl max-h-48 w-full object-cover mb-1.5 border border-white/20"
                    />
                  )}
                  <span>{msg.content || msg.text}</span>

                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-sky-100 font-medium select-none">
                    <span>{msg.time || msg.timestamp || '13:35'}</span>
                    <CheckCheck className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id || index}
              onTouchStart={(e) => handleTouchStart(e, msg)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              className="flex flex-col items-start max-w-[80%] mr-auto my-1.5 select-none"
            >
              <span className="text-[10px] font-semibold text-slate-500 ml-3 mb-0.5">
                {msg.sender}
              </span>
              <div className="skeuo-card rounded-3xl rounded-tl-md px-4 py-2 text-sm leading-relaxed relative break-words text-slate-800 dark:text-slate-100 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="Upload"
                    className="rounded-2xl max-h-48 w-full object-cover mb-1.5 border border-slate-200 dark:border-slate-700"
                  />
                )}
                <span>{msg.content || msg.text}</span>
                <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-slate-400 font-medium select-none">
                  <span>{msg.time || msg.timestamp}</span>
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
        roomId={roomTitle}
        members={members}
        currentUserId={currentUserId}
      />

      <MobileSheet
        isOpen={isActionSheetOpen}
        onClose={() => {
          setIsActionSheetOpen(false);
          setSelectedMessage(null);
        }}
        title="Ações da Mensagem"
      >
        <div className="space-y-2 py-1">
          <button
            type="button"
            onClick={() => {
              if (selectedMessage) {
                const textToCopy = selectedMessage.content || selectedMessage.text || '';
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(textToCopy);
                }
              }
              setIsActionSheetOpen(false);
            }}
            className="btn-secondary-glossy w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold justify-start active:scale-[0.98] transition-transform"
          >
            <Copy className="w-4 h-4 text-sky-500" />
            <span>Copiar Texto</span>
          </button>

          {selectedMessage?.isMine && (
            <button
              type="button"
              onClick={async () => {
                if (!selectedMessage) return;
                const msgId = selectedMessage.id;
                socket.emit('delete_message', { room: String(currentRoomId), messageId: msgId });
                try {
                  await apiRequest(`/messages/${msgId}`, { method: 'DELETE' });
                } catch (e) {
                  console.warn('Erro ao excluir mensagem via API:', e.message);
                }
                setMessages(prev => prev.filter(m => m.id !== msgId));
                setIsActionSheetOpen(false);
              }}
              className="btn-secondary-glossy w-full px-4 py-3 rounded-2xl flex items-center gap-3 text-sm font-semibold justify-start text-rose-600 active:scale-[0.98] transition-transform"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Apagar Mensagem</span>
            </button>
          )}
        </div>
      </MobileSheet>
    </div>
  );
}
