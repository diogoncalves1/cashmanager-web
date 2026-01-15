"use client";

import { FinancialGoalTransactionsDataTable } from "@/app/(admin)/(menu)/financial-goal-transactions/data-table";
import { AppLink } from "@/components/ui/button/AppLink";
import { FinancialGoal } from "@/lib/models/financialGoal";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface FinancialGoalTransactionListProps {
  financialGoal?: FinancialGoal;
}

export default function FinancialGoalTransactionList({
  financialGoal,
}: FinancialGoalTransactionListProps) {
  const t = useTranslations("FINANCIAL_GOALS");
  if (!financialGoal) return <></>;

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4 flex justify-between">
        <h2 className="text-lg font-semibold">{t("ALL_TRANSACTIONS")}</h2>
        {financialGoal.actions?.createTransactions && (
          <AppLink
            variant="default"
            path="/transactions/create"
            className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm gap-2 rounded-xl px-4 py-2"
          >
            <Plus className="size-5" />
            {t("ADD")}
          </AppLink>
        )}
      </div>

      <FinancialGoalTransactionsDataTable
        financialGoalId={financialGoal.id}
        enableFilters={false}
      />
    </div>
  );
}
