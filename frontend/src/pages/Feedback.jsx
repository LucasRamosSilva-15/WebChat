import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquarePlus,
  Lightbulb,
  AlertTriangle,
  Smile,
  Sparkles,
  UploadCloud,
  Send,
  CheckCircle2,
  X
} from 'lucide-react';
import SkeuoLoading from '../components/SkeuoLoading';

const Feedback = () => {
  const [selectedType, setSelectedType] = useState('sugestao');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const feedbackTypes = [
    {
      id: 'sugestao',
      title: 'Sugestão',
      description: 'Tenho uma ideia de melhoria para a plataforma',
      icon: Lightbulb,
      iconColor: 'text-sky-600 dark:text-sky-400'
    },
    {
      id: 'erro',
      title: 'Erro / Bug',
      description: 'Algo não está a funcionar como esperado',
      icon: AlertTriangle,
      iconColor: 'text-rose-600 dark:text-rose-400'
    },
    {
      id: 'elogio',
      title: 'Elogio',
      description: 'Quero partilhar uma experiência positiva',
      icon: Smile,
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'ideia',
      title: 'Nova Ideia',
      description: 'Sugestão de um novo recurso ou funcionalidade',
      icon: Sparkles,
      iconColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const isValid = title.trim() !== '' && details.trim() !== '';

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles].slice(0, 3));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      setFiles((prev) => [...prev, ...droppedFiles].slice(0, 3));
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      const token = localStorage.getItem('chat_token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

      const severityMap = {
        erro: 'Alta',
        sugestao: 'Média',
        elogio: 'Baixa',
        ideia: 'Baixa'
      };

      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });

      const base64Images = await Promise.all(files.map((f) => toBase64(f)));

      const response = await fetch(`${apiUrl}/feedbacks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          comment: `[${selectedType.toUpperCase()}] ${title}: ${details}`,
          reason: selectedType,
          message: `Título: ${title}\n\nDetalhes: ${details}`,
          severity: severityMap[selectedType] || 'Baixa',
          images: base64Images
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTitle('');
        setDetails('');
        setFiles([]);
        setSelectedType('sugestao');
        setTimeout(() => setSuccess(false), 6000);
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Erro ao enviar feedback.');
      }
    } catch (err) {
      console.error('Erro ao enviar feedback:', err);
      alert('Erro de conexão ao enviar feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <SkeuoLoading title="A carregar..." subtitle="A preparar formulário de feedback..." />;
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <div className="w-full max-w-[1080px] px-4 py-8 md:py-12">
        {/* 1. Cabeçalho com Pílula Tátil envolto em skeuo-card */}
        <div className="skeuo-card p-6 sm:p-8 mb-8 animate-fade-in-up-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-sky-700 dark:text-sky-300 bg-sky-100/90 dark:bg-sky-950/60 border border-sky-300/70 dark:border-sky-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_2px_rgba(0,113,227,0.1)] mb-3">
            <MessageSquarePlus className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            FEEDBACK DOS UTILIZADORES
          </span>
          <h1 className="text-3xl font-extrabold text-sky-600 dark:text-sky-400 tracking-tight">
            Envie o seu feedback
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            A sua opinião ajuda a tornar o SkyRipple melhor. Partilhe connosco o que achou, sugestões de melhoria ou qualquer problema encontrado.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3. Formulário Principal à Esquerda */}
          <div className="lg:col-span-7 xl:col-span-8">
            <form onSubmit={handleSubmit} className="skeuo-card p-6 sm:p-8 relative animate-fade-in-up-2">
              {success && (
                <div className="absolute inset-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-[28px] p-6 flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="skeuo-surface-orb-badge w-16 h-16 rounded-full flex items-center justify-center mb-4 text-emerald-500 shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    Feedback Enviado com Sucesso!
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm leading-relaxed mb-6">
                    Agradecemos imensamente a sua contribuição. A nossa equipa irá analisar o seu comentário para continuar a aprimorar o SkyRipple.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="btn-secondary-glossy px-6 py-2.5 text-xs font-semibold cursor-pointer"
                  >
                    Enviar outro feedback
                  </button>
                </div>
              )}

              {/* Campo: Resumo */}
              <div className="mb-6">
                <label className="block font-bold text-xs text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wider">
                  Resumo do Feedback
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Problema ao carregar imagens no feed"
                  className="skeuo-input w-full px-4 py-3 text-sm rounded-xl"
                  required
                />
              </div>

              {/* Campo: Detalhes */}
              <div className="mb-6">
                <label className="block font-bold text-xs text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wider">
                  Detalhes
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Descreva o máximo de detalhes possível para podermos entender melhor..."
                  className="skeuo-input w-full px-4 py-3 text-sm rounded-xl min-h-[140px] resize-none"
                  required
                ></textarea>
              </div>

              {/* Área de Anexos */}
              <div className="mb-6">
                <label className="block font-bold text-xs text-slate-700 dark:text-slate-200 mb-2 uppercase tracking-wider">
                  Anexos (Opcional - Máx 3)
                </label>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept="image/*"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`skeuo-well p-6 rounded-2xl border-2 border-dashed transition-colors flex flex-col items-center justify-center text-center cursor-pointer ${
                    isDragging
                      ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30'
                      : 'border-slate-300/80 dark:border-slate-700/80 hover:border-sky-400'
                  }`}
                >
                  <div className="skeuo-surface-orb-badge w-10 h-10 rounded-full flex items-center justify-center mb-2 text-slate-500">
                    <UploadCloud className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Arraste e solte imagens aqui
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    ou clique para procurar no seu dispositivo (PNG, JPG até 5MB)
                  </span>
                </div>

                {/* Lista de Arquivos Selecionados */}
                {files.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white/90 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-full shadow-xs px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-200"
                      >
                        <span className="truncate max-w-[160px] font-medium">{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Remover anexo"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Botão de Envio */}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="skeuo-btn-primary px-7 py-2.5 text-sm font-semibold text-white inline-flex items-center gap-2 rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{isSubmitting ? 'A enviar...' : 'Enviar Feedback'}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* 2. Seletores de Tipo de Feedback à Direita */}
          <div className="lg:col-span-5 xl:col-span-4 animate-fade-in-up-3">
            <div className="skeuo-card p-6 sm:p-7 flex flex-col">
              <label className="block font-bold text-xs text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">
                Selecione o tipo
              </label>
              <div className="flex flex-col gap-3">
                {feedbackTypes.map((type) => {
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full p-4 rounded-2xl flex items-center gap-4 text-left transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-b from-sky-50/90 to-white dark:from-slate-800 dark:to-slate-900 border-2 border-sky-400 dark:border-sky-500 shadow-[0_4px_14px_rgba(14,165,233,0.18),inset_0_1px_0_rgba(255,255,255,0.95)] scale-[1.02]'
                          : 'btn-secondary-glossy hover:scale-[1.01]'
                      }`}
                    >
                      <div className={`skeuo-surface-orb-badge w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${type.iconColor}`}>
                        <type.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {type.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {type.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
