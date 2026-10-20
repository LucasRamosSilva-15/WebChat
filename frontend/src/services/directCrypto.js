// Cola entre a API e a criptografia (utils/e2ee.js) para as conversas diretas.
import { apiRequest } from './api';
import {
  ensureIdentity,
  deriveConversationKey,
  safetyNumber,
  encryptPayload,
  decryptPayload,
  isE2EESupported,
  isEncryptedContent
} from '../utils/e2ee';

const api = {
  getPublicKey: (userId) => apiRequest(`/directs/keys/${userId}`),
  putPublicKey: (publicKey) => apiRequest('/directs/keys', { method: 'PUT', body: JSON.stringify({ publicKey }) })
};

const identityPromises = new Map(); // userId -> Promise<identity|null>
const conversationCache = new Map(); // `${userId}:${peerId}` -> { peerKey, key, safety }
const missingPeerUntil = new Map(); // peerId sem chave -> timestamp para tentar de novo
const MISSING_TTL_MS = 15000;

export const clearCryptoCache = () => {
  identityPromises.clear();
  conversationCache.clear();
  missingPeerUntil.clear();
};

const getIdentity = (userId) => {
  if (!identityPromises.has(userId)) {
    identityPromises.set(userId, ensureIdentity(userId, api).then((id) => {
      if (!id) identityPromises.delete(userId); // tenta de novo na próxima vez
      return id;
    }));
  }
  return identityPromises.get(userId);
};

/**
 * Publica a chave pública do usuário logo após o login/abertura do app, para que os contatos
 * já consigam cifrar mensagens para ele mesmo antes de ele abrir a conversa.
 */
export const initIdentity = (userId) => {
  if (!userId || String(userId).startsWith('user_') || !localStorage.getItem('chat_token')) return Promise.resolve(null);
  return getIdentity(userId).catch(() => null);
};

/**
 * Prepara a criptografia da conversa. Retorna { key, safety } ou null quando não dá para
 * cifrar (navegador sem suporte, sem rede ou o contato ainda não ativou a criptografia).
 */
export async function getConversationCrypto(userId, peerId, { refresh = false } = {}) {
  if (!isE2EESupported() || !userId || !peerId) return null;
  const cacheKey = `${userId}:${peerId}`;
  if (!refresh && conversationCache.has(cacheKey)) return conversationCache.get(cacheKey);
  if (!refresh && (missingPeerUntil.get(peerId) || 0) > Date.now()) return null;

  try {
    const identity = await getIdentity(userId);
    if (!identity) return null;
    const peer = await api.getPublicKey(peerId);
    if (!peer?.publicKey) {
      missingPeerUntil.set(peerId, Date.now() + MISSING_TTL_MS);
      conversationCache.delete(cacheKey);
      return null;
    }
    const key = await deriveConversationKey(identity.privateKey, peer.publicKey);
    const entry = { key, safety: await safetyNumber(identity.publicJwk, peer.publicKey) };
    conversationCache.set(cacheKey, entry);
    return entry;
  } catch {
    return null;
  }
}

/** Cifra { text, image, attachment } e devolve o envelope "e2ee:v1:...". */
export const encryptMessage = (entry, conversationId, { text, image, attachment }) =>
  encryptPayload(entry.key, conversationId, { t: text || '', i: image || null, a: attachment || null });

export const DECRYPT_FAILED_TEXT = '🔒 Mensagem criptografada — não foi possível abrir neste dispositivo.';

/**
 * Se `msg` carrega um envelope, devolve a mensagem decifrada; senão devolve igual.
 * Se a chave do contato mudou, busca a chave de novo uma vez antes de desistir.
 */
export async function decryptIncoming(msg, userId, peerId, conversationId) {
  const envelope = [msg.content, msg.text, msg.message].find(isEncryptedContent);
  if (!envelope) return msg;

  for (const refresh of [false, true]) {
    const entry = await getConversationCrypto(userId, peerId, { refresh });
    if (!entry) break;
    try {
      const p = await decryptPayload(entry.key, conversationId, envelope);
      return { ...msg, content: p.t, text: p.t, message: p.t, image: p.i || null, attachment: p.a || null, image_url: null, encrypted: true };
    } catch { /* tenta com a chave atualizada */ }
  }
  return { ...msg, content: DECRYPT_FAILED_TEXT, text: DECRYPT_FAILED_TEXT, message: DECRYPT_FAILED_TEXT, image: null, attachment: null, encrypted: true, decryptFailed: true };
}
