ALTER TABLE messages        ADD COLUMN IF NOT EXISTS attachment_url  TEXT;
ALTER TABLE messages        ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(100);
ALTER TABLE messages        ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);
ALTER TABLE messages        ADD COLUMN IF NOT EXISTS attachment_size INTEGER;

ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_url  TEXT;
ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_type VARCHAR(100);
ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_name VARCHAR(255);
ALTER TABLE direct_messages ADD COLUMN IF NOT EXISTS attachment_size INTEGER;
