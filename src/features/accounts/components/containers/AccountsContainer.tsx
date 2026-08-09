"use client";

import { AccountType, FormAccountDialog } from "@/features/accounts";
import { Currency } from "@/shared/types/currency";
import { useCallback, useEffect, useState } from "react";
import { AccountSummaryCards } from "@/features/accounts";
import { AccountFilters, AccountsList } from "@/features/accounts";
import { useAccounts } from "@/features/accounts/server";
import { useTranslations } from "next-intl";
import { ContentLayout } from "@/shared/ui/content-layout";
import CreateButton from "@/shared/ui/create-button";

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

const defaultFilters: Filters = {
  active: "all",
  type: "all",
  sort: "name",
  sortOrder: "asc",
};

export const AccountsContainer = () => {
  const t = useTranslations("ACCOUNTS");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(filters);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const { accounts, loading, loadMore, hasMore, total, stats, setLoad } =
    useAccounts(debouncedFilters);

  return (
    <div className="grid gap-4">
      <CreateButton className="ml-auto" onClick={() => setIsOpen(true)}>
        {t("NEW_ACCOUNT")}
      </CreateButton>

      <AccountSummaryCards stats={stats} />

      <ContentLayout>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <AccountFilters setFilters={setFilters} filters={filters} onClearFilters={clearFilters} />
          <p className="shrink-0 text-sm text-gray-500 dark:text-gray-400 lowercase">
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
      </ContentLayout>

      <FormAccountDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mutate={() => {
          if (setLoad) setLoad((prev) => !prev);
        }}
      />
    </div>
  );
};
