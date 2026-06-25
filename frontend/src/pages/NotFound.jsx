import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaHome, FaDoorOpen } from 'react-icons/fa';

const NotFound = () => {
  return (
    <main className="not-found-page flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-[980px] mx-auto min-h-[calc(100vh-160px)]">
      <div className="skeuo-panel not-found-panel reveal w-full max-w-[560px] md:max-w-[600px] p-8 md:p-12 text-center flex flex-col items-center">

        <div className="not-found-orb w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 flex items-center justify-center">
          <FaCompass className="not-found-icon text-4xl md:text-5xl" />
        </div>

        <h1 className="hero-title not-found-code text-[72px] md:text-[88px] mb-0 leading-none">
          404
        </h1>

        <h2 className="pinned-title not-found-title text-2xl md:text-3xl mb-3 mt-2">
          Página não encontrada
        </h2>

        <p className="not-found-desc mb-8 max-w-[420px] mx-auto leading-relaxed text-sm md:text-base">
          Essa página ou sala se perdeu pelo caminho.
        </p>

        <div className="not-found-actions flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Link to="/" className="skeuo-btn not-found-btn w-full sm:w-auto flex items-center justify-center gap-2 py-3 sm:py-2 px-6">
            <FaHome className="text-sm" />
            <span>Voltar ao Início</span>
          </Link>
          <Link to="/rooms" className="btn-secondary-glossy not-found-btn w-full sm:w-auto flex items-center justify-center gap-2 py-3 sm:py-2 px-6">
            <FaDoorOpen className="text-sm" />
            <span>Ir para Salas</span>
          </Link>
        </div>

        <p className="not-found-note text-xs mt-6">
          “Ir para Salas” só é recomendado se você já estiver logado.
        </p>
      </div>
    </main>
  );
};

export default NotFound;
