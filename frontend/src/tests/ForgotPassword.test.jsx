import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';
import { supabase } from '../services/supabase';

vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn(),
    },
  },
}));

describe('ForgotPassword Page Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. Renderiza o formulário de recuperação de senha corretamente', () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /recuperar senha/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seuemail@exemplo\.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar link de recuperação/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument();
  });

  it('2. Valida campo de e-mail vazio e exibe mensagem amigável', async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /enviar link de recuperação/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/por favor, informe o seu endereço de e-mail/i)).toBeInTheDocument();
    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('3. Valida formato inválido de e-mail', async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/seuemail@exemplo\.com/i);
    fireEvent.change(emailInput, { target: { value: 'emailinvalido' } });

    const submitBtn = screen.getByRole('button', { name: /enviar link de recuperação/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/por favor, insira um formato de e-mail válido/i)).toBeInTheDocument();
    expect(supabase.auth.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it('4. Exibe mensagem de erro se o Supabase falhar', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({
      error: { message: 'Usuário não encontrado na base de dados.' },
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/seuemail@exemplo\.com/i);
    fireEvent.change(emailInput, { target: { value: 'naoexiste@exemplo.com' } });

    const submitBtn = screen.getByRole('button', { name: /enviar link de recuperação/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/usuário não encontrado na base de dados/i)).toBeInTheDocument();
  });

  it('5. Exibe tela de sucesso com orbe e orientações ao enviar com êxito', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({
      error: null,
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/seuemail@exemplo\.com/i);
    fireEvent.change(emailInput, { target: { value: 'usuario@exemplo.com' } });

    const submitBtn = screen.getByRole('button', { name: /enviar link de recuperação/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verifique o seu e-mail/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/enviamos um link com as instruções de redefinição para/i)).toBeInTheDocument();
    expect(screen.getByText('usuario@exemplo.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar para outro e-mail/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /enviar para outro e-mail/i }));
    expect(screen.getByRole('heading', { name: /recuperar senha/i })).toBeInTheDocument();
  });
});
