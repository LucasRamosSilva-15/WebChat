import React, { useState } from 'react';
import { Bell, Send, Clock, Smartphone, Vibrate, Info } from 'lucide-react';
import MobileHeader from '../components/mobile/MobileHeader';

export default function MobileSettings({ onOpenNotifications, unreadCount = 0 }) {
  const [enterToSend, setEnterToSend] = useState(() => localStorage.getItem('chat_enterToSend') !== 'false');
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('chat_soundEnabled') !== 'false');
  const [showTimestamps, setShowTimestamps] = useState(() => localStorage.getItem('chat_showTimestamps') !== 'false');
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const toggle = (key, current, setter) => {
    const next = !current;
    setter(next);
    localStorage.setItem(key, String(next));
    window.dispatchEvent(new Event('chatSettingsUpdated'));
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <MobileHeader
        title="Ajustes e Preferências"
        onOpenNotifications={onOpenNotifications}
        unreadCount={unreadCount}
      />

      <div className="px-4 pt-4 max-w-md mx-auto w-full space-y-4">
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
  );
}
