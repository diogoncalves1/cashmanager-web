import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FinancialGoalForm } from "@/components/form/financial-goals/FinancialGoalForm";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Cash Manager | Financial Goals",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function FinancialGoalEditPage({ params }: Props) {
  const t = await getTranslations("FINANCIAL_GOALS");
  const { id } = await params;

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOAL")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
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

        <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm">
          <FinancialGoalForm id={id} />
        </div>
      </div>
    </>
  );
}
