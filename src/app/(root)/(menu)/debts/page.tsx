import type { Metadata } from "next";
import React from "react";
import { useTranslations } from "next-intl";
import { DataTable } from "./data-table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Cash Manager | Debts",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function DebtsPage() {
  const t = useTranslations("DEBTS");
  return (
    <>
      <PageBreadcrumb pageTitle={t("DEBT")} breadcrumb={[{ title: t("DEBTS") }]} />
      <div className="grid grid-cols-12 p-2 md:p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <DataTable />
        </div>
      </div>
    </>
  );
}
