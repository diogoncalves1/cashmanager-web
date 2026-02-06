import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import { DebtPaymentsDataTable } from "./data-table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Cash Manager | Debt Payments",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function DebtPaymentsPage() {
  const t = useTranslations("DEBT_PAYMENTS");
  return (
    <>
      <PageBreadcrumb
        pageTitle={t("DEBT_PAYMENTS")}
        breadcrumb={[{ title: t("DEBTS"), path: "/debts" }, { title: t("PAYMENTS") }]}
      />
      <div className="grid grid-cols-12 p-2 md:p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <DebtPaymentsDataTable />
        </div>
      </div>
    </>
  );
}
