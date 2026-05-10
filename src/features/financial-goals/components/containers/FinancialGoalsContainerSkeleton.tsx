export function FinancialGoalsContainerSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-card border border-border shadow-sm animate-pulse"
          >
            <div className="h-3 w-24 bg-muted rounded mb-3" />
            <div className="h-7 w-16 bg-muted rounded" />
          </div>
        ))}
      </div>
    </>
  );
}
