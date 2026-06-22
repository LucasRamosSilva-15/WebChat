# Planos Futuros

## Introdução

Este documento tem como objetivo registrar ideias, melhorias e possíveis expansões futuras para o **SkyRipple**.

A partir deste momento, o arquivo `Recursos.md` deixará de ser o principal local para adicionar novas ideias e funcionalidades futuras. Isso acontece porque o projeto passou a ter uma quantidade muito grande de funcionalidades, telas, ajustes e recursos, tornando difícil acompanhar, marcar e organizar tudo em um único documento.

O `Recursos.md` deve continuar servindo como referência para recursos mais próximos da versão atual do projeto, principalmente funcionalidades já planejadas, implementadas ou diretamente relacionadas ao funcionamento principal do sistema.

Já este arquivo, `Planos_Futuros.md`, será usado para separar melhor as ideias que ainda não fazem parte da versão principal, mas que podem ser desenvolvidas futuramente. Assim, fica mais fácil diferenciar o que é recurso atual, o que ainda é melhoria futura e o que pode ser deixado para uma próxima versão do SkyRipple.

A proposta deste documento não é transformar todas as ideias em obrigação imediata, mas sim manter uma visão organizada da evolução do projeto. Algumas ideias podem ser implementadas depois da entrega principal, enquanto outras podem servir apenas como referência para melhoria de portfólio, expansão técnica ou futuras versões do SkyRipple.

## Objetivo dos Planos Futuros

Os planos futuros representam funcionalidades e melhorias que podem tornar o SkyRipple mais completo, organizado e próximo de uma aplicação real de comunidade/chat. Entre essas possibilidades estão novas telas, novas permissões, melhorias administrativas, aprimoramentos visuais e recursos que exigem mais tempo de desenvolvimento.

Um exemplo de expansão futura é a criação de uma área administrativa, como a recém-criada página `Admin.jsx` (que começou como um plano futuro e agora já faz parte da versão atual do projeto, possuindo controle de denúncias, filtros e relatórios de evidências).

## Melhorias de Comunicação

- **Envio de áudio:** Permitir que os usuários gravem e enviem mensagens de voz diretamente no chat das salas.
  - **Motivo:** Torna a comunicação muito mais rápida, dinâmica e acessível para quem não quer digitar.
  - **Dependência:** Frontend (gravação de mídia) e Backend/Banco de dados (armazenamento e processamento dos arquivos de áudio).
  - **Prioridade sugerida:** Média.

- **Envio de GIFs:** Integrar um seletor e buscador de GIFs animados diretamente na barra de chat.
  - **Motivo:** Enriquece a interação e expressividade dos usuários durante as conversas.
  - **Dependência:** Frontend (integração de API de terceiros, como Giphy ou Tenor) e Backend (transmissão de mensagem do tipo GIF).
  - **Prioridade sugerida:** Média.

- **Envio de emojis:** Incluir um menu popup com seletor completo de emojis ao lado do campo de texto.
  - **Motivo:** Facilita o uso de reações e ícones, principalmente em navegadores desktop.
  - **Dependência:** Frontend.
  - **Prioridade sugerida:** Alta.

- **Ícone e sistema de notificações na barra (Navbar):** Um sistema visual na barra de navegação para alertar sobre novas notificações recebidas.
  - **Motivo:** Garantir que o usuário saiba de novas interações imediatamente, sem precisar mudar de página.
  - **Dependência:** Frontend e Backend (WebSockets).
  - **Prioridade sugerida:** Média.

- **Sistema e aba central de notificações:** Uma seção própria para organizar, ler e gerenciar notificações de menções, reações e mensagens privadas.
  - **Motivo:** Evita a perda de mensagens importantes em salas movimentadas.
  - **Dependência:** Frontend, Backend e Banco de dados.
  - **Prioridade sugerida:** Baixa.

- **Melhorias no chat privado (Direct Messages):** Refinar a lógica de conversação privada e direta entre usuários, permitindo iniciar conversas mais facilmente.
  - **Motivo:** Aumentar as opções de interação particular na plataforma.
  - **Dependência:** Frontend e Backend (WebSockets).
  - **Prioridade sugerida:** Alta.

- **Melhorias em mensagens favoritas:** Expandir a funcionalidade de favoritar mensagens, adicionando busca e filtro por categoria dentro das favoritas.
  - **Motivo:** Facilitar a organização e recuperação de mensagens que o usuário marcou como importantes.
  - **Dependência:** Frontend.
  - **Prioridade sugerida:** Baixa.

- **Busca de mensagens:** Permitir a busca por texto em tempo real de mensagens específicas dentro de uma sala de chat ou globalmente.
  - **Motivo:** Evita rolagem excessiva para encontrar informações compartilhadas no passado.
  - **Dependência:** Frontend e Backend (indexação/busca via API).
  - **Prioridade sugerida:** Média.

## Melhorias de Moderação e Administração

- **Sistema profundo de denúncias:** Um fluxo completo para registrar denúncias de conteúdos, mensagens e usuários problemáticos.
  - **Motivo:** Garantir conformidade com diretrizes de comunidade e manter o ambiente seguro.
  - **Dependência:** Frontend (formulários e modais) e Backend/Banco de dados (processamento e armazenamento das denúncias).
  - **Prioridade sugerida:** Alta.

- **Denunciar usuário:** Botão para reportar um usuário diretamente através do seu perfil ou de suas mensagens no chat.
  - **Motivo:** Agilizar a moderação individual de condutas inadequadas.
  - **Dependência:** Frontend (modais de confirmação) e Backend.
  - **Prioridade sugerida:** Média.

- **Denunciar sala:** Funcionalidade que permite aos usuários reportarem salas que infrinjam os termos da plataforma.
  - **Motivo:** Identificar rapidamente salas criadas para fins nocivos ou ilegais.
  - **Dependência:** Frontend e Backend.
  - **Prioridade sugerida:** Média.

- **Silenciar usuário:** Implementação de backend para impedir que usuários silenciados enviem mensagens nas salas.
  - **Motivo:** Fornecer aos moderadores um meio de intervenção temporária sem banir imediatamente (UI já está pronta no frontend).
  - **Dependência:** Backend.
  - **Prioridade sugerida:** Média.

- **Banir usuário:** Ação administrativa para remover e bloquear de forma permanente ou temporária um usuário.
  - **Motivo:** Manter a ordem nas salas excluindo usuários problemáticos recorrentes.
  - **Dependência:** Frontend e Backend.
  - **Prioridade sugerida:** Alta.

- **Banir sala:** Permitir que administradores gerais suspendam ou apaguem salas inteiras que violam os termos de uso.
  - **Motivo:** Remover focos de descumprimento de regras diretamente na listagem e acesso.
  - **Dependência:** Frontend e Backend.
  - **Prioridade sugerida:** Alta.

- **Sistema de cargos para usuários:** Diferenciação e hierarquia de cargos dentro de uma sala de chat (Ex: Dono, Moderador, Membro).
  - **Motivo:** Organizar quem possui permissões para fixar mensagens, silenciar ou expulsar membros.
  - **Dependência:** Frontend e Backend/Banco de dados.
  - **Prioridade sugerida:** Alta.

- **Moderação/Administração de salas:** Controle e painel interno das salas para aplicar as punições e gerenciar os cargos em tempo real.
  - **Motivo:** Dar autonomia aos donos das salas de chat.
  - **Dependência:** Frontend e Backend.
  - **Prioridade sugerida:** Média.

- **Sistema de fixar mensagem:** Permitir que mensagens importantes sejam fixadas no topo do chat (UI base já implementada).
  - **Motivo:** Garantir que avisos importantes fiquem visíveis para todos os membros que entrarem na sala.
  - **Dependência:** Backend.
  - **Prioridade sugerida:** Média.

## Páginas Futuras

- **Admin.jsx (Painel Administrativo):** Painel centralizado voltado para administradores globais da plataforma SkyRipple.
  - **Motivo:** Gerenciar banimentos globais, analisar fila de denúncias e visualizar feedbacks enviados pelos usuários.
  - **Dependência:** Frontend, Backend e Banco de dados.
  - **Prioridade sugerida:** Média.

- ~~**Settings.jsx:**~~ (Concluído e integrado) Página dedicada inteiramente às configurações e preferências pessoais da conta do usuário.
  - **Motivo:** Retirar as configurações da barra lateral/Navbar e dar uma experiência focada de edição e personalização.
  - **Dependência:** Frontend.
  - **Prioridade sugerida:** Concluído.

- **ServerStatus.jsx:** Página de status do sistema que exibe o tempo de atividade (uptime), ping e latência dos servidores.
  - **Motivo:** Dar transparência aos usuários caso ocorram instabilidades de rede ou manutenção.
  - **Dependência:** Frontend e Equipe/Infraestrutura.
  - **Prioridade sugerida:** Baixa.

- **RoomConfig.jsx:** Página avançada de configurações de cada sala de chat, acessível apenas pelo dono.
  - **Motivo:** Configurações como alteração de categoria, regras personalizadas, restrição de mídias e senhas.
  - **Dependência:** Frontend e Backend.
  - **Prioridade sugerida:** Média.

- **Feedback.jsx (Integração Backend):** A interface interativa já foi desenvolvida. O plano futuro agora é criar o endpoint no backend, configurar persistência em banco de dados e upload real de imagens.
  - **Motivo:** Facilitar a coleta de opiniões sobre bugs e sugestões de melhorias de forma direta.
  - **Dependência:** Backend/Banco de dados e Supabase (Storage).
  - **Prioridade sugerida:** Alta.

- **Suporte.jsx:** Página voltada ao atendimento ao usuário com listagem de salas banidas, denúncias ativas e uma seção de FAQ interativa.
  - **Motivo:** Resolver dúvidas e fornecer transparência quanto a banimentos e processos de suporte.
  - **Dependência:** Frontend.
  - **Prioridade sugerida:** Baixa.

- **Páginas de erro adicionais:** Expandir o tratamento na página de NotFound para capturar outros códigos de erro, como 403 (Proibido) ou 500 (Erro Interno do Servidor).
  - **Motivo:** Apresentar telas informativas e skeuomórficas específicas para cada tipo de falha técnica ou de permissão.
  - **Dependência:** Frontend e Backend.
  - **Prioridade sugerida:** Baixa.

## Melhorias de Conta e Autenticação

- **Sistema de recuperação de senha:** Envio de e-mail de redefinição de senha com link/token seguro para troca de credenciais.
  - **Motivo:** Permitir que usuários redefinam seus acessos com segurança em caso de esquecimento da senha.
  - **Dependência:** Backend e Autenticação/Serviço de e-mail.
  - **Prioridade sugerida:** Alta.

- **Confirmação de e-mail:** Fluxo que exige a verificação da conta do usuário clicando em um link recebido por e-mail após o registro.
  - **Motivo:** Evitar a criação de contas de spam ou com e-mails fictícios.
  - **Dependência:** Backend e Autenticação/Serviço de e-mail.
  - **Prioridade sugerida:** Alta.

- **Login e Registro via Google (Totalmente Funcional):** Integração final com a API OAuth da Google para validação e persistência do token.
  - **Motivo:** Permitir acesso rápido e seguro com apenas um clique (UI básica de login via Google já criada).
  - **Dependência:** Frontend, Backend e Autenticação.
  - **Prioridade sugerida:** Média.

## Melhorias de Interface e Experiência do Usuário

- **Sistema central de escolha de idiomas:** Seleção de idioma (multi-idioma) para traduzir toda a interface do SkyRipple.
  - **Motivo:** Tornar o aplicativo amigável para usuários internacionais.
  - **Dependência:** Frontend.
  - **Prioridade sugerida:** Baixa.

- **Nuvens decorativas de background:** Inclusão de duas nuvens animadas no background lateral da aplicação.
  - **Motivo:** Adicionar detalhes estéticos e micro-animações charmosas que reforcem o visual retro-moderno skeuomórfico.
  - **Dependência:** Frontend.
  - **Prioridade sugerida:** Baixa.

- **Melhorias no contador de usuários online:** Refinamento da contagem e sincronização em tempo real de membros conectados em salas e globalmente.
  - **Motivo:** Solucionar falhas de contagem incorreta e atualizar a quantidade imediatamente.
  - **Dependência:** Frontend e Backend (WebSockets).
  - **Prioridade sugerida:** Alta.

- **Sincronização de status online no UserAvatar:** Exibir com exatidão se o membro do chat está online, ausente ou offline.
  - **Motivo:** Melhorar a experiência visual de quem está ativo na sala de chat no momento (UI criada, necessita atualização de backend).
  - **Dependência:** Frontend e Backend.
  - **Prioridade sugerida:** Média.

## Melhorias Técnicas e Segurança

- **Criptografia ponta-a-ponta:** Criptografar dados sensíveis como mensagens, senhas e e-mails durante o tráfego e armazenamento.
  - **Motivo:** Garantir a máxima privacidade dos dados contra interceptação de tráfego.
  - **Dependência:** Frontend (criptografia na saída) e Backend (armazenamento criptografado).
  - **Prioridade sugerida:** Alta.

- **Controle de acesso baseado em IDs para áreas administrativas:** Restrição rigorosa de acesso de rotas do frontend e endpoints com base no papel/perfil do usuário.
  - **Motivo:** Evitar que usuários comuns burlem o roteamento do frontend e acessem telas de admin.
  - **Dependência:** Frontend, Backend e Autenticação.
  - **Prioridade sugerida:** Alta.

## Documentações Futuras

- **README.md Principal (Concluído):** O manual oficial de apresentação na raiz do repositório foi criado e completo com sucesso.
  - **Motivo:** Guiar novos desenvolvedores sobre como rodar o SkyRipple localmente, listar tecnologias e arquitetura.
  - **Dependência:** Nenhuma (Já finalizado).
  - **Prioridade sugerida:** Concluído.

- **Manuais de Desenvolvimento e Arquitetura:** Documentações avançadas de API, testes unitários e de integração, banco de dados, deploy, frontend/backend e segurança.
  - **Motivo:** Facilitar a expansão saudável e a manutenção do código sem perda de contexto técnico.
  - **Dependência:** Equipe.
  - **Prioridade sugerida:** Baixa.

## Itens que não fazem parte da versão atual

- ~~**Painel administrativo global (`Admin.jsx`):**~~ (Concluído e integrado à versão atual) O gerenciamento centralizado de denúncias e banimentos gerais da plataforma.
- ~~**Página de configurações (`Settings.jsx`):**~~ (Concluído e integrado à versão atual) Hub dedicado e completo para preferências de conta, tema, privacidade e chat.
- **Criptografia avançada (ponta-a-ponta):** Proteção criptográfica direta entre clientes no envio de mensagens.
- **Página de status da API/Servidores (`ServerStatus.jsx`):** Integração com infraestrutura externa de monitoramento.
- **Configurações complexas e customizadas de salas (`RoomConfig.jsx`):** Senha de entrada nas salas, capacidades flutuantes e moderação avançada de cargos.
- **Suporte/FAQ Interativo (`Suporte.jsx`):** Central de ajuda para usuários com visualização de salas banidas e denúncias.
