import { cn } from "@/shared/utils";

export function GoalCardLoading() {
  return (
    <div
      className={cn(
        "group relative p-5 rounded-2xl border border-border block bg-gray-300",
        "shadow-sm animate-pulse"
      )}
    >
      {/* Header: Name + Status */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-5 w-16 bg-muted rounded-full" />
      </div>

      {/* Progress Section */}
      <div className="space-y-2 mb-4">
        <div className="flex items-baseline justify-between">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-muted/50 rounded-full w-1/2" />
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="h-4 w-12 bg-muted rounded" />
          <div className="h-4 w-16 bg-muted rounded" />
        </div>
      </div>

      {/* Footer: Priority + Users */}
      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-muted" />
          <div className="h-4 w-20 bg-muted rounded" />
        </div>

        <div className="flex items-center -space-x-2">
          <div className="w-7 h-7 rounded-full bg-muted border-2 border-card" />
          <div className="w-7 h-7 rounded-full bg-muted border-2 border-card" />
          <div className="w-7 h-7 rounded-full bg-muted border-2 border-card" />
        </div>
      </div>
    </div>
  );
}
