"use client";

import AccountsListFail from "./AccountsListFail";
import { AccountCard } from "./AccountCard";
import { GoalCardLoading } from "../../financial-goals/components/GoalCardLoading";
import { useAccounts } from "../hooks/useAccounts";
import LoadMoreList from "@/components/ui/lists/LoadMoreList";

type Props = {
  accounts: ReturnType<typeof useAccounts>["accounts"];
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  loading: boolean;
};

export default function AccountsList({ accounts, loadMore, hasMore, total, loading }: Props) {
  return (
    <>
      {!loading && accounts.length == 0 ? (
        <AccountsListFail />
      ) : !loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {accounts.map((account) => (
            <AccountCard account={account} key={account.id} />
          ))}

          {hasMore && (
            <LoadMoreList loadMore={loadMore} total={total} subjectLength={accounts.length} />
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
