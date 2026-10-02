import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { apiRequest, setAuthToken } from '../services/api';
import { socket } from '../socket';

// Mock dependencies
vi.mock('../services/api', () => ({
  apiRequest: vi.fn(),
  setAuthToken: vi.fn()
}));

vi.mock('../socket', () => ({
  socket: {
    auth: null,
    connect: vi.fn(),
    disconnect: vi.fn()
  }
}));

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate
  };
});

describe('Authentication Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Login Component', () => {
    it('1. Renderiza o formulário de login corretamente', () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );
      expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continuar/i })).toBeInTheDocument();
    });

    it('2. Mostra mensagem de erro ao falhar na API', async () => {
      apiRequest.mockRejectedValue(new Error('Credenciais inválidas.'));

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'teste@email.com' } });
      fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'senha123' } });
      fireEvent.click(screen.getByRole('button', { name: /continuar/i }));

      await waitFor(() => {
        expect(screen.getByText('Credenciais inválidas.')).toBeInTheDocument();
      });
    });

    it('3. Realiza o login com sucesso, atualiza localStorage, reconecta o socket e redireciona', async () => {
      apiRequest.mockResolvedValue({
        token: 'fake-jwt-token',
        user: { id: 'user-123', name: 'User Test' }
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'teste@email.com' } });
      fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'senha123' } });
      fireEvent.click(screen.getByRole('button', { name: /continuar/i }));

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith('/auth/login', expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'teste@email.com', password: 'senha123' })
        }));
      });

      expect(setAuthToken).toHaveBeenCalledWith('fake-jwt-token');
      expect(localStorage.getItem('chat_isLoggedIn')).toBe('true');
      expect(localStorage.getItem('chat_displayName')).toBe('User Test');
      expect(localStorage.getItem('chat_uniqueUserId')).toBe('user-123');
      
      expect(socket.auth).toEqual({ token: 'fake-jwt-token' });
      expect(socket.disconnect).toHaveBeenCalled();
      expect(socket.connect).toHaveBeenCalled();
      
      expect(mockedNavigate).toHaveBeenCalledWith('/rooms');
    });
  });

  describe('Register Component', () => {
    it('1. Renderiza o formulário de cadastro', () => {
      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );
      expect(screen.getByPlaceholderText(/nome de usuário/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e-mail/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^cadastrar$/i })).toBeInTheDocument();
    });

    it('2. Botão cadastrar fica desabilitado se não aceitar os termos', async () => {
      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/nome de usuário/i), { target: { value: 'User' } });
      fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'test@test.com' } });
      fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'senha123' } });
      
      const submitBtn = screen.getByRole('button', { name: /^cadastrar$/i });
      expect(submitBtn).toBeDisabled();

      // Check one, still disabled
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      expect(submitBtn).toBeDisabled();

      // Check both, now enabled
      fireEvent.click(checkboxes[1]);
      expect(submitBtn).not.toBeDisabled();
    });

    it('3. Realiza cadastro com sucesso, salva sessão e redireciona', async () => {
      apiRequest.mockResolvedValue({
        token: 'fake-jwt-register',
        user: { id: 'user-456', displayName: 'New User' } // backend can return displayName
      });

      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/nome de usuário/i), { target: { value: 'New User' } });
      fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'new@test.com' } });
      fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'senha123' } });
      
      // Select the checkboxes to accept terms and privacy
      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]); // Termos de uso
      fireEvent.click(checkboxes[1]); // Política de privacidade

      fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }));

      await waitFor(() => {
        expect(apiRequest).toHaveBeenCalledWith('/auth/register', expect.any(Object));
      });

      expect(setAuthToken).toHaveBeenCalledWith('fake-jwt-register');
      expect(localStorage.getItem('chat_isLoggedIn')).toBe('true');
      expect(socket.connect).toHaveBeenCalled();
      expect(mockedNavigate).toHaveBeenCalledWith('/rooms');
    });
  });
});
