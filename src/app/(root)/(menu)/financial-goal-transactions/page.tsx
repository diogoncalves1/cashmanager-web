import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import { FinancialGoalTransactionsDataTable } from "./data-table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Cash Manager | Financial Goals Transactions",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function AccountsPage() {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOAL_TRANSACTION")}
        breadcrumb={[{ title: t("TRANSACTIONS") }]}
      />
      <div className="grid grid-cols-12 p-2 md:p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <FinancialGoalTransactionsDataTable />
        </div>
      </div>
    </>
  );
}
