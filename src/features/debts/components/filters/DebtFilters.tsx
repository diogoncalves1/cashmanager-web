"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import SearchInput from "@/shared/ui/search-input";
import SortDropdown from "@/shared/ui/sort-dropdown";
import { FiltersPanel } from "@/shared/ui/filters-panel";
import CustomSelect from "@/shared/ui/custom-select";

interface Filters {
  search?: string;
  status?: string;
  sort?: string;
  sortOrder?: "asc" | "desc";
}

interface DebtsFiltersProps {
  filters: Filters | undefined;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const DebtsFilters = ({ filters, setFilters }: DebtsFiltersProps) => {
  const t = useTranslations("DEBTS");

  const hasActiveFilters = Boolean(filters?.status);
  const activeFilterCount = [Boolean(filters?.status)].filter(Boolean).length;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((p) => (p === key ? null : key));

  const handleClearFilters = () => {
    setFilters((prev) => ({ ...prev, status: undefined }));
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <SearchInput
        value={filters?.search || ""}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
      />

      <SortDropdown
        sort={filters?.sort}
        sortOrder={filters?.sortOrder}
        options={[
          { value: "name", label: t("NAME") },
          { value: "totalAmount", label: t("TOTAL_AMOUNT") },
          { value: "interestRate", label: t("INTEREST_RATE") },
          { value: "remainingAmount", label: t("REMAINING_AMOUNT") },
        ]}
        onSortChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            sort: value as "name" | "totalAmount" | "interestRate" | "remainingAmount",
          }))
        }
        onOrderToggle={() =>
          setFilters((prev) => ({
            ...prev,
            sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
          }))
        }
      />

      <FiltersPanel
        activeCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={handleClearFilters}
      >
        <CustomSelect
          value={filters?.status ?? "all"}
          onSelect={(value) =>
            setFilters((prev) => ({
              ...prev,
              status: value !== "all" ? value : undefined,
            }))
          }
          placeholder={t("STATUS")}
          options={[
            { label: t("ALL"), value: "all" },
            { label: t("PAID"), value: "paid" },
            { label: t("PENDING"), value: "pending" },
          ]}
          open={openDropdown === "status"}
          onToggle={() => {
            toggle("status");
          }}
        />
      </FiltersPanel>
    </div>
  );
};

export default DebtsFilters;
