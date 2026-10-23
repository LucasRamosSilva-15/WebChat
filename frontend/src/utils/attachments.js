export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const MAX_RECORDING_SECONDS = 120;

export const DOCUMENT_TYPES = [
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
];

export const DOCUMENT_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip';

const EXT_TO_TYPE = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
  zip: 'application/zip'
};

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1).replace('.0', '')} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.0', '')} MB`;
};

export const formatDuration = (seconds) => {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export const resolveDocumentType = (file) => {
  if (file.type && DOCUMENT_TYPES.includes(file.type)) return file.type;
  const ext = (file.name || '').split('.').pop().toLowerCase();
  return EXT_TO_TYPE[ext] || null;
};

export const readFileAsDataUrl = (blobOrFile) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error || new Error('Falha ao ler o arquivo.'));
    reader.readAsDataURL(blobOrFile);
  });

const withMime = (dataUrl, mime) => dataUrl.replace(/^data:[^,]*,/, `data:${mime};base64,`);

export async function documentFileToAttachment(file) {
  const type = resolveDocumentType(file);
  if (!type) throw new Error('Tipo de arquivo não suportado. Envie PDF, Word, Excel, PowerPoint, TXT, CSV ou ZIP.');
  if (file.size > MAX_ATTACHMENT_BYTES) throw new Error('O arquivo excede o limite de 5 MB.');
  if (file.size === 0) throw new Error('O arquivo está vazio.');
  const url = withMime(await readFileAsDataUrl(file), type);
  return { url, type, name: file.name, size: file.size };
}

export async function audioBlobToAttachment(blob) {
  if (blob.size > MAX_ATTACHMENT_BYTES) throw new Error('A gravação excede o limite de 5 MB.');
  const baseType = (blob.type || 'audio/webm').split(';')[0];
  const url = withMime(await readFileAsDataUrl(blob), baseType);
  const ext = baseType.split('/')[1]?.replace('x-', '') || 'webm';
  return { url, type: baseType, name: `audio-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.${ext}`, size: blob.size };
}

export const normalizeAttachment = (src) => {
  if (!src) return null;
  if (src.attachment && src.attachment.url) return src.attachment;
  if (src.attachment_url) {
    return {
      url: src.attachment_url,
      type: src.attachment_type,
      name: src.attachment_name,
      size: src.attachment_size,
      kind: (src.attachment_type || '').startsWith('audio/') ? 'audio' : 'document'
    };
  }
  return null;
};
