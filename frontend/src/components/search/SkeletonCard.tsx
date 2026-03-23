export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[var(--clr-border)] p-5 overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 space-y-2">
          <div className="skeleton h-5 w-3/4 rounded-lg" />
          <div className="skeleton h-4 w-1/3 rounded-full" />
        </div>
        <div className="skeleton h-6 w-20 rounded-md" />
      </div>
      <div className="skeleton h-4 w-full rounded mb-1.5" />
      <div className="skeleton h-4 w-5/6 rounded mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-full rounded" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton flex-1 h-10 rounded-xl" />
        <div className="skeleton w-20 h-10 rounded-xl" />
        <div className="skeleton w-10 h-10 rounded-xl" />
      </div>
    </div>
  );
}
