import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaHome, FaDoorOpen } from 'react-icons/fa';

const NotFound = () => {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-[980px] mx-auto min-h-[calc(100vh-160px)]">
      <div className="skeuo-panel rounded-[28px] reveal w-full max-w-[560px] md:max-w-[600px] p-8 md:p-12 text-center flex flex-col items-center">

        <div className="rounded-full bg-gradient-to-b from-white to-gray-50 dark:from-[#2a2a2c] dark:to-[#1e1e20] shadow-[0_4px_10px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,1)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.05)] border border-gray-200 dark:border-white/10 w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 flex items-center justify-center">
          <FaCompass className="text-blue-500/80 dark:text-blue-400/80 drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] text-4xl md:text-5xl" />
        </div>

        <h1 className="hero-title font-bold tracking-tight text-slate-300 dark:text-slate-600 text-[72px] md:text-[88px] mb-0 leading-none">
          404
        </h1>

        <h2 className="pinned-title font-semibold text-2xl md:text-3xl mb-3 mt-2">
          Página não encontrada
        </h2>

        <p className="text-gray-500 dark:text-slate-400 mb-8 max-w-[420px] mx-auto leading-relaxed text-sm md:text-base">
          Essa página ou sala se perdeu pelo caminho.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link to="/" className="skeuo-btn w-full sm:w-auto flex items-center justify-center gap-2 py-3 sm:py-2 px-6">
            <FaHome className="text-sm" />
            <span>Voltar ao Início</span>
          </Link>
          <Link to="/rooms" className="btn-secondary-glossy w-full sm:w-auto flex items-center justify-center gap-2 py-3 sm:py-2 px-6">
            <FaDoorOpen className="text-sm" />
            <span>Ir para Salas</span>
          </Link>
        </div>

        <p className="text-gray-400 dark:text-slate-500 font-medium text-xs mt-6">
          “Ir para Salas” só é recomendado se você já estiver logado.
        </p>
      </div>
    </main>
  );
};

export default NotFound;
