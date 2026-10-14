# 🚀 Portal de Documentação WebChat (Mintlify)

Este diretório contém a documentação técnica oficial, especificações OpenAPI 3.1 e guias interativos da **WebChat API**, construídos utilizando a plataforma [Mintlify](https://mintlify.com).

---

## 📁 Estrutura de Diretórios

```
docs/
├── mint.json / docs.json      # Configuração central de tema, navegação e abas
├── openapi.json               # Especificação OpenAPI 3.1 completa da API
├── favicon.svg                # Ícone do portal
├── logo/                      # Logotipos para Light e Dark mode
│   ├── dark.svg
│   └── light.svg
├── guides/                    # Guias conceituais e tutoriais aprofundados
│   ├── overview.mdx           # Arquitetura, topologia e ecossistema
│   ├── quickstart.mdx         # Passo a passo inicial (cURL, Node.js e Python)
│   ├── auth-security.mdx      # JWT, bcrypt, User vs Admin e WebSocket
│   ├── communication-standards.mdx # Erros, Rate Limit e Paginação
│   └── webhooks.mdx           # Eventos, assinatura HMAC SHA-256 e retries
├── api-reference/             # Referência interativa de endpoints
│   ├── index.mdx              # Visão geral e status codes
│   ├── auth/                  # Registro, login, perfil e deleção de conta
│   ├── rooms/                 # Criação, listagem, membros e remoção de salas
│   ├── messages/              # Histórico, envio, busca e deleção
│   ├── reports/               # Denúncias de mensagens
│   ├── feedbacks/             # Sugestões e bugs
│   └── admin/                 # Rotas restritas e painel administrativo
└── README.md                  # Este guia de operação e CI/CD
```

---

## 🛠️ Como Executar e Testar Localmente

### 1. Pré-requisitos
- **Node.js**: Versão 18 ou superior (recomendado Node.js 20 LTS).
- **npm**: Versão 9+.

### 2. Iniciar o Servidor de Desenvolvimento
No diretório raiz do projeto, execute:

```bash
npm run docs:dev
```

Ou dentro da própria pasta `docs/`:

```bash
cd docs
npx mintlify dev
```

O portal estará disponível em: **`http://localhost:3000`** (ou `3002` caso a porta 3000 esteja ocupada). O servidor possui hot-reload automático para qualquer edição em arquivos `.mdx` ou `.json`.

### 3. Validar Links e Integridade antes do Commit
Execute o verificador de links e rotas:

```bash
cd docs
npx mintlify broken-links
```

---

## 🤖 Pipeline de CI/CD (GitHub Actions)

O repositório possui uma automação contínua configurada em [`.github/workflows/mintlify-deploy.yml`](../.github/workflows/mintlify-deploy.yml).

### Como o Workflow Funciona:
1. **Pull Requests**: Sempre que um PR for aberto ou atualizado com alterações em `docs/**` ou `backend/**`, o job `validate-docs` é disparado automaticamente para checar a sintaxe do `openapi.json` e verificar se não há links quebrados (`broken-links`). Se houver inconsistências, o merge é bloqueado preventivamente.
2. **Pushes na branch `main` / `master`**: Após a aprovação do PR e merge na branch principal, o job `deploy-docs` é disparado para garantir a sincronização do portal em produção.

---

## 🔑 Configuração de Secrets no GitHub

Para habilitar a sincronização via API do Mintlify no workflow, configure as seguintes variáveis no GitHub:

### Passo a Passo no GitHub:
1. Acesse o repositório no GitHub: `https://github.com/LucasRamosSilva-15/WebChat`
2. Clique na aba **Settings** (Configurações).
3. No menu lateral esquerdo, vá em **Secrets and variables** > **Actions**.
4. Clique no botão **New repository secret**.
5. Crie a secret:
   - **Name**: `MINTLIFY_API_KEY`
   - **Secret**: Insira a chave de API gerada no seu painel da Mintlify.

| Secret Name | Obrigatória? | Descrição |
| :--- | :--- | :--- |
| `MINTLIFY_API_KEY` | Opcional | Token de API obtido no painel do Mintlify para acionar deploys ou autenticar o CLI em pipelines. |

> **Nota**: Se você utiliza a sincronização automática padrão do Mintlify via GitHub App, os pushes na branch principal já atualizam a documentação em produção em tempo real, mesmo sem a secret cadastrada.

---

## 🌐 Como Vincular o Repositório ao Mintlify

1. Acesse o dashboard do Mintlify em [https://dashboard.mintlify.com](https://dashboard.mintlify.com).
2. Clique em **Add Deployment** ou **New Project**.
3. Selecione a opção **Import from GitHub**.
4. Instale o **Mintlify GitHub App** concedendo acesso ao repositório `LucasRamosSilva-15/WebChat`.
5. Indique o diretório raiz da documentação como: `docs`.
6. Selecione a branch de produção padrão (`main`).
7. Clique em **Deploy**. O Mintlify gerará sua URL pública personalizada (ex: `https://webchat.mintlify.app` ou seu domínio customizado).
