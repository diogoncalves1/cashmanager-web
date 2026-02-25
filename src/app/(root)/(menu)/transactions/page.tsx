import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import TransactionsContainer from "@/components/transactions/TransactionsContainer";

export const metadata: Metadata = {
  title: "Cash Manager | Transactions",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function TransactionsPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="TRANSACTION" breadcrumb={[{ title: "Transactions" }]} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <TransactionsContainer />
      </div>
    </>
  );
}
