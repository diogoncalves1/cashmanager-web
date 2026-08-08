"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";

interface SortableColumnHeaderProps<TData> {
  column: Column<TData, unknown>;
  children: React.ReactNode;
}

export function SortableColumnHeader<TData>({
  column,
  children,
}: SortableColumnHeaderProps<TData>) {
  const sorted = column.getIsSorted();

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(sorted === "asc")}
      className={cn("group -ml-3 h-8 hover:bg-transparent", sorted && "text-accent")}
    >
      {children}
      {sorted === "asc" && <ArrowUp className="ml-2 size-4" />}
      {sorted === "desc" && <ArrowDown className="ml-2 size-4" />}
      {!sorted && (
        <ChevronsUpDown className="ml-2 size-4 opacity-0 text-accent transition-opacity group-hover:opacity-100" />
      )}
    </Button>
  );
}
