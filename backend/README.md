# 🚀 SkyRipple API — Backend Service

Documentação técnica oficial do motor de backend do **SkyRipple**. Este serviço implementa uma arquitetura híbrida de alto desempenho, unindo contratos **RESTful HTTP** padronizados para operações de persistência e governança a um pipeline bidirecional em tempo real acionado por **WebSockets (Socket.io)**.

---

### 📑 Sumário Executivo
1. [Visão Geral & Paradigma Arquitetural](#1-visão-geral--paradigma-arquitetural)
2. [Arquitetura de Software em Camadas (Layered Architecture)](#2-arquitetura-de-software-em-camadas-layered-architecture)
3. [Stack Tecnológica & Dependências](#3-stack-tecnológica--dependências)
4. [Modelagem de Dados & Esquema Relacional (DER)](#4-modelagem-de-dados--esquema-relacional-der)
5. [Segurança, Autenticação & Políticas de Acesso](#5-segurança-autenticação--políticas-de-acesso)
6. [Motor em Tempo Real & WebSockets (Socket.io)](#6-motor-em-tempo-real--websockets-socketio)
7. [Catálogo Completo da API REST](#7-catálogo-completo-da-api-rest)
8. [Padrões de Comunicação, Erros & Rate Limiting](#8-padrões-de-comunicação-erros--rate-limiting)
9. [Webhooks & Integrações Assíncronas](#9-webhooks--integrações-assíncronas)
10. [Estrutura Física do Projeto](#10-estrutura-física-do-projeto)
11. [Configuração de Ambiente (.env)](#11-configuração-de-ambiente-env)
12. [Estratégia de Testes Automatizados](#12-estratégia-de-testes-automatizados)
13. [Guia de Execução Local](#13-guia-de-execução-local)
14. [Documentação Interativa (Swagger & Mintlify)](#14-documentação-interativa-swagger--mintlify)
15. [Roadmap & Próximos Passos (Futuras Implementações)](#15-roadmap--próximos-passos-futuras-implementações)

---

#### 1. Visão Geral & Paradigma Arquitetural
O backend do **SkyRipple** foi desenhado com o objetivo de isolar estritamente o tráfego transacional da mensageria volátil em tempo real:
* **Camada Transacional (HTTP/REST)**: Provê endpoints determinísticos para registro/login de usuários, resolução de perfis (`/auth/me`), provisionamento de salas temáticas (`rooms`), histórico paginado e busca textual por termos (`search?q=...`), denúncias (`reports`), canal de sugestões (`feedbacks`) e operações privilegiadas de administração do cluster.
* **Camada de Streaming e Presença (WebSockets)**: Gerencia o ciclo de vida de conexões persistentes, autentica handshakes com tokens JWT, realiza *broadcasting* seletivo por salas virtuais, rastreia presença ativa (*in-memory presence mapping*) e impõe *throttling* por socket.
* **Centralização de Negócio no Node.js**: O banco de dados PostgreSQL (hospedado via Supabase) opera com **Row Level Security (RLS) desativado**. Toda a governança de quem pode ler, gravar, atualizar ou excluir registros reside exclusivamente nos serviços e middlewares do backend, evitando duplicidade de regras no SGBD e garantindo integridade transacional centralizada.

---

#### 2. Arquitetura de Software em Camadas (Layered Architecture)
O código adota o padrão **Controller-Service-Repository** sobre um ecossistema desacoplado:

```
[ Cliente Web / Mobile / SDK ]
               │
      ┌────────┴────────┐
      │  HTTP REST /api │
      ▼                 ▼
 [ Middlewares ]   [ Socket.io Gateway ]
  - helmet          - JWT Handshake Auth
  - cors            - Rate Limiter (500ms)
  - rateLimit       - In-Memory Presence Map
  - auth / admin    - Room Channels
      │                 │
      ▼                 │
 [ Controllers ]        │
  - req/res binding     │
  - errorHandler        │
      │                 │
      ▼                 │
  [ Services ]          │
  - Regras de negócio   │
  - Criptografia bcrypt │
  - Validação lógica    │
      │                 │
      ▼                 │
 [ Repositories ]       │
  - Abstração de queries│
      │                 │
      ▼                 ▼
   [ Models (Sequelize ORM) ] ──▶ [ PostgreSQL / Supabase ]
```

##### Papel das Camadas:
| Camada | Diretório | Responsabilidade Primária |
| ------ | ------ | ------ |
| **Ponto de Entrada** | `server.js` | Inicialização do servidor HTTP, binding da porta, instanciação do Socket.io e sincronização do Sequelize. |
| **Aplicação Express** | `src/app.js` | Configuração da instância Express, injeção de middlewares globais (CORS, Helmet, Rate Limit), Swagger UI e roteamento REST. |
| **Gateway em Tempo Real** | `src/sockets/` | Modularização de WebSockets: autenticação de handshake JWT, gerenciamento de presença em memória e handlers de eventos de chat. |
| **Roteamento** | `src/routes/` | Declaração de rotas da API, associação de rate limiters específicos por contexto e injeção dos middlewares de autorização. |
| **Middlewares** | `src/middleware/` | Interceptação de requisições: decodificação e validação de Bearer Tokens JWT (`auth.js`) e validação estrita de claims administrativas (`adminAuth.js`). |
| **Controladores** | `src/controllers/` | Parsing e validação de payloads (`req.body`, `req.params`, `req.query`), invocação de Services e despacho semântico de status HTTP com captura centralizada de exceções (`errorHandler.js`). |
| **Serviços** | `src/services/` | Coração da regra de negócio: verificação de duplicidade de credenciais, hashing de senhas, checagem de permissão de posse de recursos e orquestração de transações. |
| **Repositórios** | `src/repositories/` | Interface direta com os Models do Sequelize. Isola a lógica SQL/ORM da camada de negócios, facilitando testes e manutenção. |
| **Modelos** | `src/models/` | Definição das tabelas relacionais, constraints, campos padrão, tipos UUID e declaração de relacionamentos associativos (`hasMany`, `belongsTo`, `belongsToMany`). |
| **Configuração** | `src/config/` | Factory de conexão do Sequelize (`database.js`), políticas de CORS (`cors.js`) e documentação Swagger JSDoc (`swagger.js`). |

---

#### 3. Stack Tecnológica & Dependências
##### Core Runtime & Frameworks
* **Node.js (v18+)**: Ambiente de execução assíncrono não-bloqueante.
* **Express.js (v4.19)**: Framework web minimalista para o roteamento REST.
* **Socket.io (v4.7)**: Engine de comunicação bidirecional com suporte automático a WebSocket nativo e HTTP long-polling.

##### Persistência & Banco de Dados
* **Sequelize (v6.37)**: ORM relacional baseado em Promises para modelagem, relacionamentos e sanitização de queries.
* **pg & pg-hstore (v8.23)**: Driver de conexão para PostgreSQL com suporte a pooling e conexões seguras SSL.
* **Prisma Schema (`prisma/schema.prisma`)**: Definição declarativa complementar do banco relacional.

##### Segurança & Criptografia (Baseline CIS Controls IG1 & OWASP ASVS L1)
* **argon2 (v0.45)**: Padrão-ouro recomendado pela OWASP (Argon2id) com custo de memória (64MB), tempo (3 iterações) e paralelismo (4 threads) contra ataques acelerados por GPU/ASIC.
* **bcryptjs (v2.4)**: Suporte a hashes legados com motor de verificação híbrido e migração transparente (*auto-rehash*) no login.
* **jsonwebtoken (v9.0)**: Assinatura e verificação digital com algoritmo fixo (*algorithm pinning* `HS256`), ciclo de vida restrito e suporte a revogação de tokens.
* **crypto (Node.js nativo)**: Comparações em tempo constante (`timingSafeEqual`) com digests SHA-256 para neutralização de *timing side-channel attacks*.
* **helmet (v8.2)**: Cabeçalhos HTTP avançados com HSTS de 1 ano (`maxAge: 31536000`), `noSniff` e proteção contra clickjacking.
* **cors (v2.8)**: Whitelisting estrito com expressão regular ancorada para prevenir ataques de bypass de origem.
* **express-rate-limit (v8.5)**: Mitigação de DoS e bloqueio progressivo de contas após tentativas excessivas de login.
* **Módulos Corporativos Próprios**:
  - `src/utils/security.js`: Motor de criptografia, mitigação de enumeração de usuários, bloqueio de contas e sanitização contra XSS.
  - `src/utils/auditLogger.js`: Trilha forense estruturada em JSON com ofuscação automática de credenciais e PII.

##### Documentação & Testes
* **swagger-jsdoc (v6.3) & swagger-ui-express (v5.0)**: Geração e renderização interativa da especificação OpenAPI 3.0 no endpoint `/api-docs`.
* **Jest (v29.7)**: Framework de testes automatizados para execução unitária e de integração com cobertura total.
* **Supertest (v7.3)**: Simulação de requisições HTTP reais sem necessidade de binding de portas de rede física.
* **sqlite3 (v6.0)**: Banco relacional em memória utilizado para execução atômica e ultrarrápida dos testes automatizados.

---

#### 4. Modelagem de Dados & Esquema Relacional (DER)
O banco de dados relacional é estruturado em torno de identificadores únicos universais (**UUIDv4**) para evitar enumeração sequencial:

```mermaid
erDiagram
    users ||--o{ rooms : "cria (owner)"
    users ||--o{ room_members : "participa"
    rooms ||--o{ room_members : "possui"
    rooms ||--o{ messages : "contém"
    users ||--o{ messages : "envia"
    messages ||--o{ reports : "recebe denúncia"
    users ||--o{ reports : "denuncia"
    users ||--o{ feedbacks : "envia sugestão"
    users ||--o{ notifications : "recebe notificação"
    users ||--o{ direct_conversations : "inicia (user1)"
    users ||--o{ direct_conversations : "recebe (user2)"
    direct_conversations ||--o{ direct_messages : "contém"
    users ||--o{ direct_messages : "envia"
    users ||--o{ favorites : "marca como favorito"

    users {
        uuid id PK
        string email UK
        string password "nullable (OAuth)"
        string displayName
        string profilePhoto
        text profileDesc
        string role "user | admin"
        string status "active | banned"
        text public_key "nullable (JWK ECDH P-256)"
        datetime created_at
    }

    rooms {
        uuid id PK
        string name
        string type "public | private"
        text description
        string category
        text image_url
        uuid owner_id FK
        datetime created_at
    }

    room_members {
        uuid room_id PK,FK
        uuid user_id PK,FK
        string role "owner | moderator | user"
        datetime joined_at
    }

    messages {
        uuid id PK
        uuid room_id FK "idx_messages_room_created_at"
        uuid user_id FK
        text content
        text image_url "nullable"
        text attachment_url "nullable (Data URL)"
        string attachment_type "nullable"
        string attachment_name "nullable"
        int attachment_size "nullable"
        datetime created_at "idx_messages_room_created_at"
    }

    direct_conversations {
        uuid id PK
        uuid user1_id FK
        uuid user2_id FK
        text last_message
        datetime last_message_at
        datetime created_at
    }

    direct_messages {
        uuid id PK
        uuid conversation_id FK "idx_direct_messages_conv_created_at"
        uuid sender_id FK
        text content "plain ou envelope e2ee:v1:..."
        text image_url "nullable"
        text attachment_url "nullable"
        string attachment_type "nullable"
        string attachment_name "nullable"
        int attachment_size "nullable"
        boolean read
        datetime created_at "idx_direct_messages_conv_created_at"
    }

    favorites {
        uuid id PK
        uuid user_id FK
        string item_type "room | conversation"
        uuid item_id
        datetime created_at
    }

    notifications {
        uuid id PK
        uuid user_id FK
        string type "system | message | invite | reaction | info"
        string title
        text content
        string link
        boolean read
        jsonb data
        datetime created_at
    }

    reports {
        uuid id PK
        uuid message_id FK
        uuid reporter_id FK
        string reason
        string status "pending | reviewed | dismissed"
        datetime created_at
    }

    feedbacks {
        uuid id PK
        uuid user_id FK
        text comment
        array_text images
        string status "pending | resolved"
        datetime created_at
    }
```

##### Regras de Integridade Referencial:
* **Exclusão em Cascata (ON DELETE CASCADE)**: A exclusão de uma sala exclui automaticamente suas mensagens e registros de membros associados. A exclusão de uma mensagem propaga a exclusão de suas respectivas denúncias (`reports`).
* **Anonimização de Criador (ON DELETE SET NULL)**: Se a conta do criador de uma sala for removida, a sala permanece ativa para a comunidade, marcando `owner_id = NULL`.

---

#### 5. Segurança, Autenticação & Políticas de Acesso
A autenticação é desenhada sob o modelo **Dual-Token Role-Based Access Control (RBAC)**:

| Atributo | Token de Usuário Regular | Token de Administrador |
| ------ | ------ | ------ |
| **Endpoint Emissor** | `POST /api/auth/login` ou `/register` | `POST /api/admin/auth` |
| **Origem da Credencial** | Hash salvo na tabela `users` | Chave estática `ADMIN_SECRET_KEY` (`.env`) |
| **Tempo de Vida (TTL)** | **7 dias** (`expiresIn: '7d'`) | **8 horas** (`expiresIn: '8h'`) |
| **Claims do Payload** | `{ "id": UUID, "email": string }` | `{ "id": "admin-system", "role": "admin" }` |
| **Rate Limit Aplicado** | 10 tentativas / 15 minutos por IP | 5 tentativas / 15 minutos por IP |
| **Middleware de Guarda** | `src/middleware/auth.js` | `src/middleware/adminAuth.js` |
| **Privilégios** | Leitura/escrita de salas, chat e envio de feedback | Banimentos, visualização de estatísticas e deleção forçada |

##### Formato do Cabeçalho de Autorização
Todas as requisições privadas exigem o cabeçalho HTTP:
```http
Authorization: Bearer <SEU_TOKEN_JWT>
```

##### Endurecimento de Segurança — Baseline CIS Controls IG1 & OWASP ASVS L1
O backend implementa um conjunto rigoroso de controles de cibersegurança:

1. **Hashing de Senhas com Argon2id (Padrão OWASP)**:
   - Configuração de alta resistência contra supercomputadores e GPUs: `type: argon2id`, `memoryCost: 65536` (64 MB), `timeCost: 3`, `parallelism: 4`.
   - **Motor Híbrido Retrocompatível**: Usuários antigos com hashes Bcrypt continuam autenticando normalmente e seus registros sofrem *upgrade* transparente automático para Argon2id no primeiro login com sucesso (*auto-rehash*).
2. **Mitigação de Enumeração de Usuários (Timing Attacks)**:
   - Quando um e-mail inexistente tenta login, o servidor computa uma verificação contra um *Dummy Hash* pré-calculado (`DUMMY_ARGON2_HASH`), equalizando o tempo de resposta em relação a um usuário existente e impedindo que atacantes descubram e-mails cadastrados medindo a latência da requisição.
3. **Comparação de Segredos em Tempo Constante**:
   - A autenticação administrativa em `/api/admin/auth` utiliza `crypto.timingSafeEqual` sobre digests SHA-256 padronizados de 32 bytes, eliminando ataques de temporização de strings.
4. **Proteção contra Força Bruta & Bloqueio Progressivo de Contas (CIS Control 5.3)**:
   - Além do rate limit de rede por IP, contas que acumularem **5 tentativas consecutivas de senha incorreta** no mesmo e-mail são bloqueadas temporariamente por **15 minutos** com resposta `429 Too Many Requests`.
5. **Revogação Instantânea de Sessões & Tokens (CIS Control 6.1)**:
   - Na exclusão de perfil ou encerramento de sessão, um carimbo de data/hora invalida em tempo real qualquer token JWT emitido antes da revogação, mesmo dentro de sua janela de expiração original.
6. **Higienização de Entradas & Defesa contra Stored XSS (CIS Control 10.3 & 16.11)**:
   - Todas as mensagens, buscas e nomes de salas passam pela função `sanitizeText` em `src/utils/security.js`, que neutraliza scripts embutidos, tags `<script>`, `<iframe>` e handlers inline (`onerror`, `onload`).
7. **Trilha Forense de Auditoria Estruturada (CIS Control 8.2 & 8.5)**:
   - Módulo `src/utils/auditLogger.js` registra formalmente eventos de login, bloqueios, exclusões e escalonamentos administrativos com ofuscação automática de credenciais e tokens.
8. **Blindagem de Rede, CORS Estrito e HSTS (CIS Control 4.1 & 13.4)**:
   - CORS com regex estrita ancorada (`isAllowedOrigin`) para impedir bypasses com subdomínios `localhost`.
   - HSTS de 1 ano (`maxAge: 31536000`, `includeSubDomains: true`, `preload: true`).
   - Rate limit global para a API REST (`600 reqs/5min`) e limite de payload JSON reduzido de 50MB para **10MB** para mitigar exaustão de memória (OOM DoS).
9. **Autenticação Híbrida & Sincronização Google OAuth (Supabase)**:
   - Suporte completo a login e registo social com **Google OAuth** gerenciado pelo Supabase.
   - Endpoint dedicado `POST /api/auth/oauth-sync` com extração e normalização resiliente de `displayName` (`full_name || name`), `profilePhoto` (`avatar_url || picture`) e `email`.
   - Contas criadas via OAuth mantêm `password = null`, impedindo ataques de enumeração de senha no formulário tradicional e recebendo token JWT legítimo do SkyRipple.
   - **Gatilho SQL para PostgreSQL**: O arquivo `src/database/supabase_oauth_trigger.sql` provê uma trigger function com `SECURITY DEFINER` que herda automaticamente novos usuários de `auth.users` diretamente para as tabelas `public.users` e `public.profiles`.

##### Supabase RLS Desativado por Design
Por decisão arquitetural explicada no plano de cibersegurança:
O Supabase atua exclusivamente como **Database-as-a-Service (DaaS)** conectado via pooler de conexões PostgreSQL. O Row Level Security (RLS) permanece desativado (`DISABLE ROW LEVEL SECURITY`) porque toda a validação de escopo, propriedade e permissão é garantida pela camada de Services no Node.js antes de qualquer chamada ao banco.

---

#### 6. Motor em Tempo Real & WebSockets (Socket.io)
O servidor WebSocket opera sob uma arquitetura modularizada dentro de `src/sockets/`:
* `src/sockets/index.js`: Instanciação do servidor Socket.io e acoplamento dos manipuladores.
* `src/sockets/socketAuth.js`: Middleware de handshake com validação estrita de Bearer JWT.
* `src/sockets/presence.js`: Gestão de presença por sala (`roomPresence`) e contagem global (`globalOnlineUsers`).
* `src/sockets/chatHandler.js`: Processamento de mensagens em tempo real, broadcast, edição e exclusão integrada.

##### 1. Interceptador de Handshake
Nenhum socket anônimo é autorizado a abrir conexão. Durante o handshake de conexão, o token JWT deve ser fornecido via payload auth:
```javascript
import { io } from "socket.io-client";

const socket = io("https://skyripple-9vqr.onrender.com", {
  auth: { token: "<SEU_TOKEN_JWT>" },
  transports: ["websocket", "polling"],
  withCredentials: true
});
```

##### 2. Controle de Presença em Memória (roomPresence)
O backend mantém um grafo dinâmico em memória para mapear conexões ativas:
* Estrutura: `Map<roomId, Map<userId, { id, name, email, socketIds: Set<socketId> }>>`.
* Suporta múltiplas abas ou dispositivos simultâneos do mesmo usuário sem duplicar a contagem de membros ativos.
* Quando o último socket de um usuário é encerrado, o backend notifica todos os membros da sala via evento `roomPresenceUpdated`.
* Controle global: Mapa `globalOnlineUsers` para indicação em tempo real de contatos ativos nas conversas diretas.

##### 3. Rate Limit no Envio de Mensagens
Para prevenir travamentos por flood via socket, o backend intercepta o evento `send_message`:
* **Janela mínima**: **500 ms** entre mensagens por `userId`.
* Caso a regra seja violada, o servidor aborta a persistência e responde imediatamente com o evento de erro:
```json
{ "error": "Você está enviando mensagens muito rápido. Aguarde um momento." }
```

##### 4. Protocolo Completo de Eventos

###### Eventos Emitidos pelo Cliente (Client ➔ Server):
| Evento | Payload | Ação Realizada no Backend |
| ------ | ------ | ------ |
| `joinRoom` | `{ roomId, user: { id, name, email } }` | Inscreve o socket na sala virtual e emite contagem atualizada de presença. |
| `leaveRoom` | `{ roomId, userId }` | Remove o socket da sala e notifica decremento de membros online. |
| `send_message` | `{ room, userId, userName, content, imageUrl?, attachment? }` | Aplica rate limit (500ms), valida tamanho do anexo (<= 5MB), salva no PostgreSQL e faz broadcast do registro para a sala. |
| `send_direct_message` | `{ conversationId, content, attachment? }` | Roteia e persiste envelope de mensagem direta (suporta texto claro ou envelope cifrado `e2ee:v1:...`). |
| `edit_message` | `{ room, messageId, message }` | Atualiza a mensagem no banco e transmite `message_edited`. |
| `delete_message` | `{ room, messageId }` | Exclui do banco e emite `message_deleted` para os participantes. |
| `toggle_like` | `{ room, messageId, userId }` | Transmite `like_toggled` em tempo real para os clientes da sala. |

###### Eventos Transmitidos pelo Servidor (Server ➔ Client):
| Evento | Payload | Finalidade |
| ------ | ------ | ------ |
| `roomPresenceUpdated` | `{ roomId, onlineUsers, onlineCount }` | Sincroniza a lista de avatares online e o total de membros ativos no cabeçalho da sala. |
| `receive_message` | Objeto completo da mensagem persistida | Entrega a nova mensagem com autor, timestamp e dados de anexo a todos os clientes da sala. |
| `receive_direct_message` | Objeto de mensagem direta (com envelope E2EE) | Entrega a mensagem privada ao destinatário em tempo real sem expor o conteúdo descriptografado ao servidor. |
| `message_edited` | `{ messageId, message }` | Notifica que o texto de uma mensagem foi editado. |
| `message_deleted` | `{ messageId }` | Informa a remoção de uma mensagem para atualização da interface. |
| `room_updated` | `{ id, name, description }` | Notifica a todos os membros que detalhes da sala foram alterados pelo dono/admin. |
| `member_role_updated` | `{ roomId, userId, role }` | Notifica promoção ou rebaixamento de cargo de um membro da sala (`moderator`/`user`). |
| `member_kicked` | `{ roomId, userId, reason }` | Notifica a expulsão de um integrante para remoção imediata da listagem de membros. |
| `ownership_transferred` | `{ roomId, oldOwnerId, newOwnerId }` | Transfere a posse e liderança da sala em tempo real. |
| `kicked_from_room` | `{ roomId, reason }` | Enviado diretamente ao socket do usuário expulso para notificação e redirecionamento. |
| `rate_limit_error` | `{ error }` | Alerta disparado individualmente para o socket que exceder 1 msg/500ms. |
| `message_error` | `{ error }` | Notifica falhas de conexão ou persistência durante a gravação. |

---

#### 7. Catálogo Completo da API REST
* **URL Base (Produção)**: `https://skyripple-9vqr.onrender.com/api`
* **URL Base (Local)**: `http://localhost:3001/api`

##### Healthcheck
* `GET /` — `{ "status": "online", "service": "WebChat MVP API" }` (Liveness check sem autenticação).

##### Módulo: Autenticação & Conta (`/api/auth`)
| Método | Endpoint | Proteção | Descrição |
| ------ | ------ | ------ | ------ |
| POST | `/auth/register` | Rate Limit (10/15min) | Cadastra usuário com senha bcrypt/Argon2id e já retorna dados públicos + token JWT. |
| POST | `/auth/login` | Rate Limit (10/15min) | Valida credenciais com mitigação anti-enumeração e emite token de acesso válido por 7 dias. |
| POST | `/auth/oauth-sync` | Rate Limit (10/15min) | Sincroniza usuário autenticado via Google OAuth (Supabase) herdando `name`, `avatar_url`, `email` e emitindo token JWT. |
| GET | `/auth/me` | Bearer Token | Retorna os dados cadastrais completos do usuário logado. |
| DELETE | `/auth/me` | Bearer Token | Exclui permanentemente o perfil do usuário e remove suas credenciais. |

##### Módulo: Salas de Conversa (`/api/rooms`)
| Método | Endpoint | Proteção | Descrição |
| ------ | ------ | ------ | ------ |
| GET | `/rooms` | Bearer Token | Lista todas as salas existentes com contagem dinâmica `members_count`. |
| POST | `/rooms` | Bearer Token | Cria nova sala, define o criador como owner e registra na tabela `room_members`. |
| GET | `/rooms/:id` | Bearer Token | Retorna detalhes da sala, membros ativos e perfil do requisitante (`is_member`, `current_user_role`). |
| PUT | `/rooms/:id` | Bearer Token / Owner | Atualiza título e descrição da sala (restrito ao criador/dono ou administrador). |
| DELETE | `/rooms/:id` | Bearer Token / Admin | Apaga a sala (permitido ao criador original ou a administradores). |
| POST | `/rooms/:id/join` | Bearer Token | Inscreve o usuário na lista de membros da sala (`role: 'user'`). |
| GET | `/rooms/:id/members` | Bearer Token | Lista todos os integrantes registrados na sala com papéis e data de adesão. |
| PATCH | `/rooms/:roomId/members/:userId/role` | Bearer Token / Owner | Promove ou rebaixa membro da sala (`role: 'moderator'` ou `'user'`). |
| DELETE | `/rooms/:roomId/members/:userId` | Bearer Token / Mod / Owner | Expulsa membro da sala (kick hierárquico: dono expulsa qualquer membro; moderador expulsa membros comuns). |
| POST | `/rooms/:id/transfer-ownership` | Bearer Token / Owner | Transfere atomicamente a titularidade e posse da sala para outro membro. |

##### Módulo: Mensagens & Histórico (`/api`)
| Método | Endpoint | Proteção | Descrição |
| ------ | ------ | ------ | ------ |
| GET | `/rooms/:roomId/messages` | Bearer Token | Retorna mensagens paginadas por cursor (`before`, `since`, `limit`) com ordenação cronológica e índice B-tree. |
| GET | `/rooms/:roomId/messages/search` | Bearer Token | Pesquisa mensagens pelo query param `?q=termo` (case-insensitive). |
| POST | `/rooms/:roomId/messages` | Bearer Token | Envia mensagem com texto e/ou anexo multimídia/áudio (até 5MB) via HTTP REST. |
| DELETE | `/messages/:id` | Bearer Token / Mod / Owner / Admin | Exclusão hierárquica: autor (até 24h), moderador da sala (apenas mensagens de membros regulares), dono da sala (qualquer mensagem) ou administrador global. |

##### Módulo: Mensagens Diretas & Troca de Chaves E2EE (`/api/directs`)
| Método | Endpoint | Proteção | Descrição |
| ------ | ------ | ------ | ------ |
| GET | `/directs/conversations` | Bearer Token | Lista todas as conversas diretas ativas com status, dados do interlocutor e última mensagem. |
| POST | `/directs/conversations` | Bearer Token | Obtém conversa existente ou inicia nova conversa direta 1x1 com `targetUserId`. |
| GET | `/directs/conversations/:id/messages` | Bearer Token | Retorna histórico paginado por cursor (`before`, `since`, `limit`) da conversa direta. |
| POST | `/directs/conversations/:id/messages` | Bearer Token | Envia mensagem de texto/anexo ou envelope cifrado E2EE (`e2ee:v1:...`) na conversa direta. |
| DELETE | `/directs/conversations/:id` | Bearer Token | Oculta/remove a conversa direta para o usuário autenticado. |
| GET | `/directs/users` | Bearer Token | Lista e pesquisa usuários cadastrados disponíveis para iniciar chat privado. |
| PUT | `/directs/keys` | Bearer Token | Registra ou atualiza a chave pública ECDH P-256 (formato JWK) do usuário autenticado para E2EE. |
| GET | `/directs/keys/:userId` | Bearer Token | Obtém a chave pública ECDH P-256 (JWK) de um usuário específico para derivação de segredo compartilhado. |

##### Módulo: Favoritos (`/api/favorites`)
| Método | Endpoint | Proteção | Descrição |
| ------ | ------ | ------ | ------ |
| GET | `/favorites` | Bearer Token | Lista todas as salas ou conversas marcadas como favoritas pelo usuário. |
| POST | `/favorites` | Bearer Token | Adiciona sala (`item_type: 'room'`) ou conversa (`item_type: 'conversation'`) aos favoritos. |
| DELETE | `/favorites/:itemType/:itemId` | Bearer Token | Remove o item dos favoritos do usuário. |

##### Módulo: Notificações em Tempo Real (`/api/notifications`)
| Método | Endpoint | Proteção | Descrição |
| ------ | ------ | ------ | ------ |
| GET | `/notifications` | Bearer Token | Lista as notificações do usuário autenticado (com semente amigável no primeiro acesso). |
| POST | `/notifications` | Bearer Token | Cria uma notificação programática ou broadcastada. |
| PATCH | `/notifications/:id/read` | Bearer Token | Marca uma notificação individual como lida (`read: true`). |
| PATCH | `/notifications/read-all` | Bearer Token | Marca todas as notificações do usuário como lidas em lote. |
| DELETE | `/notifications/:id` | Bearer Token | Exclui uma notificação específica. |
| DELETE | `/notifications/all` | Bearer Token | Limpa todo o histórico de notificações do usuário. |

##### Módulo: Moderação & Feedbacks (`/api`)
| Método | Endpoint | Proteção | Descrição |
| ------ | ------ | ------ | ------ |
| POST | `/reports` | Bearer Token | Registra uma denúncia formal contra uma mensagem abusiva (`message_id`, `reason`). |
| POST | `/feedbacks` | Bearer Token | Envia relato de bug ou sugestão de melhoria com imagens em anexo (`comment`, `images`). |

##### Módulo: Painel Administrativo (`/api/admin`)
*Todas as rotas exigem o header com Token emitido no login de admin (`role === 'admin'`).*

| Método | Endpoint | Proteção | Descrição |
| ------ | ------ | ------ | ------ |
| POST | `/admin/auth` | Rate Limit (5/15min) | Valida `password === ADMIN_SECRET_KEY` e emite JWT administrativo (TTL de 8h). |
| GET | `/stats` | Bearer Token | Estatísticas globais: `total_users`, `active_rooms`, `pending_reports` e `active_bans`. |
| GET | `/admin/users` | Admin Auth | Lista todos os usuários registrados no sistema. |
| PUT | `/admin/users/:id/status` | Admin Auth | Altera o status da conta do usuário (`status: 'active'` \| `'banned'`). |
| GET | `/admin/rooms` | Admin Auth | Listagem irrestrita de todas as salas cadastradas. |
| DELETE | `/admin/rooms/:id` | Admin Auth | Exclusão administrativa forçada de sala. |
| DELETE | `/admin/messages/:id` | Admin Auth | Exclusão administrativa forçada de mensagem inadequada. |
| GET | `/admin/reports` | Admin Auth | Lista todas as denúncias pendentes ou resolvidas. |
| PUT | `/admin/reports/:id` | Admin Auth | Altera o status de uma denúncia (`status: 'reviewed'` \| `'dismissed'`). |
| DELETE | `/admin/reports/:id` | Admin Auth | Exclui o chamado de denúncia. |
| GET | `/admin/feedbacks` | Admin Auth | Lista os feedbacks submetidos pelos usuários. |
| PUT | `/admin/feedbacks/:id` | Admin Auth | Atualiza o status do feedback (`status: 'resolved'`). |
| DELETE | `/admin/feedbacks/:id` | Admin Auth | Exclui o feedback do sistema. |

---

#### 8. Padrões de Comunicação, Erros & Rate Limiting
##### 1. Formato de Resposta Padronizado
* **Sucesso**: Retorna o JSON do recurso correspondente com status 200 OK ou 201 Created.
* **Erro**: Todas as falhas retornam obrigatoriamente a chave `error`:
```json
{
  "error": "Descrição clara e semântica do motivo da recusa."
}
```

##### 2. Mapeamento de Status HTTP (`src/controllers/errorHandler.js`)
O handler central traduz as regras de negócio disparadas pelos Services (`throw new Error(...)`) nos seguintes status HTTP:

| Código HTTP | Significado | Exemplos de Gatilho no SkyRipple |
| ------ | ------ | ------ |
| 200 OK | Requisição atendida | Consultas GET, atualizações PUT ou exclusões DELETE. |
| 201 Created | Criado | Criação de conta, nova sala, mensagem, report ou feedback. |
| 400 Bad Request | Parâmetros inválidos | Nome da sala em branco, credenciais ausentes ou campos mal formatados. |
| 401 Unauthorized | Não autorizado | Header Authorization ausente, token mal formatado ou expirado. |
| 403 Forbidden | Proibido | Usuário comum tentando apagar sala de terceiros ou acessar rotas de administração restritas. |
| 404 Not Found | Recurso inexistente | UUID de usuário, sala, mensagem ou denúncia não encontrado no banco. |
| 409 Conflict | Conflito de integridade | Tentativa de cadastro com e-mail já existente (`SequelizeUniqueConstraintError`). |
| 429 Too Many Requests | Limite excedido | Bloqueio temporário por rate limit de login (usuário ou admin). |
| 500 Server Error | Falha interna | Exceções de infraestrutura não tratadas na conexão com o banco. |

---

#### 9. Webhooks & Integrações Assíncronas
Conforme padronizado na documentação do Mintlify, o backend contempla especificações para despacho de webhooks para microsserviços externos e robôs de auditoria.
* **Cabeçalhos de Segurança Enviados**:
  * `X-SkyRipple-Event`: Nome do evento (`message.created`, `room.created`, `report.created`).
  * `X-SkyRipple-Delivery`: UUID único de cada entrega para garantir idempotência.
  * `X-SkyRipple-Timestamp`: Timestamp UNIX do envio.
  * `X-SkyRipple-Signature`: Assinatura criptográfica `t=<timestamp>,v1=<hash_hmac_sha256>`.
* **Validação de Integridade**: O consumidor externo deve computar `HMAC-SHA256(timestamp + "." + rawBody, WEBHOOK_SECRET)` e comparar utilizando `crypto.timingSafeEqual` para prevenir ataques de timing e replay.
* **Política de Backoff Exponencial**: 5 tentativas em falhas 5xx (10s, 1m, 5m, 30m, 2h).

---

#### 10. Estrutura Física do Projeto
Abaixo está o mapeamento detalhado da estrutura de diretórios do backend:

```
backend/
├── package.json              # Metadados, scripts (start, dev, test) e dependências de produção/dev
├── package-lock.json         # Árvore de dependências trancada
├── server.js                 # Inicialização do servidor HTTP, binding de porta e Sequelize
├── prisma/
│   └── schema.prisma         # Esquema declarativo do PostgreSQL / Supabase
├── src/
│   ├── app.js                # Configuração do Express, middlewares de segurança e Swagger
│   ├── config/
│   │   ├── cors.js           # Whitelist de origens CORS e validação de requisições
│   │   ├── database.js       # Conexão do Sequelize com fallback (Postgres SSL vs SQLite memory)
│   │   └── swagger.js        # Configuração do Swagger JSDoc e UI OpenAPI 3.0
│   ├── database/
│   │   └── supabase_oauth_trigger.sql # Gatilho PostgreSQL para sincronização automática de perfis OAuth
│   ├── models/               # Modelagem relacional do Sequelize (Entidades)
│   │   ├── User.js           # Usuários, roles e status
│   │   ├── Room.js           # Salas de chat e metadados
│   │   ├── RoomMember.js     # Tabela associativa de participantes e cargos
│   │   ├── Message.js        # Mensagens de texto e referências a mídias
│   │   ├── DirectConversation.js # Conversas privadas 1x1
│   │   ├── DirectMessage.js  # Mensagens diretas privadas
│   │   ├── Favorite.js       # Salas e conversas favoritas
│   │   ├── Notification.js   # Notificações e avisos contextuais
│   │   ├── Report.js         # Denúncias de moderação
│   │   ├── Feedback.js       # Feedbacks de usuários com anexos
│   │   └── index.js          # Definição e inicialização de relacionamentos ORM
│   ├── repositories/         # Camada de abstração e isolamento de consultas SQL
│   │   ├── UserRepository.js
│   │   ├── RoomRepository.js
│   │   ├── RoomMemberRepository.js
│   │   ├── MessageRepository.js
│   │   ├── DirectRepository.js
│   │   ├── FavoriteRepository.js
│   │   ├── NotificationRepository.js
│   │   ├── ReportRepository.js
│   │   └── FeedbackRepository.js
│   ├── services/             # Regras de negócio, criptografia e verificações lógicas
│   │   ├── UserService.js    # Hashing Argon2id/bcrypt, sincronização OAuth e login
│   │   ├── RoomService.js    # Criação de salas, contagem, kicks e moderação hierárquica
│   │   ├── MessageService.js # Validação de conteúdo, sanitização XSS e busca textual
│   │   ├── DirectService.js  # Gestão de conversas e mensagens privadas 1x1
│   │   ├── FavoriteService.js# Adição e curadoria de favoritos
│   │   ├── NotificationService.js # Gestão e disparo de notificações
│   │   ├── ReportService.js  # Gestão do fluxo de denúncias
│   │   └── FeedbackService.js# Registro e resolução de feedbacks
│   ├── controllers/          # Mapeamento HTTP req/res e dispatchers
│   │   ├── UsuarioController.js # Registro, login, OAuth sync e perfil
│   │   ├── RoomController.js
│   │   ├── MessageController.js
│   │   ├── DirectController.js
│   │   ├── FavoriteController.js
│   │   ├── NotificationController.js
│   │   ├── ReportController.js
│   │   ├── FeedbackController.js
│   │   ├── AdminController.js
│   │   ├── StatsController.js
│   │   └── errorHandler.js   # Tradutor centralizado de exceptions em status HTTP
│   ├── middleware/
│   │   ├── auth.js           # Validação do token JWT de usuário regular
│   │   └── adminAuth.js      # Validação do token JWT restrito a administradores
│   ├── routes/               # Declaração dos endpoints e documentação Swagger JSDoc
│   │   ├── api.js            # Roteador central /api
│   │   ├── usuarioRoutes.js  # Rotas sob /api/auth (inclui /auth/oauth-sync)
│   │   ├── roomRoutes.js     # Rotas sob /api/rooms
│   │   ├── messageRoutes.js  # Rotas de mensagens e buscas
│   │   ├── directRoutes.js   # Rotas sob /api/directs
│   │   ├── favoriteRoutes.js # Rotas sob /api/favorites
│   │   ├── notificationRoutes.js # Rotas sob /api/notifications
│   │   ├── reportRoutes.js   # Rotas de denúncias
│   │   ├── feedbackRoutes.js # Rotas de feedback
│   │   └── admin.js          # Rotas sob /api/admin
│   ├── sockets/              # Arquitetura modular de WebSockets (Socket.io)
│   │   ├── index.js          # Inicialização e acoplamento dos gateways de socket
│   │   ├── socketAuth.js     # Interceptador e middleware de autenticação JWT
│   │   ├── presence.js       # Mapeamento de presença ativa por sala e online global
│   │   └── chatHandler.js    # Handlers de envio, edição, like e deleção de mensagens
│   └── utils/                # Utilitários corporativos de segurança e auditoria
│       ├── auditLogger.js    # Trilha forense estruturada com ofuscação de PII
│       └── security.js       # Criptografia Argon2id, Dummy Hash, timingSafeEqual e mitigação XSS
└── tests/                    # Suite completa de testes automatizados com Jest (18 suítes e 182 testes)
    ├── helpers.js            # Utilitários de reset do SQLite em memória e geradores de tokens
    ├── usuario.test.js       # Testes de registro, login e perfil
    ├── oauthSync.test.js     # Testes de sincronização OAuth (Google / Supabase)
    ├── room.test.js          # Testes de salas e controle de participantes
    ├── roomModeration.test.js# Testes de moderação, expulsão e transferência de posse
    ├── message.test.js       # Testes de mensagens e busca textual
    ├── pagination.test.js    # Testes de paginação por cursor (before, since, limit)
    ├── attachments.test.js   # Testes de upload, validação e sanitização de anexos (áudio e docs)
    ├── e2ee-keys.test.js     # Testes de registro e recuperação de chaves públicas ECDH P-256
    ├── chat.test.js          # Testes de integração de fluxo de chat
    ├── directs.test.js       # Testes de conversas e mensagens diretas 1x1
    ├── favorites.test.js     # Testes de gestão de favoritos
    ├── report.test.js        # Testes de denúncias
    ├── feedback.test.js      # Testes de feedbacks
    ├── models.test.js        # Testes unitários dos modelos do Sequelize
    ├── authMiddleware.test.js# Testes de proteção e rejeição de tokens
    ├── controllers.test.js   # Testes unitários dos métodos de controladores
    ├── security.test.js      # Testes de endurecimento CIS Controls e OWASP ASVS
    └── e2e-flow.test.js      # Teste de ponta a ponta (E2E) simulando jornada completa
```

---

#### 11. Configuração de Ambiente (.env)
Crie um arquivo `.env` dentro da raiz do diretório `backend/` contendo as seguintes variáveis:

```ini
# ===============================================
# CONFIGURAÇÃO DO SERVIDOR HTTP & WEBSOCKET
# ===============================================
PORT=3001
NODE_ENV=development

# ===============================================
# BANCO DE DADOS RELACIONAL (POSTGRESQL / SUPABASE)
# ===============================================
# String de conexão direta ou via pooler do PostgreSQL
DATABASE_URL=postgres://usuario:senha@host:5432/postgres?sslmode=require
DIRECT_URL=postgres://usuario:senha@host:5432/postgres

# Credenciais do Supabase (Apenas como serviço de persistência)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-secreta

# ===============================================
# SEGURANÇA, JWT E ADMINISTRAÇÃO
# ===============================================
# Segredo criptográfico de alta entropia para assinatura dos JWTs
JWT_SECRET=super_secreta_chave_jwt_skyripple_2026_xYz987

# Senha mestra necessária para obter token de administrador em POST /api/admin/auth
ADMIN_SECRET_KEY=sua_chave_mestra_admin_secreta

# ===============================================
# CORS & POLÍTICAS DE ORIGEM
# ===============================================
# URL do frontend para liberação estrita em produção
FRONTEND_URL=https://skyripple.vercel.app
```

**Nota de Segurança**: Em produção, `JWT_SECRET` e `ADMIN_SECRET_KEY` devem ser segredos criptográficos com comprimento mínimo de 32 caracteres. Nunca os compartilhe no versionamento git.

---

#### 12. Estratégia de Testes Automatizados
O backend possui uma suite completa de testes automatizados com **Jest** e **Supertest**, desenhada para rodar em qualquer máquina ou pipeline de CI/CD **sem necessitar de banco PostgreSQL externo**:

```bash
npm test
```

##### Como a Suite Opera:
* O script executa `jest --runInBand --detectOpenHandles`.
* O arquivo `src/config/database.js` detecta automaticamente a flag `process.env.NODE_ENV === 'test'` e instancia um banco **SQLite 100% em memória** (`sqlite::memory:`).
* Os rate limiters (`express-rate-limit`) são desativados automaticamente em testes (`skip: () => process.env.NODE_ENV === 'test'`) para permitir execução maciça sem falsos positivos.
* O helper `tests/helpers.js` recria as tabelas do zero de forma atômica (`sequelize.sync({ force: true })`) antes de cada bateria, garantindo isolamento total entre os testes.

##### Escopo Coberto (18 Suítes & 182 Testes Automatizados 100% Aprovados):
1. **Segurança & Criptografia (CIS Controls IG1 & OWASP ASVS)**: Hashing Argon2id, motor híbrido com upgrade transparente de Bcrypt, equalização temporal contra enumeração (*Dummy Hash*), comparações em tempo constante (`timingSafeEqual`), algoritmo fixo JWT `HS256`, revogação instantânea de tokens, bloqueio progressivo contra força bruta, sanitização contra XSS e ofuscação de logs forenses (`security.test.js`).
2. **Sincronização OAuth (Google / Supabase)**: Validação de herança de metadados (`name`, `avatar_url`, `email`), garantia de `password = null`, geração de JWT resiliente e sincronização contínua (`oauthSync.test.js`).
3. **Autenticação, Registro & Perfil**: Validação de e-mails duplicados, políticas de senha, login com bloqueio de tentativas e expiração de sessões (`usuario.test.js`).
4. **Salas de Chat**: Criação, busca, atualização de metadados, contagem de membros e exclusão de salas (`room.test.js`).
5. **Moderação & Gestão Hierárquica de Salas**: Kick hierárquico (dono/moderador), promoção e rebaixamento de membros, transferência atômica de titularidade de sala (`roomModeration.test.js`).
6. **Mensagens & Histórico**: Envio de mensagens, validação de limites de texto, uploads de anexos e busca textual case-insensitive (`message.test.js`).
7. **Paginação Baseada em Cursor**: Paginação de histórico em salas e directs com cursores `before`, `since` e `limit`, validação de ordenação cronológica e indexação composta B-Tree (`pagination.test.js`).
8. **Anexos Multimídia & Áudios**: Validação estrita de limites de payload (5 MB), sanitização de Data URLs, suporte a mensagens de áudio gravadas e documentos (`attachments.test.js`).
9. **Troca de Chaves Criptográficas (E2EE)**: Registro de chaves públicas ECDH P-256 no formato JWK (`PUT /api/directs/keys`), recuperação de chaves públicas de contatos (`GET /api/directs/keys/:userId`) e isolamento de segredos (`e2ee-keys.test.js`).
10. **Motor de Mensageria em Tempo Real**: Handshake autenticado, controle de presença em memória (`roomPresence`), rate limit de mensagens por socket (500ms) e emissão de eventos (`chat.test.js`).
11. **Mensagens Diretas Privadas (1x1)**: Abertura de conversas diretas, listagem de contatos e trânsito confidencial de mensagens privadas e envelopes cifrados E2EE (`directs.test.js`).
12. **Favoritos**: Adição e remoção atômica de salas e conversas favoritas por usuário (`favorites.test.js`).
13. **Denúncias de Moderação (Reports)**: Registro de denúncias contra mensagens abusivas e resolução administrativa (`report.test.js`).
14. **Feedbacks de Usuários**: Envio de relatos de bugs e sugestões com imagens anexas (`feedback.test.js`).
15. **Modelos ORM (Sequelize)**: Integridade de schemas, campos UUID, constraints de unicidade e associações relacionais (`models.test.js`).
16. **Middlewares de Segurança**: Rejeição de tokens ausentes, expirados ou forjados e proteção estrita de endpoints administrativos (`authMiddleware.test.js`).
17. **Controladores HTTP**: Mapeamento determinístico de requisições, validação de status HTTP e tratamento unificado de erros (`controllers.test.js`).
18. **Fluxos de Ponta a Ponta (E2E)**: Simulação completa: Registro ➔ Login ➔ Criação de Sala ➔ Adesão ➔ Envio de Mensagem ➔ Busca Textual ➔ Denúncia ➔ Resolução pelo Admin (`e2e-flow.test.js`).

---

#### 13. Guia de Execução Local
##### Pré-requisitos
* **Node.js**: v18.0.0 ou superior.
* **npm**: v9.0.0 ou superior.
* Acesso à internet para conexão com o PostgreSQL do Supabase (ou configuração de instância local do PostgreSQL).

##### Passo a Passo
1. **Acessar o diretório de backend**:
```bash
cd backend
```
2. **Configurar as Variáveis de Ambiente**: Crie o arquivo `.env` preenchendo as variáveis conforme a seção [Configuração de Ambiente](#11-configuração-de-ambiente-env).
3. **Executar a Suite de Testes para Validação**:
```bash
npm test
```
4. **Iniciar em Modo de Desenvolvimento (com live reload via nodemon)**:
```bash
npm run dev
```
5. **Iniciar em Modo de Produção**:
```bash
npm start
```

O console exibirá as mensagens de inicialização:
```text
[SWAGGER] Procurando arquivos em: .../src/routes/*.js
[SWAGGER] 40 rota(s) encontrada(s)
[SERVER] SUPABASE_URL carregada: true
[SERVER] SUPABASE_KEY carregada: true
[SERVER] Rodando na porta 3001
[Sequelize] Conexão com o banco de dados estabelecida com sucesso.
```

---

#### 14. Documentação Interativa (Swagger & Mintlify)
O backend disponibiliza duas formas de consultar e testar os contratos de API:

##### 1. Swagger UI Local & Produção
Renderizado pelo próprio servidor Express utilizando especificações JSDoc OpenAPI 3.0:
* **Ambiente Local**: `http://localhost:3001/api-docs`
* **Ambiente de Produção (SkyRipple)**: `https://skyripple-9vqr.onrender.com/api-docs`
* **Ambiente de Produção (Legado)**: `https://webchat-9vqr.onrender.com/api-docs`

###### Especificação OpenAPI & Cobertura
* **Título & Versão**: `SkyRipple API — Backend Service` (v1.0.0).
* **Rotas Documentadas**: 40 rotas cobrindo integralmente os endpoints REST do serviço.
* **Tags & Agrupamentos (9 Categorias)**:
  1. `Auth` — Autenticação local, registro, sincronização Google OAuth e dados do usuário logado.
  2. `Rooms` — Criação, listagem, membros, moderação hierárquica e transferência de titularidade de salas.
  3. `Messages` — Envio com anexos, paginação por cursor (`before`, `since`, `limit`), busca textual e exclusão de mensagens.
  4. `Directs` — Conversas diretas 1x1, listagem de contatos, histórico paginado e endpoints de troca de chaves públicas E2EE (`/directs/keys`).
  5. `Notifications` — Listagem, leitura individual/em lote e deleção de notificações de sistema.
  6. `Favorites` — Gestão atômica de favoritos de salas e conversas diretas.
  7. `Reports` — Envio e consulta de denúncias contra mensagens abusivas.
  8. `Feedbacks` — Canal de sugestões e relatos de bugs com suporte a múltiplos anexos.
  9. `Admin` — Métricas `/stats`, moderação de usuários, banimentos, denúncias e governança da plataforma.
* **Componentes & Schemas Reutilizáveis (`components.schemas`) (13 Schemas Canônicos)**:
  - `User`: Identificador UUID, nome exibido, e-mail, foto de perfil, recado, status, chave pública e papel no sistema.
  - `PublicKeyJwk`: Especificação JSON Web Key da chave pública ECDH P-256 (`crv`, `kty`, `x`, `y`).
  - `AttachmentInput`: Metadados e payload de anexo multimídia (`url`, `type`, `name`, `size`).
  - `Room`: Identificador, nome, descrição, categoria, tipo (pública/privada), criador e contagem de membros.
  - `RoomMember`: Associação usuário-sala com papel (`owner`, `moderator`, `user`) e data de adesão.
  - `Message`: Mensagem em sala com texto, anexos opcionais, autor e carimbo de data/hora.
  - `DirectConversation`: Conversa privada 1x1 com interlocutor e prévia da última mensagem.
  - `DirectMessage`: Mensagem privada entre dois usuários (plana ou envelope cifrado E2EE) com status e metadados.
  - `Notification`: Alerta de sistema com tipo, título, mensagem e status de leitura.
  - `Favorite`: Marcação de sala ou conversa com dados do item associado.
  - `Report`: Chamado de moderação com motivo da denúncia, status e mensagem associada.
  - `Feedback`: Relato de usuário com categoria, comentário, anexos e status de resolução.
  - `ErrorResponse`: Formato padronizado de erro `{ "error": "mensagem de erro" }`.
* **Esquemas de Segurança Suportados**:
  - `BearerAuth` (HTTP Bearer JWT via header `Authorization: Bearer <token>`).
  - `AdminAuth` (Chave de administração via header `x-admin-key: <ADMIN_SECRET_KEY>`).

No Swagger UI é possível autenticar interativamente através do botão **Authorize**, informando o token `Bearer <token>` ou a chave administrativa para testar todas as rotas protegidas diretamente pelo navegador.

##### 2. Portal Mintlify
Documentação completa de design system, arquitetura de sistemas, especificações de WebSockets e referência OpenAPI detalhada localizada na pasta `docs/` do repositório, pronta para deploy na plataforma Mintlify.

---

#### 15. Roadmap & Próximos Passos (Futuras Implementações)

Com a arquitetura base, o motor em tempo real, o endurecimento **CIS Controls IG1 & OWASP ASVS**, a **Paginação por Cursor** e a **Criptografia E2EE** concluídos e entregues, os próximos passos do backend contemplam:

##### 15.1. Chamadas de Voz & Vídeo P2P (WebRTC)
* **Sinalização via WebSockets (Socket.io Signaling Broker)**:
  - Troca de ofertas e respostas SDP (*Session Description Protocol*) e candidatos ICE (*Interactive Connectivity Establishment*) entre participantes de uma conversa direta.
  - Conexão ponto a ponto de áudio e vídeo de baixa latência sem trafegar mídia pesada pelo servidor.

##### 15.2. Armazenamento de Arquivos em Object Storage (S3 / Cloudflare R2 / Supabase Storage)
* **Upload Direto via URLs Pré-Assinadas (*Presigned URLs*)**:
  - Eliminação de payloads em Base64 no corpo das mensagens HTTP/Socket, reduzindo o tráfego de rede e o uso de memória do Node.js em até 70%.
  - Endpoint `POST /api/media/presigned-url` para emissão de links seguros temporários com upload direto do cliente para buckets S3/R2.
  - **Validação Estrita de Magic Bytes**: Checagem de cabeçalhos binários reais dos arquivos para mitigar ataques de camuflagem de executáveis maliciosos em extensões de imagem.

##### 15.3. Presença Distribuída & Escalabilidade Horizontal com Redis Adapter
* **Clusterização de WebSockets (`@socket.io/redis-adapter`)**:
  - Desacoplamento da memória local do processo (`roomPresence` e `globalOnlineUsers`) para um barramento Pub/Sub no Redis.
  - Capacidade de escalar o backend horizontalmente em múltiplos containers ou nós Kubernetes mantendo broadcast de eventos e presença sincronizada globalmente.

##### 15.4. Notificações Push Nativas (WebPush / FCM)
* **Entrega em Segundo Plano**:
  - Registro de *Service Workers* e subscrições WebPush (`web-push` RFC 8291) com chaves VAPID.
  - Disparo de notificações na área de trabalho e dispositivos móveis quando o usuário receber mensagens diretas ou menções (@usuario) com o navegador em segundo plano ou fechado.

---

<div align="center">
<sub>Engenharia de Backend desenvolvida com rigor para o projeto <b>SkyRipple</b>.</sub>
</div>
