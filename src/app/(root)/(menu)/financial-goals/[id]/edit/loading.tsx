import React from "react";

const Loading = () => {
  return (
    <div className="grid gap-3">
      <div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-3 w-16 bg-muted rounded" />
        </div>
      </div>

      <div className="rounded-md bg-white p-4 shadow-md dark:bg-gray-800/60 xl:p-6">
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
                <div className="h-14 rounded-md bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-14 rounded-md bg-muted" />
              </div>
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>

            <div className="h-14 rounded-md bg-muted" />
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
                <div className="h-14 rounded-md bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-14 rounded-md bg-muted" />
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
              <div className="h-12 rounded-md bg-muted" />
              <div className="h-12 rounded-md bg-muted" />
              <div className="h-12 rounded-md bg-muted" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 w-32 bg-muted rounded" />
            <div className="h-24 rounded-md bg-muted" />
          </div>

          {/* Submit */}
          <div className="h-14 rounded-md bg-muted" />

          {/* Footer text */}
          <div className="h-3 w-64 mx-auto bg-muted rounded" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
