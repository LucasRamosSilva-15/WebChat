import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Chat from '../pages/Chat';
import * as api from '../services/api';

vi.mock('../socket', () => ({
  socket: { emit: vi.fn(), on: vi.fn(), off: vi.fn(), disconnect: vi.fn() }
}));

vi.mock('../services/api', () => ({
  apiRequest: vi.fn(),
  getAuthToken: vi.fn()
}));

const makeMsg = (id, content, iso) => ({
  id, content, user_id: 'other-user', user_name: 'Maria', created_at: iso
});

const renderChat = () =>
  render(
    <MemoryRouter initialEntries={['/chat?room=general']}>
      <Routes>
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </MemoryRouter>
  );

describe('Chat - histórico paginado', () => {
  let calls;

  const setup = (firstPage, olderPage) => {
    calls = [];
    api.apiRequest.mockImplementation(async (url) => {
      calls.push(url);
      if (url.includes('/messages?') && url.includes('before=')) return olderPage;
      if (url.includes('/messages?')) return firstPage;
      if (url.includes('/members')) return [];
      if (url.includes('/rooms/')) return { name: 'Sala de Teste' };
      return {};
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('chat_uniqueUserId', 'test-user-id');
    localStorage.setItem('chat_displayName', 'Usuário Teste');
    localStorage.setItem('chat_joinedRooms', JSON.stringify(['general']));
  });

  afterEach(() => localStorage.clear());

  it('carrega a primeira página com limit=50 e mostra o separador "Hoje"', async () => {
    setup({
      messages: [makeMsg('m1', 'Primeira', new Date().toISOString())],
      hasMore: false,
      nextCursor: null
    });
    renderChat();
    await waitFor(() => expect(screen.getByText('Primeira')).toBeInTheDocument());
    expect(calls.some(u => u.includes('/rooms/general/messages?limit=50'))).toBe(true);
    expect(screen.getByText('Hoje')).toBeInTheDocument();
  });

  it('mostra o marcador de início do histórico quando não há mais mensagens', async () => {
    setup({
      messages: [makeMsg('m1', 'Única', new Date().toISOString())],
      hasMore: false,
      nextCursor: null
    });
    renderChat();
    await waitFor(() =>
      expect(screen.getByText(/Início do histórico da sala alcançado/)).toBeInTheDocument()
    );
  });

  it('ao rolar ao topo busca mensagens anteriores com before e as adiciona antes das atuais', async () => {
    const cursor = '2026-01-02T10:00:00.000Z';
    setup(
      { messages: [makeMsg('m2', 'Recente', new Date().toISOString())], hasMore: true, nextCursor: cursor },
      { messages: [makeMsg('m1', 'Antiga', '2026-01-01T10:00:00.000Z')], hasMore: false, nextCursor: null }
    );
    const { container } = renderChat();
    await waitFor(() => expect(screen.getByText('Recente')).toBeInTheDocument());
    expect(screen.queryByText(/Início do histórico da sala alcançado/)).not.toBeInTheDocument();

    const scroller = container.querySelector('.chat-container');
    fireEvent.scroll(scroller, { target: { scrollTop: 0 } });

    await waitFor(() => expect(screen.getByText('Antiga')).toBeInTheDocument());
    expect(calls.some(u => u.includes(`limit=30&before=${encodeURIComponent(cursor)}`))).toBe(true);

    const all = container.textContent;
    expect(all.indexOf('Antiga')).toBeLessThan(all.indexOf('Recente'));
    await waitFor(() =>
      expect(screen.getByText(/Início do histórico da sala alcançado/)).toBeInTheDocument()
    );
  });

  it('continua aceitando o formato antigo (array simples)', async () => {
    setup([makeMsg('m1', 'Formato antigo', new Date().toISOString())]);
    renderChat();
    await waitFor(() => expect(screen.getByText('Formato antigo')).toBeInTheDocument());
  });

  it('exporta o histórico em .txt', async () => {
    setup({ messages: [makeMsg('m1', 'Exportar', new Date().toISOString())], hasMore: false, nextCursor: null });
    URL.createObjectURL = vi.fn(() => 'blob:x');
    URL.revokeObjectURL = vi.fn();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    renderChat();
    await waitFor(() => expect(screen.getByText('Exportar')).toBeInTheDocument());
    fireEvent.click(screen.getByTitle('Exportar histórico (.txt)'));
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });
});
