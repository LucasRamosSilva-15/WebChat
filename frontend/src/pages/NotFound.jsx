import React from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaHome, FaDoorOpen } from 'react-icons/fa';

const NotFound = () => {
  return (
    <main className="not-found-page">
      <div className="skeuo-panel not-found-panel reveal">

        <div className="not-found-orb">
          <FaCompass className="not-found-icon" />
        </div>

        <h1 className="hero-title not-found-code">
          404
        </h1>

        <h2 className="pinned-title not-found-title">
          Página não encontrada
        </h2>

        <p className="not-found-desc">
          Essa página ou sala se perdeu pelo caminho.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="skeuo-btn not-found-btn">
            <FaHome className="text-sm" />
            <span>Voltar ao Início</span>
          </Link>
          <Link to="/rooms" className="btn-secondary-glossy not-found-btn">
            <FaDoorOpen className="text-sm" />
            <span>Ir para Salas</span>
          </Link>
        </div>

        <p className="not-found-note">
          “Ir para Salas” só é recomendado se você já estiver logado.
        </p>
      </div>
    </main>
  );
};

export default NotFound;
