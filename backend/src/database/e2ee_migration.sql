-- E2EE nos directs: chave pública do usuário (JWK ECDH P-256).
-- Rode UMA vez no SQL Editor do Supabase. A chave privada nunca é enviada ao servidor.
ALTER TABLE users ADD COLUMN IF NOT EXISTS public_key TEXT;
