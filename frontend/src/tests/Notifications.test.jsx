import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { NotificationProvider } from '../context/NotificationContext';
import NotificationsDropdown from '../components/NotificationsDropdown';

describe('Notifications System & Dropdown', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('renderiza o botão de sino e o badge de notificações não lidas', () => {
        render(
            <NotificationProvider>
                <MemoryRouter>
                    <NotificationsDropdown />
                </MemoryRouter>
            </NotificationProvider>
        );

        const bellButton = screen.getByLabelText(/Abrir Notificações/i);
        expect(bellButton).toBeInTheDocument();

        const badges = screen.getAllByText('2');
        expect(badges.length).toBeGreaterThan(0);
    });

    it('abre a caixinha de notificações ao clicar no sino', () => {
        render(
            <NotificationProvider>
                <MemoryRouter>
                    <NotificationsDropdown />
                </MemoryRouter>
            </NotificationProvider>
        );

        const bellButton = screen.getByLabelText(/Abrir Notificações/i);
        fireEvent.click(bellButton);

        expect(screen.getByText('Notificações')).toBeInTheDocument();
        expect(screen.getByText(/Boas-vindas ao SkyRipple/i)).toBeInTheDocument();
        expect(screen.getByText(/Novo limitador de mensagens/i)).toBeInTheDocument();
    });

    it('permite alternar abas de filtro (Todas, Não Lidas, Sistema)', () => {
        render(
            <NotificationProvider>
                <MemoryRouter>
                    <NotificationsDropdown />
                </MemoryRouter>
            </NotificationProvider>
        );

        const bellButton = screen.getByLabelText(/Abrir Notificações/i);
        fireEvent.click(bellButton);

        const unreadTab = screen.getByRole('button', { name: /Não Lidas/i });
        fireEvent.click(unreadTab);

        expect(screen.getByText(/Boas-vindas ao SkyRipple/i)).toBeInTheDocument();
        expect(screen.getByText(/Novo limitador de mensagens/i)).toBeInTheDocument();

        const systemTab = screen.getByRole('button', { name: /Sistema/i });
        fireEvent.click(systemTab);

        expect(screen.getByText(/Boas-vindas ao SkyRipple/i)).toBeInTheDocument();
    });

    it('marca todas as notificações como lidas', () => {
        render(
            <NotificationProvider>
                <MemoryRouter>
                    <NotificationsDropdown />
                </MemoryRouter>
            </NotificationProvider>
        );

        const bellButton = screen.getByLabelText(/Abrir Notificações/i);
        fireEvent.click(bellButton);

        const markAllButton = screen.getByLabelText(/Marcar todas como lidas/i);
        fireEvent.click(markAllButton);

        expect(screen.getByText(/Em dia/i)).toBeInTheDocument();
        expect(screen.queryByText('2')).not.toBeInTheDocument();
    });
});
