import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import { getTranslations } from "next-intl/server";
import { FinancialGoalForm } from "@/features/financial-goals/components/forms/FinancialGoalForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FINANCIAL_GOALS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function AccountsPage() {
  const t = useTranslations("FINANCIAL_GOALS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOALS")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("ADD") },
        ]}
      />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
            {t("NEW_FINANCIAL_GOAL")}
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">{t("NEW_FINANCIAL_GOAL_TEXT")}</p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm">
          <FinancialGoalForm />
        </div>
      </div>
    </>
  );
}
