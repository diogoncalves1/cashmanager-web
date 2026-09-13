"use client";

import { useState } from "react";
import { DebtPaymentStatus, debtPaymentStatus } from "@/features/debt-payments";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/shared/ui/date-picker";
import SearchInput from "@/shared/ui/search-input";
import SortDropdown from "@/shared/ui/sort-dropdown";
import { SortingState, Updater } from "@tanstack/react-table";
import { FiltersPanel } from "@/shared/ui/filters-panel";
import CustomSelect from "@/shared/ui/custom-select";

type SortField = "debt" | "amount" | "interestPaid" | "date";

interface PaymentsFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  sorting: SortingState;
  setSorting: (updater: Updater<SortingState>) => void;
  statusFilter: DebtPaymentStatus | "all";
  onStatusFilterChange: (v: DebtPaymentStatus | "all") => void;
  dateFrom: string;
  onDateFromChange: (v: string) => void;
  dateTo: string;
  onDateToChange: (v: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  enableSearch?: boolean;
  enableStatusFilter?: boolean;
}

export function PaymentsFilters({
  search,
  onSearchChange,
  sorting,
  setSorting,
  statusFilter,
  onStatusFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  hasActiveFilters,
  onClearFilters,
  enableSearch = true,
  enableStatusFilter = true,
}: PaymentsFiltersProps) {
  const t = useTranslations("DEBT_PAYMENTS");
  const transactionStatus = debtPaymentStatus(t);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key));

  const sortField = sorting[0]?.id as SortField | undefined;
  const sortOrder = sorting[0]?.desc ? "desc" : "asc";
  const activeFilterCount = [statusFilter !== "all", Boolean(dateFrom), Boolean(dateTo)].filter(
    Boolean
  ).length;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        {enableSearch && (
          <SearchInput value={search} onChange={(e) => onSearchChange(e.target.value)} />
        )}

        <SortDropdown
          sort={sortField}
          sortOrder={sortOrder}
          options={[
            { value: "debt", label: t("DEBT") },
            { value: "amount", label: t("AMOUNT") },
            { value: "interestPaid", label: t("INTEREST_PAID") },
            { value: "date", label: t("DATE") },
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
              placeholder={t("STATUS")}
              className="w-full sm:w-[180px]"
              options={[
                { value: "all", label: t("ALL_STATUS") },
                ...transactionStatus.map((status) => ({
                  value: status.value,
                  label: status.label,
                })),
              ]}
              open={openDropdown === "status"}
              onToggle={() => toggle("status")}
              onSelect={(value) => onStatusFilterChange(value as DebtPaymentStatus | "all")}
            />
          )}
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <DatePicker
              className="w-full sm:w-auto"
              date={dateFrom}
              dateLimits={{ max: dateTo }}
              onChangeDate={(newDate: string) => onDateFromChange(newDate)}
            />
            <span className="hidden text-xs text-muted-foreground sm:block">{t("TO")}</span>
            <DatePicker
              className="w-full sm:w-auto"
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
