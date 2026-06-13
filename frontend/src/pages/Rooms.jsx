import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { socket } from '../socket';
import { FaSearch, FaSlidersH, FaCommentAlt, FaUsers, FaExclamationTriangle, FaPlus, FaHashtag, FaStar } from 'react-icons/fa';
import { apiRequest } from '../services/api';
import SkeuoLoading from '../components/SkeuoLoading';



const StatCard = ({ title, value, subtext, icon: Icon, iconVariant = "blue" }) => (
    <div className="skeuo-panel rooms-stat-card">
        <div className="flex justify-between items-start mb-4">
            <h3 className="rooms-stat-title">{title}</h3>
            <div className={`rooms-stat-icon-wrapper rooms-stat-icon-${iconVariant}`}>
                <Icon />
            </div>
        </div>
        <div>
            <div className="rooms-stat-value">{value}</div>
            <div className="rooms-stat-subtext">{subtext}</div>
        </div>
    </div>
);

const RoomIconWithTooltip = ({ description }) => (
    <div className="relative group">
        <div className="rooms-icon">
            <FaHashtag size={18} />
        </div>

        <div className="rooms-tooltip">
            <div className="rooms-tooltip-arrow"></div>
            <div className="skeuo-panel rooms-tooltip-content">
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
    onSubmit,
    isCreatingRoom
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="rooms-modal-overlay animate-fade-in"
            onClick={onClose}
        >
            <div
                className="skeuo-panel rooms-modal-panel"
                onClick={e => e.stopPropagation()}
            >
                <h2 className="rooms-modal-title">Criar Nova Sala</h2>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="rooms-label">Nome da Sala</label>
                        <input
                            type="text"
                            required
                            value={newRoomTitle}
                            onChange={(e) => setNewRoomTitle(e.target.value)}
                            className="skeuo-input rooms-modal-input"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="rooms-label">Categoria</label>
                        <select
                            value={newRoomCategory}
                            onChange={(e) => setNewRoomCategory(e.target.value)}
                            className="skeuo-input rooms-modal-input rooms-modal-select"
                        >
                            <option>Casual</option>
                            <option>Tecnologia</option>
                            <option>Jogos</option>
                            <option>Arte</option>
                            <option>Estudos</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="rooms-label">Descrição</label>
                        <input
                            type="text"
                            value={newRoomDesc}
                            onChange={(e) => setNewRoomDesc(e.target.value)}
                            className="skeuo-input rooms-modal-input"
                        />
                    </div>

                    <div className="rooms-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary-glossy rooms-modal-btn"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isCreatingRoom}
                            className="skeuo-btn rooms-modal-btn rooms-modal-btn-submit"
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
    <tr className="rooms-table-row">
        <td className="rooms-table-td">
            <div className="flex items-center gap-4">
                <RoomIconWithTooltip description={room.description} />
                <div>
                    <div className="rooms-row-title">{room.title}</div>
                    <div className="rooms-row-date">Criada em {room.date || "Recente"}</div>
                </div>
            </div>
        </td>

        <td className="rooms-table-td rooms-row-category">
            {room.category || "Casual"}
        </td>

        <td className="rooms-table-td">
            {room.status === "Arquivada" ? (
                <span className="rooms-badge rooms-badge-archived">
                    <span className="rooms-badge-dot rooms-badge-dot-archived"></span>
                    Arquivada
                </span>
            ) : room.members >= 200 ? (
                <span className="rooms-badge rooms-badge-full">
                    <span className="rooms-badge-dot rooms-badge-dot-full"></span>
                    Cheia
                </span>
            ) : (
                <span className="rooms-badge rooms-badge-active">
                    <span className="rooms-badge-dot rooms-badge-dot-active"></span>
                    Ativa
                </span>
            )}
        </td>

        <td className="rooms-table-td rooms-row-members">
            {room.members} / 200
        </td>

        <td className="rooms-table-td flex gap-2 items-center">
            <button
                onClick={() => onToggleFavorite(room.roomParam)}
                className={`rooms-favorite-btn ${isFavorite ? 'rooms-favorite-btn-active' : 'rooms-favorite-btn-inactive'}`}
                title={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
            >
                <FaStar size={14} />
            </button>
            {room.status !== "Arquivada" && (
                room.members >= 200 ? (
                    <span className="btn-secondary-glossy rooms-action-btn rooms-full-btn">
                        Lotada
                    </span>
                ) : (
                    <button onClick={() => onJoinRoom(room.roomParam)} className="btn-secondary-glossy rooms-action-btn rooms-join-btn">
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
            setRoomsLoading(true);
            setRoomsError("");
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
                    category: newRoomCategory
                })
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
            <main className="reveal rooms-page rooms-page-error">
                <div className="skeuo-panel rooms-error-panel">
                    <div className="rooms-error-icon">
                        <FaExclamationTriangle />
                    </div>
                    <h2 className="rooms-error-title">Erro de Conexão</h2>
                    <p className="rooms-error-desc">{roomsError}</p>
                    <button onClick={() => window.location.reload()} className="skeuo-btn rooms-retry-btn">Tentar Novamente</button>
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
                    <span className="rooms-stat-positive">↗ +{customRooms.length}</span> esta semana
                </>
            ),
            icon: FaCommentAlt,
            iconVariant: "blue"
        },
        {
            title: "Usuários (Total)",
            value: stats.unique_users,
            subtext: <span className="rooms-stat-muted">A quantidade de usuários no total</span>,
            icon: FaUsers,
            iconVariant: "green"
        },
        {
            title: "Reportes Pendentes",
            value: "7",
            subtext: <span className="rooms-stat-muted">Requer atenção</span>,
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
                onSubmit={handleCreateRoom}
                isCreatingRoom={isCreatingRoom}
            />

            <main className="reveal rooms-page">

                <div className="skeuo-panel rooms-header">
                    <div className="rooms-header-content">
                        <h1 className="rooms-title">Gerenciamento de Salas</h1>
                        <p className="rooms-subtitle">Administre salas, moderadores e atividades da comunidade.</p>
                    </div>
                    <div className="rooms-toolbar">
                        <div className="rooms-search-wrapper">
                            <FaSearch className="rooms-search-icon" size={16} />
                            <input
                                type="text"
                                placeholder="Buscar salas..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="skeuo-input rooms-search-input"
                            />
                        </div>
                        <div className="rooms-filter-wrapper">
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="skeuo-input rooms-filter-select"
                            >
                                <option value="Todas">Todas as Categorias</option>
                                <option value="Casual">Casual</option>
                                <option value="Tecnologia">Tecnologia</option>
                                <option value="Jogos">Jogos</option>
                                <option value="Arte">Arte</option>
                                <option value="Estudos">Estudos</option>
                            </select>
                            <FaSlidersH className="rooms-filter-icon" size={16} />
                            <div className="rooms-filter-arrow">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rooms-stats-grid">
                    {statsCards.map((card) => (
                        <StatCard key={card.title} {...card} />
                    ))}
                </div>

                <div className="skeuo-panel rooms-list-panel">
                    <div className="rooms-list-header">
                        <h2 className="rooms-list-title">Diretório de Salas</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="skeuo-btn rooms-create-room-btn"
                        >
                            <FaPlus size={14} />
                            Criar Sala
                        </button>
                    </div>

                    <div className="rooms-table-wrapper">
                        <table className="rooms-table">
                            <thead>
                                <tr className="rooms-table-header-row">
                                    <th className="rooms-table-th">Nome da Sala</th>
                                    <th className="rooms-table-th">Categoria</th>
                                    <th className="rooms-table-th">Status</th>
                                    <th className="rooms-table-th">Membros</th>
                                    <th className="rooms-table-th">Ações</th>
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
                                        <td colSpan="5" className="rooms-empty">
                                            {searchQuery ? `Nenhuma sala encontrada com o termo "${searchQuery}".` : "Nenhuma sala criada ainda."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="rooms-pagination">
                        <div>Mostrando 1 a {filteredRooms.length} de {allRooms.length} salas</div>
                        <div className="rooms-pagination-actions">
                            <button className="rooms-pagination-btn" disabled>&lt;</button>
                            <button className="rooms-pagination-btn rooms-pagination-btn-active">1</button>
                            <button className="rooms-pagination-btn" disabled>&gt;</button>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

export default Rooms;
