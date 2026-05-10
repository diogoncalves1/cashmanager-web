import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import DebtDetails from "@/features/debts/components/details/DebtDetails";
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
  const t = await getTranslations("DEBTS");

  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBTS")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("DETAILS") }]}
      />
      <DebtDetails id={id} />
    </>
  );
}
