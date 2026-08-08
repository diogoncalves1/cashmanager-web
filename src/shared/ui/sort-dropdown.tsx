"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Check } from "lucide-react";
import { cn } from "@/shared/utils";
import { useTranslations } from "next-intl";

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  sort?: string;
  sortOrder?: "asc" | "desc";
  options: SortOption[];
  onSortChange: (value: string) => void;
  onOrderToggle: () => void;
}

const SortDropdown = ({
  sort,
  sortOrder = "asc",
  options,
  onSortChange,
  onOrderToggle,
}: SortDropdownProps) => {
  const t = useTranslations("SORT_DROPDOWN");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const OrderIcon = sortOrder === "desc" ? ArrowDownNarrowWide : ArrowUpNarrowWide;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-label={t("SORT_BY")}
        className="flex size-12 items-center justify-center rounded-lg border-0 bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      >
        <OrderIcon size={19} strokeWidth={1.75} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[230px] rounded-xl border border-gray-100 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">
              {t("SORT_BY")}
            </span>
            <button
              type="button"
              onClick={onOrderToggle}
              className="text-[12px] font-medium text-success-600 hover:text-success-700 dark:text-success-400 dark:hover:text-success-300"
            >
              {sortOrder === "desc" ? t("DESCENDING") : t("ASCENDING")}
            </button>
          </div>

          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

          <div className="max-h-[320px] overflow-y-auto py-1">
            {options.map((option) => {
              const active = option.value === sort;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onSortChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-[13px] transition-colors",
                    active
                      ? "font-medium text-success-600 dark:text-success-400"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                  )}
                >
                  {option.label}
                  {active && <Check size={14} strokeWidth={2} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
