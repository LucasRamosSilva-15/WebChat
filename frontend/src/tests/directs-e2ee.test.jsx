import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Directs from '../pages/Directs';
import { socket } from '../socket';
import { apiRequest } from '../services/api';
import { generateIdentity, deriveConversationKey, encryptPayload, decryptPayload, resetLocalIdentity } from '../utils/e2ee';
import { clearCryptoCache } from '../services/directCrypto';

vi.mock('../services/api', () => ({
  apiRequest: vi.fn(),
  BACKEND_URL: 'http://localhost:3001'
}));

vi.mock('../socket', () => ({
  socket: { emit: vi.fn(), on: vi.fn(), off: vi.fn(), disconnect: vi.fn() }
}));

const USER_ID = 'lucas_123';
const PEER_ID = 'peer-uuid-1';
const CONV_ID = 'srv-conv-1';
const conversation = { id: CONV_ID, partnerId: PEER_ID, name: 'Mariana Silva', username: 'mariana', avatar: null, lastMessage: 'Oi', time: '10:00', online: true, unread: 0 };

describe('Directs com criptografia ponta a ponta', () => {
  let peer;          // identidade da Mariana
  let myPublicJwk;   // capturada quando o app publica a chave
  let resolveMyKey;
  let myKeyReady;
  let posts;

  const install = ({ peerHasKey = true, historyEnvelopeText = null } = {}) => {
    posts = [];
    apiRequest.mockImplementation(async (endpoint, options = {}) => {
      if (endpoint === '/directs/conversations') return [conversation];
      if (endpoint === '/directs/keys' && options.method === 'PUT') {
        myPublicJwk = JSON.parse(options.body).publicKey;
        resolveMyKey(myPublicJwk);
        return {};
      }
      if (endpoint === `/directs/keys/${USER_ID}`) return { userId: USER_ID, publicKey: null };
      if (endpoint === `/directs/keys/${PEER_ID}`) return { userId: PEER_ID, publicKey: peerHasKey ? peer.publicJwk : null };
      if (endpoint.startsWith(`/directs/conversations/${CONV_ID}/messages`) && options.method === 'POST') {
        posts.push(JSON.parse(options.body));
        return {};
      }
      if (endpoint.startsWith(`/directs/conversations/${CONV_ID}/messages`)) {
        if (!historyEnvelopeText) return { messages: [], hasMore: false, nextCursor: null };
        const mine = await myKeyReady;
        const key = await deriveConversationKey(peer.privateKey, mine);
        const envelope = await encryptPayload(key, CONV_ID, { t: historyEnvelopeText, i: null, a: null });
        return {
          messages: [{ messageId: 'h1', text: envelope, created_at: new Date().toISOString(), user_id: PEER_ID, sender: 'Mariana Silva', isMe: false }],
          hasMore: false,
          nextCursor: null
        };
      }
      return [];
    });
  };

  const openConversation = async () => {
    render(
      <MemoryRouter initialEntries={['/directs']}>
        <Directs />
      </MemoryRouter>
    );
    await waitFor(() => expect(screen.getAllByText('Mariana Silva').length).toBeGreaterThan(0));
    fireEvent.click(screen.getAllByText('Mariana Silva')[0]);
    await waitFor(() => expect(screen.getByPlaceholderText(/Mensagem para Mariana Silva/i)).toBeInTheDocument());
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('chat_displayName', 'Lucas Ramos');
    localStorage.setItem('chat_uniqueUserId', USER_ID);
    clearCryptoCache();
    await resetLocalIdentity(USER_ID);
    peer = await generateIdentity();
    myKeyReady = new Promise(res => { resolveMyKey = res; });
  });

  it('mostra o selo de criptografia e decifra o histórico vindo do servidor', async () => {
    install({ historyEnvelopeText: 'Oi Lucas, mensagem secreta!' });
    await openConversation();

    expect(await screen.findByText('Oi Lucas, mensagem secreta!')).toBeInTheDocument();
    expect(await screen.findByTestId('e2ee-badge')).toBeInTheDocument();
    expect(screen.queryByText(/e2ee:v1:/)).not.toBeInTheDocument();
  });

  it('o servidor recebe apenas o envelope cifrado (socket e REST)', async () => {
    install();
    await openConversation();
    await screen.findByTestId('e2ee-badge');

    fireEvent.change(screen.getByPlaceholderText(/Mensagem para Mariana Silva/i), { target: { value: 'Segredo do Lucas' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    await waitFor(() => expect(socket.emit).toHaveBeenCalledWith('send_message', expect.anything()));
    const payload = socket.emit.mock.calls.find(c => c[0] === 'send_message')[1];

    expect(payload.content).toMatch(/^e2ee:v1:/);
    expect(JSON.stringify(payload)).not.toContain('Segredo do Lucas');
    expect(payload.message).toBeUndefined();
    expect(payload.image).toBeUndefined();
    expect(payload.attachment).toBeUndefined();

    await waitFor(() => expect(posts.length).toBe(1));
    expect(posts[0].content).toBe(payload.content);
    expect(JSON.stringify(posts[0])).not.toContain('Segredo do Lucas');

    // a Mariana consegue abrir
    const key = await deriveConversationKey(peer.privateKey, myPublicJwk);
    expect(await decryptPayload(key, CONV_ID, payload.content)).toMatchObject({ t: 'Segredo do Lucas' });
    // e o texto aparece normalmente para quem enviou
    expect(screen.getByText('Segredo do Lucas')).toBeInTheDocument();
  });

  it('anexos também viajam dentro do envelope cifrado', async () => {
    install();
    await openConversation();
    await screen.findByTestId('e2ee-badge');

    const file = new File(['conteudo do pdf'], 'prova.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByTestId('document-input'), { target: { files: [file] } });
    await screen.findByText('prova.pdf');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    await waitFor(() => expect(socket.emit).toHaveBeenCalledWith('send_message', expect.anything()));
    const payload = socket.emit.mock.calls.find(c => c[0] === 'send_message')[1];
    expect(payload.content).toMatch(/^e2ee:v1:/);
    expect(payload.attachment).toBeUndefined();
    expect(JSON.stringify(payload)).not.toContain('prova.pdf');

    const key = await deriveConversationKey(peer.privateKey, myPublicJwk);
    const opened = await decryptPayload(key, CONV_ID, payload.content);
    expect(opened.a).toMatchObject({ name: 'prova.pdf', type: 'application/pdf' });
  });

  it('decifra mensagem recebida em tempo real pelo socket', async () => {
    install();
    await openConversation();
    await screen.findByTestId('e2ee-badge');

    const key = await deriveConversationKey(peer.privateKey, myPublicJwk);
    const envelope = await encryptPayload(key, CONV_ID, { t: 'Chegou ao vivo', i: null, a: null });
    const handler = socket.on.mock.calls.filter(c => c[0] === 'receive_message').pop()[1];
    await handler({ id: 'live-1', room_id: CONV_ID, user_id: PEER_ID, sender_name: 'Mariana Silva', content: envelope, created_at: new Date().toISOString() });

    expect(await screen.findByText('Chegou ao vivo')).toBeInTheDocument();
  });

  it('mensagem que não dá para abrir mostra aviso em vez de lixo', async () => {
    install();
    await openConversation();
    await screen.findByTestId('e2ee-badge');

    const stranger = await generateIdentity();
    const wrongKey = await deriveConversationKey(stranger.privateKey, peer.publicJwk);
    const envelope = await encryptPayload(wrongKey, CONV_ID, { t: 'nao era pra mim' });
    const handler = socket.on.mock.calls.filter(c => c[0] === 'receive_message').pop()[1];
    await handler({ id: 'bad-1', room_id: CONV_ID, user_id: PEER_ID, sender_name: 'Mariana Silva', content: envelope, created_at: new Date().toISOString() });

    expect(await screen.findByText(/não foi possível abrir neste dispositivo/)).toBeInTheDocument();
    expect(screen.queryByText(/e2ee:v1:/)).not.toBeInTheDocument();
  });

  it('contato sem chave: mostra "Sem criptografia" e envia em texto normal', async () => {
    install({ peerHasKey: false });
    await openConversation();
    expect(await screen.findByTestId('e2ee-badge-off')).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/Mensagem para Mariana Silva/i), { target: { value: 'Texto simples' } });
    fireEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    await waitFor(() => expect(socket.emit).toHaveBeenCalledWith('send_message', expect.objectContaining({ content: 'Texto simples' })));
  });

  it('o navegador não guarda a conversa criptografada em texto claro', async () => {
    install({ historyEnvelopeText: 'Nao salvar no localStorage' });
    await openConversation();
    await screen.findByText('Nao salvar no localStorage');
    const cached = localStorage.getItem(`chat_messages_${CONV_ID}`) || '';
    expect(cached).not.toContain('Nao salvar no localStorage');
  });
});
