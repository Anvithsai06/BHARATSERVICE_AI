import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/types';

interface Props {
  message: ChatMessage;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end gap-2 animate-slide-up">
        <div className="max-w-[82%]">
          <div className="bg-[var(--clr-navy)] text-white text-sm px-4 py-3 rounded-2xl rounded-tr-sm leading-relaxed">
            {message.content}
          </div>
          <div className="text-right text-[10px] text-[var(--clr-muted)] mt-1 mr-1">
            {formatTime(message.timestamp)}
          </div>
        </div>
        <div className="w-7 h-7 rounded-full bg-[var(--clr-navy)]/10 flex items-center justify-center shrink-0 mt-0.5">
          <User size={14} className="text-[var(--clr-navy)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 animate-slide-up">
      <div className="w-7 h-7 rounded-full bg-[var(--clr-saffron)]/10 flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={14} className="text-[var(--clr-saffron)]" />
      </div>
      <div className="max-w-[88%]">
        <div className="bg-[var(--clr-surface)] border border-[var(--clr-border)] text-sm px-4 py-3 rounded-2xl rounded-tl-sm">
          <div className="prose-chat text-[var(--clr-navy)]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
        <div className="text-[10px] text-[var(--clr-muted)] mt-1 ml-1">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
}
