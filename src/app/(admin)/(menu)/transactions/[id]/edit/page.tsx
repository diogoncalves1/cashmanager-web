import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { TransactionsForm } from "@/components/form/transactions/TransactionsForm";

export const metadata: Metadata = {
  title: "Cash Manager | Transactions",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

type TransactionsPageParams = {
  params: {
    id: string;
  };
};

export default function TransactionsPage({ params }: TransactionsPageParams) {
  const { id } = params;

  return (
    <>
      <PageBreadcrumb
        pageTitle="EDIT TRANSACTION"
        breadcrumb={[{ title: "Transactions", path: "/transactions" }, { title: "Edit" }]}
      />
      <div className="grid grid-cols-12 p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <TransactionsForm id={id} />
        </div>
      </div>
    </>
  );
}
