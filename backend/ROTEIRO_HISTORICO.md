# 📜 Roteiro Técnico Detalhado: Sistema de Histórico e Paginação por Cursor

> **Para o desenvolvedor responsável:**  
> Este documento é o seu guia passo a passo oficial para construir e integrar o **Sistema de Histórico de Mensagens com Paginação por Cursor** no ecossistema do **SkyRipple** (v9.0.0).  
> A base do backend agora adota a arquitetura modular **Controller-Service-Repository-Model (Sequelize)**, garantindo total isolamento da lógica de negócios, contratos OpenAPI 3.0 via Swagger UI (`/api-docs`) e portal Mintlify, além de compatibilidade com a suíte de testes de 202 testes automatizados.

---

## 🧭 Sumário das Etapas

1. [Visão Geral & Conceitos Fundamentais](#-1-visão-geral--conceitos-fundamentais)
2. [Etapa 1: Índices de Performance no Banco de Dados (Models)](#-etapa-1-índices-de-performance-no-banco-de-dados-models)
3. [Etapa 2: Camada de Repositório — Lógica de Busca com Cursor (Repositories)](#-etapa-2-camada-de-repositório--lógica-de-busca-com-cursor-repositories)
4. [Etapa 3: Camada de Serviço — Regras de Negócio e Segurança (Services)](#-etapa-3-camada-de-serviço--regras-de-negócio-e-segurança-services)
5. [Etapa 4: Camada de Controladores & Rotas (Controllers & Routes)](#-etapa-4-camada-de-controladores--rotas-controllers--routes)
6. [Etapa 5: Frontend — Gerenciamento de Estado e Primeira Carga](#-etapa-5-frontend--gerenciamento-de-estado-e-primeira-carga)
7. [Etapa 6: Frontend — Infinite Scroll Suave sem Saltos de Tela (Scroll Anchor)](#-etapa-6-frontend--infinite-scroll-suave-sem-saltos-de-tela-scroll-anchor)
8. [Etapa 7: Frontend — Separadores Cronológicos de Data (UX)](#-etapa-7-frontend--separadores-cronológicos-de-data-ux)
9. [Etapa 8: Funcionalidade Extra — Exportar Conversa em Arquivo Texto (.txt)](#-etapa-8-funcionalidade-extra--exportar-conversa-em-arquivo-texto-txt)
10. [Etapa 9: Criação de Testes Automatizados com Jest & Supertest](#-etapa-9-criação-de-testes-automatizados-com-jest--supertest)
11. [Checklist Final de Entrega](#-checklist-final-de-entrega)

---

## 🎯 1. Visão Geral & Conceitos Fundamentais

### 1.1 O problema que estamos resolvendo
Hoje, quando um usuário entra em uma sala de chat (`/chat`) ou abre uma conversa direta (`/directs`), o backend executa uma busca que traz **todas as mensagens daquela sala de uma só vez**, sem nenhum limite.
- Se a sala tiver 20 mensagens, funciona bem.
- Se a sala tiver 15.000 mensagens, o banco de dados vai sofrer, o Node.js vai gastar dezenas de megabytes para serializar o JSON, a rede vai demorar para transferir o pacote e o navegador vai travar tentando renderizar milhares de balões de conversa no DOM.

### 1.2 Por que usamos "Cursor" e não "Página 1, Página 2 (Offset)"?
Em lojas virtuais ou blogs, a paginação clássica por páginas funciona (`LIMIT 20 OFFSET 40`). Mas em um **chat em tempo real**, ela quebra feio:
- Imagine que o usuário está lendo as 20 mensagens mais recentes e alguém manda 3 mensagens novas no chat.
- Ao rolar para cima para buscar a "página 2", o deslocamento do `OFFSET` mudou devido às novas inserções. O usuário acaba vendo mensagens duplicadas ou mensagens são puladas.
- Além disso, no PostgreSQL, um `OFFSET 50000` precisa ler 50.000 linhas no disco para depois descartá-las, o que é extremamente lento.

### 1.3 Como funciona o Cursor de Data?
Usamos o timestamp de criação da mensagem (`created_at`) como uma "âncora" (cursor):
1. **Primeira carga:** Buscamos as últimas 50 mensagens mais recentes (`ORDER BY created_at DESC LIMIT 50`).
2. **Ao rolar para o topo:** O cliente pega a data da mensagem mais antiga que ele tem na tela (ex: `2026-10-15T14:20:00Z`) e pede ao backend: *"Me dê as 30 mensagens criadas ANTES dessa data"* (`WHERE created_at < '2026-10-15T14:20:00Z' ORDER BY created_at DESC LIMIT 30`).
3. O banco de dados vai direto no índice B-Tree, localiza a data em microssegundos e entrega exatamente o bloco anterior, sem duplicações e sem pular mensagens.

---

## 🗄️ ETAPA 1: Índices de Performance no Banco de Dados (Models)

### 📌 O que você vai fazer nesta etapa
Você vai orientar o Sequelize e o PostgreSQL a criarem **índices de busca compostos** para as tabelas `messages` (mensagens de sala) e `direct_messages` (mensagens 1x1).

### 🔍 Por que isso é necessário?
Como todas as nossas consultas de histórico vão filtrar por sala (`room_id`) e ordenar pela data decrescente (`created_at DESC`), um índice composto garante que o banco não precise varrer a tabela inteira (evitando um *Sequential Scan*), acessando diretamente o bloco de dados desejado em tempo logarítmico $O(\log N)$.

### 📝 Instruções Passo a Passo

#### 1. Abra o arquivo [`backend/src/models/Message.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/models/Message.js)
No segundo parâmetro de `sequelize.define` (onde já existem configurações como `tableName: 'messages'`), adicione o array `indexes`:

```javascript
// Localize o final da definição do modelo em backend/src/models/Message.js:
{
  tableName: 'messages',
  timestamps: false,
  indexes: [
    {
      name: 'idx_messages_room_created_at',
      fields: ['room_id', { name: 'created_at', order: 'DESC' }]
    }
  ]
}
```

#### 2. Abra o arquivo [`backend/src/models/DirectMessage.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/models/DirectMessage.js)
Faça a mesma coisa para as mensagens diretas, indexando por `conversation_id`:

```javascript
// Localize o final da definição do modelo em backend/src/models/DirectMessage.js:
{
  tableName: 'direct_messages',
  timestamps: false,
  indexes: [
    {
      name: 'idx_direct_messages_conv_created_at',
      fields: ['conversation_id', { name: 'created_at', order: 'DESC' }]
    }
  ]
}
```

### ⚠️ Pegadinhas a evitar
- Não altere os nomes dos campos (`room_id`, `conversation_id`, `created_at`). Eles devem bater exatamente com as colunas reais do banco.
- Certifique-se de que a vírgula após `timestamps: false` não foi esquecida, caso contrário o JavaScript apontará erro de sintaxe.

### 🧪 Como validar esta etapa
Inicie o servidor localmente com `npm run dev` na pasta `backend`. O Sequelize irá rodar `sync()` na inicialização e criará os índices sem erros no console.

---

## 🛠️ ETAPA 2: Camada de Repositório — Lógica de Busca com Cursor (Repositories)

### 📌 O que você vai fazer nesta etapa
Você vai alterar os métodos de busca nos repositórios para receberem opções de paginação: `limit` (quantas mensagens trazer) e `before` (cursor de data).

### 🔍 Por que buscar `limit + 1` mensagens?
Esta é uma das técnicas mais elegantes de paginação na web:
- Se o usuário pediu 50 mensagens, nós pedimos **51** ao banco de dados (`limit + 1`).
- Se o banco devolver 51 mensagens, sabemos com 100% de certeza que **ainda existem mais mensagens antigas** (`hasMore = true`). Nós removemos a 51ª mensagem da lista e entregamos 50 ao cliente.
- Se o banco devolver 50 ou menos, sabemos que **o início da história da sala foi alcançado** (`hasMore = false`).
- Isso evita ter que fazer uma segunda consulta pesada do tipo `SELECT COUNT(*)` só para saber se acabou o histórico!

### 🔍 Por que precisamos fazer `.reverse()`?
No banco de dados, precisamos buscar em ordem decrescente (`ORDER BY created_at DESC`) para pegar as mensagens mais recentes a partir do cursor. Porém, a tela do chat exibe as mensagens de cima para baixo em ordem cronológica (mais antigas no topo, mais recentes no rodapé). Por isso, invertemos o array antes de devolver (`resultMessages.reverse()`).

### 📝 Instruções Passo a Passo

#### 1. Edite [`backend/src/repositories/MessageRepository.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/repositories/MessageRepository.js)
Substitua o método `findByRoomId` existente por esta versão aprimorada:

```javascript
const { Op } = require('sequelize');
const { Message, User } = require('../models');

class MessageRepository {
  // ... mantenha os métodos create, searchByRoom, findById e delete intactos ...

  /**
   * Busca mensagens de uma sala com paginação baseada em cursor
   * @param {string} roomId - UUID da sala
   * @param {object} options - Opções de paginação
   * @param {number} options.limit - Quantidade de mensagens desejadas (default: 50)
   * @param {string|Date|null} options.before - Cursor ISO para buscar mensagens criadas antes desta data
   */
  async findByRoomId(roomId, { limit = 50, before = null } = {}) {
    const whereClause = { room_id: roomId };

    // Se o cliente enviou um cursor "before", filtramos mensagens anteriores a essa data
    if (before) {
      whereClause.created_at = {
        [Op.lt]: new Date(before) // Op.lt significa "Menor que" (<)
      };
    }

    // Busca limit + 1 mensagens ordenadas da mais nova para a mais antiga
    const messages = await Message.findAll({
      where: whereClause,
      include: [
        { 
          model: User, 
          as: 'user', 
          attributes: ['id', 'displayName', 'profilePhoto'] 
        }
      ],
      order: [['created_at', 'DESC']],
      limit: Number(limit) + 1
    });

    // Se veio mais do que o limite pedido, significa que tem mais páginas antigas
    const hasMore = messages.length > limit;
    
    // Retira a mensagem extra sobressalente
    const resultMessages = hasMore ? messages.slice(0, limit) : messages;

    // Inverte a ordem para entregar em ordem cronológica natural (mais antiga -> mais nova)
    resultMessages.reverse();

    // O nextCursor será a data da mensagem mais antiga deste bloco
    const nextCursor = hasMore && resultMessages.length > 0 ? resultMessages[0].created_at : null;

    return {
      messages: resultMessages,
      hasMore,
      nextCursor
    };
  }
}

module.exports = new MessageRepository();
```

#### 2. Edite [`backend/src/repositories/DirectRepository.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/repositories/DirectRepository.js)
Localize o método `findMessagesByConversation` e atualize-o para seguir exatamente a mesma lógica:

```javascript
  async findMessagesByConversation(conversationId, { limit = 50, before = null } = {}) {
    const whereClause = { conversation_id: conversationId };

    if (before) {
      whereClause.created_at = {
        [Op.lt]: new Date(before)
      };
    }

    const messages = await DirectMessage.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'displayName', 'email', 'profilePhoto'] }
      ],
      order: [['created_at', 'DESC']],
      limit: Number(limit) + 1
    });

    const hasMore = messages.length > limit;
    const resultMessages = hasMore ? messages.slice(0, limit) : messages;
    resultMessages.reverse();

    const nextCursor = hasMore && resultMessages.length > 0 ? resultMessages[0].created_at : null;

    return {
      messages: resultMessages,
      hasMore,
      nextCursor
    };
  }
```

### ⚠️ Pegadinhas a evitar
- **Não esqueça o `.reverse()`**: se você esquecer de inverter o array, as mensagens vão renderizar de cabeça para baixo no chat do usuário!
- **Não pegue o `nextCursor` da última mensagem**: o `nextCursor` deve ser a data da **primeira** mensagem do array invertido (que é a mensagem mais antiga do lote atual), pois na próxima requisição queremos mensagens anteriores a ela.

---

## 🧠 ETAPA 3: Camada de Serviço — Regras de Negócio e Segurança (Services)

### 📌 O que você vai fazer nesta etapa
Na camada de serviços, você vai adicionar a validação de parâmetros de entrada, sanitizar as datas e limitar os valores para que ninguém tente pedir 1 milhão de mensagens de uma vez.

### 🔍 Por que validar o limite no Service?
Se um usuário mal-intencionado fizer uma requisição `GET /rooms/123/messages?limit=9999999`, o Node.js tentará alocar tudo na memória. Travando o limite entre 1 e 100 no Service, mantemos a API blindada e em conformidade com as boas práticas de segurança OWASP.

### 📝 Instruções Passo a Passo

#### 1. Edite [`backend/src/services/MessageService.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/services/MessageService.js)
Localize a função `getMessagesByRoom` e atualize-a:

```javascript
  /**
   * Obtém histórico de mensagens com sanitização de paginação
   */
  async getMessagesByRoom(roomId, { limit = 50, before = null } = {}) {
    if (!roomId) {
      throw new Error('ID da sala é obrigatório.');
    }

    // Trava o limite entre 1 (mínimo) e 100 (máximo). Se vier nulo ou inválido, usa 50.
    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

    // Valida se o cursor enviado é uma data válida para evitar erros no banco
    let validBefore = null;
    if (before) {
      const parsedDate = new Date(before);
      if (!isNaN(parsedDate.getTime())) {
        validBefore = parsedDate.toISOString();
      }
    }

    return await MessageRepository.findByRoomId(roomId, {
      limit: parsedLimit,
      before: validBefore
    });
  }
```

#### 2. Edite [`backend/src/services/DirectService.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/services/DirectService.js)
Localize o método `getMessages` e adicione a mesma proteção:

```javascript
  async getMessages(conversationId, userId, { limit = 50, before = null } = {}) {
    if (!conversationId) {
      throw new Error('ID da conversa é obrigatório.');
    }

    const conversation = await DirectRepository.findConversationById(conversationId);
    if (!conversation) {
      throw new Error('Conversa não encontrada.');
    }

    // Validação de segurança: apenas os dois participantes da conversa podem ler as mensagens
    if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
      throw new Error('Acesso não autorizado a esta conversa.');
    }

    const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);

    let validBefore = null;
    if (before) {
      const parsedDate = new Date(before);
      if (!isNaN(parsedDate.getTime())) {
        validBefore = parsedDate.toISOString();
      }
    }

    return await DirectRepository.findMessagesByConversation(conversationId, {
      limit: parsedLimit,
      before: validBefore
    });
  }
```

---

## 🌐 ETAPA 4: Camada de Controladores & Rotas (Controllers & Routes)

### 📌 O que você vai fazer nesta etapa
Você vai conectar os parâmetros da query string da URL (`req.query.limit` e `req.query.before`) com os seus serviços e documentar os novos parâmetros no Swagger.

### 📝 Instruções Passo a Passo

#### 1. Edite [`backend/src/controllers/MessageController.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/controllers/MessageController.js)
No método `listByRoom`, extraia `limit` e `before` de `req.query`:

```javascript
  async listByRoom(req, res) {
    try {
      const { limit, before } = req.query;
      const data = await MessageService.getMessagesByRoom(req.params.roomId, { limit, before });
      return res.status(200).json(data);
    } catch (error) {
      return handleError(res, error);
    }
  }
```

#### 2. Edite [`backend/src/controllers/DirectController.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/controllers/DirectController.js)
No método `getMessages`, faça o mesmo repasse:

```javascript
  async getMessages(req, res) {
    try {
      const { limit, before } = req.query;
      const data = await DirectService.getMessages(req.params.id, req.userId, { limit, before });
      return res.status(200).json(data);
    } catch (error) {
      return handleError(res, error);
    }
  }
```

#### 3. Atualize o Swagger em [`backend/src/routes/messageRoutes.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/routes/messageRoutes.js) e [`backend/src/routes/directRoutes.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/routes/directRoutes.js)
Acima da rota `router.get('/rooms/:roomId/messages'...)`, adicione os parâmetros `limit` e `before` com schemas e respostas padronizadas:

```javascript
/**
 * @swagger
 * /rooms/{roomId}/messages:
 *   get:
 *     summary: Listar histórico paginado de mensagens da sala
 *     tags: [Messages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de mensagens a retornar (1 a 100)
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Cursor ISO para buscar mensagens criadas antes desta data
 *     responses:
 *       200:
 *         description: Histórico de mensagens com metadados de cursor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 hasMore:
 *                   type: boolean
 *                 nextCursor:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
```

Faça a mesma anotação na rota correspondente em [`backend/src/routes/directRoutes.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/routes/directRoutes.js) para `GET /directs/conversations/{id}/messages`.

### 🧪 Como testar o Backend antes de mexer no Frontend
Abra seu terminal ou cliente HTTP (como Postman/Insomnia) e faça uma requisição autenticada:

```bash
# 1. Testar primeira página com limite pequeno:
curl -H "Authorization: Bearer SEU_TOKEN" "http://localhost:3001/api/rooms/ID_DA_SALA/messages?limit=2"

# Resposta esperada:
# {
#   "messages": [ { "id": "...", "content": "olá", "created_at": "..." }, ... ],
#   "hasMore": true,
#   "nextCursor": "2026-10-17T14:00:00.000Z"
# }

# 2. Testar próxima página usando o nextCursor recebido:
curl -H "Authorization: Bearer SEU_TOKEN" "http://localhost:3001/api/rooms/ID_DA_SALA/messages?limit=2&before=2026-10-17T14:00:00.000Z"
```
Se a segunda requisição trouxer mensagens mais antigas com sucesso, o backend está **100% pronto**! 🎉

---

## 💻 ETAPA 5: Frontend — Gerenciamento de Estado e Primeira Carga

### 📌 O que você vai fazer nesta etapa
Agora vamos para o cliente React. Você vai atualizar a tela de chat para gerenciar o estado do histórico: se há mais mensagens para carregar (`hasMore`), qual é o cursor atual (`nextCursor`) e se há uma requisição em andamento (`loadingMore`).

### 📝 Instruções Passo a Passo no [`frontend/src/pages/Chat.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/pages/Chat.jsx)

#### 1. Declare os novos estados no topo do componente:
```javascript
// Dentro do componente Chat:
const [messages, setMessages] = useState([]);
const [hasMore, setHasMore] = useState(false);
const [nextCursor, setNextCursor] = useState(null);
const [loadingMore, setLoadingMore] = useState(false);
const chatContainerRef = useRef(null); // Referência para controlar o scroll
```

#### 2. Adapte a função que carrega as mensagens na entrada da sala:
Procure onde o `Chat.jsx` faz a requisição inicial para `/rooms/${room}/messages` (por volta da linha 820) e atualize para:

```javascript
const loadRoomMessages = async (roomId) => {
  try {
    const response = await apiRequest(`/rooms/${roomId}/messages?limit=50`);
    
    // Tratamento retrocompatível: caso a API retorne array ou o novo formato { messages, hasMore, nextCursor }
    if (Array.isArray(response)) {
      setMessages(response);
      setHasMore(false);
      setNextCursor(null);
    } else {
      setMessages(response.messages || []);
      setHasMore(response.hasMore || false);
      setNextCursor(response.nextCursor || null);
    }

    // Na primeira carga, rola imediatamente para o rodapé (mensagens mais novas)
    scrollToBottom();
  } catch (error) {
    console.error("Erro ao carregar mensagens da sala:", error);
  }
};
```

---

## 📜 ETAPA 6: Frontend — Infinite Scroll Suave sem Saltos de Tela (Scroll Anchor)

### 📌 O que você vai fazer nesta etapa
Esta é a etapa mais importante de experiência do usuário (UX). Você vai implementar o carregamento sob demanda ao rolar para o topo, **mantendo a posição visual de leitura do usuário intacta**.

### 🔍 O problema do "salto de tela" e a solução matemática:
- Se o usuário rolar para o topo e nós simplesmente fizermos `setMessages([...novasMensagens, ...mensagensAtuais])`, o navegador manterá o `scrollTop` em 0.
- Como entraram 30 novas mensagens em cima, a tela daria um "pulo" violento para a mensagem mais antiga de todas, tirando o usuário do ponto onde ele estava lendo!
- **A Solução:**
  1. Antes de adicionar as mensagens novas, nós anotamos a altura total atual do container: `previousScrollHeight`.
  2. Quando as mensagens novas entram, o container ganha uma nova altura: `newScrollHeight`.
  3. A diferença entre as duas alturas é exatamente o tamanho do bloco que acabou de entrar.
  4. Nós ajustamos o `scrollTop` somando essa diferença via `requestAnimationFrame`. Resultado: **a mensagem que o usuário estava olhando continua parada exatamente no mesmo lugar da tela!**

### 📝 Instruções Passo a Passo no [`frontend/src/pages/Chat.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/pages/Chat.jsx)

#### 1. Crie a função `loadOlderMessages`:
```javascript
const loadOlderMessages = async () => {
  // Evita requisições repetidas se já estiver carregando ou se o histórico já acabou
  if (!hasMore || loadingMore || !nextCursor) return;

  setLoadingMore(true);
  const container = chatContainerRef.current;
  
  // 1. Salva as posições antes da inserção
  const previousScrollHeight = container ? container.scrollHeight : 0;
  const previousScrollTop = container ? container.scrollTop : 0;

  try {
    const response = await apiRequest(
      `/rooms/${room}/messages?limit=30&before=${encodeURIComponent(nextCursor)}`
    );

    const olderMessages = response.messages || [];

    // 2. Concatena as mensagens antigas ANTES das mensagens atuais
    setMessages(prev => [...olderMessages, ...prev]);
    setHasMore(response.hasMore);
    setNextCursor(response.nextCursor);

    // 3. Compensa o scroll no próximo frame de animação do navegador
    requestAnimationFrame(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const addedHeight = newScrollHeight - previousScrollHeight;
        container.scrollTop = previousScrollTop + addedHeight;
      }
    });
  } catch (error) {
    console.error("Falha ao paginar histórico antigo:", error);
  } finally {
    setLoadingMore(false);
  }
};
```

#### 2. Adicione o detector de rolagem no container JSX do chat:
Localize a `<div>` que tem o scroll das mensagens e adicione a `ref` e o evento `onScroll`:

```jsx
<div
  ref={chatContainerRef}
  onScroll={(e) => {
    // Se o usuário rolou até menos de 80px do topo, dispara a busca de mais histórico
    if (e.currentTarget.scrollTop < 80 && hasMore && !loadingMore) {
      loadOlderMessages();
    }
  }}
  className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar"
>
  {/* 1. Indicador visual no topo enquanto busca mensagens antigas */}
  {loadingMore && (
    <div className="py-2 flex justify-center items-center gap-2 text-xs text-sky-500 font-medium animate-pulse">
      <div className="w-4 h-4 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      Carregando mensagens anteriores...
    </div>
  )}

  {/* 2. Marcador visual avisando que chegou no começo de tudo */}
  {!hasMore && messages.length > 0 && (
    <div className="py-3 text-center text-xs text-slate-400 dark:text-slate-500 font-medium select-none">
      📌 Início do histórico da sala alcançado
    </div>
  )}

  {/* Renderização normal dos balões de mensagens */}
  {messages.map(msg => (
    <MessageBubble key={msg.id || msg.messageId} msg={msg} />
  ))}
</div>
```

*(Observação: replique a mesma lógica no arquivo [`frontend/src/pages/Directs.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/pages/Directs.jsx) para as conversas privadas).*

---

## 📅 ETAPA 7: Frontend — Separadores Cronológicos de Data (UX)

### 📌 O que você vai fazer nesta etapa
Inserir divisores visuais elegantes entre mensagens enviadas em dias diferentes (ex: *"Hoje"*, *"Ontem"*, *"14 de Outubro de 2026"*), como no WhatsApp e Discord.

### 📝 Instruções Passo a Passo

#### 1. Crie uma função utilitária de formatação de data:
```javascript
const formatDateBadge = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Hoje';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Ontem';
  }

  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};
```

#### 2. Na renderização da lista de mensagens, compare a data da mensagem atual com a anterior:
```jsx
{messages.map((msg, index) => {
  const prevMsg = messages[index - 1];
  const currentDate = new Date(msg.created_at || msg.timestamp).toDateString();
  const prevDate = prevMsg ? new Date(prevMsg.created_at || prevMsg.timestamp).toDateString() : null;
  
  // Se mudou o dia em relação à mensagem anterior (ou se for a primeira mensagem da lista)
  const isDifferentDay = currentDate !== prevDate;

  return (
    <React.Fragment key={msg.id || msg.messageId}>
      {isDifferentDay && (
        <div className="flex items-center justify-center my-4 px-4 select-none">
          <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
          <span className="mx-3 px-3 py-1 rounded-full text-[11px] font-semibold bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400 shadow-xs backdrop-blur-xs">
            {formatDateBadge(msg.created_at || msg.timestamp)}
          </span>
          <div className="flex-1 h-px bg-black/10 dark:bg-white/10" />
        </div>
      )}

      <MessageBubble msg={msg} />
    </React.Fragment>
  );
})}
```

---

## 📥 ETAPA 8: Funcionalidade Extra — Exportar Conversa em Arquivo Texto (.txt)

### 📌 O que você vai fazer nesta etapa
Dar ao usuário a possibilidade de clicar em um botão no menu do chat e baixar todo o histórico visível daquela conversa em um arquivo `.txt` formatado.

### 📝 Instruções Passo a Passo

Adicione a função no [`frontend/src/pages/Chat.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/pages/Chat.jsx):

```javascript
const handleExportChatHistory = () => {
  if (!messages || messages.length === 0) {
    alert("Não há mensagens para exportar.");
    return;
  }

  // Monta o cabeçalho do arquivo
  const header = [
    "==================================================",
    `  SkyRipple - Histórico de Mensagens`,
    `  Sala: ${room || 'Geral'}`,
    `  Exportado em: ${new Date().toLocaleString('pt-BR')}`,
    `  Total de mensagens: ${messages.length}`,
    "==================================================\n\n"
  ].join('\n');

  // Formata cada linha de mensagem
  const body = messages.map(msg => {
    const time = new Date(msg.created_at || msg.timestamp).toLocaleString('pt-BR');
    const author = msg.user?.displayName || msg.sender?.displayName || "Usuário";
    const text = msg.content || msg.text || (msg.image_url ? "[Imagem anexada]" : "");
    return `[${time}] ${author}: ${text}`;
  }).join('\n');

  const fileContent = header + body;

  // Cria o arquivo virtual em memória e dispara o download
  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `historico-${room || 'chat'}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
};
```
*(Você pode colocar um botão com o ícone de download no cabeçalho do chat chamando `handleExportChatHistory`).*

---

## 🧪 ETAPA 9: Criação de Testes Automatizados com Jest & Supertest

### 📌 O que você vai fazer nesta etapa
Garantir que a sua implementação seja à prova de falhas adicionando testes que validem a paginação e o cursor nas suítes [`backend/tests/message.test.js`](file:///home/lucasramos/Documentos/WebChat/backend/tests/message.test.js) e [`backend/tests/directs.test.js`](file:///home/lucasramos/Documentos/WebChat/backend/tests/directs.test.js). O backend utiliza banco SQLite 100% em memória para testes atômicos ultra-rápidos e isolados.

### 📝 Instruções Passo a Passo no [`backend/tests/message.test.js`](file:///home/lucasramos/Documentos/WebChat/backend/tests/message.test.js)

Adicione um bloco de testes dedicado ao histórico:

```javascript
describe('Testes de Paginação do Histórico de Mensagens', () => {
  let roomId;
  let userToken;

  beforeAll(async () => {
    // Configura usuário e sala para os testes...
  });

  it('deve respeitar o parâmetro limit e retornar os metadados de paginação', async () => {
    const response = await request(app)
      .get(`/api/rooms/${roomId}/messages?limit=3`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('messages');
    expect(response.body).toHaveProperty('hasMore');
    expect(response.body).toHaveProperty('nextCursor');
    expect(Array.isArray(response.body.messages)).toBe(true);
    expect(response.body.messages.length).toBeLessThanOrEqual(3);
  });

  it('deve carregar registros anteriores ao fornecer o cursor before', async () => {
    const page1 = await request(app)
      .get(`/api/rooms/${roomId}/messages?limit=2`)
      .set('Authorization', `Bearer ${userToken}`);

    const cursor = page1.body.nextCursor;

    if (cursor) {
      const page2 = await request(app)
        .get(`/api/rooms/${roomId}/messages?limit=2&before=${encodeURIComponent(cursor)}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(page2.status).toBe(200);
      expect(page2.body.messages.length).toBeGreaterThan(0);
      
      const oldestMessageDate = new Date(page2.body.messages[0].created_at).getTime();
      expect(oldestMessageDate).toBeLessThan(new Date(cursor).getTime());
    }
  });

  it('deve limitar o parâmetro limit ao teto máximo de 100 mensagens', async () => {
    const response = await request(app)
      .get(`/api/rooms/${roomId}/messages?limit=99999`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.messages.length).toBeLessThanOrEqual(100);
  });
});
```

Execute a suíte do backend:
```bash
npm test --prefix backend
```

---

## ✅ Checklist Final de Entrega

Antes de submeter suas alterações para revisão, confira cada um destes pontos:

- [ ] **Índices no Banco:** Verifique se os índices compostos em [`backend/src/models/Message.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/models/Message.js) e [`backend/src/models/DirectMessage.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/models/DirectMessage.js) foram adicionados.
- [ ] **Repositórios & Cursor:** Métodos `findByRoomId` e `findMessagesByConversation` implementam `limit + 1`, invertem o array (`.reverse()`) e retornam `nextCursor`.
- [ ] **Segurança no Service:** Parâmetros `limit` são higienizados (mínimo 1, máximo 100) e datas `before` validadas em [`backend/src/services/MessageService.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/services/MessageService.js) e [`backend/src/services/DirectService.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/services/DirectService.js).
- [ ] **Ordem das Mensagens:** Ao entrar na sala, a mensagem mais antiga está no topo e a mais nova está no rodapé.
- [ ] **Rolagem Infinita Suave:** Ao rolar para o topo, a mensagem "Carregando mensagens anteriores..." aparece e o lote antigo entra suavemente sem saltos visuais na tela via compensação de `scrollTop`.
- [ ] **Fim do Histórico:** Quando não há mais mensagens antigas, o indicador "📌 Início do histórico da sala alcançado" é exibido.
- [ ] **Mensagens Diretas (1x1):** O histórico do chat privado ([`frontend/src/pages/Directs.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/pages/Directs.jsx)) também está paginado e integrado com o sistema de horário e data.
- [ ] **Separador Cronológico de Dias:** As mensagens exibem o divisor visual com "Hoje", "Ontem" ou a data formatada por extenso.
- [ ] **Exportação de Conversa:** Funcionalidade de download do histórico em `.txt` acessível no cabeçalho do chat.
- [ ] **Documentação OpenAPI & Mintlify:** Rotas atualizadas no Swagger ([`backend/src/config/swagger.js`](file:///home/lucasramos/Documentos/WebChat/backend/src/config/swagger.js)) e portal Mintlify ([`docs/`](file:///home/lucasramos/Documentos/WebChat/docs)).
- [ ] **Bateria de Testes Completa (202 Testes 100% Aprovados):**
  ```bash
  # Testes de Backend (15 suítes / 134 testes)
  npm test --prefix backend

  # Testes de Frontend (13 suítes / 68 testes)
  npm test --prefix frontend -- --run

  # Ou ambos via script raiz:
  npm run test:backend && npm run test:frontend
  ```

Se precisar de qualquer esclarecimento sobre a arquitetura do projeto ou sobre as camadas do backend, consulte também a documentação técnica oficial em [`backend/README.md`](file:///home/lucasramos/Documentos/WebChat/backend/README.md) e no [`README.md`](file:///home/lucasramos/Documentos/WebChat/README.md) principal. Bom trabalho! 🚀
