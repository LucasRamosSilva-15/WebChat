# SkyRipple

<div align="center">
  <img src="frontend/public/logo1_grande_true.svg" width="256" height="256" alt="SkyRipple Logo">
</div>


![Versão](https://img.shields.io/badge/Vers%C3%A3o-8.1.2-blue?style=for-the-badge)
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

* **Frontend:** [https://web-chat-project-web2.vercel.app](https://skyripple-project-web2.vercel.app/)
* **Backend/API:** [https://webchat-9vqr.onrender.com](https://webchat-9vqr.onrender.com)

## Imagens / Screenshots

![Home](docs/screenshots/Home.png)
![Salas](docs/screenshots/Room.png)
![Chat](docs/screenshots/Chat.png)
![Perfil](docs/screenshots/Profile.png)

## Funcionalidades

* [x] Página inicial (Home)
* [x] Login e Cadastro de contas
* [x] Listagem e favoritação de salas
* [x] Chat em tempo real (envio e recebimento de mensagens)
* [x] Busca avançada dentro do chat
* [x] Customização de perfil do usuário (nome de exibição e recado)
* [x] Temas visuais: Modo Claro e Modo Escuro
* [x] Layout responsivo e menus modais
* [x] Envio de imagens e armazenamento em nuvem (Storage)
* [X] Refinamentos na persistência e histórico longo de mensagens
* [X] Testes automatizados
* [ ] Documentação
* [ ] Sistema de criptografia de email, senhas, mensagens e etc
* [ ] Otimizações no frontend, backend e banco de dados
* [ ] Aumentar a segurança do sistema e do banco de dados
* [x] Página de Feedback
* [x] Administração do sistema (painel de controle) (está quase completo)
* [ ] Sistema de administração das salas (moderação avançada, cargos, etc) (está em boa parte implementado mas em incompleto ainda)
* [ ] Sistema de amizades e mensagens privadas
* [ ] Sistema de denúncias e bloqueios (está em boa parte implementado mas em incompleto ainda)
* [ ] O Projeto está escalável? (para chat, servidor, banco de dados, etc)
* [x] Página de suporte (só falta a parte do backend)
* [ ] Adaptação para telas menores (como notebooks e celulares e etc)

## Estrutura do projeto

```txt
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── MessageController.js
│   │   │   ├── RoomController.js
│   │   │   └── ...
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── adminAuth.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Room.js
│   │   │   └── ...
│   │   ├── repositories/
│   │   │   ├── UserRepository.js
│   │   │   ├── RoomRepository.js
│   │   │   └── ...
│   │   ├── routes/
│   │   │   ├── api.js
│   │   │   └── admin.js
│   │   └── services/
│   │       ├── UserService.js
│   │       ├── RoomService.js
│   │       └── ...
│   ├── tests/
│   │   │   ├── authMiddleware.test.js
│   │   │   ├── chat.test.js
│   │   │   └── ...
│   │   ├── App.js
│   │   ├── socket.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── docs/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Chat.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Rooms.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   |   ├── api.js
│   │   ├── styles/
│   │   │   ├── chat.css
│   │   │   ├── skeuo.css
│   │   │   └── ...
│   │   │
│   │   ├── tests/
│   │   │   ├── chat.test.jsx
│   │   │   ├── ChatSidebar.test.jsx
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx
│   │   ├── socket.js
│   │   ├── webchat-components.css
│   │   └── index.css
│   ├── package.json
│   └── .env
└── README.md
```

## Status atual

O projeto **SkyRipple** encontra-se em desenvolvimento ativo.
O frontend já está bastante avançado, com a maioria das páginas construídas, responsividade implementada e a identidade visual skeuomórfica bem estruturada em modo claro e escuro. A estrutura base de WebSockets e comunicação em tempo real já ocorre com o backend.
Ainda existem funcionalidades que estão sendo aprimoradas, como detalhes finais de moderação nas salas e otimizações gerais do Frontend, Backend, Banco de Dados, criação de novas páginas, testes automatizados e segurança.

## link da documentação SWAGGER

<https://webchat-9vqr.onrender.com/api-docs/>

## Próximos passos

* Finalizar e polir a integração total entre o backend, frontend e Supabase.
* Melhorar a persistência, paginação e carregamento otimizado de mensagens antigas.
* Refinamentos, melhorias e mudanças (não extremas) na identidade visual e layout.
* Otimizar o Frontend, Backend e o Banco de dados.
* Criar um sistema de administração do site (página do administrador com um panel de controle) e das salas
* Criar novas páginas (como o Admin.jsx e Feedback.jsx)
* Refinar a validação de dados em rotas do backend.
* Adicionar testes automatizados
* Capturar as telas finais e adicionar screenshots no README.

## Diagrama ER

![Diagrama Entidade-Relacionamento](docs/screenshots/Diagrama%20Entidade-Relacionamento.svg)

## Diagrama de Classes

![Diagrama de Classes](docs/screenshots/Diagrama%20de%20Classes%20SkyRippleProject%20(3).svg)

## Autor

Desenvolvido por **Lucas Ramos Silva, Wssihélio Vasconcelos, Ruan Victor e Gabriel Lobão.** como parte da disciplina de Programação Web II.
