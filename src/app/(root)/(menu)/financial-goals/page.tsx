import type { Metadata } from "next";
import React from "react";
import { FinancialGoalsContainer } from "@/features/financial-goals";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("FINANCIAL_GOALS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function FinancialGoalsPage() {
  return <FinancialGoalsContainer />;
}
