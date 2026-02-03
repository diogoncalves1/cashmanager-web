"use client";

import React from "react";

import FinancialGoalTransactionsForm from "./FinancialGoalTransactionsForm";
import { useFormStats } from "../hooks/useFormStats";
import { Minus, Plus } from "lucide-react";

const FormContainer = () => {
  const { transactionSummary, recentTransactions, loading } = useFormStats();

  return (
    <div>
      {/* Transaction Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            This Month
          </div>
          <div className="text-2xl font-semibold text-foreground">
            {transactionSummary?.thisMonth}
          </div>
          <div className="text-xs text-accent mt-1">
            {transactionSummary?.difLastMonth}% vs last month
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Total Saved
          </div>
          <div className="text-2xl font-semibold text-foreground">
            {transactionSummary?.totalSaved}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Across {transactionSummary?.totalGoals} goals
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
            Transactions
          </div>
          <div className="text-2xl font-semibold text-foreground">
            {transactionSummary?.currentYearTotalTransactions}
          </div>
          <div className="text-xs text-muted-foreground mt-1">This year</div>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm">
        <FinancialGoalTransactionsForm />
      </div>

      {/* Recent Transactions */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {recentTransactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-muted-foreground/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  {tx.type == "contribution" ? (
                    <Plus className="text-accent" />
                  ) : (
                    <Minus className="text-error-500" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-foreground">{tx.financialGoalName}</div>
                  <div className="text-sm text-muted-foreground">
                    {tx.typeTranslated} · {tx.date}
                  </div>
                </div>
              </div>
              <div
                className={`text-lg font-semibold ${tx.type == "contribution" ? "text-accent" : "text-error-500"}`}
              >
                {tx.type == "contribution" ? "+" : "-"}
                {tx.amountFormated}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
