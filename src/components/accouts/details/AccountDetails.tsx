"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Transaction } from "@/lib/models/transaction";
import { Account } from "@/lib/models/account";
import { AccountHeader } from "./AccountHeader";
import { CategorySummary } from "@/components/charts/accounts/CategoryExpensesChart";
import { MonthlySummary } from "@/components/charts/accounts/MonthlySummaryChart";
import { AccountTabs } from "./AccountTabs";
import AccountBalance from "./AccountBalance";
import AccountMonthlySummary from "./AccountMonthlySummary";
import AccountOverview from "./AccountOverview";
import AccountCategoryExpenses from "./AccountCategoryExpenses";
import AccountOthers from "./AccountOthers";
import AccountTransactions from "./AccountTransactions";
import AccountUsers from "./AccountUsers";

type AccountsDetailsProps = {
  id: string;
};

export default function AccountDetails({ id }: AccountsDetailsProps) {
  const router = useRouter();

  const [pageData, setPageData] = useState<{
    account?: Account;
    recentTransaction: Transaction[];
    monthlySummary: MonthlySummary[];
    categorySummary: CategorySummary;
  }>({
    recentTransaction: [],
    monthlySummary: [],
    categorySummary: { data: [], total: 0, totalFormated: "" },
  });
  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "users" | "others" | "monthly" | "categories"
  >("overview");

  const { data, error, isLoading } = useSWR(
    id ? [`/accounts/${id}`, { method: "GET" }] : null,
    fetcher
  );
  const setAccountData = (newAccount: Account) => {
    setPageData((prev) => ({
      ...prev,
      account: newAccount,
    }));
  };
  useEffect(() => {
    if (data) {
      setPageData({
        account: data.data,
        recentTransaction: data.additionals.transactions,
        monthlySummary: data.additionals.monthlyResume,
        categorySummary: data.additionals.categorySummary,
      });
    }

    if (error) {
      router.push("/accounts");
    }
  }, [data, error, router]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-24 rounded-2xl bg-gray-100" />
        <div className="h-40 rounded-3xl bg-gray-100" />
        <div className="h-64 rounded-2xl bg-gray-100" />
      </div>
    );
  }
  if (!pageData.account) return <></>;

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <AccountOverview
            account={pageData.account}
            recentTransaction={pageData.recentTransaction}
          />
        );

      case "transactions":
        return <AccountTransactions account={pageData.account} />;

      case "monthly":
        return <AccountMonthlySummary data={pageData.monthlySummary} account={pageData.account} />;

      case "categories":
        return (
          <AccountCategoryExpenses account={pageData.account} data={pageData.categorySummary} />
        );

      case "others":
        return (
          <AccountOthers setAccount={setAccountData} account={pageData.account} router={router} />
        );

      case "users":
        return <AccountUsers account={pageData.account} />;

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <AccountHeader account={pageData.account} />

      {/* Balance Hero */}
      <AccountBalance account={pageData.account} />

      {/* Tabs */}
      <AccountTabs
        enableCategories={pageData.categorySummary.data.length > 0}
        enableMonthly={pageData.monthlySummary.length > 0}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
