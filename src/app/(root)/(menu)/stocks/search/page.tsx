import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/ui/PageBreadCrumb";
import { StocksSearch } from "@/features/stocks";

export const metadata: Metadata = {
  title: "Cash Manager | Accounts",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function AccountsPage() {
  return (
    <>
      <PageBreadcrumb
        pageTitle="STOCKS"
        breadcrumb={[{ title: "Stocks", path: "/stocks" }, { title: "Search" }]}
      />
      <div className="grid grid-cols-12 p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <StocksSearch />
        </div>
      </div>
    </>
  );
}
