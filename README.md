# SkyRipple

<div align="center">
  <img src="frontend/public/logo_512x512_transparente.svg" width="256" height="256" alt="SkyRipple Logo">
</div>


![Versão](https://img.shields.io/badge/Vers%C3%A3o-9.0.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-634EA7?style=for-the-badge&logo=vitest&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-68BB66?style=for-the-badge&logo=supertest&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E4AC?style=for-the-badge&logo=render&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-000000?style=for-the-badge&logo=swagger&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-216D31?style=for-the-badge&logo=sequelize&logoColor=white)

O SkyRipple é uma aplicação web de chat em tempo real onde os usuários podem se conectar, entrar em salas temáticas e trocar mensagens instantaneamente. O projeto foca em uma experiência rica e nostálgica, trazendo uma estética clean com identidade visual inspirada no Web 2.0 Gloss (Skeuomorfismo e com influências do Frutiger Aero) aliada a tecnologias web modernas.

## O que o projeto faz

O SkyRipple funciona como um ponto de encontro virtual. De forma simples, ele permite:

* Criar uma conta e fazer login;
* Visualizar e favoritar diferentes salas de conversa;
* Entrar em salas e conversar em tempo real com outras pessoas;
* Personalizar o seu perfil (nome e recado/status);
* Usar o sistema de busca interna do chat para encontrar mensagens;
* Navegar de forma confortável tanto no Modo Claro quanto no Modo Escuro (com o visual dos botões e painéis se adaptando).

## Qual problema ele resolve

Este projeto foi construído como um projeto prático para a disciplina de Programação Web II. Ele resolve o problema básico de comunicação em tempo real em grupos, servindo como um excelente laboratório para conectar conceitos avançados de desenvolvimento, tais como:

* Criação de interfaces ricas e responsivas no frontend;
* Construção de uma API robusta no backend;
* Autenticação e segurança com JWT e criptografia de senhas;
* Comunicação bidirecional em tempo real usando WebSockets;
* Arquitetura visual híbrida, combinando a agilidade do Tailwind CSS com o controle detalhado do CSS para criar efeitos visuais.

## Tecnologias usadas

### Frontend

* React 19
* Vite
* Tailwind CSS 4
* CSS Híbrido (para efeitos com muitos detalhes, brilhos e profundidade)
* React Router DOM
* React Icons
* Socket.IO Client
* Vitest

### Backend

* Node.js
* Express
* Socket.IO
* Supabase (banco de dados em nuvem)
* Bibliotecas de segurança e utilidades (bcryptjs, jsonwebtoken, cors, dotenv, helmet e express-rate-limit)
* Arquitetura de banco de dados centralizada no Node.js (Supabase RLS Desativado)
* Testes unitários e de integração (Jest, Supertest, Socket.IO Client)
* ORM (Supabase + Sequelize)

### Ferramentas

* Git / GitHub
* Render (deploy do Backend)
* Vercel (Deploy do Frontend)
* Supabase (banco de dados)
* npm

## Como rodar localmente

Para testar o projeto no seu computador, primeiro clone o repositório e entre na pasta:

```bash
git clone https://github.com/LucasRamosSilva-15/WebChat.git
cd WebChat
```

*(Nota: substitua a URL acima caso o repositório esteja em outro endereço no GitHub).*

### Frontend

Em um terminal, entre na pasta do frontend, instale as dependências e inicie o servidor de desenvolvimento:

```bash
cd frontend
npm install
npm run dev
```

Você também precisará criar um arquivo `.env` na raiz da pasta `frontend`:

```env
VITE_BACKEND_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001/api
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Backend

Em outro terminal, entre na pasta do backend, instale as dependências e inicie o servidor:

```bash
cd backend
npm install
npm run dev
```

Crie um arquivo `.env` na raiz da pasta `backend` com as variáveis necessárias (ajuste as chaves do Supabase e o JWT_SECRET conforme o seu ambiente):

```env
PORT=3001
JWT_SECRET=sua_chave_secreta_aqui
USE_MOCK_DB=false
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
FRONTEND_URL=http://localhost:5173
```
## Testes automatizados do backend e frontend

Em um terminal rode o comando

```bash
npm run test:backend && npm run test:frontend
```

## Link do deploy

* **Frontend:** [https://skyripple-project-web2.vercel.app](https://skyripple-project-web2.vercel.app/)
* **Backend/API (SkyRipple):** [https://skyripple-9vqr.onrender.com](https://skyripple-9vqr.onrender.com)
* **Backend/API (Legado):** [https://webchat-9vqr.onrender.com](https://webchat-9vqr.onrender.com)

## Imagens / Screenshots

![Home](docs/screenshots/Home.png)
![Salas](docs/screenshots/Room.png)
![Chat](docs/screenshots/Chat.png)
![Perfil](docs/screenshots/Profile.png)

## Funcionalidades

* [x] Página inicial (Home)
* [x] Login e Cadastro de contas com autenticação JWT e senhas criptografadas com bcrypt
* [x] Listagem e favoritação de salas
* [x] Chat em tempo real (envio e recebimento de mensagens instantâneas via WebSockets)
* [x] Busca avançada dentro do chat (filtro em tempo real e navegação entre resultados)
* [x] Customização de perfil do usuário (avatar, nome de exibição e recado/status)
* [x] Temas visuais: Modo Claro e Modo Escuro com estética Skeuomórfica / Web 2.0 Gloss
* [x] Layout responsivo e menus modais
* [x] Envio de imagens e anexos com compressão no cliente
* [x] Refinamentos na persistência e histórico de mensagens
* [x] Testes automatizados (134 testes no backend com Jest/Supertest e 68 testes no frontend com Vitest — 202 testes no total)
* [x] Documentação interativa da API (Swagger UI local/produção e Mintlify)
* [x] Endurecimento de Segurança CIS Controls IG1 & OWASP ASVS (Rate Limiting rigoroso, Helmet com HSTS, Sanitização XSS, Auditoria de Segurança)
* [x] Mensagens Diretas (Directs / Chat Privado) com histórico persistido e conversas individuais
* [x] Central de Notificações em tempo real com contador de não-lidas e sincronização via WebSockets
* [x] Sistema de Dono de Sala e Moderação Hierárquica (Promover/Rebaixar moderadores, Expulsar participantes, Transferir liderança da sala e Moderação de mensagens)
* [x] Edição de dados da sala (nome e descrição) pelo Dono da Sala
* [x] Sistema de denúncias (Reports) e feedback integrado
* [x] Painel Administrativo centralizado (Admin Dashboard)
* [ ] Histórico com paginação baseada em cursor (*Cursor-Based Pagination*) (Próximo passo)
* [ ] Criptografia Ponta-a-Ponta (*E2EE*) com chaves assimétricas via Web Crypto API (Próximo passo)

## Estrutura do projeto

```txt
.
├── backend/
│   ├── src/
│   │   ├── app.js                      # Configuração Express, middlewares e rotas
│   │   ├── config/
│   │   │   ├── cors.js                 # Whitelist CORS e validação de origens
│   │   │   ├── database.js             # Conexão e pooling Sequelize / Supabase
│   │   │   └── swagger.js              # Especificação OpenAPI e Swagger UI
│   │   ├── controllers/
│   │   │   ├── AdminController.js
│   │   │   ├── DirectController.js
│   │   │   ├── FeedbackController.js
│   │   │   ├── MessageController.js
│   │   │   ├── NotificationController.js
│   │   │   ├── ReportController.js
│   │   │   ├── RoomController.js
│   │   │   ├── StatsController.js
│   │   │   ├── UsuarioController.js
│   │   │   └── errorHandler.js         # Mapeamento centralizado de erros e HTTP status
│   │   ├── middleware/
│   │   │   ├── auth.js                 # Validação JWT e identificação de usuário
│   │   │   └── adminAuth.js            # Proteção de rotas administrativas
│   │   ├── models/
│   │   │   ├── DirectConversation.js
│   │   │   ├── DirectMessage.js
│   │   │   ├── Favorite.js
│   │   │   ├── Feedback.js
│   │   │   ├── Message.js
│   │   │   ├── Notification.js
│   │   │   ├── Report.js
│   │   │   ├── Room.js
│   │   │   ├── RoomMember.js
│   │   │   ├── User.js
│   │   │   └── index.js
│   │   ├── repositories/
│   │   │   ├── DirectRepository.js
│   │   │   ├── FavoriteRepository.js
│   │   │   ├── FeedbackRepository.js
│   │   │   ├── MessageRepository.js
│   │   │   ├── NotificationRepository.js
│   │   │   ├── ReportRepository.js
│   │   │   ├── RoomMemberRepository.js
│   │   │   ├── RoomRepository.js
│   │   │   └── UserRepository.js
│   │   ├── routes/
│   │   │   ├── admin.js                # Rotas do painel administrativo
│   │   │   ├── api.js                  # Roteador central de APIs
│   │   │   ├── directRoutes.js         # Mensagens diretas privadas
│   │   │   ├── favoriteRoutes.js       # Gestão de favoritos
│   │   │   ├── feedbackRoutes.js       # Relatos de feedback
│   │   │   ├── messageRoutes.js        # Mensagens de salas e busca textual
│   │   │   ├── notificationRoutes.js   # Notificações em tempo real
│   │   │   ├── reportRoutes.js         # Denúncias de moderação
│   │   │   ├── roomRoutes.js           # Rotas de salas e moderação
│   │   │   └── usuarioRoutes.js        # Autenticação, perfil e sincronização OAuth
│   │   ├── services/
│   │   │   ├── DirectService.js
│   │   │   ├── FavoriteService.js
│   │   │   ├── FeedbackService.js
│   │   │   ├── MessageService.js
│   │   │   ├── NotificationService.js
│   │   │   ├── ReportService.js
│   │   │   ├── RoomService.js          # Lógica de negócio, cargos e moderação
│   │   │   └── UserService.js
│   │   ├── sockets/                    # Arquitetura modular de WebSockets (Socket.io)
│   │   │   ├── chatHandler.js          # Handlers de chat em salas e mensagens diretas
│   │   │   ├── index.js                # Instanciação e bootstrap de sockets
│   │   │   ├── presence.js             # Mapeamento de presença ativa por sala e global
│   │   │   └── socketAuth.js           # Middleware de handshake com validação JWT
│   │   └── utils/
│   │       ├── auditLogger.js          # Auditoria de segurança estruturada
│   │       └── security.js             # Criptografia, JWT e sanitização XSS
│   ├── tests/                          # 15 suítes e 134 testes Jest/Supertest
│   │   ├── authMiddleware.test.js
│   │   ├── chat.test.js
│   │   ├── controllers.test.js
│   │   ├── directs.test.js
│   │   ├── e2e-flow.test.js
│   │   ├── favorites.test.js
│   │   ├── feedback.test.js
│   │   ├── helpers.js
│   │   ├── message.test.js
│   │   ├── models.test.js
│   │   ├── oauthSync.test.js
│   │   ├── report.test.js
│   │   ├── room.test.js
│   │   ├── roomModeration.test.js
│   │   ├── security.test.js
│   │   └── usuario.test.js
│   ├── server.js                       # Bootstrap HTTP, binding de porta e Sequelize
│   ├── package.json
│   └── README.md                       # Documentação técnica profunda do backend
├── docs/                               # Documentação técnica e Mintlify
├── frontend/
│   ├── src/
│   │   ├── assets/                     # SVGs, ícones e recursos visuais
│   │   ├── components/
│   │   │   ├── MembersSidebar.jsx      # Painel de membros e moderação tátil
│   │   │   ├── ChatSidebar.jsx         # Lista de conversas e salas no chat
│   │   │   ├── Navbar.jsx              # Barra superior e navegação
│   │   │   ├── NotificationsDropdown.jsx # Dropdown de notificações em tempo real
│   │   │   ├── UserAvatar.jsx          # Avatar com indicador de presença
│   │   │   └── ...
│   │   ├── context/
│   │   │   └── NotificationContext.jsx # Estado global de notificações
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Chat.jsx                # Interface principal de conversação
│   │   │   ├── Directs.jsx             # Mensagens diretas (1-a-1)
│   │   │   ├── Rooms.jsx               # Catálogo e criação de salas
│   │   │   ├── Admin.jsx               # Painel administrativo do sistema
│   │   │   ├── Feedback.jsx            # Formulário de feedback e suporte
│   │   │   ├── Settings.jsx            # Configurações do perfil
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js                  # Cliente fetch autenticado
│   │   ├── styles/
│   │   │   ├── skeuo.css               # Tokens de design Web 2.0 Gloss
│   │   │   └── chat.css
│   │   ├── tests/                      # 13 suítes e 68 testes Vitest
│   │   │   ├── chat.test.jsx
│   │   │   ├── Directs.test.jsx
│   │   │   ├── MembersSidebar.test.jsx
│   │   │   └── ...
│   │   ├── App.jsx                     # Rotas e layout principal
│   │   ├── socket.js                   # Instância global do Socket.IO Client
│   │   ├── main.jsx                    # Ponto de montagem React 19
│   │   └── index.css                   # Tailwind 4 e estilos base
│   ├── vite.config.js
│   ├── package.json
│   └── .env
└── README.md
```

## Catálogo de Páginas Principais (Frontend)

A aplicação web é composta por 18 telas com design skeuomórfico reativo:

| Página | Rota | Componente | Guarda | Propósito & Funcionalidades |
| :--- | :--- | :--- | :--- | :--- |
| **Página Inicial** | `/` | `Home.jsx` | Pública | Landing page de apresentação e ponto de entrada da aplicação. |
| **Login** | `/login` | `Login.jsx` | Pública | Autenticação com e-mail/senha, emissão de JWT e alertas contextuais. |
| **Cadastro** | `/register` | `Register.jsx` | Pública | Criação de conta com medidor de força de senha em tempo real. |
| **Recuperação de Senha** | `/forgot-password` | `ForgotPassword.jsx` | Pública | Solicitação de link de redefinição de senha com Supabase Auth. |
| **Lobby de Salas** | `/rooms` | `Rooms.jsx` | `PrivateRoute` | Catálogo de salas temáticas, métricas em tempo real (`StatCard`) e filtros. |
| **Sala de Chat** | `/chat` | `Chat.jsx` | `PrivateRoute` | Mensageria instantânea com Socket.io, criptografia e moderação hierárquica. |
| **Mensagens Diretas** | `/directs` | `Directs.jsx` | `PrivateRoute` | Bate-papo 1x1 confidencial em tempo real, lista de conversas e busca de contatos. |
| **Chat Direto (Alias)** | `/direct` | `Directs.jsx` | `PrivateRoute` | Rota alternativa de acesso rápido ao chat privado. |
| **Favoritos** | `/favorites` | `Favorites.jsx` | `PrivateRoute` | Hub de salas e conversas favoritas para acesso rápido. |
| **Personalização** | `/custom` | `Custom.jsx` | `PrivateRoute` | Edição de foto de perfil, avatar dinâmico, nome público e bio. |
| **Configurações** | `/settings` | `Settings.jsx` | `PrivateRoute` | Temas (Claro/Escuro), densidade de layout, cores de destaque e sons. |
| **Feedback** | `/feedback` | `Feedback.jsx` | `PrivateRoute` | Canal de envio de sugestões e bugs com upload de fotos em cavidade `.skeuo-well`. |
| **Central de Suporte**| `/suporte` | `Suporte.jsx` | `PrivateRoute` | FAQ acordeão interativo, status da plataforma e transparência de moderação. |
| **Sobre o Projeto** | `/about` | `About.jsx` | Pública | Apresentação acadêmica, história do projeto e equipe de desenvolvedores. |
| **Portal Admin Login**| `/admin-login`| `AdminLogin.jsx` | Pública | Autenticação administrativa com chave mestra do sistema. |
| **Painel de Moderação**| `/admin` | `Admin.jsx` | `AdminRoute` | Console de métricas `/stats`, banimentos, gestão de denúncias e salas. |
| **Bancada de Testes** | `/buttons` | `ButtonsTest.jsx`| Pública | Showcase vivo de todos os tokens e componentes táteis SDS. |
| **Não Encontrado** | `*` | `NotFound.jsx` | Pública | Página 404 personalizada com bússola 3D e navegação de resgate. |

## Status atual

O projeto **SkyRipple** encontra-se em estado avançado de maturidade técnica, estabilidade e conformidade arquitetural:
* **Frontend**: Totalmente integrado via REST e WebSockets, contando com interface skeuomórfica refinada (Modo Claro/Escuro), chat em salas públicas e privadas, mensagens diretas (Directs), central de notificações em tempo real, painel administrativo e interface tátil de moderação de sala (promover/rebaixar, expulsar participantes e transferir dono).
* **Backend**: Arquitetura profissional em camadas (Controllers, Services, Repositories e Models ORM com Sequelize e Supabase PostgreSQL), endurecimento de segurança baseado nos padrões **CIS Controls IG1 & OWASP ASVS**, logs estruturados de auditoria, suíte robusta com 134 testes automatizados no backend e 68 testes no frontend (202 testes no total) 100% aprovados e documentação Swagger 3.0 interativa.

## Link da documentação Swagger

* **Produção (SkyRipple):** <https://skyripple-9vqr.onrender.com/api-docs/>
* **Produção (Legado):** <https://webchat-9vqr.onrender.com/api-docs/>
* **Local:** <http://localhost:3001/api-docs/>

### Cobertura da Documentação OpenAPI 3.0
A documentação interativa via Swagger UI reflete 100% dos contratos da API:
* **38 Rotas Documentadas** categorizadas em 9 tags (`Auth`, `Rooms`, `Messages`, `Directs`, `Notifications`, `Favorites`, `Reports`, `Feedbacks`, `Admin`).
* **11 Schemas Canônicos**: `User`, `Room`, `RoomMember`, `Message`, `DirectConversation`, `DirectMessage`, `Notification`, `Favorite`, `Report`, `Feedback` e `ErrorResponse`.
* **Autenticação Interativa**: Suporte a autorização no Swagger UI com token JWT (`BearerAuth`) e chave administrativa (`AdminAuth`).

## Link da documentação Mintlify

<https://lucas-ramos.mintlify.site/guides/overview>

## Próximos passos

* **Paginação por Cursor no Histórico**: Implementar parâmetros `before`/`since`/`limit` com índices B-Tree sobre mensagens para rolagem infinita escalável em salas com milhões de registros.
* **Criptografia Ponta-a-Ponta (E2EE)**: Implementação de criptografia assimétrica ponta-a-ponta no cliente para canais privados (Directs) através da Web Crypto API.
* **Mídias e Arquivos**: Suporte nativo a envio e pré-visualização de áudio gravado e documentos em anexo.
* **Testes End-to-End (E2E)**: Criação de suíte de testes de ponta a ponta com Playwright automatizando a jornada completa do usuário.

## Diagramas Arquiteturais & de Modelagem

### 1. Diagrama de Arquitetura da Solução

```mermaid
graph TD
    subgraph ClientLayer["Camada de Cliente (Frontend SPA)"]
        UI["React 19 + Vite Application"]
        Skeuo["Skeuomorphic & Frutiger Aero Gloss Design System"]
        State["React Context & Hooks"]
        SocketClient["Socket.io Client (socket.js)"]
        HTTPClient["Fetch API (services/api.js)"]
    end

    subgraph GatewayLayer["Servidor Backend (Node.js & Express)"]
        HTTP_Server["HTTP Server (server.js & src/app.js)"]
        Socket_Server["Socket.io Engine (src/sockets)"]
        
        subgraph Middlewares["Middlewares & Segurança"]
            Helmet["Helmet (HSTS, Headers Seguros)"]
            Cors["CORS Estrito (src/config/cors.js)"]
            RateLimit["Rate Limiting (Global & Auth)"]
            AuthGuard["JWT Auth & Admin Guard"]
            SocketAuth["Handshake JWT Auth (socketAuth.js)"]
        end
    end

    subgraph BusinessLayer["Camada de Aplicação & Regras de Negócio"]
        Controllers["Controladores REST (src/controllers)"]
        Services["Serviços de Domínio (src/services)"]
        SocketHandlers["Manipuladores Socket (chatHandler.js & presence.js)"]
        PresenceMap["Mapa de Presença em Memória (roomPresence)"]
    end

    subgraph PersistenceLayer["Camada de Persistência & Dados"]
        Repos["Repositórios de Dados (src/repositories)"]
        ORM["Sequelize ORM (src/models)"]
        DB["PostgreSQL / Supabase (RLS Centralizado)"]
        MemDB["SQLite em Memória (Ambiente de Testes)"]
    end

    UI --> HTTPClient
    UI --> SocketClient
    HTTPClient --> Helmet --> Cors --> RateLimit --> AuthGuard --> Controllers
    SocketClient --> SocketAuth --> Socket_Server --> SocketHandlers
    SocketHandlers --> PresenceMap
    Controllers --> Services
    SocketHandlers --> Services
    Services --> Repos
    Repos --> ORM
    ORM --> DB
    ORM -.-> MemDB
```

### 2. Diagrama de Fluxo de Mensageria em Tempo Real (WebSockets & Presença)

```mermaid
sequenceDiagram
    autonumber
    actor Alice as Usuário (Alice)
    participant SocketGW as Gateway Socket.io (src/sockets)
    participant Presence as Gestor de Presença (presence.js)
    participant ChatHdl as Chat Handler (chatHandler.js)
    participant Service as MessageService
    participant DB as PostgreSQL (Supabase)
    actor Bob as Usuário (Bob)

    Alice->>SocketGW: Handshake com JWT (auth.token)
    SocketGW->>SocketGW: Validação de Token (socketAuth.js)
    SocketGW-->>Alice: Conexão Estabelecida
    Alice->>SocketGW: joinRoom { roomId, user }
    SocketGW->>Presence: Registra socket e usuário na sala
    Presence-->>Alice: roomPresenceUpdated { onlineUsers, count }
    Presence-->>Bob: roomPresenceUpdated { onlineUsers, count }

    Alice->>ChatHdl: send_message { room, content, imageUrl }
    ChatHdl->>ChatHdl: Verifica Rate Limit (janela de 500ms)
    ChatHdl->>Service: Valida e higieniza conteúdo (Anti-XSS)
    Service->>DB: Persiste Mensagem no Banco
    DB-->>Service: Mensagem Salva (UUID, Timestamp)
    Service-->>ChatHdl: Objeto completo da Mensagem
    ChatHdl-->>Alice: receive_message (Broadcast da sala)
    ChatHdl-->>Bob: receive_message (Broadcast da sala)
```

### 3. Diagrama de Autenticação Híbrida & Políticas de Acesso (RBAC)

```mermaid
flowchart TD
    Start(["Requisição de Autenticação"]) --> Mode{"Origem do Acesso"}
    
    Mode -->|"Credenciais Tradicionais"| FormLogin["POST /api/auth/login"]
    Mode -->|"Google OAuth"| OAuthSync["POST /api/auth/oauth-sync"]
    Mode -->|"Administrador"| AdminAuth["POST /api/admin/auth"]

    FormLogin --> RateCheck{"Tentativas consecutivas?"}
    RateCheck -->|"5 tentativas incorretas"| Lockout["Bloqueio Temporário 15 min (429 Too Many Requests)"]
    RateCheck -->|"Dentro do limite"| VerifyHash["Verificação Argon2id / Bcrypt"]
    VerifyHash -->|"Senha Incorreta"| DummyTiming["Dummy Hash (Anti-Enumeração) -> 401 Unauthorized"]
    VerifyHash -->|"Sucesso"| AutoRehash["Auto-rehash transparente para Argon2id"]
    
    OAuthSync --> Normalize["Normaliza Nome, Foto e E-mail"]
    Normalize --> UpsertUser["Sincroniza Perfil (password = null)"]
    
    AdminAuth --> TimingSafe["crypto.timingSafeEqual com ADMIN_SECRET_KEY"]
    TimingSafe -->|"Válido"| IssueAdminJWT["Emite JWT Admin (TTL: 8h, role: admin)"]
    TimingSafe -->|"Inválido"| RejectAdmin["401 Unauthorized"]

    AutoRehash --> IssueUserJWT["Emite JWT Usuário (TTL: 7d, role: user)"]
    UpsertUser --> IssueUserJWT

    IssueUserJWT --> AccessApp["Acesso a Salas, Chat, Directs & Favoritos"]
    IssueAdminJWT --> AccessAdmin["Acesso ao Console /admin e Métricas /stats"]
```

### 4. Diagrama Entidade-Relacionamento (DER)

```mermaid
erDiagram
    USERS ||--o{ ROOMS : "cria (owner_id)"
    USERS ||--o{ ROOM_MEMBERS : "participa"
    ROOMS ||--o{ ROOM_MEMBERS : "possui"
    USERS ||--o{ MESSAGES : "envia"
    ROOMS ||--o{ MESSAGES : "contem"
    USERS ||--o{ DIRECT_CONVERSATIONS : "inicia (user1)"
    USERS ||--o{ DIRECT_CONVERSATIONS : "recebe (user2)"
    DIRECT_CONVERSATIONS ||--o{ DIRECT_MESSAGES : "contem"
    USERS ||--o{ DIRECT_MESSAGES : "envia (sender)"
    USERS ||--o{ NOTIFICATIONS : "recebe"
    USERS ||--o{ FAVORITES : "salva"
    USERS ||--o{ REPORTS : "denuncia (reporter)"
    MESSAGES ||--o{ REPORTS : "alvo"
    USERS ||--o{ FEEDBACKS : "submete"

    USERS {
        uuid id PK
        string email UK
        string password "nullable (OAuth)"
        string displayName
        string profilePhoto
        text profileDesc
        string role "user | admin"
        string status "active | banned"
        datetime created_at
    }

    ROOMS {
        uuid id PK
        string name
        string type "public | private"
        text description
        string category
        text image_url
        uuid owner_id FK "created_by"
        datetime created_at
    }

    ROOM_MEMBERS {
        uuid room_id PK,FK
        uuid user_id PK,FK
        string role "owner | moderator | user"
        datetime joined_at
    }

    MESSAGES {
        uuid id PK
        uuid room_id FK
        uuid user_id FK
        text content
        text image_url
        datetime created_at
    }

    DIRECT_CONVERSATIONS {
        uuid id PK
        uuid user1_id FK
        uuid user2_id FK
        text last_message
        datetime last_message_at
        datetime created_at
    }

    DIRECT_MESSAGES {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        text content
        text image_url
        datetime created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string type "system | mention | direct | alert"
        string title
        text content
        string link
        boolean read
        json data
        datetime created_at
    }

    FAVORITES {
        uuid id PK
        uuid user_id FK
        string item_type "room | conversation"
        string item_id
        string title
        text content
        json meta
        datetime created_at
    }

    REPORTS {
        uuid id PK
        uuid message_id FK
        uuid reporter_id FK "user_id"
        string reason
        string status "pending | reviewed | dismissed"
        datetime created_at
    }

    FEEDBACKS {
        uuid id PK
        uuid user_id FK
        text message "comment"
        json images
        string status "pending | reviewed | resolved"
        datetime created_at
    }
```

### 5. Diagrama de Classes & Arquitetura em Camadas (Controller-Service-Repository)

```mermaid
classDiagram
    direction TB

    class UsuarioController {
        +register(req, res)
        +login(req, res)
        +me(req, res)
        +deleteProfile(req, res)
        +list(req, res)
        +updateStatus(req, res)
        +oauthSync(req, res)
    }

    class RoomController {
        +create(req, res)
        +list(req, res)
        +getById(req, res)
        +update(req, res)
        +remove(req, res)
        +join(req, res)
        +getMembers(req, res)
        +updateMemberRole(req, res)
        +kickMember(req, res)
        +transferOwnership(req, res)
    }

    class MessageController {
        +send(req, res)
        +listByRoom(req, res)
        +remove(req, res)
        +search(req, res)
    }

    class DirectController {
        +listConversations(req, res)
        +getOrCreate(req, res)
        +listMessages(req, res)
        +sendMessage(req, res)
        +removeConversation(req, res)
        +listUsers(req, res)
    }

    class NotificationController {
        +list(req, res)
        +create(req, res)
        +markAsRead(req, res)
        +markAllAsRead(req, res)
        +remove(req, res)
        +clearAll(req, res)
    }

    class FavoriteController {
        +list(req, res)
        +create(req, res)
        +remove(req, res)
    }

    class ReportController {
        +create(req, res)
        +list(req, res)
        +updateStatus(req, res)
        +remove(req, res)
    }

    class FeedbackController {
        +create(req, res)
        +list(req, res)
        +updateStatus(req, res)
        +remove(req, res)
    }

    class AdminController {
        +auth(req, res)
    }

    class StatsController {
        +getGlobalStats(req, res)
    }

    class UserService {
        +register(data) Object
        +login(email, password) Object
        +syncOAuthUser(data) Object
        +getAllUsers() List~User~
        +getUserById(id) User
        +updateStatus(id, status) User
        +deleteUser(id) boolean
    }

    class RoomService {
        +createRoom(data, userId) Room
        +getAllRooms() List~Room~
        +getRoomById(id, userId) Object
        +updateRoom(id, data, userId) Room
        +deleteRoom(id, userId, isAdmin) boolean
        +joinRoom(roomId, userId) Object
        +getRoomMembers(roomId) List~RoomMember~
        +updateMemberRole(roomId, targetId, role, requesterId) Object
        +kickMember(roomId, targetId, requesterId) Object
        +transferOwnership(roomId, targetId, requesterId) Object
    }

    class MessageService {
        +sendMessage(data) Message
        +getMessagesByRoom(roomId, options) List~Message~
        +searchMessages(roomId, query) List~Message~
        +deleteMessage(id, userId, isAdmin) boolean
    }

    class DirectService {
        +listConversations(userId) List~DirectConversation~
        +getOrCreateConversation(user1, user2) DirectConversation
        +getConversationMessages(convId, userId, options) List~DirectMessage~
        +sendMessage(data) DirectMessage
        +deleteConversation(convId, userId) boolean
        +searchAvailableUsers(query, excludeId) List~User~
    }

    class NotificationService {
        +getUserNotifications(userId) List~Notification~
        +addNotification(data) Notification
        +markAsRead(id, userId) boolean
        +markAllAsRead(userId) boolean
        +deleteNotification(id, userId) boolean
        +clearAll(userId) boolean
    }

    class FavoriteService {
        +getUserFavorites(userId) List~Favorite~
        +addFavorite(userId, data) Favorite
        +removeFavorite(userId, itemType, itemId) boolean
    }

    class ReportService {
        +createReport(data) Report
        +getAllReports() List~Report~
        +resolveReport(id, status) Report
        +deleteReport(id) boolean
    }

    class FeedbackService {
        +submitFeedback(data) Feedback
        +getAllFeedbacks() List~Feedback~
        +resolveFeedback(id, status) Feedback
        +deleteFeedback(id) boolean
    }

    class UserRepository {
        +findByEmail(email) User
        +findById(id) User
        +create(data) User
        +findAll() List~User~
        +countAll() int
        +countBanned() int
        +update(id, data) User
        +delete(id) boolean
    }

    class RoomRepository {
        +create(data) Room
        +findAll() List~Room~
        +findById(id) Room
        +update(id, data) Room
        +count() int
        +delete(id) boolean
    }

    class RoomMemberRepository {
        +addMember(roomId, userId, role) RoomMember
        +findByRoomAndUser(roomId, userId) RoomMember
        +updateRole(roomId, userId, role) RoomMember
        +removeMember(roomId, userId) boolean
        +countMembers(roomId) int
        +getMembersByRoom(roomId) List~RoomMember~
        +countTotalMemberships() int
        +countUniqueUsers() int
    }

    class MessageRepository {
        +create(data) Message
        +findByRoomId(roomId, options) List~Message~
        +searchByRoom(roomId, query) List~Message~
        +findById(id) Message
        +delete(id) boolean
    }

    class DirectRepository {
        +findConversationBetween(u1, u2) DirectConversation
        +findConversationsForUser(userId) List~DirectConversation~
        +findConversationById(id) DirectConversation
        +createConversation(data) DirectConversation
        +deleteConversation(id) boolean
        +findMessagesByConversation(convId, options) List~DirectMessage~
        +createMessage(data) DirectMessage
    }

    class NotificationRepository {
        +findByUserId(userId) List~Notification~
        +findById(id) Notification
        +create(data) Notification
        +markAsRead(id, userId) boolean
        +markAllAsRead(userId) boolean
        +delete(id, userId) boolean
        +clearAll(userId) boolean
    }

    class FavoriteRepository {
        +findByUser(userId) List~Favorite~
        +findOne(userId, itemType, itemId) Favorite
        +create(data) Favorite
        +delete(userId, itemType, itemId) boolean
        +deleteById(id) boolean
    }

    class ReportRepository {
        +create(data) Report
        +findAll() List~Report~
        +countPending() int
        +findById(id) Report
        +updateStatus(id, status) Report
        +delete(id) boolean
    }

    class FeedbackRepository {
        +create(data) Feedback
        +findAll() List~Feedback~
        +findById(id) Feedback
        +updateStatus(id, status) Feedback
        +delete(id) boolean
    }

    class User {
        +UUID id
        +String email
        +String password
        +String displayName
        +String profilePhoto
        +String profileDesc
        +String role
        +String status
        +Date created_at
    }

    class Room {
        +UUID id
        +String name
        +String type
        +String description
        +String category
        +String image_url
        +UUID owner_id
        +Date created_at
    }

    class RoomMember {
        +UUID room_id
        +UUID user_id
        +String role
        +Date joined_at
    }

    class Message {
        +UUID id
        +UUID room_id
        +UUID user_id
        +String content
        +String image_url
        +Date created_at
    }

    class DirectConversation {
        +UUID id
        +UUID user1_id
        +UUID user2_id
        +String last_message
        +Date last_message_at
        +Date created_at
    }

    class DirectMessage {
        +UUID id
        +UUID conversation_id
        +UUID sender_id
        +String content
        +String image_url
        +Date created_at
    }

    class Notification {
        +UUID id
        +UUID user_id
        +String type
        +String title
        +String content
        +String link
        +Boolean read
        +Object data
        +Date created_at
    }

    class Favorite {
        +UUID id
        +UUID user_id
        +String item_type
        +String item_id
        +String title
        +String content
        +Object meta
        +Date created_at
    }

    class Report {
        +UUID id
        +UUID message_id
        +UUID reporter_id
        +String reason
        +String status
        +Date created_at
    }

    class Feedback {
        +UUID id
        +UUID user_id
        +String comment
        +Array images
        +String status
        +Date created_at
    }

    UsuarioController --> UserService
    RoomController --> RoomService
    MessageController --> MessageService
    DirectController --> DirectService
    NotificationController --> NotificationService
    FavoriteController --> FavoriteService
    ReportController --> ReportService
    FeedbackController --> FeedbackService
    AdminController ..> UserService
    StatsController --> RoomRepository
    StatsController --> UserRepository
    StatsController --> ReportRepository
    StatsController --> RoomMemberRepository

    UserService --> UserRepository
    RoomService --> RoomRepository
    RoomService --> RoomMemberRepository
    MessageService --> MessageRepository
    DirectService --> DirectRepository
    NotificationService --> NotificationRepository
    FavoriteService --> FavoriteRepository
    ReportService --> ReportRepository
    FeedbackService --> FeedbackRepository

    UserRepository ..> User
    RoomRepository ..> Room
    RoomMemberRepository ..> RoomMember
    MessageRepository ..> Message
    DirectRepository ..> DirectConversation
    DirectRepository ..> DirectMessage
    NotificationRepository ..> Notification
    FavoriteRepository ..> Favorite
    ReportRepository ..> Report
    FeedbackRepository ..> Feedback
```

## Autor

Desenvolvido por **Lucas Ramos Silva, Wssihélio Vasconcelos, Ruan Victor e Gabriel Lobão.** como parte da disciplina de Programação Web II.
