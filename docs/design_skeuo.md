# Skeuo Design System (SDS) - Guia Arquitetural e Visual

## 1. Filosofia Visual e Princípios Fundamentais
O Skeuo (Skeuomorphic Design System) é regido pela tangibilidade mecânica e pelo realismo tátil. Ele resgata a estética icônica dos anos 2000 (Web 2.0 / Aqua / iOS Clássico), adaptada para a era moderna. A interface não é um painel de vidro abstrato, mas um conjunto de objetos físicos montados na tela com peso, textura e profundidade tridimensional.
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

---

## 3. Tipografia Volumétrica (Optical Sizing & Text Shadows)
A tipografia base é a **Inter** (com fallbacks `-apple-system, BlinkMacSystemFont`), mas no SDS ela ganha propriedades de profundidade por meio de efeitos de relevo tridimensionais (letterpress e relevo invertido).

* **Display / Hero Titles (Títulos Principais):**
    * Desktop: `56px` a `70px` | Mobile: `40px` a `48px`.
    * Peso: `600` (SemiBold) ou `700` (Bold).
    * Letter-Spacing: `-0.022em`.
    * **Efeito Letterpress (CRÍTICO):** Sombra branca logo abaixo do texto para dar a impressão de gravação física ou entalhe na superfície:
      `text-shadow: 0 2px 0 rgba(255, 255, 255, 0.8)`.
    * Cor base: `#1d1d1f`.

* **Títulos de Seção (H2 / H3):**
    * Tamanho: `24px` a `32px`.
    * Peso: `600`.
    * Efeito Letterpress sutil: `text-shadow: 0 1.5px 0 rgba(255, 255, 255, 0.8)`.

* **Botões e Mensagens (White Text on Dark Blue):**
    * Efeito Relevo (Debossed Text): Uma sombra preta/escura projetada acima do texto branco para fazê-lo parecer impresso ou baixo relevo:
      `text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4)`.

* **Botões Secundários Prateados (Black Text on Silver):**
    * Efeito Relevo Suave: Uma sombra branca clara abaixo do texto escuro:
      `text-shadow: 0 1px 0 rgba(255, 255, 255, 0.8)`.
      
---

## 4. Cores, Materiais e Texturas (Color & Skeuomorphism)
As cores sólidas e planas são substituídas por gradientes complexos que simulam reflexos de luz em materiais plásticos, metálicos ou de vidro moldado.

* **Textura de Fundo do Body:**
    * Base: Gradiente azul suave `linear-gradient(200deg, #0280ff 0%, rgb(184, 220, 255) 100%)`.
    * Textura de Grade Diagonal: Scanlines sutis em 45 graus para simular uma superfície mecânica texturizada:
      `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 4px)`.
      `background-attachment: fixed`.

* **Painéis e Cards (`.skeuo-panel`):**
    * Material: Plástico beje/cinza de alta qualidade com acabamento acetinado.
    * Gradiente: `linear-gradient(to bottom, #ffffff 0%, #f4f5f7 100%)`.
    * Chanfro superior: Borda semitransparente clara `border: 1px solid rgba(255, 255, 255, 0.8)`.
    * Elevação 3D: Sombra projetada + reflexo de luz interno na borda superior + sombra de profundidade interna na borda inferior:
      `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 1), inset 0 -1px 2px rgba(0,0,0,0.05)`.

* **Barra de Navegação (`.skeuo-nav`):**
    * Material: Barra de alumínio extrudado escovado.
    * Gradiente: `linear-gradient(to bottom, #ffffff 0%, #eef1f5 100%)`.
    * Borda Inferior: Divisor físico cinza `#d2d2d7`.
    * Elevação: `box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 1)`.

---

## 5. Geometria, Componentes e Estados (UI Patterns)
Cada controle interativo é desenhado como um widget mecânico que responde fisicamente aos estados de hover, focus e clique.

* **Botão Primário Esquimórfico (`.skeuo-btn`):**
    * Estilo: Aqua / Glossy Gel azul tridimensional.
    * Gradiente Duplo (Split Gradient): Gradiente dividido no meio (50%/51%) que simula um reflexo cilíndrico de gel brilhante:
      `linear-gradient(to bottom, #4da4ff 0%, #0071e3 50%, #005bb5 51%, #004488 100%)`.
    * Borda Física: `#004488` de 1px.
    * Raio da Borda: Estilo Pílula (`980px`).
    * Brilho de Borda Superior & Sombra Projetada:
      `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.2)`.
    * **Estado Hover:** Gradiente Aqua com brilho acentuado:
      `linear-gradient(to bottom, #66b3ff 0%, #1a82ff 50%, #006ce6 51%, #0055a3 100%)`.
    * **Estado Active (Pressão Física - CRÍTICO):** O botão "afunda" na tela. O gradiente inverte para tons escuros, a borda superior escurece para `#002244` e uma sombra interna forte é aplicada para simular o recolhimento do botão:
      `background: linear-gradient(to bottom, #004488 0%, #005bb5 100%)`.
      `box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.5)`.
    * **Tempo de Resposta:** Transição ultra-rápida (`transition: all 0.1s ease`) para imitar uma mola mecânica instantânea.

* **Botão Secundário Metálico (`.btn-secondary-glossy`):**
    * Estilo: Alumínio cromado ou liga metálica.
    * Gradiente Duplo: `linear-gradient(to bottom, #ffffff 0%, #e6e6e6 50%, #cccccc 51%, #b3b3b3 100%)`.
    * Borda Física: `#999999` de 1px.
    * Reflexo Interno e Sombra: `box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.9), 0 2px 4px rgba(0, 0, 0, 0.2)`.
    * Cor do Texto: `#333333` com text-shadow claro.

* **Inputs de Texto e Recessos (`.skeuo-input`):**
    * Estilo: Entrada cavada / Baixo relevo ("well" effect). O input parece um sulco físico recortado na superfície plástica.
    * Cor de Fundo: Papel opaco `#fafafa`.
    * Borda Entalhada: Borda com o topo mais escurecido para simular a sombra projetada pelo corte superior:
      `border: 1px solid #b3b3b3`.
      `border-top-color: #999999`.
    * Sombras Cavadas: Sombra interna superior para acentuar a profundidade + brilho de saída inferior:
      `box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.15), 0 1px 0 rgba(255, 255, 255, 0.8)`.
    * **Estado Focus (CRÍTICO):** A cavidade se ilumina. O fundo fica totalmente branco, a borda se torna azul `#0071e3` e um anel de neon volumétrico brilha ao redor da fenda:
      `box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 8px rgba(0, 113, 227, 0.6)`.

---

## 6. Iconografia e Scrollbars Físicas
* **Ícones:** SVG inline preferencialmente de contorno bem definido, simulando ícones gravados. Ao passar o mouse, eles podem sofrer uma sutil rotação ou elevação de opacidade.
* **Scrollbar Tangível (Barra de Rolagem Mecânica):**
    * Não deve ser invisível. Deve parecer uma calha física com um trilho e um manipulo deslizante.
    * **Track (Calha):** Fundo translúcido `rgba(0, 0, 0, 0.02)` com sombra interna de canaleta `box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05)`. Largura: `8px`.
    * **Thumb (Manipulo):** Barra sólida oval prateada de cantos arredondados, revestida com um gradiente metálico `linear-gradient(to right, #c2c2c2, #a3a3a3)` e borda física rígida `1px solid #8c8c8c`.
    * **Hover do Thumb:** Gradiente escurece ligeiramente para simular toque: `linear-gradient(to right, #a3a3a3, #8c8c8c)`.

---

## 7. Hierarquia Z-Index, Elevação e Sombras
A profundidade não é declarada apenas por z-index do CSS, mas principalmente pelo tamanho e dispersão das sombras externas, ditando a altura física de suspensão de um objeto em relação ao plano de fundo.
* **Z-0:** Grid de fundo diagonal (Plano do Chão).
* **Z-10:** Painéis principais (`.skeuo-panel`), cards de salas e frames de chat (Baixa elevação, sombra firme e concentrada).
* **Z-30:** Modais de criação de salas e menus popover suspensos. Sombra de grande dispersão que simula flutuação física: `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15)`.
* **Z-40:** Navbar Sticky com sombra linear projetada para baixo (`0 2px 10px rgba(0, 0, 0, 0.1)`).
* **Z-50:** Overlays, Toasts globais (suspensão máxima no ar).

---

## 8. Comportamento e Regras do Chat
* **Balões de Mensagem Físicos:**
    * Próprio Usuário (Sent Balloon): Cápsula Aqua 3D azul.
      * Gradiente brilhante: `linear-gradient(to bottom, #3399ff 0%, #0071e3 100%)`.
      * Borda de contorno: `1px solid #005bb5`.
      * Relevo: Sombra projetada para baixo `0 2px 4px rgba(0,0,0,0.15)` combinada com chanfro interno branco semi-translúcido `inset 0 1px 0 rgba(255,255,255,0.4)`.
      * Cauda: Canto inferior direito afunilado (`border-bottom-right-radius: 2px`).
    * Outro Usuário (Received Balloon): Cápsula 3D cinza claro/prata.
      * Gradiente: `linear-gradient(to bottom, #f9f9f9 0%, #ebebeb 100%)`.
      * Borda de contorno: `1px solid #cccccc`.
      * Relevo: `0 2px 4px rgba(0,0,0,0.1)` + brilho interno `inset 0 1px 0 rgba(255,255,255,1)`.
      * Cauda: Canto inferior esquerdo afunilado (`border-bottom-left-radius: 2px`).
* **Animações de Entrada (snappy physics):**
    * Efeito de surgimento (`.reveal`): Escala elástica suave combinada com subida rápida:
      `animation: slideUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards`.
    * Transições de cliques físicos em botões devem ocorrer a `0.1s` (tempo de resposta imediato a molas), gerando rigidez tátil satisfatória.

---

## 9. Anti-Patterns (Estritamente Proibido)
1. **NÃO** usar cores de fundo 100% planas (flat) ou sem gradiente em painéis, botões ou caixas de mensagens. A ausência de gradientes mata o volume do material físico.
2. **NÃO** utilizar sombras planas finas de opacidade alta (como `rgba(0,0,0,1)` de 1px) sem suavização, nem sombras coloridas intensas (neon/cyberpunk).
3. **NÃO** omitir o chanfro brilhante interno (`inset 0 1px 0 white`) na parte superior de botões ou painéis. Ele é essencial para definir o ângulo e reflexo físico da luz vinda de cima.
4. **NÃO** usar transições lentas ou "gelatinosas" (`0.4s` ou `0.5s` ease-in-out) em ações de clique em botões. O feedback mecânico deve ser curto e firme (`0.1s`).
5. **NÃO** desenhar inputs sem sombras internas (`inset`). Sem elas, as caixas de texto parecerão sobrepostas em vez de encaixadas de forma esculpida na carcaça do painel.
