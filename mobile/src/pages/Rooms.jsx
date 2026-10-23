import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hash, Users, Plus, Search, Star, Camera, X, AlertCircle } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import MobileSheet from '../components/mobile/MobileSheet';
import { apiRequest } from '../services/api';
import { useHaptics } from '../hooks/useHaptics';

const CATEGORIES = ['Todas', 'Casual', 'Tecnologia', 'Jogos', 'Arte', 'Estudos'];

const DEFAULT_ROOMS = [
  { id: 'geral', name: 'Geral', desc: 'Canal de conversa geral da comunidade', category: 'Casual', members: 1, memberCount: 1, status: 'Ativa' },
  { id: 'tecnologia', name: 'Tecnologia', desc: 'Discussões sobre programação, dev e novidades tech', category: 'Tecnologia', members: 1, memberCount: 1, status: 'Ativa' },
  { id: 'jogos', name: 'Jogos', desc: 'Encontre squad, compartilhe clipes e novidades gamer', category: 'Jogos', members: 1, memberCount: 1, status: 'Ativa' },
  { id: 'estudos', name: 'Estudos', desc: 'Grupo focado em aprendizado e troca de materiais', category: 'Estudos', members: 1, memberCount: 1, status: 'Ativa' }
];

export default function MobileRooms({ onOpenNotifications, unreadCount = 0 }) {
  const navigate = useNavigate();
  const { triggerImpact } = useHaptics();
  const coverInputRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [rooms, setRooms] = useState(() => {
    try {
      const cached = localStorage.getItem('chat_cached_rooms');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ROOMS;
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('chat_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [isNewRoomSheetOpen, setIsNewRoomSheetOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState('Casual');
  const [newRoomImage, setNewRoomImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRooms = (silent = false) => {
    if (!silent) setLoading(true);
    apiRequest('/rooms')
      .then((data) => {
        if (Array.isArray(data)) {
          const mapped = data.map((r) => ({
            id: r.id || r.name,
            name: r.name || r.title || r.id,
            desc: r.description || '',
            category: r.category || 'Casual',
            image_url: r.image_url || r.imageUrl || null,
            members: r.members_count || r.members || r.activeUsersCount || 0,
            memberCount: r.members_count || r.members || r.activeUsersCount || 0,
            status: r.status || (r.members_count >= 200 ? 'Lotada' : 'Ativa')
          }));
          setRooms(mapped);
          try {
            localStorage.setItem('chat_cached_rooms', JSON.stringify(mapped));
          } catch {}
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRooms(true);
  }, []);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 512;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setNewRoomImage(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    if (coverInputRef.current) coverInputRef.current.value = '';
  };

  const toggleFavorite = async (roomId, e) => {
    e?.stopPropagation();
    triggerImpact();
    const idStr = String(roomId);

    setFavorites((prev) => {
      const next = prev.includes(idStr)
        ? prev.filter((id) => id !== idStr)
        : [...prev, idStr];
      localStorage.setItem('chat_favorites', JSON.stringify(next));
      window.dispatchEvent(new Event('chatFavoritesUpdated'));
      return next;
    });

    try {
      await apiRequest(`/rooms/${roomId}/favorite`, { method: 'POST' });
    } catch { }
  };

  const handleRoomClick = async (room) => {
    triggerImpact();

    if (room.status === 'Arquivada') {
      setToastMessage('Esta sala foi arquivada e não aceita novos acessos.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    const currentCount = room.memberCount || room.members || 0;
    if (currentCount >= 200) {
      setToastMessage('Esta sala atingiu a capacidade máxima de 200 membros.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    try {
      await apiRequest(`/rooms/${room.id}/join`, { method: 'POST' });
    } catch { }

    navigate(`/chat/${room.id}`, { state: { room } });
  };

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
          category: newRoomCategory,
          image_url: newRoomImage
        })
      });

      const targetId = savedRoom?.id || newRoomName.trim();
      setIsNewRoomSheetOpen(false);
      setNewRoomName('');
      setNewRoomDesc('');
      setNewRoomCategory('Casual');
      setNewRoomImage(null);
      fetchRooms();
      navigate(`/chat/${targetId}`, { state: { room: savedRoom } });
    } catch {
      setIsNewRoomSheetOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Todas' || (r.category || 'Casual') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    const aFav = favorites.includes(String(a.id)) || favorites.includes(String(a.name));
    const bFav = favorites.includes(String(b.id)) || favorites.includes(String(b.name));
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Salas de Conversa"
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      {toastMessage && (
        <div className="fixed top-16 inset-x-4 max-w-md mx-auto z-50 animate-fade-in">
          <div className="p-3.5 rounded-2xl bg-amber-500/90 text-white backdrop-blur-md shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-amber-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="flex-1">{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 rounded-full hover:bg-black/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <div className="px-3 pt-3 max-w-md mx-auto w-full">
        <div className="flex items-center gap-2">
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
            className="skeuo-btn-primary !w-11 !h-11 min-h-[44px] !p-0 rounded-2xl flex items-center justify-center text-white shadow-md active:scale-95 transition-transform shrink-0"
            aria-label="Criar nova sala"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="skeuo-well p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto skeuo-scrollbar no-scrollbar my-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  triggerImpact();
                  setSelectedCategory(cat);
                }}
                className={
                  isSelected
                    ? 'btn-secondary-glossy text-sky-700 dark:text-sky-300 font-bold shadow-xs whitespace-nowrap px-3.5 py-1.5 text-xs rounded-xl min-h-[36px]'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 font-medium whitespace-nowrap px-3 py-1.5 text-xs rounded-xl transition-colors'
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="space-y-2.5">
          {loading ? (
            <div className="text-center py-12 text-sm text-slate-400">
              Carregando salas...
            </div>
          ) : sortedRooms.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">
              {searchTerm || selectedCategory !== 'Todas'
                ? 'Nenhuma sala encontrada com os filtros selecionados.'
                : 'Nenhuma sala disponível. Toque em + para criar a primeira!'}
            </div>
          ) : (
            sortedRooms.map((room) => {
              const isFav =
                favorites.includes(String(room.id)) ||
                favorites.includes(String(room.name));
              const isFull = (room.memberCount || room.members || 0) >= 200;
              const isArchived = room.status === 'Arquivada';

              return (
                <div
                  key={room.id}
                  onClick={() => handleRoomClick(room)}
                  className={`skeuo-card p-3.5 rounded-2xl cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between shadow-sm hover:shadow-md ${isFull ? 'opacity-90' : ''
                    }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
                    {room.image_url ? (
                      <img
                        src={room.image_url}
                        alt={room.name}
                        className="w-11 h-11 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-200/80 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center shrink-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_2px_6px_rgba(14,165,233,0.3)]">
                        <Hash className="w-5 h-5" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-snug truncate">
                          {room.name}
                        </h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800">
                          {room.category || 'Casual'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {room.desc || 'Sem descrição.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                      <div className="inline-flex items-baseline gap-1 text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {room.memberCount || room.members || 1}
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">/ 200</span>
                      </div>

                      {isArchived ? (
                        <span className="skeuo-badge bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Arquivada
                        </span>
                      ) : isFull ? (
                        <span className="skeuo-badge bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-300/60 dark:border-rose-900/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Lotada
                        </span>
                      ) : (
                        <span className="skeuo-badge bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-900/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Ativa
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(room.id, e)}
                      className="btn-secondary-glossy !w-9 !h-9 !p-0 rounded-full inline-flex items-center justify-center shrink-0 transition-transform active:scale-95"
                      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${isFav
                            ? 'fill-amber-400 text-amber-500'
                            : 'text-slate-400 hover:text-amber-500/80'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <MobileSheet
        isOpen={isNewRoomSheetOpen}
        onClose={() => setIsNewRoomSheetOpen(false)}
        title="Criar Nova Sala"
      >
        <form onSubmit={handleCreateRoom} className="space-y-3.5 pt-1">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Capa da Sala (Opcional)
            </label>
            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />

            {newRoomImage ? (
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-sky-500/80 shadow-md">
                <img
                  src={newRoomImage}
                  alt="Capa da sala"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setNewRoomImage(null)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-slate-900/80 text-white flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 skeuo-well hover:border-sky-500 transition-colors cursor-pointer min-h-[44px]"
              >
                <Camera className="w-4 h-4 text-sky-500" />
                <span>Escolher Capa (512x512 JPEG)</span>
              </button>
            )}
          </div>

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
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">
              Categoria
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Casual', 'Tecnologia', 'Jogos', 'Arte', 'Estudos'].map((cat) => {
                const isSelected = newRoomCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewRoomCategory(cat)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl transition-all min-h-[38px] ${isSelected
                        ? 'skeuo-btn-primary text-white shadow-sm'
                        : 'btn-secondary-glossy text-slate-600 dark:text-slate-300'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
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
              disabled={!newRoomName.trim() || isSubmitting}
              className="skeuo-btn-primary flex-1 min-h-[44px] text-xs font-bold text-white rounded-xl shadow-md disabled:opacity-50"
            >
              {isSubmitting ? 'Criando...' : 'Criar Sala'}
            </button>
          </div>
        </form>
      </MobileSheet>
    </div>
  );
}
