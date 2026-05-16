import { Link } from 'react-router-dom';

const InfoCard = ({ title, description }) => (
    <div className="bg-white/50 backdrop-blur-sm p-10 rounded-[20px] border border-white/20">
        <h2 className="text-[24px] font-semibold mb-4 tracking-tight">{title}</h2>
        <p className="text-[17px] text-[#424245] leading-relaxed tracking-tight">{description}</p>
    </div>
);

const About = () => {
    return (
        <main className="reveal flex-grow flex flex-col items-center px-6 py-20">
            <section className="bg-white/80 backdrop-blur-xl rounded-[28px] shadow-2xl p-10 max-w-[700px] w-full text-center mb-16">
                <h1 className="hero-title text-[56px] md:text-[72px] font-semibold text-[#1d1d1f] mb-6">
                    Sobre o WebChat
                </h1>
                <p className="text-[21px] md:text-[24px] font-normal text-[#86868b] leading-tight tracking-tight max-w-[600px] mx-auto">
                    Uma aplicação de chat que é simples e moderna
                </p>
            </section>

            <section className="max-w-[980px] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                    title="A Tecnologia"
                    description="O WebChat foi construído com HTML, Tailwind CSS, Node.js, React.js, Express.js, PostgreSQL, e Socket.io, proporcionando uma experiência de chat em tempo real, rápida e que é responsiva."
                />
                <InfoCard
                    title="O Propósito"
                    description="Este projeto tem como objetivo criar uma plataforma de chat moderna e eficiente, que ofereça uma experiência de usuário boa em tempo real."
                />
                <InfoCard
                    title="A Equipe"
                    description="Este projeto foi desenvolvido por: Lucas Ramos Silva, Wssihélio Vasconcelos, Ruan Victor e Gabriel Lobão."
                />
            </section>

            <div className="mt-20">
                <Link to="/" className="btn-pill btn-primary px-10 py-4 text-[17px]">
                    Voltar ao Início
                </Link>
            </div>
        </main>
    );
};

export default About;
