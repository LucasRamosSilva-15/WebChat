Até agora eu avancei mais no frontend e deixei uma base inicial do backend criada para o projeto não ficar totalmente sem estrutura.

Como faltam só 4 dias, acho importante a gente focar no MVP e não tentar implementar tudo que foi planejado. Algumas funções mais avançadas, como denúncia completa, banimento, recuperação de senha, confirmação de e-mail, painel admin completo, áudio, gifs e notificações, provavelmente não vão dar tempo agora.

O backend precisa seguir uma estrutura RESTful para as rotas principais. Ou seja, cadastro, login, usuários, salas e mensagens devem funcionar por API REST. O Socket.IO deve ficar mais focado na parte de tempo real, como envio/recebimento de mensagens ao vivo e contador de usuários online.

O que já tem feito/adiantado:

Frontend:
- Páginas principais já montadas: Home, Login, Register, Rooms, Chat, Profile/Custom, Settings/Configurações, About e 404.
- Navbar e Footer funcionando.
- Layout principal do chat estruturado com ChatSidebar, Chat.jsx e MembersSidebar.
- Sistema visual principal com tema claro/escuro.
- Customização de cor principal e cor/fundo.
- Interface de salas.
- Interface de mensagens.
- Favoritar salas.
- Campo de envio de mensagem.
- Upload/exibição de imagem no chat.
- Busca local por palavras nas mensagens do Chat.jsx.
- Estado vazio para salas sem mensagens.
- Avatar padrão para usuários sem foto.
- Rotas privadas no frontend para páginas internas.
- Algumas funções ainda estão mockadas ou usando dados locais.

Backend:
- Criei uma base inicial com server.js e package.json/dependências.
- A ideia era deixar preparado para Express + Socket.IO.
- Mas o backend ainda não está completo de verdade.
- Falta organizar as rotas RESTful, conexão com banco, autenticação, segurança e integração real com o frontend.

O que falta fazer no backend para o MVP:

1. Arquitetura RESTful
- Organizar o backend usando Express.
- Criar rotas REST para autenticação, usuários, salas e mensagens.
- Retornar dados em JSON.
- Usar status HTTP corretos.
- Separar rotas/controllers/services se der tempo, sem complicar demais.

Rotas principais esperadas:
- POST /auth/register
- POST /auth/login
- GET /auth/me
- GET /rooms
- POST /rooms
- GET /rooms/:id
- POST /rooms/:id/join
- GET /rooms/:id/messages
- POST /rooms/:id/messages
- PUT /messages/:id, se der tempo
- DELETE /messages/:id, se der tempo

2. Autenticação
- Registro de usuário.
- Login.
- Logout/token.
- Segurança com JWT (JSON Web Tokens).
- Criptografia de senha com bcrypt ou argon2.
- Middleware para proteger rotas privadas.

3. Usuários
- Salvar usuário no banco.
- Buscar dados do usuário logado.
- Atualizar perfil, se der tempo.
- Foto/avatar pode ficar para depois, se não der tempo.

4. Salas
- Listar salas.
- Criar sala.
- Entrar em sala.
- Verificar limite de usuários por sala.
- Buscar membros da sala.
- Favoritar sala, se for ficar persistido no backend.

5. Mensagens
- Salvar mensagens no banco.
- Buscar histórico de mensagens por sala.
- Enviar mensagem.
- Editar mensagem, se der tempo.
- Apagar mensagem, se der tempo.
- Upload de imagem, se der tempo ou se já estiver parcialmente pronto.

6. Tempo real com Socket.IO
- Configurar Socket.IO.
- Entrar em sala via socket.
- Enviar mensagem em tempo real.
- Receber nova mensagem.
- Atualizar contador de usuários online.
- Corrigir contador de usuários online se ele ainda estiver impreciso.

7. Banco de dados
- Definir e organizar o banco, de preferência PostgreSQL/Supabase.
- Criar tabelas principais:
- users
- rooms
- messages
- room_members
- favorites, se necessário.

8. Segurança
- JWT para autenticação.
- bcrypt ou argon2 para senha.
- CORS liberado apenas para o domínio do frontend.
- Variáveis sensíveis no .env.
- Não salvar senha em texto puro.
- Validar dados recebidos no backend.
- Proteger rotas que exigem login.
- Garantir que ações como editar/apagar mensagem sejam validadas no backend, não só no frontend.

9. Testes
- Usar Jest ou Vitest para testes básicos.
- Testar pelo menos:
- cadastro/login;
- criação/listagem de salas;
- envio/busca de mensagens;
- autenticação/token;
- rotas protegidas.

10. Deploy
- Backend na Render.
- Frontend na Vercel.
- Configurar variáveis de ambiente.
- Liberar CORS para o domínio do frontend.
- Testar integração frontend + backend.

Prioridade nesses 4 dias:
1. Backend RESTful básico funcionando.
2. Login/registro funcionando com JWT + bcrypt/argon2.
3. Salas funcionando.
4. Mensagens funcionando com banco.
5. Socket.IO funcionando em tempo real.
6. Contador online básico.
7. Testes básicos com Jest ou Vitest.
8. Deploy funcionando na Render.

O resto, se não der tempo, a gente deixa como funcionalidade futura.

E se tiver tendo dificuldade para implementar esse tanto de coisa, eu posso ajudar também. A gente pode dividir por partes: uma pessoa fica com autenticação, outra com salas/mensagens, outra com Socket.IO/testes/deploy. 
