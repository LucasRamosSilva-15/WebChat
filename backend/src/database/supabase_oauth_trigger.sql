-- ==============================================================================
-- SkyRipple - Trigger de Sincronização Automática para Google OAuth no Supabase
-- ==============================================================================
-- Este script configura o disparo automático no Supabase (PostgreSQL) para
-- herdar dados de autenticação OAuth de auth.users para as tabelas públicas (users e profiles):
--   - name: extraído de user_metadata.full_name ou user_metadata.name (ou fallback do email)
--   - avatar_url: extraído de user_metadata.avatar_url ou picture
--   - email: extraído do registo principal do OAuth
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_oauth_user()
RETURNS TRIGGER AS $$
DECLARE
  v_name TEXT;
  v_avatar TEXT;
BEGIN
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1),
    'Usuário'
  );

  v_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NULL
  );

  INSERT INTO public.users (
    id,
    email,
    "displayName",
    "profilePhoto",
    role,
    status,
    created_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    v_name,
    v_avatar,
    'user',
    'active',
    NOW()
  )
  ON CONFLICT (email) DO UPDATE SET
    "displayName" = COALESCE(EXCLUDED."displayName", public.users."displayName"),
    "profilePhoto" = COALESCE(EXCLUDED."profilePhoto", public.users."profilePhoto");

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    INSERT INTO public.profiles (
      id,
      email,
      name,
      avatar_url,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      v_name,
      v_avatar,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = COALESCE(EXCLUDED.name, public.profiles.name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
      updated_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_oauth_user();
