"use client";

import { GoalCardLoading, GoalCard, GoalsListFail } from "@/features/financial-goals";
import { useFinancialGoals } from "@/features/financial-goals/server";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  goals: ReturnType<typeof useFinancialGoals>["goals"];
  loadMore: () => void;
  hasMore: boolean;
  total: number;
  loading: boolean;
};

export function GoalsList({ goals, loadMore, hasMore, total, loading }: Props) {
  const t = useTranslations("FINANCIAL_GOALS");

  return !loading && goals.length == 0 ? (
    <GoalsListFail />
  ) : !loading ? (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {goals.map((goal) => (
        <GoalCard financialGoal={goal} key={goal.id} />
      ))}

      {hasMore && (
        <div className="flex justify-center md:col-span-2 xl:col-span-3">
          <Button
            variant="outline"
            size="lg"
            onClick={loadMore}
            className="gap-2 bg-transparent text-sm"
          >
            {t("LOAD_MORE")}
            <span className="text-muted-foreground">
              ({total - goals.length}{" "}
              {total - goals.length > 1 ? t("REMAINING_PLURAL") : t("REMAINING")})
            </span>
          </Button>
        </div>
      )}
    </div>
  ) : (
    loading && (
      <div className="grid gap-4 opacity-80 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <GoalCardLoading key={index} />
        ))}
      </div>
    )
  );
}
