export const DebtCardLoading = () => {
  return (
    <div className="min-h-[280px] rounded-md bg-card p-5 shadow-md animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="h-3 w-48 max-w-[45vw] bg-muted rounded" />
          </div>
        </div>

        <div className="h-6 w-16 bg-muted rounded-md" />
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-3 w-10 bg-muted rounded" />
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-muted-foreground/20 rounded-full" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="space-y-2">
          <div className="h-3 w-12 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-12 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-16 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
        <div className="h-3 w-20 bg-muted rounded" />
        <div className="h-3 w-24 bg-muted rounded" />
        <div className="h-3 w-20 bg-muted rounded" />
      </div>
    </div>
  );
};
