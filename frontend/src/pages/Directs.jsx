import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaEnvelope, FaPaperPlane, FaPlus, FaSearch, FaUser, FaTimes, FaCamera, FaBars, FaTrashAlt, FaCheck, FaComments } from 'react-icons/fa';
import ChatSidebar from '../components/ChatSidebar';
import UserAvatar from '../components/UserAvatar';
import { socket } from '../socket';
import { apiRequest } from '../services/api';

const INITIAL_CONVERSATIONS = [
    {
        id: 'privado-suporte',
        name: 'Suporte SkyRipple',
        username: 'suporte',
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
        avatar: null,
        lastMessage: 'Bem-vindo ao canal de mensagens diretas.',
        time: 'Hoje',
        online: true,
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
    const [isNewConvModalOpen, setIsNewConvModalOpen] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const currentUserId = localStorage.getItem('chat_uniqueUserId') || 'user_local';
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
                    avatar: null,
                    lastMessage: 'Conversa iniciada',
                    time: 'Agora',
                    online: true,
                    unread: 0
                };
                const updatedList = [newC, ...list];
                setConversations(updatedList);
                localStorage.setItem('chat_direct_conversations', JSON.stringify(updatedList));
                setSelectedConv(newC);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (!selectedConv) return;

        const convId = selectedConv.id;
        const savedMessages = localStorage.getItem(`chat_messages_${convId}`);
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch {
                setMessages([]);
            }
        } else {
            const initialMsgs = [
                {
                    messageId: 'sys-start',
                    sender: selectedConv.name,
                    text: selectedConv.lastMessage || 'Conversa direta iniciada com sucesso.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: false
                }
            ];
            setMessages(initialMsgs);
            localStorage.setItem(`chat_messages_${convId}`, JSON.stringify(initialMsgs));
        }

        if (selectedConv.id && !String(selectedConv.id).startsWith('privado-')) {
            apiRequest(`/directs/conversations/${selectedConv.id}/messages`)
                .then(serverMessages => {
                    if (Array.isArray(serverMessages) && serverMessages.length > 0) {
                        setMessages(serverMessages);
                        localStorage.setItem(`chat_messages_${convId}`, JSON.stringify(serverMessages));
                    }
                })
                .catch(() => {});
        }

        socket.emit('joinRoom', {
            roomId: convId,
            user: { id: currentUserId, name: currentUserDisplayName }
        });

        const handleReceiveMessage = (msg) => {
            if (msg.room === convId || !msg.room) {
                setMessages(prev => {
                    const alreadyExists = prev.some(m => m.messageId === (msg.messageId || msg.id));
                    if (alreadyExists) return prev;
                    const newMsg = {
                        messageId: msg.messageId || msg.id || 'msg_' + Date.now(),
                        sender: msg.author || msg.sender || selectedConv.name,
                        text: msg.message || msg.text || '',
                        time: msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        isMe: (msg.user_id && msg.user_id === currentUserId) || msg.author === currentUserDisplayName,
                        image: msg.image || null
                    };
                    const updated = [...prev, newMsg];
                    localStorage.setItem(`chat_messages_${convId}`, JSON.stringify(updated.slice(-100)));
                    return updated;
                });
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [selectedConv]);

    useEffect(() => {
        if (typeof messagesEndRef.current?.scrollIntoView === 'function') {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = (e) => {
        e?.preventDefault();
        const fallbackText = e?.target?.message?.value || (e?.currentTarget?.form && e.currentTarget.form.message?.value);
        const textToSend = (inputMessage || fallbackText || '').trim();
        if ((!textToSend && !imagePreview) || !selectedConv) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newMsgId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

        const newMsg = {
            messageId: newMsgId,
            sender: currentUserDisplayName,
            text: textToSend,
            time: timeStr,
            isMe: true,
            image: imagePreview || null
        };

        setMessages(prev => {
            const updated = [...prev, newMsg];
            localStorage.setItem(`chat_messages_${selectedConv.id}`, JSON.stringify(updated.slice(-100)));
            return updated;
        });

        socket.emit('send_message', {
            room: selectedConv.id,
            userId: currentUserId,
            user_id: currentUserId,
            userName: currentUserDisplayName,
            author: currentUserDisplayName,
            content: textToSend,
            message: textToSend,
            time: timeStr,
            messageId: newMsgId,
            image: imagePreview
        });

        if (selectedConv.id && !String(selectedConv.id).startsWith('privado-')) {
            apiRequest(`/directs/conversations/${selectedConv.id}/messages`, {
                method: 'POST',
                body: JSON.stringify({ content: textToSend, imageUrl: imagePreview })
            }).catch(() => {});
        }

        const updatedConversations = conversations.map(c => {
            if (c.id === selectedConv.id) {
                return {
                    ...c,
                    lastMessage: textToSend || 'Foto enviada',
                    time: timeStr
                };
            }
            return c;
        });
        setConversations(updatedConversations);
        localStorage.setItem('chat_direct_conversations', JSON.stringify(updatedConversations));

        setInputMessage('');
        setImagePreview(null);
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

    const handleStartNewConversation = async (e) => {
        e?.preventDefault();
        const trimmed = newContactName.trim();
        if (!trimmed) return;

        const matchedRegistered = registeredUsers.find(u =>
            (u.name && u.name.toLowerCase() === trimmed.toLowerCase()) ||
            (u.email && u.email.toLowerCase() === trimmed.toLowerCase())
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

    const filteredConversations = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                                            {conv.online && (
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white dark:border-slate-900 shadow-xs"></span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-1">
                                                <h4 className={`text-xs font-bold truncate ${isSelected ? 'text-sky-600 dark:text-sky-400' : 'text-slate-800 dark:text-slate-100'}`}>
                                                    {conv.name}
                                                </h4>
                                                <span className="text-[10px] text-slate-400 shrink-0">{conv.time}</span>
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
                            <div className="px-4 py-2.5 border-b border-[#d2d2d7] dark:border-white/5 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a] flex items-center justify-between shrink-0">
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
                                    <div>
                                        <h3 className="font-bold text-sm text-[#1d1d1f] dark:text-[#f8fafc] leading-tight">
                                            {selectedConv.name}
                                        </h3>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                            Conversa Direta Privada
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 skeuo-scrollbar">
                                {messages.map(msg => (
                                    <div
                                        key={msg.messageId}
                                        className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm ${
                                                msg.isMe
                                                    ? 'skeuo-segmented-item-active !justify-start !text-left'
                                                    : 'skeuo-panel !shadow-xs border border-slate-200 dark:border-slate-800'
                                            }`}
                                        >
                                            {msg.image && (
                                                <img
                                                    src={msg.image}
                                                    alt="Anexo"
                                                    className="rounded-lg max-h-48 w-auto mb-2 object-cover border border-white/20"
                                                />
                                            )}
                                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                        </div>
                                        <span className="text-[10px] text-slate-400 px-1 mt-0.5 font-medium">
                                            {msg.time}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {imagePreview && (
                                <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                                    <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-sky-400" />
                                    <span className="text-xs text-slate-600 dark:text-slate-300 flex-1 truncate">Foto anexada pronta para envio</span>
                                    <button
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="text-rose-500 hover:text-rose-600 p-1"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="p-3 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] dark:from-[#1e293b] dark:to-[#0f172a] border-t border-[#d2d2d7] dark:border-white/5 flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="btn-secondary-glossy w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-slate-500 dark:text-slate-400 hover:text-sky-500"
                                    title="Anexar imagem"
                                    aria-label="Anexar imagem"
                                >
                                    <FaCamera size={14} />
                                </button>
                                <input
                                    type="text"
                                    name="message"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder={`Mensagem para ${selectedConv.name}...`}
                                    className="skeuo-input flex-1 px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 rounded-xl"
                                />
                                <button
                                    type="submit"
                                    onClick={handleSendMessage}
                                    className={`btn-primary-glossy px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold shrink-0 cursor-pointer ${!inputMessage.trim() && !imagePreview ? 'opacity-50' : ''}`}
                                    aria-label="Enviar mensagem"
                                >
                                    <FaPaperPlane size={12} />
                                    <span className="hidden sm:inline">Enviar</span>
                                </button>
                            </form>
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

            {isNewConvModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in"
                    onClick={() => setIsNewConvModalOpen(false)}
                >
                    <div
                        className="skeuo-panel p-6 max-w-sm w-full space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Nova Conversa Direta</h3>
                            <button
                                type="button"
                                onClick={() => setIsNewConvModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <FaTimes size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleStartNewConversation} className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                                    Nome ou Usuário
                                </label>
                                <input
                                    type="text"
                                    value={newContactName}
                                    onChange={(e) => setNewContactName(e.target.value)}
                                    placeholder="Ex: Carlos, Ana, Suporte..."
                                    className="skeuo-input w-full px-3 py-2 text-xs text-slate-800 dark:text-slate-100 rounded-xl"
                                    autoFocus
                                    required
                                />
                            </div>

                            {registeredUsers.length > 0 && (
                                <div className="space-y-1.5 pt-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                        Usuários disponíveis no sistema:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto skeuo-scrollbar pr-1">
                                        {registeredUsers.map(u => (
                                            <button
                                                key={u.id}
                                                type="button"
                                                onClick={() => {
                                                    setNewContactName(u.name);
                                                }}
                                                className="px-2.5 py-1 rounded-lg text-xs bg-black/5 dark:bg-white/5 hover:bg-sky-500/10 hover:text-sky-500 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                <span className="font-medium">{u.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsNewConvModalOpen(false)}
                                    className="btn-secondary-glossy flex-1 py-2 text-xs font-semibold rounded-xl"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary-glossy flex-1 py-2 text-xs font-semibold rounded-xl"
                                >
                                    Iniciar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Directs;
