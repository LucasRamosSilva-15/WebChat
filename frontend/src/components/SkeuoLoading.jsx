import { FaCloud, FaDatabase } from 'react-icons/fa';

const SkeuoLoading = ({ title = "Carregando...", subtitle = "Buscando informações...", variant = "page" }) => {
  return (
    <main className={variant === "chat"
      ? "skeuo-loading-page skeuo-loading-page-chat"
      : "skeuo-loading-page reveal"
    }>
      <div className="skeuo-panel skeuo-loading-panel animate-loading-panel">
        <div className="skeuo-loading-highlight" />

        <div className="skeuo-loading-orb-shell skeuo-loading-orb animate-loading-orb">
          <div className="skeuo-loading-spinner animate-spin" />
          <FaCloud className="skeuo-loading-icon" size={26} />
        </div>

        <h1 className="hero-title skeuo-loading-title">
          {title}
        </h1>

        <p className="skeuo-loading-subtitle skeuo-subtitle">
          {subtitle}
        </p>

        <div className="skeuo-loading-progress skeuo-progress-track">
          <div className="skeuo-loading-progress-fill skeuo-progress-fill animate-loading-shine" />
        </div>
      </div>
    </main>
  );
};

export default SkeuoLoading;
