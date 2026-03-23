'use client';

import { AlertCircle, SearchX, RotateCcw } from 'lucide-react';
import { useSearchStore } from '@/store';
import ServiceCard from './ServiceCard';
import SkeletonCard from './SkeletonCard';

export default function ResultsSection() {
  const { results, status, error, query, hasSearched, clearResults } = useSearchStore();

  if (!hasSearched) return null;

  return (
    <section id="results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Results header */}
      {status !== 'loading' && (
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div>
            <h2
              className="text-xl font-bold text-[var(--clr-navy)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {status === 'success' && results.length > 0
                ? `${results.length} Services Found`
                : status === 'error'
                ? 'Search Error'
                : 'No Results Found'}
            </h2>
            {query && (
              <p className="text-sm text-[var(--clr-muted)] mt-0.5">
                Results for: <span className="font-medium text-[var(--clr-navy)]">&ldquo;{query}&rdquo;</span>
              </p>
            )}
          </div>
          <button
            onClick={clearResults}
            className="flex items-center gap-1.5 text-sm text-[var(--clr-muted)] hover:text-[var(--clr-navy)] transition-colors"
          >
            <RotateCcw size={14} />
            Clear
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {status === 'loading' && (
        <div>
          <div className="h-6 skeleton w-48 rounded-lg mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Error state */}
      {status === 'error' && (
        <div className="flex flex-col items-center py-16 text-center animate-fade-in">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={28} className="text-red-400" />
          </div>
          <h3 className="font-semibold text-[var(--clr-navy)] mb-1">Something went wrong</h3>
          <p className="text-sm text-[var(--clr-muted)] max-w-sm mb-4">
            {error || 'Could not complete your search. Please check your connection and try again.'}
          </p>
          <p className="text-xs text-[var(--clr-muted)] bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            Make sure the backend server is running on{' '}
            <code className="font-mono">http://localhost:8000</code>
          </p>
        </div>
      )}

      {/* No results */}
      {status === 'success' && results.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center animate-fade-in">
          <div className="w-16 h-16 bg-[var(--clr-surface)] rounded-full flex items-center justify-center mb-4">
            <SearchX size={28} className="text-[var(--clr-muted)]" />
          </div>
          <h3 className="font-semibold text-[var(--clr-navy)] mb-1">No services found</h3>
          <p className="text-sm text-[var(--clr-muted)] max-w-sm">
            Try rephrasing your query. For example: &ldquo;passport application&rdquo; or &ldquo;voter ID registration&rdquo;.
          </p>
        </div>
      )}

      {/* Results grid */}
      {status === 'success' && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {results.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
