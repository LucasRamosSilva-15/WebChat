import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Hash, Users, Trash2, ArrowRight, Bookmark, ArrowLeft } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';
import { apiRequest } from '../services/api';

export default function MobileFavorites() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState(() => {
    try {
      const storedFavs = localStorage.getItem('chat_favorites');
      const favIds = storedFavs ? JSON.parse(storedFavs) : [];
      const storedRooms = localStorage.getItem('chat_cached_rooms');
      const allRooms = storedRooms ? JSON.parse(storedRooms) : [];
      if (favIds.length > 0 && allRooms.length > 0) {
        return allRooms.filter(r => favIds.includes(r.id) || favIds.includes(r.name));
      }
      return favIds.map(id => ({ id, name: id, description: 'Sala favorita', activeUsersCount: 1 }));
    } catch {
      return [];
    }
  });
  const [messages, setMessages] = useState(() => {
    try {
      const storedMsgs = localStorage.getItem('chat_saved_messages');
      return storedMsgs ? JSON.parse(storedMsgs) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(() => {
    try {
      const storedFavs = localStorage.getItem('chat_favorites');
      const storedMsgs = localStorage.getItem('chat_saved_messages');
      return !storedFavs && !storedMsgs;
    } catch {
      return false;
    }
  });

  const loadFavorites = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const storedRooms = localStorage.getItem('chat_favorites');
      const parsedRooms = storedRooms ? JSON.parse(storedRooms) : [];

      const storedMsgs = localStorage.getItem('chat_saved_messages');
      const parsedMsgs = storedMsgs ? JSON.parse(storedMsgs) : [];

      const [favsRes, allRoomsRes] = await Promise.allSettled([
        apiRequest('/favorites'),
        apiRequest('/rooms')
      ]);

      let availableRooms = [];
      if (allRoomsRes.status === 'fulfilled' && Array.isArray(allRoomsRes.value)) {
        availableRooms = allRoomsRes.value;
      }

      let favRoomIds = parsedRooms;
      let favMsgList = parsedMsgs;

      if (favsRes.status === 'fulfilled' && favsRes.value) {
        const serverRooms = favsRes.value.rooms || [];
        const serverMsgs = favsRes.value.messages || [];

        favRoomIds = Array.from(new Set([...favRoomIds, ...serverRooms.map(r => r.roomId)]));
        if (serverMsgs.length > 0) {
          favMsgList = serverMsgs;
        }
      }

      const mappedRooms = availableRooms.filter(r => favRoomIds.includes(r.id) || favRoomIds.includes(r.name));
      setRooms(mappedRooms.length > 0 ? mappedRooms : favRoomIds.map(id => ({ id, name: id, description: 'Sala favorita', activeUsersCount: 1 })));
      setMessages(favMsgList);
    } catch (err) {
      console.warn('Erro ao carregar favoritos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasCached = Boolean(localStorage.getItem('chat_favorites') || localStorage.getItem('chat_saved_messages'));
    loadFavorites(hasCached);
  }, []);

  const handleRemoveFavoriteRoom = async (roomId, e) => {
    e?.stopPropagation();
    const updated = rooms.filter(r => r.id !== roomId);
    setRooms(updated);
    const updatedIds = updated.map(r => r.id);
    localStorage.setItem('chat_favorites', JSON.stringify(updatedIds));
    try {
      await apiRequest(`/favorites/${roomId}`, { method: 'DELETE' });
    } catch {}
  };

  const handleRemoveFavoriteMessage = async (msgId, e) => {
    e?.stopPropagation();
    const updated = messages.filter(m => m.id !== msgId);
    setMessages(updated);
    localStorage.setItem('chat_saved_messages', JSON.stringify(updated));
    try {
      await apiRequest(`/favorites/${msgId}`, { method: 'DELETE' });
    } catch {}
  };

  return (
    <div className="anim-page-enter flex flex-col min-h-screen pb-[calc(6.5rem+env(safe-area-inset-bottom))] bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <header className="sticky top-0 z-40 w-full pt-[calc(env(safe-area-inset-top,0px)+8px)] px-3 pb-2.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-white/60 dark:border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
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
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                ITENS FAVORITADOS
              </div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight mt-0.5">
                Meus Favoritos
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 pt-3 max-w-md mx-auto w-full space-y-4">
        <div className="p-1 rounded-2xl skeuo-well flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('rooms')}
            className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'rooms'
                ? 'skeuo-btn-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Hash className="w-4 h-4" />
            <span>Salas ({rooms.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('messages')}
            className={`flex-1 min-h-[44px] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'messages'
                ? 'skeuo-btn-primary text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Mensagens ({messages.length})</span>
          </button>
        </div>

        {loading && rooms.length === 0 && messages.length === 0 ? (
          <div className="text-center py-16 text-xs text-slate-400">
            Carregando favoritos...
          </div>
        ) : activeTab === 'rooms' ? (
          rooms.length === 0 ? (
            <div className="text-center py-16 px-4 text-xs text-slate-400">
              <Star className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700 stroke-1" />
              <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
                Nenhum favorito adicionado ainda.
              </p>
              <p className="mt-1">
                Adicione estrelas às salas que você mais frequenta para acessá-las rapidamente.
              </p>
            </div>
          ) : (
            <div className="anim-stagger-children space-y-2.5">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => navigate(`/chat/${room.id}`, { state: { room } })}
                  className="skeuo-card p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-xs cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-xs shrink-0">
                      <Hash className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                        {room.name}
                      </h3>
                      <p className="text-xs text-slate-400 truncate">
                        {room.description || 'Sala com acesso rápido'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFavoriteRoom(room.id, e)}
                      className="w-9 h-9 min-h-[44px] min-w-[44px] rounded-xl btn-secondary-glossy inline-flex items-center justify-center text-rose-500 cursor-pointer"
                      title="Remover dos favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="skeuo-btn-primary min-h-[44px] px-3.5 text-xs font-bold text-white rounded-xl flex items-center gap-1 shadow-md"
                    >
                      <span>Entrar</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          messages.length === 0 ? (
            <div className="text-center py-16 px-4 text-xs text-slate-400">
              <Bookmark className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-700 stroke-1" />
              <p className="font-semibold text-slate-600 dark:text-slate-300 text-sm">
                Nenhum favorito adicionado ainda.
              </p>
              <p className="mt-1">
                Guarde mensagens importantes pelo toque longo no chat para consultá-las depois.
              </p>
            </div>
          ) : (
            <div className="anim-stagger-children space-y-2.5">
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className="skeuo-card p-3.5 rounded-2xl space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      {msg.sender || msg.userName || 'Membro'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.time || msg.timestamp || 'Salvo'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 break-words">
                    {msg.content || msg.text || msg.message}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={(e) => handleRemoveFavoriteMessage(msg.id, e)}
                      className="btn-secondary-glossy min-h-[44px] px-3 text-xs font-semibold !text-rose-600 dark:!text-rose-400 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remover</span>
                    </button>

                    {msg.roomId && (
                      <button
                        type="button"
                        onClick={() => navigate(`/chat/${msg.roomId}`)}
                        className="skeuo-btn-primary min-h-[44px] px-3.5 text-xs font-bold text-white rounded-xl flex items-center gap-1 shadow-md cursor-pointer"
                      >
                        <span>Ir para sala</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
