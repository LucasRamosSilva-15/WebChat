import React from 'react';


const VolumetricCloud = ({ className = '', flip = false, variant = 'large' }) => {
    return (
        <svg
            viewBox="0 0 500 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`w-full h-auto filter drop-shadow-[0_15px_25px_rgba(2,132,199,0.12)] dark:drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)] ${flip ? '-scale-x-100' : ''} ${className}`}
        >
            <defs>
                <radialGradient id={`cloudHighlight-${variant}`} cx="45%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="55%" stopColor="#ffffff" stopOpacity="0.96" />
                    <stop offset="85%" stopColor="#e0f2fe" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.75" />
                </radialGradient>

                <linearGradient id={`cloudBase-${variant}`} x1="250" y1="50" x2="250" y2="280" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                    <stop offset="60%" stopColor="#f0f9ff" stopOpacity="0.92" />
                    <stop offset="88%" stopColor="#bae6fd" stopOpacity="0.82" />
                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.65" />
                </linearGradient>

                <radialGradient id={`cloudDark-${variant}`} cx="45%" cy="25%" r="70%">
                    <stop offset="0%" stopColor="#64748b" stopOpacity="0.9" />
                    <stop offset="45%" stopColor="#334155" stopOpacity="0.85" />
                    <stop offset="85%" stopColor="#1e293b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0f172a" stopOpacity="0.75" />
                </radialGradient>

                <linearGradient id={`cloudRim-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
            </defs>

            <g className="dark:hidden">
                <ellipse cx="250" cy="210" rx="200" ry="55" fill={`url(#cloudBase-${variant})`} />

                <circle cx="150" cy="180" r="75" fill={`url(#cloudHighlight-${variant})`} />

                <circle cx="340" cy="185" r="70" fill={`url(#cloudHighlight-${variant})`} />

                <circle cx="245" cy="130" r="85" fill={`url(#cloudHighlight-${variant})`} />

                <circle cx="185" cy="140" r="65" fill={`url(#cloudHighlight-${variant})`} />

                <circle cx="305" cy="145" r="68" fill={`url(#cloudHighlight-${variant})`} />

                <ellipse cx="245" cy="75" rx="55" ry="16" fill={`url(#cloudRim-${variant})`} opacity="0.6" />
                <ellipse cx="175" cy="100" rx="40" ry="12" fill={`url(#cloudRim-${variant})`} opacity="0.45" />
            </g>

            <g className="hidden dark:block">
                <ellipse cx="250" cy="210" rx="200" ry="55" fill={`url(#cloudDark-${variant})`} />
                <circle cx="150" cy="180" r="75" fill={`url(#cloudDark-${variant})`} />
                <circle cx="340" cy="185" r="70" fill={`url(#cloudDark-${variant})`} />
                <circle cx="245" cy="130" r="85" fill={`url(#cloudDark-${variant})`} />
                <circle cx="185" cy="140" r="65" fill={`url(#cloudDark-${variant})`} />
                <circle cx="305" cy="145" r="68" fill={`url(#cloudDark-${variant})`} />
                <ellipse cx="245" cy="65" rx="60" ry="12" fill="#94a3b8" opacity="0.25" />
            </g>
        </svg>
    );
};

const WaterOrb = ({ size = 'w-16 h-16', className = '' }) => {
    return (
        <div
            className={`relative rounded-full pointer-events-none select-none ${size} ${className}`}
            style={{
                background: 'radial-gradient(circle at 35% 25%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.3) 25%, rgba(56, 189, 248, 0.25) 55%, rgba(2, 132, 199, 0.45) 85%, rgba(3, 105, 161, 0.6) 100%)',
                boxShadow: 'inset -3px -5px 12px rgba(2, 132, 199, 0.5), inset 2px 3px 6px rgba(255, 255, 255, 0.95), 0 8px 20px rgba(14, 165, 233, 0.25)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(1.5px)',
            }}
        >
            <div
                className="absolute top-[16%] left-[20%] w-[38%] h-[24%] rounded-full bg-white/90"
                style={{
                    transform: 'rotate(-32deg)',
                    filter: 'blur(0.5px)',
                }}
            />
            <div className="absolute bottom-[14%] right-[22%] w-[20%] h-[14%] rounded-full bg-white/40" />
        </div>
    );
};

const SkyBackground = () => {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative flex items-center justify-center animate-ripple-breathe">
                    <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-sky-400/25 dark:border-sky-400/15" />

                    <div className="absolute w-[560px] h-[560px] sm:w-[680px] sm:h-[680px] rounded-full border border-sky-400/20 dark:border-sky-400/10" />

                    <div className="absolute w-[820px] h-[820px] sm:w-[980px] sm:h-[980px] rounded-full border border-sky-400/18 dark:border-sky-400/8" />

                    <div className="absolute w-[1140px] h-[1140px] sm:w-[1340px] sm:h-[1340px] rounded-full border border-sky-400/15 dark:border-sky-400/6" />

                    <div className="absolute w-[1500px] h-[1500px] sm:w-[1750px] sm:h-[1750px] rounded-full border border-sky-400/10 dark:border-sky-400/4" />
                </div>
            </div>

            <div className="absolute top-[20%] left-[8%] sm:left-[12%] animate-water-orb hidden sm:block opacity-90">
                <WaterOrb size="w-14 h-14 lg:w-20 lg:h-20" />
            </div>

            <div className="absolute top-[26%] right-[8%] sm:right-[12%] animate-water-orb-delayed hidden sm:block opacity-90">
                <WaterOrb size="w-16 h-16 lg:w-24 lg:h-24" />
            </div>

            <div className="absolute top-[10%] sm:top-[12%] -left-20 sm:-left-12 lg:-left-4 w-[340px] sm:w-[460px] lg:w-[540px] animate-cloud-left opacity-95">
                <VolumetricCloud variant="large-left" />
            </div>

            <div className="absolute top-[18%] sm:top-[18%] -right-20 sm:-right-12 lg:-right-4 w-[320px] sm:w-[440px] lg:w-[520px] animate-cloud-right opacity-95">
                <VolumetricCloud flip variant="large-right" />
            </div>

            <div className="absolute top-[5%] left-[28%] sm:left-[34%] w-[130px] sm:w-[170px] animate-cloud-small-1 opacity-80">
                <VolumetricCloud variant="small-1" />
            </div>

            <div className="absolute top-[48%] right-[16%] sm:right-[22%] w-[120px] sm:w-[150px] animate-cloud-small-2 opacity-70">
                <VolumetricCloud flip variant="small-2" />
            </div>

            <div className="absolute top-[68%] left-[16%] sm:left-[24%] w-[140px] sm:w-[180px] animate-cloud-small-3 opacity-75">
                <VolumetricCloud variant="small-3" />
            </div>

            <div className="absolute top-[82%] right-[28%] sm:right-[34%] w-[110px] sm:w-[140px] animate-cloud-small-4 opacity-70">
                <VolumetricCloud variant="small-4" />
            </div>
        </div>
    );
};

export default SkyBackground;
