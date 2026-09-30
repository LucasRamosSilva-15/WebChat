import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ChatSidebar from '../components/ChatSidebar';

describe('ChatSidebar Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('chat_displayName', 'Lucas Ramos');
  });

  it('renders all navigation items correctly', () => {
    render(
      <MemoryRouter initialEntries={['/chat']}>
        <ChatSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Salas')).toBeInTheDocument();
    expect(screen.getByText('Diretas')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('renders disabled items correctly', () => {
    render(
      <MemoryRouter initialEntries={['/rooms']}>
        <ChatSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Favoritos (Em breve)')).toBeInTheDocument();
    expect(screen.getByText('Ajustes (Em breve)')).toBeInTheDocument();
  });

  it('renders the user profile info in the footer', () => {
    render(
      <MemoryRouter initialEntries={['/rooms']}>
        <ChatSidebar />
      </MemoryRouter>
    );

    expect(screen.getByText('Lucas Ramos')).toBeInTheDocument();
    expect(screen.getByText('Online')).toBeInTheDocument();
  });
});
