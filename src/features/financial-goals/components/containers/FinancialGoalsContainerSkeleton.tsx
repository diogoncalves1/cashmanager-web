export function FinancialGoalsContainerSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
            <div className="mb-3 h-3 w-24 rounded bg-muted" />
            <div className="h-7 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    </>
  );
}
