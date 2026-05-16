import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const RoomCard = ({ title, description, roomParam }) => (
    <div className="bg-white/60 backdrop-blur-md p-8 rounded-[20px] flex flex-col justify-between hover:bg-white/80 transition-all duration-500 shadow-sm">
        <div>
            <h2 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f] mb-2">{title}</h2>
            <p className="text-[17px] text-[#424245] leading-snug mb-6">{description}</p>
        </div>
        <Link to={`/chat?room=${roomParam}`} className="btn-pill btn-primary self-start px-6 py-2 text-[14px] font-normal">
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
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[28px] shadow-2xl max-w-[400px] w-full">
                        <h2 className="text-[24px] font-semibold mb-4 text-[#1d1d1f]">Criar Nova Sala</h2>
                        <form onSubmit={handleCreateRoom} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nome da Sala"
                                required
                                value={newRoomTitle}
                                onChange={(e) => setNewRoomTitle(e.target.value)}
                                className="apple-input w-full px-4 py-3 rounded-[12px] border border-[#d2d2d7] bg-white/50 focus:outline-none"
                            />
                            <input
                                type="text"
                                placeholder="Descrição (opcional)"
                                value={newRoomDesc}
                                onChange={(e) => setNewRoomDesc(e.target.value)}
                                className="apple-input w-full px-4 py-3 rounded-[12px] border border-[#d2d2d7] bg-white/50 focus:outline-none"
                            />
                            <div className="flex gap-2 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-pill bg-gray-200 text-black hover:bg-gray-300 w-full py-3">Cancelar</button>
                                <button type="submit" className="btn-pill btn-primary w-full py-3">Criar e Entrar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <main className="reveal max-w-[1024px] mx-auto p-8 w-full relative">
                <header className="bg-white/80 backdrop-blur-xl rounded-[28px] shadow-2xl p-10 text-center mb-12 relative flex flex-col items-center">
                <h1 className="hero-title text-[40px] md:text-[56px] font-semibold text-[#1d1d1f]">
                    Escolha sua sala
                </h1>
                <p className="text-[19px] text-[#86868b] mt-2 mb-6">Explore conversas em tempo real</p>
                <button onClick={() => setIsModalOpen(true)} className="btn-pill btn-primary px-8 py-3 text-[15px] font-medium flex items-center gap-2">
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
