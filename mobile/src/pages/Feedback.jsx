import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageSquareHeart, Send, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function MobileFeedback() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('sugestao');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    { id: 'sugestao', label: 'Sugestão de Recurso' },
    { id: 'erro', label: 'Relato de Bug / Erro' },
    { id: 'elogio', label: 'Elogio / Experiência' },
    { id: 'outro', label: 'Outro Assunto' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Por favor, descreva seu feedback.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fullComment = `[${rating}/5 Estrelas - ${category.toUpperCase()}] ${title ? title + ': ' : ''}${description.trim()}`;
      await apiRequest('/feedbacks', {
        method: 'POST',
        body: JSON.stringify({
          comment: fullComment,
          reason: category,
          message: description.trim()
        })
      });

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erro ao enviar feedback. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anim-page-enter flex flex-col h-[100dvh] overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <header
        style={{
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden'
        }}
        className="shrink-0 z-40 w-full pt-[calc(env(safe-area-inset-top,0px)+8px)] px-3 pb-2.5 bg-white/95 dark:bg-[#0b1120] border-b border-white/60 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)]"
      >
        <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary-glossy !w-10 !h-10 min-h-[44px] !p-0 rounded-full inline-flex items-center justify-center text-slate-700 dark:text-slate-200 cursor-pointer"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-700 text-[10px] font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
                <MessageSquareHeart className="w-3 h-3 text-sky-500" />
                AVALIAÇÃO DA COMUNIDADE
              </div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight mt-0.5">
                Enviar Feedback
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overscroll-y-contain px-4 pt-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] skeuo-scrollbar max-w-md mx-auto w-full">
        <div className="anim-fade-rise skeuo-card max-w-md mx-auto p-6 rounded-3xl shadow-md">
          {success ? (
            <div className="text-center py-6 animate-fade-in space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 flex items-center justify-center text-emerald-500 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_6px_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  Obrigado pelo seu Feedback!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Sua avaliação ajuda a aprimorar o SkyRipple com melhorias contínuas para todos os membros.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/rooms')}
                className="skeuo-btn-primary w-full min-h-[48px] rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-md cursor-pointer"
              >
                Voltar às Salas
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-2">
                  Como avalia sua experiência no SkyRipple?
                </label>
                <div className="flex items-center justify-center gap-2 p-2 rounded-2xl skeuo-well">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => {
                        setRating(star);
                        if (typeof navigator !== 'undefined' && navigator.vibrate) {
                          navigator.vibrate(15);
                        }
                      }}
                      className="p-1 min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                      aria-label={`Nota ${star} de 5`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= rating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_2px_4px_rgba(251,191,36,0.4)]'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="skeuo-input w-full px-4 py-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Título (Opcional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Resumo em uma frase..."
                  className="skeuo-input w-full px-4 py-2 text-sm rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                  Descrição Detalhada
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Escreva aqui seus comentários, sugestões ou dificuldades encontradas..."
                  className="skeuo-input w-full p-4 text-sm rounded-2xl min-h-[120px] resize-none"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-center animate-fade-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="skeuo-btn-primary w-full min-h-[44px] rounded-2xl font-bold text-xs uppercase tracking-wider text-white shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Enviando...' : 'Enviar Feedback'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
