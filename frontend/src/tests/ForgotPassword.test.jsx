import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';
import { supabase } from '../services/supabase';

vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: vi.fn(),
      verifyOtp: vi.fn(),
      updateUser: vi.fn(),
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
    expect(screen.getByRole('button', { name: /enviar código/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument();
  });

  it('2. Valida campo de e-mail vazio e exibe mensagem amigável', async () => {
    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /enviar código/i });
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

    const submitBtn = screen.getByRole('button', { name: /enviar código/i });
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

    const submitBtn = screen.getByRole('button', { name: /enviar código/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/usuário não encontrado na base de dados/i)).toBeInTheDocument();
  });

  it('5. Executa o fluxo completo de 3 etapas com verificação de código OTP e redefinição', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({
      error: null,
    });
    supabase.auth.verifyOtp.mockResolvedValue({
      error: null,
      data: { session: { access_token: 'fake-temp-token' } },
    });
    supabase.auth.updateUser.mockResolvedValue({
      error: null,
      data: { user: { id: 'u123' } },
    });

    render(
      <MemoryRouter>
        <ForgotPassword />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText(/seuemail@exemplo\.com/i);
    fireEvent.change(emailInput, { target: { value: 'usuario@exemplo.com' } });

    const submitBtn = screen.getByRole('button', { name: /enviar código/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('usuario@exemplo.com');
    });

    expect(await screen.findByText(/código de recuperação/i)).toBeInTheDocument();
    expect(screen.getByText(/usuario@exemplo\.com/i)).toBeInTheDocument();

    const otpInputs = screen.getAllByRole('textbox');
    expect(otpInputs.length).toBe(6);
    ['6', '5', '4', '3', '2', '1'].forEach((digit, i) => {
      fireEvent.change(otpInputs[i], { target: { value: digit } });
    });

    await waitFor(() => {
      expect(supabase.auth.verifyOtp).toHaveBeenCalledWith({
        email: 'usuario@exemplo.com',
        token: '654321',
        type: 'recovery',
      });
    });

    expect(await screen.findByRole('heading', { name: /defina sua nova senha/i })).toBeInTheDocument();

    const newPasswordInput = screen.getByPlaceholderText(/digite a nova senha/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirme a nova senha/i);

    fireEvent.change(newPasswordInput, { target: { value: 'NovaSenhaForte123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'NovaSenhaForte123' } });

    const savePasswordBtn = screen.getByRole('button', { name: /salvar nova senha/i });
    fireEvent.click(savePasswordBtn);

    await waitFor(() => {
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'NovaSenhaForte123',
      });
    });

    expect(await screen.findByRole('heading', { name: /senha alterada com sucesso!/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ir para o login/i })).toBeInTheDocument();
  });
});
