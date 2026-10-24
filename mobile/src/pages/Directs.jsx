import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MessageSquarePlus,
  Search,
  ShieldCheck,
  UserCheck,
  Lock,
  LockOpen,
  Loader2,
  ArrowLeft,
  Send,
  Image,
  CheckCheck,
  Check,
  X,
  Reply,
  Plus,
  Video,
  FileText,
  AlertTriangle
} from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileSheet from '../components/mobile/MobileSheet';
import MessageActionsSheet from '../components/mobile/MessageActionsSheet';
import { apiRequest } from '../services/api';
import { socket } from '../services/socket';
import { useKeyboard } from '../hooks/useKeyboard';
import { useHaptics } from '../hooks/useHaptics';
import {
  getConversationCrypto,
  encryptMessage,
  decryptIncoming,
  initIdentity
} from '../services/directCrypto';
import {
  getMessageDateKey,
  formatMessageDateDivider,
  formatMessageTime,
  formatTimeInTz,
  formatFullDateTime,
  formatConversationTime,
  isDifferentCalendarDay,
  formatMessageTimeWithDate
} from '../utils/dateUtils';

export default function MobileDirects({ onOpenNotifications, unreadCount = 0, onChatOpenChange }) {
  const { triggerImpact } = useHaptics();

  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const myId = String(
    currentUser?.id ||
    currentUser?.userId ||
    currentUser?.uuid ||
    currentUser?.user_metadata?.sub ||
    currentUser?.sub ||
    localStorage.getItem('chat_uniqueUserId') ||
    ''
  ).trim();

  const myName = String(
    currentUser?.name ||
    currentUser?.displayName ||
    currentUser?.user_metadata?.full_name ||
    currentUser?.user_metadata?.name ||
    localStorage.getItem('chat_displayName') ||
    ''
  ).trim().toLowerCase();

  const myUsername = String(
    currentUser?.username ||
    currentUser?.user_metadata?.user_name ||
    currentUser?.handle ||
    (currentUser?.email ? currentUser.email.split('@')[0] : '')
  ).trim().toLowerCase();

  const myEmail = String(currentUser?.email || '').trim().toLowerCase();

  const currentUserId = myId || localStorage.getItem('chat_uniqueUserId') || 'guest';
  const displayName = currentUser?.displayName || currentUser?.name || localStorage.getItem('chat_displayName') || 'Usuário';

  const checkIsMe = (msg) => {
    if (!msg) return false;
    if (msg.isMine === true || msg.isMe === true || msg.is_outgoing === true || msg.outgoing === true) {
      return true;
    }

    const senderId = String(
      msg.sender_id ||
      msg.senderId ||
      msg.sender_uuid ||
      msg.user_id ||
      msg.userId ||
      (typeof msg.sender === 'string' ? msg.sender : msg.sender?.id) ||
      (typeof msg.user === 'object' ? msg.user?.id : '') ||
      ''
    ).trim();

    const senderName = String(
      (typeof msg.sender === 'object' ? (msg.sender?.displayName || msg.sender?.name) : msg.sender_name) ||
      msg.sender ||
      msg.userName ||
      (typeof msg.user === 'object' ? (msg.user?.displayName || msg.user?.name) : '') ||
      ''
    ).trim().toLowerCase();

    return Boolean(
      (myId && senderId && myId === senderId) ||
      (currentUserId && senderId && currentUserId === senderId) ||
      (myUsername && senderName && myUsername === senderName) ||
      (myName && senderName && myName === senderName) ||
      (myEmail && senderName && senderName.includes(myEmail)) ||
      msg.is_outgoing === true ||
      msg.outgoing === true
    );
  };

  const location = useLocation();
  const { keyboardHeight } = useKeyboard();

  const deduplicateConversations = (list) => {
    if (!Array.isArray(list)) return [];
    const map = new Map();

    for (const c of list) {
      if (!c) continue;
      const partnerKey = (
        c.partnerId ||
        c.username ||
        (c.name && c.name.toLowerCase().trim()) ||
        c.id
      );

      if (!map.has(partnerKey)) {
        map.set(partnerKey, c);
      } else {
        const existing = map.get(partnerKey);
        const isExistingInitial = !existing.lastMessage || existing.lastMessage === 'Conversa iniciada' || existing.lastMessage === 'Conversa iniciada pelo chat';
        const isNewInitial = !c.lastMessage || c.lastMessage === 'Conversa iniciada' || c.lastMessage === 'Conversa iniciada pelo chat';

        if (isExistingInitial && !isNewInitial) {
          map.set(partnerKey, c);
        } else if (!isExistingInitial && !isNewInitial) {
          const existingTime = new Date(existing.last_message_at || existing.timestamp || existing.created_at || 0).getTime();
          const newTime = new Date(c.last_message_at || c.timestamp || c.created_at || 0).getTime();
          if (newTime > existingTime) {
            map.set(partnerKey, c);
          }
        }
      }
    }

    return Array.from(map.values());
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem('chat_direct_conversations');
      if (!stored) return [];
      const parsed = deduplicateConversations(JSON.parse(stored));
      return parsed.map(c => ({
        ...c,
        time: formatConversationTime(c.time)
      }));
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
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());
  const [roomOnlineUserIds, setRoomOnlineUserIds] = useState(() => new Set());

  const isConversationOnline = (conv) => {
    if (!conv) return false;
    const nameLower = String(conv.name || '').toLowerCase();
    const usernameLower = String(conv.username || '').toLowerCase();
    if (
      usernameLower === 'suporte' ||
      nameLower.includes('suporte') ||
      usernameLower === 'bot'
    ) {
      return true;
    }

    if (selectedConv && String(conv.id) === String(selectedConv.id) && roomOnlineUserIds.size > 0) {
      return true;
    }

    const partnerId = String(conv.partnerId || conv.partner_id || conv.userId || conv.user_id || '').trim();
    if (partnerId && onlineUserIds.has(partnerId)) {
      return true;
    }

    if (conv.username && onlineUserIds.has(String(conv.username))) {
      return true;
    }

    if (conv.id) {
      const parts = String(conv.id).replace('privado-', '').split('-');
      const partnerFromId = parts.find((p) => p && p !== currentUserId && p !== myId);
      if (partnerFromId && onlineUserIds.has(String(partnerFromId))) {
        return true;
      }
    }

    return Boolean(conv.online || conv.isOnline);
  };
  const [messages, setMessages] = useState([]);
  const [isE2EEActive, setIsE2EEActive] = useState(true);
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showAttachSheet, setShowAttachSheet] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [attachError, setAttachError] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [partnerTyping, setPartnerTyping] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  const [isNewDmSheetOpen, setIsNewDmSheetOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [startingConvId, setStartingConvId] = useState(null);
  const startingConvRef = useRef(false);

  const messagesEndRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const touchTimerRef = useRef(null);
  const selectedConvRef = useRef(selectedConv);

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

    const maxImageSize = 5 * 1024 * 1024;
    const maxMediaSize = 10 * 1024 * 1024;

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
        const unique = deduplicateConversations(data).map(c => ({
          ...c,
          time: formatConversationTime(c.time)
        }));
        setConversations(unique);
        try {
          localStorage.setItem('chat_direct_conversations', JSON.stringify(unique));
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
    if (!socket.connected) {
      socket.connect();
    }

    const handleUserPresenceChanged = ({ userId, isOnline }) => {
      if (!userId) return;
      const uidStr = String(userId);
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (isOnline) {
          next.add(uidStr);
        } else {
          next.delete(uidStr);
        }
        return next;
      });

      if (uidStr === currentUserId || uidStr === myId) return;

      setConversations((prev) =>
        prev.map((c) => {
          const parts = c.id ? String(c.id).replace('privado-', '').split('-') : [];
          const partnerFromId = parts.find((p) => p !== currentUserId && p !== myId);
          const isMatch =
            String(c.partnerId) === uidStr ||
            String(partnerFromId) === uidStr ||
            String(c.username) === uidStr;
          if (isMatch && c.online !== isOnline) {
            return { ...c, online: isOnline };
          }
          return c;
        })
      );

      setSelectedConv((prev) => {
        if (!prev) return prev;
        const parts = prev.id ? String(prev.id).replace('privado-', '').split('-') : [];
        const partnerFromId = parts.find((p) => p !== currentUserId && p !== myId);
        const isMatch =
          String(prev.partnerId) === uidStr ||
          String(partnerFromId) === uidStr ||
          String(prev.username) === uidStr;
        if (isMatch && prev.online !== isOnline) {
          return { ...prev, online: isOnline };
        }
        return prev;
      });
    };

    const handleOnlineUsersList = (usersList) => {
      if (!Array.isArray(usersList)) return;
      const onlineSet = new Set(usersList.map((u) => String(u)));
      setOnlineUserIds(onlineSet);

      setConversations((prev) =>
        prev.map((c) => {
          const nameLower = String(c.name || '').toLowerCase();
          const usernameLower = String(c.username || '').toLowerCase();
          if (usernameLower === 'suporte' || nameLower.includes('suporte')) {
            return { ...c, online: true };
          }
          const parts = c.id ? String(c.id).replace('privado-', '').split('-') : [];
          const partnerFromId = parts.find((p) => p !== currentUserId && p !== myId);
          const isOnline =
            (c.partnerId && onlineSet.has(String(c.partnerId))) ||
            (partnerFromId && onlineSet.has(String(partnerFromId))) ||
            (c.username && onlineSet.has(String(c.username)));
          return { ...c, online: Boolean(isOnline) };
        })
      );

      setSelectedConv((prev) => {
        if (!prev) return prev;
        const nameLower = String(prev.name || '').toLowerCase();
        const usernameLower = String(prev.username || '').toLowerCase();
        if (usernameLower === 'suporte' || nameLower.includes('suporte')) {
          return { ...prev, online: true };
        }
        const parts = prev.id ? String(prev.id).replace('privado-', '').split('-') : [];
        const partnerFromId = parts.find((p) => p !== currentUserId && p !== myId);
        const isOnline =
          (prev.partnerId && onlineSet.has(String(prev.partnerId))) ||
          (partnerFromId && onlineSet.has(String(partnerFromId))) ||
          (prev.username && onlineSet.has(String(prev.username)));
        return { ...prev, online: Boolean(isOnline) };
      });
    };

    const handleConnect = () => {
      socket.emit('get_online_users');
    };

    socket.on('user_presence_changed', handleUserPresenceChanged);
    socket.on('online_users_list', handleOnlineUsersList);
    socket.on('connect', handleConnect);
    socket.emit('get_online_users');

    return () => {
      socket.off('user_presence_changed', handleUserPresenceChanged);
      socket.off('online_users_list', handleOnlineUsersList);
      socket.off('connect', handleConnect);
    };
  }, [currentUserId, myId]);

  useEffect(() => {
    if (!selectedConv?.id) {
      setMessages([]);
      setPartnerTyping(null);
      setRoomOnlineUserIds(new Set());
      return;
    }

    const convId = selectedConv.id;
    const partnerId = selectedConv.partnerId;

    if (!socket.connected) {
      socket.connect();
    }

    const joinPayload = {
      roomId: String(convId),
      room: String(convId),
      user: { id: currentUserId, name: displayName, email: myEmail },
      userId: currentUserId,
      userName: displayName,
      email: myEmail
    };

    const emitJoin = () => {
      socket.emit('joinRoom', joinPayload);
      socket.emit('join_room', joinPayload);
      socket.emit('direct_read_receipt', {
        conversationId: convId,
        userId: currentUserId
      });
      socket.emit('get_online_users');
    };

    emitJoin();
    socket.on('connect', emitJoin);

    const handlePresenceUpdated = (data) => {
      if (!data || String(data.roomId) !== String(convId)) return;
      const otherUsers = (Array.isArray(data.onlineUsers) ? data.onlineUsers : []).filter(
        (u) => String(u.id || u.userId) !== String(currentUserId) && String(u.id || u.userId) !== String(myId)
      );
      setRoomOnlineUserIds(new Set(otherUsers.map((u) => String(u.id || u.userId))));
      if (otherUsers.length > 0) {
        setSelectedConv((prev) => (prev ? { ...prev, online: true } : prev));
      }
    };
    socket.on('roomPresenceUpdated', handlePresenceUpdated);

    getConversationCrypto(currentUserId, partnerId)
      .then((entry) => {
        if (selectedConvRef.current?.id === convId) {
          setIsE2EEActive(Boolean(entry));
        }
      })
      .catch(() => {
        if (selectedConvRef.current?.id === convId) {
          setIsE2EEActive(false);
        }
      });

    apiRequest(`/directs/conversations/${convId}/messages?limit=50`)
      .then(async (response) => {
        const rawList = Array.isArray(response) ? response : response?.messages || [];
        const decryptedList = await Promise.all(
          rawList.map(m => decryptIncoming(m, currentUserId, partnerId, convId))
        );
        if (selectedConvRef.current?.id === convId) {
          setMessages(decryptedList.map((m, index) => {
            const isMe = checkIsMe(m);
            return {
              id: m.id || String(m._id || `init_${Date.now()}_${index}`),
              sender: m.user?.displayName || m.sender || m.userName || (isMe ? displayName : (selectedConv.name || 'Contato')),
              sender_id: m.sender_id || m.senderId || m.user_id || m.userId || (isMe ? currentUserId : undefined),
              sender_name: m.sender_name || (typeof m.sender === 'string' ? m.sender : m.sender?.displayName) || '',
              text: m.content || m.text || '',
              time: formatMessageTime(m.time, m.created_at || m.timestamp),
              timestamp: m.timestamp || m.created_at || '',
              created_at: m.created_at || m.timestamp || null,
              isMine: isMe,
              isMe: isMe,
              image: m.image_url || m.image || (m.attachment?.type === 'image' ? m.attachment.url : null) || null,
              video: m.video_url || m.video || (m.attachment?.type === 'video' ? m.attachment.url : (typeof m.attachment === 'string' && m.attachment.startsWith('data:video') ? m.attachment : null)) || null,
              file: m.file_url || m.file || (m.attachment?.type === 'file' ? m.attachment : null) || null,
              replyTo: m.replyTo || m.reply_to || null,
              encrypted: Boolean(m.encrypted),
              reactions: m.reactions || {}
            };
          }));
        }
      })
      .catch((err) => {
        console.warn('Erro ao carregar histórico da conversa:', err.message);
      });

    const handleReceiveMessage = async (rawMsg) => {
      const msg = await decryptIncoming(rawMsg, currentUserId, partnerId, convId);
      const isMine = checkIsMe(msg);

      setMessages((prev) => {
        if (msg.id && prev.some((m) => m.id === msg.id)) {
          return prev;
        }

        if (isMine) {
          const tempIdx = prev.findIndex((m) =>
            (m.tempId && (m.tempId === rawMsg.tempId || m.tempId === msg.tempId)) ||
            (m.tempId && (m.isMine || m.isMe) && (m.text === (msg.content || msg.text)))
          );

          if (tempIdx !== -1) {
            const updated = [...prev];
            updated[tempIdx] = {
              id: msg.id || updated[tempIdx].id,
              tempId: undefined,
              sender: msg.user?.displayName || msg.sender || msg.userName || displayName,
              sender_id: msg.sender_id || msg.senderId || currentUserId,
              text: msg.content || msg.text || '',
              time: formatMessageTime(msg.time, msg.created_at || msg.timestamp),
              timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
              created_at: msg.created_at || msg.timestamp || new Date().toISOString(),
              isMine: true,
              isMe: true,
              image: msg.image_url || msg.image || (msg.attachment?.type === 'image' ? msg.attachment.url : null) || null,
              video: msg.video_url || msg.video || (msg.attachment?.type === 'video' ? msg.attachment.url : (typeof msg.attachment === 'string' && msg.attachment.startsWith('data:video') ? msg.attachment : null)) || null,
              file: msg.file_url || msg.file || (msg.attachment?.type === 'file' ? msg.attachment : null) || null,
              replyTo: msg.replyTo || msg.reply_to || null,
              encrypted: Boolean(msg.encrypted),
              reactions: msg.reactions || {}
            };
            return updated;
          }
        }

        return [...prev, {
          id: msg.id || `recv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          sender: msg.user?.displayName || msg.sender || msg.userName || (isMine ? displayName : 'Contato'),
          sender_id: msg.sender_id || msg.senderId || msg.user_id || msg.userId || (isMine ? currentUserId : undefined),
          text: msg.content || msg.text || '',
          time: formatMessageTime(msg.time, msg.created_at || msg.timestamp),
          timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
          created_at: msg.created_at || msg.timestamp || new Date().toISOString(),
          isMine,
          isMe: isMine,
          image: msg.image_url || msg.image || (msg.attachment?.type === 'image' ? msg.attachment.url : null) || null,
          video: msg.video_url || msg.video || (msg.attachment?.type === 'video' ? msg.attachment.url : (typeof msg.attachment === 'string' && msg.attachment.startsWith('data:video') ? msg.attachment : null)) || null,
          file: msg.file_url || msg.file || (msg.attachment?.type === 'file' ? msg.attachment : null) || null,
          replyTo: msg.replyTo || msg.reply_to || null,
          encrypted: Boolean(msg.encrypted),
          reactions: msg.reactions || {}
        }];
      });
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
      setRoomOnlineUserIds(new Set());
      socket.off('connect', emitJoin);
      socket.emit('leaveRoom', { roomId: String(convId), userId: currentUserId });
      socket.emit('leave_room', { roomId: String(convId), room: String(convId), userId: currentUserId });
      socket.off('roomPresenceUpdated', handlePresenceUpdated);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('typing_direct', handleTypingDirect);
      socket.off('stop_typing_direct', handleStopTypingDirect);
      socket.off('direct_read_receipt', handleReadReceipt);
      socket.off('delete_message', handleDeleteMessage);
    };
  }, [selectedConv?.id, currentUserId, displayName, myId, myEmail]);

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
    if (!user?.id || startingConvRef.current) return;

    const existing = conversations.find(
      (c) =>
        (user.id && (c.partnerId === user.id || c.id === user.id)) ||
        (user.name && c.name && c.name.toLowerCase() === user.name.toLowerCase()) ||
        (user.email && c.name && c.name.toLowerCase() === user.email.split('@')[0].toLowerCase())
    );

    if (existing) {
      setSelectedConv(existing);
      setIsNewDmSheetOpen(false);
      setUserSearchQuery('');
      return;
    }

    startingConvRef.current = true;
    setStartingConvId(user.id);

    try {
      const conv = await apiRequest('/directs/conversations', {
        method: 'POST',
        body: JSON.stringify({ targetUserId: user.id })
      });

      setIsNewDmSheetOpen(false);
      setUserSearchQuery('');

      const convEntry = {
        id: conv?.id || user.id,
        partnerId: conv?.partnerId || user.id,
        name: conv?.name || user.name || user.email?.split('@')[0] || 'Contato',
        avatar: conv?.avatar || user.avatar,
        online: conv?.online !== undefined ? conv.online : user.isOnline,
        lastMessage: conv?.lastMessage || 'Conversa iniciada',
        time: conv?.time || 'Agora'
      };

      setConversations((prev) => deduplicateConversations([convEntry, ...prev]));
      setSelectedConv(convEntry);
      fetchConversations(true);
    } catch (err) {
      console.warn('Falha ao abrir conversa direta:', err.message);
    } finally {
      startingConvRef.current = false;
      setStartingConvId(null);
    }
  };

  useEffect(() => {
    if (location.state?.targetUser) {
      const target = location.state.targetUser;
      window.history.replaceState({}, document.title);
      handleSelectUser(target);
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
    if (!inputText.trim() && !imagePreview && !selectedAttachment) return;
    if (!selectedConv?.id) return;
    triggerImpact();

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.emit('stop_typing_direct', {
        conversationId: selectedConv.id,
        userId: currentUserId
      });
    }

    const textToSend = inputText.trim();
    const imageToSend = selectedAttachment?.type === 'image' ? selectedAttachment.data : (imagePreview || null);
    const videoToSend = selectedAttachment?.type === 'video' ? selectedAttachment.data : null;
    const fileToSend = selectedAttachment?.type === 'file' ? {
      name: selectedAttachment.name,
      size: selectedAttachment.formattedSize,
      url: selectedAttachment.data,
      extension: selectedAttachment.extension
    } : null;

    let attachmentToSend = null;
    if (videoToSend) {
      attachmentToSend = { type: 'video', url: videoToSend, name: selectedAttachment?.name };
    } else if (fileToSend) {
      attachmentToSend = { type: 'file', ...fileToSend };
    }

    const replyToSend = replyingTo ? {
      id: replyingTo.id,
      sender: replyingTo.sender,
      text: replyingTo.content || replyingTo.text || ''
    } : null;

    setInputText('');
    setImagePreview(null);
    setSelectedAttachment(null);
    setReplyingTo(null);

    const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const tempMsg = {
      id: tempId,
      tempId,
      sender: displayName,
      text: textToSend,
      content: textToSend,
      image: imageToSend,
      video: videoToSend,
      file: fileToSend,
      replyTo: replyToSend,
      time: formatTimeInTz(new Date()),
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      isMine: true,
      encrypted: isE2EEActive
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      let cryptoEntry = null;
      try {
        cryptoEntry = await getConversationCrypto(currentUserId, selectedConv.partnerId);
      } catch {
        cryptoEntry = null;
      }

      const hasCrypto = Boolean(cryptoEntry);
      setIsE2EEActive(hasCrypto);

      let payloadContent = textToSend;

      if (cryptoEntry) {
        try {
          payloadContent = await encryptMessage(cryptoEntry, selectedConv.id, {
            text: textToSend,
            image: imageToSend,
            attachment: attachmentToSend
          });
        } catch {
          payloadContent = textToSend;
        }
      }

      socket.emit('send_message', {
        room: selectedConv.id,
        content: payloadContent,
        sender: displayName,
        userId: currentUserId,
        replyTo: replyToSend,
        timestamp: tempMsg.time,
        tempId,
        image: imageToSend,
        video: videoToSend,
        file: fileToSend,
        attachment: attachmentToSend
      });

      const response = await apiRequest(`/directs/conversations/${selectedConv.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: payloadContent,
          imageUrl: imageToSend,
          videoUrl: videoToSend,
          attachment: attachmentToSend,
          replyTo: replyToSend,
          tempId
        })
      });

      if (response?.id || response?.message?.id) {
        const realId = response.id || response.message.id;
        setMessages((prev) => prev.map((m) => (m.tempId === tempId ? { ...m, id: realId, tempId: undefined } : m)));
      }

      setConversations((prev) => prev.map(c => {
        if (c.id === selectedConv.id) {
          let lastMsg = textToSend;
          if (!lastMsg) {
            if (imageToSend) lastMsg = 'Foto enviada';
            else if (videoToSend) lastMsg = 'Vídeo enviado';
            else if (fileToSend) lastMsg = `Arquivo: ${fileToSend.name}`;
            else lastMsg = 'Anexo enviado';
          }
          return {
            ...c,
            lastMessage: lastMsg,
            time: 'Agora'
          };
        }
        return c;
      }));
    } catch (err) {
      console.warn('Erro ao enviar mensagem direta:', err.message);
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
      handleFileSelect(file, 'image');
    }
  };

  const filteredConversations = useMemo(() => {
    const unique = deduplicateConversations(conversations);
    if (!searchTerm.trim()) return unique;
    const term = searchTerm.toLowerCase();
    return unique.filter(
      (c) =>
        (c.name && c.name.toLowerCase().includes(term)) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(term))
    );
  }, [conversations, searchTerm]);

  const onlineConversationsCount = useMemo(() => {
    return filteredConversations.filter((c) => isConversationOnline(c)).length;
  }, [filteredConversations, onlineUserIds, roomOnlineUserIds]);

  const sortedAvailableUsers = useMemo(() => {
    return [...availableUsers].sort((a, b) => {
      const aOnline = isConversationOnline({ ...a, partnerId: a.id });
      const bOnline = isConversationOnline({ ...b, partnerId: b.id });
      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });
  }, [availableUsers, onlineUserIds]);

  const formatLastMessage = (msg) => {
    if (!msg) return 'Conversa iniciada';
    if (typeof msg === 'string' && msg.startsWith('e2ee:v1:')) {
      return '🔒 Mensagem Criptografada (E2EE)';
    }
    return msg;
  };

  if (selectedConv) {
    const isPartnerOnline = isConversationOnline(selectedConv);

    return (
      <div className="fixed inset-0 z-40 max-w-md mx-auto bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col h-[100dvh] overflow-hidden">
        <header className="shrink-0 pt-[calc(env(safe-area-inset-top,0px)+8px)] px-3 pb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => {
                handleClearAttachment();
                setShowAttachSheet(false);
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
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 transition-colors ${
                  isPartnerOnline
                    ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                    : 'bg-slate-300 dark:bg-slate-600'
                }`}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {selectedConv.name}
                </h2>
                {isE2EEActive ? (
                  <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" title="Criptografia Ponta a Ponta Ativa" />
                ) : null}
              </div>
              {partnerTyping ? (
                <div className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 text-[11px] font-semibold tracking-wide">
                  <span className="flex gap-0.5 items-center">
                    <span className="anim-typing-dot w-1 h-1 rounded-full bg-sky-500" />
                    <span className="anim-typing-dot w-1 h-1 rounded-full bg-sky-500" />
                    <span className="anim-typing-dot w-1 h-1 rounded-full bg-sky-500" />
                  </span>
                  <span>digitando...</span>
                </div>
              ) : isPartnerOnline ? (
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]" />
                  </span>
                  <span>Online agora</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] font-medium tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span>Visto recentemente</span>
                </div>
              )}
            </div>
          </div>

          {isE2EEActive ? (
            <div
              title="Criptografia Ponta a Ponta Ativa"
              className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-[10px] font-extrabold text-sky-600 dark:text-sky-400 flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>E2EE</span>
            </div>
          ) : (
            <div
              title="Chat sem E2EE: o contato ainda não ativou chaves"
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1"
            >
              <LockOpen className="w-3 h-3 text-slate-400" />
              <span>Sem E2EE</span>
            </div>
          )}
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
                {isE2EEActive ? <Lock className="w-5 h-5" /> : <LockOpen className="w-5 h-5 text-slate-400" />}
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                {isE2EEActive ? 'Conversa Criptografada' : 'Conversa Direta'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                {isE2EEActive
                  ? 'As mensagens enviadas aqui são protegidas com criptografia de ponta a ponta (Web Crypto API).'
                  : 'O contato ainda não gerou par de chaves E2EE. As mensagens serão entregues diretamente em texto padrão.'}
              </p>
            </div>
          )}

          {messages.map((msg, index) => {
            const messageKey = msg.id || msg.tempId || `${msg.sender_id || msg.sender}-${msg.created_at || msg.timestamp || index}-${index}`;
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

            const isMe = checkIsMe(msg);

            if (isMe) {
              return (
                <React.Fragment key={messageKey}>
                  {dateDividerElement}
                  <div
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
                        {msg.encrypted && <Lock className="w-2.5 h-2.5 opacity-80" />}
                        <span
                          title={formatFullDateTime(msg.time, msg.created_at || msg.timestamp)}
                          className="text-[10px] text-sky-100 font-medium tracking-tight"
                        >
                          {formatMessageTime(msg.time, msg.created_at || msg.timestamp)}
                        </span>
                        <CheckCheck className={`w-3.5 h-3.5 stroke-[2.5] ${msg.read ? 'text-sky-200' : 'text-white'}`} />
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={messageKey}>
                {dateDividerElement}
                <div
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
                      {msg.encrypted && <Lock className="w-2.5 h-2.5 text-sky-500" />}
                      <span
                        title={formatFullDateTime(msg.time, msg.created_at || msg.timestamp)}
                        className="text-[10px] text-slate-400 font-medium tracking-tight"
                      >
                        {formatMessageTime(msg.time, msg.created_at || msg.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </React.Fragment>
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
          {attachError && (
            <div className="anim-fade-rise flex items-center gap-2 p-2 px-3 mb-2 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{attachError}</span>
              <button
                type="button"
                onClick={() => setAttachError(null)}
                className="w-5 h-5 rounded-full flex items-center justify-center text-rose-400 hover:text-rose-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

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

          {selectedAttachment?.type === 'video' && (
            <div className="anim-fade-rise flex items-center justify-between gap-3 p-2.5 px-3 mb-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                {selectedAttachment.thumbnail ? (
                  <img
                    src={selectedAttachment.thumbnail}
                    alt="Thumbnail"
                    className="w-10 h-10 rounded-xl object-cover border border-purple-400/40 shrink-0"
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

          {selectedAttachment?.type === 'image' && (
            <div className="anim-fade-rise relative inline-block mb-2 ml-1">
              <img
                src={selectedAttachment.data}
                alt="Preview"
                className="w-14 h-14 object-cover rounded-xl border border-sky-400 shadow-md"
              />
              <button
                type="button"
                onClick={handleClearAttachment}
                className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md cursor-pointer"
                aria-label="Remover imagem"
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
              className="w-11 h-11 shrink-0 rounded-2xl skeuo-card flex items-center justify-center text-slate-400 dark:text-slate-300 active:scale-95 transition-transform"
              aria-label="Abrir menu de anexos"
            >
              <Plus className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder={isE2EEActive ? "Mensagem segura (E2EE)..." : "Digite uma mensagem..."}
              value={inputText}
              onChange={handleInputChange}
              onFocus={() => setTimeout(scrollToBottom, 150)}
              className="skeuo-input flex-1 min-w-0 min-h-[44px] px-4 py-2.5 text-sm rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-sky-400"
            />

            <button
              type="submit"
              disabled={!inputText.trim() && !imagePreview && !selectedAttachment}
              className="skeuo-btn-primary !w-11 !h-11 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-white disabled:opacity-50 disabled:pointer-events-none active:scale-95 transition-transform shadow-md cursor-pointer shrink-0"
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

        <MobileSheet
          isOpen={showAttachSheet}
          onClose={() => setShowAttachSheet(false)}
          title="Enviar Anexo"
        >
          <div className="p-4 grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => {
                setShowAttachSheet(false);
                imageInputRef.current?.click();
              }}
              className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl skeuo-card active:scale-95 transition-all text-slate-700 dark:text-slate-200"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center border border-sky-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <Image className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold">Imagem</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAttachSheet(false);
                videoInputRef.current?.click();
              }}
              className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl skeuo-card active:scale-95 transition-all text-slate-700 dark:text-slate-200"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center border border-purple-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold">Vídeo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowAttachSheet(false);
                fileInputRef.current?.click();
              }}
              className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl skeuo-card active:scale-95 transition-all text-slate-700 dark:text-slate-200"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-400/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                <FileText className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold">Arquivo</span>
            </button>
          </div>
        </MobileSheet>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Mensagens Diretas"
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      <div className="flex-1 overflow-y-auto overscroll-y-contain pb-[calc(6.5rem+env(safe-area-inset-bottom))] skeuo-scrollbar">
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

        <div className="flex items-center justify-between px-1 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Conversas Recentes
          </span>
          {onlineConversationsCount > 0 && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.9)]" />
              </span>
              <span>{onlineConversationsCount} {onlineConversationsCount === 1 ? 'online' : 'onlines'}</span>
            </div>
          )}
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
            filteredConversations.map((conv, convIndex) => {
              const isConvOnline = isConversationOnline(conv);
              return (
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
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 transition-colors ${
                          isConvOnline
                            ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                          {conv.name}
                        </h4>
                        {isConvOnline && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.8)]" title="Online" />
                        )}
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-500 shrink-0" title="Criptografia ponta a ponta ativa" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {formatLastMessage(conv.lastMessage)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1 pl-2">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {formatConversationTime(conv.time) || conv.time || 'Agora'}
                    </span>
                    {conv.unread > 0 && (
                      <span className="min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border border-white">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
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
              sortedAvailableUsers.map((user) => {
                const isUserOnline = isConversationOnline({ ...user, partnerId: user.id });
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectUser(user)}
                    disabled={Boolean(startingConvId)}
                    className="w-full p-2.5 rounded-2xl skeuo-card flex items-center justify-between gap-3 text-left active:scale-[0.98] transition-transform cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0 w-10 h-10 rounded-full border border-sky-400 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          (user.name || 'U').charAt(0).toUpperCase()
                        )}
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-1.5 ring-white dark:ring-slate-900 transition-colors ${
                            isUserOnline
                              ? 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.9)]'
                              : 'bg-slate-300 dark:bg-slate-600'
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {user.name}
                          </span>
                          {isUserOnline && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              Online
                            </span>
                          )}
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
              );
            })
            )}
          </div>
        </div>
      </MobileSheet>
    </div>
  );
}
