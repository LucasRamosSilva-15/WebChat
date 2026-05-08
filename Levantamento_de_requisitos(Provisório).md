# Documento de Especificação de Requisitos: Projeto WebChat

Apresenta-se a seguir a reestruturação profissional do levantamento de requisitos do sistema WebChat, fundamentada nos princípios de análise e projeto de sistemas. A organização divide as especificações em funções do sistema (Requisitos Funcionais) e atributos e restrições do sistema (Requisitos Não-Funcionais), classificando-as quanto à sua visibilidade e obrigatoriedade.

---

## 1. Visão Geral e Objetivos do Sistema
A finalidade deste projeto é criar uma plataforma de WebChat focada na comunicação por mensagens instantâneas e assíncronas. O sistema deve permitir que os usuários realizem cadastros, naveguem entre páginas, escolham salas virtuais para interação e possuam controle sobre seus perfis.

---

## 2. Requisitos Funcionais (RF)
Os requisitos funcionais definem exatamente o que o sistema deve fazer. Seguindo as melhores práticas, as funcionalidades foram identificadas e listadas com suas respectivas categorias (Evidente/Oculta e Obrigatória/Opcional).

| Ref # | Função do Sistema | Categoria (Visibilidade) | Categoria (Prioridade) |
| :--- | :--- | :--- | :--- |
| **RF01** | Processar mensagens instantâneas e assíncronas entre os usuários. | Evidente | Obrigatória |
| **RF02** | Efetuar o cadastro e login para acesso ao sistema. | Evidente | Obrigatória |
| **RF03** | Efetuar o logout do usuário da sessão atual. | Evidente | Obrigatória |
| **RF04** | Realizar a criação de novas salas de bate-papo. | Evidente | Obrigatória |
| **RF05** | Permitir a criação e votação de enquetes dentro das salas. | Evidente | Opcional |
| **RF06** | Permitir o envio de imagens nas conversas. | Evidente | Opcional |
| **RF07** | Exibir informações prévias e status nas mensagens (Data, enviada ou não, visto ou não). | Evidente | Obrigatória |
| **RF08** | Possibilitar a navegação estruturada entre as diferentes páginas do sistema. | Evidente | Obrigatória |
| **RF09** | Permitir a customização de perfil pelo próprio dono da conta. | Evidente | Obrigatória |
| **RF10** | Permitir a visualização do perfil alheio por outros participantes. | Evidente | Obrigatória |
| **RF11** | Prover um sistema de denúncia contra comportamentos inadequados. | Evidente | Obrigatória |
| **RF12** | Prover um painel de administração geral do sistema. | Oculta (para usuários comuns) | Obrigatória |
| **RF13** | Executar o banimento de usuários de salas específicas. | Oculta (para usuários comuns) | Obrigatória |
| **RF14** | Prover ferramentas de busca para localização de conteúdos ou usuários. | Evidente | Obrigatória |

---

## 3. Requisitos Não-Funcionais (RNF)
Os requisitos não-funcionais definem as qualidades, atributos e restrições tecnológicas do sistema.

| Ref # | Atributo | Detalhes e Restrições | Categoria |
| :--- | :--- | :--- | :--- |
| **RNF01** | Plataforma de Software (Front-End) | A interface do usuário deve ser construída obrigatoriamente utilizando as ferramentas React.js, Tailwind-css e HTML. | Obrigatória |
| **RNF02** | Plataforma de Software (Back-End) | A lógica do servidor deve ser processada utilizando JavaScript via Node.js e o framework Express.js. | Obrigatória |
| **RNF03** | Desempenho e Comunicação | A comunicação em tempo real para as mensagens e salas deve ser garantida pela utilização da biblioteca Socket.io. | Obrigatória |
| **RNF04** | Armazenamento e Banco de Dados | Os dados transacionais e de usuários devem ser persistidos em um banco de dados relacional PostgreSQL, gerenciado através do Supabase. | Obrigatória |
| **RNF05** | Disponibilidade e Hospedagem | O sistema front-end deve ser implantado e hospedado na plataforma Vercel. | Obrigatória |