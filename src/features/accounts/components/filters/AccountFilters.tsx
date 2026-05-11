"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AccountType, getAccountStatus, getAccountTypes } from "@/features/accounts";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

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
}

export function AccountFilters({ filters, setFilters }: AccountFiltersProps) {
  const t = useTranslations("ACCOUNTS");

  const accountTypes = getAccountTypes(t);
  const accountStatus = getAccountStatus(t);

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("SEARCH_ACCOUNT")}
          value={filters?.search || ""}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="pl-9 bg-white"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t("TYPE")}</Label>
        <Select
          value={filters?.type}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, type: value as AccountType | "all" }))
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("ALL_TYPES")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("ALL_TYPES")}</SelectItem>
            {accountTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t("STATUS")}</Label>
        <Select
          value={filters?.active}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, active: value as "all" | "active" | "inactive" }))
          }
        >
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder={t("ALL_STATUS")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("ALL_STATUS")}</SelectItem>
            {accountStatus.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t("SORT_BY")}</Label>
        <Select
          value={filters?.sort}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, sort: value as "name" | "balance" | "type" }))
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t("NAME")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("NAME")}</SelectItem>
            <SelectItem value="balance">{t("BALANCE")}</SelectItem>
            <SelectItem value="type">{t("TYPE")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">{t("ORDER")}</Label>
        <Select
          value={filters?.sortOrder}
          onValueChange={(value) =>
            setFilters((prev) => ({ ...prev, sortOrder: value as "asc" | "desc" }))
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder={t("ASCENDING")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">{t("ASCENDING")}</SelectItem>
            <SelectItem value="desc">{t("DESCENDING")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
