CREATE INDEX IF NOT EXISTS idx_messages_room_created_at
  ON public.messages (room_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_direct_messages_conv_created_at
  ON public.direct_messages (conversation_id, created_at DESC);
