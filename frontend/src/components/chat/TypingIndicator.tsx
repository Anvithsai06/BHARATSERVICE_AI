import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex gap-2 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-[var(--clr-saffron)]/10 flex items-center justify-center shrink-0">
        <Bot size={14} className="text-[var(--clr-saffron)]" />
      </div>
      <div className="bg-[var(--clr-surface)] border border-[var(--clr-border)] px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="flex items-center gap-1.5 h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[var(--clr-muted)] animate-bounce"
              style={{ animationDelay: `${i * 150}ms`, animationDuration: '0.9s' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
