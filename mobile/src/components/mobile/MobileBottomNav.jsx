import React from 'react';
import { MessageSquare, Users, Bell, User, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useHaptics } from '../../hooks/useHaptics';
import { useScrollDirection } from '../../hooks/useScrollDirection';

export default function MobileBottomNav({
  unreadCount = 0,
  onOpenNotifications,
  hideOnScroll = true,
  visible: visibleProp
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { triggerImpact } = useHaptics();
  const { isVisible: scrollVisible } = useScrollDirection();

  const isVisible = visibleProp !== undefined ? visibleProp : (hideOnScroll ? scrollVisible : true);

  const items = [
    { id: 'rooms', path: '/rooms', label: 'Salas', icon: Users },
    { id: 'directs', path: '/directs', label: 'Diretas', icon: MessageSquare },
    { id: 'notifs', label: 'Avisos', icon: Bell, isAction: true, count: unreadCount },
    { id: 'profile', path: '/profile', label: 'Perfil', icon: User },
    { id: 'settings', path: '/settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <nav
      className={`fixed bottom-0 inset-x-0 max-w-md mx-auto z-50 px-3 pb-[calc(env(safe-area-inset-bottom,12px)+6px)] pt-2 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100'
          : 'translate-y-[calc(100%+32px)] opacity-0 scale-95'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="skeuo-card pointer-events-auto mx-auto max-w-md p-1.5 flex items-center justify-around rounded-3xl border border-white/80 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,102,204,0.2),inset_0_1.5px_0_rgba(255,255,255,0.95)]">
        {items.map((item) => {
          const isActive = item.path && location.pathname.startsWith(item.path);

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                triggerImpact();
                if (item.isAction) onOpenNotifications?.();
                else navigate(item.path);
              }}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'skeuo-btn-primary !p-2 !px-3.5 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <item.icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border border-white">
                    {item.count}
                  </span>
                )}
              </div>
              {!isActive && (
                <span className="text-[10px] font-medium tracking-tight mt-0.5">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
