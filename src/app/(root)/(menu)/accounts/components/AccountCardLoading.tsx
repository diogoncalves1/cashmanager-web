"use client";

import { Card, CardContent } from "@/components/ui/card";

export function AccountCardLoading() {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5 animate-pulse">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex size-11 items-center justify-center rounded-xl bg-muted" />

            <div className="space-y-2">
              {/* Account Name */}
              <div className="h-4 w-32 rounded bg-muted" />

              {/* Account Type */}
              <div className="h-3 w-24 rounded bg-muted" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Balance */}
            <div className="text-right space-y-2">
              <div className="h-6 w-24 rounded bg-muted ml-auto" />
              <div className="h-3 w-12 rounded bg-muted ml-auto" />
            </div>

            {/* Menu button */}
            <div className="size-8 rounded bg-muted" />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <div className="h-3 w-28 rounded bg-muted" />
          <div className="h-3 w-12 rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
