import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Send,
  Clock,
  Vibrate,
  Shield,
  UserX,
  Download,
  CheckCircle2,
  ChevronRight,
  Star,
  MessageSquareHeart,
  HelpCircle,
  Trash2,
  UserPlus
} from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';

export default function MobileSettings({ onOpenNotifications, unreadCount = 0 }) {
  const navigate = useNavigate();
  const [enterToSend, setEnterToSend] = useState(() => localStorage.getItem('chat_enterToSend') !== 'false');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('chat_soundEnabled') !== 'false');
  const [showTimestamps, setShowTimestamps] = useState(() => localStorage.getItem('chat_showTimestamps') !== 'false');
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState(() => {
    try {
      const stored = localStorage.getItem('chat_blocked_users');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });
  const [newBlockName, setNewBlockName] = useState('');
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const toggle = (key, current, setter) => {
    const next = !current;
    setter(next);
    localStorage.setItem(key, String(next));
    window.dispatchEvent(new Event('chatSettingsUpdated'));
  };

  const handleUnblock = (userId) => {
    const updated = blockedUsers.filter((u) => u.id !== userId);
    setBlockedUsers(updated);
    localStorage.setItem('chat_blocked_users', JSON.stringify(updated));
    window.dispatchEvent(new Event('chatBlockedUsersUpdated'));
  };

  const handleAddBlock = (e) => {
    e.preventDefault();
    if (!newBlockName.trim()) return;
    const newUser = {
      id: `blocked_${Date.now()}`,
      name: newBlockName.trim(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    const updated = [...blockedUsers, newUser];
    setBlockedUsers(updated);
    localStorage.setItem('chat_blocked_users', JSON.stringify(updated));
    setNewBlockName('');
    setShowAddBlock(false);
    window.dispatchEvent(new Event('chatBlockedUsersUpdated'));
  };

  const handleExportData = () => {
    try {
      let favoritesRooms = [];
      let favoriteMessages = [];
      let directs = {};

      try {
        favoritesRooms = JSON.parse(localStorage.getItem('chat_favorites') || '[]');
      } catch (e) {}

      try {
        favoriteMessages = JSON.parse(localStorage.getItem('chat_saved_messages') || '[]');
      } catch (e) {}

      try {
        directs = JSON.parse(localStorage.getItem('chat_direct_conversations') || '{}');
      } catch (e) {}

      const exportPayload = {
        meta: {
          app: 'WebChat SkyRipple',
          platform: 'mobile',
          version: '1.0.0',
          exportedAt: new Date().toISOString()
        },
        profile: {
          displayName: localStorage.getItem('chat_displayName') || 'Usuário',
          uniqueUserId: localStorage.getItem('chat_uniqueUserId') || '',
          statusMessage: localStorage.getItem('chat_statusMessage') || '',
          bio: localStorage.getItem('chat_profileDesc') || '',
          colorTheme: localStorage.getItem('chat_current_color_palette') || 'blue'
        },
        preferences: {
          enterToSend,
          soundEnabled,
          showTimestamps,
          hapticFeedback
        },
        favorites: {
          rooms: favoritesRooms,
          messages: favoriteMessages
        },
        directConversations: directs,
        blockedUsers
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `webchat-meus-dados-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err) {
      console.error('Falha ao exportar dados:', err);
    }
  };

  return (
    <div className="anim-page-enter flex flex-col h-[100dvh] overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Ajustes e Preferências"
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      <div className="flex-1 overflow-y-auto overscroll-y-contain pb-[calc(6.5rem+env(safe-area-inset-bottom))] skeuo-scrollbar">
        <div className="anim-stagger-children px-4 pt-4 max-w-md mx-auto w-full space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => navigate('/favorites')}
            className="skeuo-card p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center min-h-[64px] active:scale-95 transition-transform"
          >
            <Star className="w-5 h-5 text-amber-500 fill-amber-500/20" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Favoritos</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/feedback')}
            className="skeuo-card p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center min-h-[64px] active:scale-95 transition-transform"
          >
            <MessageSquareHeart className="w-5 h-5 text-rose-500" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Feedback</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/support')}
            className="skeuo-card p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center min-h-[64px] active:scale-95 transition-transform"
          >
            <HelpCircle className="w-5 h-5 text-sky-500" />
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">Suporte</span>
          </button>
        </div>

        <div className="skeuo-card p-5 rounded-3xl space-y-3.5 shadow-md">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Comportamento do Chat
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Send className="w-4 h-4 text-sky-500" />
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Enter Envia Mensagem</div>
                <div className="text-[11px] text-slate-400">Pressione enter no teclado virtual para enviar</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle('chat_enterToSend', enterToSend, setEnterToSend)}
              className={`w-11 h-6 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer border ${
                enterToSend ? 'bg-sky-500 border-sky-400' : 'bg-slate-200 dark:bg-slate-700 border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  enterToSend ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Alertas Sonoros</div>
                <div className="text-[11px] text-slate-400">Tocar sons ao receber novas mensagens</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle('chat_soundEnabled', soundEnabled, setSoundEnabled)}
              className={`w-11 h-6 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer border ${
                soundEnabled ? 'bg-sky-500 border-sky-400' : 'bg-slate-200 dark:bg-slate-700 border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Exibir Horários</div>
                <div className="text-[11px] text-slate-400">Mostrar timestamp nos balões de chat</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggle('chat_showTimestamps', showTimestamps, setShowTimestamps)}
              className={`w-11 h-6 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer border ${
                showTimestamps ? 'bg-sky-500 border-sky-400' : 'bg-slate-200 dark:bg-slate-700 border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  showTimestamps ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-3">
            <div className="flex items-center gap-2.5">
              <Vibrate className="w-4 h-4 text-purple-500" />
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Vibração Háptica</div>
                <div className="text-[11px] text-slate-400">Feedback físico em toques nos botões</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setHapticFeedback(!hapticFeedback)}
              className={`w-11 h-6 rounded-full relative flex items-center px-0.5 transition-colors cursor-pointer border ${
                hapticFeedback ? 'bg-sky-500 border-sky-400' : 'bg-slate-200 dark:bg-slate-700 border-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="skeuo-card p-5 rounded-3xl space-y-3.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Privacidade & Bloqueios
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowAddBlock(!showAddBlock)}
              className="text-[11px] font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1 active:scale-95 transition-transform"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Bloquear</span>
            </button>
          </div>

          {showAddBlock && (
            <form onSubmit={handleAddBlock} className="p-3 rounded-2xl skeuo-well space-y-2">
              <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                Bloquear usuário por nome:
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBlockName}
                  onChange={(e) => setNewBlockName(e.target.value)}
                  placeholder="Nome do usuário"
                  className="skeuo-input flex-1 px-3 text-xs"
                />
                <button
                  type="submit"
                  className="skeuo-btn-primary min-h-[44px] px-3 text-xs font-bold rounded-xl"
                >
                  Bloquear
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {blockedUsers.length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                Nenhum usuário bloqueado.
              </div>
            ) : (
              blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="p-3 rounded-2xl skeuo-well flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <UserX className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {user.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Bloqueado em {user.date || 'recente'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUnblock(user.id)}
                    className="btn-secondary-glossy min-h-[44px] px-3 text-xs font-bold rounded-xl active:scale-95 transition-transform text-rose-600 dark:text-rose-400"
                  >
                    Desbloquear
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="skeuo-card p-5 rounded-3xl space-y-3 shadow-md">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-indigo-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Gerenciamento de Dados
            </h3>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Faça uma cópia completa dos seus dados armazenados localmente, incluindo histórico de perfil, preferências de chat e conversas.
          </p>

          {exportSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Arquivo JSON gerado e transferido com sucesso!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleExportData}
            className="skeuo-btn-primary min-h-[44px] w-full text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Meus Dados (JSON)</span>
          </button>
        </div>

        <div className="skeuo-card p-5 rounded-3xl space-y-2 shadow-md text-xs">
          <h3 className="font-bold uppercase tracking-wider text-slate-500 mb-1">
            Sistema & Conectividade
          </h3>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300">
            <span>Versão Mobile</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">v1.0.0</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300 border-t border-slate-200/50 dark:border-slate-800">
            <span>Design System</span>
            <span className="font-semibold text-sky-600 dark:text-sky-400">Skeuomorphic Touch</span>
          </div>
          <div className="flex justify-between py-1 text-slate-600 dark:text-slate-300 border-t border-slate-200/50 dark:border-slate-800">
            <span>Status da API</span>
            <span className="font-semibold text-emerald-500">Conectado (Render)</span>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
