import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  E2EE_PREFIX,
  isEncryptedContent,
  generateIdentity,
  ensureIdentity,
  resetLocalIdentity,
  deriveConversationKey,
  encryptPayload,
  decryptPayload,
  safetyNumber,
  bytesToBase64,
  base64ToBytes
} from '../utils/e2ee';

describe('E2EE (Web Crypto)', () => {
  it('base64 faz o caminho de ida e volta, inclusive com arquivos grandes', () => {
    const big = new Uint8Array(300000).map((_, i) => i % 251);
    expect(Array.from(base64ToBytes(bytesToBase64(big)).slice(0, 5))).toEqual([0, 1, 2, 3, 4]);
    expect(base64ToBytes(bytesToBase64(big)).length).toBe(300000);
  });

  it('gera identidade com chave privada NÃO extraível e pública P-256', async () => {
    const id = await generateIdentity();
    expect(id.publicJwk).toMatchObject({ kty: 'EC', crv: 'P-256' });
    expect(id.publicJwk.d).toBeUndefined();
    expect(id.privateKey.extractable).toBe(false);
    await expect(crypto.subtle.exportKey('jwk', id.privateKey)).rejects.toThrow();
  });

  it('duas pessoas derivam a mesma chave e conseguem ler uma à outra', async () => {
    const alice = await generateIdentity();
    const bob = await generateIdentity();
    const kA = await deriveConversationKey(alice.privateKey, bob.publicJwk);
    const kB = await deriveConversationKey(bob.privateKey, alice.publicJwk);

    const envelope = await encryptPayload(kA, 'conv-1', { t: 'Olá, Bob! 🔒', i: null, a: null });
    expect(envelope.startsWith(E2EE_PREFIX)).toBe(true);
    expect(envelope).not.toContain('Olá');
    expect(await decryptPayload(kB, 'conv-1', envelope)).toEqual({ t: 'Olá, Bob! 🔒', i: null, a: null });
    expect(await decryptPayload(kA, 'conv-1', envelope)).toMatchObject({ t: 'Olá, Bob! 🔒' });
  });

  it('cada mensagem usa um IV novo (mesmo texto gera envelopes diferentes)', async () => {
    const a = await generateIdentity();
    const b = await generateIdentity();
    const key = await deriveConversationKey(a.privateKey, b.publicJwk);
    const e1 = await encryptPayload(key, 'c', { t: 'igual' });
    const e2 = await encryptPayload(key, 'c', { t: 'igual' });
    expect(e1).not.toBe(e2);
  });

  it('um terceiro não consegue decifrar', async () => {
    const alice = await generateIdentity();
    const bob = await generateIdentity();
    const eve = await generateIdentity();
    const key = await deriveConversationKey(alice.privateKey, bob.publicJwk);
    const envelope = await encryptPayload(key, 'conv-1', { t: 'segredo' });
    const eveKey = await deriveConversationKey(eve.privateKey, alice.publicJwk);
    await expect(decryptPayload(eveKey, 'conv-1', envelope)).rejects.toThrow();
  });

  it('o id da conversa é autenticado: não dá para reaproveitar em outra conversa', async () => {
    const a = await generateIdentity();
    const b = await generateIdentity();
    const key = await deriveConversationKey(a.privateKey, b.publicJwk);
    const envelope = await encryptPayload(key, 'conv-1', { t: 'x' });
    await expect(decryptPayload(key, 'conv-2', envelope)).rejects.toThrow();
  });

  it('detecta adulteração do texto cifrado', async () => {
    const a = await generateIdentity();
    const b = await generateIdentity();
    const key = await deriveConversationKey(a.privateKey, b.publicJwk);
    const envelope = await encryptPayload(key, 'c', { t: 'integro' });
    const [iv, ct] = envelope.slice(E2EE_PREFIX.length).split(':');
    const bytes = base64ToBytes(ct);
    bytes[0] ^= 0xff;
    await expect(decryptPayload(key, 'c', `${E2EE_PREFIX}${iv}:${bytesToBase64(bytes)}`)).rejects.toThrow();
  });

  it('cifra anexos grandes (áudio de ~1 MB)', async () => {
    const a = await generateIdentity();
    const b = await generateIdentity();
    const key = await deriveConversationKey(a.privateKey, b.publicJwk);
    const att = { url: `data:audio/webm;base64,${'A'.repeat(1_400_000)}`, type: 'audio/webm', name: 'v.webm', size: 1_000_000 };
    const out = await decryptPayload(key, 'c', await encryptPayload(key, 'c', { t: '', a: att }));
    expect(out.a.url.length).toBe(att.url.length);
  });

  it('isEncryptedContent e envelope inválido', async () => {
    expect(isEncryptedContent('e2ee:v1:aa:bb')).toBe(true);
    expect(isEncryptedContent('texto normal')).toBe(false);
    expect(isEncryptedContent(null)).toBe(false);
    const a = await generateIdentity();
    const b = await generateIdentity();
    const key = await deriveConversationKey(a.privateKey, b.publicJwk);
    await expect(decryptPayload(key, 'c', 'texto normal')).rejects.toThrow('não está criptografada');
    await expect(decryptPayload(key, 'c', `${E2EE_PREFIX}so-um-pedaco`)).rejects.toThrow('malformada');
  });

  it('safetyNumber é igual para os dois lados e muda se a chave muda', async () => {
    const a = await generateIdentity();
    const b = await generateIdentity();
    const c = await generateIdentity();
    const n1 = await safetyNumber(a.publicJwk, b.publicJwk);
    expect(n1).toBe(await safetyNumber(b.publicJwk, a.publicJwk));
    expect(n1).toMatch(/^([0-9A-F]{4} ){5}[0-9A-F]{4}$/);
    expect(await safetyNumber(a.publicJwk, c.publicJwk)).not.toBe(n1);
  });
});

describe('ensureIdentity', () => {
  const userId = 'user-e2ee-test';
  beforeEach(async () => { await resetLocalIdentity(userId); });

  it('cria a identidade e publica a chave no servidor', async () => {
    const api = { getPublicKey: vi.fn().mockResolvedValue({ publicKey: null }), putPublicKey: vi.fn().mockResolvedValue({}) };
    const id = await ensureIdentity(userId, api);
    expect(id.publicJwk.crv).toBe('P-256');
    expect(api.putPublicKey).toHaveBeenCalledWith(id.publicJwk);
  });

  it('reaproveita a identidade e não republica se o servidor já tem a mesma chave', async () => {
    const first = await ensureIdentity(userId, { getPublicKey: async () => ({ publicKey: null }), putPublicKey: async () => ({}) });
    const api = { getPublicKey: vi.fn().mockResolvedValue({ publicKey: first.publicJwk }), putPublicKey: vi.fn() };
    const second = await ensureIdentity(userId, api);
    expect(second.publicJwk).toEqual(first.publicJwk);
    expect(api.putPublicKey).not.toHaveBeenCalled();
  });

  it('republica se o servidor tem outra chave (ex.: dados do navegador limpos)', async () => {
    const other = await generateIdentity();
    const api = { getPublicKey: vi.fn().mockResolvedValue({ publicKey: other.publicJwk }), putPublicKey: vi.fn().mockResolvedValue({}) };
    const id = await ensureIdentity(userId, api);
    expect(api.putPublicKey).toHaveBeenCalledWith(id.publicJwk);
  });

  it('sem servidor devolve null (não ativa a criptografia)', async () => {
    const api = { getPublicKey: vi.fn().mockRejectedValue(new Error('offline')), putPublicKey: vi.fn() };
    expect(await ensureIdentity(userId, api)).toBeNull();
  });
});
