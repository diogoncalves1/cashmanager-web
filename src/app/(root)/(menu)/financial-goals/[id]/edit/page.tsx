import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FinancialGoalForm } from "@/components/form/financial-goals/FinancialGoalForm";

export const metadata: Metadata = {
  title: "Cash Manager | Financial Goals",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

type FinancialGoalsPageParams = {
  params: {
    id: string;
  };
};

export default function FinancialGoalPage({ params }: FinancialGoalsPageParams) {
  const { id } = params;
  const t = useTranslations("FINANCIAL_GOALS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOAL")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("EDIT") },
        ]}
      />
      <div className="grid grid-cols-12 p-2 md:p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <FinancialGoalForm id={id} />
        </div>
      </div>
    </>
  );
}
