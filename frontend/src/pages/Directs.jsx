import { useState, useEffect, useRef, Fragment } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    FaEnvelope,
    FaPaperPlane,
    FaPlus,
    FaSearch,
    FaTimes,
    FaCamera,
    FaBars,
    FaTrashAlt,
    FaTrash,
    FaCheck,
    FaComments,
    FaStar,
    FaHeart,
    FaRegHeart,
    FaEllipsisV,
    FaChevronUp,
    FaChevronDown,
    FaCopy,
    FaDownload,
    FaLock,
    FaLockOpen
} from 'react-icons/fa';
import ChatSidebar from '../components/ChatSidebar';
import UserAvatar from '../components/UserAvatar';
import NewDirectMessageModal from '../components/NewDirectMessageModal';
import { socket } from '../socket';
import { apiRequest } from '../services/api';
import AttachmentView from '../components/AttachmentView';
import AttachmentComposer from '../components/AttachmentComposer';
import { normalizeAttachment } from '../utils/attachments';
import { getConversationCrypto, encryptMessage, decryptIncoming, initIdentity } from '../services/directCrypto';
import { isEncryptedContent } from '../utils/e2ee';

const getAppTimeZone = () => {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (!tz || tz === 'UTC' || tz === 'Etc/UTC' || tz.startsWith('Etc/GMT')) {
            return 'America/Sao_Paulo';
        }
        return tz;
    } catch {
        return 'America/Sao_Paulo';
    }
};

const parseUtcTimeStr = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') return null;
    const trimmed = timeStr.trim();
    const match12 = trimmed.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (match12) {
        let hours = parseInt(match12[1], 10);
        const minutes = parseInt(match12[2], 10);
        const seconds = match12[3] ? parseInt(match12[3], 10) : 0;
        const meridiem = match12[4].toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        const now = new Date();
        return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes, seconds));
    }
    return null;
};

const formatMessageTime = (timeStr, createdAt) => {
    const candidate = createdAt || timeStr;
    if (candidate) {
        let d = null;
        if (candidate instanceof Date && !isNaN(candidate.getTime())) {
            d = candidate;
        } else if (typeof candidate === 'string' && (candidate.includes('T') || candidate.includes('-'))) {
            const parsed = new Date(candidate.includes(' ') && !candidate.includes('T') ? candidate.replace(' ', 'T') + 'Z' : candidate);
            if (!isNaN(parsed.getTime())) d = parsed;
        } else if (typeof candidate === 'number') {
            const parsed = new Date(candidate);
            if (!isNaN(parsed.getTime())) d = parsed;
        }
        if (d) {
            return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: getAppTimeZone() });
        }
    }

    const utcD = parseUtcTimeStr(timeStr);
    if (utcD) {
        return utcD.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: getAppTimeZone() });
    }

    if (typeof timeStr === 'string' && timeStr.trim()) {
        const trimmed = timeStr.trim();
        const match24 = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
        if (match24) return `${match24[1].padStart(2, '0')}:${match24[2]}`;
        if (trimmed === 'Agora') return 'Agora';
        return trimmed;
    }

    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: getAppTimeZone() });
};

const formatFullDateTime = (timeStr, createdAt) => {
    const candidate = createdAt || timeStr;
    if (!candidate) return '';
    let d = null;
    if (candidate instanceof Date && !isNaN(candidate.getTime())) {
        d = candidate;
    } else if (typeof candidate === 'string') {
        const parsed = new Date(candidate.includes(' ') && !candidate.includes('T') ? candidate.replace(' ', 'T') + 'Z' : candidate);
        if (!isNaN(parsed.getTime())) d = parsed;
    }
    if (d) {
        const tz = getAppTimeZone();
        return (
            d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: tz }) +
            ' às ' +
            d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz })
        );
    }
    return timeStr || '';
};

// Cache local das mensagens: remove dados pesados (anexos/imagens grandes) e nunca estoura a cota do localStorage.
const cacheMessages = (convId, list) => {
    try {
        // Mensagens criptografadas nunca são gravadas em texto claro no navegador
        const slim = list.filter(m => !m.encrypted).map(m => {
            let out = m;
            if (out.attachment?.url) out = { ...out, attachment: { ...out.attachment, url: null } };
            if (typeof out.image === 'string' && out.image.length > 200000) out = { ...out, image: null };
            return out;
        });
        cacheMessages(convId, slim);
    } catch { /* cota cheia: o histórico real vem do servidor */ }
};

const getMessageDateKey = (msg) => {
    const candidate = msg.created_at || msg.timestamp || msg.time;
    if (!candidate) return 'Hoje';
    const d = new Date(candidate);
    if (isNaN(d.getTime())) {
        return 'Hoje';
    }
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

    if (isToday) return 'Hoje';

    const isYesterday = d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear();

    if (isYesterday) return 'Ontem';

    const isSameYear = d.getFullYear() === today.getFullYear();
    if (isSameYear) {
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
    }
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const formatConversationTime = (timeStr) => {
    if (!timeStr) return '';
    if (timeStr === 'Agora' || timeStr === 'Hoje' || timeStr === 'Ontem') return timeStr;
    if (typeof timeStr === 'string' && timeStr.length <= 5 && timeStr.includes(':')) return timeStr;

    const d = new Date(timeStr);
    if (isNaN(d.getTime())) return timeStr;

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

    if (isToday) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const isYesterday = d.getDate() === yesterday.getDate() &&
        d.getMonth() === yesterday.getMonth() &&
        d.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
        return 'Ontem';
    }

    const isSameYear = d.getFullYear() === today.getFullYear();
    if (isSameYear) {
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
};

const INITIAL_CONVERSATIONS = [
    {
        id: 'privado-suporte',
        name: 'Suporte SkyRipple',
        username: 'suporte',
        partnerId: 'suporte',
        avatar: null,
        lastMessage: 'Olá! Como podemos ajudar você hoje?',
        time: 'Agora',
        online: true,
        unread: 0
    },
    {
        id: 'privado-comunidade',
        name: 'Moderação Geral',
        username: 'moderacao',
        partnerId: 'comunidade',
        avatar: null,
        lastMessage: 'Bem-vindo ao canal de mensagens diretas.',
        time: 'Hoje',
        online: false,
        unread: 0
    }
];

const Directs = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [selectedConv, setSelectedConv] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [pendingAttachment, setPendingAttachment] = useState(null);
    const [e2eeInfo, setE2eeInfo] = useState({ active: false, safety: null });
    const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
    const [chatSearchTerm, setChatSearchTerm] = useState('');
    const [chatSearchIndex, setChatSearchIndex] = useState(0);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [onlineUserIds, setOnlineUserIds] = useState(new Set());
    const [roomOnlineUserIds, setRoomOnlineUserIds] = useState(new Set());
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const skipAutoScrollRef = useRef(false);
    const loadingMoreRef = useRef(false);
    const [hasMore, setHasMore] = useState(false);
    const [nextCursor, setNextCursor] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const isSubmittingRef = useRef(false);
    const [bubbleFormat, setBubbleFormat] = useState(() => {
        const saved = localStorage.getItem('chat_bubbleFormat');
        return saved === 'classico' ? 'classico' : 'grande';
    });

    useEffect(() => {
        const handleUpdate = () => {
            const saved = localStorage.getItem('chat_bubbleFormat');
            setBubbleFormat(saved === 'classico' ? 'classico' : 'grande');
        };
        window.addEventListener('themeUpdated', handleUpdate);
        window.addEventListener('storage', handleUpdate);
        return () => {
            window.removeEventListener('themeUpdated', handleUpdate);
            window.removeEventListener('storage', handleUpdate);
        };
    }, []);

    const [currentUserId] = useState(() => {
        let uid = localStorage.getItem('chat_uniqueUserId');
        if (!uid) {
            uid = 'user_' + Math.random().toString(36).substring(2, 11);
            try { localStorage.setItem('chat_uniqueUserId', uid); } catch {}
        }
        return uid;
    });
    const currentUserDisplayName = localStorage.getItem('chat_displayName') || 'Eu';

    useEffect(() => {
        const loadInitialData = async () => {
            const stored = localStorage.getItem('chat_direct_conversations');
            let initialList = [];
            if (stored) {
                try {
                    initialList = JSON.parse(stored);
                } catch {
                    initialList = INITIAL_CONVERSATIONS;
                }
            } else {
                initialList = INITIAL_CONVERSATIONS;
                localStorage.setItem('chat_direct_conversations', JSON.stringify(INITIAL_CONVERSATIONS));
            }
            setConversations(initialList);

            try {
                const [backendConvs, availableUsers] = await Promise.allSettled([
                    apiRequest('/directs/conversations'),
                    apiRequest('/directs/users')
                ]);

                if (availableUsers.status === 'fulfilled' && Array.isArray(availableUsers.value)) {
                    setRegisteredUsers(availableUsers.value);
                }

                if (backendConvs.status === 'fulfilled' && Array.isArray(backendConvs.value) && backendConvs.value.length > 0) {
                    const serverConvs = backendConvs.value;
                    const merged = [
                        ...serverConvs,
                        ...initialList.filter(loc => !serverConvs.some(srv => srv.id === loc.id || srv.partnerId === loc.id))
                    ];
                    setConversations(merged);
                    localStorage.setItem('chat_direct_conversations', JSON.stringify(merged));
                    if (window.innerWidth > 768) {
                        setSelectedConv(prev => prev || merged[0]);
                    }
                } else if (initialList.length > 0 && window.innerWidth > 768) {
                    setSelectedConv(prev => prev || initialList[0]);
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadInitialData();

        const targetUser = searchParams.get('user');
        if (targetUser) {
            const stored = localStorage.getItem('chat_direct_conversations');
            const list = stored ? JSON.parse(stored) : INITIAL_CONVERSATIONS;
            const found = list.find(c => c.username === targetUser || c.name === targetUser);
            if (found) {
                setSelectedConv(found);
            } else {
                const newC = {
                    id: `privado-${[currentUserId, targetUser].sort().join('-')}`,
                    name: targetUser,
                    username: targetUser,
                    partnerId: targetUser,
                    avatar: null,
                    lastMessage: 'Conversa iniciada',
                    time: 'Agora',
                    online: false,
                    unread: 0
                };
                const updatedList = [newC, ...list];
                setConversations(updatedList);
                localStorage.setItem('chat_direct_conversations', JSON.stringify(updatedList));
                setSelectedConv(newC);
            }
        }
    }, [searchParams]);

    const selectedConvRef = useRef(selectedConv);
    useEffect(() => {
        selectedConvRef.current = selectedConv;
    }, [selectedConv]);

    const mapServerMessage = (msg, convName) => {
                            const isMe = (msg.user_id && msg.user_id === currentUserId) ||
                                (msg.userId && msg.userId === currentUserId) ||
                                msg.sender_id === currentUserId ||
                                msg.isMe;

                            const senderName = isMe
                                ? currentUserDisplayName
                                : (
                                    (msg.sender && msg.sender !== 'Usuário' ? msg.sender : null) ||
                                    msg.sender_name ||
                                    msg.user?.displayName ||
                                    msg.user?.name ||
                                    msg.user?.username ||
                                    msg.author_name ||
                                    msg.author ||
                                    msg.userName ||
                                    msg.user_name ||
                                    msg.username ||
                                    (registeredUsers.find(u => u.id === (msg.userId || msg.user_id || msg.sender_id))?.displayName) ||
                                    (registeredUsers.find(u => u.id === (msg.userId || msg.user_id || msg.sender_id))?.name) ||
                                    convName ||
                                    'Usuário'
                                );

                            return {
                                ...msg,
                                id: msg.id || msg.messageId,
                                messageId: msg.messageId || msg.id,
                                sender_id: msg.sender_id || msg.userId || msg.user_id || (isMe ? currentUserId : undefined),
                                text: msg.text || msg.content || '',
                                sender: senderName,
                                sender_name: senderName,
                                avatar: msg.avatar || msg.user?.profilePhoto || null,
                                user: msg.user,
                                time: msg.time || (msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
                                created_at: msg.created_at || msg.time,
                                timestamp: msg.created_at || msg.time,
                                isMe: Boolean(isMe)
                            };
                        };

    const peerIdOf = (conv) => {
        const id = conv?.partnerId;
        return id && id !== 'suporte' && id !== 'comunidade' ? id : null;
    };

    const decryptList = (list, conv) => {
        const peerId = peerIdOf(conv);
        return Promise.all(list.map(m => (isEncryptedContent(m.text) ? decryptIncoming(m, currentUserId, peerId, conv.id) : m)));
    };

    const parseDirectHistory = (data) => {
        if (Array.isArray(data)) return { items: data, hasMore: false, nextCursor: null };
        return {
            items: Array.isArray(data?.messages) ? data.messages : [],
            hasMore: !!data?.hasMore,
            nextCursor: data?.nextCursor || null
        };
    };

    const isDirectPlaceholder = (m) => m.messageId === 'sys-start';

    const loadOlderMessages = async () => {
        const conv = selectedConvRef.current;
        if (loadingMoreRef.current || !hasMore || !nextCursor || !conv?.id) return;
        const container = chatContainerRef.current;
        loadingMoreRef.current = true;
        setLoadingMore(true);
        const prevHeight = container ? container.scrollHeight : 0;
        const prevTop = container ? container.scrollTop : 0;
        try {
            const data = await apiRequest(`/directs/conversations/${conv.id}/messages?limit=30&before=${encodeURIComponent(nextCursor)}`);
            const page = parseDirectHistory(data);
            const older = await decryptList(page.items.map(msg => mapServerMessage(msg, conv.name)), conv);
            skipAutoScrollRef.current = true;
            setMessages(prev => {
                const known = new Set(prev.map(m => m.messageId));
                return [...older.filter(m => !known.has(m.messageId)), ...prev];
            });
            setHasMore(page.hasMore);
            setNextCursor(page.nextCursor);
            requestAnimationFrame(() => {
                if (container) container.scrollTop = container.scrollHeight - prevHeight + prevTop;
            });
        } catch (error) {
            console.error('Erro ao carregar mensagens anteriores:', error);
        } finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    };

    const handleChatScroll = (e) => {
        if (e.currentTarget.scrollTop < 80) loadOlderMessages();
    };

    const handleExportChatHistory = () => {
        const convName = selectedConv?.name || 'conversa';
        const lines = messages
            .filter(m => !isDirectPlaceholder(m))
            .map(m => {
                const when = m.created_at ? new Date(m.created_at).toLocaleString('pt-BR') : (m.time || '');
                return `[${when}] ${m.sender || 'Usuário'}: ${m.text || (m.image ? '[imagem]' : (m.attachment ? `[${m.attachment.kind === 'audio' ? 'áudio' : 'arquivo'}: ${m.attachment.name || ''}]` : ''))}`;
            });
        const header = `Conversa direta com: ${convName}\nExportado em: ${new Date().toLocaleString('pt-BR')}\n` +
            (hasMore ? 'Obs.: apenas as mensagens já carregadas foram exportadas.\n' : '') + '\n';
        const blob = new Blob([header + lines.join('\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `historico-${String(convName).replace(/[^a-z0-9_-]+/gi, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        initIdentity(currentUserId);
    }, [currentUserId]);

    useEffect(() => {
        let cancelled = false;
        setE2eeInfo({ active: false, safety: null });
        const peerId = peerIdOf(selectedConv);
        if (!selectedConv?.id || String(selectedConv.id).startsWith('privado-') || !peerId || !currentUserId) return undefined;
        getConversationCrypto(currentUserId, peerId).then(entry => {
            if (!cancelled) setE2eeInfo(entry ? { active: true, safety: entry.safety } : { active: false, safety: null });
        }).catch(() => {
            if (!cancelled) setE2eeInfo({ active: false, safety: null });
        });
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedConv?.id, selectedConv?.partnerId, currentUserId]);

    useEffect(() => {
        if (!selectedConv?.id) return;
        setHasMore(false);
        setNextCursor(null);

        const convId = selectedConv.id;
        const convName = selectedConv.name;
        const savedMessages = localStorage.getItem(`chat_messages_${convId}`);
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch {
                setMessages([]);
            }
        } else {
            const now = new Date();
            const initialMsgs = [
                {
                    messageId: 'sys-start',
                    sender: convName,
                    text: selectedConv.lastMessage || 'Conversa direta iniciada com sucesso.',
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    created_at: now.toISOString(),
                    isMe: false,
                    likes: []
                }
            ];
            setMessages(initialMsgs);
            cacheMessages(convId, initialMsgs);
        }

        if (convId && !String(convId).startsWith('privado-')) {
            apiRequest(`/directs/conversations/${convId}/messages?limit=50`)
                .then(data => {
                    const { items: serverMessages, hasMore: more, nextCursor: cursor } = parseDirectHistory(data);
                    setHasMore(more);
                    setNextCursor(cursor);
                    if (serverMessages.length > 0) {
                        const mapped = serverMessages.map(msg => mapServerMessage(msg, convName));
                        return decryptList(mapped, selectedConv).then(decrypted => {
                            if (selectedConvRef.current?.id !== convId) return; // trocou de conversa no meio do caminho
                            setMessages(decrypted);
                            cacheMessages(convId, decrypted);
                        });
                    }
                })
                .catch(() => {});
        }

        socket.emit('joinRoom', {
            roomId: convId,
            user: { id: currentUserId, name: currentUserDisplayName }
        });

        const processIncomingMessage = (msg) => {
            if (msg.room === convId || !msg.room) {
                setMessages(prev => {
                    const incomingId = msg.messageId || msg.id;
                    const incomingText = msg.message || msg.content || msg.text || '';
                    const incomingTime = new Date(msg.created_at || msg.time || Date.now()).getTime();

                    const isMe = (msg.user_id && msg.user_id === currentUserId) ||
                        (msg.userId && msg.userId === currentUserId) ||
                        msg.sender_id === currentUserId ||
                        msg.author === currentUserDisplayName ||
                        msg.sender === currentUserDisplayName ||
                        msg.userName === currentUserDisplayName ||
                        msg.sender_name === currentUserDisplayName;

                    const existingIndex = prev.findIndex(m => {
                        if (incomingId && (m.messageId === incomingId || m.id === incomingId || m.tempId === incomingId)) {
                            return true;
                        }
                        if (msg.tempId && (m.tempId === msg.tempId || m.id === msg.tempId || m.messageId === msg.tempId)) {
                            return true;
                        }
                        if (isMe && (m.isMe || m.tempId) && m.text === incomingText) {
                            const msgTime = new Date(m.created_at || m.timestamp || 0).getTime();
                            if (!isNaN(msgTime) && !isNaN(incomingTime) && Math.abs(msgTime - incomingTime) < 10000) {
                                return true;
                            }
                        }
                        return false;
                    });

                    if (existingIndex !== -1) {
                        const existing = prev[existingIndex];
                        const updated = [...prev];
                        updated[existingIndex] = {
                            ...existing,
                            id: msg.id || incomingId || existing.id,
                            messageId: msg.messageId || incomingId || existing.messageId,
                            created_at: msg.created_at || existing.created_at,
                            timestamp: msg.created_at || existing.timestamp,
                            tempId: undefined
                        };
                        cacheMessages(convId, updated.slice(-100));
                        return updated;
                    }

                    const senderName = isMe
                        ? currentUserDisplayName
                        : (
                            (msg.sender && msg.sender !== 'Usuário' ? msg.sender : null) ||
                            msg.sender_name ||
                            msg.user?.displayName ||
                            msg.user?.name ||
                            msg.user?.username ||
                            msg.author_name ||
                            msg.author ||
                            msg.userName ||
                            msg.user_name ||
                            msg.username ||
                            (registeredUsers.find(u => u.id === (msg.userId || msg.user_id || msg.sender_id))?.displayName) ||
                            (registeredUsers.find(u => u.id === (msg.userId || msg.user_id || msg.sender_id))?.name) ||
                            convName ||
                            'Usuário'
                        );

                    const now = new Date();
                    const newMsg = {
                        id: msg.id || incomingId || ('msg_' + Date.now()),
                        messageId: msg.messageId || msg.id || ('msg_' + Date.now()),
                        sender_id: msg.sender_id || msg.userId || msg.user_id || (isMe ? currentUserId : undefined),
                        sender: senderName,
                        sender_name: senderName,
                        user: msg.user,
                        avatar: msg.avatar || msg.user?.profilePhoto || null,
                        text: msg.message || msg.content || msg.text || '',
                        time: msg.time || (msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
                        created_at: msg.created_at || msg.time || now.toISOString(),
                        timestamp: msg.created_at || msg.time || now.toISOString(),
                        isMe: Boolean(isMe),
                        image: msg.image || msg.imageUrl || msg.image_url || null,
                        attachment: normalizeAttachment(msg),
                        encrypted: Boolean(msg.encrypted),
                        decryptFailed: Boolean(msg.decryptFailed),
                        likes: []
                    };
                    const updated = [...prev, newMsg];
                    cacheMessages(convId, updated.slice(-100));
                    return updated;
                });

                setConversations(prevConvs => {
                    const updatedList = prevConvs.map(c => {
                        if (c.id === convId) {
                            return {
                                ...c,
                                lastMessage: msg.encrypted ? '🔒 Mensagem criptografada' : (msg.message || msg.content || msg.text || (msg.image ? 'Foto recebida' : 'Mensagem recebida')),
                                time: msg.created_at || new Date().toISOString()
                            };
                        }
                        return c;
                    });
                    localStorage.setItem('chat_direct_conversations', JSON.stringify(updatedList));
                    return updatedList;
                });
            }
        };

        const handleReceiveMessage = async (rawMsg) => {
            let msg = rawMsg;
            if ([rawMsg.content, rawMsg.message, rawMsg.text].some(isEncryptedContent)) {
                msg = await decryptIncoming(rawMsg, currentUserId, peerIdOf(selectedConvRef.current), convId);
            }
            processIncomingMessage(msg);
        };

        const handleMessageDeleted = ({ messageId }) => {
            setMessages(prev => {
                const updated = prev.filter(m => (m.messageId || m.id) !== messageId && m.messageId !== messageId && m.id !== messageId);
                cacheMessages(convId, updated);
                return updated;
            });
        };

        const handleLikeToggled = ({ messageId, userId }) => {
            if (userId === currentUserId) return;
            setMessages(prev => {
                const updated = prev.map(m => {
                    if (m.messageId === messageId || m.id === messageId) {
                        const likes = Array.isArray(m.likes) ? [...m.likes] : [];
                        const index = likes.indexOf(userId);
                        if (index > -1) {
                            likes.splice(index, 1);
                        } else {
                            likes.push(userId);
                        }
                        return { ...m, likes };
                    }
                    return m;
                });
                cacheMessages(convId, updated);
                return updated;
            });
        };

        const handlePresenceUpdated = ({ roomId, onlineUsers }) => {
            if (roomId === convId) {
                const isPartnerHere = Array.isArray(onlineUsers) && onlineUsers.some(u => u.id !== currentUserId);
                setRoomOnlineUserIds(new Set(isPartnerHere ? ['partner'] : []));
            }
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('message_deleted', handleMessageDeleted);
        socket.on('like_toggled', handleLikeToggled);
        socket.on('roomPresenceUpdated', handlePresenceUpdated);

        return () => {
            socket.emit('leaveRoom', { roomId: convId, userId: currentUserId });
            socket.off('receive_message', handleReceiveMessage);
            socket.off('message_deleted', handleMessageDeleted);
            socket.off('like_toggled', handleLikeToggled);
            socket.off('roomPresenceUpdated', handlePresenceUpdated);
        };
    }, [selectedConv?.id, currentUserId, currentUserDisplayName]);

    useEffect(() => {
        const handleUserPresenceChanged = ({ userId, isOnline }) => {
            if (!userId) return;
            setOnlineUserIds(prev => {
                const next = new Set(prev);
                if (isOnline) {
                    next.add(userId);
                } else {
                    next.delete(userId);
                }
                return next;
            });

            if (userId === currentUserId) return;

            setConversations(prev => prev.map(c => {
                const parts = c.id ? String(c.id).replace('privado-', '').split('-') : [];
                const partnerFromId = parts.find(p => p !== currentUserId);
                const isMatch = c.partnerId === userId || partnerFromId === userId || c.username === userId;
                if (isMatch && c.online !== isOnline) {
                    return { ...c, online: isOnline };
                }
                return c;
            }));
            setSelectedConv(prev => {
                if (!prev) return prev;
                const parts = prev.id ? String(prev.id).replace('privado-', '').split('-') : [];
                const partnerFromId = parts.find(p => p !== currentUserId);
                const isMatch = prev.partnerId === userId || partnerFromId === userId || prev.username === userId;
                if (isMatch && prev.online !== isOnline) {
                    return { ...prev, online: isOnline };
                }
                return prev;
            });
        };

        const handleOnlineUsersList = (usersList) => {
            if (!Array.isArray(usersList)) return;
            const onlineSet = new Set(usersList);
            setOnlineUserIds(onlineSet);
            setConversations(prev => prev.map(c => {
                if (c.username === 'suporte' || c.name === 'Suporte SkyRipple') {
                    return { ...c, online: true };
                }
                const parts = c.id ? String(c.id).replace('privado-', '').split('-') : [];
                const partnerFromId = parts.find(p => p !== currentUserId);
                const isOnline = (c.partnerId && onlineSet.has(c.partnerId)) ||
                                 (partnerFromId && onlineSet.has(partnerFromId)) ||
                                 (c.username && onlineSet.has(c.username));
                return { ...c, online: Boolean(isOnline) };
            }));
            setSelectedConv(prev => {
                if (!prev) return prev;
                if (prev.username === 'suporte' || prev.name === 'Suporte SkyRipple') {
                    return { ...prev, online: true };
                }
                const parts = prev.id ? String(prev.id).replace('privado-', '').split('-') : [];
                const partnerFromId = parts.find(p => p !== currentUserId);
                const isOnline = (prev.partnerId && onlineSet.has(prev.partnerId)) ||
                                 (partnerFromId && onlineSet.has(partnerFromId)) ||
                                 (prev.username && onlineSet.has(prev.username));
                return { ...prev, online: Boolean(isOnline) };
            });
        };

        socket.on('user_presence_changed', handleUserPresenceChanged);
        socket.on('online_users_list', handleOnlineUsersList);
        socket.emit('get_online_users');

        return () => {
            socket.off('user_presence_changed', handleUserPresenceChanged);
            socket.off('online_users_list', handleOnlineUsersList);
        };
    }, [currentUserId]);

    const isConversationOnline = (conv) => {
        if (!conv) return false;
        if (conv.username === 'suporte' || conv.name === 'Suporte SkyRipple') {
            return true;
        }
        if (selectedConv && conv.id === selectedConv.id && roomOnlineUserIds.size > 0) {
            return true;
        }
        if (conv.partnerId && onlineUserIds.has(conv.partnerId)) {
            return true;
        }
        if (conv.username && onlineUserIds.has(conv.username)) {
            return true;
        }
        const parts = conv.id ? String(conv.id).replace('privado-', '').split('-') : [];
        const partnerFromId = parts.find(p => p !== currentUserId);
        if (partnerFromId && onlineUserIds.has(partnerFromId)) {
            return true;
        }
        return Boolean(conv.online);
    };

    useEffect(() => {
        if (skipAutoScrollRef.current) {
            skipAutoScrollRef.current = false;
            return;
        }
        if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e?.preventDefault();
        if (isSubmittingRef.current) return;
        const formElement = e?.target?.tagName === 'FORM' ? e.target : e?.currentTarget?.form;
        const fallbackText = formElement?.message?.value || '';
        const textToSend = (inputMessage || fallbackText || '').trim();
        if ((!textToSend && !imagePreview && !pendingAttachment) || !selectedConv) return;

        isSubmittingRef.current = true;
        setInputMessage('');
        setImagePreview(null);
        const attachmentToSend = pendingAttachment;
        setPendingAttachment(null);
        if (formElement?.message) {
            formElement.message.value = '';
        }
        setTimeout(() => {
            isSubmittingRef.current = false;
        }, 300);

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const isoTime = now.toISOString();
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newMsgId = tempId;

        const imageToSend = imagePreview;
        const isServerConv = Boolean(selectedConv.id) && !String(selectedConv.id).startsWith('privado-');
        const peerId = peerIdOf(selectedConv);
        // Criptografia ponta a ponta quando o contato já ativou a chave dele
        let cryptoEntry = null;
        try {
            cryptoEntry = isServerConv && peerId ? await getConversationCrypto(currentUserId, peerId) : null;
        } catch {
            cryptoEntry = null;
        }

        const newMsg = {
            id: tempId,
            tempId,
            messageId: newMsgId,
            sender: currentUserDisplayName,
            sender_id: currentUserId,
            text: textToSend,
            time: timeStr,
            created_at: isoTime,
            timestamp: isoTime,
            isMe: true,
            image: imageToSend || null,
            attachment: attachmentToSend,
            encrypted: Boolean(cryptoEntry),
            likes: []
        };

        setMessages(prev => {
            const updated = [...prev, newMsg];
            cacheMessages(selectedConv.id, updated.slice(-100));
            return updated;
        });

        let wire; // o que realmente sai do navegador
        if (cryptoEntry) {
            try {
                const envelope = await encryptMessage(cryptoEntry, selectedConv.id, { text: textToSend, image: imageToSend, attachment: attachmentToSend });
                // Só o envelope sai daqui: texto, imagem e anexo em claro não são enviados
                wire = { content: envelope };
            } catch {
                setMessages(prev => prev.filter(m => m.messageId !== newMsgId && m.tempId !== tempId));
                alert('Não foi possível criptografar a mensagem. Ela não foi enviada.');
                return;
            }
        } else {
            wire = { content: textToSend, message: textToSend, image: imageToSend, imageUrl: imageToSend || null, attachment: attachmentToSend || undefined };
        }

        socket.emit('send_message', {
            room: selectedConv.id,
            userId: currentUserId,
            user_id: currentUserId,
            userName: currentUserDisplayName,
            sender_name: currentUserDisplayName,
            author: currentUserDisplayName,
            sender: currentUserDisplayName,
            time: timeStr,
            created_at: isoTime,
            messageId: newMsgId,
            tempId,
            ...wire
        });

        if (isServerConv) {
            apiRequest(`/directs/conversations/${selectedConv.id}/messages`, {
                method: 'POST',
                body: JSON.stringify(cryptoEntry
                    ? { content: wire.content }
                    : { content: textToSend, imageUrl: imageToSend, attachment: attachmentToSend || undefined })
            }).then((savedMsg) => {
                if (savedMsg && (savedMsg.id || savedMsg.messageId)) {
                    setMessages(prev => {
                        const updated = prev.map(m => (m.tempId === tempId || m.messageId === tempId || m.id === tempId) ? { ...m, ...savedMsg, tempId: undefined } : m);
                        cacheMessages(selectedConv.id, updated.slice(-100));
                        return updated;
                    });
                }
            }).catch(() => {});
        }

        const updatedConversations = conversations.map(c => {
            if (c.id === selectedConv.id) {
                return {
                    ...c,
                    lastMessage: cryptoEntry ? '🔒 Mensagem criptografada' : (textToSend || (attachmentToSend ? 'Anexo enviado' : 'Foto enviada')),
                    time: isoTime
                };
            }
            return c;
        });
        setConversations(updatedConversations);
        localStorage.setItem('chat_direct_conversations', JSON.stringify(updatedConversations));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleStartNewConversation = async (contactInput) => {
        const targetNameOrUser = typeof contactInput === 'string' ? contactInput : contactInput?.name || newContactName;
        const trimmed = (targetNameOrUser || '').trim();
        if (!trimmed) return;

        const matchedRegistered = typeof contactInput === 'object' && contactInput?.id
            ? contactInput
            : registeredUsers.find(u =>
                (u.name && u.name.toLowerCase() === trimmed.toLowerCase()) ||
                (u.email && u.email.toLowerCase() === trimmed.toLowerCase()) ||
                (u.username && u.username.toLowerCase() === trimmed.toLowerCase())
            );

        if (matchedRegistered?.id) {
            try {
                const serverConv = await apiRequest('/directs/conversations', {
                    method: 'POST',
                    body: JSON.stringify({ targetUserId: matchedRegistered.id })
                });

                if (serverConv?.id) {
                    const updated = [serverConv, ...conversations.filter(c => c.id !== serverConv.id)];
                    setConversations(updated);
                    localStorage.setItem('chat_direct_conversations', JSON.stringify(updated));
                    setSelectedConv(serverConv);
                    setNewContactName('');
                    setIsNewConvModalOpen(false);
                    return;
                }
            } catch (err) {
                console.error(err);
            }
        }

        const newId = `privado-${[currentUserId, trimmed.toLowerCase().replace(/\s+/g, '_')].sort().join('-')}`;
        const existing = conversations.find(c => c.id === newId || c.name.toLowerCase() === trimmed.toLowerCase());

        if (existing) {
            setSelectedConv(existing);
        } else {
            const newConv = {
                id: newId,
                name: trimmed,
                username: trimmed.toLowerCase(),
                avatar: null,
                lastMessage: 'Conversa iniciada',
                time: 'Agora',
                online: true,
                unread: 0
            };
            const updated = [newConv, ...conversations];
            setConversations(updated);
            localStorage.setItem('chat_direct_conversations', JSON.stringify(updated));
            setSelectedConv(newConv);
        }

        setNewContactName('');
        setIsNewConvModalOpen(false);
    };

    const handleDeleteConversation = (e, convId) => {
        e.stopPropagation();
        if (convId && !String(convId).startsWith('privado-')) {
            apiRequest(`/directs/conversations/${convId}`, { method: 'DELETE' }).catch(() => {});
        }
        const updated = conversations.filter(c => c.id !== convId);
        setConversations(updated);
        localStorage.setItem('chat_direct_conversations', JSON.stringify(updated));
        localStorage.removeItem(`chat_messages_${convId}`);
        if (selectedConv?.id === convId) {
            setSelectedConv(updated[0] || null);
        }
    };

    const handleToggleFavorite = (msg) => {
        const isCurrentlyFav = !!msg.isFavorite;
        const updated = messages.map(m => {
            if (m.messageId === msg.messageId) {
                return { ...m, isFavorite: !isCurrentlyFav };
            }
            return m;
        });
        setMessages(updated);
        if (selectedConv) {
            cacheMessages(selectedConv.id, updated);
        }

        if (isCurrentlyFav) {
            apiRequest(`/favorites/message/${msg.messageId}`, { method: 'DELETE' }).catch(() => {});
        } else {
            apiRequest('/favorites', {
                method: 'POST',
                body: JSON.stringify({
                    item_type: 'message',
                    item_id: msg.messageId,
                    title: msg.sender,
                    content: msg.text,
                    meta: {
                        time: msg.time,
                        roomId: selectedConv?.id || null,
                        roomName: `Direta: ${selectedConv?.name || 'Contato'}`
                    }
                })
            }).catch(() => {});
        }
    };

    const handleToggleLike = (messageId) => {
        if (!messageId) return;
        setMessages(prev => {
            const updated = prev.map(m => {
                if (m.messageId === messageId || m.id === messageId) {
                    const likes = Array.isArray(m.likes) ? [...m.likes] : [];
                    const idx = likes.indexOf(currentUserId);
                    if (idx > -1) {
                        likes.splice(idx, 1);
                    } else {
                        likes.push(currentUserId);
                    }
                    return { ...m, likes };
                }
                return m;
            });
            if (selectedConv) {
                cacheMessages(selectedConv.id, updated);
                socket.emit('toggle_like', {
                    room: selectedConv.id,
                    messageId,
                    userId: currentUserId
                });
            }
            return updated;
        });
    };

    const handleDeleteMessage = (messageId) => {
        if (!messageId) return;
        setMessages(prev => {
            const updated = prev.filter(m => (m.messageId || m.id) !== messageId && m.messageId !== messageId && m.id !== messageId);
            if (selectedConv) {
                cacheMessages(selectedConv.id, updated);
            }
            return updated;
        });
        if (selectedConv) {
            socket.emit('delete_message', {
                room: selectedConv.id,
                messageId
            });
        }
    };

    const handleCopyText = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
    };

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const chatSearchResults = chatSearchTerm.trim()
        ? messages.filter(m => m.text && m.text.toLowerCase().includes(chatSearchTerm.toLowerCase()))
        : [];

    const displayedMessages = messages.filter(msg => {
        if (showFavoritesOnly && !msg.isFavorite) return false;
        return true;
    });

    return (
        <div className="animate-chat-shell flex w-full h-[calc(100vh-48px)] overflow-hidden">
            <ChatSidebar isMobileOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />

            <div className="flex-1 flex flex-col md:flex-row min-w-0 h-full relative overflow-hidden bg-[#f8fafc] dark:bg-[#020617]">
                <div className={`w-full md:w-[320px] lg:w-[360px] h-full shrink-0 flex flex-col border-r border-[#d2d2d7] dark:border-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a] ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
                    <div className="p-3.5 border-b border-[#d2d2d7] dark:border-white/5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                            <button
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="lg:hidden w-8 h-8 flex items-center justify-center text-[#86868b] dark:text-[#94a3b8] hover:text-[#0071e3] transition-colors rounded-full"
                                aria-label="Abrir menu"
                            >
                                <FaBars size={16} />
                            </button>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-xs border border-sky-400">
                                <FaEnvelope size={14} />
                            </div>
                            <h2 className="font-bold text-[16px] text-[#1d1d1f] dark:text-[#f8fafc]">Diretas</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsNewConvModalOpen(true)}
                            className="btn-primary-glossy px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Nova Mensagem Direta"
                        >
                            <FaPlus size={11} />
                            <span>Nova</span>
                        </button>
                    </div>

                    <div className="p-2.5 border-b border-[#d2d2d7] dark:border-white/5">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
                            <input
                                type="text"
                                placeholder="Buscar conversas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="skeuo-input pl-8 pr-3 py-1.5 text-xs w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-1 skeuo-scrollbar">
                        {filteredConversations.length === 0 ? (
                            <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                                <FaEnvelope className="text-slate-300 dark:text-slate-600" size={24} />
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Nenhuma conversa encontrada</p>
                                <button
                                    type="button"
                                    onClick={() => setIsNewConvModalOpen(true)}
                                    className="btn-secondary-glossy px-3 py-1.5 text-xs font-semibold rounded-xl mt-1 text-sky-600 dark:text-sky-400"
                                >
                                    Iniciar Conversa
                                </button>
                            </div>
                        ) : (
                            filteredConversations.map(conv => {
                                const isSelected = selectedConv?.id === conv.id;
                                return (
                                    <div
                                        key={conv.id}
                                        onClick={() => setSelectedConv(conv)}
                                        className={`group p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 border ${
                                            isSelected
                                                ? 'bg-sky-500/10 border-sky-400/40 dark:bg-sky-900/30 dark:border-sky-700/60 shadow-xs'
                                                : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                                        }`}
                                    >
                                        <div className="relative shrink-0">
                                            <UserAvatar src={conv.avatar} name={conv.name} size="sm" showStatus={false} />
                                            {isConversationOnline(conv) && (
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900 shadow-xs"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                                    {conv.name}
                                                </h4>
                                                <span className="text-[10px] text-slate-400 shrink-0">{formatConversationTime(conv.time)}</span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                {conv.lastMessage}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => handleDeleteConversation(e, conv.id)}
                                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 p-1.5 transition-opacity"
                                            title="Excluir conversa"
                                            aria-label="Excluir conversa"
                                        >
                                            <FaTrashAlt size={11} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className={`flex-1 flex flex-col h-full bg-[#f8fafc] dark:bg-[#020617] relative ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
                    {selectedConv ? (
                        <>
                            <div className="absolute top-0 left-0 right-0 h-1 z-10 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400 dark:from-sky-600 dark:via-sky-700 dark:to-sky-600 shadow-[0_1px_2px_rgba(14,165,233,0.3)]" />

                            <div className="px-4 py-2.5 flex items-center justify-between shrink-0 border-b border-[#d2d2d7] dark:border-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a]">
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedConv(null)}
                                        className="md:hidden text-slate-500 dark:text-slate-400 p-1.5 rounded-lg hover:bg-black/5"
                                        aria-label="Voltar para lista de conversas"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                    <UserAvatar src={selectedConv.avatar} name={selectedConv.name} size="sm" showStatus={false} />
                                    <div className="flex flex-col justify-center">
                                        <h3 className="font-bold text-[15px] leading-tight text-[#1d1d1f] dark:text-[#f8fafc]">
                                            {selectedConv.name}
                                        </h3>
                                        <p className="text-[11px] flex items-center gap-1.5 mt-0.5 text-[#86868b] dark:text-slate-400">
                                            <span className="flex items-center gap-1 font-medium">
                                                <span className={`w-1.5 h-1.5 rounded-full ${isConversationOnline(selectedConv) ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]' : 'bg-slate-400'}`} />
                                                {isConversationOnline(selectedConv) ? 'Online agora' : 'Offline'}
                                            </span>
                                            <span>•</span>
                                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                                Conversa Direta Privada
                                            </span>
                                            {e2eeInfo.active ? (
                                                <span
                                                    data-testid="e2ee-badge"
                                                    className="flex items-center gap-1 text-[10px] font-bold text-sky-600 dark:text-sky-400"
                                                    title={`Mensagens criptografadas de ponta a ponta. Código de segurança (confira com ${selectedConv.name} por outro canal): ${e2eeInfo.safety}`}
                                                >
                                                    <FaLock size={9} /> Criptografia ponta a ponta
                                                </span>
                                            ) : (
                                                peerIdOf(selectedConv) && !String(selectedConv.id).startsWith('privado-') && (
                                                    <span
                                                        data-testid="e2ee-badge-off"
                                                        className="flex items-center gap-1 text-[10px] font-semibold text-slate-400"
                                                        title="Este contato ainda não ativou a criptografia ponta a ponta. As mensagens seguem sem esse recurso até ele abrir o app."
                                                    >
                                                        <FaLockOpen size={9} /> Sem criptografia
                                                    </span>
                                                )
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 sm:gap-2">
                                    <button
                                        type="button"
                                        onClick={handleExportChatHistory}
                                        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border border-gray-200/50 dark:border-slate-600/50 bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-600 dark:text-slate-300 hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 transition-all"
                                        title="Exportar histórico (.txt)"
                                    >
                                        <FaDownload size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsChatSearchOpen(!isChatSearchOpen)}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                            isChatSearchOpen
                                                ? '!bg-gradient-to-b !from-sky-400 !to-sky-600 dark:!from-sky-600 dark:!to-sky-800 !text-white !border-transparent !shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]'
                                                : 'border border-gray-200/50 dark:border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-600 dark:text-slate-300 hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 dark:hover:from-slate-600 dark:hover:to-slate-700'
                                        }`}
                                        title="Buscar mensagens"
                                    >
                                        <FaSearch size={13} className={isChatSearchOpen ? 'text-white' : 'text-gray-500 dark:text-slate-400'} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                                        className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                                            showFavoritesOnly
                                                ? '!bg-gradient-to-b !from-sky-400 !to-sky-600 dark:!from-sky-600 dark:!to-sky-800 !text-white !border-transparent !shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]'
                                                : 'border border-gray-200/50 dark:border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-600 dark:text-slate-300 hover:from-sky-50 hover:to-sky-100 hover:text-sky-600 dark:hover:from-slate-600 dark:hover:to-slate-700'
                                        }`}
                                        title={showFavoritesOnly ? "Mostrar todas as mensagens" : "Mostrar apenas favoritas"}
                                    >
                                        <FaStar size={13} className={showFavoritesOnly ? 'text-white' : 'text-gray-500 dark:text-slate-400'} />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={(e) => handleDeleteConversation(e, selectedConv.id)}
                                        className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer border border-gray-200/50 dark:border-slate-600/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_2px_4px_rgba(0,0,0,0.3)] bg-gradient-to-b from-white to-gray-100 dark:from-slate-700 dark:to-slate-800 text-gray-600 dark:text-slate-300 hover:!from-rose-50 hover:!to-rose-100 hover:!text-rose-600 dark:hover:!from-rose-950/40 dark:hover:!to-rose-950/60 dark:hover:!text-rose-400 transition-all"
                                        title="Excluir conversa"
                                    >
                                        <FaTrash size={13} className="text-gray-500 hover:text-rose-500" />
                                    </button>
                                </div>
                            </div>

                            <div className={`overflow-hidden shrink-0 z-10 transition-all duration-300 ease-out bg-[#f5f5f7]/90 dark:bg-slate-800/90 backdrop-blur-md shadow-xs border-b ${
                                isChatSearchOpen
                                    ? 'max-h-20 py-2 opacity-100 translate-y-0 border-b-[#d2d2d7] dark:border-b-white/5'
                                    : 'max-h-0 py-0 opacity-0 -translate-y-2 border-b-transparent pointer-events-none'
                            }`}>
                                <div className="px-4 flex items-center gap-3">
                                    <div className="relative flex-1">
                                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] dark:text-slate-400" size={12} />
                                        <input
                                            type="text"
                                            value={chatSearchTerm}
                                            onChange={(e) => setChatSearchTerm(e.target.value)}
                                            placeholder="Buscar mensagens na conversa..."
                                            className="skeuo-input w-full px-8 py-1.5 text-[13px] rounded-full"
                                        />
                                        {chatSearchTerm && (
                                            <button
                                                type="button"
                                                onClick={() => setChatSearchTerm('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-[#1d1d1f] dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                        )}
                                    </div>
                                    {chatSearchResults.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-[11px] whitespace-nowrap text-[#86868b] dark:text-slate-400">
                                                {chatSearchIndex + 1} de {chatSearchResults.length}
                                            </span>
                                            <div className="border border-[#d2d2d7] dark:border-white/10 rounded-full shadow-xs flex items-center overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => setChatSearchIndex(prev => (prev - 1 + chatSearchResults.length) % chatSearchResults.length)}
                                                    className="px-2 py-1 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#86868b] dark:text-slate-400 transition-colors first:border-r first:border-[#d2d2d7] dark:first:border-r-white/10 cursor-pointer"
                                                    title="Resultado anterior"
                                                >
                                                    <FaChevronUp size={10} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setChatSearchIndex(prev => (prev + 1) % chatSearchResults.length)}
                                                    className="px-2 py-1 bg-white hover:bg-gray-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#86868b] dark:text-slate-400 transition-colors cursor-pointer"
                                                    title="Próximo resultado"
                                                >
                                                    <FaChevronDown size={10} />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => { setIsChatSearchOpen(false); setChatSearchTerm(''); }}
                                        className="font-medium text-xs whitespace-nowrap text-[#0071e3] hover:underline transition-colors cursor-pointer"
                                    >
                                        Fechar
                                    </button>
                                </div>
                            </div>

                            <div ref={chatContainerRef} onScroll={handleChatScroll} className="flex-grow overflow-y-auto pt-3 px-3 pb-3 space-y-2 skeuo-scrollbar">
                                {loadingMore && (
                                    <div className="text-center py-2 text-xs text-[#86868b] dark:text-slate-400">Carregando mensagens anteriores...</div>
                                )}
                                {!hasMore && !loadingMore && messages.length > 0 && !messages.some(isDirectPlaceholder) && (
                                    <div className="text-center py-2 text-xs text-[#86868b] dark:text-slate-400">📌 Início do histórico da conversa alcançado</div>
                                )}
                                {displayedMessages.length === 0 && (
                                    <div className="opacity-80 animate-fade-in-up flex flex-col items-center justify-center h-full min-h-[250px] text-center px-4">
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-b from-gray-50 to-gray-200 border border-[#d2d2d7] shadow-[inset_0_2px_4px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.05)] text-[#86868b] dark:text-slate-400">
                                            <FaComments size={24} className="drop-shadow-xs text-[#0071e3]/60" />
                                        </div>
                                        <h3 className="text-[15px] font-semibold mb-1 text-[#1d1d1f] dark:text-[#f8fafc]">
                                            Nenhuma mensagem ainda
                                        </h3>
                                        <p className="text-[13px] text-[#86868b] dark:text-slate-400">
                                            {showFavoritesOnly
                                                ? "Você não possui mensagens favoritas nesta conversa."
                                                : "Inicie uma conversa direta privada e segura."}
                                        </p>
                                    </div>
                                )}

                                {displayedMessages.map((msg, index) => {
                                    const msgKey = msg.id || msg.tempId || msg.messageId || `${msg.sender_id || 'self'}-${msg.created_at || msg.timestamp || index}-${index}`;
                                    const isGrande = bubbleFormat !== 'classico';
                                    const currentDateKey = getMessageDateKey(msg);
                                    const prevDateKey = index > 0 ? getMessageDateKey(displayedMessages[index - 1]) : null;
                                    const showDateDivider = index === 0 || currentDateKey !== prevDateKey;

                                    const isMatch = chatSearchTerm && msg.text && msg.text.toLowerCase().includes(chatSearchTerm.toLowerCase());
                                    const matchClass = isMatch ? 'ring-2 ring-sky-400 shadow-md' : '';

                                    const senderName =
                                        (msg.sender && msg.sender !== 'Usuário' ? msg.sender : null) ||
                                        msg.sender_name ||
                                        msg.user?.displayName ||
                                        msg.user?.name ||
                                        msg.user?.username ||
                                        msg.author_name ||
                                        msg.author ||
                                        msg.userName ||
                                        msg.user_name ||
                                        msg.username ||
                                        (registeredUsers.find(u => u.id === (msg.userId || msg.user_id || msg.sender_id))?.displayName) ||
                                        (registeredUsers.find(u => u.id === (msg.userId || msg.user_id || msg.sender_id))?.name) ||
                                        (selectedConv ? selectedConv.name : null) ||
                                        msg.sender ||
                                        'Usuário';

                                    const senderAvatar = msg.avatar || msg.user?.profilePhoto || (msg.isMe ? null : selectedConv?.avatar);
                                    const formattedTime = formatMessageTime(msg.time, msg.created_at);
                                    const fullDateTime = formatFullDateTime(msg.time, msg.created_at);

                                    const dateDivider = showDateDivider && (
                                        <div className="flex items-center justify-center my-3 select-none">
                                            <span className="px-3 py-1 rounded-full text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-xs backdrop-blur-xs">
                                                {currentDateKey}
                                            </span>
                                        </div>
                                    );

                                    if (msg.isMe) {
                                        if (isGrande) {
                                            return (
                                                <Fragment key={msgKey}>
                                                    {dateDivider}
                                                    <div
                                                        className="px-2 py-0.5 flex justify-end group animate-fade-in-up relative z-1 hover:z-50"
                                                        style={{ zIndex: openMenuId === msgKey ? 9999 : undefined }}
                                                    >
                                                        <div className="flex flex-col items-end max-w-[80%] sm:max-w-[70%] ml-auto group/msg relative z-1 hover:z-50">
                                                            <div className={`skeuo-bubble-sent !rounded-[18px] px-5 py-2.5 text-sm font-medium relative transition-all duration-300 ${matchClass}`}>
                                                                <div className="message-bubble-actions absolute top-2 right-full mr-2 z-10">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setOpenMenuId(prev => prev === msgKey ? null : msgKey);
                                                                        }}
                                                                        className={`message-bubble-more-btn p-1 flex items-center justify-center rounded-full text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer ${
                                                                            openMenuId === msgKey ? '!opacity-100 bg-black/5 dark:bg-white/10' : 'opacity-0 group-hover/msg:opacity-100'
                                                                        }`}
                                                                        title="Mais opções"
                                                                    >
                                                                        <FaEllipsisV size={12} className="drop-shadow-xs" />
                                                                    </button>

                                                                    <div className={`absolute top-0 right-full mr-2 min-w-[140px] flex flex-col rounded-xl bg-[#f4f5f7] dark:bg-slate-800 border border-black/5 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-200 z-[10000] ${
                                                                        openMenuId === msgKey ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
                                                                    }`}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                handleToggleLike(msgKey);
                                                                            }}
                                                                            className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10 first:rounded-t-xl"
                                                                        >
                                                                            {msg.likes && msg.likes.includes(currentUserId) ? (
                                                                                <>
                                                                                    <FaHeart size={10} className="text-red-500 drop-shadow-xs" />
                                                                                    <span>Descurtir</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FaRegHeart size={10} className="text-[#86868b] dark:text-slate-400" />
                                                                                    <span>Curtir</span>
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                handleToggleFavorite(msg);
                                                                            }}
                                                                            className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10"
                                                                        >
                                                                            <FaStar size={10} className={`drop-shadow-xs transition-colors ${msg.isFavorite ? 'text-amber-500' : 'text-[#86868b] dark:text-slate-400'}`} />
                                                                            {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                                                                        </button>
                                                                        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                handleCopyText(msg.text);
                                                                            }}
                                                                            className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10"
                                                                        >
                                                                            <FaCopy size={10} className="text-slate-500" /> Copiar texto
                                                                        </button>
                                                                        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                handleDeleteMessage(msgKey);
                                                                            }}
                                                                            className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 last:rounded-b-xl"
                                                                        >
                                                                            <FaTrash size={10} className="drop-shadow-xs" /> Apagar
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {msg.image && (
                                                                    <div className="rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-sm mb-1.5 mt-0.5">
                                                                        <img
                                                                            onClick={() => setSelectedImage(msg.image)}
                                                                            src={msg.image}
                                                                            alt="Anexo"
                                                                            className="max-w-[240px] max-h-[300px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <AttachmentView attachment={msg.attachment} />
                                                                {msg.text && (
                                                                    <p className="break-words whitespace-pre-wrap leading-relaxed">
                                                                        {msg.text}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-1.5 mt-1 mr-3 text-[10px] text-slate-400 dark:text-slate-500">
                                                                <button
                                                                    type="button"
                                                                    aria-label="Curtir mensagem"
                                                                    title={msg.likes && msg.likes.includes(currentUserId) ? "Descurtir" : "Curtir"}
                                                                    onClick={() => handleToggleLike(msgKey)}
                                                                    className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-all border ${
                                                                        msg.likes && msg.likes.includes(currentUserId)
                                                                            ? '!opacity-100 !text-red-500 dark:!text-red-400 !bg-red-50 dark:!bg-red-950/40 !border-red-100 dark:!border-red-900/40 shadow-xs'
                                                                            : msg.likes && msg.likes.length > 0
                                                                                ? 'opacity-100 bg-white dark:bg-slate-700 text-[#86868b] dark:text-slate-400 border-gray-200 dark:border-slate-600 shadow-xs hover:bg-black/5 dark:hover:bg-slate-600'
                                                                                : 'opacity-70 sm:opacity-0 sm:group-hover/msg:opacity-100 border-transparent text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1d1d1f] dark:hover:text-[#f8fafc]'
                                                                    }`}
                                                                >
                                                                    {msg.likes && msg.likes.includes(currentUserId) ? (
                                                                        <FaHeart size={10} className="drop-shadow-xs" />
                                                                    ) : (
                                                                        <FaRegHeart size={10} />
                                                                    )}
                                                                    {msg.likes && msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                                                                </button>
                                                                <span title={fullDateTime}>{formattedTime}</span>
                                                                <span className="text-sky-500 dark:text-sky-400 font-bold">✓✓</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Fragment>
                                            );
                                        }

                                        const sentBubbleClass = `px-3 py-1.5 flex flex-col relative transition-all duration-300 rounded-[14px] rounded-tr-[2px] skeuo-bubble-sent ${matchClass}`;
                                        return (
                                            <Fragment key={msgKey}>
                                                {dateDivider}
                                                <div
                                                    className="px-2 py-0.5 flex justify-end group animate-fade-in-up relative z-1 hover:z-50"
                                                    style={{ zIndex: openMenuId === msgKey ? 9999 : undefined }}
                                                >
                                                    <div className="flex flex-col max-w-[80%] items-end group/msg relative z-1 hover:z-50">
                                                        <div className={sentBubbleClass}>
                                                            <div className="message-bubble-actions absolute top-2 right-full mr-2 z-10">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenMenuId(prev => prev === msgKey ? null : msgKey);
                                                                    }}
                                                                    className={`message-bubble-more-btn p-1 flex items-center justify-center rounded-full text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer ${
                                                                        openMenuId === msgKey ? '!opacity-100 bg-black/5 dark:bg-white/10' : 'opacity-0 group-hover/msg:opacity-100'
                                                                    }`}
                                                                    title="Mais opções"
                                                                >
                                                                    <FaEllipsisV size={12} className="drop-shadow-xs" />
                                                                </button>

                                                                <div className={`absolute top-0 right-full mr-2 min-w-[140px] flex flex-col rounded-xl bg-[#f4f5f7] dark:bg-slate-800 border border-black/5 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-200 z-[10000] ${
                                                                    openMenuId === msgKey ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
                                                                }`}>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenuId(null);
                                                                            handleToggleLike(msgKey);
                                                                        }}
                                                                        className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10 first:rounded-t-xl"
                                                                    >
                                                                        {msg.likes && msg.likes.includes(currentUserId) ? (
                                                                            <>
                                                                                <FaHeart size={10} className="text-red-500 drop-shadow-xs" />
                                                                                <span>Descurtir</span>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <FaRegHeart size={10} className="text-[#86868b] dark:text-slate-400" />
                                                                                <span>Curtir</span>
                                                                            </>
                                                                        )}
                                                                    </button>
                                                                    <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenuId(null);
                                                                            handleToggleFavorite(msg);
                                                                        }}
                                                                        className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10"
                                                                    >
                                                                        <FaStar size={10} className={`drop-shadow-xs transition-colors ${msg.isFavorite ? 'text-amber-500' : 'text-[#86868b] dark:text-slate-400'}`} />
                                                                        {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                                                                    </button>
                                                                    <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenuId(null);
                                                                            handleCopyText(msg.text);
                                                                        }}
                                                                        className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10"
                                                                    >
                                                                        <FaCopy size={10} className="text-slate-500" /> Copiar texto
                                                                    </button>
                                                                    <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenMenuId(null);
                                                                            handleDeleteMessage(msgKey);
                                                                        }}
                                                                        className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 last:rounded-b-xl"
                                                                    >
                                                                        <FaTrash size={10} className="drop-shadow-xs" /> Apagar
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {msg.image && (
                                                                <img
                                                                    onClick={() => setSelectedImage(msg.image)}
                                                                    src={msg.image}
                                                                    alt="Anexo"
                                                                    className="max-w-[240px] mb-1 mt-0.5 object-cover rounded-md border border-white/20 dark:border-white/5 cursor-pointer hover:opacity-90 transition-opacity"
                                                                />
                                                            )}
                                                            <AttachmentView attachment={msg.attachment} />
                                                            {msg.text && (
                                                                <p className="break-words whitespace-pre-wrap text-[13px] leading-[1.25]">
                                                                    {msg.text}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex items-center gap-2 mt-0.5 px-1 w-full justify-end">
                                                            <button
                                                                type="button"
                                                                aria-label="Curtir mensagem"
                                                                title={msg.likes && msg.likes.includes(currentUserId) ? "Descurtir" : "Curtir"}
                                                                onClick={() => handleToggleLike(msgKey)}
                                                                className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-all border ${
                                                                    msg.likes && msg.likes.includes(currentUserId)
                                                                        ? '!opacity-100 !text-red-500 dark:!text-red-400 !bg-red-50 dark:!bg-red-950/40 !border-red-100 dark:!border-red-900/40 shadow-xs'
                                                                        : msg.likes && msg.likes.length > 0
                                                                            ? 'opacity-100 bg-white dark:bg-slate-700 text-[#86868b] dark:text-slate-400 border-gray-200 dark:border-slate-600 shadow-xs hover:bg-black/5 dark:hover:bg-slate-600'
                                                                            : 'opacity-70 sm:opacity-0 sm:group-hover/msg:opacity-100 border-transparent text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1d1d1f] dark:hover:text-[#f8fafc]'
                                                                }`}
                                                            >
                                                                {msg.likes && msg.likes.includes(currentUserId) ? (
                                                                    <FaHeart size={10} className="drop-shadow-xs" />
                                                                ) : (
                                                                    <FaRegHeart size={10} />
                                                                )}
                                                                {msg.likes && msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                                                            </button>
                                                            <span className="text-[10px] font-medium flex items-center gap-1.5 text-[#86868b] dark:text-slate-400">
                                                                <span title={fullDateTime}>{formattedTime}</span>
                                                                <span className="text-sky-500 dark:text-sky-400 font-bold">✓✓</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        );
                                    }

                                    if (isGrande) {
                                        return (
                                            <Fragment key={msgKey}>
                                                {dateDivider}
                                                <div
                                                    className="px-2 py-0.5 flex justify-start group animate-fade-in-up relative z-1 hover:z-50"
                                                    style={{ zIndex: openMenuId === msgKey ? 9999 : undefined }}
                                                >
                                                    <div className="flex items-end gap-2.5 max-w-[80%] sm:max-w-[70%] group/msg relative z-1 hover:z-50">
                                                        <UserAvatar
                                                            src={senderAvatar}
                                                            name={senderName}
                                                            size="sm"
                                                            showStatus={false}
                                                            className="shrink-0 mb-1"
                                                        />

                                                        <div className="flex flex-col items-start min-w-0">
                                                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-2 flex items-center gap-1.5">
                                                                {senderName}
                                                            </span>

                                                            <div className={`bg-gradient-to-b from-[#f9f9f9] to-[#ebebeb] dark:from-[#334155] dark:to-[#1e293b] text-[#1d1d1f] dark:text-[#f8fafc] border border-slate-300/80 dark:border-slate-800 shadow-[0_2px_4px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1)] dark:shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-[18px] px-5 py-2.5 text-sm relative transition-all duration-300 ${matchClass}`}>
                                                                <div className="message-bubble-actions absolute top-2 left-full ml-2 z-10">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setOpenMenuId(prev => prev === msgKey ? null : msgKey);
                                                                        }}
                                                                        className={`message-bubble-more-btn p-1 flex items-center justify-center rounded-full text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer ${
                                                                            openMenuId === msgKey ? '!opacity-100 bg-black/5 dark:bg-white/10' : 'opacity-0 group-hover/msg:opacity-100'
                                                                        }`}
                                                                        title="Mais opções"
                                                                    >
                                                                        <FaEllipsisV size={12} className="drop-shadow-xs" />
                                                                    </button>

                                                                    <div className={`absolute top-0 left-full ml-2 min-w-[140px] flex flex-col rounded-xl bg-[#f4f5f7] dark:bg-slate-800 border border-black/5 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-200 z-[10000] ${
                                                                        openMenuId === msgKey ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
                                                                    }`}>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                handleToggleLike(msgKey);
                                                                            }}
                                                                            className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10 first:rounded-t-xl"
                                                                        >
                                                                            {msg.likes && msg.likes.includes(currentUserId) ? (
                                                                                <>
                                                                                    <FaHeart size={10} className="text-red-500 drop-shadow-xs" />
                                                                                    <span>Descurtir</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FaRegHeart size={10} className="text-[#86868b] dark:text-slate-400" />
                                                                                    <span>Curtir</span>
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                handleToggleFavorite(msg);
                                                                            }}
                                                                            className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10"
                                                                        >
                                                                            <FaStar size={10} className={`drop-shadow-xs transition-colors ${msg.isFavorite ? 'text-amber-500' : 'text-[#86868b] dark:text-slate-400'}`} />
                                                                            {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                                                                        </button>
                                                                        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                handleCopyText(msg.text);
                                                                            }}
                                                                            className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10"
                                                                        >
                                                                            <FaCopy size={10} className="text-slate-500" /> Copiar texto
                                                                        </button>
                                                                        <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                handleDeleteMessage(msgKey);
                                                                            }}
                                                                            className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 last:rounded-b-xl"
                                                                        >
                                                                            <FaTrash size={10} className="drop-shadow-xs" /> Apagar
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {msg.image && (
                                                                    <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-sm mb-1.5 mt-0.5">
                                                                        <img
                                                                            onClick={() => setSelectedImage(msg.image)}
                                                                            src={msg.image}
                                                                            alt="Anexo"
                                                                            className="max-w-[240px] max-h-[300px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <AttachmentView attachment={msg.attachment} />
                                                                {msg.text && (
                                                                    <p className="break-words whitespace-pre-wrap leading-relaxed">
                                                                        {msg.text}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-2 mt-1 ml-3 text-[10px] text-slate-400 dark:text-slate-500">
                                                                <span title={fullDateTime}>{formattedTime}</span>
                                                                <button
                                                                    type="button"
                                                                    aria-label="Curtir mensagem"
                                                                    title={msg.likes && msg.likes.includes(currentUserId) ? "Descurtir" : "Curtir"}
                                                                    onClick={() => handleToggleLike(msgKey)}
                                                                    className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-all border ${
                                                                        msg.likes && msg.likes.includes(currentUserId)
                                                                            ? '!opacity-100 !text-red-500 dark:!text-red-400 !bg-red-50 dark:!bg-red-950/40 !border-red-100 dark:!border-red-900/40 shadow-xs'
                                                                            : msg.likes && msg.likes.length > 0
                                                                                ? 'opacity-100 bg-white dark:bg-slate-700 text-[#86868b] dark:text-slate-400 border-gray-200 dark:border-slate-600 shadow-xs hover:bg-black/5 dark:hover:bg-slate-600'
                                                                                : 'opacity-70 sm:opacity-0 sm:group-hover/msg:opacity-100 border-transparent text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1d1d1f] dark:hover:text-[#f8fafc]'
                                                                    }`}
                                                                >
                                                                    {msg.likes && msg.likes.includes(currentUserId) ? (
                                                                        <FaHeart size={10} className="drop-shadow-xs" />
                                                                    ) : (
                                                                        <FaRegHeart size={10} />
                                                                    )}
                                                                    {msg.likes && msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Fragment>
                                        );
                                    }

                                    const receivedBubbleClass = `px-3 py-1.5 flex flex-col relative transition-all duration-300 rounded-[14px] rounded-tl-[2px] skeuo-bubble-received ${matchClass}`;
                                    return (
                                        <Fragment key={msgKey}>
                                            {dateDivider}
                                            <div
                                                className="px-2 py-0.5 flex justify-start gap-2 group animate-fade-in-up relative z-1 hover:z-50"
                                                style={{ zIndex: openMenuId === msgKey ? 9999 : undefined }}
                                            >
                                                <UserAvatar
                                                    src={senderAvatar}
                                                    name={senderName}
                                                    size="sm"
                                                    showStatus={false}
                                                    className="mt-1 shrink-0"
                                                />
                                                <div className="flex flex-col max-w-[80%] items-start group/msg relative z-1 hover:z-50">
                                                    <span className="font-bold flex items-center gap-1.5 mb-1 leading-none text-[#1d1d1f] dark:text-[#f8fafc] text-[11.5px] ml-1">
                                                        {senderName}
                                                    </span>
                                                    <div className={receivedBubbleClass}>
                                                        <div className="message-bubble-actions absolute top-2 left-full ml-2 z-10">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setOpenMenuId(prev => prev === msgKey ? null : msgKey);
                                                                }}
                                                                className={`message-bubble-more-btn p-1 flex items-center justify-center rounded-full text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer ${
                                                                    openMenuId === msgKey ? '!opacity-100 bg-black/5 dark:bg-white/10' : 'opacity-0 group-hover/msg:opacity-100'
                                                                }`}
                                                                title="Mais opções"
                                                            >
                                                                <FaEllipsisV size={12} className="drop-shadow-xs" />
                                                            </button>

                                                            <div className={`absolute top-0 left-full ml-2 min-w-[140px] flex flex-col rounded-xl bg-[#f4f5f7] dark:bg-slate-800 border border-black/5 dark:border-white/10 shadow-lg dark:shadow-2xl transition-all duration-200 z-[10000] ${
                                                                openMenuId === msgKey ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
                                                            }`}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpenMenuId(null);
                                                                        handleToggleLike(msgKey);
                                                                    }}
                                                                    className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10 first:rounded-t-xl"
                                                                >
                                                                    {msg.likes && msg.likes.includes(currentUserId) ? (
                                                                        <>
                                                                            <FaHeart size={10} className="text-red-500 drop-shadow-xs" />
                                                                            <span>Descurtir</span>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <FaRegHeart size={10} className="text-[#86868b] dark:text-slate-400" />
                                                                            <span>Curtir</span>
                                                                        </>
                                                                    )}
                                                                </button>
                                                                <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpenMenuId(null);
                                                                        handleToggleFavorite(msg);
                                                                    }}
                                                                    className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10"
                                                                >
                                                                    <FaStar size={10} className={`drop-shadow-xs transition-colors ${msg.isFavorite ? 'text-amber-500' : 'text-[#86868b] dark:text-slate-400'}`} />
                                                                    {msg.isFavorite ? "Desfavoritar" : "Favoritar"}
                                                                </button>
                                                                <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpenMenuId(null);
                                                                        handleCopyText(msg.text);
                                                                    }}
                                                                    className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-[#1d1d1f] dark:text-[#f8fafc] hover:bg-black/5 dark:hover:bg-white/10"
                                                                >
                                                                    <FaCopy size={10} className="text-slate-500" /> Copiar texto
                                                                </button>
                                                                <div className="h-px w-full bg-black/10 dark:bg-white/10" />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setOpenMenuId(null);
                                                                        handleDeleteMessage(msgKey);
                                                                    }}
                                                                    className="px-3 py-2 text-left text-xs whitespace-nowrap font-medium flex items-center gap-2 cursor-pointer transition-colors text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 last:rounded-b-xl"
                                                                >
                                                                    <FaTrash size={10} className="drop-shadow-xs" /> Apagar
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {msg.image && (
                                                            <div className="rounded-md overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-xs mb-1 mt-0.5">
                                                                <img
                                                                    onClick={() => setSelectedImage(msg.image)}
                                                                    src={msg.image}
                                                                    alt="Anexo"
                                                                    className="max-w-[240px] max-h-[300px] object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                                />
                                                            </div>
                                                        )}
                                                        <AttachmentView attachment={msg.attachment} />
                                                        {msg.text && (
                                                            <p className="break-words whitespace-pre-wrap text-[13px] leading-[1.25]">
                                                                {msg.text}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2 mt-0.5 px-1 w-full justify-start text-[10px] text-slate-400 dark:text-slate-500">
                                                        <span title={fullDateTime}>{formattedTime}</span>
                                                        <button
                                                            type="button"
                                                            aria-label="Curtir mensagem"
                                                            title={msg.likes && msg.likes.includes(currentUserId) ? "Descurtir" : "Curtir"}
                                                            onClick={() => handleToggleLike(msgKey)}
                                                            className={`flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full cursor-pointer transition-all border ${
                                                                msg.likes && msg.likes.includes(currentUserId)
                                                                    ? '!opacity-100 !text-red-500 dark:!text-red-400 !bg-red-50 dark:!bg-red-950/40 !border-red-100 dark:!border-red-900/40 shadow-xs'
                                                                    : msg.likes && msg.likes.length > 0
                                                                        ? 'opacity-100 bg-white dark:bg-slate-700 text-[#86868b] dark:text-slate-400 border-gray-200 dark:border-slate-600 shadow-xs hover:bg-black/5 dark:hover:bg-slate-600'
                                                                        : 'opacity-70 sm:opacity-0 sm:group-hover/msg:opacity-100 border-transparent text-[#86868b] dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-[#1d1d1f] dark:hover:text-[#f8fafc]'
                                                            }`}
                                                        >
                                                            {msg.likes && msg.likes.includes(currentUserId) ? (
                                                                <FaHeart size={10} className="drop-shadow-xs" />
                                                            ) : (
                                                                <FaRegHeart size={10} />
                                                            )}
                                                            {msg.likes && msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Fragment>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            <footer className="shrink-0 relative p-3 border-t border-[#d2d2d7] dark:border-t-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a]">
                                {imagePreview && (
                                    <div className="absolute left-4 bottom-[calc(100%+10px)] p-2 flex items-center gap-2 z-10 skeuo-panel shadow-lg animate-fade-in-up">
                                        <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-sky-400" />
                                        <button
                                            type="button"
                                            onClick={() => setImagePreview(null)}
                                            className="p-1.5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-[#1d1d1f] transition-colors cursor-pointer"
                                            title="Remover anexo"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageSelect}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <label
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer rounded-full bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 dark:from-slate-700 dark:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-700 text-[#86868b] hover:text-[#1d1d1f] dark:text-slate-300 dark:hover:text-white border border-gray-200 dark:border-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)] transition-all"
                                        title="Anexar imagem"
                                        aria-label="Anexar imagem"
                                    >
                                        <FaCamera size={14} className="drop-shadow-xs" />
                                    </label>
                                    <AttachmentComposer value={pendingAttachment} onChange={setPendingAttachment} />

                                    <div className="relative flex-grow flex items-center">
                                        <input
                                            type="text"
                                            name="message"
                                            maxLength={1000}
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder={`Mensagem para ${selectedConv.name}...`}
                                            className={`skeuo-input w-full px-4 py-2 flex-grow text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 rounded-xl ${
                                                inputMessage.length > 750 ? 'pr-20' : 'pr-14'
                                            }`}
                                        />
                                        {inputMessage.length > 0 && (
                                            <span
                                                className={`absolute right-3 text-[11px] font-semibold pointer-events-none select-none transition-colors ${
                                                    inputMessage.length >= 1000
                                                        ? 'text-rose-500 dark:text-rose-400 font-bold'
                                                        : inputMessage.length >= 850
                                                            ? 'text-amber-500 dark:text-amber-400'
                                                            : 'text-slate-400 dark:text-slate-500'
                                                }`}
                                            >
                                                {inputMessage.length}/1000
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!inputMessage.trim() && !imagePreview && !pendingAttachment}
                                        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[0_2px_4px_rgba(14,165,233,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all enabled:hover:scale-105 enabled:active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        title="Enviar mensagem"
                                        aria-label="Enviar mensagem"
                                    >
                                        <FaPaperPlane size={12} className="ml-[-2px]" />
                                    </button>
                                </form>
                            </footer>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-500 flex items-center justify-center shadow-inner">
                                <FaEnvelope size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
                                    Mensagens Diretas
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                                    Selecione uma conversa ao lado ou inicie um novo bate-papo privado com outro usuário.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsNewConvModalOpen(true)}
                                className="btn-primary-glossy px-5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
                            >
                                <FaPlus size={12} />
                                Nova Conversa
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-6 right-6 rounded-full p-2 text-white bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                        title="Fechar imagem"
                    >
                        <FaTimes size={18} />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Visualização"
                        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <NewDirectMessageModal
                isOpen={isNewConvModalOpen}
                onClose={() => setIsNewConvModalOpen(false)}
                onStartConversation={handleStartNewConversation}
                registeredUsers={registeredUsers}
                currentUserId={currentUserId}
            />
        </div>
    );
};

export default Directs;
