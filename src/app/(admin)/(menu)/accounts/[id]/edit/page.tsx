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
      <div className="grid grid-cols-12 p-6 gap-4 md:gap-6">
        <div className="col-span-12">
          <AccountsForm id={id} />
        </div>
      </div>
    </>
  );
}
