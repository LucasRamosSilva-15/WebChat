import { Link } from 'react-router-dom';

const InfoCard = ({ title, description }) => (
    <div className="skeuo-card p-8 h-full">
        <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_1px_0_rgba(255,255,255,0.8)]">{title}</h3>
        <p className="text-[16px] text-[#424245] leading-relaxed">{description}</p>
    </div>
);

const About = () => {
    return (
        <main className="reveal flex-grow flex flex-col items-center px-6 py-20">
            <section className="skeuo-card p-10 max-w-[800px] w-full text-center mb-12">
                <h1 className="text-[48px] md:text-[56px] font-semibold text-[#1d1d1f] mb-4 text-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
                    Sobre o WebChat
                </h1>
                <p className="text-[18px] md:text-[21px] text-[#86868b] max-w-[600px] mx-auto">
                    Uma aplicação de chat simples, moderna e em tempo real.
                </p>
            </section>

            <section className="max-w-[980px] w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                    title="A Tecnologia"
                    description="O WebChat foi desenvolvido com HTML, Tailwind CSS, Node.js, React, Express, PostgreSQL e Socket.IO, oferecendo comunicação em tempo real e recursos essenciais para salas de bate-papo."
                />
                <InfoCard
                    title="O Propósito"
                    description="O objetivo do projeto é criar uma plataforma de chat simples, moderna e eficiente, com foco em boa experiência de uso e comunicação em tempo real."
                />
                <InfoCard
                    title="A Equipe"
                    description="Este projeto foi desenvolvido por Lucas Ramos Silva, Wssihélio Vasconcelos, Ruan Victor e Gabriel Lobão."
                />
                <InfoCard
                    title="A Hospedagem"
                    description="O backend está hospedado na Render e o frontend está hospedado na Vercel."
                />
                <InfoCard
                    title="O Design"
                    description="O visual do WebChat foi inspirado no Twitter antigo, combinando interfaces sociais clássicas com botões em relevo, gradientes, sombras suaves e uma abordagem skeuomórfica moderna."
                />
                <InfoCard
                    title="A Finalidade"
                    description="Este projeto foi desenvolvido para a disciplina de Web 2, ministrada pelo professor Wemerson Thayne no IFPB — Campus Campina Grande, no Curso Técnico em Informática."
                />
            </section>

            <div className="mt-20">
                <Link to="/" className="skeuo-btn px-10 py-4 text-[17px]">
                    Voltar ao Início
                </Link>
            </div>
        </main>
    );
};

export default About;
