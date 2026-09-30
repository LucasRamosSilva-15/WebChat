# Roteiro Backend (Etapa 3) - Tarefas Restantes

Este documento serve como guia do que já foi feito e do que você (meu amigo) precisa focar agora para finalizarmos a Etapa 3.

---

## ✅ O que já está PRONTO (Minha parte)

1. **Configuração do ORM (Sequelize):**
   - Instalamos o `sequelize` e o `pg` (PostgreSQL).
   - O arquivo de conexão está pronto em `src/config/database.js`.

2. **Criação dos Models (Entidades):**
   - Mapeamos o banco de dados inteiro para objetos JS em `src/models/` (`User.js`, `Room.js`, `Message.js`, `Report.js`, `Feedback.js`, e `index.js`).
   - Os relacionamentos (`hasMany`, `belongsTo`) já estão configurados.

3. **Camadas Repository e Service:**
   - Criamos a pasta `src/repositories/` contendo todas as queries ao banco (ex: `UserRepository.findByEmail()`).
   - Criamos a pasta `src/services/` contendo as regras de negócio (ex: Hashear senhas, verificar se email existe, regras para deletar salas).

---

## 🚀 O que VOCÊ PRECISA FAZER AGORA (Sua parte)

Sua missão é pegar a lógica que já está nos `Services` e ligá-la às requisições da web (HTTP), organizando tudo em `Controllers`, e depois criar os testes automatizados para provar que tudo funciona.

### 1. Criar a Camada de Controllers (`src/controllers/`)
Você precisa criar os controladores que vão receber as requisições (`req`), chamar os nossos `Services`, e devolver a resposta (`res`).
- [ ] Criar `UsuarioController.js` (Lida com login, registro e listagem chamando o `UserService`).
- [ ] Criar `RoomController.js` (Criar salas, listar, apagar chamando o `RoomService`).
- [ ] Criar `MessageController.js`.
- [ ] Criar `ReportController.js`.
- [ ] Criar `FeedbackController.js`.

**Exemplo rápido do seu Controller:**
```javascript
const UserService = require('../services/UserService');

class UsuarioController {
  async register(req, res) {
    try {
      const user = await UserService.register(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}
module.exports = new UsuarioController();
```

### 2. Refatorar as Rotas (`src/routes/`)
Atualmente, as nossas rotas (`src/routes/api.js` e `admin.js`) têm muita regra de banco misturada nelas e usam as requisições antigas do Supabase. 
- [ ] Limpar a lógica de banco de dentro dos arquivos de rotas.
- [ ] Importar os Controllers que você criou e passá-los para as rotas do Express.
- *(Opcional)*: Se quiser seguir à risca o PDF, divida em vários arquivos como `usuarioRoutes.js`, `produtoRoutes.js` (no nosso caso `roomRoutes.js`), e importe no `app.js` ou `server.js`.

### 3. Escrever os Testes Automatizados (`tests/`)
O PDF do professor pede a criação de arquivos de teste (`tests/usuario.test.js`, `tests/produto.test.js` - no nosso caso, salas/mensagens).
- [ ] Configurar um banco de teste em memória (SQLite) usando o Sequelize.
- [ ] Fazer testes para ver se os `Models` salvam os dados corretamente (Testes Unitários).
- [ ] Fazer testes das rotas e Controllers usando o `supertest` para simular requisições (Testes de Integração).

---

## 💡 Dicas Importantes

- Não faça chamadas diretas ao `Model` nem ao banco dentro do seu Controller! Sempre importe o `Service` equivalente e chame as funções dele.
- Os meus `Services` já jogam `throw new Error(...)` se algo der errado (como senha incorreta). O seu Controller só precisa envelopar isso em um `try/catch` e devolver um status HTTP correspondente (ex: `400 Bad Request`).

Boa sorte e manda ver nos Controllers! Qualquer dúvida sobre como usar os meus Services, me avisa.
