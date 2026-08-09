"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { cn } from "@/shared/utils";

export default function CustomSelect({
  value,
  placeholder,
  options,
  open,
  onToggle,
  onSelect,
  onClear,
  disabled = false,
  hasError = false,
  className,
}: {
  value: string;
  placeholder: string;
  options: { label: string; value: string; icon?: React.ReactNode; keywords?: string }[];
  open: boolean;
  onToggle: () => void;
  onSelect: (v: string) => void;
  onClear?: () => void;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const safeOptions = options ?? [];

  useEffect(() => {
    if (!open) {
      setSearch("");
      setHighlightedIndex(0);
      return;
    }

    setTimeout(() => searchRef.current?.focus(), 0);

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  const filtered = safeOptions.filter((o) =>
    `${o.label} ${o.keywords ?? ""}`.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    if (!list) return;
    const el = list.children[highlightedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, open]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (filtered.length === 0 ? 0 : (prev + 1) % filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        filtered.length === 0 ? 0 : (prev - 1 + filtered.length) % filtered.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opt = filtered[highlightedIndex];
      if (opt) {
        onSelect(opt.value);
        setSearch("");
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onToggle();
    }
  };

  const handleButtonKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter")) {
      e.preventDefault();
      onToggle();
    }
  };

  const baseClasses =
    "w-full border-none h-12 rounded-md px-4 py-3 text-sm text-left flex items-center justify-between cursor-pointer transition-all duration-200";

  const buttonClass =
    baseClasses +
    (disabled
      ? " bg-gray-50 border-gray-200 cursor-not-allowed"
      : `cursor-pointer bg-gray-100 hover:bg-gray-200 ${open || hasError ? "" : "hover:bg-gray-200"}`);

  const selectedOption = safeOptions.find((o) => o.value === value);

  return (
    <div className={cn("relative w-min min-w-[150px]", className)} ref={containerRef}>
      <button
        type="button"
        onClick={onToggle}
        onKeyDown={handleButtonKeyDown}
        disabled={disabled}
        className={buttonClass}
      >
        <span
          className={`flex items-center gap-2 truncate ${
            value ? "text-gray-800 font-medium" : "text-gray-400"
          }`}
        >
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <span className="flex items-center justify-center shrink-0">
                  {selectedOption.icon}
                </span>
              )}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {onClear && value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="w-5 h-5 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              <X className="size-3 text-gray-400" />
            </span>
          )}
          <ChevronDown
            className={cn(
              "size-4 ml-1 text-gray-400 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </div>
      </button>

      {open && (
        <div className="absolute top-full left-0 w-full bg-white rounded-md p-1 mt-1 z-30 shadow-xl">
          {/* Search input */}
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-gray-100 border border-gray-200 transition-colors">
              <Search className="size-3.5 text-gray-400 shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Pesquisar..."
                className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
              />
              {search && (
                <span
                  onClick={() => setSearch("")}
                  className="size-4 flex items-center justify-center rounded-md hover:bg-gray-200 cursor-pointer shrink-0"
                >
                  <X className="size-3 text-gray-400" />
                </span>
              )}
            </div>
          </div>

          {/* Options list */}
          <div className="max-h-40 overflow-y-auto" ref={listRef}>
            {filtered.length > 0 ? (
              filtered.map((opt, index) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    onSelect(opt.value);
                    setSearch("");
                  }}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2.5 text-sm cursor-pointer rounded-md transition-colors hover:bg-gray-100 flex items-center gap-2 ${
                    value === opt.value ? "font-semibold bg-gray-200" : "text-gray-700"
                  }`}
                >
                  {opt.icon && (
                    <span className="flex items-center justify-center shrink-0">{opt.icon}</span>
                  )}
                  {value === opt.value && (
                    <span
                      style={{ color: "#E11A2E" }}
                      className="flex items-center justify-center shrink-0"
                    >
                      ✓
                    </span>
                  )}
                  <span className="truncate">{opt.label}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-gray-400 text-center">
                <Search className="size-5 mx-auto mb-1" />
                Sem resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
