# Planejamento de Refatoração CSS (Arquitetura Híbrida)

O **SkyRipple** adota uma arquitetura híbrida de estilos. A estrutura e o posicionamento simples são delegados ao **Tailwind CSS 4**, enquanto as regras visuais, animações e componentes complexos são delegados ao **CSS Semântico**.

Para manter o projeto organizado e altamente escalável, os arquivos CSS semânticos devem seguir a separação rigorosa de responsabilidades detalhada abaixo.

---

## 1. `index.css` (Raiz e Configurações Globais)

O arquivo `index.css` atua exclusivamente como a espinha dorsal de configuração do projeto Vite/React. Ele é o ponto de entrada das variáveis base e do Tailwind.

**O que DEVE ir para o `index.css`:**

- **Diretivas do Tailwind:** `@import "tailwindcss";` ou equivalentes.
- **Variáveis CSS (`:root`):** Definição de paletas globais (`--primary-main`, `--bg-color`) usadas por todo o sistema.
- **Resets e Tags Base:** Regras aplicadas diretamente a tags globais como `html`, `body`, `*`, `::selection` e a customização nativa da scrollbar (caso seja global).
- **Importações:** Pode conter `@import` de outros arquivos CSS se for a arquitetura escolhida.

**O que NÃO deve ir para cá:**

- Classes de componentes UI (ex: `.skeuo-btn`, `.skeuo-nav`) — elas devem ir para o `skeuo.css` ou similares. Se estiverem aqui, *devem ser movidas na refatoração*.
- Animações ou estilos de texto.

---

## 2. `skeuo.css` (Identidade Visual e Componentes Globais)

O arquivo `skeuo.css` é o coração da identidade visual Web 2.0 / Frutiger Aero do projeto. Nele devem residir todos os estilos globais aplicados a componentes que se repetem em toda a aplicação.

**O que DEVE ir para o `skeuo.css`:**

- **Classes estruturais de UI:** `.skeuo-btn`, `.skeuo-panel`, `.skeuo-card`, `.skeuo-input`.
- **Gloss e Efeitos 3D:** Gradientes complexos (`linear-gradient`), sombras de profundidade (`box-shadow` e `inset shadows`) e bordas brilhantes.
- **Efeitos de Vidro (Glassmorphism):** Regras de `backdrop-filter: blur()`, fundos semitransparentes globais (`rgba`).
- **Estados Visuais Globais:** Comportamento de `:hover`, `:active` (como efeito de pressionar botão) e `:disabled` para os botões e inputs base.
- **Transições Visuais Padrão:** Transições suaves de *background*, *border-color* e *box-shadow* de elementos globais.

**O que NÃO deve ir para cá:**

- Cores de texto simples (delegar para `text.css`).
- Estrutura de grid ou flexbox (delegar para Tailwind).
- Estilos exclusivos de uma única página.

---

## 3. `text.css` (Tipografia e Cores de Texto)

O arquivo `text.css` cuida exclusivamente da leitura e do contraste do texto, separando a tipografia das regras estruturais ou visuais complexas.

**O que DEVE ir para o `text.css`:**

- **Tipografia Base:** Classes como `.hero-title`, `.section-title`, `.label-text` e afins.
- **Cores de Texto (Light / Dark Mode):** A lógica global de como textos, parágrafos e subtítulos se comportam no modo escuro (`html.dark .text-body`).
- **Sombra em Textos:** O uso de `text-shadow` para melhorar a legibilidade em fundos vibrantes.
- **Font-Family Customizadas:** Definições ou importações de fontes específicas.

**O que NÃO deve ir para cá:**

- Alinhamento de texto (`text-center` ou `text-left`) ou tamanho absoluto flexível — isso deve ser resolvido por utilitários Tailwind (ex: `text-xl`).

---

## 4. `animations.css` (Movimento e Fluidez)

O `animations.css` age como a biblioteca central de movimento. Centralizar as animações evita a repetição de `keyframes` complexos por vários arquivos.

**O que DEVE ir para o `animations.css`:**

- **Declarações de Keyframes:** `@keyframes fade-in`, `@keyframes slide-up`, `@keyframes pop-in`.
- **Classes Utilitárias de Animação:** `.animate-fade-in`, `.animate-bounce-slow`, `.animate-pulse-glow`.
- **Transições de Tema Globais:** Regras de `transition` aplicadas globalmente para suavizar a troca do modo Claro para o Escuro.

**O que NÃO deve ir para cá:**

- Transições simples de `:hover` em um botão isolado (isso pertence ao `skeuo.css` ou ao CSS da própria página).

---

## 5. CSS Próprio da Página (ex: `feedback.css`, `chat.css`)

Cada página ou bloco complexo do sistema deve possuir seu CSS específico para isolar regras que **não farão sentido em nenhum outro lugar** do site.

**O que DEVE ir para o CSS próprio da página:**

- **Nomenclatura Escopada:** Classes que fazem sentido apenas ali (ex: `.feedback-success-overlay`, `.chat-message-bubble`).
- **Cores Estilizadas Específicas:** Um sistema de cores único (como os cards verde, azul e vermelho no Feedback).
- **Posicionamento Relativo/Absoluto Complexo:** Overlays e posicionamentos cirúrgicos (como o menu de 3 pontinhos das mensagens no chat) que não são possíveis apenas com utilitários tailwind base.
- **Ajustes de Dark Mode Exclusivos:** Regras exclusivas para o dark mode dos componentes da referida página (ex: `html.dark .feedback-type-sugestao`).

**O que NÃO deve ir para cá:**

- Animações como `@keyframes fade-in` (deve usar as do `animations.css`).
- Estilos de painéis ou botões genéricos (deve usar os do `skeuo.css`).

---

## 6. admin.css (Página de Administração)

O arquivo `admin.css` isola os estilos visuais complexos da página de Administração, separando a lógica estrutural (Tailwind) dos detalhes visuais ricos.

**O que DEVE ir para o `admin.css`:**

- **Backgrounds e Cores:** Estilos de painéis (`.admin-page-bg`, `.admin-details-box`), textos (`.admin-text-muted`) e cores de ícones (`.admin-icon-box-*`).
- **Glow e Blur:** O efeito de brilho nos cartões de status (`.admin-card-glow-*`) e o blur dos overlays modais (`.admin-modal-overlay`).

**O que NÃO deve ir para cá:**

- Layout, Flex, Margens, Gap ou Grid (devem permanecer no `Admin.jsx` como Tailwind 4).

---

## 7. Componentes Globais Independentes (`navbar.css`, `footer.css`, `sidebar.css`, etc.)

Arquivos CSS que definem blocos estruturais reutilizáveis que ficam presentes em múltiplas rotas. Eles combinam Layout com a identidade visual skeuomórfica.

- **`navbar.css`, `sidebar.css` e `footer.css`:** Mantêm o estilo e comportamento de vidro (`backdrop-filter`) ou degradês sólidos dos menus de navegação mestre. Não migrar posições complexas de *dropdowns* ou menus contextuais para o Tailwind puro.
- **`loading.css`:** Concentra spinners (telas de carregamento) globais ou componentes isolados de espera (como *skeletons*). Pode usar utilitários para posicionamento, mas a animação do loader deve vir do CSS.
- **`avatar.css`:** Lida com recortes de imagem (border-radius redondos complexos), overlays de status ("online/offline") e molduras, garantindo a consistência dos avatares no chat e no perfil.

---

## 8. CSS de Telas Específicas (Funcionalidades Isoladas)

Assim como o `admin.css` e `feedback.css`, as páginas abaixo possuem seus próprios arquivos de estilo. Siga a regra de ouro: **Tudo que é visual (glass, gradiente, hover complexo) fica no CSS. Tudo que é estrutura (flex, grid, padding) migra para o Tailwind no `.jsx`.**

- **`rooms.css` (Página Rooms.jsx):** Controla o layout dos cartões de salas. Efeitos de "vidro e brilho" nos cartões ficam aqui, mas as *grids* de exibição (`grid-cols-2`, `gap-4`) devem estar no JSX.
- **`settings.css` (Página Settings.jsx):** Controla a navegação por abas lateral. Os estados de hover das abas inativas e cores de seleção da aba ativa pertencem a este CSS.
- **`profile.css` (Página Profile.jsx):** Componentes de banner de perfil, sobreposições de imagens e cards de estatísticas do usuário.
- **`suporte.css` (Página Suporte.jsx):** Visualização e espaçamentos finos dos formulários de tickets ou chats com atendentes/robôs.
- **`about.css` (Páginas Institucionais):** Layout de textos longos (Termos de Uso, Documentação, Política de Privacidade). Apenas estilos únicos dos *cards* de apresentação ficam aqui.
- **`auth.css` (Páginas Login/Register.jsx):** Formulários de autenticação. Os efeitos de foco dos inputs (`box-shadow`, transições) devem permanecer em CSS.
- **`home.css` (Landing Page):** Elementos visuais únicos da página inicial para não pesar outras rotas do site.
- **`not-found.css` (Página 404):** Estilos do erro de página não encontrada.

---

## 9. Plano de Execução Passo a Passo (Workflow de Refatoração)

Para colocar essa arquitetura em prática nos arquivos atuais (ou em novas telas), siga a ordem abaixo, garantindo que o visual não quebre durante a transição:

---

## Estratégia de Implementação (Passo a Passo)

### Passo 1: Mapeamento e Auditoria

- Escolha um arquivo alvo para refatoração (ex: `feedback.css`, `navbar.css`, ou `chat.css`).
- Analise o arquivo linha por linha identificando: O que é texto? O que é animação? O que é efeito global skeuomórfico? O que é específico da tela?

### Passo 2: Centralização de Movimento (`animations.css`)

- Extraia qualquer `@keyframes` do arquivo alvo e mova para `animations.css`.
- Extraia classes de animação genéricas (ex: `.fade-in`, `.slide-up`) e coloque em `animations.css` usando prefixos como `.animate-fade-in`.

### Passo 3: Centralização Tipográfica (`text.css`)

- Remova regras de `font-family`, cor de texto base ou `.hero-title` do CSS específico e leve para `text.css`.
- Garanta que as variações do Dark Mode para esse texto (`html.dark .minha-classe-texto`) também sejam migradas.

### Passo 4: Centralização do Skeuomorfismo (`skeuo.css`)

- Identifique classes que criam botões, painéis, inputs ou cards que poderiam ser reaproveitados (ex: `.meu-botao-lindo`).
- Renomeie-os para o padrão global (ex: `.skeuo-btn`) e mova as regras de `background`, `border`, `box-shadow` e `backdrop-filter` para `skeuo.css`.
- Não se esqueça de mover os estados `:hover`, `:active` e `:disabled`.

### Passo 5: Isolamento do CSS Específico da Página

- O que sobrou no arquivo original? Deve sobrar apenas o que é único da página (ex: `.feedback-success-overlay`).
- Verifique se as classes têm nomes autoexplicativos e com prefixo da página (ex: `.feedback-`, `.chat-`, `.navbar-`).

### Passo 6: Troca Estrutural para Tailwind (JSX)

- Abra o componente `.jsx` atrelado a esse CSS.
- Substitua as classes antigas pelas novas classes globais (ex: trocar `.meu-botao-lindo` por `.skeuo-btn`).
- Mova regras de layout puras (ex: `display: flex`, `margin-top: 10px`, `width: 100%`) que ainda estejam no CSS para utilitários do Tailwind (`flex`, `mt-2.5`, `w-full`) diretamente no JSX.

### Passo 7: Validação e Teste

- Confira se a interface no **Modo Claro** está fiel ao original.
- Acione o **Modo Escuro** (`html.dark`) e veja se as cores não "quebraram" com a migração.
- Verifique a responsividade (se os utilitários do Tailwind não conflitaram com larguras estritas do CSS).
- Execute o build (`npm run build`) e se certifique que a compilação do Vite processa corretamente os arquivos.
