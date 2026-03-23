import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--clr-off-white)] px-4 text-center">
      <div
        className="text-8xl font-bold mb-4"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--clr-navy)' }}
      >
        404
      </div>
      <h1
        className="text-2xl font-semibold text-[var(--clr-navy)] mb-2"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Page Not Found
      </h1>
      <p className="text-[var(--clr-muted)] mb-8 max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-[var(--clr-navy)] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[var(--clr-navy-mid)] transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
