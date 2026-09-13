import type { Metadata } from "next";
import React from "react";
import { DebtDetails } from "@/features/debts";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DEBTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

type DebtDetailsPageParams = {
  params: Promise<{ id: string }>;
};
export default async function DebtDetailsPage({ params }: DebtDetailsPageParams) {
  const { id } = await params;

  return <DebtDetails id={id} />;
}
