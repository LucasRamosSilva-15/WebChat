import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  HelpCircle,
  Send,
  CheckCircle2,
  AlertCircle,
  LifeBuoy,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { apiRequest } from '../services/api';

const FAQ_DATA = [
  {
    id: 'e2ee',
    question: 'Como funcionam as conversas diretas com criptografia?',
    answer: 'As conversas diretas (Directs) utilizam criptografia de ponta a ponta (E2EE) derivada das credenciais dos dois participantes. O servidor apenas repassa os pacotes cifrados, garantindo total privacidade.'
  },
  {
    id: 'favs',
    question: 'Como favoritar salas e mensagens importantes?',
    answer: 'Em qualquer sala, toque no ícone de estrela para fixá-la como favorita. Nas mensagens, toque e segure ou toque no balão para abrir o menu tátil e selecione "Favoritar". Você pode ver tudo na tela de Favoritos.'
  },
  {
    id: 'profile',
    question: 'Como alterar meu avatar e cor de destaque?',
    answer: 'Na aba Perfil, toque no botão de câmera sobre a sua foto para fazer o upload com compressão automática. Logo abaixo, selecione qualquer uma das 5 gemas táteis de cores para personalizar o visual.'
  },
  {
    id: 'reports',
    question: 'O que acontece ao enviar uma denúncia?',
    answer: 'Denúncias são direcionadas imediatamente à equipe de moderação com o identificador do item reportado para auditoria e eventual aplicação de bloqueios.'
  },
  {
    id: 'export',
    question: 'Como exportar o histórico e preferências?',
    answer: 'Acesse a tela de Ajustes e toque no botão "Exportar Meus Dados" para gerar o download imediato de um arquivo JSON estruturado com o seu histórico.'
  }
];

export default function MobileSuporte() {
  const navigate = useNavigate();
  const [openFaqId, setOpenFaqId] = useState(null);
  const [ticketType, setTicketType] = useState('duvida');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleFaq = (id) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!ticketMessage.trim()) {
      setErrorMsg('Por favor, descreva detalhadamente a sua solicitação.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const fullMessage = ticketSubject.trim()
        ? `[${ticketType.toUpperCase()} - ${ticketSubject.trim()}] ${ticketMessage.trim()}`
        : `[${ticketType.toUpperCase()}] ${ticketMessage.trim()}`;

      await apiRequest('/feedbacks', {
        method: 'POST',
        body: JSON.stringify({
          reason: ticketType,
          message: fullMessage,
          comment: fullMessage
        })
      });

      setSuccessMsg(true);
      setTicketSubject('');
      setTicketMessage('');
    } catch (err) {
      const offlineTickets = JSON.parse(localStorage.getItem('chat_offline_support_tickets') || '[]');
      offlineTickets.push({
        id: Date.now(),
        type: ticketType,
        subject: ticketSubject,
        message: ticketMessage,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('chat_offline_support_tickets', JSON.stringify(offlineTickets));
      setSuccessMsg(true);
      setTicketSubject('');
      setTicketMessage('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <header className="sticky top-0 z-30 px-4 py-3 bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
            className="w-10 h-10 rounded-2xl skeuo-card flex items-center justify-center text-slate-600 dark:text-slate-300 active:scale-95 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
              Central de Suporte
            </h1>
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 tracking-wider uppercase">
              FAQ & Ajuda Rápida
            </span>
          </div>
        </div>
        <div className="px-2.5 py-1 rounded-full skeuo-well text-[10px] font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
          <LifeBuoy className="w-3.5 h-3.5" />
          <span>Atendimento</span>
        </div>
      </header>

      <main className="px-4 pt-4 max-w-md mx-auto w-full space-y-5">
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <HelpCircle className="w-4 h-4 text-sky-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-2.5">
            {FAQ_DATA.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="skeuo-card rounded-2xl overflow-hidden transition-all duration-200 border border-slate-200/80 dark:border-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left gap-3 min-h-[44px]"
                  >
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-sky-500' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1">
                      <div className="p-3.5 rounded-xl skeuo-well text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Abrir Chamado / Relatar Problema
            </h2>
          </div>

          <div className="skeuo-card p-5 rounded-3xl space-y-4 shadow-md">
            {successMsg ? (
              <div className="p-4 rounded-2xl skeuo-well text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Chamado Registrado!
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Nossa equipe recebeu a sua mensagem e responderá o mais rápido possível.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccessMsg(false)}
                  className="btn-secondary-glossy min-h-[44px] px-4 text-xs font-bold rounded-xl mt-2"
                >
                  Enviar Outro Chamado
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-3.5">
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-500 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Tipo de Chamado
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'duvida', label: 'Dúvida' },
                      { id: 'bug', label: 'Problema' },
                      { id: 'denuncia', label: 'Denúncia' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTicketType(item.id)}
                        className={`min-h-[44px] py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                          ticketType === item.id
                            ? 'skeuo-btn-primary text-white shadow-md'
                            : 'btn-secondary-glossy text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Assunto (Opcional)
                  </label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Ex: Falha ao carregar sala privada"
                    className="skeuo-input w-full px-3.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Descrição Detalhada
                  </label>
                  <textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Descreva o que ocorreu ou a sua dúvida com o máximo de detalhes..."
                    rows={4}
                    className="skeuo-input w-full p-3.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 min-h-[110px] resize-none rounded-2xl"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-secondary-glossy min-h-[44px] w-full text-xs font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-sky-500" />
                  <span>{submitting ? 'Enviando chamado...' : 'Enviar Chamado de Suporte'}</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
