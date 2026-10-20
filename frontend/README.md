# 🌐 SkyRipple — Documentação do Frontend

Bem-vindo à documentação técnica do cliente web do **SkyRipple**. Esta aplicação foi construída com foco em comunicação instantânea, alta fidelidade visual baseada no **Skeuomorphic Design System (SDS)** / estética Frutiger Aero, e reatividade ponta a ponta.

---

## 🛠️ Stack Tecnológica

- **Core & Runtime**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Roteamento**: [React Router DOM v7](https://reactrouter.com/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) + CSS Customizado (`skeuo.css`, `skeuo-extra.css`)
- **Comunicação em Tempo Real**: [Socket.IO Client](https://socket.io/)
- **Criptografia Ponta-a-Ponta (E2EE)**: [Web Crypto API nativa](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) (`SubtleCrypto` com par de chaves assimétricas ECDH P-256, derivação HKDF e cifras simétricas AES-GCM-256 bits)
- **Processamento de Áudio & Anexos**: MediaRecorder API nativa e conversão resiliente de Base64 Data URL (até 5MB) via `attachments.js`
- **Iconografia**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Animações & Efeitos**: Backdrop filters, reflexos de vidro, gradientes HSL e chanfros tridimensionais

---

## 🗺️ Arquitetura de Roteamento

O roteamento da aplicação é gerenciado em `src/App.jsx` com controle de guardas de autenticação:

| Rota | Componente | Acesso | Descrição Resumida |
| :--- | :--- | :--- | :--- |
| `/` | `Home.jsx` | Público | Landing page inicial e ponto de entrada |
| `/login` | `Login.jsx` | Público | Autenticação de usuários existentes com suporte a e-mail/senha e Google OAuth |
| `/register` | `Register.jsx` | Público | Criação de conta em duas etapas com código numérico OTP (6 dígitos) e medidor de senha |
| `/forgot-password` | `ForgotPassword.jsx` | Público | Recuperação de senha com envio de código numérico de 8 dígitos e atualização de credenciais |
| `/about` | `About.jsx` | Público | Apresentação institucional e acadêmica |
| `/rooms` | `Rooms.jsx` | Protegido (`PrivateRoute`) | Lobby de salas de conversação com filtros e métricas |
| `/chat` | `Chat.jsx` | Protegido (`PrivateRoute`) | Sala de chat ativa com moderação, histórico paginado por cursor, áudio e anexos |
| `/directs` | `Directs.jsx` | Protegido (`PrivateRoute`) | Mensagens Diretas 1x1 protegidas por Criptografia Ponta a Ponta (E2EE) |
| `/direct` | `Directs.jsx` | Protegido (`PrivateRoute`) | Rota alternativa de acesso ao chat direto |
| `/favorites` | `Favorites.jsx` | Protegido (`PrivateRoute`) | Central de salas e conversas favoritas |
| `/custom` | `Custom.jsx` | Protegido (`PrivateRoute`) | Customização de perfil e avatar |
| `/settings` | `Settings.jsx` | Protegido (`PrivateRoute`) | Preferências visuais, temas e acessibilidade |
| `/feedback` | `Feedback.jsx` | Protegido (`PrivateRoute`) | Envio de avaliações, bugs e sugestões |
| `/suporte` | `Suporte.jsx` | Protegido (`PrivateRoute`) | Central de ajuda, FAQ e status |
| `/admin-login` | `AdminLogin.jsx` | Público | Portal de acesso de administradores |
| `/admin` | `Admin.jsx` | Admin (`AdminRoute`) | Painel de moderação e métricas |
| `/buttons` | `ButtonsTest.jsx` | Público | Bancada de validação de componentes SDS |
| `*` | `NotFound.jsx` | Público | Página de erro 404 personalizada |

---

## 📄 Catálogo Detalhado das Páginas

### 1. `Home.jsx` (Página Inicial)
- **Para que serve:**
  É o cartão de visitas do SkyRipple. Apresenta a proposta de valor da plataforma e guia o visitante para criar conta, fazer login ou acessar as salas caso já esteja autenticado.
- **Como é feito:**
  - **Estado & Lógica:** Inspeciona o `localStorage` (`chat_isLoggedIn`) na montagem. Se o usuário já estiver autenticado, exibe um CTA direto para `/rooms` ("Entrar em uma sala"); caso contrário, renderiza botões duplos para `/register` e `/login`.
  - **Design & Componentes:** Utiliza uma placa centralizada `.skeuo-card` com logo translúcido flutuante, sombra difusa (`drop-shadow`), títulos `.hero-title` e botões com transição de relevo ativo (`.skeuo-btn` e `.btn-secondary-glossy`).

---

### 2. `Login.jsx` (Autenticação)
- **Para que serve:**
  Permite que usuários registrados acessem suas contas utilizando e-mail e senha tradicionais ou login social com Google OAuth.
- **Como é feito:**
  - **Estado & Lógica:** Gerencia `email`, `password`, visibilidade de senha (`showPassword`), `loading`, `error` e mensagens de sessão expirada (`sessionExpiredNotice`) via `location.state`.
  - **Integração:** Submete credenciais para o endpoint `POST /api/auth/login`. Em caso de sucesso, armazena o token JWT (`setAuthToken`), inicializa os dados no `localStorage`, atualiza a autenticação do socket (`socket.auth = { token }`), reconecta o socket e dispara o evento global `profileUpdated`.
  - **Google OAuth:** Botão dedicado com ícone colorido do Google que aciona o fluxo gerenciado pelo Supabase e sincroniza o perfil via `POST /api/auth/oauth-sync`.
  - **Design:** Card tátil com inputs chanfrados `.skeuo-input`, botões com gradientes glossy e feedback de erro em alerta contextual.

---

### 3. `Register.jsx` (Cadastro em Duas Etapas com Código OTP)
- **Para que serve:**
  Registro confiável de novos usuários na plataforma, combinando medidor de robustez de senha e verificação de e-mail por código numérico de 6 dígitos.
- **Como é feito:**
  - **Etapa 1 (Dados Pessoais & Senha):** Controla `username`, `email`, `password`, checkboxes de termos (`termsAccepted` e `privacyAccepted`) e modais informativos via `createPortal`. A função `getPasswordStrength(pwd)` avalia complexidade em tempo real gerando feedback visual reativo.
  - **Etapa 2 (Verificação de Código OTP):** Ao submeter a etapa 1, o Supabase dispara um código numérico de 6 dígitos para o e-mail informado e a tela avança suavemente para o componente [`OtpCodeInput.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/common/OtpCodeInput.jsx).
  - **Validação de Código:** Valida o código digitado via `supabase.auth.verifyOtp({ email, token, type: 'signup' })`. Se correto, conclui o registro na API backend (`POST /api/auth/register`), armazena o token JWT e conecta a sessão WebSocket.
  - **Reenvio com Timer:** Contador regressivo de 60 segundos com botão tátil para solicitar novo código se necessário.

---

### 4. `ForgotPassword.jsx` (Recuperação de Senha com OTP de 8 Dígitos)
- **Para que serve:**
  Permite a redefinição segura de credenciais através de código numérico de verificação de 8 dígitos enviado ao e-mail.
- **Como é feito:**
  - **Etapa 1 (Identificação):** Usuário informa o e-mail cadastrado e solicita o código de recuperação via `supabase.auth.resetPasswordForEmail`.
  - **Etapa 2 (Validação do Código de 8 Dígitos):** Exibe o componente [`OtpCodeInput.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/common/OtpCodeInput.jsx) configurado com 8 ranhuras numéricas (`length={8}`). O código é conferido via `supabase.auth.verifyOtp({ email, token, type: 'recovery' })`.
  - **Etapa 3 (Nova Senha):** Com a sessão temporária de recuperação ativa, renderiza campos para definição e confirmação da nova senha chamando `supabase.auth.updateUser({ password })`.

---

### 5. `Rooms.jsx` (Lobby de Salas)
- **Para que serve:**
  Atua como o centro de navegação comunitária onde o usuário pode explorar, filtrar, criar e ingressar em salas de chat temáticas.
- **Como é feito:**
  - **Cards de Métricas:** Exibe três `StatCard` no topo com métricas em tempo real (Salas Ativas, Mensagens Enviadas, Usuários Online) integrando cavidades táteis `.skeuo-well`.
  - **Filtros e Pesquisa:** Possui input com debounce para pesquisa textual e seletor de categorias ("Tecnologia", "Jogos", "Geral", "Música", etc.).
  - **Criação de Sala (`CreateRoomModal`):** Permite criar novas salas com título, categoria, descrição e upload de ícone/imagem com conversão para Base64.
  - **Comunicação em Tempo Real:** Conecta ouvintes de eventos do Socket.IO (`room_list_update`, `user_count_change`) para atualizar a contagem de membros e o status das salas sem recarregar a página.
  - **Paginação:** Controles com visual tátil que dividem as salas em páginas configuráveis.

---

### 6. `Chat.jsx` (Sala de Conversação em Tempo Real)
- **Para que serve:**
  É o núcleo operacional do SkyRipple. Gerencia toda a troca de mensagens instantâneas dentro de uma sala selecionada, integrando moderação hierárquica completa, presença de membros, histórico com paginação por cursor e envio de mídias/áudios.
- **Como é feito:**
  - **Socket.IO & Presença:** Estabelece conexão com a sala via evento `joinRoom`. Gerencia lista de avatares com luz LED de status online e contador em tempo real (`roomPresenceUpdated`).
  - **Paginação Baseada em Cursor (before/since/limit):** O histórico carrega fatias de mensagens de forma instantânea. A rolagem para cima dispara o carregamento da fatia anterior (`before=timestamp`) sem saltos bruscos no scroll.
  - **Mídias, Áudio & Anexos Multimídia:**
    - Gravador de voz embutido utilizando a MediaRecorder API nativa do navegador com indicador de tempo e botão de cancelamento/envio.
    - Suporte a envio de imagens e documentos (PDF, texto, mídias até 5 MB) convertidos em Data URL com sanitização client-side.
  - **Renderização de Balões (`MessageBubble`):** Suporta modos de visualização ("Grande", "Suave", "Compacto"), estados de mensagem própria (`isMe`), timestamps inteligentes ("Hoje às 14:30"), player de áudio integrado com barra de progresso e modal de zoom para imagens.
  - **Interações Avançadas:**
    - Reações de curtida (`onToggleLike`)
    - Favoritar mensagens para consulta rápida
    - Exclusão permitida com regras de negócio (autor até 24h, moderador ou dono da sala)
    - Denúncia in-chat (`onReportClick`) com modal de justificativa
    - Busca textual intra-chat com navegação por ocorrências (anterior/próxima)
  - **Sidebars & Moderação Hierárquica da Sala (`MembersSidebar.jsx`):**
    - Painel esquerdo colapsável para navegação e alternância rápida entre salas.
    - Painel direito com listagem em tempo real de membros online e offline, organizados por badges hierárquicos:
      - 👑 **Dono da Sala (`Owner`)**: Distintivo dourado tátil com poderes para editar sala, promover/rebaixar moderadores, expulsar membros e transferir posse.
      - 🛡️ **Moderador (`Moderator`)**: Distintivo azul acetinado com permissão para expulsar membros comuns e moderar mensagens.
      - 👤 **Membro Regular (`User`)**: Participante da sala.
    - **Ações de Moderação:**
      - *Promover / Rebaixar*: Dispara `PATCH /api/rooms/:roomId/members/:userId/role`.
      - *Expulsar Membro*: Dispara `DELETE /api/rooms/:roomId/members/:userId` com justificativa opcional e alerta imediato via WebSocket (`member_kicked` e `kicked_from_room`).
      - *Transferência de Dono*: Modal de confirmação segura disparando `POST /api/rooms/:id/transfer-ownership`.
      - *Iniciar Direct*: Atalho direto para iniciar mensagem 1x1 confidencial com qualquer membro da sala.
  - **Ajustes Rápidos (`ChatQuickSettings.jsx`):** Menu popover com sliders táteis para densidade de balões, preferências sonoras de novas mensagens e alternância de tema.

---

### 7. [`Directs.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/pages/Directs.jsx) (Mensagens Diretas 1x1 com Criptografia Ponta a Ponta - E2EE)
- **Para que serve:**
  Hub dedicado a conversas privadas e confidenciais entre dois usuários, com criptografia ponta a ponta (E2EE) ativada por padrão.
- **Como é feito:**
  - **Motor de Chaves Assimétricas (Web Crypto API):**
    - Na inicialização, gera localmente um par de chaves ECDH sobre a curva P-256 e armazena a chave privada de forma segura no dispositivo.
    - Registra a chave pública no backend via `PUT /api/directs/keys` em formato JSON Web Key (JWK).
    - Para conversar com outro usuário, busca a chave pública do interlocutor via `GET /api/directs/keys/:userId` e deriva um segredo simétrico compartilhado via HKDF.
  - **Cifragem & Decifragem Local (AES-GCM-256):**
    - Toda mensagem (texto e anexo) é cifrada no navegador com chave AES-GCM de 256 bits e IV aleatório de 12 bytes.
    - O conteúdo trafega e é persistido no servidor exclusivamente dentro do envelope opaco `e2ee:v1:IV_Base64:Ciphertext_Base64`. O backend opera de forma cega, sem acesso às chaves de decifragem.
    - O destinatário recebe o envelope via WebSocket (`receive_direct_message`), decifra o payload localmente com sua chave privada e renderiza o conteúdo descriptografado.
  - **Paginação Baseada em Cursor:**
    - Carregamento de histórico via cursores `before` e `limit`, permitindo rolagem infinita instantânea em conversas extensas.
  - **Gravador de Áudio & Anexos Cifrados:**
    - Suporte a mensagens de áudio gravadas e anexos multimídia (até 5MB) que são criptografados antes do envio.
  - **Estado & Gerenciamento:**
    - Lista de conversas ativas (`conversations`), conversa selecionada (`activeConversation`), mensagens carregadas (`messages`) e busca de contatos via [`NewDirectMessageModal.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/NewDirectMessageModal.jsx).
    - Mecanismo anti-duplicação: rastreia IDs únicos temporários e definitivos, impedindo mensagens duplicadas em conexões instáveis.
  - **Ações da Conversa:**
    - Exclusão de mensagens próprias via menu contextual.
    - Remoção ou ocultação de conversas pelo endpoint `DELETE /api/directs/conversations/:id`.
    - Atalho para favoritar a conversa diretamente pelo cabeçalho do chat.
  - **Design Tátil:** Layout bifásico responsivo em `.skeuo-card` com avatares com anel de status online verde, balões com acabamento glossy e feedback tátil em botões.

---

### 7. `Favorites.jsx` (Central de Favoritos)
- **Para que serve:**
  Área de curadoria e acesso rápido onde o usuário encontra todas as salas e conversas diretas que marcou com estrela.
- **Como é feito:**
  - **Abas de Filtragem Tátil:** Alternância com botões côncavos entre:
    - *Todos*: Visão unificada com contagem total.
    - *Salas*: Filtro exclusivo para salas de chat temáticas favoritadas.
    - *Conversas*: Filtro exclusivo para conversas privadas 1x1.
  - **Integração REST:**
    - Carrega dados persistidos via `GET /api/favorites`.
    - Remoção instantânea de favoritos através de `DELETE /api/favorites/:itemType/:itemId`.
  - **Ações Diretas:** Cards com botões táteis "Entrar na Sala" ou "Abrir Conversa", redirecionando instantaneamente para `/chat?room=...` ou `/directs?conversation=...`.

---

### 8. `Custom.jsx` (Personalização do Perfil)
- **Para que serve:**
  Permite ao usuário customizar sua identidade visual no ecossistema (foto de exibição, nome público e bio/status).
- **Como é feito:**
  - **Estado & Manipulação de Arquivos:** Carrega dados salvos do `localStorage` e utiliza um `FileReader` vinculado a um input escondido (`fileInputRef`) para processar imagens selecionadas.
  - **Preview em Tempo Real:** Exibe um avatar skeuomórfico dinâmico que reflete instantaneamente a nova imagem antes mesmo de salvar.
  - **Propagação de Eventos:** Ao salvar, dispara `window.dispatchEvent(new Event('profileUpdated'))`, fazendo com que a Navbar e os avatares em todas as páginas atualizem sem refresh.

---

### 9. `Feedback.jsx` (Central de Feedback dos Usuários)
- **Para que serve:**
  Canal oficial para envio de sugestões, relatos de bugs, elogios e ideias de melhorias diretamente para a equipe de moderação.
- **Como é feito:**
  - **Cabeçalho com Pílula Tátil:** Envolto em `.skeuo-card` com badge tátil de relevo e ícone `MessageSquarePlus`.
  - **Seleção Interativa:** Placa lateral `.skeuo-card` com 4 botões táteis (`sugestao`, `erro`, `elogio`, `ideia`) estilizados com `.skeuo-surface-orb-badge` e transições dinâmicas ao selecionar.
  - **Área de Anexos em Cavidade:** Implementa `.skeuo-well` com drag-and-drop responsivo, limite de até 3 imagens e conversão assíncrona para Base64.
  - **Submissão:** Dispara `POST /api/feedbacks` com severidade calculada automaticamente e overlay de sucesso animado com opção de novo envio.

---

### 10. `Settings.jsx` (Preferências & Sistema de Temas)
- **Para que serve:**
  Permite configurar a estética global e acessibilidade da interface.
- **Como é feito:**
  - **Gerenciamento de Temas:**
    - Modo de cor: Claro (`light`) ou Escuro (`dark`) aplicando a classe `.dark` em `document.documentElement`.
    - Cores de destaque: Azul, Verde, Roxo, Vermelho e Slate, alterando classes dinâmicas no `document.body`.
    - Fundos de céu Frutiger Aero: opções como `bg-classic-blue`, `bg-smooth-gradient` e `bg-clean-light`.
  - **Acessibilidade & Ergonomia:** Toggles táteis para densidade de layout ("Compacto" vs. "Confortável"), ativação de acabamento glossy, sombras profundas e micro-animações.
  - **Sincronização:** Todas as alterações disparam o evento customizado `themeUpdated`.

---

### 11. `Suporte.jsx` (Central de Ajuda)
- **Para que serve:**
  Página de suporte com perguntas frequentes, busca de tópicos de ajuda, canais de contato e transparência de moderação.
- **Como é feito:**
  - **Header Skeuomórfico:** Cartão com título de alto impacto e campo de busca côncavo `.skeuo-input` com bordas arredondadas.
  - **FAQ Acordeão:** Seção interativa onde o clique alterna o estado `faqOpen`, exibindo respostas explicativas com transição suave.
  - **Quadro de Transparência:** Cartões `.skeuo-card` listando salas suspensas ou banidas por violação de termos de uso e atalhos para abertura de tickets.

---

### 12. `About.jsx` (Sobre o Projeto)
- **Para que serve:**
  Apresenta a história do projeto, suas motivações acadêmicas, visão de design e a equipe de desenvolvedores.
- **Como é feito:**
  - **Aero Backgrounds:** Orbes coloridos com desfoque gaussiano profundo (`blur-3xl`) posicionados de forma absoluta no fundo.
  - **Hero Tridimensional:** Painel translúcido em ângulo de perspectiva contendo badge de projeto acadêmico e mockup interativo de um chat de Campina Grande.
  - **Grade de Cards Informativos (`InfoCard`):** Destaca os pilares do sistema (Segurança, WebSocket em Tempo Real, Design Skeuomórfico e Comunidade) com animações escalonadas (`staggered fade-in`).

---

### 13. `AdminLogin.jsx` (Login Administrativo)
- **Para que serve:**
  Portão de acesso exclusivo para moderadores e administradores da plataforma.
- **Como é feito:**
  - **Estrutura:** Card compacto `.skeuo-card` exibindo o emblema vetorial de segurança (`/admin_shield.svg`) com efeito de escala no hover.
  - **Segurança:** Autenticação via senha mestre no endpoint `POST /api/admin/auth`. Em caso de sucesso, armazena `admin_token` e redireciona para a rota protegida `/admin`.

---

### 14. `Admin.jsx` (Painel Administrativo & Moderação)
- **Para que serve:**
  Console central para gestão de segurança, usuários, salas, denúncias, banimentos e feedbacks recebidos.
- **Como é feito:**
  - **Guarda de Rota:** Envolvido por `<AdminRoute>`, validando a existência e autorização do `admin_token`.
  - **Estatísticas em Tempo Real:** Carrega indicadores de usuários totais, salas abertas, denúncias pendentes e banimentos ativos a partir de `GET /api/stats`.
  - **Navegação em Abas:**
    - `denuncias`: Análise de infrações, mensagens reportadas, visualização de prints anexados em modal e aplicação de penalidades.
    - `usuarios`: Listagem de cadastros, gerenciamento de permissões/cargos e revogação de acessos.
    - `salas`: Moderação de salas ativas, encerramento forçado ou alteração de visibilidade.
    - `banimentos`: Gestão e histórico de punições com justificativas editáveis.
    - `feedbacks`: Triagem dos feedbacks enviados pela comunidade com filtros por severidade.

---

### 15. `ButtonsTest.jsx` (Laboratório de Design & Componentes)
- **Para que serve:**
  Ambiente de desenvolvimento e showcase de todos os tokens e componentes do **Skeuomorphic Design System (SDS)**.
- **Como é feito:**
  - Renderiza uma bancada completa de testes:
    - Badges de cargos (`skeuo-badge-dono`, `skeuo-badge-mod`, `skeuo-badge-online`, etc.)
    - Variações de botões (`skeuo-btn-primary`, `btn-secondary-glossy`, `skeuo-btn-danger`, `skeuo-btn-metallic`, `skeuo-btn-aqua-pill`)
    - Inputs côncavos, controles deslizantes, radio buttons e checkboxes com relevo físico
    - Simulador de chat interativo com balões e reações para validação visual em modo Claro e Escuro.

---

### 16. `NotFound.jsx` (Página 404)
- **Para que serve:**
  Captura rotas inválidas ou salas inexistentes, oferecendo navegação de resgate intuitiva.
- **Como é feito:**
  - **Elementos:** Painel centralizado `.skeuo-panel` com bússola 3D em esfera espelhada, tipografia `404` em tamanho display e botões de retorno inteligente (`Voltar ao Início` ou `Ir para Salas`).

---

## 🔔 Central de Notificações & Menu de Perfil do Usuário

A aplicação conta com um pipeline global e reativo de notificações em tempo real e gerenciamento visual de identidade, orquestrado através do `NotificationContext` e componentes desacoplados:

### 1. [`NotificationContext.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/context/NotificationContext.jsx) (Gerenciador de Estado Global)
- **Escuta Contínua via Socket.io**: Conecta ouvinte no evento `new_notification`, adicionando novos avisos ao topo da lista sem recarregar a interface.
- **Persistência & Cache Local**: Sincroniza a lista e o contador com a API REST (`GET /api/notifications`) e mantém cache no `localStorage` para carregamento instantâneo.
- **Feedback Sonoro Tátil**: Dispara bips sonoros suaves em formato Web Audio para alertar sobre novas mensagens diretas ou menções.
- **Operações em Lote**: Expõe métodos assíncronos `markAsRead(id)`, `markAllAsRead()` e `clearAll()` para consumo por qualquer componente filho.

### 2. [`NotificationsDropdown.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/NotificationsDropdown.jsx) (Menu Interativo na Navbar)
- Emblema em formato de sino com anel de foco tátil e badge vermelho com legibilidade tipográfica calibrada (sem sombras obstrutivas) exibindo a contagem de não lidas (`unreadCount`).
- Popover suspenso com abas de filtro ("Todas", "Não Lidas", "Sistema"), lista rolável em cavidade `.skeuo-well`, botões de ação rápida para marcar como lida e atalhos para redirecionamento contextuais (ex: abrir conversa no Direct).

### 3. Menu Suspenso de Perfil (`UserMenuDropdown` em [`Navbar.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/Navbar.jsx))
- **Avatar com Orbe Tátil**: Borda gradiente celeste com iluminação interna (`inset`), brilho difuso e **diodo indicador de presença em LED verde** (`bg-emerald-500`) indicando status ativo em tempo real.
- **Hierarquia Visual**: Exibição centralizada do nome completo, e-mail e badge de status/cargo, com transição suave e atalhos para `/custom`, `/settings`, `/favorites` e logout seguro.

### 4. [`NotificationToastContainer.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/NotificationToastContainer.jsx) (Banners Flutuantes)
- Renderiza toasts translúcidos com visual Frutiger Aero no canto superior direito da tela com temporizador automático de saída e botão de fechamento manual.

---

## 🧩 Componentes Globais Reutilizáveis

| Componente | Arquivo | Responsabilidade |
| :--- | :--- | :--- |
| **Navbar** | [`src/components/Navbar.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/Navbar.jsx) | Barra de navegação principal com logo líquido, pesquisa global, links para Salas, Directs e Favoritos, status de conexão Socket e menu suspenso de perfil. |
| **MembersSidebar** | [`src/components/MembersSidebar.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/MembersSidebar.jsx) | Painel de moderação e presença de membros na sala, com badges de Dono, Mod e Membro, modais de promoção, expulsão e transferência de posse. |
| **ChatSidebar** | [`src/components/ChatSidebar.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/ChatSidebar.jsx) | Painel lateral colapsável para alternância rápida entre salas de conversa ativas. |
| **NewDirectMessageModal** | [`src/components/NewDirectMessageModal.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/NewDirectMessageModal.jsx) | Modal com campo de busca com debounce para localizar contatos e iniciar chats privados 1x1. |
| **OtpCodeInput** | [`src/components/common/OtpCodeInput.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/common/OtpCodeInput.jsx) | Seletor de slots numéricos para códigos OTP (6 ou 8 dígitos) com avanço automático, tecla backspace, colagem e timer de 60s. |
| **NotificationsDropdown** | [`src/components/NotificationsDropdown.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/NotificationsDropdown.jsx) | Dropdown de notificações com abas, contagem em tempo real e ações de leitura. |
| **NotificationToastContainer** | [`src/components/NotificationToastContainer.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/NotificationToastContainer.jsx) | Gerenciador de toasts flutuantes translúcidos com visual Frutiger Aero. |
| **ChatQuickSettings** | [`src/components/ChatQuickSettings.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/ChatQuickSettings.jsx) | Painel popover para controle de densidade visual de balões (Compacto/Confortável/Grande) e som. |
| **SkyBackground** | [`src/components/SkyBackground.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/SkyBackground.jsx) | Fundo dinâmico com iluminação volumétrica, gradientes celestes e orbes de vidro animados. |
| **SkeuoLoading** | [`src/components/SkeuoLoading.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/SkeuoLoading.jsx) | Indicador de carregamento tátil skeuomórfico com pulso acetinado. |
| **UserAvatar** | [`src/components/UserAvatar.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/UserAvatar.jsx) | Componente atômico de avatar com fallback para inicial e anel de status. |
| **Footer** | [`src/components/Footer.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/Footer.jsx) | Rodapé institucional com links, status dos serviços e créditos acadêmicos. |
| **CookieBanner** | [`src/components/CookieBanner.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/CookieBanner.jsx) | Banner de conformidade de privacidade LGPD/GDPR com botões táteis de aceite. |
| **PrivateRoute** | [`src/components/PrivateRoute.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/PrivateRoute.jsx) | Guarda de rotas autenticadas que redireciona visitantes deslogados para `/login`. |
| **AdminRoute** | [`src/components/AdminRoute.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/components/AdminRoute.jsx) | Guarda de rotas administrativas que exige token de autorização específico de admin. |

---

## 🧪 Estratégia de Testes Automatizados (Vitest)

O frontend implementa uma suíte de testes robusta utilizando [Vitest](https://vitest.dev/) e [React Testing Library](https://testing-library.com/):

```bash
# Executar todos os testes automatizados do frontend (execução única)
npm test -- --run

# Executar testes em modo watch (re-execução em edições)
npm run test:watch
```

### Cobertura da Suíte (19 Arquivos, 128 Testes 100% Aprovados):
1. **[`auth.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/auth.test.jsx)** (8 testes): Formulários de login e cadastro, medidor de força de senha, persistência de token JWT e redirecionamento.
2. **[`otp.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/otp.test.jsx)** (7 testes): Componente `OtpCodeInput`, avanço de foco entre slots, backspace, suporte a colar código (paste) e timer regressivo de 60s.
3. **[`logout.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/logout.test.jsx)** (6 testes): Rotina resiliente de logout com timeout defensivo de 2.000ms via `Promise.race`, desconexão limpa de WebSocket, expurgo estrito de chaves locais e disparo de `profileUpdated`.
4. **[`e2ee.test.js`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/e2ee.test.js)** (8 testes): Motor criptográfico da Web Crypto API: geração de par ECDH P-256, exportação/importação JWK, derivação HKDF, cifragem/decifragem AES-GCM e envelopes `e2ee:v1:...`.
5. **[`directs-e2ee.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/directs-e2ee.test.jsx)** (7 testes): Integração de mensagens diretas E2EE, troca de chaves com a API REST, despacho de envelopes cifrados e decifragem em tempo real.
6. **[`Directs.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/Directs.test.jsx)** (8 testes): Listagem de conversas, envio de mensagens diretas, deduplicação, busca de contatos e remoção de conversas.
7. **[`attachments.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/attachments.test.jsx)** (6 testes): Validação de tipos de arquivo, limites de payload (5 MB), sanitização e player de áudio nativo.
8. **[`chat-history.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/chat-history.test.jsx)** (7 testes): Paginação de mensagens por cursor (`before`, `since`, `limit`), preservação da posição de scroll e carregamento incremental.
9. **[`chat.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/chat.test.jsx)** (7 testes): Envio de mensagens, edição, exclusão hierárquica, criptografia e abertura de Direct a partir de membro.
10. **[`Favorites.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/Favorites.test.jsx)** (5 testes): Listagem de favoritos, filtros por abas ("Salas" e "Conversas") e ação de desfavoritar.
11. **[`Notifications.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/Notifications.test.jsx)** (4 testes): Notificações recebidas, alternância de abas de filtro e marcação de leitura.
12. **[`Rooms.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/Rooms.test.jsx)** (5 testes): Lobby de salas, estatísticas da API, filtros de categoria, modais de criação e tratamento de falhas.
13. **[`MembersSidebar.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/MembersSidebar.test.jsx)**: Renderização de insígnias de moderação, botões de kick e promoção de cargos.
14. **[`ChatSidebar.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/ChatSidebar.test.jsx)**: Alternância rápida e renderização de salas ativas.
15. **[`PrivateRoute.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/PrivateRoute.test.jsx)** (3 testes): Proteção de rotas autenticadas e redirecionamento de usuários deslogados.
16. **[`ForgotPassword.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/ForgotPassword.test.jsx)** (5 testes): Validação de formulário de recuperação de senha com código numérico OTP de 8 dígitos e Supabase Auth.
17. **[`Home.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/Home.test.jsx)**: Renderização da landing page, títulos de alto impacto e alternância de botões CTA conforme estado de login.
18. **[`Footer.test.jsx`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/Footer.test.jsx)** (6 testes): Renderização institucional, ano corrente e links de navegação.
19. **[`api.test.js`](file:///home/lucasramos/Documentos/WebChat/frontend/src/tests/api.test.js)** (8 testes): Interceptação de tokens Bearer, injeção de cabeçalhos e expiração automática de sessão.

---

## 🎨 Design Tokens & Classes Principais

| Classe CSS | Propósito | Efeito Visual |
| :--- | :--- | :--- |
| `.skeuo-card` | Placa de conteúdo principal | Fundo translúcido com `backdrop-blur`, chanfro superior branco e sombra difusa |
| `.skeuo-well` | Cavidade entalhada | Sombra interna profunda (`inset`), borda superior escura e relevo rebaixado |
| `.skeuo-input` | Campos de formulário | Efeito côncavo tátil com anel de foco azul acetinado |
| `.skeuo-btn-primary` | Botões de ação principal | Gradiente azul vivo com brilho superior e sombra de clique físico |
| `.btn-secondary-glossy` | Botões neutros/secundários | Efeito de vidro acetinado com alta luminosidade no hover |
| `.skeuo-surface-orb-badge` | Badges circulares de ícones | Orbe esférico com reflexo especular superior |

---

## 🚀 Como Executar o Projeto Localmente

```bash
# 1. Navegue até a pasta do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# 4. Para validar a compilação de produção
npm run build
```
