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
import {
  getTransactionStatus,
  getTransactionTypes,
  TransactionStatus,
  TransactionType,
} from "@/models/transaction";
import { Category } from "@/models/category";
import { AccountBasic } from "@/models/account";
import { useTranslations } from "next-intl";
import { TransactionDatePicker } from "../form/transactions/TransactionDatePicker";

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
  enableSearch = true,
  enableStatusFilter = true,
  enableTypeFilter = true,
}: TransactionsFiltersProps) {
  const t = useTranslations("TRANSACTIONS");
  const transactionStatus = getTransactionStatus(t);
  const transactionTypes = getTransactionTypes(t);

  return (
    <div className="space-y-3">
      {/* Search */}
      {enableSearch && (
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground " />
          <Input
            placeholder={t("SEARCH_TRANSACTION")}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
      )}

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        {enableStatusFilter && (
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-[160px] bg-white">
              <SelectValue placeholder="Account" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("ALL_STATUS")}</SelectItem>
              {transactionStatus.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("ALL_CATEGORIES")}</SelectItem>
            {categories?.map((c) => {
              return (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {enableTypeFilter && (
          <Select
            value={typeFilter}
            onValueChange={(v) => onTypeFilterChange(v as TransactionType | "all")}
          >
            <SelectTrigger className="w-[140px] bg-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("ALL_TYPES")}</SelectItem>
              {transactionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <TransactionDatePicker
          date={dateFrom}
          dateLimits={{ max: dateTo }}
          className="w-min bg-white"
          onChangeDate={(newDate: string) => onDateFromChange(newDate)}
        />
        <span className="text-xs text-muted-foreground">{t("TO")}</span>
        <TransactionDatePicker
          date={dateTo}
          dateLimits={{ min: dateFrom }}
          className="w-min bg-white"
          onChangeDate={(newDate: string) => onDateToChange(newDate)}
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="gap-1 text-muted-foreground"
          >
            <X className="size-3" />
            {t("CLEAR")}
          </Button>
        )}
      </div>
    </div>
  );
}
