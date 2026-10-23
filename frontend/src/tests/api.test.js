import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAuthToken, setAuthToken, removeAuthToken, clearAuthSession, apiRequest, API_URL } from '../services/api';

describe('API Utils Tests', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Auth Token Handlers', () => {
        it('1. Deve salvar, recuperar e remover o token do localStorage corretamente', () => {
            expect(getAuthToken()).toBeNull();

            setAuthToken('test-token-123');
            expect(getAuthToken()).toBe('test-token-123');
            expect(localStorage.getItem('chat_token')).toBe('test-token-123');

            removeAuthToken();
            expect(getAuthToken()).toBeNull();
        });

        it('1b. Deve limpar sessão completa com clearAuthSession', () => {
            localStorage.setItem('chat_token', 'token-123');
            localStorage.setItem('chat_isLoggedIn', 'true');

            clearAuthSession();

            expect(localStorage.getItem('chat_token')).toBeNull();
            expect(localStorage.getItem('chat_isLoggedIn')).toBeNull();
        });
    });

    describe('apiRequest Handler', () => {
        it('2. Deve fazer requisição de sucesso retornando JSON', async () => {
            const mockData = { success: true, data: 'Mock' };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockData
            });

            const result = await apiRequest('/test-endpoint');

            expect(fetch).toHaveBeenCalledWith(`${API_URL}/test-endpoint`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            expect(result).toEqual(mockData);
        });

        it('3. Deve injetar Authorization Bearer header se token existir', async () => {
            setAuthToken('my-secret-token');

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

            await apiRequest('/secure-endpoint');

            expect(fetch).toHaveBeenCalledWith(`${API_URL}/secure-endpoint`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer my-secret-token'
                }
            });
        });

        it('4. Deve mesclar custom headers preservando o Authorization', async () => {
            setAuthToken('token');

            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({})
            });

            await apiRequest('/upload', {
                headers: {
                    'X-Custom-Header': 'CustomValue'
                }
            });

            expect(fetch).toHaveBeenCalledWith(`${API_URL}/upload`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer token',
                    'X-Custom-Header': 'CustomValue'
                }
            });
        });

        it('5. Deve lançar Erro extraído do JSON quando response.ok for falso', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                json: async () => ({ error: 'Senha incorreta!' })
            });

            await expect(apiRequest('/login')).rejects.toThrow('Senha incorreta!');
        });

        it('6. Deve lançar Erro usando statusText se não houver JSON no erro', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                statusText: 'Internal Server Error',
                json: async () => { throw new Error('Não é JSON valid') }
            });

            await expect(apiRequest('/crash')).rejects.toThrow('Internal Server Error');
        });

        it('7. Deve limpar token e sessão quando receber 401 com token expirado em rota protegida', async () => {
            localStorage.setItem('chat_token', 'expired-token');
            localStorage.setItem('chat_isLoggedIn', 'true');

            fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({ error: 'Token inválido ou expirado.' })
            });

            await expect(apiRequest('/rooms')).rejects.toThrow('Token inválido ou expirado.');
            expect(localStorage.getItem('chat_token')).toBeNull();
            expect(localStorage.getItem('chat_isLoggedIn')).toBeNull();
        });

        it('8. Deve anexar status e response ao erro lançado', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({ error: 'Recurso não encontrado' })
            });

            try {
                await apiRequest('/nao-existe');
                expect.unreachable('Deveria ter lançado erro');
            } catch (err) {
                expect(err.message).toBe('Recurso não encontrado');
                expect(err.status).toBe(404);
                expect(err.response?.status).toBe(404);
            }
        });
    });

    describe('checkBackendHealth', () => {
        it('deve apontar para /api/health e retornar true no sucesso', async () => {
            const { checkBackendHealth } = await import('../services/api');
            fetch.mockResolvedValueOnce({ ok: true });
            const result = await checkBackendHealth();
            expect(result).toBe(true);
            expect(fetch).toHaveBeenCalledWith(`${API_URL}/health`);
        });

        it('deve retornar false quando a requisição falha', async () => {
            const { checkBackendHealth } = await import('../services/api');
            fetch.mockRejectedValueOnce(new Error('Network error'));
            const result = await checkBackendHealth();
            expect(result).toBe(false);
        });
    });
});

