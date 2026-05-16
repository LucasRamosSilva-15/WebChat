import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const RoomCard = ({ title, description, roomParam }) => (
    <div className="skeuo-panel p-8 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
        <div>
            <h2 className="text-[24px] font-semibold tracking-tight mb-2">{title}</h2>
            <p className="text-[17px] text-[#424245] leading-snug mb-6">{description}</p>
        </div>
        <Link to={`/chat?room=${roomParam}`} className="skeuo-btn self-start px-6 py-2 text-[14px]">
            Entrar
        </Link>
    </div>
);

const defaultRooms = [
    { title: "Geral", description: "Um espaço para discussões amplas e variadas.", roomParam: "general" },
    { title: "Tecnologia", description: "Discuta as últimas inovações e tendências.", roomParam: "tech" },
    { title: "Games", description: "O ponto de encontro para jogadores de todas as plataformas.", roomParam: "gaming" },
    { title: "Computação Gráfica", description: "Discuta sobre computação gráfica e animação.", roomParam: "cg" },
    { title: "Web", description: "Discuta sobre web development.", roomParam: "web" }
];

const Rooms = () => {
    const navigate = useNavigate();
    const [customRooms, setCustomRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRoomTitle, setNewRoomTitle] = useState('');
    const [newRoomDesc, setNewRoomDesc] = useState('');

    useEffect(() => {
        const savedRooms = localStorage.getItem('chat_customRooms');
        if (savedRooms) {
            try {
                setCustomRooms(JSON.parse(savedRooms));
            } catch (e) {
                console.error("Erro ao carregar salas customizadas");
            }
        }
    }, []);

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (newRoomTitle.trim() === '') return;

        const roomParam = newRoomTitle.toLowerCase().replace(/\s+/g, '-');
        const newRoom = {
            title: newRoomTitle,
            description: newRoomDesc || "Sala personalizada.",
            roomParam: roomParam
        };

        const updatedRooms = [...customRooms, newRoom];
        setCustomRooms(updatedRooms);
        localStorage.setItem('chat_customRooms', JSON.stringify(updatedRooms));

        setIsModalOpen(false);
        setNewRoomTitle('');
        setNewRoomDesc('');

        navigate(`/chat?room=${roomParam}`);
    };

    return (
        <>
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="skeuo-panel p-8 max-w-[400px] w-full">
                        <h2 className="text-[24px] font-semibold mb-4">Criar Nova Sala</h2>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nome da Sala"
                                required
                                value={newRoomTitle}
                                onChange={(e) => setNewRoomTitle(e.target.value)}
                                className="skeuo-input w-full px-4 py-3"
                            />
                            <input
                                type="text"
                                placeholder="Descrição (opcional)"
                                value={newRoomDesc}
                                onChange={(e) => setNewRoomDesc(e.target.value)}
                                className="skeuo-input w-full px-4 py-3"
                            />
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary-glossy w-full py-3">Cancelar</button>
                                <button type="submit" className="skeuo-btn w-full py-3 text-[16px]">Criar e Entrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <main className="reveal max-w-[1024px] mx-auto p-8 w-full relative">
                <header className="skeuo-panel p-10 text-center mb-12 relative flex flex-col items-center">
                <h1 className="hero-title text-[40px] md:text-[56px] font-semibold">
                    Escolha sua sala
                </h1>
                <p className="text-[19px] text-[#86868b] mt-2 mb-6">Explore conversas em tempo real</p>
                <button onClick={() => setIsModalOpen(true)} className="skeuo-btn px-8 py-3 text-[15px] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Criar Nova Sala
                </button>
            </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {defaultRooms.map((room, i) => (
                        <RoomCard key={i} title={room.title} description={room.description} roomParam={room.roomParam} />
                    ))}
                    {customRooms.map((room, i) => (
                        <RoomCard key={`custom-${i}`} title={room.title} description={room.description} roomParam={room.roomParam} />
                    ))}
                </div>
            </main>
        </>
    );
};

export default Rooms;
