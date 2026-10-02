import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getAuthToken, setAuthToken, removeAuthToken, apiRequest, API_URL } from '../services/api';

describe('API Utils Tests', () => {
    beforeEach(() => {
        // Limpar localStorage e mockar fetch antes de cada teste
        localStorage.clear();
        vi.stubGlobal('fetch', vi.fn());
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Auth Token Handlers', () => {
        it('1. Deve salvar, recuperar e remover o token do localStorage corretamente', () => {
            // Inicialmente nulo
            expect(getAuthToken()).toBeNull();

            // Salva o token
            setAuthToken('test-token-123');
            expect(getAuthToken()).toBe('test-token-123');
            expect(localStorage.getItem('chat_token')).toBe('test-token-123');

            // Remove o token
            removeAuthToken();
            expect(getAuthToken()).toBeNull();
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
    });
});
