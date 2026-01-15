"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FinancialGoal } from "@/lib/models/financialGoal";
import { FinancialGoalTransaction } from "@/lib/models/financialGoalTransactions";

import FinancialGoalTransactionList from "@/components/financial-goals/details/FinancialGoalTransactionList";
import FinancialGoalUsersList from "@/components/financial-goals/details/FinancialGoalUsersList";
import { FinancialGoalTabs } from "./FinancialGoalTabs";
import FinancialGoalOverview from "./FinancialGoalOverview";
import FinancialGoalOthers from "./FinancialGoalOthers";
import MonthlySummaryChart from "./MonthlySummaryChart";

type FinancialGoalDetailsProps = {
  id: string;
};

type PageData = {
  financialGoal?: FinancialGoal;
  recentTransaction: FinancialGoalTransaction[];
  users: any[];
  monthlySummary: any[];
};

export default function FinancialGoalDetails({ id }: FinancialGoalDetailsProps) {
  const router = useRouter();
  const [pageData, setPageData] = useState<PageData>({
    recentTransaction: [],
    users: [],
    monthlySummary: [],
  });

  const [activeTab, setActiveTab] = useState<
    "overview" | "transactions" | "users" | "others" | "monthly-summary"
  >("overview");

  const { data, error, isLoading } = useSWR(
    id ? [`/financial-goals/${id}`, { method: "GET" }] : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setPageData({
        financialGoal: data.data,
        recentTransaction: data.additionals?.transactions || [],
        users: data.additionals?.users || [],
        monthlySummary: data.additionals?.monthlySummary || [],
      });
    }

    if (error) {
      router.push("/financial-goals");
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

  if (!pageData.financialGoal) return <></>;

  const renderTab = () => {
    switch (activeTab) {
      case "overview":
        return (
          <FinancialGoalOverview
            financialGoal={pageData.financialGoal}
            recentTransaction={pageData.recentTransaction}
          />
        );
      case "transactions":
        return <FinancialGoalTransactionList financialGoal={pageData.financialGoal} />;
      case "users":
        return <FinancialGoalUsersList financialGoal={pageData.financialGoal} />;
      case "monthly-summary":
        return (
          <MonthlySummaryChart
            data={pageData.monthlySummary}
            financialGoal={pageData.financialGoal}
          />
        );
      case "others":
        return (
          <FinancialGoalOthers
            financialGoal={pageData.financialGoal}
            setStatus={(status) => {
              setPageData((prev: any) => ({
                ...prev,
                financialGoal: { ...prev.financialGoal, status: status },
              }));
            }}
            router={router}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Tabs */}
      <FinancialGoalTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Tab Content */}
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
