import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquarePlus, Search, UserCheck } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileSheet from '../components/mobile/MobileSheet';

export default function MobileDirects({ onOpenNotifications, unreadCount = 0 }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem('chat_directContacts');
      if (saved) return JSON.parse(saved);
    } catch {
    }
    return [];
  });
  const [isNewDmSheetOpen, setIsNewDmSheetOpen] = useState(false);
  const [contactNameInput, setContactNameInput] = useState('');

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.lastMessage && c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStartDm = (e) => {
    e.preventDefault();
    const cleanName = contactNameInput.trim();
    if (!cleanName) return;

    const existing = contacts.find(c => c.name.toLowerCase() === cleanName.toLowerCase());
    if (!existing) {
      const newContact = {
        id: 'dm_' + Date.now(),
        name: cleanName,
        lastMessage: 'Conversa iniciada',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        isOnline: true
      };
      const updated = [newContact, ...contacts];
      setContacts(updated);
      try {
        localStorage.setItem('chat_directContacts', JSON.stringify(updated));
      } catch {
      }
    }
    setIsNewDmSheetOpen(false);
    setContactNameInput('');
    navigate(`/chat?room=dm-${encodeURIComponent(cleanName)}`);
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Mensagens Diretas"
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      <div className="px-3 pt-3 max-w-md mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar contatos..."
              className="skeuo-input w-full pl-10 pr-4 py-2 text-sm rounded-2xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsNewDmSheetOpen(true)}
            className="skeuo-btn-primary !w-11 !h-11 min-h-[44px] !p-0 rounded-2xl flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
            aria-label="Nova conversa direta"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => navigate(`/chat?room=dm-${encodeURIComponent(contact.name)}`)}
              className="skeuo-card p-3 rounded-2xl cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0 w-11 h-11 rounded-full border border-sky-400/80 bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-sm shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_2px_5px_rgba(14,165,233,0.3)]">
                  {contact.name.charAt(0).toUpperCase()}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                      contact.isOnline ? 'bg-emerald-500' : 'bg-slate-400'
                    }`}
                  />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {contact.name}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {contact.lastMessage}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 gap-1 pl-2">
                <span className="text-[10px] text-slate-400 font-medium">
                  {contact.time}
                </span>
                {contact.unread > 0 && (
                  <span className="min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border border-white">
                    {contact.unread}
                  </span>
                )}
              </div>
            </div>
          ))}

          {filteredContacts.length === 0 && (
            <div className="text-center py-12 text-sm text-slate-400">
              Nenhuma conversa direta encontrada.
            </div>
          )}
        </div>
      </div>

      <MobileSheet
        isOpen={isNewDmSheetOpen}
        onClose={() => setIsNewDmSheetOpen(false)}
        title="Nova Conversa Direta"
      >
        <form onSubmit={handleStartDm} className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              Nome ou @usuário
            </label>
            <input
              type="text"
              value={contactNameInput}
              onChange={(e) => setContactNameInput(e.target.value)}
              placeholder="Digite o nome do contato..."
              className="skeuo-input w-full px-4 py-2.5 text-sm rounded-xl"
              required
              autoFocus
            />
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setIsNewDmSheetOpen(false)}
              className="btn-secondary-glossy flex-1 min-h-[44px] text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!contactNameInput.trim()}
              className="skeuo-btn-primary flex-1 min-h-[44px] text-xs font-bold text-white rounded-xl shadow-md disabled:opacity-50"
            >
              Iniciar Chat
            </button>
          </div>
        </form>
      </MobileSheet>
    </div>
  );
}
