"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";

interface FiltersPanelProps {
  activeCount: number;
  children: React.ReactNode;
  onClearFilters?: () => void;
  hasActiveFilters?: boolean;
  defaultOpen?: boolean;
}

export function FiltersPanel({
  activeCount,
  children,
  onClearFilters,
  hasActiveFilters,
  defaultOpen = false,
}: FiltersPanelProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [showOverflow, setShowOverflow] = useState(defaultOpen);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setShowOverflow(true), 300);
      return () => clearTimeout(timer);
    }

    setShowOverflow(false);
  }, [open]);

  return (
    <>
      {/* Filters button */}
      <Button
        type="button"
        variant="app_gray"
        size="lg"
        onClick={() => setOpen((p) => !p)}
        className={cn("gap-2")}
      >
        <SlidersHorizontal className="size-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-md bg-accent text-sm font-light text-white">
            {activeCount}
          </span>
        )}
      </Button>

      {/* Filters row */}
      <div
        className={cn(
          "basis-full grid transition-all duration-300 ease-in-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          showOverflow ? "overflow-visible" : "overflow-hidden"
        )}
      >
        <div className={cn("min-h-0", showOverflow ? "overflow-visible" : "overflow-hidden")}>
          <div className="flex flex-wrap items-end space-x-3 pt-1 pb-0.5">
            {children}

            {hasActiveFilters && onClearFilters && (
              <Button
                type="button"
                variant="app_danger"
                size="lg"
                onClick={onClearFilters}
                className="gap-1"
              >
                <X className="size-5" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
