'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Search, Sparkles, Mic } from 'lucide-react';
import { useSearchStore } from '@/store';

const SUGGESTIONS = [
  'Apply for a passport',
  'Get my Aadhaar updated',
  'Register my business (MSME)',
  'Apply for Ayushman Bharat health card',
  'How to get a driving licence',
  'PM Kisan farmer subsidy',
  'File income tax return',
  'Marriage certificate online',
];

export default function HeroSearch() {
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { runSearch, status } = useSearchStore();

  const handleSearch = useCallback(
    (query: string) => {
      const q = query.trim();
      if (!q) return;
      setInputValue(q);
      setFocused(false);
      runSearch(q);
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    },
    [runSearch]
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch(inputValue);
  };

  const isLoading = status === 'loading';

  return (
    <section
      id="search"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--clr-navy-dark) 0%, var(--clr-navy) 60%, #1e3a8a 100%)',
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--clr-saffron) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--clr-jade-lt) 0%, transparent 70%)' }} />
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
          <Sparkles size={13} className="text-[var(--clr-saffron-lt)]" />
          <span className="text-white/90 text-xs font-medium tracking-wide">
            AI-Powered • 30+ Services • Official Links Only
          </span>
        </div>

        {/* Heading */}
        <h1
          className="text-white mb-4 animate-slide-up"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.25rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          Find the Right
          <span className="text-[var(--clr-saffron)]"> Government Service</span>
          <br />in Seconds
        </h1>

        <p className="text-white/70 text-base sm:text-lg mb-10 max-w-xl mx-auto animate-slide-up leading-relaxed">
          Ask in plain language. Get official links, required documents, and
          step-by-step guidance — instantly.
        </p>

        {/* Search box */}
        <div className="relative max-w-2xl mx-auto animate-slide-up">
          <div
            className={`flex items-center bg-white rounded-2xl shadow-2xl transition-all duration-200 ${
              focused ? 'ring-2 ring-[var(--clr-saffron)] ring-offset-2 ring-offset-transparent' : ''
            }`}
          >
            <Search
              size={20}
              className="ml-4 shrink-0 text-[var(--clr-muted)]"
              aria-hidden
            />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="e.g. Apply for a passport, renew driving licence…"
              className="flex-1 py-4 px-3 text-[var(--clr-navy)] text-base bg-transparent outline-none placeholder:text-gray-400 min-w-0"
              aria-label="Search government services"
              disabled={isLoading}
            />
            <button
              onClick={() => handleSearch(inputValue)}
              disabled={isLoading || !inputValue.trim()}
              className="m-1.5 px-5 py-3 bg-[var(--clr-saffron)] hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shrink-0"
              aria-label="Search"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Searching…</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span className="hidden sm:inline">Search</span>
                </>
              )}
            </button>
          </div>

          {/* Suggestion chips */}
          {focused && !isLoading && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[var(--clr-border)] overflow-hidden z-20 animate-fade-in">
              <div className="px-4 py-2 text-[10px] font-semibold text-[var(--clr-muted)] uppercase tracking-wider border-b border-[var(--clr-border)]">
                Popular searches
              </div>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onMouseDown={() => handleSearch(s)}
                  className="w-full text-left px-4 py-2.5 text-sm text-[var(--clr-navy)] hover:bg-[var(--clr-surface)] flex items-center gap-3 transition-colors"
                >
                  <Search size={13} className="text-[var(--clr-muted)] shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick stat pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          {[
            { label: '30+ Services', color: 'bg-white/10' },
            { label: 'Official Links', color: 'bg-white/10' },
            { label: 'AI Guided', color: 'bg-[var(--clr-saffron)]/20' },
            { label: 'Free Access', color: 'bg-[var(--clr-jade)]/30' },
          ].map(({ label, color }) => (
            <span
              key={label}
              className={`${color} text-white/90 text-xs font-medium px-3 py-1.5 rounded-full border border-white/10`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
