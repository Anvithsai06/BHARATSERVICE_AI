'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--clr-off-white)] px-4 text-center">
      <div className="text-5xl mb-4">⚠️</div>
      <h1
        className="text-2xl font-semibold text-[var(--clr-navy)] mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Something went wrong
      </h1>
      <p className="text-[var(--clr-muted)] mb-8 max-w-sm text-sm">
        An unexpected error occurred. Please try again or refresh the page.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="bg-[var(--clr-navy)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--clr-navy-mid)] transition-colors text-sm"
        >
          Try Again
        </button>
        <a
          href="/"
          className="border border-[var(--clr-border)] text-[var(--clr-navy)] px-6 py-3 rounded-xl font-semibold hover:bg-[var(--clr-surface)] transition-colors text-sm"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
