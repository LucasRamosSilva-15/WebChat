import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MembersSidebar from '../components/MembersSidebar';
import * as api from '../services/api';

jest.mock('../services/api', () => ({
  apiRequest: jest.fn()
}));

describe('MembersSidebar Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    api.apiRequest.mockImplementation(() => new Promise(() => { }));
    render(<MembersSidebar roomId="test-room" currentUserId="user_1" />);

    expect(screen.getByText('Carregando membros...')).toBeInTheDocument();
  });

  it('renders online and offline members correctly', async () => {
    const mockMembers = [
      { id: 'user_1', name: 'Alice', role: 'owner' },
      { id: 'user_2', name: 'Bob', role: 'user' },
      { id: 'user_3', name: 'Charlie', role: 'user' }
    ];

    api.apiRequest.mockResolvedValue(mockMembers);

    const onlineUsersFromSocket = [
      { id: 'user_1' },
      { id: 'user_2' }
    ];

    render(
      <MembersSidebar
        roomId="test-room"
        currentUserId="user_1"
        onlineUsers={onlineUsersFromSocket}
        onlineCount={2}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Online — 2')).toBeInTheDocument();
      expect(screen.getByText('Offline — 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Você')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getByText('DONO')).toBeInTheDocument();
  });

  it('shows error state if api fails', async () => {
    api.apiRequest.mockRejectedValue(new Error('Network error'));

    render(<MembersSidebar roomId="test-room" currentUserId="user_1" />);

    await waitFor(() => {
      expect(screen.getByText('Falha ao carregar membros')).toBeInTheDocument();
    });
  });

  it('renders empty state if no members found', async () => {
    api.apiRequest.mockResolvedValue([]);

    render(<MembersSidebar roomId="test-room" currentUserId="user_1" />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum membro encontrado')).toBeInTheDocument();
    });
  });
});
