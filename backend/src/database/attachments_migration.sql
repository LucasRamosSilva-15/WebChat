-- Anexos (áudio gravado e documentos) nas mensagens de salas e directs.
-- Rode UMA vez no SQL Editor do Supabase (o sequelize.sync() não altera tabelas existentes).
ALTER TABLE messages        ADD COLUMN IF NOT EXISTS attachment_url  TEXT;
ALTER TABLE messages        ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(100);
ALTER TABLE messages        ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);
ALTER TABLE messages        ADD COLUMN IF NOT EXISTS attachment_size INTEGER;

ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_url  TEXT;
ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(100);
ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);
ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_size INTEGER;
