import { cn } from "@/shared/utils";

export function GoalCardLoading() {
  return (
    <div
      className={cn(
        "relative flex min-h-[280px] flex-col rounded-md bg-card p-5 shadow-md",
        "animate-pulse"
      )}
    >
      {/* Header: Name + Status */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-xl bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-44 max-w-[45vw] rounded bg-muted" />
          </div>
        </div>
        <div className="h-6 w-16 rounded-md bg-muted" />
      </div>

      {/* Progress Section */}
      <div className="mb-4 space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="h-3 w-16 rounded bg-muted" />
          <div className="h-3 w-10 rounded bg-muted" />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 rounded-full bg-muted-foreground/20" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="space-y-2" key={index}>
            <div className="h-3 w-12 rounded bg-muted" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Footer: Priority + Users */}
      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-2">
          <div className="size-2 rounded-full bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>

        <div className="flex items-center -space-x-2">
          <div className="size-7 rounded-full border-2 border-card bg-muted" />
          <div className="size-7 rounded-full border-2 border-card bg-muted" />
          <div className="size-7 rounded-full border-2 border-card bg-muted" />
        </div>
      </div>
    </div>
  );
}
