import type { Metadata } from "next";
import React from "react";

import { DataTable } from "./data-table";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Cash Manager | Transactions",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function TransactionsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="TRANSACTION" breadcrumb={[{ title: "Transactions" }]} />
      <div className="grid grid-cols-12 p-2 md:p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <DataTable />
        </div>
      </div>
    </>
  );
}
