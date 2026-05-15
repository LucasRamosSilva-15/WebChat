import { Link } from 'react-router-dom';

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

const Rooms = () => {
    return (
        <main className="reveal max-w-[1024px] mx-auto p-8 w-full">
            <header className="bg-white/80 backdrop-blur-xl rounded-[28px] shadow-2xl p-10 text-center mb-12">
                <h1 className="hero-title text-[40px] md:text-[56px] font-semibold text-[#1d1d1f]">
                    Escolha sua sala
                </h1>
                <p className="text-[19px] text-[#86868b] mt-2">Explore conversas em tempo real</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <RoomCard
                    title="Geral"
                    description="Um espaço para discussões amplas e variadas."
                    roomParam="general"
                />
                <RoomCard
                    title="Tecnologia"
                    description="Discuta as últimas inovações e tendências."
                    roomParam="tech"
                />
                <RoomCard
                    title="Games"
                    description="O ponto de encontro para jogadores de todas as plataformas."
                    roomParam="gaming"
                />
                <RoomCard
                    title="Computação Gráfica"
                    description="Discuta sobre computação gráfica e animação."
                    roomParam="cg"
                />
                <RoomCard
                    title="Web"
                    description="Discuta sobre web development."
                    roomParam="web"
                />
            </div>
        </main>
    );
};

export default Rooms;
