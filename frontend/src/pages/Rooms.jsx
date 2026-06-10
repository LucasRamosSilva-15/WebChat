import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { FaSearch, FaSlidersH, FaCommentAlt, FaUsers, FaExclamationTriangle, FaPlus, FaHashtag, FaStar } from 'react-icons/fa';
import { apiRequest } from '../services/api';



const StatCard = ({ title, value, subtext, icon: Icon, colorClass }) => (
    <div className="skeuo-panel p-6 flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-300">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-[13px] font-semibold text-[#86868b] uppercase tracking-widest">{title}</h3>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[18px] drop-shadow-sm ${colorClass}`}>
                <Icon />
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
        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#4da4ff] to-[#0071e3] text-white flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.2)] border border-[#005bb5] cursor-help transition-transform duration-200 group-hover:scale-105">
            <FaHashtag size={18} />
        </div>

        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 flex items-center z-50 pointer-events-none opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out w-max max-w-[220px]">
            <div className="w-2.5 h-2.5 bg-white dark:bg-[#1e293b] border-l border-t border-black/5 -rotate-45 -mr-1.5 z-10 shadow-[-2px_-2px_2px_rgba(0,0,0,0.02)]"></div>
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
                            className="skeuo-input w-full px-4 py-3 bg-white dark:bg-[#1e293b]"
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

const RoomRow = ({ room, isFavorite, onToggleFavorite, onJoinRoom }) => (
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
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 border border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 text-[13px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                    Arquivada
                </span>
            ) : room.members >= 200 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-b from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-900/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 text-[13px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                    Cheia
                </span>
            ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-b from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-900/60 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-400 text-[13px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)]">
                    <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 shadow-[0_0_4px_rgba(34,197,94,0.5),inset_0_1px_2px_rgba(0,0,0,0.2)] dark:shadow-[0_0_4px_rgba(74,222,128,0.5),inset_0_1px_2px_rgba(0,0,0,0.2)]"></span>
                    Ativa
                </span>
            )}
        </td>

        <td className="px-6 py-4 text-[15px] font-medium text-[#1d1d1f] whitespace-nowrap">
            {room.members} / 200
        </td>

        <td className="px-6 py-4 flex gap-2 items-center">
            <button
                onClick={() => onToggleFavorite(room.roomParam)}
                className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-gradient-to-b from-amber-100 to-amber-200 dark:from-amber-700 dark:to-amber-800 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]' : 'bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 text-[#86868b] dark:text-[#94a3b8] border border-gray-300 dark:border-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:from-amber-50 hover:to-amber-100 dark:hover:from-amber-900/40 dark:hover:to-amber-900/60'}`}
                title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            >
                <FaStar size={14} />
            </button>
            {room.status !== "Arquivada" && (
                room.members >= 200 ? (
                    <span className="btn-secondary-glossy !text-[#ef4444] px-4 py-1.5 text-[13px] !cursor-not-allowed opacity-80">
                        Lotada
                    </span>
                ) : (
                    <button onClick={() => onJoinRoom(room.roomParam)} className="btn-secondary-glossy px-4 py-1.5 text-[13px]">
                        Entrar
                    </button>
                )
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
    const [favorites, setFavorites] = useState([]);
    const [stats, setStats] = useState({ active_rooms: 0, unique_users: 0, total_room_memberships: 0 });

    const [newRoomTitle, setNewRoomTitle] = useState('');
    const [newRoomDesc, setNewRoomDesc] = useState('');
    const [newRoomCategory, setNewRoomCategory] = useState('Casual');

    const handleJoinRoom = async (roomId) => {
        try {
            await apiRequest(`/rooms/${roomId}/join`, { method: 'POST' });
            navigate(`/chat?room=${roomId}`);
        } catch (error) {
            console.error("Erro ao entrar na sala:", error);
            alert("Não foi possível entrar na sala: " + (error.message || "Erro desconhecido"));
        }
    };

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const apiRooms = await apiRequest('/rooms');
                const mappedRooms = apiRooms.map(room => ({
                    id: room.id,
                    title: room.name,
                    description: room.description || "Sem descrição",
                    roomParam: room.id.toString(),
                    category: room.category || "Custom",
                    status: "Ativa",
                    members: room.members_count || 0,
                    date: new Date(room.created_at).toLocaleDateString('pt-BR')
                }));
                setCustomRooms(mappedRooms);
            } catch (error) {
                console.error("Erro ao carregar salas da API:", error);
                const savedRooms = localStorage.getItem('chat_customRooms');
                if (savedRooms) {
                    try {
                        setCustomRooms(JSON.parse(savedRooms));
                    } catch (e) {
                        console.error("Erro ao carregar salas customizadas");
                    }
                }
            }
        };
        fetchRooms();

        const fetchStats = async () => {
            try {
                const apiStats = await apiRequest('/stats');
                setStats(apiStats);
            } catch (err) {
                console.error("Erro ao carregar estatísticas:", err);
            }
        };
        fetchStats();

        const savedFavorites = localStorage.getItem('chat_favorites');
        if (savedFavorites) {
            try {
                setFavorites(JSON.parse(savedFavorites));
            } catch (e) { }
        }

    }, []);

    const handleCreateRoom = async (e) => {
        e.preventDefault();
        if (newRoomTitle.trim() === '') return;

        try {
            const savedRoom = await apiRequest('/rooms', {
                method: 'POST',
                body: JSON.stringify({ name: newRoomTitle, description: newRoomDesc })
            });

            const roomParam = savedRoom.id.toString();
            const newRoom = {
                id: savedRoom.id,
                title: savedRoom.name,
                description: savedRoom.description || "Sala personalizada.",
                roomParam: roomParam,
                category: newRoomCategory,
                status: "Ativa",
                members: savedRoom.members_count || 1,
                date: new Date(savedRoom.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            };

            const updatedRooms = [...customRooms, newRoom];
            setCustomRooms(updatedRooms);

            setIsModalOpen(false);
            setNewRoomTitle('');
            setNewRoomDesc('');

            navigate(`/chat?room=${roomParam}`);
        } catch (error) {
            console.error("Erro ao criar sala:", error);
            alert("Erro ao criar sala: " + error.message);
        }
    };

    const allRooms = customRooms;

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
                    <div className="flex items-center gap-3 pr-6">
                        <div className="relative w-full md:w-[280px]">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868b]" size={16} />
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
                                className="skeuo-input w-[240px] pl-10 pr-8 py-2 text-[15px] appearance-none cursor-pointer"
                            >
                                <option value="Todas">Todas as Categorias</option>
                                <option value="Casual">Casual</option>
                                <option value="Tecnologia">Tecnologia</option>
                                <option value="Jogos">Jogos</option>
                                <option value="Arte">Arte</option>
                                <option value="Estudos">Estudos</option>
                            </select>
                            <FaSlidersH className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0071e3]" size={16} />
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
                        icon={FaCommentAlt}
                        colorClass="bg-[#e6f0ff] dark:bg-blue-900/40 text-[#0071e3] dark:text-blue-400 shadow-inner"
                    />
                    <StatCard
                        title="Usuários (Total)"
                        value={stats.unique_users}
                        subtext={<><span className="text-[#86868b] dark:text-[#94a3b8]">A quantidade de usuários no total</span></>}
                        icon={FaUsers}
                        colorClass="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 shadow-inner"
                    />
                    <StatCard
                        title="Reportes Pendentes"
                        value="7"
                        subtext={<><span className="text-[#86868b] dark:text-[#94a3b8]">Requer atenção</span></>}
                        icon={FaExclamationTriangle}
                        colorClass="bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 shadow-inner"
                    />
                </div>

                <div className="skeuo-panel p-0 overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center border-b border-[#d2d2d7]/50 gap-4">
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f]">Diretório de Salas</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="skeuo-btn px-6 py-2.5 text-[15px] flex items-center gap-2"
                        >
                            <FaPlus size={14} />
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
                                        key={room.roomParam}
                                        room={room}
                                        isFavorite={favorites.includes(room.roomParam)}
                                        onToggleFavorite={toggleFavorite}
                                        onJoinRoom={handleJoinRoom}
                                    />
                                ))}

                                {sortedRooms.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-[#86868b] text-[15px]">
                                            {searchQuery ? `Nenhuma sala encontrada com o termo "${searchQuery}".` : "Nenhuma sala criada ainda."}
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
