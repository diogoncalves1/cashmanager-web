import type { Metadata } from "next";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AccountDetails from "@/components/accouts/AccountDetails";

export const metadata: Metadata = {
  title: "Cash Manager | Account",
  description: "Account financial overview",
};

type AccountsPageParams = {
  params: {
    id: string;
  };
};

export default function AccountsPage({ params }: AccountsPageParams) {
  return (
    <>
      <PageBreadcrumb
        pageTitle="ACCOUNT"
        breadcrumb={[{ title: "Accounts", path: "/accounts" }, { title: "Detalhes" }]}
      />

      <AccountDetails id={params.id} />
    </>
  );
}
