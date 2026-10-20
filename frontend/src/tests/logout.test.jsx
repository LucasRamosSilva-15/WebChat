import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { supabase } from '../services/supabase';
import { socket } from '../socket';
import { removeAuthToken } from '../services/api';

vi.mock('../services/api', () => ({
  removeAuthToken: vi.fn(),
  apiRequest: vi.fn()
}));

vi.mock('../socket', () => ({
  socket: {
    disconnect: vi.fn(),
    connect: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
}));

vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      signOut: vi.fn().mockResolvedValue({ error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } })
    }
  }
}));

vi.mock('../components/NotificationsDropdown', () => ({
  default: () => <div data-testid="notifications-dropdown">Notifications</div>
}));

vi.mock('../components/UserAvatar', () => ({
  default: ({ name }) => <div data-testid="user-avatar">{name}</div>
}));

describe('Fluxo e Rotinas de Sair da Conta (Logout)', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    supabase.auth.signOut.mockResolvedValue({ error: null });
    localStorage.clear();
    sessionStorage.clear();

    delete window.location;
    window.location = {
      ...originalLocation,
      replace: vi.fn(),
      origin: 'http://localhost:3000',
      pathname: '/rooms'
    };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('1. Executa logout com sucesso ao clicar em Sair da Conta na Navbar', async () => {
    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_token', 'jwt-token-ativo');
    localStorage.setItem('chat_displayName', 'Mariana Silva');
    localStorage.setItem('chat_uniqueUserId', 'user-12345');
    localStorage.setItem('sb-test-auth-token', 'token-supabase');
    localStorage.setItem('chat_role', 'user');
    sessionStorage.setItem('active_session', 'sim');

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const userAvatar = screen.getByTestId('user-avatar');
    expect(userAvatar).toBeInTheDocument();
    fireEvent.click(userAvatar);

    const logoutButtons = screen.getAllByRole('button', { name: /sair da conta/i });
    expect(logoutButtons.length).toBeGreaterThan(0);
    fireEvent.click(logoutButtons[0]);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    expect(socket.disconnect).toHaveBeenCalled();
    expect(removeAuthToken).toHaveBeenCalled();
    expect(localStorage.getItem('chat_token')).toBeNull();
    expect(localStorage.getItem('chat_isLoggedIn')).toBeNull();
    expect(localStorage.getItem('chat_displayName')).toBeNull();
    expect(localStorage.getItem('chat_uniqueUserId')).toBeNull();
    expect(localStorage.getItem('sb-test-auth-token')).toBeNull();
    expect(sessionStorage.getItem('active_session')).toBeNull();
    expect(window.location.replace).toHaveBeenCalledWith('/login');
  });

  it('2. Garante limpeza da sessão e redirecionamento mesmo se o Supabase falhar', async () => {
    supabase.auth.signOut.mockRejectedValue(new Error('Erro de conexão com o Supabase'));

    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_token', 'jwt-token-ativo');
    localStorage.setItem('sb-project-auth-token', 'supabase-key');

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const userAvatar = screen.getByTestId('user-avatar');
    fireEvent.click(userAvatar);

    const logoutButtons = screen.getAllByRole('button', { name: /sair da conta/i });
    fireEvent.click(logoutButtons[0]);

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith('/login');
    });

    expect(socket.disconnect).toHaveBeenCalled();
    expect(removeAuthToken).toHaveBeenCalled();
    expect(localStorage.getItem('chat_token')).toBeNull();
    expect(localStorage.getItem('sb-project-auth-token')).toBeNull();
  });

  it('3. Dispara o evento global profileUpdated para sincronizar a interface ao deslogar', async () => {
    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_displayName', 'Carlos');

    const profileListener = vi.fn();
    window.addEventListener('profileUpdated', profileListener);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const userAvatar = screen.getByTestId('user-avatar');
    fireEvent.click(userAvatar);

    const logoutButtons = screen.getAllByRole('button', { name: /sair da conta/i });
    fireEvent.click(logoutButtons[0]);

    await waitFor(() => {
      expect(profileListener).toHaveBeenCalled();
    });

    window.removeEventListener('profileUpdated', profileListener);
  });

  it('4. Permite acionar logout a partir do menu retrátil da Navbar', async () => {
    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_token', 'jwt-menu-teste');

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const toggleMenuBtn = screen.getByLabelText(/abrir menu/i);
    fireEvent.click(toggleMenuBtn);

    const menuLogoutBtns = screen.getAllByRole('button', { name: /^sair$/i });
    expect(menuLogoutBtns.length).toBeGreaterThan(0);
    fireEvent.click(menuLogoutBtns[0]);

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith('/login');
    });

    expect(localStorage.getItem('chat_token')).toBeNull();
  });

  it('5. Não quebra a rotina de logout caso o Supabase ou socket estejam indisponíveis', async () => {
    const originalAuth = supabase.auth;
    supabase.auth = null;

    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_token', 'token-isolado');

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const userAvatar = screen.getByTestId('user-avatar');
    fireEvent.click(userAvatar);

    const logoutButtons = screen.getAllByRole('button', { name: /sair da conta/i });
    fireEvent.click(logoutButtons[0]);

    expect(localStorage.getItem('chat_token')).toBeNull();
    expect(removeAuthToken).toHaveBeenCalled();

    supabase.auth = originalAuth;
  });

  it('6. Garante que timeout de 2s em signOut lento não trava a saída do usuário', async () => {
    supabase.auth.signOut.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 5000)));

    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_token', 'token-lento');

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const userAvatar = screen.getByTestId('user-avatar');
    fireEvent.click(userAvatar);

    const logoutButtons = screen.getAllByRole('button', { name: /sair da conta/i });
    fireEvent.click(logoutButtons[0]);

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith('/login');
    }, { timeout: 3500 });

    expect(localStorage.getItem('chat_token')).toBeNull();
  });
});
