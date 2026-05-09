import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTranslations } from "next-intl/server";
import { FinancialGoalForm } from "@/features/financial-goals/components/forms/FinancialGoalForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FINANCIAL_GOALS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}
type Props = {
  params: Promise<{ id: string }>;
};

export default async function FinancialGoalEditPage({ params }: Props) {
  const t = await getTranslations("FINANCIAL_GOALS");
  const { id } = await params;

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOALS")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("EDIT") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
            {t("EDIT_FINANCIAL_GOAL")}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">{t("EDIT_FINANCIAL_GOAL_TEXT")}</p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm">
          <FinancialGoalForm id={id} />
        </div>
      </div>
    </>
  );
}
