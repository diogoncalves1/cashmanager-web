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

type Props = Omit<React.ComponentProps<"input">, "size"> & {
  onSearchClick?: () => void;
};

const SearchInput = ({ value, onSearchClick, className, ...props }: Props) => {
  const t = useTranslations("SEARCH_INPUT");

  return (
    <div className={cn("flex w-full sm:max-w-[280px]", className)}>
      <Input
        placeholder={t("SEARCH")}
        value={value}
        onChange={props.onChange}
        variant="app_gray"
        size="lg"
        className="placeholder:text-lg placeholder:text-gray-400 placeholder:font-light px-4 focus:bg-gray-200 text-base focus-visible:ring-0 dark:bg-gray-800 transition-colors"
        rightIcon={
          <button type="button" onClick={onSearchClick} aria-label={t("SEARCH")}>
            <SearchIcon size={24} />
          </button>
        }
        {...props}
      />
    </div>
  );
};

export default SearchInput;
