import { Cloud } from 'lucide-react';

const SkeuoLoading = ({
  title = "Carregando...",
  subtitle = "Buscando informações...",
  variant = "page",
  progress
}) => {
  const isDeterminate = typeof progress === 'number';
  const clampedProgress = isDeterminate ? Math.min(100, Math.max(0, progress)) : null;

  return (
    <main className={variant === "chat"
      ? "skeuo-loading-page skeuo-loading-page-chat"
      : "skeuo-loading-page reveal"
    }>
      <div className="skeuo-card max-w-sm w-full mx-auto p-8 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(14,165,233,0.15)]">
        <div className="skeuo-surface-orb-badge w-16 h-16 rounded-full flex items-center justify-center mb-5 relative">
          <div className="absolute inset-0 rounded-full bg-sky-400/20 animate-ping pointer-events-none" />
          <Cloud className="w-8 h-8 text-sky-500 drop-shadow-[0_2px_4px_rgba(14,165,233,0.35)] relative z-10" />
        </div>

        <h1 className="hero-title skeuo-loading-title text-xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h1>

        <p className="skeuo-loading-subtitle skeuo-subtitle text-xs text-slate-500 dark:text-slate-400 mt-1">
          {subtitle}
        </p>

        <div
          role="progressbar"
          aria-label={title}
          aria-valuenow={isDeterminate ? Math.round(clampedProgress) : undefined}
          aria-valuemin={isDeterminate ? 0 : undefined}
          aria-valuemax={isDeterminate ? 100 : undefined}
          className="w-full h-3 rounded-full bg-slate-200/80 dark:bg-slate-800/80 p-0.5 border border-slate-300/80 dark:border-slate-700/80 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.15)] overflow-hidden mt-6"
        >
          <div
            className={`h-full rounded-full bg-gradient-to-b from-sky-300 via-sky-500 to-sky-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_1px_2px_rgba(2,132,199,0.4)] relative overflow-hidden ${
              isDeterminate ? 'transition-all duration-200 ease-out' : 'w-full'
            }`}
            style={isDeterminate ? { width: `${clampedProgress}%` } : undefined}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-skeuo-shimmer w-full" />
          </div>
        </div>

        {isDeterminate && (
          <div className="w-full flex justify-between items-center mt-2 px-1">
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Progresso
            </span>
            <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400 font-mono">
              {Math.round(clampedProgress)}%
            </span>
          </div>
        )}
      </div>
    </main>
  );
};

export default SkeuoLoading;
