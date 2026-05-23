import { useState, useRef, useEffect } from 'react';
import { FaSearch, FaHashtag, FaStar, FaPaperPlane, FaSmile, FaThumbtack, FaSignOutAlt, FaHeart, FaRegHeart, FaTimes, FaCog, FaChevronDown, FaBars, FaUserCircle, FaCircle, FaReply, FaEllipsisH, FaPlus, FaBell, FaImage, FaPaperclip, FaCheck, FaCheckDouble, FaMicrophone } from 'react-icons/fa';

// ============================================
// MOCK DATA - More realistic chat data
// ============================================
const mockUser = {
  name: "Lucas Ramos",
  status: "online",
  avatar: null
};

const mockRooms = [
  { id: 1, name: "Geral", unread: 3, lastMessage: "Carlos: E aí galera!", time: "14:32", online: 145, pinned: true },
  { id: 2, name: "Tecnologia", unread: 0, lastMessage: "Você: Valeu pela dica!", time: "12:15", online: 89, pinned: true },
  { id: 3, name: "Games", unread: 12, lastMessage: "Ana: Quem joga hoje?", time: "11:40", online: 200, pinned: false },
  { id: 4, name: "Design", unread: 0, lastMessage: "Pedro: Ficou top!", time: "Ontem", online: 45, pinned: false },
  { id: 5, name: "Off-Topic", unread: 1, lastMessage: "Maria: Hahaha boa", time: "Ontem", online: 67, pinned: false },
  { id: 6, name: "Suporte", unread: 0, lastMessage: "Bot: Ticket resolvido", time: "Seg", online: 12, pinned: false },
];

const mockMessages = [
  // Group 1 - Carlos
  { id: 1, text: "E aí pessoal! Bom dia!", sender: "Carlos", isMe: false, time: "14:30", role: "Dono", avatar: null, likes: 2, isFirst: true },
  { id: 2, text: "Alguém viu o novo lançamento da Apple?", sender: "Carlos", isMe: false, time: "14:30", role: "Dono", avatar: null, likes: 0, isFirst: false },
  { id: 3, text: "Tô curioso demais", sender: "Carlos", isMe: false, time: "14:31", role: "Dono", avatar: null, likes: 1, isFirst: false },
  
  // Group 2 - Ana
  { id: 4, text: "Bom dia! Vi sim, parece incrível", sender: "Ana", isMe: false, time: "14:31", role: "Mod", avatar: null, likes: 0, isFirst: true },
  
  // Group 3 - Me
  { id: 5, text: "Também vi! Recomendo demais", sender: "Lucas Ramos", isMe: true, time: "14:32", avatar: null, likes: 3, isFirst: true, status: "read" },
  { id: 6, text: "O design ficou muito bom", sender: "Lucas Ramos", isMe: true, time: "14:32", avatar: null, likes: 0, isFirst: false, status: "read" },
  
  // Group 4 - Pedro
  { id: 7, text: "Concordo!", sender: "Pedro", isMe: false, time: "14:33", role: null, avatar: null, likes: 0, isFirst: true },
  { id: 8, text: "A performance parece ter melhorado bastante também", sender: "Pedro", isMe: false, time: "14:33", role: null, avatar: null, likes: 2, isFirst: false },
  
  // Group 5 - Carlos again
  { id: 9, text: "Vou comprar assim que lançar aqui", sender: "Carlos", isMe: false, time: "14:34", role: "Dono", avatar: null, likes: 0, isFirst: true },
  
  // Group 6 - Me
  { id: 10, text: "Boa! Avisa quando chegar", sender: "Lucas Ramos", isMe: true, time: "14:35", avatar: null, likes: 1, isFirst: true, status: "delivered" },
];

const onlineUsers = [
  { name: "Carlos", role: "Dono", status: "online" },
  { name: "Ana", role: "Mod", status: "online" },
  { name: "Pedro", role: null, status: "online" },
  { name: "Maria", role: null, status: "away" },
  { name: "João", role: null, status: "online" },
];

// ============================================
// COMPACT COMPONENTS
// ============================================

// Tiny Avatar
const Avatar = ({ size = "sm", name, status }) => {
  const sizes = { xs: "w-6 h-6 text-[10px]", sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm" };
  const colors = ["from-blue-400 to-blue-600", "from-green-400 to-green-600", "from-purple-400 to-purple-600", "from-amber-400 to-amber-600", "from-rose-400 to-rose-600"];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  
  return (
    <div className="relative">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${colors[colorIndex]} flex items-center justify-center text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_3px_rgba(0,0,0,0.2)] border border-white/20`}>
        {name?.charAt(0).toUpperCase() || "?"}
      </div>
      {status && (
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
          status === "online" ? "bg-green-500" : status === "away" ? "bg-amber-500" : "bg-gray-400"
        }`} />
      )}
    </div>
  );
};

// Compact Button
const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-b from-[#4da4ff] via-[#0071e3] to-[#005bb5] text-white border-[#004488] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_3px_rgba(0,0,0,0.2)] hover:from-[#5cb0ff] hover:to-[#0066cc] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]",
    secondary: "bg-gradient-to-b from-[#f8f8f8] to-[#e8e8e8] text-[#333] border-[#c0c0c0] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_3px_rgba(0,0,0,0.1)] hover:from-white hover:to-[#f0f0f0] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)]",
    ghost: "bg-transparent text-[#666] hover:bg-black/5 active:bg-black/10",
    danger: "bg-gradient-to-b from-[#ff6b6b] to-[#dc2626] text-white border-[#b91c1c] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_3px_rgba(0,0,0,0.2)]",
  };
  const sizes = {
    sm: "px-2 py-1 text-xs rounded-md",
    md: "px-3 py-1.5 text-sm rounded-lg",
    lg: "px-4 py-2 text-sm rounded-lg",
    icon: "p-1.5 rounded-lg",
  };
  
  return (
    <button className={`font-medium border transition-all duration-100 flex items-center justify-center gap-1.5 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// Compact Input
const Input = ({ className = "", ...props }) => (
  <input 
    className={`px-3 py-1.5 text-sm rounded-lg bg-[#f5f5f5] border border-[#d0d0d0] border-t-[#c0c0c0] shadow-[inset_0_1px_3px_rgba(0,0,0,0.1)] placeholder-[#999] focus:outline-none focus:border-[#0071e3] focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.08),0_0_0_2px_rgba(0,113,227,0.2)] transition-all ${className}`}
    {...props}
  />
);

// Role Badge
const RoleBadge = ({ role }) => {
  if (!role) return null;
  const styles = {
    "Dono": "bg-gradient-to-b from-amber-100 to-amber-200 text-amber-800 border-amber-300",
    "Mod": "bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 border-blue-300",
  };
  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] ${styles[role]}`}>
      {role === "Dono" ? "DONO" : "MOD"}
    </span>
  );
};

// ============================================
// SIDEBAR COMPONENT
// ============================================
const Sidebar = ({ selectedRoom, setSelectedRoom, isOpen, setIsOpen }) => {
  const [search, setSearch] = useState("");
  
  const pinnedRooms = mockRooms.filter(r => r.pinned);
  const otherRooms = mockRooms.filter(r => !r.pinned);
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}
      
      <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-[280px] bg-gradient-to-b from-[#f8f9fa] to-[#eef1f5] border-r border-[#d5d5d7] flex flex-col transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Header */}
        <div className="p-3 border-b border-[#d5d5d7] bg-gradient-to-b from-white to-[#f5f5f7]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-lg text-[#1d1d1f]">WebChat</h1>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="text-[#666]">
                <FaBell size={14} />
              </Button>
              <Button variant="ghost" size="icon" className="text-[#666]">
                <FaCog size={14} />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#999]" size={12} />
            <Input 
              placeholder="Buscar salas..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 py-1.5"
            />
          </div>
        </div>
        
        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {/* Pinned */}
          <div className="p-2">
            <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-[#888] uppercase tracking-wider">
              <FaThumbtack size={9} />
              Fixadas
            </div>
            {pinnedRooms.map(room => (
              <RoomItem key={room.id} room={room} selected={selectedRoom === room.id} onClick={() => { setSelectedRoom(room.id); setIsOpen(false); }} />
            ))}
          </div>
          
          {/* Other Rooms */}
          <div className="p-2 pt-0">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[10px] font-bold text-[#888] uppercase tracking-wider">Salas</span>
              <Button variant="ghost" size="sm" className="text-[10px] text-[#0071e3] px-1.5 py-0.5">
                <FaPlus size={8} /> Nova
              </Button>
            </div>
            {otherRooms.map(room => (
              <RoomItem key={room.id} room={room} selected={selectedRoom === room.id} onClick={() => { setSelectedRoom(room.id); setIsOpen(false); }} />
            ))}
          </div>
        </div>
        
        {/* User Footer */}
        <div className="p-3 border-t border-[#d5d5d7] bg-gradient-to-b from-[#f5f5f7] to-[#ebebed]">
          <div className="flex items-center gap-2.5">
            <Avatar size="md" name={mockUser.name} status={mockUser.status} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#1d1d1f] truncate">{mockUser.name}</div>
              <div className="text-[10px] text-green-600 font-medium uppercase">Online</div>
            </div>
            <Button variant="ghost" size="icon" className="text-[#888]">
              <FaChevronDown size={12} />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Room Item
const RoomItem = ({ room, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-all text-left ${
      selected 
        ? 'bg-gradient-to-r from-[#0071e3]/10 to-transparent border-l-2 border-[#0071e3]' 
        : 'hover:bg-black/5'
    }`}
  >
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.15)] ${
      selected 
        ? 'bg-gradient-to-br from-[#4da4ff] to-[#0071e3] text-white border border-[#005bb5]' 
        : 'bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0] text-[#666] border border-[#ccc]'
    }`}>
      <FaHashtag size={14} />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className={`text-sm truncate ${selected ? 'font-semibold text-[#1d1d1f]' : 'font-medium text-[#333]'}`}>
          {room.name}
        </span>
        <span className="text-[10px] text-[#999]">{room.time}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#888] truncate pr-2">{room.lastMessage}</span>
        {room.unread > 0 && (
          <span className="bg-gradient-to-b from-[#ff6b6b] to-[#dc2626] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]">
            {room.unread}
          </span>
        )}
      </div>
    </div>
  </button>
);

// ============================================
// CHAT AREA COMPONENT
// ============================================
const ChatArea = ({ setIsSidebarOpen }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const currentRoom = mockRooms.find(r => r.id === 1);
  
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-[#f8fafc] to-[#f0f2f5]">
      {/* Chat Header */}
      <header className="h-14 px-3 flex items-center justify-between bg-gradient-to-b from-white to-[#f5f5f7] border-b border-[#d5d5d7] shrink-0">
        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
            <FaBars size={16} />
          </Button>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4da4ff] to-[#0071e3] text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.15)] border border-[#005bb5]">
            <FaHashtag size={14} />
          </div>
          <div>
            <h2 className="font-semibold text-[#1d1d1f] text-sm">{currentRoom?.name || "Geral"}</h2>
            <div className="flex items-center gap-1 text-[10px] text-[#888]">
              <FaCircle className="text-green-500" size={6} />
              <span>{currentRoom?.online || 145} online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-[#888]">
            <FaStar size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="text-[#888]">
            <FaSearch size={14} />
          </Button>
          <Button variant="danger" size="sm" className="ml-1">
            <FaSignOutAlt size={12} /> Sair
          </Button>
        </div>
      </header>
      
      {/* Pinned Message */}
      <div className="px-3 py-2 bg-gradient-to-r from-amber-50 to-amber-100/50 border-b border-amber-200/50 flex items-center gap-2">
        <FaThumbtack className="text-amber-600 shrink-0" size={10} />
        <p className="text-xs text-amber-800 truncate">
          <span className="font-semibold">Fixada:</span> Bem-vindos! Lembrem-se de manter o respeito e ler as regras.
        </p>
        <Button variant="ghost" size="icon" className="ml-auto text-amber-600 p-1">
          <FaTimes size={10} />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {mockMessages.map((msg, index) => (
          <MessageBubble key={msg.id} message={msg} prevMessage={mockMessages[index - 1]} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-2 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] border-t border-[#d5d5d7]">
        <div className="flex items-end gap-2">
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-[#888]">
              <FaPaperclip size={14} />
            </Button>
            <Button variant="ghost" size="icon" className="text-[#888]">
              <FaImage size={14} />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full pr-10 py-2"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#666] transition-colors">
              <FaSmile size={16} />
            </button>
          </div>
          
          <Button variant={message ? "primary" : "secondary"} size="icon" className="shrink-0 w-9 h-9">
            {message ? <FaPaperPlane size={14} /> : <FaMicrophone size={14} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Message Bubble - Grouped style
const MessageBubble = ({ message, prevMessage }) => {
  const showHeader = message.isFirst || prevMessage?.sender !== message.sender;
  const isConsecutive = !showHeader;
  
  if (message.isMe) {
    return (
      <div className={`flex justify-end ${isConsecutive ? 'mt-0.5' : 'mt-3'}`}>
        <div className="max-w-[75%] flex flex-col items-end">
          <div className={`px-3 py-1.5 bg-gradient-to-b from-[#3399ff] to-[#0071e3] text-white border border-[#005bb5] shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.1)] ${
            showHeader ? 'rounded-2xl rounded-br-md' : 'rounded-2xl rounded-r-md'
          }`}>
            <p className="text-[13px] leading-relaxed">{message.text}</p>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 mr-1">
            <span className="text-[10px] text-[#999]">{message.time}</span>
            {message.status === "read" ? (
              <FaCheckDouble className="text-[#0071e3]" size={10} />
            ) : (
              <FaCheck className="text-[#999]" size={10} />
            )}
            {message.likes > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-rose-500">
                <FaHeart size={8} /> {message.likes}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-end gap-2 ${isConsecutive ? 'mt-0.5' : 'mt-3'}`}>
      <div className="w-8 shrink-0">
        {showHeader && <Avatar size="sm" name={message.sender} />}
      </div>
      <div className="max-w-[75%]">
        {showHeader && (
          <div className="flex items-center gap-1.5 mb-0.5 ml-1">
            <span className="text-xs font-semibold text-[#1d1d1f]">{message.sender}</span>
            <RoleBadge role={message.role} />
          </div>
        )}
        <div className={`px-3 py-1.5 bg-gradient-to-b from-white to-[#f5f5f5] border border-[#ddd] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.08)] ${
          showHeader ? 'rounded-2xl rounded-bl-md' : 'rounded-2xl rounded-l-md'
        }`}>
          <p className="text-[13px] text-[#1d1d1f] leading-relaxed">{message.text}</p>
        </div>
        <div className="flex items-center gap-2 mt-0.5 ml-1">
          <span className="text-[10px] text-[#999]">{message.time}</span>
          {message.likes > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-rose-500">
              <FaHeart size={8} /> {message.likes}
            </span>
          )}
          <button className="text-[#bbb] hover:text-[#888] transition-colors">
            <FaRegHeart size={10} />
          </button>
          <button className="text-[#bbb] hover:text-[#888] transition-colors">
            <FaReply size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ONLINE USERS PANEL
// ============================================
const OnlinePanel = ({ isOpen, setIsOpen }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 xl:hidden" onClick={() => setIsOpen(false)} />
      )}
      
      <aside className={`fixed xl:relative inset-y-0 right-0 z-50 w-[200px] bg-gradient-to-b from-[#f8f9fa] to-[#eef1f5] border-l border-[#d5d5d7] flex flex-col transition-transform duration-300 xl:translate-x-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-3 border-b border-[#d5d5d7]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#888] uppercase tracking-wider">Online - {onlineUsers.length}</h3>
            <Button variant="ghost" size="icon" className="xl:hidden" onClick={() => setIsOpen(false)}>
              <FaTimes size={12} />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {onlineUsers.map((user, i) => (
            <div key={i} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-black/5 transition-colors cursor-pointer">
              <Avatar size="xs" name={user.name} status={user.status} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium text-[#333] truncate">{user.name}</span>
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

// ============================================
// SETTINGS MODAL
// ============================================
const SettingsModal = ({ isOpen, setIsOpen }) => {
  const [theme, setTheme] = useState('skeuo');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="bg-gradient-to-b from-white to-[#f8f8f8] border border-[#d0d0d0] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] p-5 w-full max-w-[380px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1d1d1f]">Configuracoes</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <FaTimes size={14} />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#f5f5f7] p-3 rounded-lg border border-[#e0e0e0]">
            <label className="block text-[10px] font-bold text-[#888] uppercase tracking-wider mb-2">Aparencia</label>
            <div className="space-y-2">
              {[
                { value: 'skeuo', label: 'Visual Classico', desc: 'Botoes com profundidade e sombras' },
                { value: 'glass', label: 'Visual Translucido', desc: 'Limpo e com desfoque' }
              ].map((opt) => (
                <label key={opt.value} className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer transition-all ${theme === opt.value ? 'bg-white border-[#0071e3] shadow-[0_0_0_2px_rgba(0,113,227,0.1)]' : 'bg-white border-[#ddd] hover:border-[#bbb]'}`}>
                  <input type="radio" checked={theme === opt.value} onChange={() => setTheme(opt.value)} className="mt-0.5 accent-[#0071e3]" />
                  <div>
                    <div className="text-sm font-medium text-[#1d1d1f]">{opt.label}</div>
                    <div className="text-[11px] text-[#888]">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <Button variant="primary" className="w-full mt-4" onClick={() => setIsOpen(false)}>
          Salvar
        </Button>
      </div>
    </div>
  );
};

// ============================================
// MAIN LAYOUT
// ============================================
const LayoutDemo1 = () => {
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnlineOpen, setIsOnlineOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  return (
    <div className="h-screen flex bg-[#e8ecf0] overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        selectedRoom={selectedRoom} 
        setSelectedRoom={setSelectedRoom}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      {/* Main Chat */}
      <ChatArea setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Online Users (hidden on smaller screens) */}
      <OnlinePanel isOpen={isOnlineOpen} setIsOpen={setIsOnlineOpen} />
      
      {/* Settings Modal */}
      <SettingsModal isOpen={isSettingsOpen} setIsOpen={setIsSettingsOpen} />
      
      {/* Mobile FAB for online users */}
      <button 
        onClick={() => setIsOnlineOpen(true)}
        className="fixed bottom-20 right-4 xl:hidden w-12 h-12 rounded-full bg-gradient-to-b from-[#4da4ff] to-[#0071e3] text-white shadow-lg flex items-center justify-center border border-[#005bb5]"
      >
        <FaUserCircle size={20} />
      </button>
    </div>
  );
};

export default LayoutDemo1;
