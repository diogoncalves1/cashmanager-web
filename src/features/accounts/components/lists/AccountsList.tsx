"use client";

import { AccountCardLoading, AccountCard, AccountsListFail } from "@/features/accounts";
import { useAccounts } from "@/features/accounts/server";
import LoadMoreList from "@/components/ui/lists/LoadMoreList";

type Props = {
  accounts: ReturnType<typeof useAccounts>["accounts"];
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  loading: boolean;
};

export function AccountsList({ accounts, loadMore, hasMore, total, loading }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 opacity-80 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, index) => (
          <AccountCardLoading key={index} />
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return <AccountsListFail />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {accounts.map((account) => (
        <AccountCard account={account} key={account.id} />
      ))}

      {hasMore && (
        <LoadMoreList loadMore={loadMore} total={total} subjectLength={accounts.length} />
      )}
    </div>
  );
}
