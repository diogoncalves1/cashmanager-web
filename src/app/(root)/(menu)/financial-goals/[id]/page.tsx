import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTranslations } from "next-intl/server";
import FinancialGoalDetails from "@/features/financial-goals/components/details/FinancialGoalDetails";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FINANCIAL_GOALS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

type FinancialGoalPageParams = {
  params: Promise<{ id: string }>;
};
export default async function FinancialGoalPage({ params }: FinancialGoalPageParams) {
  const { id } = await params;
  const t = await getTranslations("FINANCIAL_GOALS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOALS")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("DETAILS") },
        ]}
      />
      <FinancialGoalDetails id={id} />
    </>
  );
}
