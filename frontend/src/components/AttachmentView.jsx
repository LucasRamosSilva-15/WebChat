import { FaFileAlt, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileArchive, FaDownload } from 'react-icons/fa';
import { formatFileSize } from '../utils/attachments';

const renderIcon = (type = '') => {
  const props = { size: 22, className: 'shrink-0 text-sky-600' };
  if (type.includes('pdf')) return <FaFilePdf {...props} />;
  if (type.includes('word')) return <FaFileWord {...props} />;
  if (type.includes('sheet') || type.includes('excel') || type === 'text/csv') return <FaFileExcel {...props} />;
  if (type.includes('presentation') || type.includes('powerpoint')) return <FaFilePowerpoint {...props} />;
  if (type.includes('zip')) return <FaFileArchive {...props} />;
  return <FaFileAlt {...props} />;
};

/** Exibe um anexo: player para áudio ou cartão de download para documentos. */
export default function AttachmentView({ attachment, className = '' }) {
  if (!attachment || !attachment.url) return null;
  const isAudio = attachment.kind === 'audio' || (attachment.type || '').startsWith('audio/');

  if (isAudio) {
    return (
      <div className={`mt-1 mb-0.5 ${className}`} data-testid="attachment-audio">
        <audio controls preload="metadata" src={attachment.url} className="max-w-[240px] h-10" aria-label="Mensagem de voz" />
      </div>
    );
  }

  return (
    <a
      href={attachment.url}
      download={attachment.name || 'arquivo'}
      className={`mt-1 mb-0.5 flex items-center gap-2 max-w-[260px] rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-slate-800/60 px-3 py-2 no-underline text-inherit hover:bg-white dark:hover:bg-slate-700 transition-colors ${className}`}
      data-testid="attachment-document"
      title={`Baixar ${attachment.name || 'arquivo'}`}
    >
      {renderIcon(attachment.type)}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-semibold">{attachment.name || 'arquivo'}</span>
        <span className="block text-[11px] opacity-70">{formatFileSize(attachment.size)}</span>
      </span>
      <FaDownload size={12} className="shrink-0 opacity-60" />
    </a>
  );
}
