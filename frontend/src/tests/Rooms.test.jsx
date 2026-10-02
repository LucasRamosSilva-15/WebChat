import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Rooms from '../pages/Rooms';
import { apiRequest } from '../services/api';

vi.mock('../services/api', () => ({
  apiRequest: vi.fn(),
  BACKEND_URL: 'http://localhost:3001'
}));

vi.mock('../socket', () => ({
  socket: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
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

describe('Rooms Component Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('1. Renderiza Skeleton Loader enquanto aguarda a API', async () => {
    let resolveApi;
    apiRequest.mockImplementation(() => new Promise((resolve) => {
      resolveApi = resolve;
    }));

    render(
      <MemoryRouter>
        <Rooms />
      </MemoryRouter>
    );

    expect(screen.getByText('Carregando salas...')).toBeInTheDocument();

    resolveApi([]);
  });

  it('2. Renderiza as salas e as estatísticas vindas da API', async () => {
    apiRequest.mockImplementation((url) => {
      if (url === '/rooms') {
        return Promise.resolve([
          { id: 1, name: 'Sala Teste', description: 'Teste', category: 'Jogos', members_count: 5, created_at: new Date().toISOString() }
        ]);
      }
      if (url === '/stats') {
        return Promise.resolve({ total_users: 100, active_rooms: 1, pending_reports: 0 });
      }
      return Promise.resolve();
    });

    render(
      <MemoryRouter>
        <Rooms />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Carregando salas...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Sala Teste')).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'Jogos' })).toBeInTheDocument();

    expect(screen.getByText('100')).toBeInTheDocument(); // total users
  });

  it('3. Trata e exibe tela de erro se a API falhar', async () => {
    apiRequest.mockRejectedValue(new Error('Falha no Servidor'));

    render(
      <MemoryRouter>
        <Rooms />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Não foi possível carregar as salas.')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
  });

  it('4. Criação de Sala: Não permite criar se nome for vazio', async () => {
    apiRequest.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <Rooms />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Carregando salas...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /criar sala/i }));
    expect(screen.getByText('Criar Nova Sala')).toBeInTheDocument();

    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: '   ' } });

    const submitBtn = screen.getAllByRole('button', { name: /criar sala/i })[0];
    fireEvent.submit(submitBtn.closest('form'));
    expect(apiRequest).toHaveBeenCalledTimes(2);
  });

  it('5. Criação de Sala: Envia request para API e redireciona', async () => {
    apiRequest.mockImplementation((url, options) => {
      if (url === '/rooms' && !options) return Promise.resolve([]);
      if (url === '/stats') return Promise.resolve({});

      if (url === '/rooms' && options?.method === 'POST') {
        return Promise.resolve({
          id: 99,
          name: 'Sala Criada',
          description: 'Desc',
          category: 'Arte',
          members_count: 1,
          created_at: new Date().toISOString()
        });
      }
      return Promise.resolve();
    });

    render(
      <MemoryRouter>
        <Rooms />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText('Carregando salas...')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /criar sala/i }));

    const inputs = screen.getAllByRole('textbox');

    fireEvent.change(inputs[0], { target: { value: 'Nova Sala' } });
    fireEvent.change(inputs[1], { target: { value: 'Descrição da Sala' } });

    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'Arte' } });

    const submitBtn = screen.getAllByRole('button', { name: /criar sala/i })[0];
    fireEvent.submit(submitBtn.closest('form'));

    await waitFor(() => {
      expect(apiRequest).toHaveBeenCalledWith('/rooms', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('Nova Sala')
      }));
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/chat?room=99');
  });
});
