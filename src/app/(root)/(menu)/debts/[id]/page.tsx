import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DebtDetails from "./components/DebtDetails";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Cash Manager | Debts",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

type DebtDetailsPageParams = {
  params: Promise<{ id: string }>;
};
export default async function DebtDetailsPage({ params }: DebtDetailsPageParams) {
  const { id } = await params;
  const t = await getTranslations("DEBTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBT")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("DETAILS") }]}
      />
      <DebtDetails id={id} />
    </>
  );
}
