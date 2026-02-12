"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import AccountsListFail from "./AccountsListFail";
import { AccountCard } from "./AccountCard";
import { GoalCardLoading } from "../../financial-goals/components/GoalCardLoading";
import { useAccounts } from "../hooks/useAccounts";

type Props = {
  accounts: ReturnType<typeof useAccounts>["accounts"];
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  loading: boolean;
};

export default function AccountsList({ accounts, loadMore, hasMore, total, loading }: Props) {
  const t = useTranslations("FINANCIAL_GOALS");

  return (
    <>
      {!loading && accounts.length == 0 ? (
        <AccountsListFail />
      ) : !loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((account) => (
            <AccountCard account={account} key={account.id} />
          ))}

          {hasMore && (
            <div className="flex justify-center col-span-3">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                className="gap-2 bg-transparent"
              >
                Load More
                <span className="text-muted-foreground">({total - accounts.length} remaining)</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 opacity-80">
            {Array.from({ length: 9 }).map((_, index) => (
              <GoalCardLoading key={index} />
            ))}
          </div>
        )
      )}
    </>
  );
}
