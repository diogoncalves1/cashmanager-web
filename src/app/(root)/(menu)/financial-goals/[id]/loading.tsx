import Skeleton from "@/components/ui/skeleton/Skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-36 rounded-lg" />
          </div>
        </div>

        {/* Progress Card */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
            <Skeleton className="w-32 h-32 rounded-full" />

            <div className="flex-1 space-y-4 w-full">
              <div className="flex justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-24" />
              </div>

              <Skeleton className="h-3 w-full rounded-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-card border border-border shadow-sm space-y-2"
            >
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="space-y-6">
          <Skeleton className="h-10 w-96 rounded-lg" />

          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
