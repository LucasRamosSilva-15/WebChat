# 📱 Relatório Técnico de Auditoria & Mapeamento de Lacunas
### SkyRipple: Versão Web Desktop (`src/`) vs. Versão Mobile (`mobile/src/`)

**Data da Auditoria:** 18 de Outubro de 2026  
**Status do Projeto Mobile:** Estrutura Base Inicializada com Skeuomorphic Touch  
**Escopo:** Comparação funcional e arquitetural entre `frontend/src/` e `mobile/src/`

---

## 1. Visão Geral Executiva

A versão móvel do **SkyRipple** foi estruturada como um projeto independente e desacoplado dentro do diretório `mobile/`, compartilhando a mesma infraestrutura de backend (API RESTful em Node.js/Express e WebSockets com Socket.IO). 

Esta auditoria avalia o grau de paridade das telas, regras de negócio, tratamento de estados de rede, ergonomia de toque e integração com APIs nativas de smartphone.

---

## 2. Tabela de Paridade de Módulos e Telas

| Módulo / Tela Web | Status em `mobile/` | Detalhes & Lacunas de Implementação |
| :--- | :---: | :--- |
| **Login** (`Login.jsx`) | ✅ **Concluído** | Implementado com card skeuomórfico, campos cavitários de 48px, botão primário glossy, integração com backend e botão oficial Google OAuth. |
| **Registo** (`Register.jsx`) | ✅ **Concluído** | Implementado com medidor tátil de força de senha, confirmação de credenciais, termos de uso e atalho para login. |
| **Recuperação de Senha** (`ForgotPassword.jsx`) | ✅ **Concluído** | Implementado com badge tátil `RECUPERAÇÃO DE ACESSO`, disparo via API/Supabase e transição para confirmação com orbe vítreo. |
| **Guarda de Rotas** (`PrivateRoute.jsx`) | ✅ **Concluído** | Proteção de rotas privadas ativada com verificação de `chat_token` e redirecionamento automático para `/login`. |
| **Salas de Conversa** (`Rooms.jsx`) | ⚠️ **Parcial** | Implementada listagem básica e criação via `MobileSheet`. Falta busca em tempo real com debounce, sincronização de contagem de membros via WebSocket, rolagem infinita e filtro de salas favoritadas. |
| **Chat de Sala** (`Chat.jsx`) | ⚠️ **Parcial** | Implementada troca de mensagens, envio de foto e gaveta de membros. Falta migrar balões avançados (`MessageBubble`), suporte a reações com emoji, mensagens fixadas e busca no chat. |
| **Membros da Sala** (`RoomMembersSheet.jsx`) | ✅ **Concluído** | Implementada gaveta `MobileSheet` com avatares, presença online (LED verde/cinza), badges táteis (`👑 DONO` e `ADMIN`) e ações rápidas de moderação. |
| **Mensagens Diretas 1x1** (`Directs.jsx`) | ⚠️ **Parcial** | Implementada listagem de conversas e modal de novo chat. Falta criptografia client-side AES (CryptoJS), indicador de digitação (*typing...*), recibos de leitura (*read receipts*) e integração com busca global `/api/directs/users`. |
| **Favoritos** (`Favorites.jsx`) | ❌ **Inexistente** | Falta tela dedicada para visualização de mensagens e salas marcadas com estrela. |
| **Perfil & Customização** (`Profile.jsx`) | ⚠️ **Parcial** | Implementada edição de nome, frase de status e toggle de tema escuro. Falta seletor de paleta de cores (Azul, Esmeralda, Púrpura, Rubi, Grafite) e upload real de foto de perfil. |
| **Ajustes Globais** (`Settings.jsx`) | ⚠️ **Parcial** | Implementados ajustes rápidos. Faltam as abas completas de Privacidade (bloqueio de usuários), Sessões Ativas, Sons Customizados e Exportação de Dados em JSON. |
| **Notificações Globais** (`NotificationContext.jsx`) | ✅ **Concluído** | Implementado provedor com persistência local, contadores reativos no badge da dock inferior, sintetizador de som Web Audio e vibração háptica. |
| **Central de Suporte** (`Suporte.jsx`) | ❌ **Inexistente** | Falta FAQ colapsável móvel e envio de chamados ao backend. |
| **Feedback da Comunidade** (`Feedback.jsx`) | ❌ **Inexistente** | Falta tela de avaliação do aplicativo com estrelas e campo de sugestões. |
| **Painel de Moderação/Admin** (`Admin.jsx`) | ⏸️ **Fora de Escopo** | Recomendado manter restrito à versão web para telas maiores. |

---

## 3. Análise Detalhada por Dimensão Arquitetural

### 3.1 Autenticação, Sessão e Segurança
- **Problema de Redirecionamento OAuth:** Na versão web, o login com Google utiliza `window.location.origin/` como callback. Em aplicativos empacotados via Capacitor ou executados em WebViews nativas, o origin pode ser `capacitor://localhost` ou `http://localhost`, exigindo configuração de Deep Linking (`skyripple://oauth/callback`).
- **Persistência de Sessão:** A versão móvel atual depende apenas de chaves mockadas no `localStorage`. É necessário criar a barreira `PrivateRoute.jsx` para redirecionar usuários deslogados para o login.

### 3.2 Experiência de Conversa e Teclado Móvel (`Chat.jsx`)
- **Sobreposição pelo Teclado Virtual:** O hook `useKeyboard.js` detecta a altura da viewport visual (`window.visualViewport`), mas o container de digitação precisa ancorar suavemente acima do teclado virtual.
- **Interação com Mensagens (Menu de Contexto):** No desktop, opções como favoritar, editar e deletar ocorrem em botões de hover. No mobile, é indispensável a implementação do gesto de **toque longo (*long-press* de 400ms)** para disparar uma `MobileSheet` com reações e opções da mensagem.
- **Rolagem Automática Confiável:** A rolagem ao receber mensagens ou ao focar no campo de digitação precisa de compensação suave sem saltos abruptos de layout.

### 3.3 Componentes do Skeuomorphic Design System (SDS Touch)
- **Desativação de Hover Preso:** Em smartphones, a pseudoclasse CSS `:hover` permanece retida após o toque. Deve-se assegurar que regras de iluminação e gradientes especulares usem `@media (hover: hover)` para que apenas o estado `:active` seja acionado ao toque.
- **Área Tátil Mínima:** Todos os elementos clicáveis (ícones, botões de anexo, badges de filtro) devem manter no mínimo `44x44px` de área de toque utilizável.
- **Calhas Cavitárias e Orbes:** O design de calha `.skeuo-well` e as orbes de avatar devem manter contraste adequado tanto no modo claro quanto no modo escuro.

### 3.4 Recursos Nativos e Plugins do Capacitor
Para elevar a versão mobile do status de PWA para aplicação móvel nativa de alto padrão, é necessária a integração dos seguintes módulos:
1. `@capacitor/haptics`: Disparo de vibrações hápticas leves ao tocar nos itens da dock inferior e ao enviar mensagens.
2. `@capacitor/keyboard`: Controle do redimensionamento do webview quando o teclado nativo é acionado.
3. `@capacitor/status-bar`: Estilização translúcida da barra de status do iOS/Android alinhada com o gradiente celestial do SkyRipple.
4. `@capacitor/push-notifications`: Recebimento de avisos em segundo plano com atualização de contadores de badges.

---

## 4. Lista Priorizada de Tarefas

### 🔴 Prioridade 1 (Crítico / Bloqueante)
1. **Fluxo de Autenticação Móvel:**
   - Criar `mobile/src/pages/Login.jsx` e `mobile/src/pages/Register.jsx`.
   - Implementar `mobile/src/components/PrivateRoute.jsx`.
2. **Provedor de Notificações (`NotificationContext.jsx`):**
   - Migrar gerenciamento global de mensagens não lidas e alertas sonoros para `mobile/src/context/NotificationContext.jsx`.
3. **Gaveta de Membros da Sala (`RoomMembersSheet.jsx`):**
   - Criar `MobileSheet` acionada no topo do chat para exibir os participantes e cargos da sala.

### 🟡 Prioridade 2 (Importante / Experiência)
1. **Gesto de Toque Longo no Chat:**
   - Menu flutuante de reações com emojis e opções da mensagem ao segurar o toque.
2. **Criptografia e Recibos em Mensagens Diretas:**
   - Adicionar CryptoJS client-side e sincronização de status de digitação no `Directs.jsx`.
3. **Ajuste Dinâmico de Viewport com Teclado Aberto:**
   - Conectar o hook `useKeyboard` ao espaçamento inferior da barra de mensagens.

### 🟢 Prioridade 3 (Polimento Tátil & Integrações Nativas)
1. **Instalação dos Plugins Capacitor:**
   - Integrar `@capacitor/haptics` e `@capacitor/status-bar`.
2. **Regras de CSS Anti-Hover Preso:**
   - Adicionar `@media (hover: hover)` para transições de botões e links.
3. **Seletor de Temas de Cores no Perfil:**
   - Permitir alternância entre os temas Azul, Esmeralda, Púrpura, Rubi e Grafite.

---

## 5. Plano de Ação Imediato

Os 3 arquivos essenciais para execução imediata:

1. **`mobile/src/pages/Login.jsx`** — Tela de acesso móvel completa com ergonomia de toque e integração com `api.js`.
2. **`mobile/src/components/PrivateRoute.jsx`** — Componente de proteção para garantir sessão ativa antes de acessar as rotas de chat.
3. **`mobile/src/components/mobile/RoomMembersSheet.jsx`** — Gaveta inferior com a lista de membros e presença online conectada via socket.
