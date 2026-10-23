import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchUserPublicKey, clearCryptoCache } from '../services/directCrypto';
import * as apiModule from '../services/api';

describe('directCrypto - fetchUserPublicKey', () => {
  beforeEach(() => {
    clearCryptoCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna null quando userId não é fornecido', async () => {
    const res = await fetchUserPublicKey(null);
    expect(res).toBeNull();
  });

  it('retorna os dados da chave pública quando a chamada tem sucesso', async () => {
    const mockKey = { kty: 'EC', crv: 'P-256', x: 'abc', y: 'def' };
    vi.spyOn(apiModule, 'apiRequest').mockResolvedValueOnce({
      userId: 'user_123',
      publicKey: mockKey
    });

    const res = await fetchUserPublicKey('user_123');
    expect(res).toEqual({
      userId: 'user_123',
      publicKey: mockKey
    });
  });

  it('retorna null silenciosamente em caso de erro 404 sem relançar exceção', async () => {
    const error404 = new Error('Chave não encontrada');
    error404.status = 404;
    error404.response = { status: 404 };

    vi.spyOn(apiModule, 'apiRequest').mockRejectedValueOnce(error404);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    const res = await fetchUserPublicKey('user_404');
    expect(res).toBeNull();
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it('retorna null e exibe aviso suave em caso de outros erros (ex: 500, timeout)', async () => {
    const error500 = new Error('Falha interna no servidor');
    error500.status = 500;
    error500.response = { status: 500 };

    vi.spyOn(apiModule, 'apiRequest').mockRejectedValueOnce(error500);
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

    const res = await fetchUserPublicKey('user_500');
    expect(res).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('[E2EE] Chave indisponível para o utilizador:', 'user_500');
  });
});
