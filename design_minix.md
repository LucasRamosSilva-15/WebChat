# Minix Design System (MDS) - Guia Arquitetural e Visual

## 1. Filosofia Visual e Princípios Fundamentais
O Minix é regido pelo minimalismo utilitário. O design é "invisível" — o usuário não deve notar a interface, apenas o fluxo da conversa.
- **Clareza Absoluta:** O espaço em branco (negative space) é a nossa principal ferramenta de layout. Ele guia o olhar e separa elementos sem a necessidade de linhas visíveis.
- **Materialidade e Profundidade:** A tela é um ambiente 3D. Utilizamos camadas de "vidro" (Glassmorphism) e elevações suaves para indicar o que está mais próximo do usuário.
- **Reducionismo:** Se uma linha, borda ou fundo não possuir uma função interativa ou de separação estritamente necessária, deve ser removida.

---

## 2. Sistema de Espaçamento e Grid (Spatial System)
Utilizamos um sistema de espaçamento baseado em múltiplos de 4px e 8px (padrão Tailwind).
- **Max-Widths:** - Containers principais (Nav/Footer): `max-w-[980px]`.
  - Container de Chat (Main): `max-w-[800px]`.
  - Formulários (Login/Registro): `max-w-[500px]`.
- **Gaps e Margens:**
  - Espaçamento entre seções de texto (Título > Parágrafo): `mb-4` ou `mb-6`.
  - Espaçamento entre inputs de formulário: `space-y-6`.
  - Agrupamento de mensagens do mesmo usuário: `mb-1`. Mudança de usuário: `mb-4`.

---

## 3. Tipografia Rigorosa (Optical Sizing)
A tipografia base é a **Inter**, com fallback para `-apple-system, BlinkMacSystemFont`. Não misturar famílias tipográficas. O espaçamento entre letras (tracking) dita a elegância.

* **Display / Hero Titles (Títulos Principais):**
    * Desktop: `56px` a `70px` | Mobile: `40px` a `48px`.
    * Peso: `600` (SemiBold) ou `700` (Bold).
    * Line-Height: `1.07` (Apertado, estilo manchete).
    * Letter-Spacing: `-0.022em` (tracking-tight).
    * Cor: `#1d1d1f`.

* **Títulos de Seção (H2 / H3):**
    * Tamanho: `24px` a `32px`.
    * Peso: `600`.
    * Line-Height: `1.2`.
    * Letter-Spacing: `-0.015em`.

* **Body Text (Texto Padrão / Mensagens):**
    * Tamanho: `17px` (Padrão ouro de legibilidade).
    * Peso: `400` (Normal) ou `500` (Medium para ênfase).
    * Line-Height: `1.47` (relaxed/snug).
    * Cor: `#424245` (Texto geral) ou `#1d1d1f` (Foco).

* **Metadados (Datas, Nomes, Status):**
    * Tamanho: `11px` a `12px`.
    * Peso: `500`.
    * Transformação: `uppercase` com `tracking-widest` exclusivo para status (ex: "ENVIADO").
    * Cor: `#86868b`.

---

## 4. Cores, Materiais e Temas (Color & Glassmorphism)
* **Cores Sólidas:**
    * Primária (Ação): `#0071e3`. Hover: `#0077ed`.
    * Secundária (Texto/Ícones Neutros): `#86868b`.
    * Texto Primário: `#1d1d1f`.
    * Background Body: Gradiente suave `linear-gradient(200deg, #0280ff 0%, rgb(184, 220, 255) 100%)` com `background-attachment: fixed`.

* **Superfícies de Vidro (Glass Formulas):**
    * *Navbar:* `bg-white/70`, `backdrop-blur(20px)`, `saturate(180%)`, borda inferior `1px solid rgba(0,0,0,0.05)`.
    * *Cards Base (Main):* `bg-white/80`, `backdrop-blur-xl`, borda `1px solid rgba(255, 255, 255, 0.4)`.
    * *Balões de Chat Opostos:* `bg-white/70`, `backdrop-blur-sm`, `border border-white/20`.

---

## 5. Geometria, Componentes e Estados (UI Patterns)
* **Border-Radius:**
    * Painéis Maiores: `28px` ou `32px`.
    * Balões de Chat: `18px`.
    * Inputs de Formulário: `12px` (soltos) ou `22px` (no footer do chat).
    * Botões: `980px` (rounded-full / pill shape).

* **Inputs de Texto e Focus Rings:**
    * Fundo: `rgba(255, 255, 255, 0.5)`. Borda: `1px solid #d2d2d7`.
    * *Estado Focus (CRÍTICO):* Remoção do outline padrão do navegador (`outline-none`). Substituir por mudança da borda para `#0071e3` + Anel de sombra: `box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.15)`.

* **Estados Especiais (UI States):**
    * *Disabled:* Opacidade em `50%`, cursor `not-allowed`, remoção de efeitos de hover.
    * *Error:* Usar `#ff3b30` (Apple Red) apenas para mensagens de erro críticas em formulários. Borda do input fica vermelha e treme levemente (shake animation).

---

## 6. Iconografia e Scrollbars
* **Ícones:** * Usar apenas SVG inline ou bibliotecas geométricas (ex: Heroicons, Lucide).
    * Padrão: `stroke-width: 1.5` ou `2`. Sem preenchimento (`fill="none"`), exceto quando o ícone representar estado "ativo".
* **Scrollbars (Barra de Rolagem):**
    * Customizadas via webkit. Largura máxima de `6px`.
    * Track: `transparent`.
    * Thumb: `rgba(0, 0, 0, 0.1)` com `border-radius: 10px`. Hover do thumb: `rgba(0, 0, 0, 0.2)`.

---

## 7. Hierarquia Z-Index e Elevação
A luz vem de cima. Sombras indicam proximidade do usuário.
* **Z-0:** Background do Body.
* **Z-10:** Cards estáticos e listas de salas.
* **Z-30:** Modais ou Popovers soltos.
* **Z-40:** Navbar Sticky (`sticky top-0`).
* **Z-50:** Notificações globais (Toasts) e overlays de tela cheia.
* **Sombras (Box-Shadow):**
    * *Baixa (Balões/Botões):* `shadow-sm` ou `0 2px 8px rgba(0,0,0,0.04)`.
    * *Alta (Cards flutuantes):* `shadow-2xl` somado a reflexos vítreos.

---

## 8. Comportamento e Regras do Chat
* **Balões de Mensagem:**
    * Largura máxima: `max-w-[70%]`. Nunca preencher a tela toda.
    * Próprio Usuário: Fundo `#0071e3`, texto `#ffffff`, alinhamento `items-end`.
    * Outro Usuário: Fundo translúcido branco, texto `#1d1d1f`, alinhamento `items-start`.
* **Animações e Motion:**
    * Todas as transições (hover, focus) devem ter duração de `0.3s` e curva `cubic-bezier(0.4, 0, 0.2, 1)`.
    * Animação de entrada (Páginas/Cards): *Slide Up Fade* (Sobe 20px enquanto a opacidade vai de 0 para 1 em 0.6s).
    * Botões: `transform: scale(0.98)` no pseudo-elemento `:active` (Feedback tátil).

---

## 9. Anti-Patterns (Estritamente Proibido)
1. **NÃO** usar `outline` preto padrão do navegador em botões ou inputs.
2. **NÃO** utilizar sombras coloridas intensas (neon effect), exceto nos focus rings azuis.
3. **NÃO** encostar containers diretamente nas bordas da tela no mobile (sempre usar `px-4` ou `px-6`).
4. **NÃO** justificar textos (`text-justify`). Todo texto longo é alinhado à esquerda (`text-left`) ou centralizado em títulos curtos.
5. **NÃO** usar cores fora da paleta especificada. Se precisar de uma cor de aviso, use um tom pastel com texto escuro em vez de blocos de cor sólida vibrante.