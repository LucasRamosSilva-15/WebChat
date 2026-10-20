const API = 'http://localhost:3101/api';
let counter = 0;
const uniq = () => `${Date.now().toString(36)}${(counter++).toString(36)}`;

/** Cria um usuário pela API e devolve { token, user, email, password, name }. */
async function createUser(request, name = 'Usuário') {
  const email = `${name.toLowerCase().replace(/\W+/g, '')}.${uniq()}@e2e.test`;
  const password = 'Senha@12345';
  const res = await request.post(`${API}/auth/register`, { data: { name, email, password } });
  if (!res.ok()) throw new Error(`Falha ao registrar ${name}: ${res.status()} ${await res.text()}`);
  const body = await res.json();
  return { token: body.token, user: body.user, email, password, name };
}

/** Deixa a página já logada (token + dados no localStorage) antes de qualquer script do app. */
async function loginViaStorage(context, session) {
  await context.addInitScript((s) => {
    localStorage.setItem('chat_token', s.token);
    localStorage.setItem('chat_isLoggedIn', 'true');
    localStorage.setItem('chat_displayName', s.name);
    localStorage.setItem('chat_uniqueUserId', s.user.id);
    localStorage.setItem('cookieConsent', 'accepted');
  }, session);
}

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });

async function createRoom(request, token, name) {
  const res = await request.post(`${API}/rooms`, { headers: authHeaders(token), data: { name, description: 'Sala E2E', category: 'Casual' } });
  if (!res.ok()) throw new Error(`Falha ao criar sala: ${res.status()} ${await res.text()}`);
  return res.json();
}

async function postMessage(request, token, roomId, content) {
  const res = await request.post(`${API}/rooms/${roomId}/messages`, { headers: authHeaders(token), data: { content } });
  if (!res.ok()) throw new Error(`Falha ao enviar mensagem: ${res.status()} ${await res.text()}`);
  return res.json();
}

/** Entra na sala pela tela de confirmação, quando ela aparece. */
async function joinIfPrompted(page) {
  const join = page.getByRole('button', { name: 'Entrar na Sala' });
  try {
    await join.waitFor({ state: 'visible', timeout: 4000 });
    await join.click();
  } catch { /* já estava dentro da sala */ }
}

module.exports = { API, uniq, createUser, loginViaStorage, authHeaders, createRoom, postMessage, joinIfPrompted };
