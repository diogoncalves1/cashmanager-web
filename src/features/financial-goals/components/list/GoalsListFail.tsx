export function GoalsListFail() {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
        <svg
          className="w-8 h-8 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-foreground mb-1">No goals found</h3>
      <p className="text-muted-foreground">Try adjusting your filters or create a new goal.</p>
    </div>
  );
}
