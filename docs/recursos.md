# Lista de recursos que falta no frontend:
# alguns recursos não são obrigatórios implementar, apenas se a gente conseguir implementar.
# Data:19/05/2026
# Ultima autalização: 9/06/2026
# Status: Em desenvolvimento

# Na Chat.jsx

- [X] adicionar um limite de quantas pessoas podem ter uma sala ativa
- [X] (Parcialmente) adicionar chat privado entre usuarios, onde somente os usuarios possam ver
- [ ] adicionar botão para deletar sala (apenas o admin ou o dono da sala) (vou precisa da minha equipe do backend para adicionar isso)
- [X] (Parcialmente) adicionar botão para silenciar usuário (apenas admin e dono) (vou precisa da minha equipe do backend para adicionar isso)
- [ ] adicionar botão para banir usuário (apenas admin, dono e moderador) (vou precisa da minha equipe do backend para adicionar isso)
- [X] (Parcialmente) adicionar botão para denunciar usuário (vou precisa da minha equipe do backend para adicionar isso)
- [ ] adicionar botão para denunciar sala (vou precisa da minha equipe do backend para adicionar isso)
- [X] adicionar botão para marcar mensagem como favorita (faltar adicionar no futuro um filtro que mostrar somente as mensagens favoritas)
- [X] adicionar um filtro que mostrar somente as mensagens favoritas
- [X] adicionar a data da mensagem (se foi hoje mostrar so hora, se foi ontem mostrar ontem, se foi em outro dia mostrar dia, mes e ano)
- [X] adicionar botão para sair da sala
- [X] (Parcialmente) adicionar um sistema de administração da sala (vou precisa da minha equipe do backend para adicionar isso)
- [X] (Parcialmente) adicionar sistema de cargo para usuarios (dono, moderador, usuario) (vou precisa da minha equipe do backend para adicionar isso)
- [X] mostrar quantidade de usuarios onlines na sala
- [X] (Parcialmente) mostrar os usuários que estão dentro da sala (Painel lateral direito MembersSidebar adicionado)
- [X] adicionar a opção de apagar as mensagens enviada pelo usuário em um intervalo de 24 horas
- [X] sistema de armazenamento de mensagens
- [X] adicionar sistema de envio de imagens
- [X] adicionar um sistema de edição das mensagens enviada pelo usuário
- [X] ( Parcialmente ) ter um sistema de fixar mensagem (apenas admin) (vou precisa da minha equipe do backend para adicionar isso - UI base implementada)
- [X] adicionar um sistema de curtir mensagem (e mostrar a quantidade de curtida)
- [X] ter um sistema de envio de mensagens em tempo real
- [X] arrumar bugs visuais
- [ ] adicionar sistema de envio de áudio
- [ ] adicionar sistema de envio de gifs
- [ ] adicionar sistema de envio de emojis
- [X] refinamento visual ou redesign (Chat.jsx totalmente reestilizado para Web 2.0 / Skeuomorphism)
- [X] implementar novo layout de 3 colunas (Sidebar de Navegação, Chat Central e Painel de Membros)
- [X] adicionar estado vazio (Empty State) intuitivo para salas sem mensagens
- [X] adicionar suporte a mensagens exclusivas do sistema (System Messages)
- [X] corrigir botões que não faz nada
- [X] ( Parcialmente ) adicionar uma busca de mensagens ou as mensagens de um determinado usuario
# Na Rooms.jsx

- [X] arrumar bugs visuais
- [X] fazer a caixinha que mostra quantidade de usuarios funcionar corretamente
- [X] fazer a caixinha que mostra a data da sala funcionar corretamente
- [ ] fazer a caixinha de denuncias funcionar corretamente
- [X] mostrar a quantidade de usuários que tem uma sala
- [X] adicionar botão para favoritar sala 
- [X] implementar filtro por categoria
- [ ] adicionar um botão de denunciar sala
- [ ] criar um sistema de denuncias
- [X] adicionar um sistema de sala cheia
- [X] mostrar as salas criadas
- [X] mostrar quantas salas foram criadas
- [X] mostrar quantidade de usuários 
- [ ] melhorar o sistema que mostra os usuários onlines (o sistema atual tá muito errado, pois mostra que tem 6 usuários onlines, sendo que tem apenas 1)
# Na Suporte.jsx (ideia de pagina) (vou precisa da minha equipe do backend para adicionar isso)

- [ ] mostrar salas que foram denunciadas
- [ ] mostrar usuários que foram denunciados
- [ ] mostrar salas que foram banidas
- [ ] mostrar as suas denuncias
- [ ] ter uma seção de perguntas mais frequentes (FAQ)
- [ ] refinamento visual
# Em Geral

- [ ] adicionar duas nuvens grande no fundo, uma do lado direito e outra do lado esquerdo para dar efeito visual melhor
- [X] ter um sistema login e logout parcialmente funcional
- [X] ter uma navegação funcional
- [X] deixar as paginas Chat.jsx, Rooms.jsx, Custom.jsx, Suporte.jsx e etc somente acessivel para usuarios 
- [X] padronizar avatar sem foto em Navbar, Chat, MembersSidebar e Profile;
- [ ] adicionar que paginas de administração são acessivel com um usuário que tem id espécifico (que são: o admin da sala ou moderador, admin do site ou moderador e pode ser a equipe do site)
- [X] (Parcialmente) refinamento visual ou redesign de algumas paginas (Chat.jsx e componentes satélites totalmente refeitos)
- [X] testar novos layouts (LayoutDemo1 validado e aplicado no Chat principal)
- [X] adicionar uma identidade visual mais unica (Identidade clássica retrô-moderna Web 2.0 definida)
- [X] corrigir o tema escuro e os bugs visuais
- [ ] corrigir o sistema de contador de usuários onlines
- [X] o usuário teve logado em Home.jsx mudar a mensagem principal e botão para entrar em escolher uma sala
- [ ] adicionar um sistema de escolha de idiomas
- [X] adicionar um sistema de escolha de cores
- [X] adicionar um sistema de escolha de cores do fundo  
- [ ] adicionar um sistema de notificações 
- [ ] criar uma aba de notificações
- [ ] adicionar criptografia nos usuarios, nas mensagens, nas senhas e nos emails (e etc)

# Em Login.jsx

- [ ] fazer um sistema de login funcional (vou precisa da minha equipe do backend para adicionar isso)
- [X] ter um sistema de login parcialmente funcional
- [X] adicionar uma opção de fazer o login com a conta google (ainda vamos implementar o sistema no futuro)
- [ ] adicionar um sistema de recuperação de senha (vou precisa da minha equipe do backend para adicionar isso)

# Em Register.jsx

- [ ] fazer um sistema de registro funcional (vou precisa da minha equipe do backend para adicionar isso)
- [X] ter um sistema de registro parcialmente funcional
- [X] adicionar uma opção de fazer o registro com a conta google (ainda vamos implementar o sistema no futuro)
- [ ] implementar sistema de confirmação de email (vou precisa da minha equipe do backend para adicionar isso)

# Na About.jsx

- [X] Atualizar a caixinha A Hospedagem
- [X] Informações sobre o site e o projeto 
- [ ] refinamento visual
- [ ] atualizar layout para um novo layout melhor
# Na Navbar.jsx

- [X] adicionar sistema de modo escuro e claro
- [ ] adicionar sistema de idioma
- [X] adicionar a opção de configurações
- [X] Corrigir bugs visuais
- [X] adicionar icones consistentes
- [ ] criar um sistema de notificação e mostrar um icone na navbarque mostrar as notificações recebidas (no futuro vou criar uma aba de notificações)

# Na Admin.jsx (ideia de pagina) (ideia de sala de administração)

- [ ] implementar sistema de administração (vou precisa da minha equipe do backend para adicionar isso)
- [ ] implementar sistema de banimento de salas (vou precisa da minha equipe do backend para adicionar isso)
- [ ] implementar sistema de banimento de usuarios (vou precisa da minha equipe do backend para adicionar isso)
- [ ] implementar sistema de moderação de salas (vou precisa da minha equipe do backend para adicionar isso)
- [ ] implementar sistema de moderação de usuários (vou precisa da minha equipe do backend para adicionar isso)
- [ ] adicionar um caixinha grande contendo uma listas contendo as denuncias de salas e usuarios (vou precisa da minha equipe do backend para adicionar isso)

# Em Settings.jsx (ideia de pagina) (ideia de configurações)

- [ ] criar pagina de configurações (vou precisa da minha equipe do backend para adicionar isso)

# Em NotFound.jsx (vai vários erros) (ideia de pagina) (ideia de página de erro 404)

- [X] criar pagina de erro 404
- [ ] adicionar outros tipos de erros
- [ ] mostrar tipo de erro
- [ ] mostrar uma imagem relacionada ao erro
- [ ] mostrar uma mensagem relacionada ao erro
- [ ] mostrar um botão de voltar para pagina inicial

# Em ServerStatus.jsx (vai vários status) (ideia de pagina) (ideia de página de status do servidor)

- [ ] criar pagina de status do servidor (vou precisa da minha equipe do backend para adicionar isso)
- [ ] mostrar tipo de status
- [ ] mostrar uma imagem relacionada ao status
- [ ] mostrar uma mensagem relacionada ao status
- [ ] mostrar um botão de voltar para pagina inicial

# Em RoomConfig.jsx (ideia de pagina) (ideia de configurações da sala)

- [ ] criar pagina de configurações da sala (vou precisa da minha equipe do backend para adicionar isso)
- [ ] mostrar um botão de voltar para pagina inicial

# Em Feedback.jsx (ideia de pagina) (ideia de feedback)

- [ ] criar pagina de feedback (vou precisa da minha equipe do backend para adicionar isso)
- [ ] mostrar um botão de voltar para pagina inicial
- [ ] mostrar um botão de enviar feedback
- [ ] mostrar um botão de cancelar
- [ ] mostrar um botão de limpar
- [ ] mostrar um botão de confirmar
- [ ] mostrar um botão de cancelar

# Criar um README.md para o projeto

- [ ] criar pagina de informações sobre o projeto

# Criar várias documentações

- [ ] criar documentação sobre o projeto
- [ ] criar documentação sobre o código
- [ ] criar documentação sobre a API
- [ ] criar documentação sobre os testes
- [ ] criar documentação sobre as tecnologias
- [ ] criar documentação sobre o segurança
- [ ] criar documentação sobre o design
- [ ] criar documentação sobre o banco de dados
- [ ] criar documentação sobre o backend
- [ ] criar documentação sobre o frontend
- [ ] criar documentação sobre o deploy
- [ ] criar documentação sobre o uso