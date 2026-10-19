import React from 'react';
import { X } from 'lucide-react';

export default function MobileSheet({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200" 
      />

      <div className="skeuo-card relative z-10 w-full max-w-md mx-auto rounded-t-[32px] rounded-b-none p-5 pt-3 pb-[calc(env(safe-area-inset-bottom,16px)+16px)] shadow-[0_-10px_40px_rgba(0,0,0,0.25),inset_0_1.5px_0_rgba(255,255,255,0.9)] flex flex-col bg-white/95 dark:bg-slate-900/95 overflow-hidden">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-1.5 rounded-full bg-slate-300/80 dark:bg-slate-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]" />
        </div>

        <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-800/60 mb-4">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary-glossy !w-8 !h-8 !p-0 rounded-full inline-flex items-center justify-center text-slate-500 hover:text-slate-800"
          >
            <X className="w-4 h-4"/>
          </button>
        </div>

        <div className="overflow-y-auto skeuo-scrollbar flex-1 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
