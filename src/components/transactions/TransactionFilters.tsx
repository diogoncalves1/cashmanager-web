"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TransactionStatus, TransactionType } from "@/models/transaction";
import { Category } from "@/models/category";
import { AccountBasic } from "@/models/account";

interface TransactionsFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: TransactionStatus | "all";
  onStatusFilterChange: (v: TransactionStatus) => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  typeFilter: TransactionType | "all";
  onTypeFilterChange: (v: TransactionType | "all") => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  accounts: AccountBasic[];
  categories: Category[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  enableFilters?: boolean;
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
  enableTypeFilter?: boolean;
}

export function TransactionsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  typeFilter,
  onTypeFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  categories,
  hasActiveFilters,
  onClearFilters,
  enableFilters = true,
  enableSearch = true,
  enableStatusFilter = true,
  enableTypeFilter = true,
}: TransactionsFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative ">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground " />
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-[150px] bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((c) => {
              return (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(v) => onTypeFilterChange(v as TransactionType | "all")}
        >
          <SelectTrigger className="w-[140px] bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="revenue">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-[145px] bg-white"
          aria-label="Date from"
          max={dateTo}
        />
        <span className="text-xs text-muted-foreground">to</span>
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-[145px] bg-white"
          aria-label="Date to"
          min={dateFrom}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1 text-muted-foreground"
          >
            <X className="size-3" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
