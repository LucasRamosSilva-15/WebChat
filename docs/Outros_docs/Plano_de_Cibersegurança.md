# Plano Detalhado de Cibersegurança: SkyRipple WebChat

Este documento descreve as diretrizes, estratégias e ações recomendadas para proteger a infraestrutura e a aplicação web **SkyRipple**, que utiliza a stack: **React (Vite), Node.js (Express), Socket.IO e Supabase**.

A segurança de uma aplicação em tempo real exige não apenas a proteção das rotas REST tradicionais, mas também uma validação estrita da comunicação via WebSocket e das regras do banco de dados (Row Level Security).

---

## 🔴 Fase 1: Prioridade Alta (Medidas Críticas e Imediatas)

Estas medidas fecham as vulnerabilidades mais perigosas e devem ser obrigatoriamente aplicadas antes de qualquer deploy em produção.

### 1. Autenticação e Autorização Robusta

#### 1.1 Arquitetura de Banco de Dados Centralizada no Node.js (Supabase RLS Desativado)

O projeto utiliza um **Backend Próprio em Node.js** que gerencia toda a autenticação via `bcrypt` (para senhas) e gera os próprios tokens `jsonwebtoken` (JWT). O Supabase é utilizado exclusivamente como um Banco de Dados (Database as a Service), sendo acessado apenas pelo Backend.

- **Ação Recomendada:** O Row Level Security (RLS) do Supabase deve permanecer **desativado**. Ativá-lo quebraria o sistema, pois o Node.js consulta os dados usando a `ANON_KEY` sem estar atrelado ao sistema de autenticação nativo do Supabase. Toda a responsabilidade de autorização (quem pode ler/escrever o quê) recai sobre os middlewares do Express.
- **Implementação (Script para o SQL Editor):**

  ```sql
  -- Desativar RLS para permitir que o Node.js atue como gerenciador absoluto
  ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.rooms DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.room_members DISABLE ROW LEVEL SECURITY;
  ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
  ```

#### 1.2 Segurança no Socket.IO (Validação de Handshake)

Atualmente, qualquer um pode se conectar ao servidor WebSocket do projeto sem se identificar.

- **Ação:** Implementar um middleware que verifique o token JWT *antes* de estabelecer a conexão Socket.
- **Implementação (Exemplo no backend):**

  ```javascript
  // No server.js ou arquivo de configuração do socket
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Erro de Autenticação: Token não fornecido"));
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error("Erro de Autenticação: Token inválido"));
      socket.user = decoded; // Salva o usuário no socket
      next();
    });
  });
  ```

#### 1.3 Gerenciamento Seguro de Tokens (JWT)

Evite armazenar tokens JWT de acesso (vida longa) no `localStorage`, pois ficam vulneráveis a ataques de **XSS** (Cross-Site Scripting).

- **Estratégia Recomendada:** Se possível, envie o token via *HTTPOnly Cookies* a partir do backend. Caso precise manter no cliente usando o SDK do Supabase, limite o tempo de expiração do *Access Token* (ex: 15 minutos) e utilize *Refresh Tokens* invisíveis ao usuário.

---

## 🟡 Fase 2: Prioridade Média (Arquitetura, APIs e Defesa)

Essas medidas criam barreiras contra abusos, spam e roubo de dados.

### 2. Defesa Contra Força Bruta e Abusos (Rate Limiting)

#### 2.1 Limitação de Requisições REST (Node.js)

Rotas de `/login` e `/register` são os principais alvos de bots tentando quebrar senhas.

- **Ação:** Instalar `express-rate-limit`.
- **Implementação:**

  ```javascript
  const rateLimit = require('express-rate-limit');

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limita a 5 requisições por IP na janela de tempo
    message: "Muitas tentativas de login. Tente novamente mais tarde."
  });
  
  app.use('/api/auth/login', authLimiter);
  ```

#### 2.2 Rate Limiting de Mensagens no WebSocket

Um atacante pode enviar 1.000 mensagens por segundo via socket travando os clientes conectados.

- **Ação:** Limitar os eventos de `sendMessage` no `io.on`. Armazenar um timestamp na memória e impedir disparos em menos de `500ms` do mesmo usuário.

### 3. Proteção Contra Cross-Site Scripting (XSS)

Como um WebChat renderiza conteúdo gerado pelo usuário frequentemente, a validação do texto é essencial.

- **Ação:** Mesmo o React mitigando XSS naturalmente (`{message}` não renderiza tags HTML), se a gente estiver pretendendo no futuro usar algo como Markdown ou links interativos (ex: `dangerouslySetInnerHTML`), é obrigatório o uso do **DOMPurify**.
- **Implementação no Frontend:**

  ```javascript
  import DOMPurify from 'dompurify';
  const cleanMessage = DOMPurify.sanitize(dirtyMessage);
  ```

### 4. Fortalecimento de Cabeçalhos HTTP (Helmet) e CORS

- **Ação 1 (Helmet):** Instale o `helmet` (`npm i helmet`) e ative no topo do Express. Ele impede que o app seja colocado em `iframes` (Clickjacking) e bloqueia MIME sniffing.

  ```javascript
  const helmet = require('helmet');
  app.use(helmet());
  ```

- **Ação 2 (CORS Estrito):** Altere a configuração em produção de `localhost` para exclusivamente `https://skyripple.seudominio.com`.

---

## 🟢 Fase 3: Prioridade Baixa (Privacidade e Manutenção Contínua)

Medidas focadas na escalabilidade, manutenção a longo prazo e infraestrutura isolada.

### 5. Sanitização de Uploads (Imagens e Avatares)

Muitos malwares se disfarçam de imagens (`.jpg` que na verdade é um executável).

- **Medidas:**
  1. Validar a extensão E os *"Magic Bytes"* (assinatura real do arquivo).
  2. Limitar o tamanho do arquivo a um máximo de `5MB` (usando bibliotecas como `multer` e restrições no Storage do Supabase).
  3. Remover os metadados EXIF das imagens, que muitas vezes contêm as **coordenadas de GPS** do smartphone da pessoa que tirou a foto, protegendo a privacidade física do usuário.

### 6. Isolamento das Variáveis de Ambiente

- Garantir que a `SUPABASE_SERVICE_ROLE_KEY` (chave de administração máxima) **NUNCA** chegue ao frontend (ela nunca deve estar em arquivos prefixados com `VITE_`).
- Utilizar apenas a `SUPABASE_ANON_KEY` no front.
- Rodar o backend sem privilégios de root no servidor final de hospedagem.

### 7. Logs de Auditoria (Audit Trails)

Criar mecanismos de log no backend (`winston` ou `pino`) que registrem quando administradores silenciam, banem usuários ou excluem mensagens globais, para evitar abuso de poder e detectar anomalias internas.
