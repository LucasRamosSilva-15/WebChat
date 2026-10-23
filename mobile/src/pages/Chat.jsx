import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Image,
  ArrowLeft,
  Users,
  CheckCheck,
  Reply,
  X,
  Pin,
  Pencil,
  AlertTriangle
} from 'lucide-react';
import { useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { socket } from '../services/socket';
import { apiRequest } from '../services/api';
import { useKeyboard } from '../hooks/useKeyboard';
import { useHaptics } from '../hooks/useHaptics';
import RoomMembersSheet from '../components/mobile/RoomMembersSheet';
import MessageActionsSheet from '../components/mobile/MessageActionsSheet';
import UserProfileSheet from '../components/mobile/UserProfileSheet';

export default function MobileChat() {
  const navigate = useNavigate();
  const { triggerImpact } = useHaptics();
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const roomState = location.state?.room;

  const currentRoomId = roomId || searchParams.get('roomId') || searchParams.get('room');
  const roomTitle = roomState?.name || searchParams.get('name') || (currentRoomId ? `${currentRoomId}` : 'Geral');
  const currentUserId = localStorage.getItem('chat_uniqueUserId') || 'guest';
  const displayName = localStorage.getItem('chat_displayName') || 'Usuário';

  const { keyboardHeight } = useKeyboard();
  const [messages, setMessages] = useState(() => {
    try {
      if (!currentRoomId) return [];
      const cached = localStorage.getItem(`chat_room_msgs_${currentRoomId}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);
  const [members, setMembers] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  const [typingUser, setTypingUser] = useState(null);
  const [pinnedMessage, setPinnedMessage] = useState(() => {
    try {
      const stored = localStorage.getItem(`chat_pinned_${currentRoomId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const touchTimerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messageRefs = useRef({});

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMessage = (id) => {
    if (id && messageRefs.current[id]) {
      messageRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!currentRoomId) return;

    apiRequest(`/rooms/${currentRoomId}/members`)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.members || [];
        setMembers(list);
      })
      .catch(() => {});

    apiRequest(`/rooms/${currentRoomId}/messages`)
      .then((response) => {
        const data = Array.isArray(response) ? response : response?.messages;
        if (Array.isArray(data)) {
          const mapped = data.map((m) => ({
            id: m.id || String(m._id || Date.now()),
            sender: m.user?.displayName || m.sender || m.userName || m.user_name || 'Membro',
            userId: m.user_id || m.userId,
            avatar: m.user?.profilePhoto || m.avatar || null,
            role: m.user?.role || m.role || 'user',
            text: m.content || m.text || m.message || '',
            content: m.content || m.text || m.message || '',
            time: m.created_at
              ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : m.timestamp || '',
            timestamp: m.created_at
              ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : m.timestamp || '',
            isMine: m.user_id === currentUserId || m.userId === currentUserId || m.sender === displayName,
            image: m.image_url || m.image || null,
            replyTo: m.replyTo || m.reply_to || null,
            reactions: m.reactions || {},
            isEdited: m.isEdited || m.is_edited || false
          }));
          setMessages(mapped);
          try {
            localStorage.setItem(`chat_room_msgs_${currentRoomId}`, JSON.stringify(mapped.slice(-50)));
          } catch {}
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
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id || String(Date.now()),
          sender: msg.user?.displayName || msg.sender || msg.userName || 'Membro',
          userId: msg.user_id || msg.userId,
          avatar: msg.user?.profilePhoto || msg.avatar || null,
          role: msg.user?.role || msg.role || 'user',
          text: msg.content || msg.text || msg.message || '',
          content: msg.content || msg.text || msg.message || '',
          time: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMine: msg.user_id === currentUserId || msg.userId === currentUserId || msg.sender === displayName,
          image: msg.image_url || msg.image || null,
          replyTo: msg.replyTo || msg.reply_to || null,
          reactions: msg.reactions || {},
          isEdited: msg.isEdited || false
        }
      ]);
    };

    const handleDeleteMessage = ({ messageId }) => {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    };

    const handleLikeToggled = ({ messageId, emoji, reactions, count }) => {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          return {
            ...m,
            reactions: reactions || { ...(m.reactions || {}), [emoji]: count }
          };
        })
      );
    };

    const handleUserTyping = (data) => {
      if (data?.room === String(currentRoomId) && data.userId !== currentUserId) {
        setTypingUser(data.user || 'Alguém');
      }
    };

    const handleUserStopTyping = (data) => {
      if (data?.room === String(currentRoomId) && data.userId !== currentUserId) {
        setTypingUser(null);
      }
    };

    const handleMessageEdited = (data) => {
      if (!data?.messageId) return;
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== data.messageId) return m;
          return {
            ...m,
            content: data.message,
            text: data.message,
            isEdited: true
          };
        })
      );
    };

    socket.on('receive_message', handleNewMessage);
    socket.on('chat_message', handleNewMessage);
    socket.on('message_deleted', handleDeleteMessage);
    socket.on('delete_message', handleDeleteMessage);
    socket.on('like_toggled', handleLikeToggled);
    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStopTyping);
    socket.on('message_edited', handleMessageEdited);

    return () => {
      socket.off('receive_message', handleNewMessage);
      socket.off('chat_message', handleNewMessage);
      socket.off('message_deleted', handleDeleteMessage);
      socket.off('delete_message', handleDeleteMessage);
      socket.off('like_toggled', handleLikeToggled);
      socket.off('user_typing', handleUserTyping);
      socket.off('user_stop_typing', handleUserStopTyping);
      socket.off('message_edited', handleMessageEdited);
    };
  }, [currentRoomId, currentUserId, displayName]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);

    if (currentRoomId) {
      socket.emit('user_typing', {
        room: String(currentRoomId),
        user: displayName,
        userId: currentUserId
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('user_stop_typing', {
          room: String(currentRoomId),
          user: displayName,
          userId: currentUserId
        });
      }, 1500);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !imagePreview) return;
    triggerImpact();

    const contentText = inputText.trim();

    if (editingMessage) {
      const editId = editingMessage.id;
      setMessages((prev) =>
        prev.map((m) => (m.id === editId ? { ...m, content: contentText, text: contentText, isEdited: true } : m))
      );
      setInputText('');
      setEditingMessage(null);

      socket.emit('edit_message', {
        room: String(currentRoomId),
        messageId: editId,
        message: contentText
      });

      try {
        await apiRequest(`/messages/${editId}`, {
          method: 'PUT',
          body: JSON.stringify({ content: contentText })
        });
      } catch (err) {
        try {
          await apiRequest(`/rooms/${currentRoomId}/messages/${editId}`, {
            method: 'PUT',
            body: JSON.stringify({ content: contentText })
          });
        } catch {}
      }
      return;
    }

    const tempMsg = {
      id: String(Date.now()),
      room: String(currentRoomId),
      roomId: currentRoomId,
      userId: currentUserId,
      sender: displayName,
      text: contentText,
      content: contentText,
      image: imagePreview,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            sender: replyingTo.sender,
            text: replyingTo.content || replyingTo.text || ''
          }
        : null,
      reactions: {},
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText('');
    setImagePreview(null);
    setReplyingTo(null);

    socket.emit('send_message', tempMsg);

    try {
      await apiRequest(`/rooms/${currentRoomId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: contentText,
          imageUrl: imagePreview,
          replyTo: tempMsg.replyTo
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

  const handleReact = (emoji, msg) => {
    if (!msg) return;
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msg.id) return m;
        const currentCount = m.reactions?.[emoji] || 0;
        return {
          ...m,
          reactions: {
            ...(m.reactions || {}),
            [emoji]: currentCount + 1
          }
        };
      })
    );

    socket.emit('toggle_like', {
      messageId: msg.id,
      emoji,
      roomId: currentRoomId,
      userId: currentUserId
    });
  };

  const handleCopyMessage = (msg) => {
    const textToCopy = msg.content || msg.text || '';
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
  };

  const handleDeleteMessage = async (msg) => {
    if (!msg) return;
    const msgId = msg.id;
    socket.emit('delete_message', { room: String(currentRoomId), messageId: msgId });
    try {
      await apiRequest(`/messages/${msgId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Erro ao excluir mensagem via API:', e.message);
    }
    setMessages((prev) => prev.filter((m) => m.id !== msgId));
  };

  const handleStartEdit = (msg) => {
    setEditingMessage(msg);
    setInputText(msg.content || msg.text || '');
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setInputText('');
  };

  const handleTogglePin = (msg) => {
    if (pinnedMessage?.id === msg.id) {
      setPinnedMessage(null);
      localStorage.removeItem(`chat_pinned_${currentRoomId}`);
    } else {
      const newPin = {
        id: msg.id,
        sender: msg.sender,
        text: msg.content || msg.text || 'Mensagem fixada'
      };
      setPinnedMessage(newPin);
      localStorage.setItem(`chat_pinned_${currentRoomId}`, JSON.stringify(newPin));
    }
  };

  const handleUnpin = () => {
    setPinnedMessage(null);
    localStorage.removeItem(`chat_pinned_${currentRoomId}`);
  };

  const handleReportMessage = async (msg, reason) => {
    try {
      await apiRequest('/reports', {
        method: 'POST',
        body: JSON.stringify({
          message_id: msg.id,
          reason: reason || 'Denúncia pelo chat móvel'
        })
      });
    } catch {
      try {
        await apiRequest('/feedbacks', {
          method: 'POST',
          body: JSON.stringify({
            reason: 'Denúncia',
            message: `Denúncia da mensagem [ID: ${msg.id}] de ${msg.sender}: Motivo: ${reason}`
          })
        });
      } catch {}
    }
  };

  const handleAvatarClick = (msg) => {
    const foundMember = members.find(
      (m) => m.id === msg.userId || m.user_id === msg.userId || m.name === msg.sender
    );
    const userProfile = {
      id: msg.userId || `user_${msg.sender}`,
      userId: msg.userId,
      name: msg.sender,
      username: foundMember?.username || `@${msg.sender.toLowerCase().replace(/\s+/g, '_')}`,
      avatar: msg.avatar || foundMember?.avatar || null,
      status: foundMember?.status || 'Disponível no SkyRipple',
      role: foundMember?.role || msg.role || 'user',
      isOnline: true
    };
    setSelectedUserProfile(userProfile);
    setIsProfileSheetOpen(true);
  };

  const handleStartDirect = (user) => {
    try {
      const stored = localStorage.getItem('chat_direct_conversations');
      const list = stored ? JSON.parse(stored) : [];
      const convId = user.id || user.userId || `privado-${Date.now()}`;
      const existing = list.find((c) => c.partnerId === user.id || c.name === user.name);

      if (!existing) {
        list.unshift({
          id: convId,
          partnerId: user.id || user.userId,
          name: user.name,
          avatar: user.avatar,
          online: true,
          lastMessage: 'Conversa iniciada pelo chat'
        });
        localStorage.setItem('chat_direct_conversations', JSON.stringify(list));
      }
    } catch {}

    navigate('/directs', { state: { targetUser: user } });
  };

  const currentUserRole =
    roomState?.created_by === currentUserId
      ? 'owner'
      : members.find((m) => m.id === currentUserId || m.user_id === currentUserId)?.role || 'user';

  const canModerate = currentUserRole === 'owner' || currentUserRole === 'moderator' || currentUserRole === 'admin';

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden relative shadow-2xl">
      <header className="shrink-0 pt-[calc(env(safe-area-inset-top,0px)+8px)] px-3 pb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="btn-secondary-glossy !w-10 !h-10 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer"
            aria-label="Voltar para Salas"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-sm font-bold leading-tight">#{roomTitle}</h2>
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
          className="btn-secondary-glossy !w-10 !h-10 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-sky-600 cursor-pointer"
          title="Ver membros da sala"
          aria-label="Ver membros da sala"
        >
          <Users className="w-4 h-4" />
        </button>
      </header>

      {typingUser && (
        <div className="px-4 py-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/40 border-b border-sky-100 dark:border-sky-900/40 flex items-center gap-2 animate-pulse shrink-0">
          <span className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span>
            <strong>{typingUser}</strong> está a digitar...
          </span>
        </div>
      )}

      {pinnedMessage && (
        <div className="mx-3 mt-2 p-2.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(245,158,11,0.08)] flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shrink-0">
          <div
            onClick={() => scrollToMessage(pinnedMessage.id)}
            className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
          >
            <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0 fill-amber-500/20" />
            <div className="truncate min-w-0">
              <span className="font-bold mr-1">{pinnedMessage.sender}:</span>
              <span>{pinnedMessage.text}</span>
            </div>
          </div>
          {canModerate && (
            <button
              type="button"
              onClick={handleUnpin}
              className="ml-2 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
              title="Desfixar mensagem"
            >
              <X className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
            </button>
          )}
        </div>
      )}

      <main
        ref={containerRef}
        style={{
          paddingBottom:
            keyboardHeight > 0
              ? `${keyboardHeight + 84}px`
              : replyingTo || editingMessage
              ? '140px'
              : '96px'
        }}
        className="flex-1 overflow-y-auto px-3 pt-3 skeuo-scrollbar space-y-2.5 transition-[padding] duration-150"
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

          const reactionEntries = Object.entries(msg.reactions || {}).filter(([_, count]) => count > 0);
          const authorMember = members.find(
            (m) => m.id === msg.userId || m.user_id === msg.userId || m.name === msg.sender
          );
          const authorRole = authorMember?.role || msg.role || 'user';

          if (msg.isMine) {
            return (
              <div
                key={msg.id || index}
                ref={(el) => {
                  if (el) messageRefs.current[msg.id] = el;
                }}
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
                      loading="lazy"
                      decoding="async"
                      className="rounded-2xl max-h-48 w-full object-cover mb-1.5 border border-white/20"
                    />
                  )}
                  <span>{msg.content || msg.text}</span>

                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-sky-100 font-medium select-none">
                    <span>{msg.time || msg.timestamp || ''}</span>
                    {msg.isEdited && <span className="text-[9px] opacity-80 italic">(editada)</span>}
                    <CheckCheck className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                  </div>
                </div>

                {reactionEntries.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 mr-1">
                    {reactionEntries.map(([emoji, count]) => (
                      <span
                        key={emoji}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-xs"
                      >
                        <span>{emoji}</span>
                        {count > 1 && (
                          <span className="font-bold text-[10px] text-slate-600 dark:text-slate-300">
                            {count}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={msg.id || index}
              ref={(el) => {
                if (el) messageRefs.current[msg.id] = el;
              }}
              onTouchStart={(e) => handleTouchStart(e, msg)}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              className="flex items-start gap-2 max-w-[88%] mr-auto my-1.5 select-none"
            >
              <button
                type="button"
                onClick={() => handleAvatarClick(msg)}
                className="shrink-0 w-8 h-8 rounded-full border border-sky-400 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs mt-1 cursor-pointer active:scale-90 transition-transform overflow-hidden"
              >
                {msg.avatar ? (
                  <img src={msg.avatar} alt={msg.sender} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                ) : (
                  (msg.sender || 'U').charAt(0).toUpperCase()
                )}
              </button>

              <div className="flex flex-col items-start min-w-0">
                <div className="flex items-center gap-1.5 ml-1 mb-0.5">
                  <span
                    onClick={() => handleAvatarClick(msg)}
                    className="text-[11px] font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 cursor-pointer"
                  >
                    {msg.sender}
                  </span>

                  {authorRole === 'owner' ? (
                    <span className="px-1.5 py-0.2 rounded-md text-[10px] font-extrabold text-amber-800 bg-gradient-to-b from-amber-100 to-amber-200 border border-amber-300 shadow-xs inline-flex items-center gap-1">
                      👑 DONO
                    </span>
                  ) : authorRole === 'moderator' || authorRole === 'admin' ? (
                    <span className="px-1.5 py-0.2 rounded-md text-[10px] font-extrabold text-sky-800 bg-gradient-to-b from-sky-100 to-sky-200 border border-sky-300 shadow-xs inline-flex items-center gap-1">
                      🛡️ MOD
                    </span>
                  ) : null}
                </div>

                <div className="skeuo-card rounded-3xl rounded-tl-md px-4 py-2 text-sm leading-relaxed relative break-words text-slate-800 dark:text-slate-100 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
                  {msg.replyTo && (
                    <div className="mb-1.5 p-1.5 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border-l-3 border-sky-500 text-xs text-slate-600 dark:text-slate-300">
                      <div className="font-bold text-[10px] text-sky-600 dark:text-sky-400">
                        {msg.replyTo.sender}
                      </div>
                      <div className="truncate text-[11px] opacity-80">{msg.replyTo.text}</div>
                    </div>
                  )}

                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Upload"
                      loading="lazy"
                      decoding="async"
                      className="rounded-2xl max-h-48 w-full object-cover mb-1.5 border border-slate-200 dark:border-slate-700"
                    />
                  )}
                  <span>{msg.content || msg.text}</span>
                  <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-slate-400 font-medium select-none">
                    <span>{msg.time || msg.timestamp}</span>
                    {msg.isEdited && <span className="text-[9px] opacity-80 italic">(editada)</span>}
                  </div>
                </div>

                {reactionEntries.length > 0 && (
                  <div className="flex items-center gap-1 mt-1 ml-1">
                    {reactionEntries.map(([emoji, count]) => (
                      <span
                        key={emoji}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-xs"
                      >
                        <span>{emoji}</span>
                        {count > 1 && (
                          <span className="font-bold text-[10px] text-slate-600 dark:text-slate-300">
                            {count}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      <footer
        style={{
          paddingBottom:
            keyboardHeight > 0
              ? `${keyboardHeight + 8}px`
              : 'calc(env(safe-area-inset-bottom, 12px) + 8px)'
        }}
        className="fixed bottom-0 inset-x-0 max-w-md mx-auto z-20 pt-2 px-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.06)] transition-[padding] duration-150"
      >
        {editingMessage && (
          <div className="flex items-center justify-between gap-2 p-2 px-3 mb-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Pencil className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-bold text-amber-700 dark:text-amber-300 truncate">
                A editar mensagem...
              </span>
            </div>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {replyingTo && !editingMessage && (
          <div className="flex items-center justify-between gap-2 p-2 px-3 mb-2 rounded-2xl bg-sky-50 dark:bg-slate-800/80 border border-sky-200 dark:border-slate-700 text-xs">
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
          <div className="relative inline-block mb-2 ml-1">
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
            onChange={handleInputChange}
            onFocus={() => setTimeout(scrollToBottom, 150)}
            placeholder={editingMessage ? 'Atualize a sua mensagem...' : 'Digite uma mensagem...'}
            className="skeuo-input flex-1 min-h-[44px] px-4 py-2 text-sm rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !imagePreview}
            className="skeuo-btn-primary !w-11 !h-11 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-white disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-transform shadow-md cursor-pointer"
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

      <MessageActionsSheet
        isOpen={isActionSheetOpen}
        onClose={() => {
          setIsActionSheetOpen(false);
          setSelectedMessage(null);
        }}
        message={selectedMessage}
        onReact={handleReact}
        onCopy={handleCopyMessage}
        onReply={(msg) => setReplyingTo(msg)}
        onEdit={handleStartEdit}
        onPin={handleTogglePin}
        isPinned={pinnedMessage?.id === selectedMessage?.id}
        canPin={canModerate}
        onReport={handleReportMessage}
        onDelete={handleDeleteMessage}
      />

      <UserProfileSheet
        isOpen={isProfileSheetOpen}
        onClose={() => {
          setIsProfileSheetOpen(false);
          setSelectedUserProfile(null);
        }}
        user={selectedUserProfile}
        onStartDirect={handleStartDirect}
      />
    </div>
  );
}
