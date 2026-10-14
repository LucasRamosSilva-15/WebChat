# Skeuo Design System - Documentação Técnica e Catálogo da API Visual

Bem-vindo à documentação oficial do **Skeuo Design System (SDS)** utilizado no **SkyRipple (WebChat)**.  
Este documento cataloga a arquitetura visual, os design tokens, as variáveis dinâmicas, as classes CSS ativas e os padrões canônicos de componentes que compõem o sistema tátil e skeuomórfico da aplicação pós-refatoração (Tailwind CSS v4 + Módulos CSS).

---

## 🎨 1. Arquitetura do Design System

A camada de interface do SkyRipple é dividida em dois pilares complementares:

1. **Tailwind CSS v4 (Estrutura e Responsividade):** Utilizado para grids, flexbox, larguras, paddings, alinhamento, gaps e comportamento mobile em toda a aplicação.
2. **Módulos CSS Especializados (Materiais, Chanfros e Profundidade):**
   - [`frontend/src/index.css`](file:///home/lucasramos/Documentos/WebChat/frontend/src/index.css): Tokens globais de cores, temas dinâmicos, texturas de background e scrollbars nativas.
   - [`frontend/src/styles/skeuo.css`](file:///home/lucasramos/Documentos/WebChat/frontend/src/styles/skeuo.css): O núcleo volumétrico (painéis, botões glossy, inputs em cavidade, badges, modais e balões).
   - [`frontend/src/styles/avatar.css`](file:///home/lucasramos/Documentos/WebChat/frontend/src/styles/avatar.css): Anéis luminosos de status de presença e badges de avatares.
   - [`frontend/src/styles/text.css`](file:///home/lucasramos/Documentos/WebChat/frontend/src/styles/text.css): Tipografia com letterpress e chanfros de texto.
   - [`frontend/src/styles/animations.css`](file:///home/lucasramos/Documentos/WebChat/frontend/src/styles/animations.css): Micro-interações, efeitos de pulso, entrada física e shimmer.
   - [`frontend/src/styles/loading.css`](file:///home/lucasramos/Documentos/WebChat/frontend/src/styles/loading.css): Spinners esféricos skeuomórficos e barras de progresso.

---

## 💧 2. Design Tokens e Variáveis Globais (CSS Custom Properties)

As cores primárias da interface se adaptam dinamicamente à escolha do usuário nas Configurações da conta, manipulando as variáveis declaradas no `:root` e nas classes de tema do `body`:

### 2.1 Tema Azul Clássico (Padrão)
| Variável | Valor Padrão | Descrição |
|----------|--------------|-----------|
| `--primary-light` | `#4da4ff` | Tom superior de brilho para botões e balões |
| `--primary-main` | `#0071e3` | Cor principal da marca SkyRipple (Aqua Blue) |
| `--primary-dark` | `#005bb5` | Tom intermediário da parte inferior do gradiente |
| `--primary-darker` | `#004488` | Tom de base e contorno da aresta inferior |
| `--primary-hover-light` | `#66b3ff` | Brilho superior sob estado `:hover` |
| `--primary-hover-main` | `#1a82ff` | Tom central sob estado `:hover` |
| `--primary-hover-dark` | `#006ce6` | Tom inferior sob estado `:hover` |
| `--primary-hover-darker` | `#0055a3` | Base sob estado `:hover` |
| `--primary-ring` | `rgba(0, 113, 227, 0.1)` | Halo de foco translúcido e brilho ambiente |
| `--primary-ring-focus` | `rgba(0, 113, 227, 0.6)` | Anel de foco emissivo (LED) nos inputs e controles |

### 2.2 Temas Alternativos Selecionáveis
- **Verde Esmeralda (`body.color-green`):** `--primary-main: #10b981` (orgânico e relaxante).
- **Roxo Ametista (`body.color-purple`):** `--primary-main: #a855f7` (tecnológico e sofisticado).
- **Rosa Carmim (`body.color-red`):** `--primary-main: #f43f5e` (enérgico e vibrante).
- **Ardósia Grafite (`body.color-slate`):** `--primary-main: #64748b` (sóbrio, monocromático e discreto).

---

## 🖼️ 3. Estilos de Fundo e Texturas de Superfície

Os planos de fundo do SkyRipple oferecem quatro modos táteis:

| Classe / Seletor | Efeito Visual | Uso Recomendado |
|------------------|---------------|-----------------|
| `body` (Neutro Padrão) | `linear-gradient(200deg, #dbeafe 0%, #f1f5f9 100%)` com scanlines a 45° | Padrão da aplicação, amigável e com alto contraste |
| `body.bg-classic-blue` | Gradiente azul Aqua vivo com micro-grade reflexiva de 2px | Experiência imersiva nostálgica Frutiger Aero |
| `body.bg-smooth-gradient` | Gradiente suave de ardósia clara (`#f8fafc` para `#e2e8f0`) | Visual moderno minimalista |
| `body.bg-clean-light` | Fundo sólido acetinado `#f8fafc` | Usuários que preferem ausência de gradientes no fundo |
| `html.dark body` | `radial-gradient` central com luz da cor primária + gradiente `#111827` a `#0f172a` | Modo escuro imersivo estilo OLED |

---

## 🔮 4. Catálogo de Classes Core (`skeuo.css`)

### 4.1 Estrutura e Painéis

#### `.skeuo-panel` e `.skeuo-surface-panel`
- **Descrição:** Painel base envolvente com acabamento em placa de resina translúcida e chanfro duplo.
- **Efeito Visual:**
  - *Light Mode:* Fundo `linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)`, chanfro de luz superior `inset 0 1.5px 0 rgba(255, 255, 255, 0.95)` e sombra de profundidade `0 10px 25px -5px rgba(0, 80, 180, 0.08)`.
  - *Dark Mode:* Fundo `linear-gradient(180deg, rgba(30, 41, 59, 0.85) 0%, rgba(15, 23, 42, 0.85) 100%)`, chanfro `inset 0 1.5px 0 rgba(255, 255, 255, 0.1)` e sombra `0 12px 32px rgba(0, 0, 0, 0.5)`.
- **Aplicação:** Containers principais de páginas institucionais (`Home`, `About`, `Suporte`, `Settings`, `Rooms`).

#### `.skeuo-surface-panel-interactive`
- **Descrição:** Extensão de painel para cartões com resposta tátil a hover.
- **Efeito Visual:** Sob `:hover`, eleva-se suavemente (`transform: translateY(-2px)`) com expansão de sombra `0 20px 40px -8px rgba(0, 80, 180, 0.16)`.

#### `.skeuo-card` e `.skeuo-card-accent`
- **Descrição:** Cartão com raio de curvatura de 28px, borda chanfrada e sombra difusa.
- **Variação `.skeuo-card-accent`:** Adiciona friso superior luminoso tricolor (`#38bdf8` a `#0ea5e9`).
- **Aplicação:** Hero cards de boas-vindas, cards de login, registro, itens de salas e cards informativos de suporte.

#### `.skeuo-well` e `.skeuo-surface-cavity`
- **Descrição:** Superfície rebaixada em baixo-relevo (cavidade entalhada).
- **Efeito Visual:**
  - *Light Mode:* `background: rgba(241, 245, 249, 0.7)`, borda `1px solid rgba(203, 213, 225, 0.75)`, sombras internas `inset 0 1px 3px rgba(15, 23, 42, 0.08), inset 0 2px 6px rgba(15, 23, 42, 0.04)`.
  - *Dark Mode:* `background: rgba(15, 23, 42, 0.6)`, borda `rgba(51, 65, 85, 0.6)`, sombras internas `inset 0 1px 3px rgba(0, 0, 0, 0.4), inset 0 2px 6px rgba(0, 0, 0, 0.2)`.
- **Aplicação:** Displays de telemetria, painéis de métricas, lista de status do sistema e recipientes de controles agrupados.

#### `.skeuo-nav` e `.skeuo-topbar`
- **Descrição:** Barra de navegação com acabamento de alumínio escovado e chanfro luminoso inferior.
- **Aplicação:** Navbar global e cabeçalho de sala ativa no chat.

#### `.skeuo-sidebar`, `.skeuo-sidebar-left`, `.skeuo-sidebar-right`
- **Descrição:** Colunas laterais com chanfros de encaixe mecânico (sombra interna de 1px na divisão).
- **Aplicação:** `ChatSidebar` (salas e navegação lateral) e `MembersSidebar` (lista de membros).

#### `.skeuo-modal-overlay`
- **Descrição:** Máscara de sobreposição com desfoque de fundo (`backdrop-filter: blur(4px)`) para diálogos e modais físicos.

---

### 4.2 Botões e Controles Táteis

#### `.skeuo-btn` e `.skeuo-btn-primary` (Botão Primário Aqua / Gel)
- **Descrição:** O clássico botão gel azul com gradiente dividido no meio (50%/51%), simulando um cilindro líquido tridimensional.
- **Comportamento Físico:**
  - *Repouso:* Gradiente luminoso vertical, borda superior chanfrada `inset 0 1px 1px rgba(255,255,255,0.7)` e base escurecida.
  - *Hover:* O gradiente ganha luminosidade superior.
  - *Active:* O botão afunda mecanicamente na tela com sombra interna escura `inset 0 2px 5px rgba(0,0,0,0.5)` e borda superior escurecida.
- **Texto:** Sempre branco com sombra debossed: `text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3)`.

#### Botão Circular Gel de Ação Rápida
- **Descrição:** Variante esférica do `.skeuo-btn-primary` dimensionada exatamente em 36×36px para integração em barras de busca e cabeçalhos.
- **Classes Recomendadas:** `.skeuo-btn-primary !w-9 !h-9 !p-0 rounded-full inline-flex items-center justify-center text-white shadow-sm`.
- **Aplicação:** Botão de submissão de busca em inputs pill e botões de disparo de ação em linha.

#### `.btn-secondary-glossy` (Botão Secundário Metálico Clássico)
- **Descrição:** Botão metálico cromado (Modo Claro) e grafite escovado (Modo Escuro) com reflexo de luz superior.
- **Comportamento Físico:**
  - *Light Mode:* Gradiente metálico dividido em 50%/51% (`#ffffff` a `#b3b3b3`), contorno `#999`, specular highlight `inset 0 1px 1px rgba(255, 255, 255, 0.9)`.
  - *Dark Mode:* Grafite escuro `linear-gradient(to bottom, #334155, #1e293b 50%, #0f172a 51%, #020617 100%)`.
- **Aplicação:** Botões secundários ("Saiba Mais", "Cancelar", "Enviar Denúncia Anonimamente").

#### `.btn-secondary-modern` / `.btn-secondary-smooth`
- **Descrição:** Variante de transição suave em 45° com bevels atenuados para contextos onde se busca menor contraste metálico.

#### `.btn-white-glossy`
- **Descrição:** Botão em plástico branco perolado com reflexo superior vítreo.
- **Aplicação:** Ações sobre fundos escuros ou cartões com fundo colorido.

#### `.skeuo-btn-danger`
- **Descrição:** Botão gel vermelho / carmim com gradiente cilíndrico de alerta.
- **Aplicação:** Ações destrutivas (excluir sala, remover conta, banir usuário).

#### `.skeuo-icon-btn`
- **Descrição:** Botão circular chanfrado com relevo físico para ícones de utilitários (busca, anexar, fechar, silenciar).

---

### 4.3 Formulários e Entradas

#### `.skeuo-input` e `.skeuo-surface-field`
- **Descrição:** Caixa de entrada de texto com efeito de **cavidade entalhada ("well effect")**.
- **Comportamento Físico:**
  - *Repouso:* Sombra interior cavada `inset 0 2px 5px rgba(0, 0, 0, 0.15)` e chanfro de fundo reflexivo `0 1px 0 rgba(255, 255, 255, 0.9)`.
  - *Focus:* A cavidade se acende com halo neon da cor do tema: `0 0 8px var(--primary-ring-focus)`.
- **Aplicação:** Todos os `<input>`, `<textarea>` e `<select>` da aplicação.

---

### 4.4 Badges de Status, Orbes e Cargos

#### `.skeuo-surface-orb-badge`
- **Descrição:** Cúpula hemisférica convexa em gradiente perlado, utilizada como base para ícones em cards de atalhos e destaques rápidos.
- **Efeito Visual:**
  - `background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%)`
  - `border: 1px solid rgba(203, 213, 225, 0.7)`
  - `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95), 0 2px 5px rgba(15, 23, 42, 0.06)`

#### `.skeuo-surface-avatar-box` e `.skeuo-avatar-badge`
- **Descrição:** Invólucro com gradiente azul translúcido e chanfro superior para avatares e miniaturas de destaque.

#### Tabela de Badges de Cargo e Estado
| Classe | Descrição | Cores no Modo Claro | Cores no Modo Escuro |
|--------|-----------|----------------------|-----------------------|
| `.skeuo-badge` | Badge neutro com relevo | Fundo `#ffffff` a `#f3f4f6` | Fundo `#334155` a `#1e293b` |
| `.skeuo-badge-dono` | Cargo Criador / Dono | Âmbar dourado (`#fbbf24` a `#f59e0b`) | Âmbar escuro (`#b45309`) |
| `.skeuo-badge-mod` | Cargo Moderador | Roxo / Violeta (`#a78bfa` a `#7c3aed`) | Roxo profundo (`#6d28d9`) |
| `.skeuo-badge-vip` | Cargo Usuário VIP | Ciano / Azul celeste (`#38bdf8` a `#0284c7`) | Azul petróleo (`#0369a1`) |
| `.skeuo-badge-online` | Indicador de presença | Verde esmeralda (`#34d399` a `#059669`) | Verde floresta (`#047857`) |
| `.skeuo-badge-ativa` | Status de sala ativa | Verde menta claro | Verde musgo |
| `.skeuo-badge-cheia` | Status de sala lotada | Vermelho alerta suave | Vermelho carmim escuro |
| `.skeuo-badge-arquivada` | Status de sala arquivada | Cinza neutro | Ardósia escuro |

---

### 4.5 Balões de Mensagens (Chat)

- **`.skeuo-bubble-received`:**
  - *Light Mode:* Plástico cinza claro chanfrado com borda `#ccc` e specular highlight superior.
  - *Dark Mode:* Grafite escovado com `inset 0 1px 0 rgba(255,255,255,0.05)`.
- **`.skeuo-bubble-sent`:**
  - *Light Mode:* Gel colorido com luz de cima, chanfro e sombra projetada.
  - *Dark Mode:* Azul atenuado e balanceado (`rgba(0,0,0,0.1)` a `rgba(0,0,0,0.4)` sobre a cor primária), sem causar ofuscamento visual.

---

### 4.6 Utilitários e Feedback Visual

- **`.skeuo-brand`:** Texto com sombra física e efeito de placa metálica gravada.
- **`.skeuo-loading-orb`:** Esfera translúcida de carregamento com brilho líquido.
- **`.skeuo-progress-track` & `.skeuo-progress-fill`:** Barra de progresso mecânica com canaleta cavada e preenchimento emissivo.
- **`.skeuo-tooltip`, `.skeuo-tooltip-arrow`, `.skeuo-tooltip-content`:** Tooltip flutuante tridimensional com seta chanfrada.

---

## ⚡ 5. Módulos Auxiliares de Estilo

1. **`avatar.css`:**
   - `.avatar-ring-online`: Anel verde pulsante indicador de status conectado.
   - `.avatar-badge`: Emblema posicionado com micro-relevo no canto do avatar.
2. **`text.css`:**
   - `.hero-title`: Título com letterpress e entalhe.
   - `.text-letterpress-light`: Sombra branca projetada abaixo para texto claro.
   - `.text-letterpress-dark`: Sombra escura de baixo relevo para texto escuro.
3. **`animations.css`:**
   - `.reveal`: Revelação suave com deslocamento vertical no carregamento da tela.
   - `.skeuo-pulse`: Respiração suave de luz para elementos ativos.
4. **`loading.css`:**
   - Skeleton loaders com gradiente metálico pulsante para estados de carregamento de salas e mensagens.

---

## 📜 6. Scrollbars Nativas Táteis

O sistema padroniza as barras de rolagem nativas sem deixar calhas brancas no Dark Mode:
- **Trilho Transparente:** `::-webkit-scrollbar-track { background: transparent; }`.
- **Thumb Físico Arredondado:** `rgba(0, 0, 0, 0.18)` no Light Mode e `rgba(255, 255, 255, 0.2)` no Dark Mode.
- **Scrollbar Mecânica do Chat (`.chat-container`):** Calha com sombra interna e manipulador deslizante metálico com borda definida.

---

## 🏗️ 7. Padrões Canônicos de Engenharia e Layout

### 7.1 Hero Banner Card com Respiro Anti-Cramping
Ao construir blocos de Hero com título, badge e busca, utilize o cartão `.skeuo-card` com preenchimento generoso (`w-full p-8 md:py-12 md:px-10`), evitando cartões estreitos ou colapsados:

```jsx
<section className="skeuo-card w-full p-8 md:py-12 md:px-10 text-center flex flex-col items-center">
  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100/90 dark:bg-sky-950/60 border border-sky-300/70 dark:border-sky-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,113,227,0.1)] mb-4">
    <Wrench className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
    <span>SUPORTE AO USUÁRIO</span>
  </div>

  <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-sky-600 dark:text-sky-400 mb-4 tracking-tight drop-shadow-sm">
    Central de Ajuda & Suporte
  </h1>
  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
    Encontre respostas imediatas, acompanhe o status operacional ou reporte incidentes.
  </p>

  <form onSubmit={handleSearch} className="relative max-w-xl w-full">
    <input
      type="text"
      placeholder="Como podemos ajudar hoje?"
      className="skeuo-input w-full pl-5 pr-14 py-3.5 text-sm rounded-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
    />
    <button
      type="submit"
      title="Buscar"
      className="skeuo-btn-primary absolute right-1.5 top-1/2 -translate-y-1/2 !w-9 !h-9 !p-0 rounded-full inline-flex items-center justify-center text-white shadow-sm"
    >
      <Search className="w-4 h-4" />
    </button>
  </form>
</section>
```

### 7.2 Regra de Contenção em Listas e Colunas Estreitas (Anti-Overflow)
Em cartões secundários ou colunas com largura reduzida (ex: `max-w-xs` ou colunas de 1/3), itens de texto que competem com badges devem sempre aplicar truncamento flexível e isolar o badge de encolhimento:

```jsx
<li className="flex items-center justify-between gap-2 p-2.5 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50">
  <div className="flex items-center gap-2.5 min-w-0 flex-1">
    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow-sm" />
    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
      Spam / Phishing
    </span>
  </div>
  <span className="shrink-0 text-[11px] px-2 py-0.5 rounded-full font-bold bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_1px_1px_rgba(0,0,0,0.03)]">
    0 pendentes
  </span>
</li>
```

### 7.3 Formulários de Ação Secundária com Alinhamento Ergonômico
Botões de submissão secundária ou anônima não devem ser esticados em toda a largura do formulário (full width), devendo alinhar-se à direita:

```jsx
<form onSubmit={handleSubmit} className="space-y-4">
  <textarea
    className="skeuo-input w-full p-3.5 text-xs rounded-xl"
    rows={4}
    placeholder="Descreva o ocorrido com detalhes..."
  />
  <div className="flex justify-end mt-4">
    <button
      type="submit"
      className="btn-secondary-glossy px-6 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-xl"
    >
      Enviar Denúncia Anonimamente
    </button>
  </div>
</form>
```

### 7.4 Iconografia de Engenharia (`lucide-react`)
O Skeuo Design System proíbe o uso de emojis Unicode soltos em controles de produção para evitar disparidades de alinhamento e renderização de fontes entre sistemas operacionais (Android, macOS, Windows, Linux). Sempre utilize ícones vetoriais de precisão importados de `lucide-react`:
- Busca: `<Search className="w-4 h-4" />`
- Ferramenta / Manutenção: `<Wrench className="w-3.5 h-3.5" />`
- Dúvidas: `<HelpCircle className="w-6 h-6" />`
- Servidores: `<Server className="w-6 h-6" />`
- Segurança / Denúncias: `<ShieldAlert className="w-6 h-6" />`
- Alertas / Status: `<AlertTriangle className="w-6 h-6" />`

---

## 💻 8. Exemplos Práticos de Implementação em JSX

### 8.1 Card de Atalho Rápido com Orbe Convexa
```jsx
<div className="skeuo-card p-6 flex flex-col items-center text-center cursor-pointer transition-transform hover:-translate-y-1">
  <div className="skeuo-surface-orb-badge w-14 h-14 flex items-center justify-center mb-3">
    <HelpCircle className="w-6 h-6 text-sky-600 dark:text-sky-400" />
  </div>
  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">
    Perguntas Frequentes
  </h3>
  <p className="text-xs text-slate-500 dark:text-slate-400">
    Respostas rápidas sobre salas e perfil
  </p>
</div>
```

### 8.2 Painel com Display Cavitário (`skeuo-well`)
```jsx
<div className="skeuo-card p-6 flex flex-col h-full">
  <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
    <Server className="w-5 h-5 text-emerald-600" />
    Status dos Servidores
  </h2>
  
  <div className="skeuo-well p-4 space-y-3">
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-600 dark:text-slate-300 font-medium">Gateway de Chat</span>
      <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Operacional</span>
    </div>
    <div className="flex items-center justify-between text-xs">
      <span className="text-slate-600 dark:text-slate-300 font-medium">Banco de Mensagens</span>
      <span className="font-bold text-emerald-600 dark:text-emerald-400">Normal</span>
    </div>
  </div>
</div>
```

### 8.3 Botões Primário e Secundário Lado a Lado
```jsx
<div className="flex flex-col sm:flex-row gap-4 items-center">
  <button className="skeuo-btn-primary min-h-[48px] px-8 text-[15px] font-semibold text-white rounded-xl">
    Entrar na Sala
  </button>
  <button className="btn-secondary-glossy min-h-[48px] px-8 text-[15px] font-semibold text-slate-700 dark:text-slate-200 rounded-xl">
    Ver Detalhes
  </button>
</div>
```

### 8.4 Painel com Formulário Entalhado
```jsx
<section className="skeuo-panel p-8 max-w-[500px] mx-auto space-y-6">
  <h2 className="hero-title text-2xl font-bold">Criar Nova Sala</h2>
  
  <div>
    <label className="block text-sm font-semibold mb-2">Nome da Sala</label>
    <input 
      type="text" 
      placeholder="Ex: Discussão Geral"
      className="skeuo-input w-full px-4 py-3 text-sm" 
    />
  </div>

  <div className="flex justify-end gap-3">
    <button className="btn-secondary-glossy px-6 py-2.5 text-xs font-semibold rounded-xl">Cancelar</button>
    <button className="skeuo-btn-primary px-6 py-2.5 text-xs font-semibold text-white rounded-xl">Salvar Sala</button>
  </div>
</section>
```
