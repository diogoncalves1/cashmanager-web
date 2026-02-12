import type { Metadata } from "next";

import { useTranslations } from "next-intl";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

import AccountsContainer from "./components/AccountsContainer";
import { AppLink } from "@/components/ui/button/AppLink";
import { Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Cash Manager | Accounts",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function AccountsPage() {
  const t = useTranslations("ACCOUNTS");

  return (
    <>
      <PageBreadcrumb pageTitle={t("ACCOUNT")} breadcrumb={[{ title: t("ACCOUNTS") }]} />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="mt-1 text-muted-foreground">
              Manage your financial accounts and track balances
            </p>
          </div>
          <AppLink path="/accounts/create" className=" px-5">
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </AppLink>
        </div>

        <AccountsContainer />
      </div>
    </>
  );
}
