import React from "react";

const Loading = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
      </div>

      <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm">
        <div className="space-y-8 animate-pulse">
          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-14 bg-muted rounded-xl" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-14 bg-muted rounded-xl" />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>

            <div className="h-14 bg-muted rounded-xl" />
          </div>

          {/* Dates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-14 bg-muted rounded-xl" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-14 bg-muted rounded-xl" />
              </div>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="h-12 bg-muted rounded-xl" />
              <div className="h-12 bg-muted rounded-xl" />
              <div className="h-12 bg-muted rounded-xl" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 w-32 bg-muted rounded" />
            <div className="h-24 bg-muted rounded-xl" />
          </div>

          {/* Submit */}
          <div className="h-14 bg-muted rounded-xl" />

          {/* Footer text */}
          <div className="h-3 w-64 mx-auto bg-muted rounded" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
