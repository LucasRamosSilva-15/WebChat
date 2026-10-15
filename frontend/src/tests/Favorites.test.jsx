import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Favorites from '../pages/Favorites';
import { apiRequest } from '../services/api';

vi.mock('../services/api', () => ({
  apiRequest: vi.fn(),
  BACKEND_URL: 'http://localhost:3001'
}));

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate
  };
});

describe('Favorites Page Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('chat_displayName', 'Lucas Ramos');
    apiRequest.mockResolvedValue([]);
  });

  it('renderiza o titulo Favoritos e o estado vazio inicial de salas', async () => {
    apiRequest.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Favoritos' })).toBeInTheDocument();
      expect(screen.getByText('Nenhuma sala favoritada')).toBeInTheDocument();
      expect(screen.getByText('Explorar Salas')).toBeInTheDocument();
    });
  });

  it('exibe as salas favoritadas vindas do localStorage e API', async () => {
    localStorage.setItem('chat_favorites', JSON.stringify(['tecnologia']));
    apiRequest.mockImplementation((endpoint) => {
      if (endpoint === '/rooms') {
        return Promise.resolve([
          {
            roomParam: 'tecnologia',
            name: 'Tecnologia Geral',
            description: 'Sala de tecnologia e inovação',
            category: 'Tecnologia',
            user_count: 5
          }
        ]);
      }
      return Promise.resolve({ rooms: [], messages: [] });
    });

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Tecnologia Geral')).toBeInTheDocument();
      expect(screen.getByText('Sala de tecnologia e inovação')).toBeInTheDocument();
      expect(screen.getByText('Entrar')).toBeInTheDocument();
    });
  });

  it('permite alternar para a aba de mensagens salvas', async () => {
    localStorage.setItem('chat_saved_messages', JSON.stringify([
      {
        id: 1,
        sender: 'Carlos',
        text: 'Esta é uma anotação importante.',
        roomName: 'Tecnologia',
        time: '14:30'
      }
    ]));
    apiRequest.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'Favoritos' })).toBeInTheDocument();
    });

    const messagesTabButton = screen.getByRole('button', { name: /Mensagens Salvas/i });
    fireEvent.click(messagesTabButton);

    await waitFor(() => {
      expect(screen.getByText('Esta é uma anotação importante.')).toBeInTheDocument();
      expect(screen.getByText('Carlos')).toBeInTheDocument();
      expect(screen.getByText('Copiar')).toBeInTheDocument();
    });
  });

  it('permite desfavoritar uma sala da lista', async () => {
    localStorage.setItem('chat_favorites', JSON.stringify(['jogos']));
    apiRequest.mockImplementation((endpoint) => {
      if (endpoint === '/rooms') {
        return Promise.resolve([
          {
            roomParam: 'jogos',
            name: 'Jogos Online',
            description: 'Sala de games',
            category: 'Jogos'
          }
        ]);
      }
      return Promise.resolve({ rooms: [], messages: [] });
    });

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Jogos Online')).toBeInTheDocument();
    });

    const unfavoriteBtn = screen.getByLabelText('Remover sala dos favoritos');
    fireEvent.click(unfavoriteBtn);

    await waitFor(() => {
      expect(screen.getByText('Nenhuma sala favoritada')).toBeInTheDocument();
    });

    const updated = JSON.parse(localStorage.getItem('chat_favorites'));
    expect(updated).toEqual([]);
  });

  it('carrega favoritos diretamente do backend', async () => {
    apiRequest.mockImplementation((endpoint) => {
      if (endpoint === '/favorites') {
        return Promise.resolve({
          rooms: [
            {
              id: 'fav-1',
              roomId: 'cinema',
              name: 'Clube do Cinema',
              description: 'Filmes e séries',
              category: 'Cinema'
            }
          ],
          messages: [
            {
              id: 'fav-msg-1',
              messageId: 'm-100',
              sender: 'Ana',
              text: 'Recomendo Interestelar!',
              roomName: 'Cinema',
              time: '20:00'
            }
          ]
        });
      }
      if (endpoint === '/rooms') {
        return Promise.resolve([
          {
            roomParam: 'cinema',
            name: 'Clube do Cinema',
            description: 'Filmes e séries',
            category: 'Cinema'
          }
        ]);
      }
      return Promise.resolve([]);
    });

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <Favorites />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Clube do Cinema')).toBeInTheDocument();
    });

    const messagesTabButton = screen.getByRole('button', { name: /Mensagens Salvas/i });
    fireEvent.click(messagesTabButton);

    await waitFor(() => {
      expect(screen.getByText('Recomendo Interestelar!')).toBeInTheDocument();
      expect(screen.getByText('Ana')).toBeInTheDocument();
    });
  });
});
