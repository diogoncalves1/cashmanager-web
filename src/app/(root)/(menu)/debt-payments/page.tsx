import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import PaymentsContainer from "@/features/debt-payments/components/containers/DebtPaymentsContainer";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("DEBT_PAYMENTS");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function DebtPaymentsPage() {
  const t = useTranslations("DEBT_PAYMENTS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBT_PAYMENTS")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("PAYMENTS") }]}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <PaymentsContainer />
      </div>
    </>
  );
}
