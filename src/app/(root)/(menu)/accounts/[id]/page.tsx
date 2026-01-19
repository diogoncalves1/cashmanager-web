import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AccountDetails from "@/components/accouts/details/AccountDetails";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: `Cash Manager | Contas`,
  description: "Account financial overview",
};

type AccountsPageParams = {
  params: Promise<{ id: string }>;
};

export default async function AccountsPage({ params }: AccountsPageParams) {
  const { id } = await params;
  const t = await getTranslations("ACCOUNTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("ACCOUNT")}
        breadcrumb={[{ title: t("ACCOUNTS"), path: "/accounts" }, { title: t("DETAILS") }]}
      />

      <AccountDetails id={id} />
    </>
  );
}
