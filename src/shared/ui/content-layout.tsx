import React from "react";
import { cn } from "@/shared/utils";

export function ContentLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-md bg-white p-4 shadow-md xl:p-6",
        "dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
}
