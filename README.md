# SkyRipple

<div align="center">
  <img src="frontend/public/logo_512x512_transparente.svg" width="256" height="256" alt="SkyRipple Logo">
</div>


![Versão](https://img.shields.io/badge/Vers%C3%A3o-10.0.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)
![Android](https://img.shields.io/badge/Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![Vitest](https://img.shields.io/badge/Vitest-634EA7?style=for-the-badge&logo=vitest&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=jest&logoColor=white)
![Supertest](https://img.shields.io/badge/Supertest-68BB66?style=for-the-badge&logo=supertest&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E4AC?style=for-the-badge&logo=render&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-000000?style=for-the-badge&logo=swagger&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-216D31?style=for-the-badge&logo=sequelize&logoColor=white)

O SkyRipple é uma aplicação completa de chat em tempo real onde os usuários podem se conectar, entrar em salas temáticas e trocar mensagens instantaneamente tanto na Web quanto em aplicativo móvel nativo Android. O projeto foca em uma experiência rica e nostálgica, trazendo uma estética clean com identidade visual inspirada no Web 2.0 Gloss (Skeuomorfismo e influências do Frutiger Aero) aliada a tecnologias modernas e padrões de segurança de alto nível.

## O que o projeto faz

O SkyRipple funciona como um ecossistema completo de comunicação em tempo real. De forma simples, ele permite:

* Criar conta com verificação em duas etapas (código numérico OTP enviado ao e-mail);
* Recuperar acesso à conta via código numérico de 8 dígitos;
* Visualizar, criar, moderar e favoritar diferentes salas de bate-papo temáticas;
* Entrar em salas e conversar em tempo real com histórico paginado por cursor (`before`, `since` e `limit`);
* Conversar em canais diretos privados 1x1 (Directs) protegidos por Criptografia Ponta a Ponta (E2EE - ECDH P-256 e AES-GCM-256);
* Gravar e reproduzir mensagens de áudio nativas no navegador e compartilhar arquivos e documentos em anexo (até 5 MB);
* Personalizar o perfil completo (foto de exibição, avatar SVG dinâmico, nome público, recado e biografia);
* Usar o sistema de busca textual interna do chat para encontrar mensagens e histórico em tempo real;
* Receber e gerenciar notificações instantâneas com suporte a leitura individual ou em lote;
* Painel administrativo exclusivo para gestão de denúncias, banimentos, monitoramento e métricas globais (`/stats`);
* Navegar com suporte completo a Modo Claro e Modo Escuro com controles de cor e estética Web 2.0 Gloss / Skeuomórfica refinada;
* Aplicativo móvel dedicado (Capacitor Android, pacote `com.skyripple.app`), com navegação por gestos, resposta tátil via haptics e tratamento ergonômico de safe area;
* Autenticação via Google OAuth sincronizada entre Web e Mobile com suporte a Deep Linking (`skyripple://auth/callback`);
* Formatação de datas e horários adaptada nativamente ao fuso horário brasileiro (`America/Sao_Paulo` / padrão 24 horas).

## Qual problema ele resolve

Este projeto foi construído como um projeto prático para a disciplina de Programação Web II. Ele resolve o problema básico de comunicação em tempo real em grupos e conversas privadas, servindo como um excelente laboratório para conectar conceitos avançados de desenvolvimento, tais como:

* Criação de interfaces ricas e responsivas no frontend web e mobile;
* Construção de uma API robusta no backend com arquitetura limpa em camadas (Controller-Service-Repository);
* Autenticação e segurança com JWT, criptografia de senhas com Argon2id/Bcrypt e conformidade CIS Controls IG1 & OWASP ASVS;
* Criptografia ponta a ponta (E2EE) no cliente com chaves assimétricas;
* Comunicação bidirecional de baixa latência em tempo real usando WebSockets;
* Arquitetura visual híbrida, combinando a agilidade do Tailwind CSS com o controle detalhado do CSS para criar efeitos visuais com profundidade;
* Empacotamento híbrido mobile para Android com Capacitor.

## Tecnologias usadas

### Frontend (Web)

* React 19
* Vite
* Tailwind CSS 4
* CSS Híbrido (efeitos Web 2.0 Gloss, brilhos e profundidade)
* React Router DOM
* React Icons
* Socket.IO Client
* Web Crypto API (E2EE ECDH P-256 + AES-GCM)
* Vitest

### Mobile (Android & Capacitor)

* Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/app`, `@capacitor/haptics`, `@capacitor/keyboard`, `@capacitor/status-bar`)
* React 19
* Vite
* Tailwind CSS 4
* Lucide React
* Deep Linking (`skyripple://auth/callback` para login social com Google)
* Pacote Android nativo: `com.skyripple.app` ("SkyRipple")

### Backend

* Node.js
* Express
* Socket.IO
* Supabase (PostgreSQL em nuvem)
* Bibliotecas de segurança e utilidades (bcryptjs, jsonwebtoken, cors, dotenv, helmet e express-rate-limit)
* Arquitetura de banco de dados centralizada no Node.js (Supabase RLS Desativado)
* Testes unitários e de integração (Jest, Supertest, Socket.IO Client)
* ORM (Supabase + Sequelize)
* Documentação OpenAPI 3.0 / Swagger UI

### Ferramentas & Infraestrutura

* Git / GitHub
* Render (deploy do Backend)
* Vercel (Deploy do Frontend Web)
* Android Studio / Gradle (Build do APK Android)
* Playwright (Testes ponta a ponta E2E)
* Supabase (PostgreSQL & Auth)
* npm

## Como rodar localmente

Para testar o projeto no seu computador, primeiro clone o repositório e entre na pasta:

```bash
git clone https://github.com/LucasRamosSilva-15/WebChat.git
cd WebChat
```

*(Nota: substitua a URL acima caso o repositório esteja em outro endereço no GitHub).*

### Frontend (Web)

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

### Mobile (Capacitor / Android)

Para rodar a interface móvel no navegador em modo de desenvolvimento:

```bash
cd mobile
npm install
npm run dev
```

Crie o arquivo `.env` na raiz da pasta `mobile`:

```env
VITE_BACKEND_URL=https://skyripple-9vqr.onrender.com
VITE_API_URL=https://skyripple-9vqr.onrender.com/api
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

Para compilar e sincronizar com o projeto Android nativo:

```bash
# Compilar a SPA mobile e atualizar os assets do Android nativo
npm run build
npx cap sync android

# Abrir o projeto no Android Studio para gerar o APK ou depurar no emulador/dispositivo
npx cap open android
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

## Testes automatizados

O repositório conta com cobertura abrangente de testes automatizados unitários, de integração e ponta a ponta (E2E):

```bash
# Executar todos os testes de Backend e Frontend
npm run test

# Executar apenas os testes do Backend (Jest / Supertest - 182 testes em 18 suítes)
npm run test:backend

# Executar apenas os testes do Frontend (Vitest - 136 testes em 20 suítes)
npm run test:frontend

# Executar a suíte de testes ponta a ponta E2E (Playwright)
npm run test:e2e
```

## Link do deploy

* **Frontend Web:** [https://skyripple-project-web2.vercel.app](https://skyripple-project-web2.vercel.app/)
* **Backend/API (SkyRipple):** [https://skyripple-9vqr.onrender.com](https://skyripple-9vqr.onrender.com)
* **Backend/API (Legado):** [https://webchat-9vqr.onrender.com](https://webchat-9vqr.onrender.com)

## Imagens / Screenshots

![Home](docs/screenshots/Captura1.png)
![Salas](docs/screenshots/Captura2.png)
![Chat](docs/screenshots/Captura3.png)
![Perfil](docs/screenshots/Captura4.png)
![Directs](docs/screenshots/Captura5.png)
![Settings](docs/screenshots/Captura6.png)
![Admin](docs/screenshots/Captura7.png)

## Funcionalidades

* [x] Página inicial (Home) com design convidativo e navegação intuitiva
* [x] Login e Cadastro de contas com autenticação JWT e senhas criptografadas com Argon2id/Bcrypt
* [x] Autenticação social com Google OAuth e sincronização segura de perfis
* [x] Listagem e favoritação de salas com atualização instantânea
* [x] Chat em tempo real (envio e recebimento de mensagens instantâneas via WebSockets)
* [x] Busca avançada dentro do chat (filtro em tempo real e navegação entre resultados)
* [x] Customização de perfil do usuário (avatar, nome de exibição e recado/status)
* [x] Temas visuais: Modo Claro e Modo Escuro com estética Skeuomórfica / Web 2.0 Gloss
* [x] Layout responsivo na Web e aplicativo nativo dedicado no Android (Capacitor)
* [x] Envio de imagens e anexos com compressão no cliente (arquivos até 5 MB e mensagens de áudio)
* [x] Refinamentos na persistência e histórico de mensagens com paginação por cursor (`before`, `since` e `limit`)
* [x] Mensagens Diretas (Directs / Chat Privado) com histórico persistido e conversas individuais
* [x] Criptografia Ponta-a-Ponta (*E2EE*) em conversas diretas com chaves assimétricas (ECDH P-256 + AES-GCM-256) via Web Crypto API (Web & Mobile)
* [x] Central de Notificações em tempo real com contador de não-lidas e sincronização via WebSockets
* [x] Sistema de Dono de Sala e Moderação Hierárquica (Promover/Rebaixar moderadores, Expulsar participantes, Transferir liderança da sala e Moderação de mensagens)
* [x] Edição de dados da sala (nome e descrição) pelo Dono da Sala
* [x] Sistema de denúncias (Reports) e feedback integrado com suporte a anexos de imagem
* [x] Painel Administrativo centralizado (Admin Dashboard) com métricas em tempo real (`/stats`)
* [x] Verificação de código numérico OTP em duas etapas no cadastro (6 dígitos) e recuperação de senha (8 dígitos)
* [x] Rotina resiliente de logout com timeout defensivo de 2s e expurgo estrito de chaves de sessão
* [x] Aplicativo móvel dedicado (Capacitor Android) com pacote `com.skyripple.app`, feedback tátil (`@capacitor/haptics`) e layout ergonômico
* [x] Deep Linking nativo no mobile (`skyripple://auth/callback`) para login Google OAuth
* [x] Localização temporal no padrão brasileiro (`America/Sao_Paulo` / 24h) em chats, directs e listagens
* [x] Testes automatizados (182 testes no backend com Jest/Supertest e 136 testes no frontend com Vitest — 318 testes no total 100% aprovados)
* [x] Suíte de testes ponta a ponta (E2E) com Playwright cobrindo fluxos críticos
* [x] Documentação interativa da API (Swagger UI local/produção e Mintlify)
* [x] Endurecimento de Segurança CIS Controls IG1 & OWASP ASVS (Rate Limiting rigoroso, Helmet com HSTS, Sanitização XSS, Auditoria de Segurança)

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
│   ├── tests/                          # 18 suítes e 182 testes Jest/Supertest
│   │   ├── attachments.test.js
│   │   ├── authMiddleware.test.js
│   │   ├── chat.test.js
│   │   ├── controllers.test.js
│   │   ├── directs.test.js
│   │   ├── e2e-flow.test.js
│   │   ├── e2ee-keys.test.js
│   │   ├── favorites.test.js
│   │   ├── feedback.test.js
│   │   ├── helpers.js
│   │   ├── message.test.js
│   │   ├── models.test.js
│   │   ├── oauthSync.test.js
│   │   ├── pagination.test.js
│   │   ├── report.test.js
│   │   ├── room.test.js
│   │   ├── roomModeration.test.js
│   │   ├── security.test.js
│   │   └── usuario.test.js
│   ├── server.js                       # Bootstrap HTTP, binding de porta e Sequelize
│   ├── package.json
│   └── README.md                       # Documentação técnica profunda do backend
├── docs/                               # Documentação técnica e Mintlify
├── e2e/                                # Suíte automatizada de testes ponta a ponta (Playwright)
│   ├── fixtures/                       # Fixtures isoladas e SQLite em memória
│   ├── tests/                          # Cenários E2E (auth, chat, directs, pagination, audio)
│   └── playwright.config.js
├── frontend/                           # Aplicação Web SPA (React 19 + Vite + Tailwind 4)
│   ├── src/
│   │   ├── assets/                     # SVGs, ícones e recursos visuais
│   │   ├── components/
│   │   │   ├── MembersSidebar.jsx      # Painel de membros e moderação tátil
│   │   │   ├── ChatSidebar.jsx         # Lista de conversas e salas no chat
│   │   │   ├── Navbar.jsx              # Barra superior e navegação
│   │   │   ├── NotificationsDropdown.jsx # Dropdown de notificações em tempo real
│   │   │   ├── OtpCodeInput.jsx        # Seletor numérico de slots OTP
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
│   │   │   ├── api.js                  # Cliente fetch autenticado
│   │   │   ├── attachments.js          # Conversão de áudio e arquivos
│   │   │   └── e2ee.js                 # Criptografia Web Crypto ECDH/AES-GCM
│   │   ├── styles/
│   │   │   ├── skeuo.css               # Tokens de design Web 2.0 Gloss
│   │   │   └── chat.css
│   │   ├── tests/                      # 20 suítes e 136 testes Vitest
│   │   │   ├── attachments.test.jsx
│   │   │   ├── auth.test.jsx
│   │   │   ├── chat.test.jsx
│   │   │   ├── directs-e2ee.test.jsx
│   │   │   ├── e2ee.test.js
│   │   │   ├── logout.test.jsx
│   │   │   ├── otp.test.jsx
│   │   │   └── ...
│   │   ├── App.jsx                     # Rotas e layout principal
│   │   ├── socket.js                   # Instância global do Socket.IO Client
│   │   ├── main.jsx                    # Ponto de montagem React 19
│   │   └── index.css                   # Tailwind 4 e estilos base
│   ├── vite.config.js
│   ├── package.json
│   └── .env
├── mobile/                             # Aplicativo móvel dedicado (Capacitor 8 + React 19)
│   ├── android/                        # Projeto nativo Android (Gradle, Manifest, APK SkyRipple)
│   ├── src/
│   │   ├── components/mobile/          # MobileHeader, BottomNavigation, etc.
│   │   ├── pages/                      # Telas adaptadas para experiência mobile
│   │   │   ├── Chat.jsx                # Conversas com cabeçalho seguro e safe-area
│   │   │   ├── Directs.jsx             # Directs 1x1 E2EE e ordenação temporal brasileira
│   │   │   ├── Favorites.jsx           # Salas e conversas favoritas
│   │   │   ├── Feedback.jsx            # Envio de feedback do app
│   │   │   ├── ForgotPassword.jsx      # Recuperação de senha com OTP
│   │   │   ├── Login.jsx               # Login e autenticação Google com Deep Linking
│   │   │   ├── Profile.jsx             # Gerenciamento de perfil e avatar
│   │   │   ├── Register.jsx            # Cadastro de nova conta
│   │   │   ├── Rooms.jsx               # Navegação e busca em salas
│   │   │   ├── Settings.jsx            # Configurações de tema e aparência
│   │   │   └── Suporte.jsx             # Central de ajuda e FAQ
│   │   ├── utils/
│   │   │   └── dateUtils.js            # Utilitários de fuso horário brasileiro (America/Sao_Paulo)
│   │   ├── App.jsx                     # Roteamento mobile, Deep Linking e tratamento de sessão
│   │   ├── main.jsx
│   │   └── index.css
│   ├── capacitor.config.json           # Configuração do appId com.skyripple.app
│   ├── vite.config.js
│   ├── package.json
│   └── .env
└── README.md
```

## Catálogo de Páginas Principais (Frontend Web)

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

## Catálogo de Telas (Mobile Android)

O aplicativo móvel dedicado conta com 11 telas com layout ergonômico, navegação inferior (`BottomNavigation`) e barra de status integrada:

| Tela | Rota | Componente | Descrição & Experiência Mobile |
| :--- | :--- | :--- | :--- |
| **Login** | `/login` | `Login.jsx` | Autenticação por e-mail/senha e login social com Google via Deep Linking. |
| **Cadastro** | `/register` | `Register.jsx` | Cadastro com validação de código OTP e passos otimizados para toque. |
| **Recuperação de Senha** | `/forgot-password` | `ForgotPassword.jsx` | Validação de código numérico de 8 dígitos e definição de nova senha. |
| **Lobby de Salas** | `/rooms` | `Rooms.jsx` | Exploração tátil de salas temáticas com contadores de presença em tempo real. |
| **Sala de Chat** | `/chat/:id` | `Chat.jsx` | Chat em tempo real com envio de anexos, gravação de áudio e header translúcido. |
| **Mensagens Diretas** | `/directs` | `Directs.jsx` | Lista de conversas privadas 1x1 com proteção E2EE e busca de contatos. |
| **Conversa Direta** | `/direct/:id` | `Directs.jsx` | Bate-papo 1x1 cifrado, identificação precisa do remetente (`isMe`) e horário local. |
| **Favoritos** | `/favorites` | `Favorites.jsx` | Acesso rápido às salas e conversas favoritas do usuário. |
| **Perfil** | `/profile` | `Profile.jsx` | Gerenciamento de foto de perfil, avatar dinâmico e biografia. |
| **Configurações** | `/settings` | `Settings.jsx` | Preferências de exibição e alternância instantânea entre Modo Claro e Escuro. |
| **Feedback & Suporte** | `/feedback`, `/support` | `Feedback.jsx`, `Suporte.jsx` | FAQ interativo e canal direto de relatos com suporte a rolagem fluida. |

## Status atual

O projeto **SkyRipple** encontra-se em estado avançado de maturidade técnica, estabilidade e conformidade arquitetural:
* **Frontend Web & Mobile**: Experiência unificada e consistente em Desktop e Android. Conta com interface skeuomórfica refinada (Modo Claro/Escuro), chat em salas públicas e privadas, mensagens diretas com E2EE (Directs), fluxo de cadastro e recuperação com código OTP, central de notificações em tempo real, painel administrativo e interface tátil de moderação de sala.
* **Aplicativo Android Nativo**: Totalmente operacional via Capacitor 8 com pacote `com.skyripple.app`, feedback tátil (`@capacitor/haptics`), deep linking nativo para login social e tratamento contra artefatos visuais de GPU no cabeçalho translúcido.
* **Backend**: Arquitetura profissional em camadas (Controllers, Services, Repositories e Models ORM com Sequelize e Supabase PostgreSQL), auto-migração resiliente de esquema, endurecimento de segurança baseado nos padrões **CIS Controls IG1 & OWASP ASVS**, logs estruturados de auditoria, suíte robusta com **182 testes automatizados no backend e 128 testes no frontend (310 testes no total) 100% aprovados** e documentação Swagger 3.0 interativa.

## Link da documentação Swagger

* **Produção (SkyRipple):** <https://skyripple-9vqr.onrender.com/api-docs/>
* **Produção (Legado):** <https://webchat-9vqr.onrender.com/api-docs/>
* **Local:** <http://localhost:3001/api-docs/>

### Cobertura da Documentação OpenAPI 3.0
A documentação interativa via Swagger UI reflete 100% dos contratos da API:
* **40 Rotas Documentadas** categorizadas em 9 tags (`Auth`, `Rooms`, `Messages`, `Directs`, `Notifications`, `Favorites`, `Reports`, `Feedbacks`, `Admin`).
* **13 Schemas Canônicos**: `User`, `PublicKeyJwk`, `AttachmentInput`, `Room`, `RoomMember`, `Message`, `DirectConversation`, `DirectMessage`, `Notification`, `Favorite`, `Report`, `Feedback` e `ErrorResponse`.
* **Autenticação Interativa**: Suporte a autorização no Swagger UI com token JWT (`BearerAuth`) e chave administrativa (`AdminAuth`).

## Link da documentação Mintlify

<https://lucas-ramos.mintlify.site/guides/overview>

## Funcionalidades Recentes & Entregas Concluídas

* **Aplicativo Mobile Nativo (Capacitor 8 Android)**: Empacotamento híbrido de alto desempenho ("SkyRipple", ID `com.skyripple.app`), com navegação inferior ergonômica, safe-area insets automáticos, resposta tátil via `@capacitor/haptics` e renderização estável sem artefatos de GPU.
* **Deep Linking & Ponte de Autenticação Social**: Integração de esquema de URL nativo (`skyripple://auth/callback`) conectando o fluxo web de OAuth ao app móvel, permitindo login transparente com Google.
* **Criptografia Ponta-a-Ponta (E2EE) no Web & Mobile**: Criptografia assimétrica ponta a ponta no cliente para conversas diretas 1x1 via Web Crypto API (par de chaves ECDH P-256, chave AES-GCM-256 bits, envelope cifrado `e2ee:v1:...` e armazenamento cego no servidor).
* **Fuso Horário Brasileiro e Identificação de Mensagens (`isMe`)**: Formatação temporal estrita no padrão brasileiro (`America/Sao_Paulo` / 24h) e algoritmo resiliente de identificação de autoria de mensagens, garantindo alinhamento perfeito de balões na conversa.
* **Paginação por Cursor no Histórico**: Implementação de parâmetros `before`, `since` e `limit` com índices compostos B-Tree (`idx_messages_room_created_at`, `idx_direct_messages_conv_created_at`) para rolagem infinita instantânea em salas e directs.
* **Mídias e Anexos Multimídia**: Suporte nativo à gravação e reprodução de áudio no navegador e compartilhamento de documentos e imagens em anexo (até 5 MB) em base64 Data URL.
* **Verificação de Código OTP**: Fluxo de cadastro em duas etapas com código numérico OTP de 6 dígitos e recuperação de senha com código numérico de 8 dígitos integrado ao Supabase.
* **Resiliência de Logout**: Rotina com timeout defensivo de 2s com `Promise.race`, encerramento de WebSocket, expurgo estrito de chaves de sessão locais e emissão do evento global `profileUpdated`.
* **Limpeza e Padronização do Código**: Base de código integralmente limpa e profissional, preservando 100% dos comentários contratuais Swagger OpenAPI 3.0 para a documentação interativa.
* **Cobertura Completa de Testes**: Suíte de 310 testes automatizados (182 testes de backend, 128 testes de frontend e suíte ponta a ponta Playwright) com 100% de aprovação.

## Próximos passos

* **Chamadas de Voz e Vídeo P2P (WebRTC)**: Estabelecer sinalização via Socket.io para comunicação de áudio e vídeo de baixa latência ponto a ponto.
* **Notificações Push Nativas (Web Push & Firebase Cloud Messaging)**: Alertar usuários sobre novas mensagens mesmo com o app fechado ou em segundo plano.
* **Sincronização Offline com IndexedDB**: Cache local de histórico e mensagens pendentes para envio automático ao restabelecer conectividade.
* **Reações Rápidas com Emojis**: Sistema tátil de reações em balões de mensagens com sincronização em tempo real na sala.

## Diagramas Arquiteturais & de Modelagem

### 1. Diagrama de Arquitetura da Solução

```mermaid
graph TD
    subgraph ClientLayer["Camada de Cliente (Frontend SPA & Mobile)"]
        UI["React 19 + Vite (Web & Mobile)"]
        Skeuo["Skeuomorphic & Frutiger Aero Gloss Design System"]
        State["React Context & State Management"]
        E2EEEngine["Módulo E2EE Web Crypto (ECDH P-256 + AES-GCM)"]
        MediaEngine["Gravador de Áudio & Anexos (attachments.js)"]
        OTPEngine["Verificação OTP (OtpCodeInput.jsx)"]
        SocketClient["Socket.io Client (socket.js)"]
        HTTPClient["Fetch API (services/api.js)"]
    end

    subgraph GatewayLayer["Servidor Backend (Node.js & Express)"]
        HTTP_Server["HTTP Server (server.js & src/app.js)"]
        Socket_Server["Socket.io Engine (src/sockets)"]
        
        subgraph Middlewares["Middlewares & Segurança"]
            Helmet["Helmet (HSTS, Headers Seguros)"]
            Cors["CORS Estrito & Dinâmico (src/config/cors.js)"]
            RateLimit["Rate Limiting (Global, Auth & Mensagens)"]
            AuthGuard["JWT Auth & Admin Guard"]
            SocketAuth["Handshake JWT Auth (socketAuth.js)"]
        end
    end

    subgraph BusinessLayer["Camada de Aplicação & Regras de Negócio"]
        Controllers["Controladores REST (src/controllers)"]
        Services["Serviços de Domínio (src/services)"]
        CursorEngine["Paginação por Cursor (before, since, limit)"]
        KeyExchange["Acordo de Chaves E2EE (/directs/keys)"]
        SocketHandlers["Manipuladores Socket (chatHandler.js & presence.js)"]
        PresenceMap["Mapa de Presença em Memória (roomPresence)"]
    end

    subgraph PersistenceLayer["Camada de Persistência & Dados"]
        Repos["Repositórios de Dados (src/repositories)"]
        ORM["Sequelize ORM (src/models)"]
        AutoMigrate["Auto-Migração Resiliente de Esquema"]
        DB["PostgreSQL / Supabase (Índices B-Tree, public_key, attachment_*)"]
        MemDB["SQLite em Memória (Ambiente de Testes)"]
    end

    UI --> HTTPClient
    UI --> SocketClient
    UI --> E2EEEngine
    UI --> MediaEngine
    UI --> OTPEngine
    HTTPClient --> Helmet --> Cors --> RateLimit --> AuthGuard --> Controllers
    SocketClient --> SocketAuth --> Socket_Server --> SocketHandlers
    SocketHandlers --> PresenceMap
    Controllers --> Services
    Controllers --> CursorEngine
    Controllers --> KeyExchange
    SocketHandlers --> Services
    Services --> Repos
    Repos --> ORM
    ORM --> AutoMigrate
    AutoMigrate --> DB
    ORM -.-> MemDB
```

### 2. Diagrama de Fluxo de Mensageria em Tempo Real & Criptografia E2EE

```mermaid
sequenceDiagram
    autonumber
    actor Alice as Usuário (Alice)
    participant SocketGW as Gateway Socket.io (src/sockets)
    participant Presence as Gestor de Presença (presence.js)
    participant ChatHdl as Chat Handler (chatHandler.js)
    participant Service as MessageService / DirectService
    participant DB as PostgreSQL (Supabase)
    actor Bob as Usuário (Bob)

    Note over Alice,SocketGW: Handshake e Presença
    Alice->>SocketGW: Handshake com JWT (auth.token)
    SocketGW->>SocketGW: Validação de Token (socketAuth.js)
    SocketGW-->>Alice: Conexão Estabelecida
    Alice->>SocketGW: joinRoom { roomId, user }
    SocketGW->>Presence: Registra socket e usuário na sala
    Presence-->>Alice: roomPresenceUpdated { onlineUsers, count }
    Presence-->>Bob: roomPresenceUpdated { onlineUsers, count }

    Note over Alice,Bob: Cenário A: Mensagem com Anexo em Sala Temática
    Alice->>ChatHdl: send_message { room, content, attachment: { url, type, name, size } }
    ChatHdl->>ChatHdl: Rate limit (janela de 500ms) e validação de tamanho (<= 5MB)
    ChatHdl->>Service: Sanitiza texto e valida metadados do anexo
    Service->>DB: INSERT INTO messages (content, attachment_url, attachment_type, ...)
    DB-->>Service: Mensagem persistida com UUID e Timestamp
    Service-->>ChatHdl: Mensagem completa
    ChatHdl-->>Alice: receive_message (Broadcast da sala)
    ChatHdl-->>Bob: receive_message (Broadcast da sala)

    Note over Alice,Bob: Cenário B: Mensagem Direta Cifrada Ponta a Ponta (E2EE)
    Alice->>Alice: Cifra texto e anexo via Web Crypto API (AES-GCM-256)
    Alice->>SocketGW: send_direct_message { conversationId, content: "e2ee:v1:iv:ciphertext" }
    SocketGW->>Service: Registra envelope cifrado no banco (servidor cego)
    Service->>DB: INSERT INTO direct_messages (content: "e2ee:v1:...")
    DB-->>Service: Salvo
    SocketGW-->>Bob: receive_direct_message { content: "e2ee:v1:iv:ciphertext" }
    Bob->>Bob: Decifra o envelope no navegador usando sua chave privada ECDH
```

### 3. Diagrama de Autenticação Híbrida, Recuperação de Senha & Fluxo OTP

```mermaid
flowchart TD
    Start(["Requisição de Autenticação"]) --> Mode{"Fluxo Selecionado"}
    
    Mode -->|"Cadastro em 2 Etapas"| FormRegister["POST /api/auth/register"]
    Mode -->|"Recuperação de Senha"| FormForgot["POST /api/auth/forgot-password"]
    Mode -->|"Credenciais Tradicionais"| FormLogin["POST /api/auth/login"]
    Mode -->|"Google OAuth"| OAuthSync["POST /api/auth/oauth-sync"]
    Mode -->|"Administrador"| AdminAuth["POST /api/admin/auth"]
    Mode -->|"Sair da Conta (Logout)"| LogoutFlow["Rotina Resiliente de Logout"]

    FormRegister --> SendRegOTP["Supabase dispara OTP numérico de 6 dígitos ao e-mail"]
    SendRegOTP --> InputRegOTP["Entrada de Código em 6 slots (OtpCodeInput)"]
    InputRegOTP --> VerifyRegOTP{"Validação supabase.auth.verifyOtp"}
    VerifyRegOTP -->|"Incorreto / Expirado"| RegError["Exibe erro e habilita reenvio com timer de 60s"]
    VerifyRegOTP -->|"Aprovado"| UpsertReg["Persiste usuário com perfil ativo"]

    FormForgot --> SendForgotOTP["Supabase dispara OTP numérico de 8 dígitos ao e-mail"]
    SendForgotOTP --> InputForgotOTP["Entrada de Código em 8 slots (OtpCodeInput length=8)"]
    InputForgotOTP --> VerifyForgotOTP{"Validação supabase.auth.verifyOtp"}
    VerifyForgotOTP -->|"Incorreto / Expirado"| ForgotError["Exibe erro e habilita reenvio com timer de 60s"]
    VerifyForgotOTP -->|"Aprovado"| StepNewPass["Formulário de Nova Senha (supabase.auth.updateUser)"]
    StepNewPass --> PasswordUpdated["Senha atualizada com sucesso"]

    FormLogin --> RateCheck{"Tentativas consecutivas?"}
    RateCheck -->|"Excesso de falhas"| Lockout["Bloqueio Temporário 15 min (429 Too Many Requests)"]
    RateCheck -->|"Dentro do limite"| VerifyHash["Verificação Argon2id / Bcrypt"]
    VerifyHash -->|"Senha Incorreta"| DummyTiming["Dummy Hash (Anti-Enumeração) -> 401 Unauthorized"]
    VerifyHash -->|"Sucesso"| AutoRehash["Auto-rehash transparente para Argon2id"]
    
    OAuthSync --> Normalize["Normaliza Nome, Foto e E-mail"]
    Normalize --> UpsertUser["Sincroniza Perfil no Banco (password = null)"]
    
    AdminAuth --> TimingSafe["crypto.timingSafeEqual com ADMIN_SECRET_KEY"]
    TimingSafe -->|"Válido"| IssueAdminJWT["Emite JWT Admin (TTL: 8h, role: admin)"]
    TimingSafe -->|"Inválido"| RejectAdmin["401 Unauthorized"]

    UpsertReg --> IssueUserJWT["Emite JWT Usuário (TTL: 7d, role: user)"]
    AutoRehash --> IssueUserJWT
    UpsertUser --> IssueUserJWT

    IssueUserJWT --> AccessApp["Acesso a Salas, Directs E2EE, Anexos & Favoritos"]
    IssueAdminJWT --> AccessAdmin["Acesso ao Console /admin e Métricas /stats"]

    LogoutFlow --> TimeoutRace["Promise.race (signOut com timeout de 2000ms)"]
    TimeoutRace --> CleanSession["Expurgo estrito de tokens e chat_* no localStorage/sessionStorage"]
    CleanSession --> DisconnectSocket["socket.disconnect() e removeAuthToken()"]
    DisconnectSocket --> DispatchEvent["Disparo do evento global profileUpdated"]
    DispatchEvent --> RedirectLogin["Redirecionamento limpo para /login"]
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
        string profilePhoto "nullable"
        text profileDesc "nullable"
        string role "user | admin"
        string status "active | banned"
        text public_key "nullable (JWK ECDH P-256)"
        datetime created_at
    }

    ROOMS {
        uuid id PK
        string name
        string type "public | private"
        text description "nullable"
        string category "nullable"
        text image_url "nullable"
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

    DIRECT_CONVERSATIONS {
        uuid id PK
        uuid user1_id FK
        uuid user2_id FK
        text last_message "nullable"
        datetime last_message_at "nullable"
        datetime created_at
    }

    DIRECT_MESSAGES {
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

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string type "system | message | invite | reaction | info"
        string title
        text content
        string link "nullable"
        boolean read
        json data "nullable"
        datetime created_at
    }

    FAVORITES {
        uuid id PK
        uuid user_id FK
        string item_type "room | conversation"
        string item_id
        string title
        text content "nullable"
        json meta "nullable"
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
        json images "nullable"
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
        +setPublicKey(req, res)
        +getPublicKey(req, res)
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
        +sendMessage(roomId, userId, content, imageUrl, attachment) Message
        +getMessagesByRoom(roomId, options) Object
        +searchMessages(roomId, query) List~Message~
        +deleteMessage(id, userId, isAdmin) boolean
    }

    class DirectService {
        +listConversations(userId) List~DirectConversation~
        +getOrCreateConversation(user1, user2) DirectConversation
        +getConversationMessages(convId, userId, options) Object
        +sendMessage(data) DirectMessage
        +deleteConversation(convId, userId) boolean
        +searchAvailableUsers(query, excludeId) List~User~
        +setPublicKey(userId, jwkKey) boolean
        +getPublicKey(userId) Object
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
        +String public_key
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
        +String attachment_url
        +String attachment_type
        +String attachment_name
        +Integer attachment_size
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
        +String attachment_url
        +String attachment_type
        +String attachment_name
        +Integer attachment_size
        +Boolean read
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

### 6. Diagrama de Troca de Chaves & Cifragem Ponta a Ponta (E2EE)

```mermaid
sequenceDiagram
    autonumber
    actor Alice as Navegador de Alice (Remetente)
    participant API as Backend REST (/api/directs)
    participant DB as Banco PostgreSQL (Supabase)
    participant WS as Socket.io Broker
    actor Bob as Navegador de Bob (Destinatário)

    Note over Alice,Bob: Fase 1: Acordo e Registro de Chaves Públicas ECDH (P-256)
    Alice->>Alice: Gera par de chaves ECDH P-256 (Web Crypto API)
    Alice->>Alice: Armazena chave privada no IndexedDB/LocalStorage local
    Alice->>API: PUT /api/directs/keys { publicKey: JWK_Alice }
    API->>DB: UPDATE users SET public_key = JWK_Alice WHERE id = Alice.id
    
    Bob->>Bob: Gera par de chaves ECDH P-256 (Web Crypto API)
    Bob->>Bob: Armazena chave privada no IndexedDB/LocalStorage local
    Bob->>API: PUT /api/directs/keys { publicKey: JWK_Bob }
    API->>DB: UPDATE users SET public_key = JWK_Bob WHERE id = Bob.id

    Note over Alice,Bob: Fase 2: Derivação de Segredo Compartilhado e Cifragem Local
    Alice->>API: GET /api/directs/keys/{bobId}
    API->>DB: SELECT public_key FROM users WHERE id = bobId
    DB-->>API: Retorna JWK_Bob
    API-->>Alice: { userId: bobId, publicKey: JWK_Bob }
    
    Alice->>Alice: deriveKey(ECDH Alice_PrivKey + Bob_PubKey) via HKDF
    Alice->>Alice: Produz chave simétrica AES-GCM (256 bits)
    Alice->>Alice: Gera IV aleatório de 12 bytes
    Alice->>Alice: Cifra payload { text, attachment } com AES-GCM
    Alice->>Alice: Empacota no envelope 'e2ee:v1:IV_Base64:Ciphertext_Base64'

    Note over Alice,Bob: Fase 3: Transmissão Cega pelo Servidor e Decifragem
    Alice->>WS: send_direct_message { conversationId, content: "e2ee:v1:..." }
    WS->>DB: INSERT INTO direct_messages (content: "e2ee:v1:...")
    WS-->>Bob: receive_direct_message { content: "e2ee:v1:..." }

    Bob->>Bob: deriveKey(ECDH Bob_PrivKey + Alice_PubKey) via HKDF
    Bob->>Bob: Produz a mesma chave simétrica AES-GCM (256 bits)
    Bob->>Bob: Decifra o envelope com o IV contido no cabeçalho da mensagem
    Bob->>Bob: Renderiza mensagem e anexo em texto claro na tela
```

## Autor

Desenvolvido por **Lucas Ramos Silva, Wssihélio Vasconcelos, Ruan Victor e Gabriel Lobão.** como parte da disciplina de Programação Web II.

## Testes ponta a ponta (E2E)

A suíte Playwright (`e2e/`) sobe sozinha um backend de teste (SQLite em memória, porta 3101) e o frontend (Vite, porta 5273) e cobre cadastro/login, chat em tempo real, histórico paginado (rolagem infinita e exportação), Directs com criptografia ponta a ponta e anexos (documento e áudio).

```bash
npm install
npm run test:e2e:install   # baixa o Chromium (uma vez)
npm run test:e2e
```
