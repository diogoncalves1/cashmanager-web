"use client";

import { AccountType } from "@/models/account";
import { Currency } from "@/models/currency";
import { useEffect, useState } from "react";
import { AccountSummaryCards } from "./AccountSummaryCards";
import { AccountFilters } from "./AccountFilters";
import AccountsList from "./AccountsList";
import { useAccounts } from "../hooks/useAccounts";

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

  const { accounts, loading, loadMore, hasMore, total, stats } = useAccounts(debouncedFilters);

  return (
    <div className="space-y-6">
      <AccountSummaryCards stats={stats} />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <AccountFilters setFilters={setFilters} filters={filters} />
        <p className="text-sm text-muted-foreground">
          {total} account
          {total !== 1 ? "s" : ""}
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
