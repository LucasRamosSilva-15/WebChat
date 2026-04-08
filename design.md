# Inspiração do Design System da Apple

## 1. Tema Visual e Atmosfera

O site da Apple é uma aula mestre em drama controlado — vastas extensões de preto puro e quase-branco servem como cenários cinematográficos para produtos que são fotografados como se fossem esculturas em uma galeria. A filosofia de design é redutiva em sua essência: cada pixel existe a serviço do produto, e a própria interface recua até se tornar invisível. Isso não é minimalismo como preferência estética; é minimalismo como reverência ao objeto.

A tipografia ancora tudo. San Francisco (SF Pro Display para tamanhos grandes, SF Pro Text para o corpo) é a tipografia proprietária da Apple, projetada com dimensionamento óptico (*optical sizing*) que ajusta automaticamente as formas das letras dependendo do tamanho do ponto. Em tamanhos de exibição (56px), o peso 600 com uma altura de linha apertada de 1.07 e um sutil espaçamento negativo entre letras (-0.28px) cria títulos que parecem usinados em vez de tipografados — precisos, confiantes e assumidamente diretos. Em tamanhos de corpo (17px), o rastreamento afrouxa ligeiramente (-0.374px) e a altura da linha abre para 1.47, criando um ritmo de leitura que é confortável sem nunca parecer frouxo.

A história das cores é rigidamente binária. As seções de produtos alternam entre fundos preto puro (#000000) com texto branco e fundos cinza claro (#f5f5f7) com texto quase preto (#1d1d1f). Isso cria um ritmo cinematográfico — seções escuras parecem imersivas e premium, seções claras parecem abertas e informativas. O único acento cromático é o Azul Apple (#0071e3), reservado exclusivamente para elementos interativos: links, botões e estados de foco. Esta cor de destaque singular em um mar de neutros dá a cada elemento clicável uma visibilidade inconfundível.

**Características Principais:**
* SF Pro Display/Text com dimensionamento óptico — as formas das letras se adaptam automaticamente ao contexto do tamanho.
* Ritmo de seção binário claro/escuro: preto (#000000) alternando com cinza claro (#f5f5f7).
* Cor de destaque única: Azul Apple (#0071e3) reservado exclusivamente para elementos interativos.
* Fotografia do produto como "herói" em campos de cor sólida — sem gradientes, sem texturas, sem distrações.
* Alturas de linha de título extremamente apertadas (1.07-1.14) criando um impacto comprimido, estilo outdoor.
* Layout de seção de largura total com conteúdo centralizado — o *viewport* É a tela.
* CTAs em formato de pílula (raio de 980px) criando botões de ação suaves e acessíveis.
* Espaço em branco generoso entre as seções permitindo que cada momento do produto respire.

## 2. Paleta de Cores e Papéis

### Primárias
* **Preto Puro (#000000):** Fundos de seção *hero*, vitrines imersivas de produtos. A tela mais escura para os produtos mais brilhantes.
* **Cinza Claro (#f5f5f7):** Fundos de seção alternados, áreas informativas. Não é branco — o leve tom azul-acinzentado evita a esterilidade.
* **Quase Preto (#1d1d1f):** Texto primário em fundos claros, preenchimentos de botões escuros. Ligeiramente mais quente que o preto puro para uma leitura confortável.

### Interativas
* **Azul Apple (#0071e3):** `--sk-focus-color`, fundos de CTA primários, anéis de foco. A ÚNICA cor cromática na interface.
* **Azul de Link (#0066cc):** `--sk-body-link-color`, links de texto embutidos. Ligeiramente mais escuro que o Azul Apple para legibilidade em nível de texto.
* **Azul Brilhante (#2997ff):** Links em fundos escuros. Maior luminância para contraste em seções pretas.

### Texto
* **Branco (#ffffff):** Texto em fundos escuros, texto de botão em CTAs azuis/escuros.
* **Quase Preto (#1d1d1f):** Texto corporal primário em fundos claros.
* **Preto 80% (rgba(0, 0, 0, 0.8)):** Texto secundário, itens de navegação em fundos claros. Ligeiramente suavizado.
* **Preto 48% (rgba(0, 0, 0, 0.48)):** Texto terciário, estados desativados, controles de carrossel.

### Variantes de Superfície e Escuro
* **Superfície Escura 1 (#272729):** Fundos de cartões em seções escuras.
* **Superfície Escura 2 (#262628):** Variação sutil de superfície em contextos escuros.
* **Superfície Escura 3 (#28282a):** Cartões elevados em fundos escuros.
* **Superfície Escura 4 (#2a2a2d):** Elevação de superfície escura mais alta.
* **Superfície Escura 5 (#242426):** Tom de superfície escura mais profundo.

### Estados de Botão
* **Botão Ativo (#ededf2):** Estado ativo/pressionado para botões claros.
* **Botão Padrão Claro (#fafafc):** Fundos de botões de busca/filtro.
* **Sobreposição (Overlay) (rgba(210, 210, 215, 0.64)):** Telas de controle de mídia, sobreposições.
* **Branco 32% (rgba(255, 255, 255, 0.32)):** Estado de *hover* em botões de fechar modais escuros.

### Sombras
* **Sombra de Cartão (rgba(0, 0, 0, 0.22) 3px 5px 30px 0px):** Elevação suave e difundida para cartões de produtos. O deslocamento e o desfoque amplo criam uma sombra natural e fotográfica.

## 3. Regras de Tipografia

### Família de Fontes
* **Display:** SF Pro Display, com substitutos (*fallbacks*): SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif.
* **Body:** SF Pro Text, com substitutos: SF Pro Icons, Helvetica Neue, Helvetica, Arial, sans-serif.
* *SF Pro Display é usada em 20px ou superior; SF Pro Text é otimizada para 19px ou inferior.*

### Hierarquia

| Papel | Fonte | Tamanho | Peso | Altura da Linha | Espaçamento | Notas |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Display Hero | SF Pro Display | 56px | 600 | 1.07 (tight) | -0.28px | Títulos de lançamento, impacto máximo |
| Section Heading | SF Pro Display | 40px | 600 | 1.10 (tight) | normal | Títulos de seções de recursos |
| Tile Heading | SF Pro Display | 28px | 400 | 1.14 (tight) | 0.196px | Títulos de blocos de produto |
| Card Title | SF Pro Display | 21px | 700 | 1.19 (tight) | 0.231px | Títulos de cartões em negrito |
| Sub-heading | SF Pro Display | 21px | 400 | 1.19 (tight) | 0.231px | Títulos de cartões regulares |
| Nav Heading | SF Pro Text | 34px | 600 | 1.47 | -0.374px | Títulos grandes de navegação |
| Sub-nav | SF Pro Text | 24px | 300 | 1.50 | normal | Texto leve de sub-navegação |
| Body | SF Pro Text | 17px | 400 | 1.47 | -0.374px | Texto de leitura padrão |
| Body Emphasis | SF Pro Text | 17px | 600 | 1.24 (tight) | -0.374px | Texto de corpo enfatizado, rótulos |
| Button Large | SF Pro Text | 18px | 300 | 1.00 (tight) | normal | Texto de botão grande, peso leve |
| Button | SF Pro Text | 17px | 400 | 2.41 (relaxed) | normal | Texto de botão padrão |
| Link | SF Pro Text | 14px | 400 | 1.43 | -0.224px | Links no corpo, "Saiba mais" |
| Caption | SF Pro Text | 14px | 400 | 1.29 (tight) | -0.224px | Texto secundário, descrições |
| Caption Bold | SF Pro Text | 14px | 600 | 1.29 (tight) | -0.224px | Legendas enfatizadas |
| Micro | SF Pro Text | 12px | 400 | 1.33 | -0.12px | Letras miúdas, notas de rodapé |
| Micro Bold | SF Pro Text | 12px | 600 | 1.33 | -0.12px | Letras miúdas em negrito |
| Nano | SF Pro Text | 10px | 400 | 1.47 | -0.08px | Texto jurídico, menor tamanho |

### Princípios
* **Dimensionamento óptico como filosofia:** A SF Pro alterna automaticamente entre os tamanhos ópticos Display e Text. Versões Display possuem espaçamento mais amplo e traços mais finos otimizados para tamanhos grandes; versões Text são mais compactas e robustas para tamanhos pequenos. Isso significa que a fonte literalmente muda seu "DNA" com base no contexto.
* **Restrição de peso:** A escala varia de 300 (leve) a 700 (negrito), mas a maioria dos textos reside em 400 (regular) e 600 (semibold). O peso 300 aparece apenas em textos decorativos grandes. O peso 700 é raro, usado apenas para títulos de cartões em negrito.
* **Rastreamento negativo em todos os tamanhos:** Ao contrário da maioria dos sistemas que rastreiam apenas títulos, a Apple aplica um sutil espaçamento negativo entre letras mesmo em tamanhos de corpo (-0.374px em 17px, -0.224px em 14px, -0.12px em 12px). Isso cria um texto universalmente compacto e eficiente.
* **Amplitude extrema de altura de linha:** Títulos comprimem para 1.07 enquanto o texto do corpo abre para 1.47, e alguns contextos de botões chegam a 2.41. Essa amplitude dramática cria uma hierarquia visual clara apenas através do ritmo.

## 4. Estilização de Componentes

### Botões
**Azul Primário (CTA)**
* Fundo: #0071e3 (Azul Apple)
* Texto: #ffffff
* Preenchimento (Padding): 8px 15px
* Raio (Radius): 8px
* Borda: 1px sólida transparente
* Fonte: SF Pro Text, 17px, peso 400
* *Hover*: fundo brilha ligeiramente
* Ativo: mudança de fundo para #ededf2
* Foco: contorno de 2px sólido var(--sk-focus-color, #0071E3)
* Uso: Chamada para ação primária ("Comprar", "Comprar iPhone")

**Escuro Primário**
* Fundo: #1d1d1f
* Texto: #ffffff
* Preenchimento: 8px 15px
* Raio: 8px
* Fonte: SF Pro Text, 17px, peso 400
* Uso: CTA secundário, variante escura

**Link Pílula (Saiba Mais / Comprar)**
* Fundo: transparente
* Texto: #0066cc (fundo claro) ou #2997ff (fundo escuro)
* Raio: 980px (pílula completa)
* Borda: 1px sólida #0066cc
* Fonte: SF Pro Text, 14px-17px
* *Hover*: decoração com sublinhado
* Uso: links "Saiba mais" e "Comprar" — o CTA de linha exclusivo da Apple

**Botão de Filtro / Busca**
* Fundo: #fafafc
* Texto: rgba(0, 0, 0, 0.8)
* Preenchimento: 0px 14px
* Raio: 11px
* Borda: 3px sólida rgba(0, 0, 0, 0.04)
* Foco: contorno de 2px sólido var(--sk-focus-color, #0071E3)
* Uso: Barras de busca, controles de filtro

**Controle de Mídia**
* Fundo: rgba(210, 210, 215, 0.64)
* Texto: rgba(0, 0, 0, 0.48)
* Raio: 50% (circular)
* Ativo: escala(0.9), o fundo muda
* Foco: contorno de 2px sólido var(--sk-focus-color, #0071e3), fundo branco, texto preto
* Uso: Reproduzir/pausar, setas de carrossel

### Cartões e Recipientes
* Fundo: #f5f5f7 (claro) ou #272729-#2a2a2d (escuro)
* Borda: nenhuma (bordas são raras no sistema da Apple)
* Raio: 5px-8px
* Sombra: rgba(0, 0, 0, 0.22) 3px 5px 30px 0px para cartões de produtos elevados
* Conteúdo: centralizado, preenchimento generoso
* *Hover*: sem estado de *hover* padrão — os cartões são estáticos, os links dentro deles são interativos

### Navegação
* Fundo: rgba(0, 0, 0, 0.8) (escuro translúcido) com *backdrop-filter: saturate(180%) blur(20px)*
* Altura: 48px (compacto)
* Texto: #ffffff em 12px, peso 400
* Ativo: sublinhado ao passar o mouse
* Logotipo: Logomarca da Apple (SVG) centralizada ou alinhada à esquerda, *viewport* de 17x48px
* Mobile: colapsa para hambúrguer com menu de sobreposição em tela cheia
* *A navegação flutua sobre o conteúdo, mantendo seu vidro translúcido escuro independentemente do fundo da seção.*

### Tratamento de Imagem
* Produtos em campos de cor sólida (preto ou branco) — sem fundos, sem contexto, apenas o objeto.
* Imagens de seção *full-bleed* que abrangem toda a largura do *viewport*.
* Fotografia de produto em altíssima resolução com sombras sutis.
* Imagens de estilo de vida confinadas a recipientes de cantos arredondados (raio de 12px+).

### Componentes Distintivos

**Módulo Hero de Produto**
* Seção de largura total do *viewport* com fundo sólido (preto ou #f5f5f7).
* Nome do produto como título principal (SF Pro Display, 56px, peso 600).
* Descritor de uma linha abaixo em peso mais leve.
* Dois CTAs pílula lado a lado: "Saiba mais" (contorno) e "Comprar" (preenchido).

**Bloco de Grade de Produto (Tile)**
* Cartão quadrado ou quase quadrado em fundo contrastante.
* Imagem do produto dominando 60-70% do bloco.
* Nome do produto + descrição de uma linha abaixo.
* Par de links "Saiba mais" e "Comprar" na parte inferior.

**Faixa de Comparação de Recursos**
* Rolagem horizontal de variantes de produtos.
* Cada variante como um cartão vertical com imagem, nome e especificações principais.
* Cromo mínimo — os produtos falam por si mesmos.

## 5. Princípios de Layout

### Sistema de Espaçamento
* Unidade base: 8px
* Escala: 2px, 4px, 5px, 6px, 7px, 8px, 9px, 10px, 11px, 14px, 15px, 17px, 20px, 24px
* Característica notável: a escala é densa em tamanhos pequenos (2-11px) com incrementos granulares de 1px, depois salta em passos maiores. Isso permite microajustes precisos para tipografia e alinhamento de ícones.

### Grade (Grid) e Recipiente
* Largura máxima do conteúdo: aproximadamente 980px (o recorrente "raio de 980px" nos botões pílula ecoa essa largura).
* Hero: seções de largura total do *viewport* com bloco de conteúdo centralizado.
* Grades de produtos: layouts de 2-3 colunas dentro de recipiente centralizado.
* Coluna única para momentos *hero* — um produto, uma mensagem, atenção total.
* Sem linhas de grade ou calhas visíveis — o espaçamento cria a estrutura implícita.

### Filosofia do Espaço em Branco
* **Espaço de respiração cinematográfico:** Cada seção de produto ocupa uma altura total de *viewport* (ou próximo disso). O espaço em branco entre os produtos não é vazio — é a pausa entre as cenas de um filme.
* **Ritmo vertical através de blocos de cor:** Em vez de usar apenas o espaçamento para separar seções, a Apple usa cores de fundo alternadas (preto, #f5f5f7, branco). Cada mudança de cor sinaliza uma nova "scene".
* **Compressão interna, expansão externa:** Blocos de texto são definidos de forma apertada (rastreamento negativo, alturas de linha compactas) enquanto o espaço ao redor deles é vasto. Isso cria uma tensão entre densidade e abertura.

### Escala de Raio de Borda
* Micro (5px): Recipientes pequenos, etiquetas de link.
* Padrão (8px): Botões, cartões de produtos, recipientes de imagem.
* Confortável (11px): Entradas de busca, botões de filtro.
* Grande (12px): Painéis de recursos, recipientes de imagens de estilo de vida.
* Pílula Completa (980px): Links de CTA ("Saiba mais", "Comprar"), pílulas de navegação.
* Círculo (50%): Media controles (reproduzir/pausar, setas).

## 6. Profundidade e Elevação

| Nível | Tratamento | Uso |
| :--- | :--- | :--- |
| Plano (Nível 0) | Sem sombra, fundo sólido | Seções de conteúdo padrão, blocos de texto |
| Vidro de Navegação | *backdrop-filter: saturate(180%) blur(20px)* em *rgba(0,0,0,0.8)* | Barra de navegação fixa — o efeito de vidro |
| Elevação Sutil (Nível 1) | *rgba(0, 0, 0, 0.22) 3px 5px 30px 0px* | Cartões de produtos, elementos flutuantes |
| Controle de Mídia | Fundo *rgba(210, 210, 215, 0.64)* com transformações de escala | Botões de reproduzir/pausar, controles de carrossel |
| Foco (Acessibilidade) | Contorno de 2px sólido #0071e3 | Foco do teclado em todos os elementos interativos |

**Filosofia de Sombra:** A Apple usa sombras de forma extremamente econômica. A sombra primária (3px 5px 30px com 0.22 de opacidade) é suave, ampla e deslocada — imitando uma luz de estúdio difundida lançando uma sombra natural sob um objeto físico. Isso reforça a metáfora do "produto como escultura física". A maioria dos elementos não possui NENHUMA sombra; a elevação vem do contraste da cor de fundo (cartão escuro em fundo mais escuro, ou cartão claro em cinza ligeiramente diferente).

### Profundidade Decorativa
* **Vidro de navegação:** a barra de navegação translúcida e desfocada é o elemento de profundidade mais reconhecível, criando uma sensação de interface flutuante acima do conteúdo que rola.
* **Transições de cor de seção:** a profundidade é implícita pela alternância entre seções pretas e cinza claro, em vez de sombras.
* **Sombras de fotografia de produto:** os próprios produtos lançam sombras em suas fotografias, para que a interface não precise adicionar sombras sintéticas.

## 7. O que Fazer e Não Fazer

### Fazer
* Use SF Pro Display em 20px+ e SF Pro Text abaixo de 20px — respeite o limite de dimensionamento óptico.
* Aplique espaçamento negativo entre letras em todos os tamanhos de texto (não apenas títulos) — a Apple rastreia de forma apertada universalmente.
* Use o Azul Apple (#0071e3) APENAS para elementos interativos — ele deve ser o acento singular.
* Alterne entre fundos de seção pretos e cinza claro (#f5f5f7) para um ritmo cinematográfico.
* Use o raio de pílula de 980px para links de CTA — a forma de link exclusiva da Apple.
* Mantenha a imagem do produto em campos de cores sólidas sem elementos visuais concorrentes.
* Use o vidro escuro translúcido (*rgba(0,0,0,0.8)* + *blur*) para navegação fixa.
* Comprima as alturas de linha dos títulos para 1.07-1.14 — os títulos da Apple são famosamente apertados.

### Não Fazer
* Não introduza cores de destaque adicionais — todo o orçamento cromático é gasto no azul.
* Não use sombras pesadas ou várias camadas de sombra — o sistema de sombras da Apple é uma sombra difusa suave ou nada.
* Não use bordas em cartões ou recipientes — a Apple quase nunca usa bordas visíveis (exceto em botões específicos).
* Não aplique espaçamento amplo entre letras na SF Pro — ela foi projetada para ser apertada em todos os tamanhos.
* Não use pesos 800 ou 900 — o máximo é 700 (negrito), e mesmo isso é raro.
* Não adicione texturas, padrões ou gradientes aos fundos — apenas cores sólidas.
* Não torne a navegação opaca — o efeito de desfoque de vidro é essencial para a identidade da interface da Apple.
* Não alinhe o texto do corpo ao centro — o texto do corpo da Apple é alinhado à esquerda; apenas títulos centralizam.
* Não use cantos arredondados maiores que 12px em elementos retangulares (980px é apenas para pílulas).

## 8. Comportamento Responsivo

### Pontos de Quebra (Breakpoints)
| Nome | Largura | Mudanças Principais |
| :--- | :--- | :--- |
| Mobile Pequeno | <360px | Suporte mínimo, coluna única |
| Mobile | 360-480px | Layout móvel padrão |
| Mobile Grande | 480-640px | Coluna única mais larga, imagens maiores |
| Tablet Pequeno | 640-834px | Grades de produtos de 2 colunas começam |
| Tablet | 834-1024px | Layout de tablet completo, navegação expandida |
| Desktop Pequeno | 1024-1070px | Layout de desktop padrão começa |
| Desktop | 1070-1440px | Layout completo, largura máxima do conteúdo |
| Desktop Grande | >1440px | Centralizado com margens generosas |

### Alvos de Toque
* CTAs primários: preenchimento de 8px 15px criando uma altura de toque de ~44px.
* Links de navegação: altura de 48px com espaçamento adequado.
* Controles de mídia: botões circulares de raio de 50%, mínimo de 44x44px.
* Pílulas "Saiba mais": preenchimento generoso para um toque confortável.

### Estratégia de Colapso
* Títulos Hero: 56px Display → 40px → 28px no celular, mantendo a altura de linha apertada proporcionalmente.
* Grades de produtos: 3 colunas → 2 colunas → coluna única empilhada.
* Navegação: navegação horizontal completa → menu móvel compacto (hambúrguer).
* Módulos Hero de produto: largura total mantida em todos os tamanhos, o texto diminui de escala.
* Fundos de seção: mantém blocos de cor de largura total em todos os pontos de quebra — o ritmo cinematográfico nunca quebra.
* Dimensionamento de imagem: os produtos escalam proporcionalmente, nunca cortam — a silhueta do produto é sagrada.

### Comportamento da Imagem
* A fotografia do produto mantém a proporção em todos os pontos de quebra.
* Imagens de produtos Hero diminuem de escala, mas permanecem centralizadas.
* Fundos de seção *full-bleed* persistem em todos os tamanhos.
* Imagens de estilo de vida podem ser cortadas no celular, mas mantêm seus cantos arredondados.
* *Lazy loading* para imagens de produtos abaixo da dobra.