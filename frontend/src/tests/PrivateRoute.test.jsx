import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from '../components/PrivateRoute';
import { socket } from '../socket';

vi.mock('../socket', () => ({
  socket: {
    connected: false,
    auth: null,
    connect: vi.fn()
  }
}));

const MockChild = () => <div>Acesso Permitido</div>;
const MockLogin = () => <div>Página de Login</div>;

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    socket.connected = false;
  });

  it('1. Redireciona para /login se o usuário NÃO estiver logado', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<MockLogin />} />
          <Route path="/protected" element={<PrivateRoute><MockChild /></PrivateRoute>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByText('Acesso Permitido')).not.toBeInTheDocument();
    expect(socket.connect).not.toHaveBeenCalled();
  });

  it('2. Renderiza o conteúdo se o usuário ESTIVER logado e injeta token no socket', () => {
    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_token', 'jwt-fake-123');

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<MockLogin />} />
          <Route path="/protected" element={<PrivateRoute><MockChild /></PrivateRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Acesso Permitido')).toBeInTheDocument();
    expect(screen.queryByText('Página de Login')).not.toBeInTheDocument();
    
    expect(socket.auth).toEqual({ token: 'jwt-fake-123' });
    expect(socket.connect).toHaveBeenCalled();
  });

  it('3. Renderiza o conteúdo sem reconectar o socket caso ele já esteja conectado', () => {
    localStorage.setItem('chat_isLoggedIn', 'true');
    socket.connected = true;

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<PrivateRoute><MockChild /></PrivateRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Acesso Permitido')).toBeInTheDocument();
    expect(socket.connect).not.toHaveBeenCalled();
  });
});
