import React, { useState } from 'react';
import { Copy, Reply, Trash2, Pencil, Pin, AlertTriangle, Star, Check } from 'lucide-react';
import MobileSheet from './MobileSheet';
import { formatFullDateTime } from '../../utils/dateUtils';

export default function MessageActionsSheet({
  isOpen,
  onClose,
  message,
  onReact,
  onCopy,
  onReply,
  onEdit,
  onPin,
  isPinned = false,
  canPin = false,
  onReport,
  onFavorite,
  isFavorite = false,
  onDelete
}) {
  const [reporting, setReporting] = useState(false);
  const [reportReason, setReportReason] = useState('Spam');
  const [reportSuccess, setReportSuccess] = useState(false);

  if (!message) return null;

  const emojis = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

  const handleEmojiClick = (emoji) => {
    if (onReact) {
      onReact(emoji, message);
    }
    handleClose();
  };

  const handleCopyClick = () => {
    if (onCopy) {
      onCopy(message);
    } else {
      const textToCopy = message.content || message.text || '';
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy);
      }
    }
    handleClose();
  };

  const handleReplyClick = () => {
    if (onReply) {
      onReply(message);
    }
    handleClose();
  };

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(message);
    }
    handleClose();
  };

  const handlePinClick = () => {
    if (onPin) {
      onPin(message);
    }
    handleClose();
  };

  const handleFavoriteClick = () => {
    if (onFavorite) {
      onFavorite(message);
    }
    handleClose();
  };

  const handleDeleteClick = () => {
    if (onDelete) {
      onDelete(message);
    }
    handleClose();
  };

  const handleSendReport = async () => {
    if (onReport) {
      await onReport(message, reportReason);
    }
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setReporting(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    setReporting(false);
    setReportSuccess(false);
    onClose();
  };

  return (
    <MobileSheet
      isOpen={isOpen}
      onClose={handleClose}
      title={reporting ? 'Denunciar Mensagem' : 'Ações da Mensagem'}
    >
      {reporting ? (
        <div className="space-y-4 py-2">
          {reportSuccess ? (
            <div className="p-4 rounded-2xl skeuo-well text-center space-y-2">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                Denúncia Enviada
              </div>
              <p className="text-[11px] text-slate-400">
                A moderação irá auditar esta mensagem.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Selecione o motivo da denúncia contra a mensagem de <strong>{message.sender}</strong>:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {['Spam', 'Ofensivo', 'Conteúdo Indevido', 'Assédio'].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setReportReason(reason)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl transition-all min-h-[44px] ${
                      reportReason === reason
                        ? 'skeuo-btn-primary text-white shadow-sm'
                        : 'btn-secondary-glossy text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setReporting(false)}
                  className="btn-secondary-glossy flex-1 min-h-[44px] text-xs font-semibold rounded-xl"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleSendReport}
                  className="skeuo-btn-primary flex-1 min-h-[44px] text-xs font-bold text-white rounded-xl shadow-md !bg-rose-600 !border-rose-700"
                >
                  Confirmar Denúncia
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 py-1">
          {message && (
            <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold truncate mr-2">{message.sender || 'Mensagem'}</span>
              <span className="shrink-0">{formatFullDateTime(message.time, message.created_at || message.timestamp)}</span>
            </div>
          )}
          <div className="flex items-center justify-around gap-1.5 p-2 rounded-2xl skeuo-well">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleEmojiClick(emoji)}
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center text-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs active:scale-90 transition-transform cursor-pointer"
                aria-label={`Reagir com ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          <div className="p-2 rounded-2xl skeuo-well space-y-1.5">
            <button
              type="button"
              onClick={handleCopyClick}
              className="btn-secondary-glossy w-full min-h-[44px] px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold justify-start active:scale-[0.98] transition-transform"
            >
              <Copy className="w-4 h-4 text-sky-500" />
              <span>Copiar Texto</span>
            </button>

            <button
              type="button"
              onClick={handleReplyClick}
              className="btn-secondary-glossy w-full min-h-[44px] px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold justify-start active:scale-[0.98] transition-transform"
            >
              <Reply className="w-4 h-4 text-indigo-500" />
              <span>Responder / Citar</span>
            </button>

            {(message?.isMine || message?.isMe) && (
              <button
                type="button"
                onClick={handleEditClick}
                className="btn-secondary-glossy w-full min-h-[44px] px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold justify-start active:scale-[0.98] transition-transform text-amber-600 dark:text-amber-400"
              >
                <Pencil className="w-4 h-4 text-amber-500" />
                <span>Editar Mensagem</span>
              </button>
            )}

            {canPin && (
              <button
                type="button"
                onClick={handlePinClick}
                className="btn-secondary-glossy w-full min-h-[44px] px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold justify-start active:scale-[0.98] transition-transform"
              >
                <Pin className={`w-4 h-4 ${isPinned ? 'text-amber-500 fill-amber-500' : 'text-slate-500'}`} />
                <span>{isPinned ? 'Desfixar Mensagem' : 'Fixar no Topo'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleFavoriteClick}
              className="btn-secondary-glossy w-full min-h-[44px] px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold justify-start active:scale-[0.98] transition-transform"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-500 fill-amber-500' : 'text-amber-500'}`} />
              <span>{isFavorite ? 'Remover dos Favoritos' : 'Favoritar Mensagem'}</span>
            </button>

            {!(message?.isMine || message?.isMe) && (
              <button
                type="button"
                onClick={() => setReporting(true)}
                className="btn-secondary-glossy w-full min-h-[44px] px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold justify-start active:scale-[0.98] transition-transform text-slate-600 dark:text-slate-400"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Denunciar Mensagem</span>
              </button>
            )}

            {(message?.isMine || message?.isMe) && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="btn-secondary-glossy w-full min-h-[44px] px-4 py-2.5 rounded-xl flex items-center gap-3 text-xs font-semibold justify-start !text-rose-600 dark:!text-rose-400 active:scale-[0.98] transition-transform"
              >
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Apagar Mensagem</span>
              </button>
            )}
          </div>
        </div>
      )}
    </MobileSheet>
  );
}
