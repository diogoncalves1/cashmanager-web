"use client";

import { useDebts } from "@/features/debts/server";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { DebtCard, DebtCardLoading, DebtListFail } from "@/features/debts";

type Props = {
  debts: ReturnType<typeof useDebts>["debts"];
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  isLoadingMore: boolean;
  loading: boolean;
};

export function DebtsList({ debts, loadMore, hasMore, total, loading, isLoadingMore }: Props) {
  const t = useTranslations("DEBTS");

  return !loading && debts.length == 0 ? (
    <DebtListFail />
  ) : !loading ? (
    <div className="grid gap-4 md:grid-cols-2">
      {debts.map((debt) => (
        <DebtCard debt={debt} key={debt.id} />
      ))}

      {hasMore && (
        <div className="flex justify-center md:col-span-2">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            disabled={isLoadingMore}
            className="gap-2 bg-transparent text-sm"
          >
            {t("LOAD_MORE")}
            <span className="text-muted-foreground">
              ({total - debts.length} {t("REMAINING_PLURAL").toLowerCase()})
            </span>
          </Button>
        </div>
      )}
    </div>
  ) : (
    loading && (
      <div className="grid gap-4 opacity-80 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <DebtCardLoading key={index} />
        ))}
      </div>
    )
  );
}
