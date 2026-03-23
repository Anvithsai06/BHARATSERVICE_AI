'use client';

import { useState, useEffect } from 'react';
import { Bot, Menu, X } from 'lucide-react';
import { useChatStore } from '@/store';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openChat } = useChatStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-[4px] z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[var(--clr-border)]'
          : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-[var(--clr-navy)] flex items-center justify-center shadow-md group-hover:bg-[var(--clr-navy-mid)] transition-colors">
                <span className="text-white font-display font-bold text-lg leading-none">भ</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[var(--clr-saffron)] rounded-full border-2 border-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-700 text-[var(--clr-navy)] text-lg leading-tight">
                Gov<span className="text-[var(--clr-saffron)]">Saathi</span>
              </div>
              <div className="text-[10px] text-[var(--clr-muted)] font-medium tracking-wide uppercase">
                AI Service Finder
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#search"
              className="text-sm font-medium text-[var(--clr-navy)] hover:text-[var(--clr-saffron)] transition-colors"
            >
              Search Services
            </a>
            <a
              href="#categories"
              className="text-sm font-medium text-[var(--clr-navy)] hover:text-[var(--clr-saffron)] transition-colors"
            >
              Categories
            </a>
            <button
              onClick={() => openChat()}
              className="flex items-center gap-2 bg-[var(--clr-navy)] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[var(--clr-navy-mid)] transition-colors shadow-sm"
            >
              <Bot size={15} />
              AI Assistant
            </button>
          </nav>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => openChat()}
              className="flex items-center gap-1.5 bg-[var(--clr-navy)] text-white px-3 py-2 rounded-lg text-sm font-semibold"
            >
              <Bot size={14} />
              Chat
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-[var(--clr-surface)] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[var(--clr-border)] px-4 py-4 space-y-3 animate-fade-in">
          <a
            href="#search"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[var(--clr-navy)]"
          >
            Search Services
          </a>
          <a
            href="#categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-[var(--clr-navy)]"
          >
            Categories
          </a>
        </div>
      )}
    </header>
  );
}
