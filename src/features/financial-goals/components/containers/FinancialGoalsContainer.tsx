"use client";

import { type ElementType, type ReactNode, useEffect, useState } from "react";
import { GoalsList } from "@/features/financial-goals";
import { useFinancialGoals } from "@/features/financial-goals/server";
import { useTranslations } from "next-intl";
import { ContentLayout } from "@/shared/ui/content-layout";
import GoalsFilters from "../filters/GoalsFilters";
import CreateButton from "@/shared/ui/create-button";
import { useRouter } from "next/navigation";
import { CheckCircle2, PiggyBank, Target, TrendingUp } from "lucide-react";
import { cn } from "@/shared/utils";

interface Filters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
  sortOrder?: "asc" | "desc";
}

type StatCardProps = {
  label: string;
  value: ReactNode;
  subtext?: ReactNode;
  icon: ElementType;
  valueClassName?: string;
  iconClassName?: string;
};

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  valueClassName,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-lg bg-white px-6 py-6 shadow-md dark:bg-gray-800/60">
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300",
            iconClassName
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p
            className={cn(
              "mt-1 truncate text-2xl font-medium text-gray-900 dark:text-gray-100",
              valueClassName
            )}
          >
            {value}
          </p>
          {subtext && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

export function FinancialGoalsContainer() {
  const t = useTranslations("FINANCIAL_GOALS");
  const [filters, setFilters] = useState<Filters>({
    sort: "priority",
    sortOrder: "asc",
  });
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(filters);
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters]);

  const { goals, loading, loadMore, hasMore, total, stats } = useFinancialGoals(debouncedFilters);
  const overallProgress = stats.totalTarget
    ? Math.round(((stats.totalSaved ?? 0) / stats.totalTarget) * 100)
    : 0;

  const statCards: StatCardProps[] = [
    {
      label: t("TOTAL_GOALS"),
      value: stats.totalGoals ?? 0,
      subtext: t("FINANCIAL_GOALS_TEXT"),
      icon: Target,
      iconClassName: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
      label: t("IN_PROGRESS"),
      value: stats.activeGoals ?? 0,
      subtext: t("ACTIVE_GOALS_TEXT"),
      icon: PiggyBank,
      iconClassName: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
      label: t("TOTAL_SAVED"),
      value: stats.totalSavedFormated ?? "-",
      subtext: t("COLLECTED_AMOUNT"),
      icon: CheckCircle2,
      valueClassName: "text-success-600 dark:text-success-400",
      iconClassName: "bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400",
    },
    {
      label: t("OVERALL_PROGRESS"),
      value: `${overallProgress}%`,
      subtext: t("P_COMPLETE"),
      icon: TrendingUp,
      valueClassName: "text-accent",
      iconClassName: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    },
  ];

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            {t("FINANCIAL_GOALS")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("FINANCIAL_GOALS_TEXT")}
          </p>
        </div>

        <CreateButton
          className="sm:ml-auto"
          onClick={() => {
            router.push("financial-goals/create");
          }}
        >
          {t("ADD")}
        </CreateButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <ContentLayout>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <GoalsFilters filters={filters} setFilters={setFilters} />
          <p className="shrink-0 text-sm lowercase text-gray-500 dark:text-gray-400">
            {total} {t("THIS")}
          </p>
        </div>

        <GoalsList
          goals={goals}
          loadMore={loadMore}
          hasMore={hasMore}
          total={total}
          loading={loading}
        />
      </ContentLayout>
    </div>
  );
}
