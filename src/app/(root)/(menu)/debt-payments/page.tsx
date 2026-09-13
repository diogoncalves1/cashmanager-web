import type { Metadata } from "next";
import React from "react";
import { PaymentsContainer } from "@/features/debt-payments";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DEBT_PAYMENTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function DebtPaymentsPage() {
  return <PaymentsContainer />;
}
