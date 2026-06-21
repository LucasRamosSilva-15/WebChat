# Documento de Levantamento de Requisitos

## 1. Identificação do Projeto

**Nome do Sistema:** SkyRipple  
**Versão do Documento:** 6.9.2  
**Data:** 18/06/2026  

**Responsável pela Elaboração:** Wssihélio Medeiros, Lucas Ramos, Ruan Victor e Gustavo Lobão  

**Stakeholders envolvidos:**  
- **Usuários Finais** - Chat para entrar em salas, enviar mensagens e personalizar seu perfil
- **Moderadores e Donos de Sala** - Usuários responsáveis por organizar as conversas e utilizar permissões especiais dentro das salas
- **Desenvolvedores do Projeto** - Integrantes do grupo responsável pela implementação, manutenção e correção do sistema.
- **Equipe de Frontend** - Responsável pela interface, responsividade, experiência visual e telas do sistema
- **Equipe de Backend** - Responsável pela API, autenticação, banco de dados e comunicação em tempo real
- **Professor/Orientador** - Responsável por avaliar o projeto, os requisitos e a documentação

## 2. Contexto e Objetivo

**Descrição Geral:** O SkyRipple é um aplicativo web de chat em tempo real onde os usuários podem se conectar, entrar em salas temáticas e trocar mensagens instantâneas. O projeto foca em uma experiência rica e nostálgica, trazendo uma estética clean com identidade visual inspirada na Web 2.0 Gloss (Skeuomorfismo e com influências do Frutiger Aero) aliada às tecnologias web modernas.

**Objetivo do Sistema:** Promover uma experiência nostálgica de webchat

## 3. Escopo do Sistema

**Funcionalidades Incluídas:** Login e Cadastro, Listagem e Favoritação de Salas, Chat em Tempo Real, Personalização de Perfil, Feedback, etc.

**Funcionalidades Excluídas:** Sistema de administração de salas, Criação de novas salas, etc.

## 4. Usuários e Perfis

**Tipos de Usuários:** Administrador, Usuário Moderador e Usuário Final

**Permissões de cada perfil:**

- **Administrador** - Os desenvolvedores do projeto têm controle total sobre o projeto, incluindo gestão de contas, segurança, configurações globais e permissões de outros usuários.
- **Usuário Moderador** - Os criadores de salas podem gerenciar conteúdos criados por terceiros, aprovar publicações ou gerenciar equipes menores dentro de suas salas
- **Usuário Final** - Pessoa que utiliza o sistema para conversas normalmente do chat, possuindo acesso limitado a todas as funcionalidades

## 5. Requisitos Funcionais (RF)

| Código | Requisito Funcional | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| RF01 | 1.Realizar Login e Cadastro | 1.O usuário deve realizar o login, estando apto a realizar o cadastro após isso | 1.Evidente |
| RF02 | 2.Favoritar Salas | 2.O usuário pode favoritar suas salas favoritas | 2.Evidente |
| RF03 | 3.O Chat Deve Ser em Tempo Real | 3. O usuário deve se comunicar com outros em tempo real | 3.Evidente |
| RF04 | 4.Personalizar Perfil | 4. O usuário deve conseguir personalizar o seu perfil | 4.Evidente |
| RF05 | 5.O Usuário Deve Poder Trocar o Tema Visual | 5.O usuário deve poder trocar o tema visual de claro para escuro e vice-versa | 5.Evidente |
| RF06 | 6.Realizar Feedback | 6. O usuário poderá enviar sua opinião acerca do sistema para a equipe de desenvolvimento | 6.Evidente |

## 6. Requisitos Não Funcionais (RNF)

| Código | Requisito Não Funcional | Descrição | Prioridade |
| :--- | :--- | :--- | :--- |
| RNF01 | Desempenho | Bom desempenho | Obrigatório |
| RNF02 | Tempo de Resposta | Espontâneo, tempo rea | Obrigatório |
| RNF03 | Facilidade de Uso | O sistema deve ser simples | Obrigatório |
| RNF04 | Rapidez | O sistema deve ser rápido | Obrigatório |

## 7. Regras de Negócio

1. O usuário precisa estar cadastrado para acessar as funcionalidades principais do chat.
2. O usuário precisa fazer login para entrar nas salas e enviar mensagens.
3. Usuários não autenticados podem acessar páginas públicas, como Home, Login, Cadastro e Sobre.
4. Cada usuário deve possuir um perfil com nome, foto/avatar e descrição.
5. O usuário pode personalizar seu perfil, e essas informações devem ser refletidas na interface do sistema.
6. As salas devem ser listadas para que o usuário escolha onde deseja conversar.
7. O usuário pode entrar em uma sala disponível para participar da conversa.
8. As mensagens enviadas em uma sala devem aparecer para os usuários daquela sala.
9. O sistema deve permitir comunicação em tempo real entre os usuários conectados.
10. O usuário pode enviar mensagens de texto no chat.
11. O sistema pode permitir envio de imagens no chat, caso a funcionalidade esteja implementada.
12. O usuário pode buscar mensagens dentro do chat, se a busca estiver disponível.
13. O usuário pode favoritar salas ou mensagens, caso essa funcionalidade esteja habilitada.
14. Donos ou moderadores de salas podem ter permissões especiais, como fixar mensagens, editar, excluir ou moderar conteúdos, conforme as regras implementadas.
15. O sistema deve diferenciar visualmente usuários comuns, donos e moderadores.
16. O sistema deve impedir ações inválidas, como enviar mensagem vazia.
17. O sistema deve exibir estados de erro ou aviso quando uma ação não puder ser concluída.
18. O sistema deve manter uma interface responsiva, funcionando em desktop e dispositivos móveis.
19. O sistema deve possuir modo claro e modo escuro para melhorar a experiência do usuário.
20. As funcionalidades que ainda não estiverem completas devem ser indicadas como em desenvolvimento.
