"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Currency } from "@/models/currency";
import UserMonthlyBalanceChart from "@/components/dashboard/UserMonthlyBalanceChart";
import { IncomeExpensesMetrics } from "@/components/dashboard/IncomeExpensesMetrics";

export type KpiInterface = {
  totalRevenues: string;
  totalExpenses: string;
  totalUser: string;
  revenuePercentage: string;
  expensesPercentage: string;
  totalPercentage: number;
  revenuesClasses: "error" | "warning" | "success";
  expensesClasses: "error" | "warning" | "success";
  totalClasses: string;
  currency?: Currency;
};

export default function DashboardMetrics() {
  const { data, isLoading } = useSWR(
    ["/dashboard-overview?min_date=2025-01-01", { method: "GET" }],
    fetcher
  );
  const [revenues, setRevenues] = useState({ name: "Revenues", data: [0] });
  const [expenses, setExpenses] = useState({ name: "Expenses", data: [0] });
  const [userData, setUserData] = useState<{ balance: number; monthYear: string }[]>();

  const [kpis, setKpis] = useState<KpiInterface>({
    totalRevenues: "0",
    totalExpenses: "0",
    totalUser: "0",
    revenuePercentage: "0",
    expensesPercentage: "0",
    totalPercentage: 0,
    revenuesClasses: "error",
    expensesClasses: "error",
    totalClasses: "error",
  });

  useEffect(() => {
    if (!data) return;

    const currentMonth = new Date().getUTCMonth();

    const rev = { name: "Revenues", data: Array(currentMonth + 1).fill(0) };
    const exp = { name: "Expenses", data: Array(currentMonth + 1).fill(0) };

    data.data.charts.monthly.forEach((item: { revenues: string; expenses: string }) => {
      // const monthIndex = parseInt(item.month.split(" ", 1)[0]) - 1;

      rev.data.push(parseFloat(item.revenues));
      exp.data.push(parseFloat(item.expenses));
    });

    setRevenues(rev);
    setExpenses(exp);
    setUserData(data.data.charts.userTotal);
    setKpis({
      totalRevenues: data.data.dashboard.totalRevenues,
      totalExpenses: data.data.dashboard.totalExpenses,
      totalUser: data.data.dashboard.totalUser,
      revenuePercentage: data.data.dashboard.revenuePercentage,
      expensesPercentage: data.data.dashboard.expensesPercentage,
      totalPercentage: data.data.dashboard.totalPercentage,
      revenuesClasses: data.data.dashboard.revenueClasses,
      expensesClasses: data.data.dashboard.expensesClasses,
      totalClasses: data.data.dashboard.totalClasses,
      currency: data.data.dashboard.currency,
    });
  }, [data]);

  return (
    <div className="grid grid-cols-12 gap-6">
      <UserMonthlyBalanceChart isLoading={isLoading} userData={userData} currency={kpis.currency} />

      <IncomeExpensesMetrics revenues={revenues} expenses={expenses} kpis={kpis} />
    </div>
  );
}
