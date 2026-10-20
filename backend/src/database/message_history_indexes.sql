-- Índices do histórico paginado de mensagens (cursor por created_at).
-- O Sequelize cria estes índices em bancos NOVOS (sync). Em bancos que já existem
-- (ex.: Supabase em produção), rode este script uma vez no SQL Editor.

CREATE INDEX IF NOT EXISTS idx_messages_room_created_at
  ON public.messages (room_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_direct_messages_conv_created_at
  ON public.direct_messages (conversation_id, created_at DESC);
