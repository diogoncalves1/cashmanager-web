import type { Metadata } from "next";
import React from "react";
import { getTranslations } from "next-intl/server";
import { FinancialGoalDetails } from "@/features/financial-goals";

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

  return <FinancialGoalDetails id={id} />;
}
