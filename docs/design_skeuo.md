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
  - O design deve evitar o "efeito IA/Template" provocado por excesso de área branca. No chat, bolhas de mensagens e avatares devem usar margens compactas (`px-3 py-[2px]`, `mt-0.5`) para agrupar melhor o fluxo de conversa.
- **Macro-Estrutura (Layout App-Like):**
  - A interface principal do chat deve preencher a tela em 100vh (`h-[calc(100vh-48px)]`) sem se comportar como um card solto. A estrutura é dividida em 3 colunas coladas: `ChatSidebar` (esquerda, fixa 220px) + `Chat` (centro, flex-1) + `MembersSidebar` (direita, fixa 220px).
  - **Empty State:** O estado vazio das telas não deve inserir "dados falsos". Salas sem mensagens mostram um componente flutuante translúcido elegante no centro (`FaComments`) convidando o usuário a interagir.

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
6. **Texto principal solto diretamente no background:** Todo hero ou título vital precisa de um painel de anteparo (`.skeuo-panel`) para que o conteúdo não se perca ou polua o fundo texturizado.
7. **Palavra destacada com borda/sombra na mesma cor do fundo:** Usar efeitos ou contornos da mesma cor da textura circundante cria um efeito fantasma, prejudicando a leitura. A palavra de destaque precisa de cor sólida contrastante e sombras diretas.
8. **Desalinhamento de Mockups e Heros:** O card visual ou representação do chat não pode ficar flutuando solto longe do texto em páginas de apresentação; ele deve estar envolto pela mesma superfície do painel Hero para formar um bloco visual coeso.
9. **Inconsistência de Botões:** Ter dois botões em um grupo primário (ex: "Começar" e "Saiba Mais") com tamanhos verticais, larguras, paddings ou classes de alinhamento discrepantes, criando a percepção de erro de template.
10. **Textos Genéricos (Landing Page de SaaS genérica):** Usar copy excessivamente frio, empresarial, jargão de B2B e ignorar o tom orgânico, leve e lúdico que o SkyRipple exige. Textos longos e sem respiro devem ser evitados.
11. **Repetição Redundante da Temática "Céu":** Colocar ícones de nuvens excessivamente lado a lado quando a atmosfera de "céu" já está sendo transmitida pelos gradientes, cores e fluidez das sombras na tela.

---

## 9. Páginas Institucionais e Apresentação (Home, About, Profile)
Ao projetar páginas informativas e institucionais como `About.jsx`, `Home.jsx` e telas de configuração, a estrutura deve garantir que o conteúdo tenha presença tátil:
* **Uso de Painéis (`.skeuo-panel`):** Todo o conteúdo central, incluindo o "Hero", chamadas principais e formulários, deve ser agrupado e envolvido em painéis (plástico ou acrílico translúcido). Isso evita que o texto fique vulnerável diretamente sobre os padrões ou gradientes do background.
* **Organização em Cards:** Utilize componentes de cartões com profundidade para separar visualmente as seções e categorias de informação da página.
* **Chamadas Finais:** Seções de encerramento e CTAs principais ("Pronto para conversar?") devem habitar blocos próprios com aparência de interface física que chame para a interação.

---

## 10. Estrutura de Hero Sections
As "Hero Sections" (seções de destaque no topo) definem a primeira impressão da aplicação SkyRipple. O padrão de construção deve conter:
* **Painel Único Unificado:** O Hero deve ser constituído por um painel grande e envelopante que englobe o título principal, textos auxiliares, botões e elementos visuais ilustrativos juntos.
* **Duas Colunas no Desktop:** O layout deve dividir o espaço harmonicamente (ex: coluna de textos e botões à esquerda, e um card representativo/mockup do chat ancorado à direita).
* **Empilhamento Perfeito no Mobile:** Em telas pequenas, o conteúdo deve flexionar para um empilhamento ordenado e limpo (primeiro textos, depois o elemento de mockup visual), sempre dentro da mesma moldura.
* **O Efeito de Palavras de Destaque:** Para focar uma frase (ex: "fluírem livremente"), aposte em um contraste elevado. Evite strokes/linhas que mascarem a palavra com o background. Utilize tons sólidos marcantes (Azul-claro, Ciano sólido) aliados a sombras diretas limpas (`text-shadow: 0 1px 1px rgba(255, 255, 255, 1)`) que criam efeito de encavo ou tinta alto-relevo de material durável.

---

## 11. Cards Informativos e Listagens
Os cartões usados para exibir diferenciais ou elencar informações (como os de `About.jsx`) não podem ter a aparência de cartões bidimensionais/flat comuns do ecossistema Material Design.
* **Fundo e Gradiente:** O fundo deve possuir um gradiente de clareamento (ex: de branco fosco a um leve prateado translúcido `bg-white/90`), protegendo o material das distorções do ambiente.
* **Tratamento de Luzes e Sombras:** O card necessita de uma sombra externa sutil para flutuação (`0 8px 25px rgba(...)`) e um brilho interior que imite reflexo acrílico (`inset 0 0 20px rgba(255, 255, 255, 0.5)`).
* **Ícones Físicos:** Ícones não devem estar chapados na tela, mas alocados dentro de "caixinhas/widgets" próprios (usando paddings menores e gradientes arredondados) que possuem seu próprio micro-relevo e chanfro.
* **Texto Humano e Conciso:** Cards devem apresentar descrições rápidas, naturais e objetivas, evitando blocos gigantes de texto sem espaço (respiro) ou sem margens generosas.

---

## 12. Geometria e Layout de Botões Lado a Lado
Quando a interface reunir múltiplos botões formandos grupos (especialmente no Hero ou barras de confirmação), o rigor geométrico se faz necessário:
* **Padronização de Volume:** Botões do mesmo grupo visual **devem ter altura consistente** (preferivelmente uma base como `min-h-[48px]`).
* **Uso de Flexbox:** Utilize propriedades fixas estruturais como `inline-flex`, `items-center` e `justify-center` de forma padronizada.
* **Equilíbrio de Peso Visual:** Em duplas primárias e secundárias, o peso visual deve ser harmonioso. Utilize `.skeuo-btn` (gel cilíndrico forte) e `.btn-secondary-glossy` (material claro cromado/fosco), mas mantenha paddings e dimensões iguais.
* **Comportamento Mobile:** Em resoluções mobile, garanta que os botões possam ocupar a largura total do container (`w-full`) e empilhem-se um sobre o outro graciosamente, mantendo o estiramento exato de ambos e o peso simétrico do painel.

---

## 13. Textos e Legibilidade em Backgrounds Complexos
O SkyRipple aposta em texturas ricas de fundo e uso de gradientes e letterpresses de época. Siga as orientações para não perder o contraste na escrita:
* Evite que as áreas úteis (que lecionam texto) fiquem em repouso estrito sobre os artefatos de fundo (linhas radiais, scanlines ou luzes de céu azuis puras). Um anteparo de plástico branco/translúcido emula painéis de comunicação tátil, resgatando a leitura e a temática central ao mesmo tempo.
* Use o *Efeito Letterpress* (uma leve sombra paralela, clara sobre branco/cinza, preta sobre backgrounds escuros). Lembre-se que aplicar letterpress em textos contínuos muito grandes diminui a legibilidade. Restrinja-os para cabeçalhos (Headings).
* Para contornos textuais, um relevo direto limpo sobre um gradiente é sempre mais preferível a usar linhas grossas de stroke em cores quase transparentes.

---

## 14. A Identidade "SkyRipple" (Linguagem Visual)
O projeto deixou o escopo de "simples painéis de vidro flat" para mergulhar em uma interface tangível banhada por céus abertos, fluidez, conversas abertas e nostalgia refinada.
* **Vocabulário Aprovado:** Use os termos como **Visual Clássico, Interface Tátil, Web 2.0 Clássica, Estética Aqua, Skeuomorfismo, Botões em Relevo, Cartões com Profundidade** e **Design Orgânico**.
* **Como Descrever o App:** O SkyRipple exala "leveza", com ondulações e uma atmosfera etérea/orgânica, sempre com a âncora nos azuis, cianos e bancos iluminados.
* **Terminologias a Evitar (O que o design NÃO é):** Evite chamar a interface estritamente de "Glassmorphism puro" ou "Dashboard SaaS genérica". Mesmo onde as técnicas de vidro são usadas (como `backdrop-blur`), elas funcionam como simulacros de **placas táteis grossas de acrílico ou resina**, reforçando botões mecânicos e chanfros visíveis, diferente das simples membranas bidimensionais fantasmagóricas vistas nas vertentes de design glassmorphism usuais em IAs genéricas.

---

## 15. Exemplos de Fraseologia, Contexto e Copywriting
Quando escrever o conteúdo ou se referir às características da plataforma, alinhe a voz do SkyRipple ao design do SkyRipple.

**Tom Recomendado (Exemplos Positivos):**
* “Visual clássico e tátil, com foco na fluidez da conversa.”
* “Interface inspirada na web dos anos 2000, onde os botões pedem para serem clicados.”
* “Uma experiência leve, cheia de botões em relevo, cartões com profundidade e sombras suaves.”
* “Entre e encontre seu espaço. O clima está perfeito hoje.”

**O Que Evitar a Todo Custo (Exemplos Negativos):**
* “A plataforma B2B plana para melhor agilidade de conversão corporativa.”
* “O aplicativo utiliza glassmorphism de painel de vidro limpo para apresentar tabelas abstratas.”
* Despachar a experiência mecânica da interface com tons extremamente corporativos e burocráticos.

