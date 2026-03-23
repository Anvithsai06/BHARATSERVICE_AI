'use client';

import { useEffect, useRef, useState, KeyboardEvent } from 'react';
import { X, Send, Trash2, Bot, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useChatStore } from '@/store';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const QUICK_PROMPTS = [
  'What documents do I need for a passport?',
  'How long does Aadhaar update take?',
  'Steps to register a business online',
  'How to apply for PM Kisan scheme?',
];

interface Props {
  aiConnected?: boolean;
}

export default function ChatPanel({ aiConnected = false }: Props) {
  const { messages, status, error, isOpen, closeChat, clearChat, sendMessage } =
    useChatStore();
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === 'loading';

  // Scroll to bottom whenever messages change
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput('');
    sendMessage(text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className="fixed inset-0 bg-black/30 z-40 md:hidden animate-fade-in"
        onClick={closeChat}
        aria-hidden
      />

      {/* Panel */}
      <aside
        className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50
                   w-full md:w-[400px] lg:w-[420px]
                   h-[90dvh] md:h-[620px]
                   bg-white shadow-2xl
                   rounded-t-3xl md:rounded-3xl
                   flex flex-col
                   animate-slide-in-right
                   border border-[var(--clr-border)]"
        role="dialog"
        aria-label="AI Assistant"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--clr-border)] shrink-0">
          <div className="relative">
            <div className="w-9 h-9 bg-[var(--clr-navy)] rounded-full flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                aiConnected ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-[var(--clr-navy)] text-sm leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}>
              GovSaathi AI
            </div>
            <div className="flex items-center gap-1 text-[10px] text-[var(--clr-muted)]">
              {aiConnected ? (
                <><Wifi size={9} className="text-emerald-500" /> AI Connected</>
              ) : (
                <><WifiOff size={9} className="text-amber-500" /> Fallback Mode</>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-2 rounded-lg hover:bg-[var(--clr-surface)] transition-colors text-[var(--clr-muted)] hover:text-red-500"
              title="Clear conversation"
              aria-label="Clear chat"
            >
              <Trash2 size={15} />
            </button>
            <button
              onClick={closeChat}
              className="p-2 rounded-lg hover:bg-[var(--clr-surface)] transition-colors text-[var(--clr-muted)]"
              aria-label="Close chat"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl animate-fade-in">
              <AlertCircle size={13} />
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick prompts (show when only welcome message) */}
        {messages.length === 1 && !isLoading && (
          <div className="px-4 pb-3 shrink-0">
            <div className="text-[10px] font-semibold text-[var(--clr-muted)] uppercase tracking-wide mb-2">
              Quick Questions
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-xs bg-[var(--clr-surface)] hover:bg-[var(--clr-saffron)]/10 text-[var(--clr-navy)] hover:text-[var(--clr-saffron)] border border-[var(--clr-border)] hover:border-[var(--clr-saffron)]/40 px-3 py-1.5 rounded-full transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 border-t border-[var(--clr-border)] shrink-0">
          <div className="flex items-end gap-2 bg-[var(--clr-surface)] rounded-2xl border border-[var(--clr-border)] focus-within:border-[var(--clr-saffron)] focus-within:ring-1 focus-within:ring-[var(--clr-saffron)] transition-all p-2">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask about any government service…"
              disabled={isLoading}
              className="flex-1 bg-transparent text-sm text-[var(--clr-navy)] placeholder:text-gray-400 outline-none resize-none leading-relaxed py-1 px-2 max-h-24 min-h-[36px]"
              style={{ fontFamily: 'var(--font-body)' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-[var(--clr-saffron)] hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0"
              aria-label="Send message"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
          <p className="text-[9px] text-center text-[var(--clr-muted)] mt-2">
            AI may make mistakes. Always verify on official government portals.
          </p>
        </div>
      </aside>
    </>
  );
}
