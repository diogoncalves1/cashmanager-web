"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/utils";

const SearchIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2.3" />
    <path
      d="M20 20L15.5 15.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.45"
    />
  </svg>
);

type Props = React.ComponentProps<"input"> & {
  onSearchClick?: () => void;
};

const SearchInput = ({ value, onSearchClick, className, ...props }: Props) => {
  const t = useTranslations("SEARCH_INPUT");

  return (
    <div className={cn("flex w-full max-w-[280px]", className)}>
      <Input
        placeholder={t("SEARCH")}
        value={value}
        onChange={props.onChange}
        className="h-12 rounded-r-none border-0 placeholder:text-lg placeholder:text-gray-400 placeholder:font-light bg-gray-100 px-4 hover:bg-gray-200 focus:bg-gray-200 text-base shadow-none focus-visible:ring-0 dark:bg-gray-800 transition-colors"
        {...props}
      />
      <button
        type="button"
        onClick={onSearchClick}
        aria-label={t("SEARCH")}
        className="flex h-12 w-14 shrink-0 items-center justify-center rounded-r-md bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
      >
        <SearchIcon size={24} />
      </button>
    </div>
  );
};

export default SearchInput;
