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
  AlertTriangle,
  Plus,
  Video,
  FileText
} from 'lucide-react';
import { useNavigate, useSearchParams, useParams, useLocation } from 'react-router-dom';
import { socket } from '../services/socket';
import { apiRequest } from '../services/api';
import { useKeyboard } from '../hooks/useKeyboard';
import { useHaptics } from '../hooks/useHaptics';
import RoomMembersSheet from '../components/mobile/RoomMembersSheet';
import MessageActionsSheet from '../components/mobile/MessageActionsSheet';
import UserProfileSheet from '../components/mobile/UserProfileSheet';
import MobileSheet from '../components/mobile/MobileSheet';
import {
  getMessageDateKey,
  formatMessageDateDivider,
  formatMessageTime,
  formatFullDateTime,
  isDifferentCalendarDay
} from '../utils/dateUtils';

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
  const [showAttachSheet, setShowAttachSheet] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [attachError, setAttachError] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isMembersSheetOpen, setIsMembersSheetOpen] = useState(false);
  const [members, setMembers] = useState([]);

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const [selectedUserProfile, setSelectedUserProfile] = useState(null);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  const [typingUser, setTypingUser] = useState(null);
  const [pressingId, setPressingId] = useState(null);
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

  const pressVisualRef = useRef(null);

  const handleTouchStart = (e, msg) => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    if (pressVisualRef.current) clearTimeout(pressVisualRef.current);
    pressVisualRef.current = setTimeout(() => setPressingId(msg.id), 140);
    touchTimerRef.current = setTimeout(() => {
      setSelectedMessage(msg);
      setIsActionSheetOpen(true);
      setPressingId(null);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(20);
      }
    }, 400);
  };

  const cancelPress = () => {
    if (touchTimerRef.current) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    if (pressVisualRef.current) {
      clearTimeout(pressVisualRef.current);
      pressVisualRef.current = null;
    }
    setPressingId(null);
  };

  const handleTouchEnd = cancelPress;

  const handleTouchMove = cancelPress;

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
            time: m.time || (m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (m.timestamp || '')),
            timestamp: m.timestamp || m.created_at || '',
            created_at: m.created_at || m.timestamp || null,
            isMine: m.user_id === currentUserId || m.userId === currentUserId || m.sender === displayName,
            image: m.image_url || m.image || null,
            video: m.video_url || m.video || null,
            file: m.file_url || m.file || null,
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
          time: msg.time || (msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : (msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))),
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
          created_at: msg.created_at || msg.timestamp || new Date().toISOString(),
          isMine: msg.user_id === currentUserId || msg.userId === currentUserId || msg.sender === displayName,
          image: msg.image_url || msg.image || null,
          video: msg.video_url || msg.video || null,
          file: msg.file_url || msg.file || null,
          replyTo: msg.replyTo || msg.reply_to || null,
          reactions: msg.reactions || {},
          isEdited: msg.isEdited || false,
          isNew: true
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

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  };

  const showFileError = (message) => {
    setAttachError(message);
    triggerImpact();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([30, 50, 30]);
    }
    setTimeout(() => {
      setAttachError(null);
    }, 4000);
  };

  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL(file.type || 'image/jpeg', quality);
            resolve(dataUrl);
          } else {
            resolve(e.target.result);
          }
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const generateVideoThumbnail = (file) => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        const objectUrl = URL.createObjectURL(file);
        video.src = objectUrl;

        let hasResolved = false;
        const cleanUp = () => {
          try {
            URL.revokeObjectURL(objectUrl);
          } catch {}
        };

        const finish = (result) => {
          if (!hasResolved) {
            hasResolved = true;
            cleanUp();
            resolve(result);
          }
        };

        video.onloadeddata = () => {
          video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
        };

        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(video.videoWidth || 320, 320);
            canvas.height = Math.min(video.videoHeight || 240, 240);
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const thumb = canvas.toDataURL('image/jpeg', 0.7);
              finish(thumb);
              return;
            }
          } catch {}
          finish(null);
        };

        video.onerror = () => finish(null);
        setTimeout(() => finish(null), 2500);
      } catch {
        resolve(null);
      }
    });
  };

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleClearAttachment = () => {
    setSelectedAttachment(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileSelect = async (file, type) => {
    if (!file) return;

    const maxImageSize = 5 * 1024 * 1024; // 5MB
    const maxMediaSize = 10 * 1024 * 1024; // 10MB

    if (type === 'image' && file.size > maxImageSize) {
      showFileError('Arquivo muito grande. Limite máximo: 5MB');
      return;
    }

    if ((type === 'video' || type === 'file') && file.size > maxMediaSize) {
      showFileError('Arquivo muito grande. Limite máximo: 10MB');
      return;
    }

    const extension = file.name ? file.name.split('.').pop() : '';
    const formattedSize = formatFileSize(file.size);

    try {
      if (type === 'image') {
        const compressedDataUrl = await compressImage(file);
        setSelectedAttachment({
          type: 'image',
          data: compressedDataUrl,
          name: file.name,
          size: file.size,
          formattedSize,
          extension
        });
        setImagePreview(compressedDataUrl);
      } else if (type === 'video') {
        const [thumbnail, dataUrl] = await Promise.all([
          generateVideoThumbnail(file),
          readFileAsDataUrl(file)
        ]);
        setSelectedAttachment({
          type: 'video',
          data: dataUrl,
          thumbnail,
          name: file.name,
          size: file.size,
          formattedSize,
          extension
        });
        setImagePreview(null);
      } else if (type === 'file') {
        const dataUrl = await readFileAsDataUrl(file);
        setSelectedAttachment({
          type: 'file',
          data: dataUrl,
          name: file.name,
          size: file.size,
          formattedSize,
          extension
        });
        setImagePreview(null);
      }
    } catch (err) {
      console.error('Erro ao processar anexo:', err);
      showFileError('Falha ao processar arquivo.');
    }
  };

  const handleImagePick = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file, 'image');
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() && !imagePreview && !selectedAttachment) return;
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

    const imageToSend = selectedAttachment?.type === 'image' ? selectedAttachment.data : (imagePreview || null);
    const videoToSend = selectedAttachment?.type === 'video' ? selectedAttachment.data : null;
    const fileToSend = selectedAttachment?.type === 'file' ? {
      name: selectedAttachment.name,
      size: selectedAttachment.formattedSize,
      url: selectedAttachment.data,
      extension: selectedAttachment.extension
    } : null;

    const tempMsg = {
      id: String(Date.now()),
      room: String(currentRoomId),
      roomId: currentRoomId,
      userId: currentUserId,
      sender: displayName,
      text: contentText,
      content: contentText,
      image: imageToSend,
      video: videoToSend,
      file: fileToSend,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            sender: replyingTo.sender,
            text: replyingTo.content || replyingTo.text || ''
          }
        : null,
      reactions: {},
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      isMine: true,
      isNew: true
    };

    setMessages((prev) => [...prev, tempMsg]);
    setInputText('');
    handleClearAttachment();
    setReplyingTo(null);

    socket.emit('send_message', tempMsg);

    try {
      await apiRequest(`/rooms/${currentRoomId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: contentText,
          imageUrl: imageToSend,
          videoUrl: videoToSend,
          file: fileToSend,
          replyTo: tempMsg.replyTo
        })
      });
    } catch (err) {
      console.warn('Falha ao persistir mensagem na API:', err.message);
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
        <div className="px-4 py-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/40 border-b border-sky-100 dark:border-sky-900/40 flex items-center gap-2 shrink-0 anim-msg-enter">
          <span className="flex gap-1 items-center">
            <span className="anim-typing-dot w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span className="anim-typing-dot w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span className="anim-typing-dot w-1.5 h-1.5 rounded-full bg-sky-500" />
          </span>
          <span>
            <strong>{typingUser}</strong> está a digitar...
          </span>
        </div>
      )}

      {pinnedMessage && (
        <div className="anim-pin-drop mx-3 mt-2 p-2.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300/70 dark:border-amber-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(245,158,11,0.08)] flex items-center justify-between text-xs text-amber-900 dark:text-amber-200 shrink-0">
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
          const currentDateKey = getMessageDateKey(msg);
          const prevDateKey = index > 0 ? getMessageDateKey(messages[index - 1]) : null;
          const showDateDivider = index === 0 || currentDateKey !== prevDateKey;

          const dateDividerElement = showDateDivider ? (
            <div className="flex items-center justify-center my-3 select-none">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-xs backdrop-blur-xs">
                {currentDateKey}
              </span>
            </div>
          ) : null;

          if (msg.isSystem) {
            return (
              <React.Fragment key={msg.id || index}>
                {dateDividerElement}
                <div className="flex justify-center my-2">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-full shadow-xs">
                    {msg.content || msg.text}
                  </span>
                </div>
              </React.Fragment>
            );
          }

          const reactionEntries = Object.entries(msg.reactions || {}).filter(([_, count]) => count > 0);
          const authorMember = members.find(
            (m) => m.id === msg.userId || m.user_id === msg.userId || m.name === msg.sender
          );
          const authorRole = authorMember?.role || msg.role || 'user';

          if (msg.isMine) {
            return (
              <React.Fragment key={msg.id || index}>
                {dateDividerElement}
                <div
                  ref={(el) => {
                    if (el) messageRefs.current[msg.id] = el;
                  }}
                  onTouchStart={(e) => handleTouchStart(e, msg)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                  className={`flex flex-col items-end max-w-[85%] ml-auto my-1.5 select-none ${msg.isNew ? 'anim-msg-enter' : ''} ${pressingId === msg.id ? 'anim-long-press' : ''}`}
                >
                  <div className="bubble-lift bg-gradient-to-b from-sky-400 to-sky-500 text-white shadow-[0_3px_8px_rgba(14,165,233,0.3),inset_0_1px_0_rgba(255,255,255,0.45)] border border-sky-400/70 rounded-3xl rounded-tr-md px-4 py-2 text-sm leading-relaxed relative break-words">
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

                    {msg.video && (
                      <video
                        src={msg.video}
                        controls
                        playsInline
                        className="rounded-2xl max-h-48 w-full object-cover mb-1.5 border border-white/20"
                      />
                    )}

                    {msg.file && (
                      <a
                        href={typeof msg.file === 'string' ? msg.file : msg.file.url}
                        download={typeof msg.file === 'object' ? (msg.file.name || 'arquivo') : 'arquivo'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 px-3 mb-1.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-98 transition-all text-white"
                      >
                        <FileText className="w-5 h-5 shrink-0" />
                        <div className="min-w-0 text-left">
                          <div className="text-xs font-semibold truncate">
                            {typeof msg.file === 'object' ? (msg.file.name || 'Arquivo anexado') : 'Arquivo anexado'}
                          </div>
                          {typeof msg.file === 'object' && msg.file.size && (
                            <div className="text-[10px] opacity-80">{msg.file.size}</div>
                          )}
                        </div>
                      </a>
                    )}
                    <span>{msg.content || msg.text}</span>

                    <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-sky-100 font-medium select-none">
                      <span
                        title={formatFullDateTime(msg.time, msg.created_at || msg.timestamp)}
                        className="text-[10px] text-sky-100 font-medium tracking-tight"
                      >
                        {formatMessageTime(msg.time, msg.created_at || msg.timestamp)}
                      </span>
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
              </React.Fragment>
            );
          }

          return (
            <React.Fragment key={msg.id || index}>
              {dateDividerElement}
              <div
                ref={(el) => {
                  if (el) messageRefs.current[msg.id] = el;
                }}
                onTouchStart={(e) => handleTouchStart(e, msg)}
                onTouchEnd={handleTouchEnd}
                onTouchMove={handleTouchMove}
                className={`flex items-start gap-2 max-w-[88%] mr-auto my-1.5 select-none ${msg.isNew ? 'anim-msg-enter' : ''} ${pressingId === msg.id ? 'anim-long-press' : ''}`}
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

                  <div className="bubble-lift skeuo-card rounded-3xl rounded-tl-md px-4 py-2 text-sm leading-relaxed relative break-words text-slate-800 dark:text-slate-100 shadow-[0_3px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)]">
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

                    {msg.video && (
                      <video
                        src={msg.video}
                        controls
                        playsInline
                        className="rounded-2xl max-h-48 w-full object-cover mb-1.5 border border-slate-200 dark:border-slate-700"
                      />
                    )}

                    {msg.file && (
                      <a
                        href={typeof msg.file === 'string' ? msg.file : msg.file.url}
                        download={typeof msg.file === 'object' ? (msg.file.name || 'arquivo') : 'arquivo'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 p-2 px-3 mb-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-98 transition-all text-slate-800 dark:text-slate-100"
                      >
                        <FileText className="w-5 h-5 text-sky-500 shrink-0" />
                        <div className="min-w-0 text-left">
                          <div className="text-xs font-semibold truncate">
                            {typeof msg.file === 'object' ? (msg.file.name || 'Arquivo anexado') : 'Arquivo anexado'}
                          </div>
                          {typeof msg.file === 'object' && msg.file.size && (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">{msg.file.size}</div>
                          )}
                        </div>
                      </a>
                    )}
                    <span>{msg.content || msg.text}</span>
                    <div className="flex items-center justify-end gap-1 mt-0.5 text-[10px] text-slate-400 font-medium select-none">
                      <span
                        title={formatFullDateTime(msg.time, msg.created_at || msg.timestamp)}
                        className="text-[10px] text-slate-400 font-medium tracking-tight"
                      >
                        {formatMessageTime(msg.time, msg.created_at || msg.timestamp)}
                      </span>
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
            </React.Fragment>
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
          <div className="anim-fade-rise flex items-center justify-between gap-2 p-2 px-3 mb-2 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs">
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

        {attachError && (
          <div className="anim-fade-rise flex items-center justify-between gap-2 p-2 px-3 mb-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium">
            <div className="flex items-center gap-2 min-w-0">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
              <span className="truncate">{attachError}</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachError(null)}
              className="p-1 rounded-full hover:bg-rose-500/10 shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {selectedAttachment?.type === 'image' && (
          <div className="anim-fade-rise relative inline-block mb-2 ml-1">
            <img
              src={selectedAttachment.data}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-xl border border-sky-400 shadow-md"
            />
            <button
              type="button"
              onClick={handleClearAttachment}
              className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md cursor-pointer hover:bg-rose-600 transition-colors"
              aria-label="Remover anexo"
            >
              ×
            </button>
          </div>
        )}

        {selectedAttachment?.type === 'video' && (
          <div className="anim-fade-rise flex items-center justify-between gap-3 p-2 px-3 mb-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              {selectedAttachment.thumbnail ? (
                <img
                  src={selectedAttachment.thumbnail}
                  alt="Prévia do vídeo"
                  className="w-12 h-12 object-cover rounded-lg border border-purple-400/30 shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center border border-purple-400/30 shrink-0">
                  <Video className="w-5 h-5" />
                </div>
              )}
              <div className="min-w-0">
                <span className="font-bold text-purple-700 dark:text-purple-300 block truncate text-xs">
                  {selectedAttachment.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Vídeo • {selectedAttachment.formattedSize}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearAttachment}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
              aria-label="Remover vídeo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {selectedAttachment?.type === 'file' && (
          <div className="anim-fade-rise flex items-center justify-between gap-3 p-2.5 px-3 mb-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-400/30 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-emerald-700 dark:text-emerald-300 block truncate text-xs">
                  {selectedAttachment.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase">
                  {selectedAttachment.extension || 'Arquivo'} • {selectedAttachment.formattedSize}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearAttachment}
              className="w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
              aria-label="Remover arquivo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {imagePreview && !selectedAttachment && (
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

        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileSelect(e.target.files[0], 'image');
            e.target.value = '';
          }}
        />
        <input
          type="file"
          ref={videoInputRef}
          accept="video/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileSelect(e.target.files[0], 'video');
            e.target.value = '';
          }}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="*/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) handleFileSelect(e.target.files[0], 'file');
            e.target.value = '';
          }}
        />

        <form onSubmit={handleSendMessage} className="flex items-center gap-2 w-full">
          <button
            type="button"
            onClick={() => setShowAttachSheet(true)}
            className="w-11 h-11 shrink-0 rounded-2xl skeuo-card flex items-center justify-center text-slate-300 active:scale-95 transition-transform"
            aria-label="Abrir menu de anexos"
          >
            <Plus className="w-5 h-5" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onFocus={() => setTimeout(scrollToBottom, 150)}
            placeholder={editingMessage ? 'Atualize a sua mensagem...' : 'Digite uma mensagem...'}
            className="skeuo-input flex-1 min-w-0 min-h-[44px] px-4 py-2 text-sm rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim() && !imagePreview && !selectedAttachment}
            className="skeuo-btn-primary !w-11 !h-11 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-white disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-transform shadow-md cursor-pointer shrink-0"
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

      <MobileSheet
        isOpen={showAttachSheet}
        onClose={() => setShowAttachSheet(false)}
        title="Enviar Anexo"
      >
        <div className="p-4 grid grid-cols-3 gap-3">
          {/* Opção Imagem */}
          <button
            type="button"
            onClick={() => {
              setShowAttachSheet(false);
              imageInputRef.current?.click();
            }}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl skeuo-card active:scale-95 transition-all text-slate-200"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Image className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">Imagem</span>
          </button>

          {/* Opção Vídeo */}
          <button
            type="button"
            onClick={() => {
              setShowAttachSheet(false);
              videoInputRef.current?.click();
            }}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl skeuo-card active:scale-95 transition-all text-slate-200"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">Vídeo</span>
          </button>

          {/* Opção Arquivo */}
          <button
            type="button"
            onClick={() => {
              setShowAttachSheet(false);
              fileInputRef.current?.click();
            }}
            className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl skeuo-card active:scale-95 transition-all text-slate-200"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold">Arquivo</span>
          </button>
        </div>
      </MobileSheet>
    </div>
  );
}
