"use client";

import { useState } from "react";
import { DebtsList } from "@/features/debts";
import { useDebts } from "@/features/debts/server";
import { useTranslations } from "next-intl";

interface Filters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
}

export function DebtsContainer() {
  const t = useTranslations("DEBTS");
  const [filters, setFilters] = useState<Filters>();

  const { debts, loading, loadMore, isLoadingMore, hasMore, total, stats } = useDebts(filters);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {t("TOTAL_DEBT")}
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.totalDebtFormated}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {t("ACROSS")} {stats.activeDebts}{" "}
            <span className="lowercase">{stats.activeDebts > 1 ? t("DEBTS") : t("DEBT")}</span>
          </div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {t("TOTAL_PAID")}
          </div>
          <div className="text-2xl font-semibold text-accent">{stats.totalPaidFormated}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {(!stats.totalAmounDebt && !stats.totalPaid) || stats.totalAmounDebt == 0
              ? 0
              : Math.round((stats.totalPaid / stats.totalAmounDebt) * 100)}
            % {t("OF_TOTAL")}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {t("ACTIVE_DEBTS")}
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.activeDebts}</div>
          <div className="text-xs text-muted-foreground mt-2 lowercase">
            {stats.paidDebts} {stats.paidDebts == 1 ? t("COMPLETED") : t("COMPLETED_PLURAL")}
          </div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            {t("MONTHLY_PAYMENTS")}
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.monthlyPayments}</div>
          <div className="text-xs text-muted-foreground mt-2">{t("ACTIVE_DEBTS_ONLY")}</div>
        </div>
      </div>
      <DebtsList
        debts={debts}
        loadMore={loadMore}
        hasMore={hasMore}
        total={total}
        loading={loading}
        filters={filters}
        setFilters={setFilters}
        isLoadingMore={isLoadingMore}
      />
    </>
  );
}
