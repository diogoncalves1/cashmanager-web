"use client";

import { Label } from "@/components/ui/label";
import {
  AccountType,
  accountTypeConfig,
  getAccountStatus,
  getAccountTypes,
} from "@/features/accounts";
import { useTranslations } from "next-intl";
import SearchInput from "@/shared/ui/search-input";
import SortDropdown from "@/shared/ui/sort-dropdown";
import { FiltersPanel } from "@/shared/ui/filters-panel";
import CustomSelect from "@/shared/ui/custom-select";
import { useState } from "react";
import { cn } from "@/shared/utils";

interface Filters {
  search?: string;
  type: AccountType | "all";
  active: "all" | "active" | "inactive";
  sort?: "name" | "balance" | "type";
  sortOrder: "asc" | "desc";
}

interface AccountFiltersProps {
  filters: Filters | undefined;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  onClearFilters: () => void;
}

export function AccountFilters({ filters, setFilters, onClearFilters }: AccountFiltersProps) {
  const activeFilterCount = [filters?.type !== "all", filters?.active !== "all"].filter(
    Boolean
  ).length;
  const t = useTranslations("ACCOUNTS");

  const accountTypes = getAccountTypes(t);
  const accountStatus = getAccountStatus(t);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggle = (key: string) => setOpenDropdown((p) => (p === key ? null : key));

  return (
    <div className="flex flex-wrap items-end gap-3">
      <SearchInput
        value={filters?.search || ""}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
      />

      <SortDropdown
        sort={filters?.sort}
        sortOrder={filters?.sortOrder}
        options={[
          { value: "name", label: t("NAME") },
          { value: "balance", label: t("BALANCE") },
          { value: "type", label: t("TYPE") },
        ]}
        onSortChange={(value) =>
          setFilters((prev) => ({ ...prev, sort: value as "name" | "balance" | "type" }))
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
        hasActiveFilters={activeFilterCount > 0}
        onClearFilters={onClearFilters}
      >
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t("TYPE")}</Label>
          <CustomSelect
            value={filters?.type ?? ""}
            onSelect={(value) =>
              setFilters((prev) => ({ ...prev, type: value as AccountType | "all" }))
            }
            placeholder={t("TYPE")}
            options={accountTypes.map((type) => {
              const config = accountTypeConfig[type.value as AccountType];
              const Icon = config.icon;
              return {
                ...type,
                icon: <Icon className={cn("size-5", config.className)} strokeWidth={1.75} />,
              };
            })}
            open={openDropdown === "type"}
            onToggle={() => {
              toggle("type");
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t("STATUS")}</Label>
          <CustomSelect
            value={filters?.active ?? ""}
            onSelect={(value) =>
              setFilters((prev) => ({ ...prev, active: value as "all" | "active" | "inactive" }))
            }
            placeholder={t("STATUS")}
            options={accountStatus}
            open={openDropdown === "status"}
            onToggle={() => {
              toggle("status");
            }}
          />
        </div>
      </FiltersPanel>
    </div>
  );
}
