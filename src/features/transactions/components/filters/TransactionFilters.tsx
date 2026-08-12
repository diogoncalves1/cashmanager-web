"use client";

import {
  getTransactionStatus,
  getTransactionTypes,
  TransactionStatus,
  TransactionType,
} from "@/features/transactions";
import { Category, iconMap } from "@/shared/types/category";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/shared/ui/date-picker";
import SearchInput from "@/shared/ui/search-input";
import SortDropdown from "@/shared/ui/sort-dropdown";
import { SortingState, Updater } from "@tanstack/react-table";
import { FiltersPanel } from "@/shared/ui/filters-panel";
import CustomSelect from "@/shared/ui/custom-select";
import { useState } from "react";
import { Circle } from "lucide-react";

type SortField = "account" | "date" | "amount";

interface TransactionsFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  sorting: SortingState;
  setSorting: (updater: Updater<SortingState>) => void;
  statusFilter: TransactionStatus | "all";
  onStatusFilterChange: (v: TransactionStatus | string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (v: string) => void;
  typeFilter: TransactionType | "all";
  onTypeFilterChange: (v: TransactionType | "all") => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
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
  sorting,
  setSorting,
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((p) => (p === key ? null : key));
  const activeFilterCount = [typeFilter !== "all", statusFilter !== "all"].filter(Boolean).length;

  const sortField = sorting[0]?.id as SortField | undefined;
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";

  return (
    <div className="space-y-3 max-w-100 md:max-w-full">
      <div className="flex flex-wrap items-center gap-2">
        {enableSearch && (
          <SearchInput value={search} onChange={(e) => onSearchChange(e.target.value)} />
        )}

        <SortDropdown
          sort={sortField}
          sortOrder={sortOrder}
          options={[
            { value: "account", label: t("ACCOUNT") },
            { value: "date", label: t("DATE") },
            { value: "amount", label: t("AMOUNT") },
          ]}
          onSortChange={(value) =>
            setSorting([{ id: value as SortField, desc: sortOrder === "desc" }])
          }
          onOrderToggle={() =>
            setSorting((prev) =>
              prev.length ? [{ ...prev[0], desc: !prev[0].desc }] : [{ id: "date", desc: true }]
            )
          }
        />

        <FiltersPanel
          activeCount={activeFilterCount}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={onClearFilters}
        >
          {enableStatusFilter && (
            <CustomSelect
              value={statusFilter}
              onSelect={onStatusFilterChange}
              placeholder={t("STATUS")}
              options={transactionStatus}
              open={openDropdown === "status"}
              onToggle={() => {
                toggle("status");
              }}
            />
          )}

          <CustomSelect
            value={categoryFilter}
            placeholder={t("CHOOSE_CATEGORY")}
            options={
              categories?.map((c: Category) => {
                const Icon = iconMap[c.icon as keyof typeof iconMap] ?? Circle;

                return {
                  label: c.name,
                  value: c.id,
                  icon: <Icon className="size-5" style={{ color: c.color }} />,
                };
              }) ?? []
            }
            onSelect={onCategoryFilterChange}
            open={openDropdown === "category"}
            onToggle={() => toggle("category")}
          />

          {enableTypeFilter && (
            <CustomSelect
              value={typeFilter}
              onSelect={(v) => onTypeFilterChange(v as TransactionType | "all")}
              placeholder={t("CHOOSE_TYPE")}
              options={transactionTypes}
              open={openDropdown === "type"}
              onToggle={() => {
                toggle("type");
              }}
            />
          )}

          <div className="flex w-full sm:w-auto items-center gap-2">
            <DatePicker
              date={dateFrom}
              dateLimits={{ max: dateTo }}
              onChangeDate={(newDate: string) => onDateFromChange(newDate)}
            />
            <span className="text-xs text-muted-foreground shrink-0">{t("TO")}</span>
            <DatePicker
              date={dateTo}
              dateLimits={{ min: dateFrom }}
              onChangeDate={(newDate: string) => onDateToChange(newDate)}
            />
          </div>
        </FiltersPanel>
      </div>
    </div>
  );
}
