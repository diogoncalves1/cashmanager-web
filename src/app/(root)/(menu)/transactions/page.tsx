import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import TransactionsContainer from "@/features/transactions/components/containers/TransactionsContainer";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("TRANSACTIONS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function TransactionsPage() {
  const t = useTranslations("TRANSACTIONS");
  return (
    <>
      <PageBreadcrumb pageTitle={t("TRANSACTIONS")} breadcrumb={[{ title: t("TRANSACTIONS") }]} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <TransactionsContainer />
      </div>
    </>
  );
}
