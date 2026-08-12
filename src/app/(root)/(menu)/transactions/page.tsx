import type { Metadata } from "next";
import React from "react";
import { TableContainer } from "@/features/transactions";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TRANSACTIONS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function TransactionsPage() {
  return <TableContainer />;
}
