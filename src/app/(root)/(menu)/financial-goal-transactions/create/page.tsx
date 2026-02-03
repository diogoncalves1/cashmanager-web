import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useTranslations } from "next-intl";
import FormContainer from "./components/FormContainer";

export const metadata: Metadata = {
  title: "Cash Manager | Financial Goal Transactions",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function FinancialGoalTransactionsPage() {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("ADD_TRANSACTION")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("TRANSACTIONS"), path: "/financial-goal-transactions" },
          { title: t("ADD") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
            New Transaction
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Record a deposit, withdrawal, or progress update for your financial goals.
          </p>
        </div>

        <FormContainer />
      </div>
    </>
  );
}
