# Plano de Refatoração Visual: Tailwind vs CSS Customizado

## 1. Diagnóstico do Problema Atual

Atualmente, o projeto utiliza a flexibilidade do Tailwind CSS extensivamente. No entanto, devido à natureza rica e complexa do design escolhido (Skeuomórfico / Web 2.0 Clássico), estamos enfrentando a **síndrome das classes gigantes**. 

Um botão ou painel simples acaba acumulando dezenas de utilitários que definem gradientes complexos para modos claro e escuro, sombras múltiplas interpoladas (inset e drop shadows), bordas translúcidas e hover states.

**Exemplo real encontrado no projeto (botão de ícone na Navbar):**
```jsx
className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800 border border-gray-300 dark:border-slate-600 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,1),0_1px_2px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.3)] hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all"
```
**Consequências:**
- Dificuldade na leitura do código JSX (poluição visual extrema).
- Inconsistência visual: desenvolvedores podem copiar/colar gradientes ou sombras com pequenas diferenças em arquivos distintos.
- Manutenção dolorosa: se precisarmos alterar o tom do `dark mode` ou a intensidade das sombras (`inset_0_1px...`), será necessário rodar um find/replace massivo em dezenas de arquivos.

---

## 2. O Plano de Separação de Responsabilidades

O Tailwind CSS é fenomenal para posicionamento e micro-ajustes estruturais, mas falha em manter a sanidade quando trabalhamos com "materiais" ricos (vidro, metal escovado, gel).

A refatoração dividirá as responsabilidades rigorosamente:

### O que FICA no Tailwind CSS (Estrutura e Posicionamento)
- `flex`, `grid`, `items-center`, `justify-between`, `flex-1`, `flex-col`
- `p-4`, `m-2`, `mt-6`, `gap-3` (Espaçamentos internos e externos)
- `w-full`, `h-full`, `max-w-[500px]`, `w-8`, `h-8` (Dimensões físicas)
- `hidden`, `lg:flex`, `md:block` (Responsividade e Media Queries)
- `relative`, `absolute`, `fixed`, `sticky`, `top-0`, `inset-0`, `z-10`
- `animate-fade-in` e classes de keyframes (`animate-chat-shell`).

### O que VAI para o CSS Customizado (Aparência, Textura e Materiais)
- Cores de fundo contínuas e texturas (`bg-gradient-to-b...`)
- Efeitos tridimensionais, relevos e brilhos (`shadow-[inset...]`)
- Bordas coloridas e contornos complexos (`border`, `border-white/20`)
- Transições de cor entre hover, active, focus e checked
- Tematização específica do modo escuro para texturas (`dark:...`)

---

## 3. Lista de Classes Sugeridas (Vocabulário Skeuo)

Estas classes encapsularão a complexidade visual. No JSX, elas serão mescladas com o Tailwind estrutural. Por exemplo: `<button className="skeuo-icon-btn w-10 h-10 ml-2">`

### Materiais Base
- `.skeuo-panel`: Cartões de destaque, modais e containers brancos brilhantes. (Já existe, será refinado).
- `.skeuo-card`: Variante para pequenos itens de lista ou grids (fundo levemente prateado translúcido).
- `.skeuo-modal-overlay`: Abstração do fundo `bg-black/40 backdrop-blur-sm` usado atrás de popups e painéis abertos.

### Controles de Interface
- `.skeuo-btn`: Botão de ação primária (estilo gel Aqua, já existe).
- `.skeuo-btn-danger`: Variante vermelha para deletar/sair da sala.
- `.btn-secondary-glossy`: Botão metálico cinza (já existe).
- `.skeuo-icon-btn`: Botões redondos apenas com ícone, muito usados nas sidebars e navbar, com gradiente cinza metálico e fundo afundado no active.
- `.skeuo-input`: Campos de digitação com chanfro interno profundo e anel de foco (já existe, será lapidado).
- `.skeuo-badge`: Pílulas coloridas de status (Online, Admin, Dono) com texto em relevo.

### Partes do Layout Específicas
- `.skeuo-topbar`: Substitui a bagunça dos gradientes prateados em cabeçalhos (Navbar e topo do Chat).
- `.skeuo-sidebar`: O gradiente suave usado na MembersSidebar e ChatSidebar, com a divisória (border) embutida na sombra interna.

---

## 4. Ordem de Execução Segura (Estratégia "Outside-In")

Não faremos um "Big Bang". O processo deve ser progressivo, começando da "periferia" do projeto (componentes isolados) para o "coração" (as telas de alta complexidade).

**Fase 1: Preparação do Terreno**
1. Consolidar o arquivo `index.css` (ou criar um novo arquivo dedicado e importá-lo) definindo todas as abstrações propostas via seletores CSS normais.

**Fase 2: Componentes Isolados (Baixo Risco)**
2. Refatorar `UserAvatar.jsx` e `SkeuoLoading.jsx` (já estão razoáveis, focar nas pequenas bordas de ícones).
3. Refatorar páginas periféricas: `About.jsx`, `Home.jsx`, `Login.jsx` e `Register.jsx`.

**Fase 3: Layouts Core (Médio Risco)**
4. Refatorar a `Navbar.jsx` (Aproveitar para extrair o `.skeuo-icon-btn`).
5. Refatorar `ChatSidebar.jsx` e `MembersSidebar.jsx` (Limpando `.skeuo-sidebar`).

**Fase 4: O Coração do App (Maior Risco, fazer por último)**
6. Refatorar `Rooms.jsx` (Focando na listagem dos `.skeuo-card` e nos Inputs).
7. Refatorar `Chat.jsx`. Este é o mais delicado. É aqui que moram os modais de imagem, balões de conversa (enviadas/recebidas), dropdowns de mensagens e input inferior. Deve ser a etapa derradeira.

---

## 5. Riscos Potenciais

- **Quebra do Dark Mode:** O Tailwind resolve o `dark:` magicamente com a classe `.dark` injetada na hierarquia DOM. Quando movermos propriedades físicas para o CSS puro, precisaremos gerenciar explicitamente as transições através de seletores como `html.dark .skeuo-panel { ... }`.
- **Conflitos de Especificidade (CSS Wars):** Se dentro de uma classe `.skeuo-sidebar` nós colocarmos algo como `display: flex; flex-direction: column`, o Tailwind pode falhar em sobrescrevê-lo (como `md:hidden` por exemplo) se não usarmos camadas (`@layer`) ou pesos corretos. **Regra Mestra:** Nenhuma classe visual customizada (`skeuo-*`) deve ditar layout estrutural (display, width, height, margin, padding).
- **Regressão de Precisão Visual (Pixel Pushing):** Perder um reflexo de `inset 0 1px 0 rgba(255,255,255,1)` no botão durante a cópia pode quebrar severamente a ilusão tátil estabelecida no Web 2.0.

---

## 6. Como Testar e Homologar o Plano

A implementação se dá estritamente na branch secundária já criada (`refactor-css-visual-system`). Durante o processo:

1. **Teste Pareado (Visualização Dinâmica):** A cada tela da ordem de execução, abra a versão na main (em uma guia/servidor separado, se possível, ou através de prints antigos) e compare os milímetros de sombra com a refatorada em live reload (`npm run dev`).
2. **Homologação Tridimensional:** Os componentes devem ser postos em teste de uso. 
   - Testar `:hover` (O brilho suaviza?).
   - Testar `:active` (O botão afunda como teclado físico?).
   - Testar Focus Rings navegando via teclado (`TAB`).
3. **Pêndulo de Temas:** Na Navbar, usar o menu de Configurações para ciclar bruscamente entre "Modo Claro" e "Modo Escuro". Classes CSS recém-criadas devem reagir simultaneamente, sem piscar cores erradas durante a transição de estado.
