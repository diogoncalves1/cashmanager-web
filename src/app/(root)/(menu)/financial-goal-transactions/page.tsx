import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTranslations } from "next-intl/server";
import TransactionsContainer from "@/components/goal-transactions/TransactionsContainer";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FINANCIAL_GOAL_TRANSACTIONS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function AccountsPage() {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("FINANCIAL_GOAL_TRANSACTION")}
        breadcrumb={[
          { title: t("FINANCIAL_GOALS"), path: "/financial-goals" },
          { title: t("TRANSACTIONS") },
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <TransactionsContainer />
      </div>
    </>
  );
}
