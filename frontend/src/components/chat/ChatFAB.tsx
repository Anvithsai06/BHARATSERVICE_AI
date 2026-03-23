'use client';

import { Bot, X } from 'lucide-react';
import { useChatStore } from '@/store';

export default function ChatFAB() {
  const { isOpen, openChat, closeChat, messages } = useChatStore();
  const unreadCount = messages.filter((m) => m.role === 'assistant').length - 1;

  return (
    <button
      onClick={isOpen ? closeChat : () => openChat()}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--clr-navy)] hover:bg-[var(--clr-navy-mid)] text-white shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 md:hidden"
      aria-label={isOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
    >
      {isOpen ? <X size={22} /> : <Bot size={22} />}
      {!isOpen && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--clr-saffron)] rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
