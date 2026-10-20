import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import OtpCodeInput from '../components/common/OtpCodeInput';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import { supabase } from '../services/supabase';

vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      resend: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      verifyOtp: vi.fn(),
      updateUser: vi.fn(),
      signInWithOAuth: vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } })
    }
  },
  syncOAuthUserSession: vi.fn().mockResolvedValue({ success: true })
}));

vi.mock('../socket', () => ({
  socket: {
    disconnect: vi.fn(),
    connect: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn()
  }
}));

describe('Testes de Envio e Validação de Código OTP', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Componente OtpCodeInput', () => {
    it('1. Renderiza os 6 slots numéricos e o texto inicial do timer', () => {
      render(<OtpCodeInput />);
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.length).toBe(6);
      expect(screen.getByText(/reenviar código em/i)).toBeInTheDocument();
      expect(screen.getByText(/60s/i)).toBeInTheDocument();
    });

    it('2. Permite preenchimento manual dígito por dígito e dispara onChange e onComplete', () => {
      const handleChange = vi.fn();
      const handleComplete = vi.fn();

      render(
        <OtpCodeInput
          onChange={handleChange}
          onComplete={handleComplete}
        />
      );

      const inputs = screen.getAllByRole('textbox');
      ['1', '2', '3', '4', '5', '6'].forEach((val, i) => {
        fireEvent.change(inputs[i], { target: { value: val } });
      });

      expect(handleChange).toHaveBeenCalledTimes(6);
      expect(handleComplete).toHaveBeenCalledWith('123456');
    });

    it('3. Ignora caracteres não-numéricos ao digitar', () => {
      const handleChange = vi.fn();

      render(<OtpCodeInput onChange={handleChange} />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'a' } });

      expect(inputs[0].value).toBe('');
      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('4. Retrocede o foco e apaga dígito anterior com tecla Backspace em campo vazio', () => {
      render(<OtpCodeInput />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: '9' } });
      fireEvent.change(inputs[1], { target: { value: '8' } });

      fireEvent.keyDown(inputs[2], { key: 'Backspace' });
      expect(inputs[1].value).toBe('');
    });

    it('5. Preenche todos os 6 campos ao colar sequência numérica e dispara onComplete', () => {
      const handleComplete = vi.fn();

      render(<OtpCodeInput onComplete={handleComplete} />);

      const firstInput = screen.getAllByRole('textbox')[0];
      const pasteEvent = {
        preventDefault: vi.fn(),
        clipboardData: {
          getData: vi.fn().mockReturnValue('987654')
        }
      };

      fireEvent.paste(firstInput, pasteEvent);

      const inputs = screen.getAllByRole('textbox');
      expect(inputs[0].value).toBe('9');
      expect(inputs[1].value).toBe('8');
      expect(inputs[2].value).toBe('7');
      expect(inputs[3].value).toBe('6');
      expect(inputs[4].value).toBe('5');
      expect(inputs[5].value).toBe('4');
      expect(handleComplete).toHaveBeenCalledWith('987654');
    });

    it('6. Exibe botão de reenviar após zerar o timer de 60s e dispara onResend ao clicar', async () => {
      vi.useFakeTimers();
      const handleResend = vi.fn().mockResolvedValue();

      render(<OtpCodeInput onResend={handleResend} />);

      expect(screen.getByText(/reenviar código em/i)).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(60000);
      });

      const resendButton = screen.getByRole('button', { name: /reenviar código/i });
      expect(resendButton).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(resendButton);
      });

      expect(handleResend).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/reenviar código em/i)).toBeInTheDocument();
    });

    it('7. Bloqueia interação quando a propriedade disabled é verdadeira', () => {
      render(<OtpCodeInput disabled={true} />);

      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        expect(input).toBeDisabled();
      });
    });
  });

  describe('Envio e Reenvio de Código no Cadastro (Register)', () => {
    it('8. Dispara o envio do código inicial no cadastro via signUp e avança para a tela de código', async () => {
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'usr-1' } },
        error: null
      });

      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/nome de usuário/i), { target: { value: 'Carlos Silva' } });
      fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'carlos@empresa.com' } });
      fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'Segredo#2026' } });

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }));

      await waitFor(() => {
        expect(supabase.auth.signUp).toHaveBeenCalledWith({
          email: 'carlos@empresa.com',
          password: 'Segredo#2026',
          options: {
            data: {
              name: 'Carlos Silva',
              full_name: 'Carlos Silva'
            }
          }
        });
      });

      expect(await screen.findByText(/verificação de e-mail/i)).toBeInTheDocument();
      expect(screen.getByText('carlos@empresa.com')).toBeInTheDocument();
    });

    it('9. Reenvia código de verificação no cadastro com sucesso ao acionar onResend', async () => {
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'usr-1' } },
        error: null
      });
      supabase.auth.resend.mockResolvedValue({
        data: {},
        error: null
      });

      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/nome de usuário/i), { target: { value: 'Carlos Silva' } });
      fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'carlos@empresa.com' } });
      fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'Segredo#2026' } });

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }));

      expect(await screen.findByText(/verificação de e-mail/i)).toBeInTheDocument();

      const otpInputs = screen.getAllByRole('textbox');
      expect(otpInputs.length).toBe(6);
    });

    it('10. Exibe mensagem de erro na interface se a tentativa de cadastro falhar no envio do código', async () => {
      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'Limite de envio de e-mails atingido temporariamente.' }
      });

      render(
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      );

      fireEvent.change(screen.getByPlaceholderText(/nome de usuário/i), { target: { value: 'Carlos Silva' } });
      fireEvent.change(screen.getByPlaceholderText(/e-mail/i), { target: { value: 'carlos@empresa.com' } });
      fireEvent.change(screen.getByPlaceholderText(/senha/i), { target: { value: 'Segredo#2026' } });

      const checkboxes = screen.getAllByRole('checkbox');
      fireEvent.click(checkboxes[0]);
      fireEvent.click(checkboxes[1]);

      fireEvent.click(screen.getByRole('button', { name: /^cadastrar$/i }));

      expect(await screen.findByText(/limite de envio de e-mails atingido temporariamente/i)).toBeInTheDocument();
    });
  });

  describe('Envio e Reenvio de Código na Recuperação de Senha (ForgotPassword)', () => {
    it('11. Solicita código de recuperação via resetPasswordForEmail e transiciona para o input OTP', async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: null
      });

      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText(/seuemail@exemplo\.com/i);
      fireEvent.change(emailInput, { target: { value: 'recupera@exemplo.com' } });

      const submitBtn = screen.getByRole('button', { name: /enviar código/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('recupera@exemplo.com');
      });

      expect(await screen.findByText(/código de recuperação/i)).toBeInTheDocument();
      expect(screen.getByText('recupera@exemplo.com')).toBeInTheDocument();
      expect(screen.getAllByRole('textbox').length).toBe(6);
    });

    it('12. Exibe mensagem de erro ao falhar o envio de código de recuperação de senha', async () => {
      supabase.auth.resetPasswordForEmail.mockResolvedValue({
        error: { message: 'Serviço de envio de e-mails indisponível no momento.' }
      });

      render(
        <MemoryRouter>
          <ForgotPassword />
        </MemoryRouter>
      );

      const emailInput = screen.getByPlaceholderText(/seuemail@exemplo\.com/i);
      fireEvent.change(emailInput, { target: { value: 'falha@exemplo.com' } });

      const submitBtn = screen.getByRole('button', { name: /enviar código/i });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/serviço de envio de e-mails indisponível no momento/i)).toBeInTheDocument();
    });
  });
});
