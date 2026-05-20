import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, Filter, MessageSquare, Users, AlertTriangle, Plus, Hash, Star } from 'lucide-react';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL);

const defaultRooms = [
    { title: "Geral", description: "Um espaço para discussões amplas e variadas.", roomParam: "general", category: "Casual", status: "Ativa", members: 245, date: "12 Jan, 2024" },
    { title: "Tecnologia", description: "Discuta as últimas inovações e tendências.", roomParam: "tech", category: "Tecnologia", status: "Ativa", members: 144, date: "05 Fev, 2024" },
    { title: "Games", description: "O ponto de encontro para jogadores de todas as plataformas.", roomParam: "gaming", category: "Jogos", status: "Ativa", members: 132, date: "18 Fev, 2024" },
    { title: "Clube da Música", description: "Discussões sobre música e áudio.", roomParam: "cm", category: "Arte", status: "Arquivada", members: 0, date: "10 Mar, 2024" },
    { title: "Dev Web", description: "Desenvolvimento Frontend e Backend.", roomParam: "web", category: "Tecnologia", status: "Ativa", members: 112, date: "22 Mar, 2024" },
    { title: "Computação Gráfica", description: "Discuta sobre computação gráfica e animação.", roomParam: "cg", category: "Tecnologia", status: "Ativa", members: 200, date: "22 Mar, 2024" }
];

const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <div className="skeuo-panel p-6 flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-[13px] font-semibold text-[#86868b] uppercase tracking-widest">{title}</h3>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <div>
            <div className="text-[32px] font-bold text-[#1d1d1f] mb-1">{value}</div>
            <div className="text-[14px] text-[#424245] flex items-center gap-1">{subtext}</div>
        </div>
    </div>
);

const RoomIconWithTooltip = ({ description }) => (
    <div className="relative group">
        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#0071e3] to-[#4da4ff] text-white flex items-center justify-center shrink-0 shadow-sm border border-[#005bb5] cursor-help transition-transform duration-200 group-hover:scale-105">
            <Hash size={20} />
        </div>

        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 flex items-center z-50 pointer-events-none opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out w-max max-w-[220px]">
            <div className="w-2.5 h-2.5 bg-[#ffffff] border-l border-t border-black/5 -rotate-45 -mr-1.5 z-10 shadow-[-2px_-2px_2px_rgba(0,0,0,0.02)]"></div>
            <div className="skeuo-panel px-3.5 py-2 text-[12px] leading-snug text-[#1d1d1f] font-medium text-left shadow-lg rounded-[12px] border border-black/5 max-w-[200px] break-words">
                {description || "Sem descrição disponível."}
            </div>
        </div>
    </div>
);

const CreateRoomModal = ({
    isOpen,
    onClose,
    newRoomTitle,
    setNewRoomTitle,
    newRoomCategory,
    setNewRoomCategory,
    newRoomDesc,
    setNewRoomDesc,
    onSubmit
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
        >
            <div
                className="skeuo-panel p-8 max-w-[450px] w-full relative"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-[24px] font-semibold mb-6">Criar Nova Sala</h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-widest ml-1">Nome da Sala</label>
                        <input
                            type="text"
                            required
                            value={newRoomTitle}
                            onChange={(e) => setNewRoomTitle(e.target.value)}
                            className="skeuo-input w-full px-4 py-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-widest ml-1">Categoria</label>
                        <select
                            value={newRoomCategory}
                            onChange={(e) => setNewRoomCategory(e.target.value)}
                            className="skeuo-input w-full px-4 py-3 bg-white"
                        >
                            <option>Casual</option>
                            <option>Tecnologia</option>
                            <option>Jogos</option>
                            <option>Arte</option>
                            <option>Estudos</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[12px] font-medium text-[#86868b] uppercase tracking-widest ml-1">Descrição</label>
                        <input
                            type="text"
                            value={newRoomDesc}
                            onChange={(e) => setNewRoomDesc(e.target.value)}
                            className="skeuo-input w-full px-4 py-3"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary-glossy w-full py-3"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="skeuo-btn w-full py-3 text-[16px]"
                        >
                            Criar Sala
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RoomRow = ({ room, isFavorite, onToggleFavorite }) => (
    <tr className="border-b border-[#d2d2d7]/30 hover:bg-black/[0.02] transition-colors">
        <td className="px-6 py-4">
            <div className="flex items-center gap-4">
                <RoomIconWithTooltip description={room.description} />
                <div>
                    <div className="font-semibold text-[#1d1d1f] text-[16px]">{room.title}</div>
                    <div className="text-[#86868b] text-[13px]">Criada em {room.date || "Recente"}</div>
                </div>
            </div>
        </td>

        <td className="px-6 py-4 text-[15px] text-[#424245]">
            {room.category || "Casual"}
        </td>

        <td className="px-6 py-4">
            {room.status === "Arquivada" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-[13px] font-medium shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Arquivada
                </span>
            ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.5)]"></span>
                    Ativa
                </span>
            )}
        </td>

        <td className="px-6 py-4 text-[15px] font-medium text-[#1d1d1f]">
            {room.members === 0 ? '--' : room.members}
        </td>

        <td className="px-6 py-4 flex gap-2 items-center">
            <button
                onClick={() => onToggleFavorite(room.roomParam)}
                className={`p-1.5 rounded-full transition-colors flex shrink-0 ${isFavorite ? 'text-[#f59e0b] hover:bg-[#f59e0b]/10' : 'text-[#86868b] hover:bg-black/5 hover:text-[#1d1d1f]'}`}
                title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            >
                <Star size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            {room.status !== "Arquivada" && (
                <Link to={`/chat?room=${room.roomParam}`} className="btn-secondary-glossy px-4 py-1.5 text-[13px]">
                    Entrar
                </Link>
            )}
        </td>
    </tr>
);

const Rooms = () => {
    const navigate = useNavigate();

    const [customRooms, setCustomRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [onlineUsers, setOnlineUsers] = useState("...");
    const [favorites, setFavorites] = useState([]);

    const [newRoomTitle, setNewRoomTitle] = useState('');
    const [newRoomDesc, setNewRoomDesc] = useState('');
    const [newRoomCategory, setNewRoomCategory] = useState('Casual');

    useEffect(() => {
        const savedRooms = localStorage.getItem('chat_customRooms');
        if (savedRooms) {
            try {
                setCustomRooms(JSON.parse(savedRooms));
            } catch (e) {
                console.error("Erro ao carregar salas customizadas");
            }
        }

        const savedFavorites = localStorage.getItem('chat_favorites');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (e) { }
        }

        socket.on('active_users_count', (count) => {
            setOnlineUsers(count);
        });

        return () => {
            socket.off('active_users_count');
        };
    }, []);

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (newRoomTitle.trim() === '') return;

        const roomParam = newRoomTitle.toLowerCase().replace(/\s+/g, '-');
        const newRoom = {
            title: newRoomTitle,
            description: newRoomDesc || "Sala personalizada.",
            roomParam: roomParam,
            category: newRoomCategory,
            status: "Ativa",
            members: 1,
            date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        const updatedRooms = [...customRooms, newRoom];
        setCustomRooms(updatedRooms);
        localStorage.setItem('chat_customRooms', JSON.stringify(updatedRooms));

        setIsModalOpen(false);
        setNewRoomTitle('');
        setNewRoomDesc('');

        navigate(`/chat?room=${roomParam}`);
    };

    const allRooms = [...defaultRooms, ...customRooms];
    const filteredRooms = allRooms.filter(room => {
        const matchesSearch = room.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'Todas' || room.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedRooms = [...filteredRooms].sort((a, b) => {
        const aFav = favorites.includes(a.roomParam);
        const bFav = favorites.includes(b.roomParam);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return 0;
    });

    const toggleFavorite = (roomParam) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(roomParam)
                ? prev.filter(r => r !== roomParam)
                : [...prev, roomParam];
            localStorage.setItem('chat_favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    return (
        <>
            <CreateRoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newRoomTitle={newRoomTitle}
                setNewRoomTitle={setNewRoomTitle}
                newRoomCategory={newRoomCategory}
                setNewRoomCategory={setNewRoomCategory}
                newRoomDesc={newRoomDesc}
                setNewRoomDesc={setNewRoomDesc}
                onSubmit={handleCreateRoom}
            />

            <main className="reveal max-w-[1200px] mx-auto p-4 md:p-8 w-full relative space-y-8">

                <div className="skeuo-panel flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                    <div className="p-6">
                        <h1 className="hero-title text-[28px] md:text-[32px] font-semibold">Gerenciamento de Salas</h1>
                        <p className="text-[16px] text-[#86868b] mt-1">Administre salas, moderadores e atividades da comunidade.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-full md:w-[280px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868b]" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar salas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="skeuo-input w-full pl-10 pr-4 py-2 text-[15px]"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="skeuo-input w-[200px] pl-10 pr-8 py-2 text-[15px] appearance-none cursor-pointer"
                            >
                                <option value="Todas">Todas as Categorias</option>
                                <option value="Casual">Casual</option>
                                <option value="Tecnologia">Tecnologia</option>
                                <option value="Jogos">Jogos</option>
                                <option value="Arte">Arte</option>
                                <option value="Estudos">Estudos</option>
                            </select>
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0071e3]" size={16} />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Salas Ativas"
                        value={filteredRooms.length}
                        subtext={<><span className="text-green-500 font-medium">↗ +{customRooms.length}</span> esta semana</>}
                        icon={MessageSquare}
                        colorClass="bg-[#e6f0ff] text-[#0071e3] shadow-inner"
                    />
                    <StatCard
                        title="Usuários Online"
                        value={onlineUsers}
                        subtext={<><span className="text-green-500 font-medium">↗ Atualizado em tempo real</span></>}
                        icon={Users}
                        colorClass="bg-green-100 text-green-600 shadow-inner"
                    />
                    <StatCard
                        title="Reportes Pendentes"
                        value="7"
                        subtext={<><span className="text-[#86868b]">Requer atenção</span></>}
                        icon={AlertTriangle}
                        colorClass="bg-red-100 text-red-500 shadow-inner"
                    />
                </div>

                <div className="skeuo-panel p-0 overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center border-b border-[#d2d2d7]/50 gap-4">
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f]">Diretório de Salas</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="skeuo-btn px-6 py-2.5 text-[15px] flex items-center gap-2"
                        >
                            <Plus size={18} />
                            Criar Sala
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/[0.02] border-b border-[#d2d2d7]/50">
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Nome da Sala</th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Categoria</th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Membros</th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRooms.map((room, i) => (
                                    <RoomRow
                                        key={i}
                                        room={room}
                                        isFavorite={favorites.includes(room.roomParam)}
                                        onToggleFavorite={toggleFavorite}
                                    />
                                ))}

                                {sortedRooms.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-[#86868b] text-[15px]">
                                            Nenhuma sala encontrada com o termo "{searchQuery}".
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 bg-black/[0.02] border-t border-[#d2d2d7]/50 flex items-center justify-between text-[14px] text-[#86868b]">
                        <div>Mostrando 1 a {filteredRooms.length} de {allRooms.length} salas</div>
                        <div className="flex gap-1">
                            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50" disabled>&lt;</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-[#0071e3] text-white font-medium shadow-sm">1</button>
                            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-50" disabled>&gt;</button>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

export default Rooms;
