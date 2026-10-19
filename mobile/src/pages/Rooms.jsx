import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Users, Plus, Search } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileSheet from '../components/mobile/MobileSheet';
import { apiRequest } from '../services/api';

export default function MobileRooms({ onOpenNotifications, unreadCount = 0 }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewRoomSheetOpen, setIsNewRoomSheetOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRooms = () => {
    setLoading(true);
    apiRequest('/rooms')
      .then((data) => {
        if (Array.isArray(data)) {
          setRooms(data.map(r => ({
            id: r.id || r.name,
            name: r.name || r.title || r.id,
            desc: r.description || '',
            members: r.members_count || r.members || r.activeUsersCount || 0
          })));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const savedRoom = await apiRequest('/rooms', {
        method: 'POST',
        body: JSON.stringify({
          name: newRoomName.trim(),
          description: newRoomDesc.trim(),
          category: 'Casual'
        })
      });

      const targetId = savedRoom?.id || newRoomName.trim();
      setIsNewRoomSheetOpen(false);
      setNewRoomName('');
      setNewRoomDesc('');
      fetchRooms();
      navigate(`/chat/${targetId}`, { state: { room: savedRoom } });
    } catch {
      setIsNewRoomSheetOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Salas de Conversa"
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
              placeholder="Buscar salas..."
              className="skeuo-input w-full pl-10 pr-4 py-2 text-sm rounded-2xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsNewRoomSheetOpen(true)}
            className="skeuo-btn-primary !w-11 !h-11 min-h-[44px] !p-0 rounded-2xl flex items-center justify-center text-white shadow-md active:scale-95 transition-transform"
            aria-label="Criar nova sala"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-400">
              Carregando salas...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">
              {searchTerm ? `Nenhuma sala encontrada para "${searchTerm}".` : 'Nenhuma sala disponível. Toque em + para criar a primeira!'}
            </div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => navigate(`/chat/${room.id}`, { state: { room } })}
                className="skeuo-card p-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(14,165,233,0.3)]">
                    <Hash className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug">
                      {room.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {room.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5" />
                  <span>{room.members}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <MobileSheet
        isOpen={isNewRoomSheetOpen}
        onClose={() => setIsNewRoomSheetOpen(false)}
        title="Criar Nova Sala"
      >
        <form onSubmit={handleCreateRoom} className="space-y-3 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              Nome da Sala
            </label>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Ex: Cinema, Livros, Design..."
              className="skeuo-input w-full px-4 py-2.5 text-sm rounded-xl"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
              Descrição
            </label>
            <textarea
              value={newRoomDesc}
              onChange={(e) => setNewRoomDesc(e.target.value)}
              placeholder="Descreva o propósito da sala..."
              rows={3}
              className="skeuo-input w-full px-4 py-2 text-sm rounded-xl resize-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsNewRoomSheetOpen(false)}
              className="btn-secondary-glossy flex-1 min-h-[44px] text-xs font-semibold text-slate-600 dark:text-slate-300 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!newRoomName.trim()}
              className="skeuo-btn-primary flex-1 min-h-[44px] text-xs font-bold text-white rounded-xl shadow-md disabled:opacity-50"
            >
              Criar Sala
            </button>
          </div>
        </form>
      </MobileSheet>
    </div>
  );
}
