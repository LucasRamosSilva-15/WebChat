import { FaCloud, FaDatabase } from 'react-icons/fa';

const SkeuoLoading = ({ title = "Carregando...", subtitle = "Buscando informações...", variant = "page" }) => {
  return (
    <main className={variant === "chat"
      ? "flex-1 min-w-0 flex items-center justify-center h-full bg-[#f8fafc] dark:bg-[#020617] px-6"
      : "reveal flex-grow flex items-center justify-center px-6 py-12"
    }>
      <div className="skeuo-panel p-8 max-w-[420px] w-full text-center animate-loading-panel relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/90 dark:bg-white/10" />

        <div className="mx-auto mb-6 relative w-20 h-20 rounded-full flex items-center justify-center skeuo-loading-orb animate-loading-orb">
          <div className="absolute inset-2 rounded-full border-[3px] border-sky-300/40 border-t-sky-500 animate-spin" />
          <FaCloud className="relative z-10 text-sky-500 drop-shadow-sm" size={26} />
        </div>

        <h1 className="hero-title text-[26px] font-semibold mb-2">
          {title}
        </h1>

        <p className="text-[14px] text-[#86868b] dark:text-slate-400 leading-relaxed">
          {subtitle}
        </p>

        <div className="mt-6 h-2 rounded-full overflow-hidden skeuo-progress-track">
          <div className="h-full w-1/3 rounded-full skeuo-progress-fill animate-loading-shine" />
        </div>
      </div>
    </main>
  );
};

export default SkeuoLoading;
