'use client';

import { useState } from 'react';
import { ExternalLink, FileText, Clock, IndianRupee, Bot, ChevronDown, ChevronUp, Info } from 'lucide-react';
import type { Service } from '@/types';
import { useChatStore } from '@/store';
import ServiceModal from '@/components/ui/ServiceModal';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Identity & Travel':       { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-500' },
  'Identity':                { bg: 'bg-indigo-50',   text: 'text-indigo-700',  dot: 'bg-indigo-500' },
  'Tax & Finance':           { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Electoral':               { bg: 'bg-purple-50',   text: 'text-purple-700',  dot: 'bg-purple-500' },
  'Transport':               { bg: 'bg-orange-50',   text: 'text-orange-700',  dot: 'bg-orange-500' },
  'Civil Registration':      { bg: 'bg-pink-50',     text: 'text-pink-700',    dot: 'bg-pink-500' },
  'State Services':          { bg: 'bg-yellow-50',   text: 'text-yellow-700',  dot: 'bg-yellow-500' },
  'Agriculture & Farmers':   { bg: 'bg-lime-50',     text: 'text-lime-700',    dot: 'bg-lime-500' },
  'Housing & Urban Development': { bg: 'bg-teal-50', text: 'text-teal-700',    dot: 'bg-teal-500' },
  'Health':                  { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-500' },
  'Labour & Employment':     { bg: 'bg-cyan-50',     text: 'text-cyan-700',    dot: 'bg-cyan-500' },
  'Digital Services & IT':   { bg: 'bg-violet-50',   text: 'text-violet-700',  dot: 'bg-violet-500' },
  'Business & MSME':         { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-500' },
  'Education':               { bg: 'bg-sky-50',      text: 'text-sky-700',     dot: 'bg-sky-500' },
  'Pension & Retirement':    { bg: 'bg-slate-50',    text: 'text-slate-700',   dot: 'bg-slate-500' },
  'Food & Civil Supplies':   { bg: 'bg-rose-50',     text: 'text-rose-700',    dot: 'bg-rose-500' },
  'Energy':                  { bg: 'bg-orange-50',   text: 'text-orange-700',  dot: 'bg-orange-400' },
  'Banking & Finance':       { bg: 'bg-green-50',    text: 'text-green-700',   dot: 'bg-green-500' },
  'Commerce & Trade':        { bg: 'bg-fuchsia-50',  text: 'text-fuchsia-700', dot: 'bg-fuchsia-500' },
  'Governance & Grievances': { bg: 'bg-gray-50',     text: 'text-gray-700',    dot: 'bg-gray-500' },
  'Government Recruitment':  { bg: 'bg-blue-50',     text: 'text-blue-800',    dot: 'bg-blue-600' },
  'Legal & Judiciary':       { bg: 'bg-stone-50',    text: 'text-stone-700',   dot: 'bg-stone-500' },
  'Rural Development':       { bg: 'bg-lime-50',     text: 'text-lime-800',    dot: 'bg-lime-600' },
  'Women & Child Development': { bg: 'bg-pink-50',   text: 'text-pink-800',    dot: 'bg-pink-600' },
  'Skill Development':       { bg: 'bg-indigo-50',   text: 'text-indigo-800',  dot: 'bg-indigo-600' },
  'Water & Sanitation':      { bg: 'bg-cyan-50',     text: 'text-cyan-800',    dot: 'bg-cyan-600' },
  'Science & Technology':    { bg: 'bg-purple-50',   text: 'text-purple-800',  dot: 'bg-purple-600' },
  'Environment & Climate':   { bg: 'bg-emerald-50',  text: 'text-emerald-800', dot: 'bg-emerald-600' },
  'Railways & Aviation':     { bg: 'bg-sky-50',      text: 'text-sky-800',     dot: 'bg-sky-600' },
  'Posts & Telecommunications': { bg: 'bg-amber-50', text: 'text-amber-800',   dot: 'bg-amber-600' },
};

function getColors(category: string) {
  return CATEGORY_COLORS[category] ?? { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-400' };
}

interface Props {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: Props) {
  const [expanded, setExpanded]   = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { openChat }              = useChatStore();
  const colors                    = getColors(service.category);

  const handleAskAI = () => {
    const context = [
      `Service: ${service.service_name}`,
      `Category: ${service.category}`,
      `Description: ${service.description}`,
      `Ministry: ${service.ministry}`,
      `Fee: ${service.fee}`,
      `Processing Time: ${service.processing_time}`,
      `Required Documents: ${service.documents.join(', ')}`,
      `Official URL: ${service.url}`,
    ].join('\n');
    openChat(context);
  };

  return (
    <>
      <article
        className="service-card bg-white rounded-2xl border border-[var(--clr-border)] overflow-hidden animate-slide-up flex flex-col"
        style={{ animationDelay: `${Math.min(index, 8) * 55}ms`, animationFillMode: 'both' }}
      >
        {/* Card header */}
        <div className="p-5 pb-3 flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-[var(--clr-navy)] text-base leading-snug mb-1.5 line-clamp-2"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}
              >
                {service.service_name}
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${colors.bg} ${colors.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${colors.dot}`} />
                  {service.category}
                </span>
                {service.relevance_score !== undefined && service.relevance_score > 0.72 && (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Best Match
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
            {service.description}
          </p>

          {/* Meta row */}
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--clr-muted)]">
              <Clock size={11} className="shrink-0 text-[var(--clr-saffron)]" />
              <span className="truncate">{service.processing_time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[var(--clr-muted)]">
              <IndianRupee size={11} className="shrink-0 text-[var(--clr-jade)]" />
              <span className="truncate">{service.fee}</span>
            </div>
          </div>
        </div>

        {/* Expanded documents */}
        {expanded && (
          <div className="px-5 pb-4 animate-fade-in">
            <div className="bg-[var(--clr-surface)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold text-[var(--clr-navy)] uppercase tracking-wide">
                <FileText size={11} className="text-[var(--clr-saffron)]" />
                Required Documents
              </div>
              <ul className="space-y-1.5">
                {service.documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="w-4 h-4 rounded-full bg-[var(--clr-saffron)]/15 text-[var(--clr-saffron)] text-[9px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="px-5 pb-5 pt-2 flex items-center gap-2 mt-auto">
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[var(--clr-navy)] hover:bg-[var(--clr-navy-mid)] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors"
          >
            <ExternalLink size={13} />
            Visit Portal
          </a>

          <button
            onClick={handleAskAI}
            title="Ask AI for guidance"
            className="flex items-center gap-1.5 bg-[var(--clr-saffron)]/10 hover:bg-[var(--clr-saffron)]/20 text-[var(--clr-saffron)] text-sm font-semibold px-3 py-2.5 rounded-xl transition-colors border border-[var(--clr-saffron)]/25"
          >
            <Bot size={13} />
            <span className="hidden sm:inline">Ask AI</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            title="View full details"
            className="p-2.5 rounded-xl hover:bg-[var(--clr-surface)] transition-colors text-[var(--clr-muted)]"
          >
            <Info size={15} />
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            title={expanded ? 'Show less' : 'Show documents'}
            className="p-2.5 rounded-xl hover:bg-[var(--clr-surface)] transition-colors text-[var(--clr-muted)]"
          >
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </article>

      {modalOpen && (
        <ServiceModal service={service} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
