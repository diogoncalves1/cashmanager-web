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
  priority?: string;
  sort?: string;
  sortOrder?: "asc" | "desc";
}

interface GoalsFiltersProps {
  filters: Filters | undefined;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
}

const GoalsFilters = ({ filters, setFilters }: GoalsFiltersProps) => {
  const t = useTranslations("FINANCIAL_GOALS");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((prev) => (prev === key ? null : key));
  const hasActiveFilters = Boolean(filters?.status) || Boolean(filters?.priority);
  const activeFilterCount = [Boolean(filters?.status), Boolean(filters?.priority)].filter(
    Boolean
  ).length;

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      status: undefined,
      priority: undefined,
    }));
  };

  return (
    <div className="flex w-full flex-wrap items-center gap-3">
      <SearchInput
        value={filters?.search || ""}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
      />
      <SortDropdown
        sort={filters?.sort}
        sortOrder={filters?.sortOrder}
        options={[
          { value: "priority", label: t("PRIORITY") },
          { value: "totalAmount", label: t("TOTAL_AMOUNT") },
        ]}
        onSortChange={(value) =>
          setFilters((prev) => ({
            ...prev,
            sort: value as "priority" | "totalAmount",
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
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <CustomSelect
            value={filters?.status ?? "all"}
            placeholder={t("STATUS")}
            className="w-full sm:w-[190px]"
            options={[
              { label: t("ALL"), value: "all" },
              { label: t("IN_PROGRESS"), value: "in_progress" },
              { label: t("COMPLETED"), value: "completed" },
              { label: t("CANCELED"), value: "canceled" },
            ]}
            open={openDropdown === "status"}
            onToggle={() => toggle("status")}
            onSelect={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value !== "all" ? value : undefined,
              }))
            }
          />

          <CustomSelect
            value={filters?.priority ?? "all"}
            placeholder={t("PRIORITY")}
            className="w-full sm:w-[170px]"
            options={[
              { label: t("ALL"), value: "all" },
              { label: t("HIGH"), value: "high" },
              { label: t("MEDIUM"), value: "medium" },
              { label: t("LOW"), value: "low" },
            ]}
            open={openDropdown === "priority"}
            onToggle={() => toggle("priority")}
            onSelect={(value) =>
              setFilters((prev) => ({
                ...prev,
                priority: value !== "all" ? value : undefined,
              }))
            }
          />
        </div>
      </FiltersPanel>
    </div>
  );
};

export default GoalsFilters;
