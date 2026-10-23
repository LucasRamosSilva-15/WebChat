const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  audio: ['audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-wav', 'audio/x-m4a', 'audio/aac'],
  document: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'text/csv',
    'application/zip'
  ]
};

const DATA_URL_RE = /^data:([a-z0-9.+\-\/]+)(?:;[a-z0-9=.\-]+)*;base64,([A-Za-z0-9+/]+={0,2})$/i;

const kindOf = (mime) => {
  if (ALLOWED_TYPES.audio.includes(mime)) return 'audio';
  if (ALLOWED_TYPES.document.includes(mime)) return 'document';
  return null;
};

function validateAttachment(attachment) {
  if (!attachment) return null;
  if (typeof attachment !== 'object' || typeof attachment.url !== 'string') {
    throw new Error('Anexo inválido.');
  }

  const match = DATA_URL_RE.exec(attachment.url);
  if (!match) {
    throw new Error('Anexo inválido: formato de arquivo não reconhecido.');
  }

  const mime = match[1].toLowerCase();
  if (!kindOf(mime)) {
    throw new Error('Tipo de arquivo não permitido.');
  }
  if (attachment.type && String(attachment.type).split(';')[0].toLowerCase() !== mime) {
    throw new Error('Tipo de arquivo não confere com o conteúdo.');
  }

  const base64 = match[2];
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const bytes = Math.floor((base64.length * 3) / 4) - padding;
  if (bytes <= 0) throw new Error('Anexo vazio.');
  if (bytes > MAX_ATTACHMENT_BYTES) {
    throw new Error('O arquivo excede o limite de 5 MB.');
  }

  const rawName = typeof attachment.name === 'string' ? attachment.name : '';
  const name = rawName.replace(/[\u0000-\u001f\\/]/g, '').trim().slice(0, 255) || (kindOf(mime) === 'audio' ? 'audio' : 'arquivo');

  return {
    attachment_url: attachment.url,
    attachment_type: mime,
    attachment_name: name,
    attachment_size: bytes
  };
}

function toAttachmentView(row) {
  if (!row || !row.attachment_url) return null;
  return {
    url: row.attachment_url,
    type: row.attachment_type,
    name: row.attachment_name,
    size: row.attachment_size,
    kind: kindOf(row.attachment_type)
  };
}

module.exports = { validateAttachment, toAttachmentView, kindOf, ALLOWED_TYPES, MAX_ATTACHMENT_BYTES };
