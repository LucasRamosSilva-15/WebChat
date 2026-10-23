export const E2EE_PREFIX = 'e2ee:v1:';
const HKDF_INFO = 'webchat-e2ee-v1';
const DB_NAME = 'webchat-e2ee';
const STORE = 'keys';

const subtle = () => globalThis.crypto?.subtle;
export const isE2EESupported = () => Boolean(subtle() && globalThis.crypto?.getRandomValues);

export const isEncryptedContent = (value) => typeof value === 'string' && value.startsWith(E2EE_PREFIX);

export const bytesToBase64 = (bytes) => {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

export const base64ToBytes = (b64) => {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const memoryStore = new Map();

const openDb = () =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

const storeGet = async (key) => {
  if (typeof indexedDB === 'undefined') return memoryStore.get(key) || null;
  try {
    const db = await openDb();
    return await new Promise((resolve, reject) => {
      const req = db.transaction(STORE, 'readonly').objectStore(STORE).get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return memoryStore.get(key) || null;
  }
};

const storePut = async (key, value) => {
  memoryStore.set(key, value);
  if (typeof indexedDB === 'undefined') return;
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(value, key);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch {}
};

export const resetLocalIdentity = async (userId) => {
  memoryStore.delete(`identity:${userId}`);
  if (typeof indexedDB === 'undefined') return;
  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).delete(`identity:${userId}`);
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  } catch {}
};

const ECDH = { name: 'ECDH', namedCurve: 'P-256' };

export const generateIdentity = async () => {
  const pair = await subtle().generateKey(ECDH, false, ['deriveBits']);
  const publicJwk = await subtle().exportKey('jwk', pair.publicKey);
  return { privateKey: pair.privateKey, publicJwk: { kty: publicJwk.kty, crv: publicJwk.crv, x: publicJwk.x, y: publicJwk.y } };
};

const sameJwk = (a, b) => Boolean(a && b && a.x === b.x && a.y === b.y && a.crv === b.crv);

export const ensureIdentity = async (userId, api) => {
  if (!isE2EESupported() || !userId) return null;
  let identity = await storeGet(`identity:${userId}`);
  if (!identity?.privateKey || !identity?.publicJwk) {
    identity = await generateIdentity();
    await storePut(`identity:${userId}`, identity);
  }
  try {
    const remote = await api.getPublicKey(userId);
    if (!sameJwk(remote?.publicKey, identity.publicJwk)) {
      await api.putPublicKey(identity.publicJwk);
    }
  } catch {
    return null;
  }
  return identity;
};

const importPublic = (jwk) =>
  subtle().importKey('jwk', { kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y, ext: true }, ECDH, false, []);

export const deriveConversationKey = async (privateKey, peerPublicJwk) => {
  const peerKey = await importPublic(peerPublicJwk);
  const bits = await subtle().deriveBits({ name: 'ECDH', public: peerKey }, privateKey, 256);
  const hkdfKey = await subtle().importKey('raw', bits, 'HKDF', false, ['deriveKey']);
  return subtle().deriveKey(
    { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(32), info: new TextEncoder().encode(HKDF_INFO) },
    hkdfKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

export const safetyNumber = async (jwkA, jwkB) => {
  const [first, second] = [jwkA, jwkB].sort((p, q) => (p.x + p.y).localeCompare(q.x + q.y));
  const data = new TextEncoder().encode(`${first.x}.${first.y}|${second.x}.${second.y}`);
  const digest = new Uint8Array(await subtle().digest('SHA-256', data));
  const hex = Array.from(digest.slice(0, 12)).map(b => b.toString(16).padStart(2, '0')).join('');
  return hex.match(/.{1,4}/g).join(' ').toUpperCase();
};

export const encryptPayload = async (key, conversationId, payload) => {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = new TextEncoder().encode(JSON.stringify(payload));
  const cipher = new Uint8Array(await subtle().encrypt(
    { name: 'AES-GCM', iv, additionalData: new TextEncoder().encode(String(conversationId)) },
    key,
    plain
  ));
  return `${E2EE_PREFIX}${bytesToBase64(iv)}:${bytesToBase64(cipher)}`;
};

export const decryptPayload = async (key, conversationId, envelope) => {
  if (!isEncryptedContent(envelope)) throw new Error('Mensagem não está criptografada.');
  const [ivB64, ctB64] = envelope.slice(E2EE_PREFIX.length).split(':');
  if (!ivB64 || !ctB64) throw new Error('Mensagem criptografada malformada.');
  const plain = await subtle().decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(ivB64), additionalData: new TextEncoder().encode(String(conversationId)) },
    key,
    base64ToBytes(ctB64)
  );
  return JSON.parse(new TextDecoder().decode(plain));
};
