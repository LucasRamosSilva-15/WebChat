import { useState } from 'react';
import { FaSearch, FaSlidersH, FaCommentAlt, FaUsers, FaExclamationTriangle, FaPlus, FaHashtag, FaStar, FaPaperPlane, FaCamera, FaSmile, FaThumbtack, FaSignOutAlt, FaHeart, FaRegHeart, FaTimes, FaCog, FaHome, FaDoorOpen, FaUser } from 'react-icons/fa';

// ============================================
// MOCK DATA
// ============================================
const mockUser = {
  name: "Lucas Ramos",
  status: "ONLINE",
  avatar: null,
  description: "Desenvolvedor Full Stack"
};

const mockRooms = [
  { title: "Geral", description: "Um espaço para discussões amplas e variadas.", roomParam: "general", category: "Casual", status: "Ativa", members: 145, date: "12 Jan, 2024" },
  { title: "Tecnologia", description: "Discuta as últimas inovações e tendências.", roomParam: "tech", category: "Tecnologia", status: "Ativa", members: 89, date: "05 Fev, 2024" },
  { title: "Games", description: "O ponto de encontro para jogadores.", roomParam: "gaming", category: "Jogos", status: "Ativa", members: 200, date: "18 Fev, 2024" },
  { title: "Clube da Música", description: "Discussões sobre música e áudio.", roomParam: "cm", category: "Arte", status: "Arquivada", members: 0, date: "10 Mar, 2024" },
];

const mockMessages = [
  { id: 1, text: "E aí pessoal! Alguém viu o novo lançamento?", sender: "Carlos", isMe: false, time: "14:32", role: "Dono", avatar: null, likes: ["user1", "user2"], isFavorite: false },
  { id: 2, text: "Sim! Está incrível, recomendo demais!", sender: "Lucas Ramos", isMe: true, time: "14:33", role: null, avatar: null, likes: ["user3"], isFavorite: true, isEdited: false, readBy: ["Carlos", "Ana"] },
  { id: 3, text: "Vou dar uma olhada agora mesmo. Obrigado pela dica!", sender: "Ana", isMe: false, time: "14:35", role: "Moderador", avatar: null, likes: [], isFavorite: false },
  { id: 4, text: "Sem problemas! Qualquer dúvida é só chamar.", sender: "Lucas Ramos", isMe: true, time: "14:36", role: null, avatar: null, likes: [], isFavorite: false, isEdited: true, readBy: [] },
];

// ============================================
// COMPONENTS
// ============================================

// Avatar Component
const Avatar = ({ size = "md", src }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };
  
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border border-[#b3b3b3] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.8)] flex items-center justify-center overflow-hidden`}>
      {src ? (
        <img src={src} alt="Avatar" className="w-full h-full object-cover" />
      ) : (
        <svg className="w-1/2 h-1/2 text-[#86868b]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      )}
    </div>
  );
};

// Skeuomorphic Button
const SkeuoButton = ({ children, variant = "primary", className = "", ...props }) => {
  const variants = {
    primary: "bg-gradient-to-b from-[#4da4ff] via-[#0071e3] to-[#004488] border-[#004488] text-white text-shadow-[0_-1px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] hover:from-[#66b3ff] hover:via-[#1a82ff] hover:to-[#0055a3] active:from-[#004488] active:to-[#005bb5] active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]",
    secondary: "bg-gradient-to-b from-white via-[#e6e6e6] to-[#b3b3b3] border-[#999] text-[#333] text-shadow-[0_1px_0_rgba(255,255,255,0.8)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.2)] hover:from-white hover:via-[#f2f2f2] hover:to-[#cccccc] active:from-[#cccccc] active:to-[#b3b3b3] active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.4)]",
    danger: "bg-gradient-to-b from-[#ff6b6b] via-[#ef4444] to-[#b91c1c] border-[#991b1b] text-white text-shadow-[0_-1px_0_rgba(0,0,0,0.3)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] hover:from-[#ff8080] hover:via-[#f87171] hover:to-[#dc2626] active:from-[#b91c1c] active:to-[#991b1b] active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)]",
  };

  return (
    <button 
      className={`px-4 py-2 rounded-full border font-medium transition-all duration-100 cursor-pointer flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Skeuomorphic Input
const SkeuoInput = ({ className = "", ...props }) => (
  <input 
    className={`px-4 py-2.5 rounded-[22px] bg-[#fafafa] border border-[#b3b3b3] border-t-[#999] shadow-[inset_0_2px_5px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] text-[#1d1d1f] placeholder-[#86868b] focus:outline-none focus:border-[#0071e3] focus:shadow-[inset_0_2px_5px_rgba(0,0,0,0.1),0_0_8px_rgba(0,113,227,0.6)] focus:bg-white transition-all ${className}`}
    {...props}
  />
);

// Skeuomorphic Panel
const SkeuoPanel = ({ children, className = "" }) => (
  <div className={`bg-gradient-to-b from-white to-[#f8fafc] border border-white/80 rounded-[22px] shadow-[0_4px_15px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_2px_rgba(0,0,0,0.03)] ${className}`}>
    {children}
  </div>
);

// Status Badge
const StatusBadge = ({ status }) => {
  if (status === "Arquivada") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 text-gray-600 text-[13px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)]">
        <span className="w-2 h-2 rounded-full bg-gray-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
        Arquivada
      </span>
    );
  }
  if (status === "Cheia") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-b from-red-100 to-red-200 border border-red-300 text-red-700 text-[13px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)]">
        <span className="w-2 h-2 rounded-full bg-red-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
        Cheia
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-b from-green-100 to-green-200 border border-green-300 text-green-700 text-[13px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)]">
      <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5),inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
      Ativa
    </span>
  );
};

// Role Badge
const RoleBadge = ({ role }) => {
  if (role === "Dono") {
    return (
      <span className="bg-gradient-to-b from-amber-100 to-amber-200 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wider border border-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.1)]">
        DONO
      </span>
    );
  }
  if (role === "Moderador") {
    return (
      <span className="bg-gradient-to-b from-blue-100 to-blue-200 text-blue-800 text-[9px] font-bold px-1.5 py-0.5 rounded-[4px] tracking-wider border border-blue-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.1)]">
        MOD
      </span>
    );
  }
  return null;
};

// Stat Card
const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
  <SkeuoPanel className="p-6 flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-300">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-[13px] font-semibold text-[#86868b] uppercase tracking-widest text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">{title}</h3>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.8)] ${colorClass}`}>
        <Icon />
      </div>
    </div>
    <div>
      <div className="text-[32px] font-bold text-[#1d1d1f] mb-1 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">{value}</div>
      <div className="text-[14px] text-[#424245] flex items-center gap-1">{subtext}</div>
    </div>
  </SkeuoPanel>
);

// ============================================
// SECTION COMPONENTS
// ============================================

// 1. Navbar Section
const NavbarSection = ({ setCurrentSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <section className="mb-12">
      <h2 className="text-[20px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">1. Navbar Fixa</h2>
      
      <header className="bg-gradient-to-b from-white to-[#eef1f5] border-b border-[#d2d2d7] shadow-[0_2px_10px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] rounded-t-[16px] sticky top-0 z-50 w-full h-[56px] flex items-center justify-center">
        <nav className="max-w-[980px] w-full flex justify-between items-center px-4 relative">
          <span className="font-bold tracking-tight text-[18px] text-[#1d1d1f] text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">WebChat</span>

          <div className="flex items-center gap-4">
            {/* Menu Button */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-b from-white to-[#e6e6e6] border border-[#b3b3b3] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-pointer hover:from-[#f5f5f5] hover:to-[#d9d9d9] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-all"
                aria-label="Abrir Menu"
              >
                <div className="flex flex-col gap-1">
                  <div className="w-4 h-[2px] bg-[#666] rounded-full"></div>
                  <div className="w-4 h-[2px] bg-[#666] rounded-full"></div>
                  <div className="w-4 h-[2px] bg-[#666] rounded-full"></div>
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute right-0 top-[48px] w-52 bg-gradient-to-b from-white to-[#f8fafc] border border-[#d2d2d7] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden transition-all duration-300 origin-top-right ${isMenuOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                <div className="flex flex-col py-2">
                  {[
                    { icon: FaHome, label: "Início", section: "navbar" },
                    { icon: FaDoorOpen, label: "Salas", section: "rooms" },
                    { icon: FaUser, label: "Perfil", section: "profile" },
                    { icon: FaCog, label: "Configurações", section: "settings" },
                  ].map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => {
                        setCurrentSection(item.section);
                        setIsMenuOpen(false);
                      }}
                      className={`px-5 py-3 text-[15px] font-medium text-[#1d1d1f] hover:bg-gradient-to-r hover:from-[#e8f4ff] hover:to-transparent transition-colors flex items-center gap-3 ${i > 0 ? 'border-t border-[#e5e5e5]' : ''}`}
                    >
                      <item.icon className="text-[#86868b]" size={16} />
                      {item.label}
                    </button>
                  ))}
                  <div className="border-t border-[#e5e5e5]"></div>
                  <button className="px-5 py-3 text-[15px] font-medium text-[#ff3b30] hover:bg-gradient-to-r hover:from-[#fee2e2] hover:to-transparent transition-colors flex items-center gap-3">
                    <FaSignOutAlt size={16} />
                    Sair
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Area */}
            <div className="relative">
              <div 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
              >
                <Avatar size="sm" src={mockUser.avatar} />
                <div className="flex flex-col items-start">
                  <span className="text-[13px] font-semibold text-[#1d1d1f] leading-none">{mockUser.name}</span>
                  <span className="text-[10px] text-green-600 uppercase tracking-widest mt-[2px] font-bold">{mockUser.status}</span>
                </div>
              </div>
              
              {/* Profile Dropdown */}
              <div className={`absolute right-0 top-[48px] w-[260px] bg-gradient-to-b from-white to-[#f8fafc] border border-[#d2d2d7] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,1)] overflow-hidden transition-all duration-300 origin-top-right ${isProfileOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                <div className="flex flex-col text-center p-5 items-center">
                  <Avatar size="lg" src={mockUser.avatar} />
                  <h3 className="text-[18px] font-semibold text-[#1d1d1f] mt-3 mb-1">{mockUser.name}</h3>
                  <p className="text-[13px] text-[#86868b]">{mockUser.description}</p>
                </div>
                <div className="p-3 bg-gradient-to-b from-[#f0f0f0] to-[#e5e5e5] border-t border-[#d2d2d7]">
                  <SkeuoButton variant="secondary" className="w-full py-2 text-[13px]">
                    Editar Perfil
                  </SkeuoButton>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </section>
  );
};

// 2. Rooms Section
const RoomsSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [favorites, setFavorites] = useState(['general']);

  const toggleFavorite = (roomParam) => {
    setFavorites(prev => 
      prev.includes(roomParam) 
        ? prev.filter(r => r !== roomParam) 
        : [...prev, roomParam]
    );
  };

  return (
    <section className="mb-12">
      <h2 className="text-[20px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">2. Tela de Salas</h2>
      
      <div className="space-y-6">
        {/* Header */}
        <SkeuoPanel className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="p-6">
            <h1 className="text-[28px] md:text-[32px] font-semibold text-[#1d1d1f] text-shadow-[0_2px_0_rgba(255,255,255,0.8)]">Gerenciamento de Salas</h1>
            <p className="text-[16px] text-[#86868b] mt-1">Administre salas, moderadores e atividades da comunidade.</p>
          </div>
          <div className="flex items-center gap-3 p-6 pt-0 md:pt-6">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868b]" size={16} />
              <SkeuoInput
                type="text"
                placeholder="Buscar salas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-[200px] pl-10 pr-4"
              />
            </div>
            <div className="relative">
              <FaSlidersH className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0071e3]" size={16} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2.5 pl-10 pr-8 rounded-[22px] bg-[#fafafa] border border-[#b3b3b3] border-t-[#999] shadow-[inset_0_2px_5px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.8)] text-[#1d1d1f] focus:outline-none focus:border-[#0071e3] appearance-none cursor-pointer"
              >
                <option value="Todas">Todas</option>
                <option value="Casual">Casual</option>
                <option value="Tecnologia">Tecnologia</option>
                <option value="Jogos">Jogos</option>
                <option value="Arte">Arte</option>
              </select>
            </div>
          </div>
        </SkeuoPanel>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Salas Ativas"
            value="6"
            subtext={<><span className="text-green-600 font-medium">+2</span> esta semana</>}
            icon={FaCommentAlt}
            colorClass="bg-gradient-to-b from-[#e6f0ff] to-[#cce0ff] text-[#0071e3]"
          />
          <StatCard
            title="Usuários Online"
            value="234"
            subtext={<><span className="text-green-600 font-medium">Tempo real</span></>}
            icon={FaUsers}
            colorClass="bg-gradient-to-b from-green-100 to-green-200 text-green-600"
          />
          <StatCard
            title="Reportes Pendentes"
            value="7"
            subtext={<><span className="text-[#86868b]">Requer atenção</span></>}
            icon={FaExclamationTriangle}
            colorClass="bg-gradient-to-b from-red-100 to-red-200 text-red-500"
          />
        </div>

        {/* Rooms Table */}
        <SkeuoPanel className="p-0 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center border-b border-[#d2d2d7]/50 gap-4">
            <h2 className="text-[22px] font-semibold text-[#1d1d1f] text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">Diretório de Salas</h2>
            <SkeuoButton variant="primary" className="px-6 py-2.5 text-[15px]">
              <FaPlus size={14} />
              Criar Sala
            </SkeuoButton>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] border-b border-[#d2d2d7]/50">
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Nome da Sala</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Membros</th>
                  <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockRooms.map((room, i) => (
                  <tr key={i} className="border-b border-[#d2d2d7]/30 hover:bg-gradient-to-r hover:from-[#f8fafc] hover:to-transparent transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#4da4ff] to-[#0071e3] text-white flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.2)] border border-[#005bb5]">
                          <FaHashtag size={18} />
                        </div>
                        <div>
                          <div className="font-semibold text-[#1d1d1f] text-[16px]">{room.title}</div>
                          <div className="text-[#86868b] text-[13px]">Criada em {room.date}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[15px] text-[#424245]">{room.category}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={room.members >= 200 ? "Cheia" : room.status} />
                    </td>
                    <td className="px-6 py-4 text-[15px] font-medium text-[#1d1d1f]">{room.members} / 200</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => toggleFavorite(room.roomParam)}
                          className={`p-2 rounded-full transition-all ${favorites.includes(room.roomParam) ? 'bg-gradient-to-b from-amber-100 to-amber-200 text-amber-600 border border-amber-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]' : 'bg-gradient-to-b from-gray-100 to-gray-200 text-[#86868b] border border-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] hover:from-amber-50 hover:to-amber-100'}`}
                        >
                          <FaStar size={14} />
                        </button>
                        {room.status !== "Arquivada" && room.members < 200 && (
                          <SkeuoButton variant="secondary" className="px-4 py-1.5 text-[13px]">
                            Entrar
                          </SkeuoButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SkeuoPanel>
      </div>
    </section>
  );
};

// 3. Chat Section
const ChatSection = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const toggleLike = (id) => {
    setMessages(prev => prev.map(m => {
      if (m.id === id) {
        const hasLiked = m.likes.includes('currentUser');
        return {
          ...m,
          likes: hasLiked 
            ? m.likes.filter(l => l !== 'currentUser')
            : [...m.likes, 'currentUser']
        };
      }
      return m;
    }));
  };

  return (
    <section className="mb-12">
      <h2 className="text-[20px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">3. Tela de Chat</h2>
      
      <SkeuoPanel className="overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 bg-gradient-to-b from-white to-[#f5f5f7] border-b border-[#d2d2d7] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#4da4ff] to-[#0071e3] text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.2)] border border-[#005bb5]">
              <FaHashtag size={18} />
            </div>
            <div>
              <h3 className="font-bold text-[18px] text-[#1d1d1f] text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">GENERAL</h3>
              <span className="text-[12px] text-green-600 font-medium">145 online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SkeuoButton variant="secondary" className="p-2">
              <FaStar size={16} className="text-[#86868b]" />
            </SkeuoButton>
            <SkeuoButton variant="danger" className="px-4 py-2 text-[14px]">
              <FaSignOutAlt size={14} />
              Sair
            </SkeuoButton>
          </div>
        </div>

        {/* Pinned Message */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-200 to-amber-300 flex items-center justify-center text-amber-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.1)] border border-amber-300">
            <FaThumbtack size={14} />
          </div>
          <div className="flex-1">
            <span className="text-[13px] font-semibold text-amber-800 text-shadow-[0_1px_0_rgba(255,255,255,0.5)]">Mensagem Fixada</span>
            <p className="text-[14px] text-amber-700">Bem-vindos! Lembrem-se de manter o respeito e ler as regras da sala.</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="p-4 space-y-4 h-[400px] overflow-y-auto bg-gradient-to-b from-[#f8fafc] to-[#f0f2f5] chat-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
              {!msg.isMe && <Avatar size="sm" src={msg.avatar} />}
              
              <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {!msg.isMe && (
                  <div className="flex items-center gap-2 mb-1 ml-1">
                    <RoleBadge role={msg.role} />
                    <span className="text-[12px] text-[#86868b] font-medium">{msg.sender}</span>
                  </div>
                )}
                
                <div className={`px-4 py-2.5 rounded-[18px] ${
                  msg.isMe 
                    ? 'bg-gradient-to-b from-[#3399ff] to-[#0071e3] text-white border border-[#005bb5] rounded-br-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.15)]' 
                    : 'bg-gradient-to-b from-[#f9f9f9] to-[#ebebeb] text-[#1d1d1f] border border-[#ccc] rounded-bl-[4px] shadow-[inset_0_1px_0_rgba(255,255,255,1),0_2px_4px_rgba(0,0,0,0.1)]'
                }`}>
                  <p className="text-[15px] leading-relaxed">{msg.text}</p>
                </div>
                
                <div className={`flex items-center gap-2 mt-1 ${msg.isMe ? 'mr-1' : 'ml-1'}`}>
                  {msg.isMe && msg.role && <RoleBadge role={msg.role} />}
                  <span className="text-[11px] text-[#86868b]">
                    {msg.time} {msg.isEdited && "(editada)"}
                  </span>
                  {msg.isMe && (
                    <span className="text-[11px] text-[#86868b]">• Enviado</span>
                  )}
                  {msg.readBy && msg.readBy.length > 0 && (
                    <span className="text-[11px] text-[#0071e3] font-medium">• Lido por {msg.readBy.length}</span>
                  )}
                  <button 
                    onClick={() => toggleLike(msg.id)}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full transition-all ${
                      msg.likes.includes('currentUser') 
                        ? 'bg-gradient-to-b from-red-100 to-red-200 text-red-500 border border-red-200' 
                        : 'hover:bg-gray-100 text-[#86868b]'
                    }`}
                  >
                    {msg.likes.includes('currentUser') ? <FaHeart size={10} /> : <FaRegHeart size={10} />}
                    {msg.likes.length > 0 && <span>{msg.likes.length}</span>}
                  </button>
                  {msg.isFavorite && <FaStar size={10} className="text-amber-500" />}
                </div>
              </div>
              
              {msg.isMe && <Avatar size="sm" src={msg.avatar} />}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] border-t border-[#d2d2d7]">
          <div className="flex items-center gap-3">
            <SkeuoButton variant="secondary" className="p-2.5">
              <FaCamera size={18} className="text-[#86868b]" />
            </SkeuoButton>
            <SkeuoButton variant="secondary" className="p-2.5">
              <FaSmile size={18} className="text-[#86868b]" />
            </SkeuoButton>
            <SkeuoInput
              type="text"
              placeholder="Mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
            />
            <SkeuoButton variant="primary" className="p-2.5">
              <FaPaperPlane size={18} />
            </SkeuoButton>
          </div>
        </div>
      </SkeuoPanel>
    </section>
  );
};

// 4. Profile Section
const ProfileSection = () => {
  const [name, setName] = useState(mockUser.name);
  const [status, setStatus] = useState(mockUser.description);

  return (
    <section className="mb-12">
      <h2 className="text-[20px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">4. Perfil</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Edit Profile Card */}
        <SkeuoPanel className="p-8">
          <h3 className="text-[24px] font-semibold text-[#1d1d1f] mb-6 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">Editar Perfil</h3>
          
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar size="xl" src={null} />
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gradient-to-b from-[#4da4ff] to-[#0071e3] text-white flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)] border border-[#005bb5] hover:from-[#66b3ff] hover:to-[#1a82ff] transition-all">
                <FaCamera size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-widest mb-2 ml-1">Nome de exibição</label>
              <SkeuoInput
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-[#86868b] uppercase tracking-widest mb-2 ml-1">Status / Recado</label>
              <SkeuoInput
                type="text"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <SkeuoButton variant="secondary" className="flex-1 py-3">
              Cancelar
            </SkeuoButton>
            <SkeuoButton variant="primary" className="flex-1 py-3">
              Salvar Alterações
            </SkeuoButton>
          </div>
        </SkeuoPanel>

        {/* Profile Preview Card */}
        <SkeuoPanel className="p-8">
          <h3 className="text-[24px] font-semibold text-[#1d1d1f] mb-6 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">Prévia do Perfil</h3>
          <p className="text-[14px] text-[#86868b] mb-6">Como outros usuários verão seu perfil</p>
          
          <div className="bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] rounded-[16px] p-6 border border-[#d2d2d7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4">
              <Avatar size="lg" src={null} />
              <div>
                <h4 className="text-[20px] font-semibold text-[#1d1d1f]">{name || "Seu Nome"}</h4>
                <p className="text-[14px] text-[#86868b]">{status || "Sem recado"}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
                  <span className="text-[12px] text-green-600 font-medium uppercase tracking-wide">Online</span>
                </div>
              </div>
            </div>
          </div>
        </SkeuoPanel>
      </div>
    </section>
  );
};

// 5. Settings Section
const SettingsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('skeuo');
  const [colorMode, setColorMode] = useState('light');
  const [bgColor, setBgColor] = useState('neutral');

  return (
    <section className="mb-12">
      <h2 className="text-[20px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">5. Configurações</h2>
      
      <button onClick={() => setIsOpen(true)} className="mb-4">
        <SkeuoButton variant="secondary">
          <FaCog size={16} />
          Abrir Configurações
        </SkeuoButton>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div 
            className="bg-gradient-to-b from-white to-[#f8fafc] border border-[#d2d2d7] rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,1)] p-8 max-w-[500px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[24px] font-semibold text-[#1d1d1f] text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">Configurações</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="w-8 h-8 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)] hover:from-gray-200 hover:to-gray-300 transition-all"
              >
                <FaTimes className="text-[#86868b]" size={14} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Appearance */}
              <div className="bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] p-4 rounded-[16px] border border-[#d2d2d7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Aparência do WebChat</label>
                <div className="space-y-3">
                  {[
                    { value: 'skeuo', label: 'Visual Clássico', desc: 'Visual premium, botões com profundidade e sombras.' },
                    { value: 'glass', label: 'Visual Translúcido', desc: 'Visual embaçado, limpo e com desfoque.' }
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${theme === option.value ? 'bg-white border-[#0071e3] shadow-[0_0_0_3px_rgba(0,113,227,0.1)]' : 'bg-white border-[#d2d2d7] hover:border-[#0071e3]'}`}>
                      <input 
                        type="radio" 
                        name="theme" 
                        checked={theme === option.value} 
                        onChange={() => setTheme(option.value)}
                        className="w-4 h-4 accent-[#0071e3]"
                      />
                      <div>
                        <span className="text-[14px] font-medium text-[#1d1d1f]">{option.label}</span>
                        <p className="text-[12px] text-[#86868b]">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Mode */}
              <div className="bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] p-4 rounded-[16px] border border-[#d2d2d7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Modo de Cor</label>
                <div className="space-y-3">
                  {[
                    { value: 'light', label: 'Modo Claro', desc: 'Cores claras, fundo branco clássico.' },
                    { value: 'dark', label: 'Modo Escuro', desc: 'Cores escuras para conforto visual noturno.' }
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${colorMode === option.value ? 'bg-white border-[#0071e3] shadow-[0_0_0_3px_rgba(0,113,227,0.1)]' : 'bg-white border-[#d2d2d7] hover:border-[#0071e3]'}`}>
                      <input 
                        type="radio" 
                        name="colorMode" 
                        checked={colorMode === option.value} 
                        onChange={() => setColorMode(option.value)}
                        className="w-4 h-4 accent-[#0071e3]"
                      />
                      <div>
                        <span className="text-[14px] font-medium text-[#1d1d1f]">{option.label}</span>
                        <p className="text-[12px] text-[#86868b]">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="bg-gradient-to-b from-[#f5f5f7] to-[#ebebed] p-4 rounded-[16px] border border-[#d2d2d7] shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
                <label className="block text-[11px] font-bold text-[#86868b] uppercase tracking-widest mb-3">Cor de Fundo</label>
                <div className="space-y-3">
                  {[
                    { value: 'neutral', label: 'Neutro / Ardósia', desc: 'Fundo cinza-azulado suave.' },
                    { value: 'classic_blue', label: 'Azul Clássico', desc: 'Fundo azul gradiente tradicional.' }
                  ].map((option) => (
                    <label key={option.value} className={`flex items-center gap-3 cursor-pointer p-3 rounded-[12px] border transition-all ${bgColor === option.value ? 'bg-white border-[#0071e3] shadow-[0_0_0_3px_rgba(0,113,227,0.1)]' : 'bg-white border-[#d2d2d7] hover:border-[#0071e3]'}`}>
                      <input 
                        type="radio" 
                        name="bgColor" 
                        checked={bgColor === option.value} 
                        onChange={() => setBgColor(option.value)}
                        className="w-4 h-4 accent-[#0071e3]"
                      />
                      <div>
                        <span className="text-[14px] font-medium text-[#1d1d1f]">{option.label}</span>
                        <p className="text-[12px] text-[#86868b]">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <SkeuoButton variant="primary" className="w-full py-3 text-[16px]" onClick={() => setIsOpen(false)}>
                Salvar e Fechar
              </SkeuoButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

// 6. About Section
const AboutSection = () => (
  <section className="mb-12">
    <h2 className="text-[20px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">6. Página Sobre</h2>
    
    <SkeuoPanel className="p-10 text-center mb-8">
      <h1 className="text-[48px] md:text-[56px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
        Sobre o WebChat
      </h1>
      <p className="text-[18px] md:text-[21px] text-[#86868b] max-w-[600px] mx-auto">
        Uma aplicação de chat simples, moderna e em tempo real.
      </p>
    </SkeuoPanel>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { title: "A Tecnologia", desc: "O WebChat foi construído com HTML, Tailwind CSS, Node.js, React.js, Express.js, PostgreSQL, e Socket.io, proporcionando uma experiência de chat em tempo real." },
        { title: "O Propósito", desc: "Este projeto tem como objetivo criar uma plataforma de chat moderna e eficiente, que ofereça uma experiência de usuário boa em tempo real." },
        { title: "A Equipe", desc: "Este projeto foi desenvolvido por: Lucas Ramos Silva, Wssihélio Vasconcelos, Ruan Victor e Gabriel Lobão." },
        { title: "A Hospedagem", desc: "O Backend está hospedado na Render e o Frontend está hospedado no Vercel." }
      ].map((card, i) => (
        <SkeuoPanel key={i} className="p-8">
          <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">{card.title}</h3>
          <p className="text-[16px] text-[#424245] leading-relaxed">{card.desc}</p>
        </SkeuoPanel>
      ))}
    </div>
  </section>
);

// ============================================
// MAIN LAYOUT DEMO PAGE
// ============================================
const LayoutDemo = () => {
  const [currentSection, setCurrentSection] = useState('all');

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#dbeafe] via-[#e8f0f8] to-[#f1f5f9] relative">
      {/* Subtle diagonal texture overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px)'
        }}
      />
      
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 md:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-[36px] md:text-[48px] font-bold text-[#1d1d1f] mb-4 text-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
            WebChat Layout Demo
          </h1>
          <p className="text-[18px] text-[#86868b] max-w-[600px] mx-auto mb-6">
            Proposta de layout com estética Web 2.0 / Skeuomorphism moderno
          </p>
          
          {/* Section Navigation */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'navbar', label: 'Navbar' },
              { id: 'rooms', label: 'Salas' },
              { id: 'chat', label: 'Chat' },
              { id: 'profile', label: 'Perfil' },
              { id: 'settings', label: 'Config' },
              { id: 'about', label: 'Sobre' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all ${
                  currentSection === item.id
                    ? 'bg-gradient-to-b from-[#4da4ff] to-[#0071e3] text-white border border-[#005bb5] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.2)]'
                    : 'bg-gradient-to-b from-white to-[#e6e6e6] text-[#333] border border-[#999] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.1)] hover:from-white hover:to-[#d9d9d9]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        {(currentSection === 'all' || currentSection === 'navbar') && <NavbarSection setCurrentSection={setCurrentSection} />}
        {(currentSection === 'all' || currentSection === 'rooms') && <RoomsSection />}
        {(currentSection === 'all' || currentSection === 'chat') && <ChatSection />}
        {(currentSection === 'all' || currentSection === 'profile') && <ProfileSection />}
        {(currentSection === 'all' || currentSection === 'settings') && <SettingsSection />}
        {(currentSection === 'all' || currentSection === 'about') && <AboutSection />}

        {/* Footer */}
        <footer className="text-center py-8 mt-8 border-t border-[#d2d2d7]/50">
          <p className="text-[14px] text-[#86868b]">
            WebChat Layout Demo - Estilo Web 2.0 Skeuomorphism
          </p>
        </footer>
      </div>
    </main>
  );
};

export default LayoutDemo;
