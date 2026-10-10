import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { FaSearch, FaSlidersH, FaCommentAlt, FaUsers, FaExclamationTriangle, FaPlus, FaHashtag, FaStar } from 'react-icons/fa';
import { apiRequest } from '../services/api';
import SkeuoLoading from '../components/SkeuoLoading';

const StatCard = ({ title, value, subtext, icon: Icon, iconVariant = "blue" }) => {
    const iconColorClass = iconVariant === "blue" 
        ? "text-[#0071e3] dark:text-blue-400" 
        : iconVariant === "green" 
            ? "text-emerald-600 dark:text-emerald-400" 
            : "text-red-500 dark:text-red-400";

    return (
        <div className="skeuo-card p-6 flex flex-col justify-between h-full transition-transform duration-300 hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-[13px] font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">{title}</h3>
                <div className={`skeuo-surface-orb-badge w-10 h-10 flex items-center justify-center text-lg shrink-0 ${iconColorClass}`}>
                    <Icon />
                </div>
            </div>
            <div className="skeuo-well px-4 py-2 my-2 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{value}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtext}</span>
            </div>
        </div>
    );
};

const RoomIconWithTooltip = ({ description, imageUrl }) => (
    <div className="relative group">
        <div className="skeuo-avatar-badge w-10 h-10 flex items-center justify-center text-white font-bold text-sm rounded-xl shrink-0 overflow-hidden cursor-help transition-transform duration-200 group-hover:scale-105">
            {imageUrl ? (
                <img src={imageUrl} alt="Room Icon" className="w-full h-full object-cover" />
            ) : (
                <FaHashtag size={18} />
            )}
        </div>

        <div className="skeuo-tooltip left-[calc(100%+10px)] top-1/2 -translate-y-1/2 -translate-x-2 group-hover:translate-x-0">
            <div className="skeuo-tooltip-arrow -mr-1.5"></div>
            <div className="skeuo-panel skeuo-tooltip-content">
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
    newRoomImage,
    onImageChange,
    onSubmit,
    isCreatingRoom
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="skeuo-modal-overlay animate-fade-in"
            onClick={onClose}
        >
            <div
                className="skeuo-panel p-8 w-full max-w-[450px] relative"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="text-2xl mb-6 font-semibold text-gray-900 dark:text-slate-50">Criar Nova Sala</h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="block text-xs ml-1 font-medium text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">Nome da Sala</label>
                        <input
                            type="text"
                            required
                            value={newRoomTitle}
                            onChange={(e) => setNewRoomTitle(e.target.value)}
                            className="skeuo-input w-full px-4 py-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs ml-1 font-medium text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">Categoria</label>
                        <select
                            value={newRoomCategory}
                            onChange={(e) => setNewRoomCategory(e.target.value)}
                            className="skeuo-input w-full px-4 py-3 bg-white dark:bg-slate-800"
                        >
                            <option>Casual</option>
                            <option>Tecnologia</option>
                            <option>Jogos</option>
                            <option>Arte</option>
                            <option>Estudos</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs ml-1 font-medium text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">Descrição</label>
                        <input
                            type="text"
                            value={newRoomDesc}
                            onChange={(e) => setNewRoomDesc(e.target.value)}
                            className="skeuo-input w-full px-4 py-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="block text-xs ml-1 font-medium text-[#86868b] dark:text-[#94a3b8] uppercase tracking-widest">Imagem da Sala (Opcional)</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer btn-secondary-glossy px-4 py-2 text-sm flex items-center gap-2 rounded-lg">
                                Escolher Imagem
                                <input type="file" accept="image/*" className="hidden" onChange={onImageChange} />
                            </label>
                            {newRoomImage && (
                                <img src={newRoomImage} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                            )}
                        </div>
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
                            disabled={isCreatingRoom}
                            className="skeuo-btn-primary w-full py-3 text-base font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isCreatingRoom ? "Criando..." : "Criar Sala"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const RoomRow = ({ room, isFavorite, onToggleFavorite, onJoinRoom }) => (
    <tr className="border-b border-[#d2d2d7]/30 dark:border-white/5 transition-colors duration-150 hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
        <td className="px-6 py-4">
            <div className="flex items-center gap-4">
                <RoomIconWithTooltip description={room.description} imageUrl={room.image_url} />
                <div>
                    <div className="text-base font-semibold text-[#1d1d1f] dark:text-slate-50">{room.title}</div>
                    <div className="text-[13px] text-[#86868b] dark:text-[#94a3b8]">Criada em {room.date || "Recente"}</div>
                </div>
            </div>
        </td>

        <td className="px-6 py-4 text-[15px] text-[#424245] dark:text-slate-300">
            {room.category || "Casual"}
        </td>

        <td className="px-6 py-4">
            {room.status === "Arquivada" ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-600 bg-gradient-to-b from-slate-100 to-slate-200/90 border border-slate-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,0,0,0.08)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Arquivada
                </span>
            ) : room.members >= 200 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-red-700 bg-gradient-to-b from-red-100 to-red-200/90 border border-red-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(239,68,68,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                    Cheia
                </span>
            ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-gradient-to-b from-emerald-100 to-emerald-200/90 border border-emerald-300/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(16,185,129,0.15)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Ativa
                </span>
            )}
        </td>

        <td className="px-6 py-4 text-[15px] whitespace-nowrap font-medium text-[#1d1d1f] dark:text-slate-50">
            {room.members} / 200
        </td>

        <td className="px-6 py-4 flex gap-2 items-center">
            <button
                type="button"
                onClick={() => onToggleFavorite(room.roomParam)}
                title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                className="btn-secondary-glossy w-8 h-8 rounded-full inline-flex items-center justify-center p-0 shrink-0 transition-transform active:scale-95"
            >
                <svg
                    className={`w-4 h-4 transition-colors ${
                        isFavorite
                            ? "text-amber-500 fill-amber-400 drop-shadow-[0_1px_1px_rgba(245,158,11,0.4)]"
                            : "text-slate-400 hover:text-amber-500/80"
                    }`}
                    viewBox="0 0 24 24"
                    fill={isFavorite ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>
            {room.status !== "Arquivada" && (
                room.members >= 200 ? (
                    <span className="btn-secondary-glossy px-3.5 py-1.5 text-xs font-medium !text-red-500 !cursor-not-allowed opacity-80">
                        Lotada
                    </span>
                ) : (
                    <button onClick={() => onJoinRoom(room.roomParam)} className="btn-secondary-glossy px-3.5 py-1.5 text-xs font-medium">
                        Entrar
                    </button>
                )
            )}
        </td>
    </tr>
);

const Rooms = () => {
    const navigate = useNavigate();

    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [roomsError, setRoomsError] = useState("");
    const [customRooms, setCustomRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('Todas');
    const [favorites, setFavorites] = useState([]);
    const [stats, setStats] = useState({ total_users: 0, active_rooms: 0, pending_reports: 0, active_bans: 0 });

    const [newRoomTitle, setNewRoomTitle] = useState('');
    const [newRoomDesc, setNewRoomDesc] = useState('');
    const [newRoomCategory, setNewRoomCategory] = useState('Casual');
    const [newRoomImage, setNewRoomImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 512;
                    const MAX_HEIGHT = 512;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                    setNewRoomImage(dataUrl);
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

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
            setRoomsLoading(true);
            setRoomsError("");
            try {
                const apiRooms = await apiRequest('/rooms');
                const mappedRooms = apiRooms.map(room => ({
                    id: room.id,
                    title: room.name,
                    description: room.description || "Sem descrição",
                    image_url: room.image_url,
                    roomParam: room.id.toString(),
                    category: room.category || "Custom",
                    status: "Ativa",
                    members: room.members_count || 0,
                    date: new Date(room.created_at).toLocaleDateString('pt-BR')
                }));
                setCustomRooms(mappedRooms);
            } catch (error) {
                console.error("Erro ao carregar salas da API:", error);
                if (error.message && (error.message.includes('Token') || error.message.includes('expirado') || error.message.includes('Acesso negado'))) {
                    return;
                }
                setRoomsError("Não foi possível carregar as salas.");
                const savedRooms = localStorage.getItem('chat_customRooms');
                if (savedRooms) {
                    try {
                        setCustomRooms(JSON.parse(savedRooms));
                    } catch (e) {
                        console.error("Erro ao carregar salas customizadas");
                    }
                }
            } finally {
                setRoomsLoading(false);
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
        
        if (isCreatingRoom) return;
        if (newRoomTitle.trim() === '') return;

        setIsCreatingRoom(true);

        try {
            const savedRoom = await apiRequest('/rooms', {
                method: 'POST',
                body: JSON.stringify({ 
                    name: newRoomTitle.trim(), 
                    description: newRoomDesc.trim(),
                    category: newRoomCategory,
                    image_url: newRoomImage
                })
            });

            const roomParam = savedRoom.id.toString();
            const newRoom = {
                id: savedRoom.id,
                title: savedRoom.name,
                description: savedRoom.description || "Sala personalizada.",
                image_url: savedRoom.image_url,
                roomParam: roomParam,
                category: newRoomCategory,
                status: "Ativa",
                members: savedRoom.members_count || 1,
                date: new Date(savedRoom.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
            };

            setCustomRooms(prev => {
                if (prev.some(room => room.id === newRoom.id)) {
                    return prev;
                }
                return [...prev, newRoom];
            });

            setIsModalOpen(false);
            setNewRoomTitle('');
            setNewRoomDesc('');

            navigate(`/chat?room=${roomParam}`);
        } catch (error) {
            console.error("Erro ao criar sala:", error);
            if (error.message && error.message.includes('Você já criou uma sala com esse nome')) {
                alert("Você já criou uma sala com esse nome.");
            } else {
                alert("Erro ao criar sala: " + error.message);
            }
        } finally {
            setIsCreatingRoom(false);
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

    if (roomsLoading) {
        return (
            <SkeuoLoading
                title="Carregando salas..."
                subtitle="Buscando salas, membros e estatísticas no banco de dados."
            />
        );
    }

    if (roomsError && customRooms.length === 0) {
        return (
            <main className="reveal flex items-center justify-center min-h-[50vh]">
                <div className="skeuo-panel p-8 text-center w-full max-w-[420px]">
                    <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl bg-red-50 text-red-500 border border-red-100 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.05)] dark:bg-red-500/10 dark:border-red-500/20">
                        <FaExclamationTriangle />
                    </div>
                    <h2 className="text-[22px] mb-2 font-semibold text-[#1d1d1f] dark:text-slate-50">Erro de Conexão</h2>
                    <p className="text-[15px] mb-6 text-[#86868b] dark:text-[#94a3b8]">{roomsError}</p>
                    <button onClick={() => window.location.reload()} className="skeuo-btn px-6 py-2.5 text-[15px]">Tentar Novamente</button>
                </div>
            </main>
        );
    }

    const statsCards = [
        {
            title: "Salas Ativas",
            value: filteredRooms.length,
            subtext: (
                <>
                    <span className="text-emerald-500 font-medium">↗ +{customRooms.length}</span> esta semana
                </>
            ),
            icon: FaCommentAlt,
            iconVariant: "blue"
        },
        {
            title: "Usuários (Total)",
            value: stats.total_users,
            subtext: <span className="text-[#86868b] dark:text-[#94a3b8]">A quantidade de usuários no total</span>,
            icon: FaUsers,
            iconVariant: "green"
        },
        {
            title: "Reportes Pendentes",
            value: stats.pending_reports,
            subtext: <span className="text-[#86868b] dark:text-[#94a3b8]">Requer atenção</span>,
            icon: FaExclamationTriangle,
            iconVariant: "red"
        }
    ];

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
                newRoomImage={newRoomImage}
                onImageChange={handleImageChange}
                onSubmit={handleCreateRoom}
                isCreatingRoom={isCreatingRoom}
            />

            <main className="reveal w-full max-w-[1200px] mx-auto p-4 md:p-8 relative space-y-8">

                <div className="skeuo-card flex flex-col md:flex-row justify-between gap-4 mt-4 md:items-center">
                    <div className="p-6">
                        <h1 className="text-[28px] md:text-[32px] font-semibold text-[#1d1d1f] dark:text-slate-50">Gerenciamento de Salas</h1>
                        <p className="text-base mt-1 text-[#86868b] dark:text-[#94a3b8]">Administre salas, moderadores e atividades da comunidade.</p>
                    </div>
                    <div className="flex items-center gap-3 pr-6">
                        <div className="relative w-full md:w-[280px]">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] dark:text-[#94a3b8]" size={16} />
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
                                className="btn-secondary-glossy w-[240px] pl-10 pr-8 py-2 text-[15px] appearance-none cursor-pointer"
                            >
                                <option value="Todas">Todas as Categorias</option>
                                <option value="Casual">Casual</option>
                                <option value="Tecnologia">Tecnologia</option>
                                <option value="Jogos">Jogos</option>
                                <option value="Arte">Arte</option>
                                <option value="Estudos">Estudos</option>
                            </select>
                            <FaSlidersH className="text-[#0071e3] absolute left-3 top-1/2 -translate-y-1/2" size={16} />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {statsCards.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>

                <div className="skeuo-card p-0 overflow-hidden">
                    <div className="flex flex-col md:flex-row justify-between items-center p-6 md:px-8 md:py-6 gap-4 border-b border-[#d2d2d7]/50 dark:border-white/5">
                        <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-slate-50">Diretório de Salas</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="skeuo-btn-primary px-5 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2"
                        >
                            <FaPlus size={14} />
                            Criar Sala
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-black/[0.02] border-b border-[#d2d2d7]/50 dark:bg-white/[0.02] dark:border-white/5">
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-wider">Nome da Sala</th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-wider">Categoria</th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-wider">Membros</th>
                                    <th className="px-6 py-4 text-[13px] font-semibold text-[#86868b] dark:text-[#94a3b8] uppercase tracking-wider">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRooms.map((room) => (
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
                                        <td colSpan="5" className="py-12 px-6 text-center text-[15px] text-[#86868b] dark:text-[#94a3b8]">
                                            {searchQuery ? `Nenhuma sala encontrada com o termo "${searchQuery}".` : "Nenhuma sala criada ainda."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-6 flex items-center justify-between text-sm bg-black/[0.02] border-t border-[#d2d2d7]/50 text-[#86868b] dark:bg-white/[0.02] dark:border-white/5 dark:text-[#94a3b8]">
                        <div>Mostrando 1 a {filteredRooms.length} de {allRooms.length} salas</div>
                        <div className="flex gap-1.5 items-center">
                            <button className="btn-secondary-glossy w-7 h-7 text-xs rounded-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed" disabled>&lt;</button>
                            <button className="skeuo-btn-primary w-7 h-7 text-xs rounded-lg flex items-center justify-center text-white font-bold">1</button>
                            <button className="btn-secondary-glossy w-7 h-7 text-xs rounded-lg flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed" disabled>&gt;</button>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

export default Rooms;
