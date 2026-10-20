import { useRef, useState, useEffect, useCallback } from 'react';
import { FaPaperclip, FaMicrophone, FaStop, FaTimes } from 'react-icons/fa';
import AttachmentView from './AttachmentView';
import {
  DOCUMENT_ACCEPT,
  MAX_RECORDING_SECONDS,
  documentFileToAttachment,
  audioBlobToAttachment,
  formatDuration
} from '../utils/attachments';

const btn = 'w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer rounded-full bg-gradient-to-b from-white to-gray-100 hover:from-gray-50 hover:to-gray-200 dark:from-slate-700 dark:to-slate-800 dark:hover:from-slate-600 dark:hover:to-slate-700 text-[#86868b] hover:text-[#1d1d1f] dark:text-slate-300 dark:hover:text-white border border-gray-200 dark:border-slate-600 transition-all';

/**
 * Botões de anexar documento e gravar áudio + prévia do anexo pendente.
 * Controlado pelo pai: value = anexo pendente ({url,type,name,size}) ou null.
 */
export default function AttachmentComposer({ value, onChange, disabled = false }) {
  const fileRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const cancelledRef = useRef(false);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');

  const cleanup = useCallback(() => {
    clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setRecording(false);
    setSeconds(0);
  }, []);

  useEffect(() => () => {
    cancelledRef.current = true;
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try { recorderRef.current.stop(); } catch { /* já parado */ }
    }
    cleanup();
  }, [cleanup]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    try {
      onChange(await documentFileToAttachment(file));
    } catch (err) {
      setError(err.message);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') recorderRef.current.stop();
  };

  const cancelRecording = () => {
    cancelledRef.current = true;
    stopRecording();
    cleanup();
  };

  const startRecording = async () => {
    setError('');
    if (!navigator.mediaDevices?.getUserMedia || typeof window.MediaRecorder === 'undefined') {
      setError('Seu navegador não suporta gravação de áudio.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new window.MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];
      cancelledRef.current = false;

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) chunksRef.current.push(ev.data);
      };
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const wasCancelled = cancelledRef.current;
        cleanup();
        if (wasCancelled || blob.size === 0) return;
        try {
          onChange(await audioBlobToAttachment(blob));
        } catch (err) {
          setError(err.message);
        }
      };

      recorder.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev + 1 >= MAX_RECORDING_SECONDS) stopRecording();
          return prev + 1;
        });
      }, 1000);
    } catch {
      cleanup();
      setError('Não foi possível acessar o microfone. Verifique a permissão do navegador.');
    }
  };

  return (
    <>
      {(value || error || recording) && (
        <div className="absolute left-0 bottom-[calc(100%+10px)] p-2 flex items-center gap-2 z-10 skeuo-panel shadow-lg animate-fade-in-up max-w-full">
          {recording && (
            <span className="flex items-center gap-2 text-sm font-semibold text-rose-600" role="status" aria-live="polite">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              Gravando {formatDuration(seconds)}
            </span>
          )}
          {!recording && value && <AttachmentView attachment={value} className="!my-0" />}
          {!recording && error && <span className="text-xs text-rose-600" role="alert">{error}</span>}
          {(value || recording) && (
            <button
              type="button"
              onClick={recording ? cancelRecording : () => onChange(null)}
              className="p-1.5 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-[#1d1d1f] transition-colors cursor-pointer"
              title={recording ? 'Cancelar gravação' : 'Remover anexo'}
              aria-label={recording ? 'Cancelar gravação' : 'Remover anexo'}
            >
              <FaTimes size={12} />
            </button>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept={DOCUMENT_ACCEPT} className="hidden" onChange={handleFile} data-testid="document-input" />
      <button type="button" className={btn} onClick={() => fileRef.current?.click()} disabled={disabled || recording}
        title="Anexar documento" aria-label="Anexar documento">
        <FaPaperclip size={14} />
      </button>
      {recording ? (
        <button type="button" className={`${btn} !text-white !bg-rose-500 !border-rose-600`} onClick={stopRecording}
          title="Parar e anexar gravação" aria-label="Parar gravação">
          <FaStop size={13} />
        </button>
      ) : (
        <button type="button" className={btn} onClick={startRecording} disabled={disabled}
          title="Gravar áudio" aria-label="Gravar áudio">
          <FaMicrophone size={14} />
        </button>
      )}
    </>
  );
}
