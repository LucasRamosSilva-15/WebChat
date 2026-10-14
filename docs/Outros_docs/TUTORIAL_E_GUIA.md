# Tutorial e Guia do WebChat

Bem-vindo ao guia de desenvolvimento do WebChat! Aqui vamos explicar os conceitos das tecnologias usadas e os passos necessários para mexer no projeto.

## 1. O que são as tecnologias?

- **Node.js**: É um ambiente que permite executar código JavaScript fora do navegador (no seu computador/servidor). Ele é o "motor" do nosso Backend.
- **Express**: É um framework para o Node.js que facilita muito a criação de servidores web e APIs. Com ele, podemos receber requisições e enviar respostas pela internet.
- **Socket.io**: É uma biblioteca que permite a comunicação **em tempo real** e bidirecional entre o cliente (navegador) e o servidor. É a mágica por trás de um chat: quando alguém envia uma mensagem, o Socket.io a entrega instantaneamente para os outros sem precisar recarregar a página.
- **React.js**: É uma biblioteca JavaScript para construir interfaces de usuário (o Frontend). Ele divide o visual em "Componentes" (como pedaços de LEGO - ex: um Navbar, um Footer, um Botão) que podem ser reaproveitados.
- **Tailwind CSS v4**: É um framework CSS que nos permite estilizar o projeto diretamente no HTML (ou JSX do React) usando classes utilitárias (ex: `bg-blue-500`, `text-white`), acelerando muito o desenvolvimento.

## 2. Como instalar o Node.js

Você já possui o Node.js instalado (versão 22)!
Caso precise atualizar no futuro:
1. Acesse o site oficial: [nodejs.org](https://nodejs.org/)
2. Baixe o instalador do Windows para a versão LTS (Recomendada para a maioria dos usuários).
3. Execute o instalador e avance clicando em "Next" deixando todas as opções padrão.

*(O Node.js já vem com o **npm**, que é o Gerenciador de Pacotes do Node. É com ele que instalamos bibliotecas como React e Socket.io)*.

---

## 3. Estrutura do Projeto

Agora seu projeto está dividido em duas pastas principais:

- `/backend`: Onde o servidor roda (Node.js + Express + Socket.io).
- `/frontend`: Onde a interface roda (React.js + Tailwind CSS).

Para que o projeto completo funcione na sua máquina, você sempre precisará rodar os dois ao mesmo tempo, cada um em um terminal.

### Como iniciar o Backend (Servidor)
1. Abra um terminal e entre na pasta do backend: `cd backend`
2. Instale as dependências (necessário apenas na primeira vez): `npm install`
3. Inicie o servidor: `npm run dev`
(Ele dirá algo como: "Servidor rodando na porta 3000")

### Como iniciar o Frontend (Visual/React)
1. Abra um NOVO terminal e entre na pasta do frontend: `cd frontend`
2. Instale as dependências (necessário apenas na primeira vez): `npm install`
3. Inicie o site: `npm run dev`
(Ele abrirá uma porta local, como `http://localhost:5173`. Você pode clicar nesse link para ver o projeto no navegador).

---

## 4. Onde eu mexo no código?

- **Visual / Cores / Telas:** Acesse a pasta `frontend/src/`. As páginas estarão dentro de `frontend/src/pages` (ex: `Home.jsx`, `Chat.jsx`).
- **Lógica do Chat / Envio de Mensagens:** Acesse o arquivo `backend/server.js`.
- **Estilos / CSS Global:** Acesse o arquivo `frontend/src/index.css`.
- **Arquivos antigos:** Acesse a pasta `legacy/`
