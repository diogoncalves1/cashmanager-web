import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTranslations } from "next-intl/server";
import TransactionDetails from "@/components/transactions/details/TransactionDetails";

export const metadata: Metadata = {
  title: "Cash Manager | Account",
  description: "Account financial overview",
};

type AccountsPageParams = {
  params: Promise<{ id: string }>;
};

export default async function AccountsPage({ params }: AccountsPageParams) {
  const { id } = await params;
  const t = await getTranslations("TRANSACTIONS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("TRANSACTIONS")}
        breadcrumb={[
          { title: t("TRANSACTIONS"), path: "/transactions" },
          { title: t("TRANSACTIONS_DETAILS") },
        ]}
      />

      <TransactionDetails id={id} />
    </>
  );
}
