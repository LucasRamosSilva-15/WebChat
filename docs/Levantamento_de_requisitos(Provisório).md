# Documento de Especificação de Requisitos: Projeto WebChat

Apresenta-se a seguir a reestruturação profissional do levantamento de requisitos do sistema WebChat, fundamentada nos princípios de análise e projeto de sistemas. A organização divide as especificações em funções do sistema (Requisitos Funcionais) e atributos e restrições do sistema (Requisitos Não-Funcionais), classificando-as quanto à sua visibilidade e obrigatoriedade.

---

## 1. Visão Geral e Objetivos do Sistema
A finalidade deste projeto é criar uma plataforma de WebChat focada na comunicação por mensagens instantâneas e sincronizadas em tempo real. O sistema deve permitir que os usuários realizem cadastros, naveguem entre páginas, escolham salas virtuais ou criem suas próprias salas para interação e personalizem seus perfis.

---

## 2. Requisitos Funcionais (RF)
Os requisitos funcionais definem exatamente o que o sistema deve fazer. Seguindo as melhores práticas, as funcionalidades foram identificadas e listadas com suas respectivas categorias (Evidente/Oculta e Obrigatória/Opcional).

| Ref # | Função do Sistema | Categoria (Visibilidade) | Categoria (Prioridade) |
| :--- | :--- | :--- | :--- |
| **RF01** | Processar mensagens instantâneas e sincronizadas em tempo real entre os usuários. | Evidente | Obrigatória |
| **RF02** | Efetuar o cadastro e login para acesso ao sistema. Os usuários podem se cadastrar utilizando seu E-mail e Senha ou através de sua conta Google. | Evidente | Obrigatória |
| **RF03** | Efetuar o logout do usuário da sessão atual. | Evidente | Obrigatória |
| **RF04** | Realizar a criação de novas salas de bate-papo. | Evidente | Obrigatória |
| **RF05** | Permitir a criação e votação de enquetes dentro das salas. | Evidente | Opcional |
| **RF06** | Permitir o envio de imagens nas conversas. | Evidente | Opcional |
| **RF07** | Exibir informações prévias e status nas mensagens (Data, enviada ou não, visto ou não). | Evidente | Obrigatória |
| **RF08** | Possibilitar a navegação estruturada entre as diferentes páginas do sistema. | Evidente | Obrigatória |
| **RF09** | Permitir a customização do perfil pelo próprio dono da conta. | Evidente | Obrigatória |
| **RF10** | Permitir a visualização do perfil de outros usuários. | Evidente | Obrigatória |
| **RF11** | Prover um sistema de denúncia contra comportamentos errados ou inadequados. | Evidente | Obrigatória |
| **RF12** | Prover um painel de administração geral das salas criadas pelo usuário administrador. | Oculta (para usuários comuns) | Obrigatória |
| **RF13** | Executar o banimento de usuários de salas específicas. | Oculta (para usuários comuns) | Obrigatória |
| **RF14** | Prover ferramentas de busca para localização de conteúdos ou usuários. | Evidente | Obrigatória |
| **RF15** | Permitir a criação de salas privadas que requerem senha para acesso. | Evidente | Opcional |
| **RF16** | permitir o envio de áudio nas conversas. | Evidente | Opcional |
| **RF17** | permitir o envio de vídeo nas conversas. | Evidente | Opcional |
| **RF18** | permitir o envio de gifs nas conversas. | Evidente | Obrigatória |
| **RF19** | permitir o envio de emojis nas conversas. | Evidente | Obrigatória |
| **RF20** | prover ferramentas de busca para localização de salas criadas. | Evidente | Obrigatória | 

---

## 3. Requisitos Não-Funcionais (RNF)
Os requisitos não-funcionais definem as qualidades, atributos e restrições tecnológicas do sistema.

| Ref # | Atributo | Detalhes e Restrições | Categoria |
| :--- | :--- | :--- | :--- |
| **RNF01** | Plataforma de Software (Front-End) | A interface do usuário deve ser construída obrigatoriamente utilizando as ferramentas React.js, Tailwind-css e HTML. | Obrigatória |
| **RNF02** | Plataforma de Software (Back-End) | A lógica do servidor deve ser processada utilizando JavaScript via Node.js e o framework Express.js. | Obrigatória |
| **RNF03** | Desempenho e Comunicação | A comunicação em tempo real para as mensagens e salas deve ser garantida pela utilização da biblioteca Socket.io. | Obrigatória |
| **RNF04** | Armazenamento e Banco de Dados | Os dados transacionais e de usuários devem ser persistidos em um banco de dados relacional PostgreSQL, gerenciado através do Supabase. | Obrigatória |
| **RNF05** | Hospedagem (Front-End) | O sistema front-end deve ser implantado na plataforma Vercel ou Netlify. A Vercel é o melhor para o projeto com React/Vite. (obs: A hospedagem ainda vai ser definida no futuro). | Obrigatória |
| **RNF06** | Segurança e Privacidade | Os dados pessoais dos usuários e as conversas nos chats devem ter criptografia utilizando JWT (JSON Web Tokens) e bcrypt. | Obrigatória |
| **RNF07** | Hospedagem (Back-End) | O servidor Node.js com Socket.io deve ser hospedado em uma plataforma que suporte WebSockets (conexões contínuas), como **Render** ou **Railway**. A Vercel não é adequada para o back-end do projeto. (obs: A hospedagem ainda vai ser definida no futuro). | Obrigatória |