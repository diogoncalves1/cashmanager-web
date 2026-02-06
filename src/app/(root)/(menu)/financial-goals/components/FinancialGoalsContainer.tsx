"use client";

import { useEffect, useState } from "react";

import GoalsList from "../components/GoalsList";
import { useFinancialGoals } from "../hooks/useFinancialGoals";
import { useTranslations } from "next-intl";

interface Filters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
}

export default function FinancialGoalsContainer() {
  const t = useTranslations("FINANCIAL_GOALS");
  const [filters, setFilters] = useState<Filters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(filters);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(handler);
  }, [filters]);

  const { goals, loading, loadMore, hasMore, total, stats } = useFinancialGoals(debouncedFilters);

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {t("TOTAL_GOALS")}
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.totalGoals}</div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {t("IN_PROGRESS")}
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.activeGoals}</div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {t("TOTAL_SAVED")}
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.totalSavedFormated}</div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {t("OVERALL_PROGRESS")}
          </div>
          <div className="text-2xl font-semibold text-accent">
            {stats.totalTarget
              ? Math.round(((stats.totalSaved as number) / stats.totalTarget) * 100)
              : 0}
            %
          </div>
        </div>
      </div>
      <GoalsList
        goals={goals}
        loadMore={loadMore}
        hasMore={hasMore}
        total={total}
        filters={filters}
        setFilters={setFilters}
        loading={loading}
      />
    </>
  );
}
