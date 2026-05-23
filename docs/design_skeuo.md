# Skeuo Design System (SDS) - Guia Arquitetural e Visual

## 1. Filosofia Visual e Princípios Fundamentais
O Skeuo (agora conhecido como **Visual Clássico** para os usuários) é regido pela tangibilidade mecânica e pelo realismo tátil. Ele resgata a estética icônica dos anos 2000 (Web 2.0 / Aqua / iOS Clássico), adaptada para a era moderna. A interface não é um painel de vidro abstrato, mas um conjunto de objetos físicos montados na tela com peso, textura e profundidade tridimensional.
- **Táctilidade Absoluta:** Cada elemento deve parecer pressionável, esculpido ou entalhado. Usamos chanfros (bevels), bordas brilhantes e sombras internas para indicar volume físico.
- **Iluminação Coerente (Luz de Cima):** A iluminação na tela simula um ambiente físico real onde a luz vem estritamente de cima. Isso resulta em bordas superiores brilhantes (specular highlights) e sombras/bordas inferiores mais escuras.
- **Deslocamento Físico:** Botões e elementos interativos não apenas mudam de cor, mas simulam um movimento mecânico (afundamento na tela) quando pressionados.
- **Texturas Nostálgicas:** Superfícies neutras utilizam texturas sutis (como scanlines ou padrões de grade) para quebrar o vazio digital do flat design.

---

## 2. Sistema de Espaçamento e Grid (Spatial System)
Para manter a compatibilidade total de layout durante a alternância dinâmica de temas, o SDS compartilha o mesmo esqueleto geométrico do MDS (múltiplos de 4px e 8px).
- **Max-Widths:**
  - Containers principais (Nav/Footer): `max-w-[980px]`.
  - Container de Chat (Main): `max-w-[800px]`.
  - Formulários (Login/Registro/Perfil): `max-w-[500px]`.
- **Gaps e Margens:**
  - Margem vertical entre seções: `space-y-6`.
  - Agrupamento de balões do mesmo usuário: `mb-1`. Troca de usuário: `mb-4`.
  - Margem de segurança móvel: `px-4` a `px-6` para evitar colisão de relevos com a borda da tela física.
- **Refinamento UI (Densidade):**
  - O design deve evitar o "efeito IA/Template" provocado por excesso de área branca. No chat, bolhas de mensagens e avatares devem usar margens compactas (`px-3 py-1.5`, `mt-0.5`) para agrupar melhor o fluxo de conversa.

---

## 3. Tipografia Volumétrica (Optical Sizing & Text Shadows)
A tipografia base é a **Inter** (com fallbacks `-apple-system, BlinkMacSystemFont`), mas no SDS ela ganha propriedades de profundidade por meio de efeitos de relevo tridimensionais (letterpress e relevo invertido).

* **Display / Hero Titles (Títulos Principais):**
    * Desktop: `56px` a `70px` | Mobile: `40px` a `48px`.
    * Peso: `600` (SemiBold) ou `700` (Bold).
    * Letter-Spacing: `-0.022em`.
    * **Efeito Letterpress (CRÍTICO):** Sombra branca logo abaixo do texto (no Light Mode) ou sombra preta profunda (no Dark Mode) para dar a impressão de gravação física:
      `text-shadow: 0 2px 0 rgba(255, 255, 255, 0.8)` (Light) / `rgba(0, 0, 0, 0.8)` (Dark).

* **Títulos de Seção (H2 / H3):**
    * Tamanho: `24px` a `32px` | Peso: `600`.
    * Efeito Letterpress sutil: `text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8)`.

* **Botões e Mensagens (White Text on Dark Blue):**
    * Efeito Relevo (Debossed Text): Uma sombra preta/escura projetada acima do texto branco para fazê-lo parecer impresso ou baixo relevo:
      `text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4)`.

---

## 4. Cores, Materiais e Texturas (Color & Skeuomorphism)
As cores sólidas e planas são substituídas por gradientes complexos que simulam reflexos de luz em materiais plásticos, metálicos ou de vidro moldado.

* **Textura de Fundo do Body (Modo Claro):**
    * **Opção 1 (Neutro / Ardósia - Recomendado):** Gradiente cinza/azulado suave `linear-gradient(200deg, #dbeafe 0%, #f1f5f9 100%)`. Reduz a "cara de IA" e cansa menos os olhos.
    * **Opção 2 (Azul Clássico):** Gradiente azul original `linear-gradient(200deg, #0280ff 0%, rgb(184, 220, 255) 100%)`.
    * Textura de Grade Diagonal: Scanlines sutis em 45 graus (no `::before` para o neutro, ou embutido para o azul) para simular uma superfície mecânica texturizada.

* **Painéis e Cards (`.skeuo-panel`):**
    * Material: Plástico de alta qualidade com acabamento acetinado.
    * Gradiente: `linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%)`.
    * Elevação 3D: Refinada para não parecer exagerada.
      `box-shadow: 0 4px 15px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1), inset 0 -1px 2px rgba(0,0,0,0.03)`.

* **Barra de Navegação (`.skeuo-nav`):**
    * Material: Barra de alumínio escovado.
    * Elevação: `box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)`.

---

## 5. Modo Escuro (Dark Mode Skeuomorphism) - O Novo Paradigma
O Dark Mode no Skeuo não é apenas inverter cores, é mudar o **material**. Passamos de plástico branco brilhante e alumínio escovado para alumínio anodizado escuro, plásticos foscos estilo "Space Gray" e emissões de luz estilo OLED. O fundo deve ser limpo e profissional.

* **Fundo e Textura (Dark):** 
    * O fundo é um abismo escuro `linear-gradient(200deg, #111 0%, #1c1c1e 100%)`. As texturas em grade continuam, mas com opacidade de apenas `1%`.
* **Painéis (`.skeuo-panel` Dark):**
    * O plástico se torna alumínio escuro `linear-gradient(to bottom, #2a2a2c 0%, #1e1e20 100%)`.
    * As sombras de elevação são muito mais profundas e pesadas `rgba(0, 0, 0, 0.5)`.
    * O chanfro superior agora reflete uma luz ambiente super sutil `inset 0 2px 0 rgba(255, 255, 255, 0.05)`.
* **Inversão de Letterpress:** 
    * Todos os textos que antes tinham sombra branca abaixo (para parecerem entalhados no claro) agora possuem sombra preta densa abaixo `text-shadow: 0 1px 0 rgba(0, 0, 0, 0.8)`.

---

## 6. Geometria e Controles Físicos (UI Patterns)
Cada controle interativo é desenhado como um widget mecânico que responde fisicamente aos estados de hover, focus e clique.

* **Botão Primário Esquimórfico (`.skeuo-btn`):**
    * Estilo: Aqua / Glossy Gel azul tridimensional.
    * Gradiente Duplo (Split Gradient): Gradiente dividido no meio (50%/51%) que simula reflexo cilíndrico de gel:
      `linear-gradient(to bottom, #4da4ff 0%, #0071e3 50%, #005bb5 51%, #004488 100%)`.
    * Brilho de Borda Superior & Sombra Projetada (suavizada para não parecer exagerada):
      `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.15)`.
    * **Estado Active (Pressão Física - CRÍTICO):** O botão "afunda" na tela.
      `background: linear-gradient(to bottom, #004488 0%, #005bb5 100%)`.
      `box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5)`.

* **Botão Secundário Metálico (`.btn-secondary-glossy`):**
    * Estilo: Alumínio cromado (Light Mode) ou Grafite Fosco (Dark Mode).
    * No Dark Mode, transforma-se em um botão furtivo lindo com reflexos suaves.

* **Inputs de Texto e Recessos (`.skeuo-input`):**
    * Estilo: Entrada cavada / Baixo relevo ("well" effect). 
    * Sombras Cavadas: `box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.15)`.
    * **Estado Focus (CRÍTICO):** A cavidade se ilumina com um anel de neon volumétrico `0 0 8px rgba(0, 113, 227, 0.6)`.

---

## 7. Iconografia e Scrollbars Físicas
* **Ícones:** SVG inline preferencialmente de contorno bem definido, simulando ícones gravados. Ao passar o mouse, eles devem sofrer uma sutil rotação ou ganhar profundidade.
* **Scrollbar Tangível (Barra de Rolagem Mecânica):**
    * Não deve ser invisível. Deve parecer uma calha física com um trilho e um manipulo deslizante revestido com um gradiente metálico.

---

## 8. Anti-Patterns (Estritamente Proibido)
1. **BOTÕES FLAT "SEM ALMA" (MUITO COMUM):** É EXPRESSAMENTE PROIBIDO usar botões como `bg-[#f4f5f7]` ou `bg-[#ef4444]` sem nenhum gradiente, chanfro ou materialidade física. Se você precisa de um botão pequeno ou circular (como botão de Sair, Favorito, Apagar, Editar), ele DEVE ter um fundo translúcido/vidro com inset shadow, ou ser modelado com as classes `.btn-secondary-glossy` ou `.skeuo-btn`. Um botão totalmente opaco e sem relevo destrói a ilusão tátil do site.
2. **NÃO** usar cores de fundo 100% planas em painéis, botões ou balões de mensagens. A ausência de gradientes mata o volume do material físico.
3. **NÃO** omitir o chanfro brilhante interno (`inset 0 1px 0 white`) na parte superior de botões, painéis ou balões. Ele é a principal prova de que há luz batendo no topo do objeto.
4. **NÃO** desenhar badges/chips informativos (ex: tags de status ou cargos) como elementos rasos de cor sólida. Eles devem possuir contornos físicos finos (bordas), sombras projetadas sutis e preenchimento de cor ligeiramente complexo (ou texturizado).
5. **NÃO** desenhar inputs sem sombras internas (`inset`). Sem elas, as caixas de texto parecerão sobrepostas (como adesivos) em vez de fendas esculpidas na carcaça do aparelho.
