import type { Metadata } from "next";
import React from "react";
import { DebtsContainer } from "@/features/debts";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DEBTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function DebtsPage() {
  return <DebtsContainer />;
}
