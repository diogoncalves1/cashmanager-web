"use client";

import { useState } from "react";
import { useDebts } from "../hooks/useDebts";
import DebtsList from "./DebtsList";

interface Filters {
  search?: string;
  status?: string;
  priority?: string;
  sort?: string;
}

export default function DebtsContainer() {
  const [filters, setFilters] = useState<Filters>();

  const { debts, loading, loadMore, isLoadingMore, hasMore, total, stats } = useDebts(filters);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Total Debt
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.totalDebtFormated}</div>
          <div className="text-xs text-muted-foreground mt-2">Across {stats.activeDebts} debts</div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Total Paid
          </div>
          <div className="text-2xl font-semibold text-accent">{stats.totalPaidFormated}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {stats.totalAmounDebt == 0
              ? 0
              : Math.round((stats.totalPaid / stats.totalAmounDebt) * 100)}
            % of total
          </div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Active Debts
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.activeDebts}</div>
          <div className="text-xs text-muted-foreground mt-2">{stats.paidDebts} completed</div>
        </div>
        <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
            Monthly Payments
          </div>
          <div className="text-2xl font-semibold text-foreground">{stats.monthlyPayments}</div>
          <div className="text-xs text-muted-foreground mt-2">Active debts only</div>
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
