'use client';

import { useEffect, useRef } from 'react';
import { X, ExternalLink, FileText, Clock, IndianRupee, Bot, Building2, Tag } from 'lucide-react';
import type { Service } from '@/types';
import { useChatStore } from '@/store';

interface Props {
  service: Service;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { openChat } = useChatStore();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleAskAI = () => {
    const context = `Service: ${service.service_name}\nCategory: ${service.category}\nDescription: ${service.description}\nMinistry: ${service.ministry}\nFee: ${service.fee}\nProcessing Time: ${service.processing_time}\nRequired Documents: ${service.documents.join(', ')}\nOfficial URL: ${service.url}`;
    onClose();
    openChat(context);
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={service.service_name}
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90dvh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-[var(--clr-border)] px-6 py-4 flex items-start justify-between gap-3 rounded-t-3xl">
          <div className="flex-1 min-w-0">
            <h2
              className="text-lg font-bold text-[var(--clr-navy)] leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {service.service_name}
            </h2>
            <span className="text-xs text-[var(--clr-muted)] font-medium">{service.category}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--clr-surface)] transition-colors text-[var(--clr-muted)] shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Building2, label: 'Ministry', value: service.ministry, color: 'text-blue-600' },
              { icon: Clock,     label: 'Processing Time', value: service.processing_time, color: 'text-[var(--clr-saffron)]' },
              { icon: IndianRupee, label: 'Fee', value: service.fee, color: 'text-[var(--clr-jade)]' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="bg-[var(--clr-surface)] rounded-xl px-4 py-3 col-span-1 last:col-span-2 sm:last:col-span-1"
              >
                <div className={`flex items-center gap-1.5 text-xs font-semibold mb-1 ${color}`}>
                  <Icon size={12} />
                  {label}
                </div>
                <div className="text-xs text-[var(--clr-navy)] font-medium leading-snug">{value}</div>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--clr-navy)] uppercase tracking-wide mb-3">
              <FileText size={12} className="text-[var(--clr-saffron)]" />
              Required Documents
            </div>
            <ul className="space-y-2">
              {service.documents.map((doc, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-[var(--clr-saffron)]/10 text-[var(--clr-saffron)] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          {service.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--clr-navy)] uppercase tracking-wide mb-2">
                <Tag size={11} />
                Related Keywords
              </div>
              <div className="flex flex-wrap gap-1.5">
                {service.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-[var(--clr-surface)] border border-[var(--clr-border)] text-[var(--clr-muted)] px-2.5 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-6 flex gap-3">
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--clr-navy)] hover:bg-[var(--clr-navy-mid)] text-white text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            <ExternalLink size={15} />
            Visit Official Portal
          </a>
          <button
            onClick={handleAskAI}
            className="flex items-center gap-2 bg-[var(--clr-saffron)]/10 hover:bg-[var(--clr-saffron)]/20 text-[var(--clr-saffron)] border border-[var(--clr-saffron)]/30 text-sm font-semibold px-4 py-3 rounded-xl transition-colors"
          >
            <Bot size={15} />
            Ask AI
          </button>
        </div>
      </div>
    </div>
  );
}
