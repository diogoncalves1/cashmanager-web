import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTranslations } from "next-intl/server";
import FinancialGoalDetails from "./components/FinancialGoalDetails";

export const metadata: Metadata = {
  title: "Cash Manager | Financial Goals",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

type FinancialGoalPageParams = {
  params: Promise<{ id: string }>;
};
export default async function FinancialGoalPage({ params }: FinancialGoalPageParams) {
  const { id } = await params;
  const t = await getTranslations("FINANCIAL_GOALS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOAL")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("DETAILS") },
        ]}
      />
      <FinancialGoalDetails id={id} />
    </>
  );
}
