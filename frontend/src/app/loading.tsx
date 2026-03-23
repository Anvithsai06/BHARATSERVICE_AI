export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header skeleton */}
      <div className="h-16 bg-white border-b border-[var(--clr-border)] flex items-center px-8">
        <div className="skeleton w-32 h-7 rounded-lg" />
        <div className="ml-auto flex gap-3">
          <div className="skeleton w-24 h-7 rounded-lg" />
          <div className="skeleton w-28 h-8 rounded-lg" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="h-72 bg-[var(--clr-navy-dark)] flex flex-col items-center justify-center gap-4 px-4">
        <div className="skeleton w-16 h-5 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="skeleton w-80 h-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }} />
        <div className="skeleton w-56 h-5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <div className="skeleton w-full max-w-xl h-14 rounded-2xl mt-2" style={{ background: 'rgba(255,255,255,0.15)' }} />
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto w-full px-4 py-10">
        <div className="skeleton w-48 h-7 rounded-lg mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[var(--clr-border)] p-5">
              <div className="skeleton h-5 w-3/4 rounded-lg mb-2" />
              <div className="skeleton h-4 w-1/3 rounded-full mb-4" />
              <div className="skeleton h-4 w-full rounded mb-1.5" />
              <div className="skeleton h-4 w-5/6 rounded mb-4" />
              <div className="flex gap-2">
                <div className="skeleton flex-1 h-10 rounded-xl" />
                <div className="skeleton w-20 h-10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
