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
import { DebtPaymentStatus, debtPaymentStatus } from "@/features/debt-payments/types/index";
import { useTranslations } from "next-intl";
import { DatePicker } from "@/shared/ui/date-picker";

interface PaymentsFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  statusFilter: DebtPaymentStatus | "all";
  onStatusFilterChange: (v: DebtPaymentStatus) => void;
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

  return (
    <div className="space-y-3">
      {/* Search */}
      {enableSearch && (
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground " />
          <Input
            placeholder={t("SEARCH_PAYMENT")}
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
              <SelectValue placeholder={t("STATUS")} />
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

        <DatePicker
          date={dateFrom}
          dateLimits={{ max: dateTo }}
          className="w-min bg-white"
          onChangeDate={(newDate: string) => onDateFromChange(newDate)}
        />
        <span className="text-xs text-muted-foreground">{t("TO")}</span>
        <DatePicker
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
