import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Chat from '../pages/Chat';
import { socket } from '../socket';
import * as api from '../services/api';

jest.mock('../socket', () => ({
  socket: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    disconnect: jest.fn()
  }
}));

jest.mock('../services/api', () => ({
  apiRequest: jest.fn(),
  getAuthToken: jest.fn()
}));

const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning: ReactDOM.render is no longer supported/.test(args[0])) return;
    if (/An update to Chat inside a test was not wrapped in act/.test(args[0])) return;
    if (/Erro ao carregar mensagens/.test(args[0])) return;
    originalError.call(console, ...args);
  };
});
afterAll(() => {
  console.error = originalError;
});

describe('Chat Component Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    api.apiRequest.mockImplementation(async (url) => {
      if (url.includes('/messages')) {
        return [];
      }
      if (url.includes('/rooms/')) {
        return { name: 'Sala de Teste', description: 'Sala mockada' };
      }
      return {};
    });

    localStorage.setItem('chat_uniqueUserId', 'test-user-id');
    localStorage.setItem('chat_displayName', 'Usuário Teste');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the chat error state if no room is provided', () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <Routes>
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Sala inválida')).toBeInTheDocument();
  });

  it('should send a message, emit via socket, and display it when received', async () => {
    let receiveMessageCallback;
    socket.on.mockImplementation((event, cb) => {
      if (event === 'receive_message') {
        receiveMessageCallback = cb;
      }
    });

    render(
      <MemoryRouter initialEntries={['/chat?room=general']}>
        <Routes>
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Entrar na Sala', { selector: 'button' })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Entrar na Sala', { selector: 'button' }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Digite uma mensagem...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Digite uma mensagem...');
    const sendButton = screen.getByTitle('Enviar Mensagem');

    fireEvent.change(input, { target: { value: 'Olá mundo!' } });
    expect(input.value).toBe('Olá mundo!');

    fireEvent.click(sendButton);

    expect(socket.emit).toHaveBeenCalledWith("send_message", expect.objectContaining({
      room: 'general',
      content: 'Olá mundo!',
      userId: 'test-user-id'
    }));

    expect(input.value).toBe('');

    act(() => {
      if (receiveMessageCallback) {
        receiveMessageCallback({
          id: 'msg-123',
          room_id: 'general',
          user_id: 'test-user-id',
          user_name: 'Usuário Teste',
          content: 'Olá mundo!',
          created_at: new Date().toISOString()
        });
      }
    });

    expect(screen.getByText('Olá mundo!')).toBeInTheDocument();
    expect(screen.getByText('Usuário Teste')).toBeInTheDocument();
  });
});
