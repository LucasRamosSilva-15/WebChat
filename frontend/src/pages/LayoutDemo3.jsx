import { useState } from 'react';

// Ícone circular com relevo estilo Web 2.0
const ReliefIcon = ({ children, color = 'sky', size = 'md', active = false, badge = null, online = false }) => {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-14 h-14 text-xl'
  };
  
  const colors = {
    sky: active 
      ? 'bg-gradient-to-b from-sky-400 to-sky-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]'
      : 'bg-gradient-to-b from-white to-gray-100 text-gray-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)] hover:from-sky-50 hover:to-sky-100 hover:text-sky-600',
    emerald: 'bg-gradient-to-b from-emerald-400 to-emerald-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]',
    amber: 'bg-gradient-to-b from-amber-400 to-amber-500 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]',
    rose: 'bg-gradient-to-b from-rose-400 to-rose-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]',
    gray: 'bg-gradient-to-b from-gray-200 to-gray-300 text-gray-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.1)]'
  };

  return (
    <div className="relative inline-flex">
      <div className={`
        ${sizes[size]} ${colors[color]}
        rounded-full flex items-center justify-center
        border border-gray-200/50
        transition-all duration-150 cursor-pointer
        active:scale-95 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]
      `}>
        {children}
      </div>
      {badge && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 
          bg-gradient-to-b from-rose-500 to-rose-600 text-white text-[10px] font-bold
          rounded-full flex items-center justify-center
          shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.3)]
          border border-rose-400">
          {badge}
        </span>
      )}
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 
          bg-gradient-to-b from-emerald-400 to-emerald-500 
          rounded-full border-2 border-white
          shadow-[0_0_4px_rgba(16,185,129,0.6)]" />
      )}
    </div>
  );
};

// Badge WebChat customizado
const WebChatBadge = ({ type, size = 'sm' }) => {
  const badges = {
    dono: {
      label: 'DONO',
      colors: 'from-amber-400 via-yellow-400 to-amber-500 text-amber-900',
      icon: '★'
    },
    mod: {
      label: 'MOD',
      colors: 'from-violet-400 to-violet-600 text-white',
      icon: '⚡'
    },
    vip: {
      label: 'VIP',
      colors: 'from-sky-400 to-sky-600 text-white',
      icon: '◆'
    },
    verified: {
      label: '',
      colors: 'from-sky-400 to-sky-500 text-white',
      icon: '✓'
    },
    new: {
      label: 'NOVO',
      colors: 'from-emerald-400 to-emerald-600 text-white',
      icon: ''
    }
  };

  const badge = badges[type];
  if (!badge) return null;

  const sizeClasses = size === 'sm' ? 'text-[9px] px-1.5 py-0.5 gap-0.5' : 'text-[10px] px-2 py-0.5 gap-1';

  return (
    <span className={`
      inline-flex items-center ${sizeClasses}
      bg-gradient-to-b ${badge.colors}
      rounded-full font-bold uppercase tracking-wide
      shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_2px_rgba(0,0,0,0.15)]
      border border-white/20
    `}>
      {badge.icon && <span className="text-[8px]">{badge.icon}</span>}
      {badge.label}
    </span>
  );
};

// Avatar com moldura WebChat
const WebChatAvatar = ({ name, color, size = 'md', online = false, badge = null }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl'
  };

  const colors = {
    sky: 'from-sky-400 to-sky-600',
    emerald: 'from-emerald-400 to-emerald-600',
    violet: 'from-violet-400 to-violet-600',
    rose: 'from-rose-400 to-rose-600',
    amber: 'from-amber-400 to-amber-600',
    slate: 'from-slate-400 to-slate-600'
  };

  return (
    <div className="relative inline-flex">
      {/* Moldura externa com brilho */}
      <div className={`
        ${sizes[size]} rounded-full p-[2px]
        bg-gradient-to-b ${colors[color]}
        shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.3)]
      `}>
        {/* Avatar interno */}
        <div className={`
          w-full h-full rounded-full
          bg-gradient-to-b from-white to-gray-50
          flex items-center justify-center font-semibold
          text-gray-700
          shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
        `}>
          {name.charAt(0).toUpperCase()}
        </div>
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 
          bg-gradient-to-b from-emerald-400 to-emerald-500 
          rounded-full border-2 border-white
          shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
      )}
      {badge && (
        <span className="absolute -bottom-1 -right-1">
          <WebChatBadge type={badge} size="sm" />
        </span>
      )}
    </div>
  );
};

// Card WebChat com faixa azul
const WebChatCard = ({ children, accent = true, className = '' }) => (
  <div className={`
    relative bg-white rounded-lg overflow-hidden
    shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.06)]
    border border-gray-200/80
    ${className}
  `}>
    {accent && (
      <div className="absolute top-0 left-0 right-0 h-1 
        bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400
        shadow-[0_1px_2px_rgba(14,165,233,0.3)]" />
    )}
    {children}
  </div>
);

// Mensagem fixada destacada
const PinnedMessage = ({ author, message, time }) => (
  <div className="mx-3 mb-2">
    <div className="
      relative bg-gradient-to-r from-amber-50 to-yellow-50 
      rounded-lg border border-amber-200/80 
      p-3 
      shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_3px_rgba(0,0,0,0.05)]
    ">
      {/* Pin icon */}
      <div className="absolute -top-2 -left-2">
        <div className="
          w-6 h-6 rounded-full 
          bg-gradient-to-b from-amber-400 to-amber-500
          flex items-center justify-center
          shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.4)]
          border border-amber-300
          rotate-[-15deg]
        ">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"/>
          </svg>
        </div>
      </div>
      <div className="pl-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-amber-700">{author}</span>
          <span className="text-[10px] text-amber-500">{time}</span>
        </div>
        <p className="text-sm text-amber-800">{message}</p>
      </div>
    </div>
  </div>
);

// Mensagem de chat
const ChatMessage = ({ message, isOwn = false }) => {
  const [liked, setLiked] = useState(message.liked || false);
  const [likes, setLikes] = useState(message.likes || 0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  if (isOwn) {
    return (
      <div className="flex justify-end px-3 py-1 group">
        <div className="max-w-[70%]">
          <div className="
            bg-gradient-to-b from-sky-500 to-sky-600
            text-white rounded-2xl rounded-br-sm
            px-3 py-2
            shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]
          ">
            <p className="text-sm">{message.text}</p>
          </div>
          <div className="flex items-center justify-end gap-2 mt-0.5 px-1">
            <span className="text-[10px] text-gray-400">{message.time}</span>
            <span className="text-sky-500 text-xs">✓✓</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 px-3 py-1 group">
      {message.showAvatar ? (
        <WebChatAvatar 
          name={message.author} 
          color={message.color} 
          size="sm" 
          online={message.online}
        />
      ) : (
        <div className="w-8" />
      )}
      <div className="flex-1 max-w-[70%]">
        {message.showAuthor && (
          <div className="flex items-center gap-1.5 mb-0.5 px-1">
            <span className="text-xs font-semibold text-gray-700">{message.author}</span>
            {message.badge && <WebChatBadge type={message.badge} />}
            {message.online && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </div>
        )}
        <div className="
          bg-gradient-to-b from-white to-gray-50
          rounded-2xl rounded-tl-sm
          px-3 py-2
          shadow-[0_1px_3px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]
          border border-gray-200/80
        ">
          <p className="text-sm text-gray-800">{message.text}</p>
        </div>
        <div className="flex items-center gap-3 mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-gray-400">{message.time}</span>
          <button 
            onClick={toggleLike}
            className={`flex items-center gap-0.5 text-[10px] transition-colors ${
              liked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
            }`}
          >
            {liked ? '❤️' : '🤍'} {likes > 0 && likes}
          </button>
          <button className="text-[10px] text-gray-400 hover:text-sky-500">↩️</button>
        </div>
      </div>
    </div>
  );
};

// Sidebar de navegação
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: 'Início', badge: null },
    { id: 'rooms', icon: '💬', label: 'Salas', badge: 3 },
    { id: 'directs', icon: '✉️', label: 'Diretas', badge: 5 },
    { id: 'favorites', icon: '⭐', label: 'Favoritos', badge: null },
    { id: 'profile', icon: '👤', label: 'Perfil', badge: null },
    { id: 'settings', icon: '⚙️', label: 'Ajustes', badge: null },
  ];

  return (
    <div className="w-[220px] h-screen sticky top-0 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100 border-r border-gray-200">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200/80">
        <div className="flex items-center gap-2">
          <div className="
            w-9 h-9 rounded-xl
            bg-gradient-to-br from-sky-400 to-sky-600
            flex items-center justify-center
            shadow-[0_2px_8px_rgba(14,165,233,0.4),inset_0_1px_0_rgba(255,255,255,0.3)]
          ">
            <span className="text-white text-lg font-bold">W</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800">WebChat</h1>
            <p className="text-[10px] text-gray-500 -mt-0.5">Conectando pessoas</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-3 px-3 py-2 rounded-lg
              transition-all duration-150
              ${activeTab === item.id 
                ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-[0_2px_8px_rgba(14,165,233,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]' 
                : 'text-gray-600 hover:bg-white hover:shadow-sm'
              }
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className={`
                min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold
                flex items-center justify-center
                ${activeTab === item.id 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gradient-to-b from-rose-500 to-rose-600 text-white shadow-sm'
                }
              `}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-gray-200/80">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm border border-gray-100">
          <WebChatAvatar name="Lucas" color="sky" size="md" online={true} badge="vip" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">Lucas Ramos</p>
            <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Área de chat principal
const ChatArea = () => {
  const [message, setMessage] = useState('');
  
  const messages = [
    { id: 1, author: 'Carlos', text: 'Bem-vindos ao WebChat! Espero que gostem da nova versão.', time: '14:32', color: 'amber', badge: 'dono', online: true, showAvatar: true, showAuthor: true, likes: 12, liked: true },
    { id: 2, author: 'Carlos', text: 'Temos novas funcionalidades como badges personalizados e status online.', time: '14:32', color: 'amber', showAvatar: false, showAuthor: false, likes: 5 },
    { id: 3, author: 'Ana', text: 'Ficou incrível! Adorei os badges VIP 💎', time: '14:35', color: 'rose', badge: 'mod', online: true, showAvatar: true, showAuthor: true, likes: 8 },
    { id: 4, author: 'Pedro', text: 'Os ícones com relevo dão um charme especial', time: '14:36', color: 'emerald', online: false, showAvatar: true, showAuthor: true, likes: 3 },
    { id: 5, author: 'Pedro', text: 'Lembra o visual clássico dos apps antigos', time: '14:36', color: 'emerald', showAvatar: false, showAuthor: false, likes: 2 },
    { id: 6, author: 'me', text: 'Valeu pelo feedback pessoal! Ainda tem mais novidades vindo', time: '14:38', isOwn: true },
    { id: 7, author: 'Julia', text: 'A mensagem fixada ficou muito elegante!', time: '14:40', color: 'violet', badge: 'vip', online: true, showAvatar: true, showAuthor: true, likes: 6 },
    { id: 8, author: 'me', text: 'Sim! Dá pra destacar avisos importantes da sala', time: '14:41', isOwn: true },
  ];

  return (
    <WebChatCard className="flex-1 flex flex-col h-screen">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-b from-white to-gray-50">
        <div className="flex items-center gap-3">
          <ReliefIcon color="sky" active>
            <span className="text-sm">💬</span>
          </ReliefIcon>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">Sala Principal</h2>
              <WebChatBadge type="verified" />
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                12 online
              </span>
              <span className="text-gray-300">•</span>
              <span>48 membros</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <ReliefIcon size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </ReliefIcon>
          <ReliefIcon size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </ReliefIcon>
          <ReliefIcon size="sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </ReliefIcon>
        </div>
      </div>

      {/* Pinned Message */}
      <PinnedMessage 
        author="Carlos (DONO)"
        message="Lembrete: Respeitem as regras da comunidade. Sejam gentis uns com os outros!"
        time="12:00"
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-2 space-y-0.5 bg-gradient-to-b from-gray-50/50 to-white">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} isOwn={msg.author === 'me'} />
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <ReliefIcon size="sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </ReliefIcon>
            <ReliefIcon size="sm">
              <span className="text-sm">😊</span>
            </ReliefIcon>
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="
                w-full px-4 py-2.5 rounded-full
                bg-gray-100 border border-gray-200
                text-sm text-gray-800 placeholder-gray-400
                shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]
                focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-400
                transition-all
              "
            />
          </div>
          <ReliefIcon color={message ? 'sky' : 'gray'} active={!!message}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </ReliefIcon>
        </div>
      </div>
    </WebChatCard>
  );
};

// Sidebar direita - membros online
const MembersSidebar = () => {
  const members = [
    { name: 'Carlos', color: 'amber', badge: 'dono', online: true, status: 'Criando coisas incríveis' },
    { name: 'Ana', color: 'rose', badge: 'mod', online: true, status: 'Disponível' },
    { name: 'Julia', color: 'violet', badge: 'vip', online: true, status: 'Trabalhando' },
    { name: 'Pedro', color: 'emerald', online: true, status: null },
    { name: 'Maria', color: 'sky', online: true, status: null },
    { name: 'João', color: 'slate', online: false, status: null },
    { name: 'Fernanda', color: 'rose', online: false, status: null },
  ];

  const onlineMembers = members.filter(m => m.online);
  const offlineMembers = members.filter(m => !m.online);

  return (
    <div className="w-[200px] h-screen sticky top-0 border-l border-gray-200 bg-white overflow-y-auto">
      <div className="p-3 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Online — {onlineMembers.length}
        </h3>
      </div>
      <div className="p-2 space-y-1">
        {onlineMembers.map((member, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <WebChatAvatar name={member.name} color={member.color} size="sm" online={true} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-800 truncate">{member.name}</span>
                {member.badge && <WebChatBadge type={member.badge} />}
              </div>
              {member.status && (
                <p className="text-[10px] text-gray-400 truncate">{member.status}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Offline — {offlineMembers.length}
        </h3>
      </div>
      <div className="p-2 space-y-1 opacity-60">
        {offlineMembers.map((member, i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-lg">
            <WebChatAvatar name={member.name} color={member.color} size="sm" />
            <span className="text-sm text-gray-500 truncate">{member.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente principal
const LayoutDemo3 = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [showMobileNav, setShowMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-sky-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <button 
          onClick={() => setShowMobileNav(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">W</span>
          </div>
          <span className="font-bold text-gray-800">WebChat</span>
        </div>
        <ReliefIcon size="sm" badge={3}>
          <span className="text-sm">💬</span>
        </ReliefIcon>
      </header>

      {/* Mobile Nav Overlay */}
      {showMobileNav && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileNav(false)} />
          <div className="absolute left-0 top-0 h-full w-[260px] bg-white shadow-xl">
            <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setShowMobileNav(false); }} />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <ChatArea />
        
        {/* Desktop Members Sidebar */}
        <div className="hidden xl:block">
          <MembersSidebar />
        </div>
      </div>
    </div>
  );
};

export default LayoutDemo3;
