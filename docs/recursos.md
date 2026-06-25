# SkyRipple - Recursos e Funcionalidades (Frontend)

**Data inicial:** 19/05/2026  
**Última atualização:** 12/06/2026  
**Status geral:** Em desenvolvimento  

**Nota:** Este arquivo (`Recursos.md`) é usado para documentar os recursos próximos da versão atual do projeto, listando o que já foi feito e o que está pendente no escopo principal. Ideias mais distantes e novas páginas planejadas foram separadas na seção de **Ideias Futuras**, e também podem ser encontradas no arquivo `Planos_Futuros.md`.

---

## Legenda de Status

- ✅ **Concluído:** Totalmente finalizado no frontend.
- 🟡 **Parcialmente implementado:** A interface/UI está pronta, mas faltam detalhes ou integração.
- 🔴 **Pendente:** Ainda não iniciado ou faltando fazer.
- 🔵 **Depende do backend:** A lógica exige desenvolvimento ou suporte da equipe do backend.
- 🟣 **Ideia futura:** Planejado para o futuro, sem prioridade no momento.
- ⚠️ **Precisa revisar / bug:** Implementado, mas apresenta erros e precisa de correções.
- ⚪ **Observação:** Teve que mudar umas coisas para conseguir fazer funcionar ou implementar.

---

## Resumo Geral

A base estrutural do frontend está muito bem encaminhada com uma identidade visual clara (Skeuomorfismo). O sistema de roteamento, personalização de temas, layout principal das salas e painéis de navegação estão **Concluídos**. As funções de moderação (silenciar, banir, denunciar) e a persistência real de autenticação estão em estado **Parcial** ou **Dependendo do Backend**. Existem alguns detalhes **Pendentes** relacionados a envio de mídias (áudio, gifs) e suporte multi-idioma.

---

## Recursos por Página

### Chat.jsx

*Status: A interface principal está construída e estilizada. As interações básicas funcionam, restando pendências de mídia e moderação avançada.*

- ✅ Adicionar um limite de pessoas por sala ativa
- ✅ Marcar mensagem como favorita
- ✅ Filtro para mostrar somente mensagens favoritas
- ✅ Data e hora dinâmica nas mensagens
- ✅ Botão para sair da sala
- ✅ Mostrar quantidade de usuários online na sala
- ✅ Opção de apagar mensagens próprias (intervalo 24h)
- ✅ Sistema de armazenamento de mensagens
- ✅ Sistema de envio de imagens
- ✅ Sistema de edição de mensagens próprias
- ✅ Sistema de curtir mensagem e ver quantidade de curtidas
- ✅ Envio de mensagens em tempo real
- ✅ Arrumar bugs visuais
- ✅ Refinamento visual/redesign (Web 2.0 / Skeuomorfismo)
- ✅ Novo layout de 3 colunas (Sidebar, Chat Central e Painel de Membros)
- ✅ Estado vazio (Empty State) para salas sem mensagens
- ✅ Suporte a mensagens exclusivas do sistema (System Messages)
- ✅ Corrigir botões sem ação
- 🟡 Chat privado entre usuários
- 🟡 Botão para silenciar usuário (UI pronta, depende do backend)
- 🟡 Botão para denunciar usuário (UI pronta)
- 🟡 Sistema de administração da sala
- 🟡 Sistema de cargos para usuários (dono, moderador, usuário)
- 🟡 Mostrar os usuários presentes (MembersSidebar adicionado)
- 🟡 Sistema de fixar mensagem (UI base implementada, restrito admin)
- 🟡 Busca de mensagens (geral ou por usuário)
- 🔵 Botão para deletar sala (admin/dono)
- 🔵 Botão para banir usuário
- 🔵 Botão para denunciar sala
- 🔴 Sistema de envio de áudio
- 🔴 Sistema de envio de gifs
- 🔴 Sistema de envio de emojis
- ⚠️ Mostrar o sidebar direito e o esquerdo para mobile com botão de mostrar/ocultar.
- ✅ Tela de Confirmação de Entrada — pergunta se o usuário deseja entrar na sala e bloqueia a conexão via WebSocket até a aprovação.
- ✅ Tela de erro de "Sala Cheia" — exibe erro específico barrando a renderização do chat quando a sala bate a capacidade máxima.
- ✅ Telas de erro de conexão — exibe mensagem caso não consiga conectar ao backend ou a sala não for encontrada.
- 🟡 Componente UserAvatar — usado no chat para renderizar as fotos ou iniciais, mas o status de online ainda precisa aprimoramento em tempo real.
- ⚠️ Melhorar o sistema de chat privado
- ✅ Adicionar uma tela de carregamento

### Rooms.jsx

*Status: Listagem, filtros e apresentação consolidadas. Pendências concentradas em moderação de salas.*

- ✅ Arrumar bugs visuais
- ✅ Caixinha que mostra a quantidade de usuários
- ✅ Caixinha que mostra a data da criação da sala
- ✅ Mostrar quantidade total de membros na sala
- ✅ Botão para favoritar sala
- ✅ Implementar filtro por categoria
- ✅ Sistema visual de sala cheia
- ✅ Mostrar a lista de salas criadas
- ✅ Mostrar quantidade total de salas criadas
- ✅ Mostrar quantidade total de usuários globais
- 🔴 Fazer a caixinha de denúncias funcionar
- 🔴 Botão de denunciar sala
- 🔵 Criar um sistema profundo de denúncias
- ⚠️ Melhorar contador de usuários online (correção de contagem incorreta)
- ✅ Modal de Criação de Sala — overlay interativo com formulário para definir nome, capacidade e categoria da nova sala.
- ✅ Barra de pesquisa por texto — barra interativa que filtra as salas criadas em tempo real ao digitar.
  - ⚪ **Observação:** A busca atualmente funciona filtrando as salas em memória (no frontend). Caso hajam centenas de salas futuras, precisará virar uma busca via API.
- ⚠️ Corrigir erro de duplicação de salas quando cria uma sala
- 🔴 Fazer o sistema de busca funcionar direto na API
- 🔴 Fazer os botões de administração da sala
- 🔴 Fazer o sistema de cargos
- 🔴 Fazer o sistema de denúncias

### Login.jsx & Register.jsx

*Status: Telas criadas e parcialmente funcionais, dependendo da finalização da API para autenticação real.*

- ✅ Login funcional (frontend e backend)
- ✅ Registro funcional (frontend e backend)
- 🟡 Opção de login/registro via Google (interface criada)
- 🔵 Sistema de recuperação de senha
- 🔵 Sistema de confirmação de e-mail
- ✅ Tratamento visual de erros — exibe mensagens de erro em balões de alerta vermelhos se a autenticação falhar.
- ✅ Loader visual nos botões — botões de login e registro ficam desabilitados e mostram "Entrando..." durante o carregamento da API.
- ✅ Autenticação com JWT — salva o token e gerencia o login global comunicando a interface com eventos locais (`profileUpdated`).

### Custom.jsx (Perfil)

*Status: Página desenvolvida e testada para gerenciar as personalizações locais da conta do usuário.*

- ✅ Customização de Perfil — permite alterar foto, nome de exibição e recado/status.
  - ⚪ **Observação:** Atualmente salva os dados apenas no armazenamento local do navegador (`localStorage`), aguardando persistência definitiva no banco de dados.
- ✅ Preview de avatar em tempo real — a imagem da foto escolhida via input file é processada (FileReader) e exibida na tela antes de ser salva.
- ✅ Feedback de sucesso (Toast) — exibe uma notificação rápida no rodapé da página após salvar as alterações.

### About.jsx

*Status: Página recriada e alinhada à nova identidade visual.*

- ✅ Atualizar a caixinha "A Hospedagem"
- ✅ Inserir informações sobre o site e o projeto
- ✅ Refinamento visual aplicado (novo layout Skeuomórfico completo)

### Navbar.jsx

*Status: Estrutura, botões de ação e temas estão sólidos. Faltam idiomas e notificações globais.*

- ✅ Sistema de modo escuro e claro
- ✅ Adicionar opção de configurações (Movido e expandido para a página dedicada Settings.jsx)
- ✅ Corrigir bugs visuais
- ✅ Adicionar ícones consistentes
- 🔴 Sistema de alteração de idioma
- 🔴 Ícone e sistema de notificações recebidas na barra
- ✅ Menu Mobile / Dropdown Animado — menu interativo com transições suaves para navegação em telas pequenas.
- ✅ Painel de Perfil Rápido — exibe miniatura do avatar e nome do usuário diretamente na navegação se estiver logado.
- ✅ Sistema de Logout — desloga o usuário limpando credenciais e disparando atualizações sem necessidade de recarregar a página (reload forçado).

### NotFound.jsx (Erros)

*Status: Página básica 404 criada, precisa evoluir para capturar falhas variadas.*

- ✅ Criar página de erro 404
- 🔴 Adicionar tratamento para outros tipos de erros
- 🟡 Mostrar código do tipo de erro
- ✅ Mostrar imagem relacionada ao erro
- 🟡 Mostrar mensagem explicativa
- ✅ Adicionar botão de voltar para a página inicial

### 🌐 Geral (Estilo, Infraestrutura e Layout)

- ✅ Navegação funcional do sistema
- ✅ Proteger rotas (Chat, Rooms, Custom restritos a logados)
- ✅ Padronizar avatar sem foto nos painéis
- ✅ Refinamento visual de diversas páginas
- ✅ Testar novos layouts estruturais
- ✅ Identidade visual única estabelecida (Clássica/Retrô-Moderna Web 2.0)
- ✅ Corrigir modo escuro global
- ✅ Se logado na Home, alterar chamada para "Escolher uma sala"
- ✅ Sistema central de escolha de cores do tema
- ✅ Sistema central de escolha do background
- ✅ Sistema de autenticação (login/logout) básico
- ✅ Adaptação para telas menores (notebooks, celulares, etc)
- 🔵 Controle de acesso via ID para páginas administrativas
- 🔵 Criptografia ponta-a-ponta (senhas, emails e mensagens)
- 🔴 Duas nuvens de background laterais para enfeite visual
- 🔴 Sistema e aba central de notificações
- 🔴 Seleção e suporte multi-idiomas
- ✅ Ajeitar o visual do botão primário no modo escuro
- 🔵 Refatorar as classes do tailwind css 4
- 🔵 Adicionar animações suaves em várias partes do site e também em ações feitas na página
- 🔵 Colocar o site no ar usando domínio próprio (ex: <www.skyripple.com.br>)

---

## 🔮 Ideias Futuras (Planos_Futuros.md)

As seguintes páginas, módulos e documentos representam ideias de longo prazo e foram movidas logicamente para o planejamento futuro. Não são prioridades na versão atual.

### Páginas e Telas

- 🟡 **Admin.jsx:** Sala de administração global. Painel centralizado e concluído com banimento de usuários, moderação, filtros de data e gravidade, lista de denúncias e análise avançada de relatórios, evidências e logs de chat (UI/Frontend pronto, falta integração com o backend).
- 🟡 **Settings.jsx:** Página dedicada inteiramente para as configurações do usuário (UI/Frontend pronto, falta integração com o backend).
- 🟣 **ServerStatus.jsx:** Página contendo os status em tempo real do backend, ping, imagens e informações de queda de servidor.
- 🟣 **RoomConfig.jsx:** Página aprofundada de configurações internas e regras que gerem uma sala específica.
- 🟡 **Feedback.jsx:** Página interativa implementada com botões, anexos e categorias (UI/Frontend pronto, falta integração com o backend).
- 🟣 **Suporte.jsx:** Tela mostrando salas banidas, denúncias ativas, e um FAQ interativo.

### Documentações

- ✅ **README.md Principal:** Apresentação oficial para a raiz do repositório (Criado e completo).
- 🟣 **Manuais:** Criar documentações sobre o código, a API, os testes, as tecnologias empregadas, os protocolos de segurança, design system (além do atual), diagramas de banco de dados, fluxos de backend/frontend, processos de deploy e um guia de uso final.
