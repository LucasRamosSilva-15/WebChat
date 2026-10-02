import React from 'react';
import { render, screen, fireEvent, act, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import Chat from '../pages/Chat';
import { socket } from '../socket';
import * as api from '../services/api';
import CryptoJS from 'crypto-js';

vi.mock('../socket', () => ({
  socket: {
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn()
  }
}));

vi.mock('../services/api', () => ({
  apiRequest: vi.fn(),
  getAuthToken: vi.fn()
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

const SECRET_KEY = "WebChat_E2EE_Secret_Key_Minix";

describe('Chat Component Integration Tests', () => {
  let socketCallbacks = {};

  beforeEach(() => {
    vi.clearAllMocks();
    socketCallbacks = {};

    socket.on.mockImplementation((event, cb) => {
      socketCallbacks[event] = cb;
    });

    api.apiRequest.mockImplementation(async (url) => {
      if (url.includes('/messages')) {
        return [{
          id: 'msg-mock-1',
          content: 'Mensagem Inicial',
          user_id: 'test-user-id',
          user_name: 'Usuário Teste',
          created_at: new Date().toISOString()
        }];
      }
      if (url.includes('/rooms/')) {
        return { name: 'Sala de Teste', description: 'Sala mockada' };
      }
      return {};
    });

    localStorage.setItem('chat_uniqueUserId', 'test-user-id');
    localStorage.setItem('chat_displayName', 'Usuário Teste');
    localStorage.setItem('chat_joinedRooms', JSON.stringify(['general']));
  });

  afterEach(() => {
    localStorage.clear();
  });

  const renderChat = (initialRoute = '/chat?room=general') => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('1. Renderiza o estado de erro se nenhuma sala for fornecida', () => {
    renderChat('/chat');
    expect(screen.getByText('Sala inválida')).toBeInTheDocument();
  });

  it('2. Exibe botão Entrar na Sala se usuário não entrou nela ainda', async () => {
    localStorage.setItem('chat_joinedRooms', JSON.stringify([])); // clear joins

    renderChat();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Entrar na Sala' })).toBeInTheDocument();
    });

    expect(screen.getByText('Você está prestes a entrar nesta sala de bate-papo. Deseja continuar?')).toBeInTheDocument();
  });

  it('3. Envia uma mensagem e atualiza UI (Criptografada e via Socket)', async () => {
    renderChat();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Digite uma mensagem...')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Digite uma mensagem...');
    const sendButton = screen.getByTitle('Enviar Mensagem');

    fireEvent.change(input, { target: { value: 'Olá mundo!' } });
    fireEvent.click(sendButton);

    expect(socket.emit).toHaveBeenCalledWith("send_message", expect.objectContaining({
      room: 'general',
      content: 'Olá mundo!',
      userId: 'test-user-id'
    }));

    act(() => {
      if (socketCallbacks['receive_message']) {
        socketCallbacks['receive_message']({
          id: 'msg-new-123',
          room_id: 'general',
          user_id: 'test-user-id',
          user_name: 'Usuário Teste',
          content: 'Olá mundo!',
          created_at: new Date().toISOString()
        });
      }
    });

    expect(screen.getByText('Olá mundo!')).toBeInTheDocument();
  });

  it('4. Exclui uma mensagem se for do usuário atual', async () => {
    renderChat();

    await waitFor(() => {
      expect(screen.getByText('Mensagem Inicial')).toBeInTheDocument();
    });

    const moreBtns = screen.getAllByRole('button').filter(b => b.className.includes('message-bubble-more-btn'));
    fireEvent.click(moreBtns[0]);

    const deleteBtn = screen.getByText('Apagar');
    expect(deleteBtn).toBeInTheDocument();

    fireEvent.click(deleteBtn);

    expect(socket.emit).toHaveBeenCalledWith("delete_message", expect.objectContaining({
      room: 'general',
      messageId: 'msg-mock-1'
    }));

    act(() => {
      if (socketCallbacks['message_deleted']) {
        socketCallbacks['message_deleted']({ messageId: 'msg-mock-1' });
      }
    });

    expect(screen.queryByText('Mensagem Inicial')).not.toBeInTheDocument();
  });

  it('5. Edita uma mensagem existente', async () => {
    renderChat();

    await waitFor(() => {
      expect(screen.getByText('Mensagem Inicial')).toBeInTheDocument();
    });

    const editBtn = screen.getByText('Editar');
    fireEvent.click(editBtn);

    const input = screen.getByPlaceholderText('Editar mensagem...');
    expect(input.value).toBe('Mensagem Inicial');

    fireEvent.change(input, { target: { value: 'Mensagem Modificada' } });

    const sendButton = screen.getByTitle('Salvar Edição');
    fireEvent.click(sendButton);

    expect(socket.emit).toHaveBeenCalledWith("edit_message", expect.objectContaining({
      room: 'general',
      messageId: 'msg-mock-1'
    }));

    const payload = JSON.stringify({ text: 'Mensagem Modificada', image: null });
    const encryptedMessage = CryptoJS.AES.encrypt(payload, SECRET_KEY).toString();

    act(() => {
      if (socketCallbacks['message_edited']) {
        socketCallbacks['message_edited']({ messageId: 'msg-mock-1', message: encryptedMessage });
      }
    });

    expect(screen.getByText('Mensagem Modificada')).toBeInTheDocument();
    expect(screen.getByText(/\(editada\)/)).toBeInTheDocument();
  });

  it('6. Avalia erro de sala lotada (room_full_error)', async () => {
    renderChat();

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Digite uma mensagem...')).toBeInTheDocument();
    });

    act(() => {
      if (socketCallbacks['room_full_error']) {
        socketCallbacks['room_full_error']({ message: 'A sala está com capacidade máxima.' });
      }
    });

    expect(screen.getByText('Acesso Negado')).toBeInTheDocument();
    expect(screen.getByText('A sala está com capacidade máxima.')).toBeInTheDocument();
  });
});
