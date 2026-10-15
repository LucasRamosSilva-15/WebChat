import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Directs from '../pages/Directs';
import { socket } from '../socket';
import { apiRequest } from '../services/api';

vi.mock('../services/api', () => ({
  apiRequest: vi.fn(),
  BACKEND_URL: 'http://localhost:3001'
}));

vi.mock('../socket', () => ({
  socket: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
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

describe('Directs Page Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('chat_displayName', 'Lucas Ramos');
    localStorage.setItem('chat_uniqueUserId', 'lucas_123');
    apiRequest.mockResolvedValue([]);
  });

  it('renderiza o painel de mensagens diretas e conversas iniciais', () => {
    render(
      <MemoryRouter initialEntries={['/directs']}>
        <Directs />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 2, name: 'Diretas' })).toBeInTheDocument();
    expect(screen.getAllByText('Suporte SkyRipple').length).toBeGreaterThan(0);
    expect(screen.getByText('Moderação Geral')).toBeInTheDocument();
  });

  it('permite selecionar uma conversa e ver o chat ativo', async () => {
    render(
      <MemoryRouter initialEntries={['/directs']}>
        <Directs />
      </MemoryRouter>
    );

    const suporteConv = screen.getAllByText('Suporte SkyRipple')[0];
    fireEvent.click(suporteConv);

    await waitFor(() => {
      expect(screen.getByText('Conversa Direta Privada')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Mensagem para Suporte SkyRipple/i)).toBeInTheDocument();
    });
  });

  it('permite enviar uma mensagem de texto na conversa direta selecionada', async () => {
    render(
      <MemoryRouter initialEntries={['/directs']}>
        <Directs />
      </MemoryRouter>
    );

    const conv = screen.getAllByText('Suporte SkyRipple')[0];
    fireEvent.click(conv);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Mensagem para Suporte SkyRipple/i)).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/Mensagem para Suporte SkyRipple/i);
    fireEvent.change(input, { target: { value: 'Olá equipe de suporte!' } });

    const submitBtn = screen.getByRole('button', { name: 'Enviar mensagem' });
    fireEvent.click(submitBtn);

    expect(socket.emit).toHaveBeenCalled();
  });

  it('permite abrir o modal de nova conversa e criar um novo contato', async () => {
    render(
      <MemoryRouter initialEntries={['/directs']}>
        <Directs />
      </MemoryRouter>
    );

    const newBtn = screen.getByTitle('Nova Mensagem Direta');
    fireEvent.click(newBtn);

    expect(screen.getByText('Nova Conversa Direta')).toBeInTheDocument();

    const nameInput = screen.getByPlaceholderText(/Ex: Carlos, Ana, Suporte.../i);
    fireEvent.change(nameInput, { target: { value: 'Beatriz' } });

    const iniciarBtn = screen.getByRole('button', { name: 'Iniciar' });
    fireEvent.click(iniciarBtn);

    await waitFor(() => {
      expect(screen.getAllByText('Beatriz').length).toBeGreaterThan(0);
      expect(screen.getByPlaceholderText(/Mensagem para Beatriz/i)).toBeInTheDocument();
    });
  });

  it('carrega e mescla conversas vindas da API de diretas', async () => {
    apiRequest.mockImplementation((endpoint) => {
      if (endpoint === '/directs/conversations') {
        return Promise.resolve([
          {
            id: 'server-conv-1',
            name: 'Mariana Silva',
            username: 'mariana',
            avatar: null,
            lastMessage: 'Oi Lucas!',
            time: '15:20',
            online: true,
            unread: 0
          }
        ]);
      }
      return Promise.resolve([]);
    });

    render(
      <MemoryRouter initialEntries={['/directs']}>
        <Directs />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Mariana Silva').length).toBeGreaterThan(0);
    });
  });
});
