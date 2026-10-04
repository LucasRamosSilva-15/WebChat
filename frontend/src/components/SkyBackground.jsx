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
            className={`relative rounded-full pointer-events-none select-none shadow-[inset_-3px_-5px_12px_rgba(2,132,199,0.5),inset_2px_3px_6px_rgba(255,255,255,0.95),0_8px_20px_rgba(14,165,233,0.25)] dark:shadow-[inset_-2px_-4px_10px_rgba(0,0,0,0.6),inset_1px_2px_4px_rgba(255,255,255,0.12)] border border-white/70 dark:border-white/15 backdrop-blur-[2px] bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.3)_25%,rgba(56,189,248,0.35)_55%,rgba(2,132,199,0.5)_85%,rgba(3,105,161,0.7)_100%)] dark:bg-[radial-gradient(circle_at_35%_25%,rgba(255,255,255,0.18)_0%,rgba(30,41,59,0.4)_45%,rgba(15,23,42,0.75)_100%)] ${size} ${className}`}
        >
            <div
                className="absolute top-[16%] left-[20%] w-[38%] h-[24%] rounded-full bg-white/95 shadow-[0_0_8px_rgba(255,255,255,0.8)] dark:bg-white/20 dark:shadow-none"
                style={{
                    transform: 'rotate(-32deg)',
                    filter: 'blur(0.5px)',
                }}
            />
            <div className="absolute bottom-[14%] right-[22%] w-[20%] h-[14%] rounded-full bg-white/50 dark:bg-white/10" />
        </div>
    );
};

const SkyBackground = () => {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                <div className="relative flex items-center justify-center">
                    <div className="w-[600px] h-[600px] sm:w-[740px] sm:h-[740px] rounded-full border border-sky-400/15 dark:border-sky-400/8" />

                    <div className="absolute w-[1000px] h-[1000px] sm:w-[1200px] sm:h-[1200px] rounded-full border border-sky-400/10 dark:border-sky-400/5" />

                    <div className="absolute w-[1460px] h-[1460px] sm:w-[1700px] sm:h-[1700px] rounded-full border border-sky-400/8 dark:border-sky-400/3" />
                </div>
            </div>

            <div className="absolute top-[10%] sm:top-[12%] -left-20 sm:-left-12 lg:-left-4 w-[340px] sm:w-[460px] lg:w-[540px] opacity-95 z-10">
                <VolumetricCloud variant="large-left" />
            </div>

            <div className="absolute top-[18%] sm:top-[18%] -right-20 sm:-right-12 lg:-right-4 w-[320px] sm:w-[440px] lg:w-[520px] opacity-95 z-10">
                <VolumetricCloud flip variant="large-right" />
            </div>

            <div className="absolute top-[5%] left-[28%] sm:left-[34%] w-[130px] sm:w-[170px] opacity-80 z-10">
                <VolumetricCloud variant="small-1" />
            </div>

            <div className="absolute top-[48%] right-[16%] sm:right-[22%] w-[120px] sm:w-[150px] opacity-70 z-10">
                <VolumetricCloud flip variant="small-2" />
            </div>

            <div className="absolute top-[68%] left-[16%] sm:left-[24%] w-[140px] sm:w-[180px] opacity-75 z-10">
                <VolumetricCloud variant="small-3" />
            </div>

            <div className="absolute top-[82%] right-[28%] sm:right-[34%] w-[110px] sm:w-[140px] opacity-70 z-10">
                <VolumetricCloud variant="small-4" />
            </div>

            <div className="absolute top-[48%] left-[6%] sm:left-[9%] lg:left-[11%] z-20 opacity-95">
                <WaterOrb size="w-14 h-14 sm:w-16 sm:h-16 lg:w-22 lg:h-22" />
            </div>

            <div className="absolute top-[8%] sm:top-[9%] right-[8%] sm:right-[13%] lg:right-[16%] z-20 opacity-95">
                <WaterOrb size="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" />
            </div>
        </div>
    );
};

export default SkyBackground;
