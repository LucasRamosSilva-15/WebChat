import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate
  };
});

describe('Home Component Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    mockedNavigate.mockClear();
  });

  it('1. Renderiza os botões públicos para usuário não autenticado', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/O seu espaço para conversas em tempo real/i)).toBeInTheDocument();
    
    const registerBtn = screen.getByText('Criar conta gratuita');
    const loginBtn = screen.getByText('Já tenho conta');

    expect(registerBtn).toBeInTheDocument();
    expect(loginBtn).toBeInTheDocument();

    expect(screen.queryByText('Explorar Salas')).not.toBeInTheDocument();
    expect(screen.queryByText('Mensagens Diretas')).not.toBeInTheDocument();

    fireEvent.click(registerBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/register');

    fireEvent.click(loginBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('2. Renderiza botões e boas-vindas quando o usuário possui sessão ativa', () => {
    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_token', 'mock_jwt_token');
    localStorage.setItem('chat_displayName', 'Mariana');

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(screen.getByText(/Bem-vindo de volta/i)).toBeInTheDocument();
    expect(screen.getByText('Mariana')).toBeInTheDocument();

    const exploreBtn = screen.getByText('Explorar Salas');
    const directsBtn = screen.getByText('Mensagens Diretas');

    expect(exploreBtn).toBeInTheDocument();
    expect(directsBtn).toBeInTheDocument();

    expect(screen.queryByText('Criar conta gratuita')).not.toBeInTheDocument();
    expect(screen.queryByText('Já tenho conta')).not.toBeInTheDocument();

    fireEvent.click(exploreBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/rooms');

    fireEvent.click(directsBtn);
    expect(mockedNavigate).toHaveBeenCalledWith('/directs');
  });
});
