"use client";

import { AccountType } from "@/features/accounts/types/index";
import { Currency } from "@/types/currency";
import { useEffect, useState } from "react";
import { AccountSummaryCards } from "@/features/accounts/components/cards/AccountSummaryCards";
import { AccountFilters } from "@/features/accounts/components/filters/AccountFilters";
import AccountsList from "@/features/accounts/components/lists/AccountsList";
import { useAccounts } from "@/features/accounts/hooks/useAccounts";
import { NewAccountButton } from "@/features/accounts/components/actions/NewAccountButton";
import { useTranslations } from "next-intl";

export interface AccountFormData {
  name: string;
  type: AccountType;
  balance: number;
  currency: Currency;
  isActive: boolean;
  description?: string;
}

interface Filters {
  search?: string;
  type: AccountType | "all";
  active: "all" | "active" | "inactive";
  sort?: "name" | "balance" | "type";
  sortOrder: "asc" | "desc";
}

const AccountsContainer = () => {
  const t = useTranslations("ACCOUNTS");
  const [filters, setFilters] = useState<Filters>({
    active: "all",
    type: "all",
    sort: "name",
    sortOrder: "asc",
  });
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters]);

  const { accounts, loading, loadMore, hasMore, total, stats, setLoad } =
    useAccounts(debouncedFilters);

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("ACCOUNTS")}</h1>
          <p className="mt-1 text-muted-foreground">{t("ACCOUNTS_TEXT")}</p>
        </div>
        <NewAccountButton setLoad={setLoad} />
      </div>

      <AccountSummaryCards stats={stats} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <AccountFilters setFilters={setFilters} filters={filters} />
        <p className="text-sm text-muted-foreground lowercase">
          {total} {total !== 1 ? t("ACCOUNTS") : t("ACCOUNT")}
        </p>
      </div>

      <AccountsList
        accounts={accounts}
        loadMore={loadMore}
        hasMore={hasMore}
        total={total}
        loading={loading}
      />
    </div>
  );
};

export default AccountsContainer;
