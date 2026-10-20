/**
 * Servidor de testes E2E (Playwright).
 *
 * - Força NODE_ENV=test => SQLite em memória (NUNCA toca no banco real) e sem rate limit.
 * - Troca o cliente do Supabase por um falso: o chatHandler grava mensagens do socket pelo
 *   Supabase e, sem rede/credenciais, o chat em tempo real não funcionaria nos testes.
 *   O persistência de verdade continua sendo feita pelos models Sequelize (SQLite).
 * - Sobe o app de produção sem alterações; só o ambiente é de teste.
 */
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'e2e-jwt-secret';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5273';

const { randomUUID } = require('crypto');
const supabaseModule = require('@supabase/supabase-js');

const fakeSupabase = {
  from() {
    return {
      insert(rows) {
        const row = Array.isArray(rows) ? rows[0] : rows;
        return {
          select: () => ({
            single: async () => ({
              data: { id: randomUUID(), created_at: new Date().toISOString(), ...row },
              error: null
            })
          })
        };
      },
      update: () => ({ eq: async () => ({ error: null }) }),
      delete: () => ({ eq: async () => ({ error: null }) })
    };
  }
};
supabaseModule.createClient = () => fakeSupabase;

const { server, sequelize } = require('../server');

const PORT = Number(process.env.E2E_BACKEND_PORT || 3101);

(async () => {
  await sequelize.sync({ force: true });
  server.listen(PORT, () => console.log(`[E2E] Backend de teste em http://localhost:${PORT}`));
})();
