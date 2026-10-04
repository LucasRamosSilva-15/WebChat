# Skeuo Design System - Documentação Técnica e Catálogo da API Visual

Bem-vindo à documentação oficial do **Skeuo Design System (SDS)** utilizado no **SkyRipple (WebChat)**.  
Este documento cataloga a arquitetura visual, os design tokens, as variáveis dinâmicas e as classes CSS ativas que compõem o sistema tátil e skeuomórfico da aplicação pós-refatoração (Tailwind CSS v4 + Módulos CSS).

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

#### `.skeuo-panel`
- **Descrição:** Painel base envolvente com acabamento plástico acetinado no claro e alumínio anodizado no escuro.
- **Efeito Visual:**
  - *Light Mode:* Fundo `linear-gradient(to bottom, #ffffff, #f8fafc)`, chanfro de luz superior `inset 0 1px 0 #fff` e elevação de 15px.
  - *Dark Mode:* Fundo `linear-gradient(to bottom, #1e293b, #0f172a)`, luz ambiente `inset 0 2px 0 rgba(255,255,255,0.05)` e sombra de 30px.
- **Aplicação:** Containers de páginas institucionais (`Home`, `About`, `Suporte`, `Settings`).

#### `.skeuo-card` e `.skeuo-card-accent`
- **Descrição:** Cartão com raio de curvatura de 28px e sombra profunda.
- **Variação `.skeuo-card-accent`:** Adiciona friso superior luminoso tricolor (`#38bdf8` a `#0ea5e9`).
- **Aplicação:** Cards de login, registro, itens de salas e cards informativos.

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

#### `.skeuo-btn` (Botão Primário Aqua)
- **Descrição:** O clássico botão gel azul com gradiente dividido no meio (50%/51%), simulando um cilindro líquido tridimensional.
- **Comportamento Físico:**
  - *Hover:* O gradiente ganha luminosidade superior.
  - *Active:* O botão afunda mecanicamente na tela com sombra interna escura `inset 0 2px 5px rgba(0,0,0,0.5)` e borda superior escurecida.
- **Texto:** Sempre branco com sombra debossed: `text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.3)`.

#### `.btn-secondary-glossy` (Botão Secundário Metálico Clássico)
- **Descrição:** Botão metálico cromado (Modo Claro) e grafite escovado (Modo Escuro) com reflexo de luz superior.
- **Comportamento Físico:**
  - *Light Mode:* Gradiente metálico dividido em 50%/51% (`#ffffff` a `#b3b3b3`), contorno `#999`, specular highlight `inset 0 1px 1px rgba(255, 255, 255, 0.9)`.
  - *Dark Mode:* Grafite escuro `linear-gradient(to bottom, #334155, #1e293b 50%, #0f172a 51%, #020617 100%)`.
- **Aplicação:** Botão secundário de grupos do Hero ("Saiba Mais"), botões de cancelar e ações neutras.

#### `.btn-secondary-modern` / `.btn-secondary-smooth`
- **Descrição:** Variante de transição suave em 45° com bevels atenuados. Mantida para contextos onde se busca menor contraste metálico.

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

#### `.skeuo-input`
- **Descrição:** Caixa de entrada de texto com efeito de **cavidade entalhada ("well effect")**.
- **Comportamento Físico:**
  - *Repouso:* Sombra interior cavada `inset 0 2px 5px rgba(0, 0, 0, 0.15)`.
  - *Focus:* A cavidade se acende com halo neon da cor do tema: `0 0 8px var(--primary-ring-focus)`.
- **Aplicação:** Todos os `<input>`, `<textarea>` e `<select>` da aplicação.

---

### 4.4 Badges de Status e Cargos

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

## 💻 7. Exemplos de Implementação em JSX

### 7.1 Botões Primário e Secundário Lado a Lado
```jsx
<div className="flex flex-col sm:flex-row gap-4 items-center">
  <button className="skeuo-btn min-h-[48px] px-8 text-[15px]">
    Entrar na Sala
  </button>
  <button className="btn-secondary-glossy min-h-[48px] px-8 text-[15px]">
    Ver Detalhes
  </button>
</div>
```

### 7.2 Painel com Formulário Entalhado
```jsx
<section className="skeuo-panel p-8 max-w-[500px] mx-auto space-y-6">
  <h2 className="hero-title text-2xl font-bold">Criar Nova Sala</h2>
  
  <div>
    <label className="block text-sm font-semibold mb-2">Nome da Sala</label>
    <input 
      type="text" 
      placeholder="Ex: Discussão Geral"
      className="skeuo-input w-full px-4 py-3" 
    />
  </div>

  <div className="flex justify-end gap-3">
    <button className="btn-secondary-glossy px-6 py-2.5">Cancelar</button>
    <button className="skeuo-btn px-6 py-2.5">Salvar Sala</button>
  </div>
</section>
```
