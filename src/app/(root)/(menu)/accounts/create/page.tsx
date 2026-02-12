import type { Metadata } from "next";
import React from "react";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AccountsForm from "@/components/form/accounts/AccountsForm";

export const metadata: Metadata = {
  title: "Cash Manager | Accounts",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function AccountsPage() {
  return (
    <>
      <PageBreadcrumb
        pageTitle="ADD ACCOUNT"
        breadcrumb={[{ title: "Accounts", path: "/accounts" }, { title: "Add" }]}
      />
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance">
            New Account
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Record a deposit, withdrawal, or progress update for your financial goals.
          </p>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm">
          <AccountsForm />
        </div>
      </div>
    </>
  );
}
