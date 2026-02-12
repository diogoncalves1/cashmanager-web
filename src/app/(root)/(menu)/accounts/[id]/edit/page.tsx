import type { Metadata } from "next";
import React from "react";

import AccountsForm from "@/components/form/accounts/AccountsForm";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export const metadata: Metadata = {
  title: "Cash Manager | Edit Account",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

type AccountsPageParams = {
  params: {
    id: string;
  };
};

export default function AccountsPage({ params }: AccountsPageParams) {
  const { id } = params;

  return (
    <>
      <PageBreadcrumb
        pageTitle="EDIT ACCOUNT"
        breadcrumb={[{ title: "Accounts", path: "/accounts" }, { title: "Edit" }]}
      />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
            Edit Account
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Record a deposit, withdrawal, or progress update for your financial goals.
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm">
          <AccountsForm id={id} />
        </div>
      </div>
    </>
  );
}
