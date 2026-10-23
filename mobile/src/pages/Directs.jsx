import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MessageSquarePlus,
  Search,
  ShieldCheck,
  UserCheck,
  Lock,
  Loader2,
  ArrowLeft,
  Send,
  Image,
  CheckCheck,
  Check,
  X,
  Reply
} from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileSheet from '../components/mobile/MobileSheet';
import MessageActionsSheet from '../components/mobile/MessageActionsSheet';
import { apiRequest } from '../services/api';
import { socket } from '../services/socket';
import { useKeyboard } from '../hooks/useKeyboard';
import {
  getConversationCrypto,
  encryptMessage,
  decryptIncoming,
  initIdentity
} from '../services/directCrypto';

export default function MobileDirects({ onOpenNotifications, unreadCount = 0, onChatOpenChange }) {
  const currentUserId = localStorage.getItem('chat_uniqueUserId') || 'guest';
  const displayName = localStorage.getItem('chat_displayName') || 'Usuário';
  const location = useLocation();
  const { keyboardHeight } = useKeyboard();

  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem('chat_direct_conversations');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const stored = localStorage.getItem('chat_direct_conversations');
      return !stored;
    } catch {
      return false;
    }
  });
  const [selectedConv, setSelectedConv] = useState(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [partnerTyping, setPartnerTyping] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const [isNewDmSheetOpen, setIsNewDmSheetOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [startingConvId, setStartingConvId] = useState(null);

  const messagesEndRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const touchTimerRef = useRef(null);
  const selectedConvRef = useRef(selectedConv);

  useEffect(() => {
    selectedConvRef.current = selectedConv;
    onChatOpenChange?.(Boolean(selectedConv));
    return () => {
      onChatOpenChange?.(false);
    };
  }, [selectedConv, onChatOpenChange]);

  useEffect(() => {
    initIdentity(currentUserId);
  }, [currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await apiRequest('/directs/conversations');
      if (Array.isArray(data)) {
        setConversations(data);
        try {
          localStorage.setItem('chat_direct_conversations', JSON.stringify(data));
        } catch {}
      }
    } catch (err) {
      console.warn('Erro ao carregar conversas diretas:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasCached = Boolean(localStorage.getItem('chat_direct_conversations'));
    fetchConversations(hasCached);
  }, []);

  useEffect(() => {
    if (!selectedConv?.id) {
      setMessages([]);
      setPartnerTyping(null);
      return;
    }

    const convId = selectedConv.id;
    const partnerId = selectedConv.partnerId;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('joinRoom', {
      roomId: String(convId),
      user: { id: currentUserId, name: displayName }
    });

    socket.emit('direct_read_receipt', {
      conversationId: convId,
      userId: currentUserId
    });

    apiRequest(`/directs/conversations/${convId}/messages?limit=50`)
      .then(async (response) => {
        const rawList = Array.isArray(response) ? response : response?.messages || [];
        const decryptedList = await Promise.all(
          rawList.map(m => decryptIncoming(m, currentUserId, partnerId, convId))
        );
        if (selectedConvRef.current?.id === convId) {
          setMessages(decryptedList.map(m => ({
            id: m.id || String(m._id || Date.now()),
            sender: m.user?.displayName || m.sender || m.userName || selectedConv.name || 'Contato',
            text: m.content || m.text || '',
            content: m.content || m.text || '',
            time: m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (m.timestamp || ''),
            isMine: m.user_id === currentUserId || m.userId === currentUserId || m.sender === displayName,
            image: m.image_url || m.image || null,
            replyTo: m.replyTo || m.reply_to || null,
            encrypted: Boolean(m.encrypted),
            reactions: m.reactions || {}
          })));
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar histórico da conversa:', err.message);
      });

    const handleReceiveMessage = async (rawMsg) => {
      const msg = await decryptIncoming(rawMsg, currentUserId, partnerId, convId);
      setMessages((prev) => [...prev, {
        id: msg.id || String(Date.now()),
        sender: msg.user?.displayName || msg.sender || msg.userName || 'Contato',
        text: msg.content || msg.text || '',
        content: msg.content || msg.text || '',
        time: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMine: msg.user_id === currentUserId || msg.userId === currentUserId || msg.sender === displayName,
        image: msg.image_url || msg.image || null,
        replyTo: msg.replyTo || msg.reply_to || null,
        encrypted: Boolean(msg.encrypted),
        reactions: msg.reactions || {}
      }]);
      scrollToBottom();
    };

    const handleTypingDirect = (payload) => {
      if (payload?.conversationId === convId && payload?.userId !== currentUserId) {
        setPartnerTyping(payload.userName || selectedConv.name || 'Contato');
      }
    };

    const handleStopTypingDirect = (payload) => {
      if (payload?.conversationId === convId && payload?.userId !== currentUserId) {
        setPartnerTyping(null);
      }
    };

    const handleReadReceipt = (payload) => {
      if (payload?.conversationId === convId) {
        setMessages((prev) => prev.map(m => ({ ...m, read: true })));
      }
    };

    const handleDeleteMessage = ({ messageId }) => {
      setMessages((prev) => prev.filter(m => m.id !== messageId));
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('typing_direct', handleTypingDirect);
    socket.on('stop_typing_direct', handleStopTypingDirect);
    socket.on('direct_read_receipt', handleReadReceipt);
    socket.on('delete_message', handleDeleteMessage);

    return () => {
      socket.emit('leaveRoom', { roomId: String(convId), userId: currentUserId });
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_direct', handleTypingDirect);
      socket.off('stop_typing_direct', handleStopTypingDirect);
      socket.off('direct_read_receipt', handleReadReceipt);
      socket.off('delete_message', handleDeleteMessage);
    };
  }, [selectedConv?.id, currentUserId, displayName]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const searchUsers = async (query) => {
    setLoadingUsers(true);
    try {
      const users = await apiRequest(`/directs/users?q=${encodeURIComponent(query)}`);
      if (Array.isArray(users)) {
        setAvailableUsers(users);
      }
    } catch (err) {
      console.warn('Erro ao buscar usuários:', err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!isNewDmSheetOpen) {
      setUserSearchQuery('');
      setAvailableUsers([]);
      return;
    }
    searchUsers('');
  }, [isNewDmSheetOpen]);

  const handleUserSearchChange = (e) => {
    const query = e.target.value;
    setUserSearchQuery(query);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      searchUsers(query);
    }, 300);
  };

  const handleSelectUser = async (user) => {
    if (!user?.id || startingConvId) return;
    setStartingConvId(user.id);

    try {
      const conv = await apiRequest('/directs/conversations', {
        method: 'POST',
        body: JSON.stringify({ targetUserId: user.id })
      });

      setIsNewDmSheetOpen(false);
      setUserSearchQuery('');
      await fetchConversations();

      const convEntry = {
        id: conv?.id || user.id,
        partnerId: user.id,
        name: user.name || user.email,
        avatar: user.avatar,
        online: user.isOnline,
        lastMessage: 'Conversa iniciada'
      };

      setSelectedConv(convEntry);
    } catch (err) {
      console.warn('Falha ao abrir conversa direta:', err.message);
    } finally {
      setStartingConvId(null);
    }
  };

  useEffect(() => {
    if (location.state?.targetUser) {
      handleSelectUser(location.state.targetUser);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputText(value);

    if (!selectedConv?.id) return;

    socket.emit('typing_direct', {
      conversationId: selectedConv.id,
      userId: currentUserId,
      userName: displayName
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop_typing_direct', {
        conversationId: selectedConv.id,
        userId: currentUserId
      });
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !imagePreview) return;
    if (!selectedConv?.id) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit('stop_typing_direct', {
        conversationId: selectedConv.id,
        userId: currentUserId
      });
    }

    const textToSend = inputText.trim();
    const imageToSend = imagePreview;
    const replyToSend = replyingTo ? {
      id: replyingTo.id,
      sender: replyingTo.sender,
      text: replyingTo.content || replyingTo.text || ''
    } : null;

    setInputText('');
    setImagePreview(null);
    setReplyingTo(null);

    const tempMsg = {
      id: String(Date.now()),
      sender: displayName,
      text: textToSend,
      content: textToSend,
      image: imageToSend,
      replyTo: replyToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
      encrypted: true
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      const cryptoEntry = await getConversationCrypto(currentUserId, selectedConv.partnerId);
      let payloadContent = textToSend;

      if (cryptoEntry) {
        payloadContent = await encryptMessage(cryptoEntry, selectedConv.id, {
          text: textToSend,
          image: imageToSend,
          attachment: null
        });
      }

      socket.emit('send_message', {
        room: selectedConv.id,
        content: payloadContent,
        sender: displayName,
        userId: currentUserId,
        replyTo: replyToSend,
        timestamp: tempMsg.time
      });

      await apiRequest(`/directs/conversations/${selectedConv.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: payloadContent,
          imageUrl: imageToSend,
          replyTo: replyToSend
        })
      });

      setConversations((prev) => prev.map(c => {
        if (c.id === selectedConv.id) {
          return {
            ...c,
            lastMessage: textToSend || 'Foto enviada',
            time: 'Agora'
          };
        }
        return c;
      }));
    } catch (err) {
      console.warn('Erro ao enviar mensagem direta cifrada:', err.message);
    }
  };

  const handleTouchStart = (e, msg) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    touchTimerRef.current = setTimeout(() => {
      setSelectedMessage(msg);
      setIsActionSheetOpen(true);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
    }, 400);
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

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const filteredConversations = conversations.filter(c =>
    (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.lastMessage && c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatLastMessage = (msg) => {
    if (!msg) return 'Conversa iniciada';
    if (typeof msg === 'string' && msg.startsWith('e2ee:v1:')) {
      return '🔒 Mensagem Criptografada (E2EE)';
    }
    return msg;
  };

  if (selectedConv) {
    return (
      <div className="fixed inset-0 z-40 max-w-md mx-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col h-[100dvh] overflow-hidden">
        <header className="shrink-0 pt-[calc(env(safe-area-inset-top,0px)+8px)] px-3 pb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                setSelectedConv(null);
                onChatOpenChange?.(false);
              }}
              className="btn-secondary-glossy !w-10 !h-10 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer"
              aria-label="Voltar para a lista de conversas"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative shrink-0 w-10 h-10 rounded-full border border-sky-400 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {selectedConv.avatar ? (
                <img src={selectedConv.avatar} alt={selectedConv.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                (selectedConv.name || 'U').charAt(0).toUpperCase()
              )}
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${selectedConv.online ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {selectedConv.name}
                </h2>
                <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" title="Criptografia Ponta a Ponta Ativa" />
              </div>
              <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                {partnerTyping ? 'a escrever...' : (selectedConv.online ? 'Online' : 'Visto recentemente')}
              </div>
            </div>
          </div>

          <div className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-[10px] font-extrabold text-sky-600 dark:text-sky-400 flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>E2EE</span>
          </div>
        </header>

        {partnerTyping && (
          <div className="bg-sky-50 dark:bg-slate-900 px-4 py-1 border-b border-sky-100 dark:border-slate-800 text-[11px] font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-2 animate-fade-in shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
            <span>{partnerTyping} está a escrever...</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 skeuo-scrollbar space-y-2.5">
          {messages.length === 0 && (
            <div className="py-20 text-center px-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-slate-800 flex items-center justify-center text-sky-500 mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Conversa Criptografada
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                As mensagens enviadas aqui são protegidas com criptografia de ponta a ponta (Web Crypto API).
              </p>
            </div>
          )}

          {messages.map((msg, index) => {
            if (msg.isMine) {
              return (
                <div
                  key={msg.id || index}
                  onTouchStart={(e) => handleTouchStart(e, msg)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                  className="flex flex-col items-end max-w-[85%] ml-auto my-1.5 select-none"
                >
                  <div className="bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-[0_3px_8px_rgba(14,165,233,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] border border-sky-400/70 rounded-3xl rounded-tr-md px-4 py-2 text-sm leading-relaxed relative break-words">
                    {msg.replyTo && (
                      <div className="mb-1.5 p-1.5 px-2.5 rounded-xl bg-white/20 border-l-3 border-white text-xs text-sky-50">
                        <div className="font-bold text-[10px] opacity-90">{msg.replyTo.sender}</div>
                        <div className="truncate text-[11px] opacity-80">{msg.replyTo.text}</div>
                      </div>
                    )}

                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="Upload"
                        className="rounded-2xl max-h-48 w-full object-cover mb-1.5 border border-white/20"
                      />
                    )}
                    <span>{msg.content || msg.text}</span>

                    <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-sky-100 font-medium select-none">
                      {msg.encrypted && <Lock className="w-2.5 h-2.5 opacity-80" />}
                      <span>{msg.time}</span>
                      <CheckCheck className={`w-3.5 h-3.5 stroke-[2.5] ${msg.read ? 'text-sky-200' : 'text-white'}`} />
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
                className="flex flex-col items-start max-w-[85%] mr-auto my-1.5 select-none"
              >
                <div className="skeuo-card rounded-3xl rounded-tl-md px-4 py-2 text-sm leading-relaxed relative break-words text-slate-800 dark:text-slate-100 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
                  {msg.replyTo && (
                    <div className="mb-1.5 p-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-3 border-sky-500 text-xs text-slate-600 dark:text-slate-300">
                      <div className="font-bold text-[10px] text-sky-600 dark:text-sky-400">{msg.replyTo.sender}</div>
                      <div className="truncate text-[11px] opacity-80">{msg.replyTo.text}</div>
                    </div>
                  )}

                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Upload"
                      className="rounded-2xl max-h-48 w-full object-cover mb-1.5 border border-slate-200 dark:border-slate-700"
                    />
                  )}
                  <span>{msg.content || msg.text}</span>
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-slate-400 font-medium select-none">
                    {msg.encrypted && <Lock className="w-2.5 h-2.5 text-sky-500" />}
                    <span>{msg.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </main>

        <footer
          style={{
            paddingBottom: keyboardHeight > 0
              ? `${keyboardHeight + 8}px`
              : 'calc(env(safe-area-inset-bottom, 12px) + 8px)'
          }}
          className="shrink-0 p-3 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-[padding] duration-150"
        >
          {replyingTo && (
            <div className="anim-fade-rise flex items-center justify-between gap-2 p-2 px-3 mb-2 rounded-2xl bg-sky-50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Reply className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-sky-600 dark:text-sky-400 block text-[11px]">
                    Respondendo a {replyingTo.sender}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 truncate block text-[11px]">
                    {replyingTo.content || replyingTo.text}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {imagePreview && (
            <div className="anim-fade-rise relative inline-block mb-2 ml-1">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-14 h-14 object-cover rounded-xl border border-sky-400 shadow-md"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md cursor-pointer"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <label className="btn-secondary-glossy !w-10 !h-10 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center cursor-pointer text-slate-600 dark:text-slate-300 active:scale-95 transition-transform shrink-0">
              <Image className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagePick}
              />
            </label>

            <input
              type="text"
              placeholder="Mensagem segura (E2EE)..."
              value={inputText}
              onChange={handleInputChange}
              onFocus={() => setTimeout(scrollToBottom, 150)}
              className="skeuo-input flex-1 px-4 py-2.5 text-sm rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400 min-h-[44px]"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !imagePreview}
              className="skeuo-btn-primary !w-10 !h-10 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-white disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-transform shadow-md cursor-pointer shrink-0"
              aria-label="Enviar mensagem direta"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </footer>

        <MessageActionsSheet
          isOpen={isActionSheetOpen}
          onClose={() => {
            setIsActionSheetOpen(false);
            setSelectedMessage(null);
          }}
          message={selectedMessage}
          onCopy={(msg) => {
            const textToCopy = msg.content || msg.text || '';
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
              navigator.clipboard.writeText(textToCopy);
            }
          }}
          onReply={(msg) => setReplyingTo(msg)}
          onDelete={(msg) => {
            if (!msg) return;
            socket.emit('delete_message', { room: String(selectedConv.id), messageId: msg.id });
            setMessages(prev => prev.filter(m => m.id !== msg.id));
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Mensagens Diretas"
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      <div className="px-3 pt-3 max-w-md mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar contatos..."
              className="skeuo-input w-full pl-10 pr-4 py-2 text-sm rounded-2xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsNewDmSheetOpen(true)}
            className="skeuo-btn-primary !w-11 !h-11 min-h-[44px] !p-0 rounded-2xl flex items-center justify-center text-white shadow-md active:scale-95 transition-transform cursor-pointer"
            aria-label="Nova conversa direta"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {loading && filteredConversations.length === 0 ? (
            <div className="text-center py-16 text-sm text-slate-400 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
              <span>Carregando conversas...</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-16 px-4 text-sm text-slate-400 flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl skeuo-well flex items-center justify-center mb-3 text-slate-400">
                <MessageSquarePlus className="w-7 h-7" />
              </div>
              <p className="font-semibold text-slate-600 dark:text-slate-300">
                Nenhuma conversa iniciada.
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Toque no botão + acima para pesquisar usuários e iniciar um chat privado.
              </p>
            </div>
          ) : (
            filteredConversations.map((conv, convIndex) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                style={{ '--index': Math.min(convIndex, 12) }}
                className="anim-card-stagger skeuo-card p-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-[transform,box-shadow] duration-150 flex items-center justify-between shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0 w-11 h-11 rounded-full border border-sky-400/80 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_5px_rgba(14,165,233,0.3)]">
                    {conv.avatar ? (
                      <img src={conv.avatar} alt={conv.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      (conv.name || 'U').charAt(0).toUpperCase()
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${conv.online ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {conv.name}
                      </h4>
                      <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" title="Criptografia ponta a ponta ativa" />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {formatLastMessage(conv.lastMessage)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1 pl-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {conv.time || 'Agora'}
                  </span>
                  {conv.unread > 0 && (
                    <span className="min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border border-white">
                      {conv.unread}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <MobileSheet
        isOpen={isNewDmSheetOpen}
        onClose={() => setIsNewDmSheetOpen(false)}
        title="Nova Conversa Direta"
      >
        <div className="space-y-3 pt-1">
          <div className="relative">
            <input
              type="text"
              value={userSearchQuery}
              onChange={handleUserSearchChange}
              placeholder="Buscar contatos por nome ou e-mail..."
              className="skeuo-input w-full pl-10 pr-4 py-2.5 text-sm rounded-xl"
              autoFocus
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="space-y-1.5 max-h-72 overflow-y-auto skeuo-scrollbar pr-0.5 pt-1">
            {loadingUsers ? (
              <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                <span>Buscando usuários...</span>
              </div>
            ) : availableUsers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                {userSearchQuery ? 'Nenhum usuário encontrado.' : 'Nenhum contato disponível.'}
              </div>
            ) : (
              availableUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelectUser(user)}
                  disabled={startingConvId === user.id}
                  className="w-full p-2.5 rounded-2xl skeuo-card flex items-center justify-between gap-3 text-left active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0 w-10 h-10 rounded-full border border-sky-400 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        (user.name || 'U').charAt(0).toUpperCase()
                      )}
                      <span
                        className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-1.5 ring-white dark:ring-slate-900 ${user.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {startingConvId === user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-sky-500 shrink-0 mr-2" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-sky-500 shrink-0 mr-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </MobileSheet>
    </div>
  );
}
