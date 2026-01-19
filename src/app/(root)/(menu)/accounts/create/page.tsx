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
      <div className="grid grid-cols-12 p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <AccountsForm />
        </div>
      </div>
    </>
  );
}
