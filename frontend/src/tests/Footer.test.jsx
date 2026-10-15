import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../components/Footer';

describe('Footer Component Tests', () => {
  it('renderiza o footer na pagina inicial', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('Documentação API')).toBeInTheDocument();
    expect(screen.getByText('Termos de Uso')).toBeInTheDocument();
    expect(screen.getByText('Política de Privacidade')).toBeInTheDocument();
    expect(screen.getByText(/SkyRipple Inc/)).toBeInTheDocument();
  });

  it('renderiza o footer na pagina /rooms', () => {
    render(
      <MemoryRouter initialEntries={['/rooms']}>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText('Documentação API')).toBeInTheDocument();
  });

  it('nao renderiza o footer na rota /directs', () => {
    render(
      <MemoryRouter initialEntries={['/directs']}>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.queryByText('Documentação API')).not.toBeInTheDocument();
    expect(screen.queryByText(/SkyRipple Inc/)).not.toBeInTheDocument();
  });

  it('nao renderiza o footer na rota /direct', () => {
    render(
      <MemoryRouter initialEntries={['/direct']}>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.queryByText('Documentação API')).not.toBeInTheDocument();
  });

  it('nao renderiza o footer na rota /directs com sub-rotas ou trailing slash', () => {
    render(
      <MemoryRouter initialEntries={['/directs/user123']}>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.queryByText('Documentação API')).not.toBeInTheDocument();
  });

  it('nao renderiza o footer nas rotas /chat e /favorites', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/chat']}>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.queryByText('Documentação API')).not.toBeInTheDocument();
    unmount();

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.queryByText('Documentação API')).not.toBeInTheDocument();
  });
});
