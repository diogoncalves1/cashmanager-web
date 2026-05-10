"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { IncomeExpensesMetrics, UserMonthlyBalanceChart } from "@/features/dashboard";

export type KpiInterface = {
  totalRevenues: number;
  totalRevenuesFormated: string;
  totalExpenses: number;
  totalExpensesFormated: string;
  totalUser: string;
  revenuePercentage: string;
  expensesPercentage: string;
  totalPercentage: number;
  revenuesClasses: "error" | "warning" | "success";
  expensesClasses: "error" | "warning" | "success";
  totalClasses: string;
};

type ChartSeries = { name: string; data: number[] };
type MonthlyBalanceItem = { balance: number; monthYear: string };

const DEFAULT_KPIS: KpiInterface = {
  totalRevenues: 0,
  totalRevenuesFormated: "0",
  totalExpenses: 0,
  totalExpensesFormated: "0",
  totalUser: "0",
  revenuePercentage: "0",
  expensesPercentage: "0",
  totalPercentage: 0,
  revenuesClasses: "error",
  expensesClasses: "error",
  totalClasses: "error",
};

function buildChartSeries(monthly: { revenues: string; expenses: string }[]): {
  revenues: ChartSeries;
  expenses: ChartSeries;
} {
  const revenues: ChartSeries = { name: "Revenues", data: [] };
  const expenses: ChartSeries = { name: "Expenses", data: [] };

  for (const item of monthly) {
    revenues.data.push(parseFloat(item.revenues));
    expenses.data.push(parseFloat(item.expenses));
  }

  return { revenues, expenses };
}

export function DashboardMetrics() {
  const { data, isLoading } = useSWR(
    [`/dashboard-overview?min_date=2025-01-01`, { method: "GET" }],
    fetcher
  );

  const [revenues, setRevenues] = useState<ChartSeries>({ name: "Revenues", data: [0] });
  const [expenses, setExpenses] = useState<ChartSeries>({ name: "Expenses", data: [0] });
  const [userData, setUserData] = useState<MonthlyBalanceItem[] | undefined>();
  const [kpis, setKpis] = useState<KpiInterface>(DEFAULT_KPIS);

  useEffect(() => {
    if (!data) return;

    const { charts, dashboard } = data.data;
    const { revenues: rev, expenses: exp } = buildChartSeries(charts.monthly);

    setRevenues(rev);
    setExpenses(exp);
    setUserData(charts.userTotal);
    setKpis({
      totalRevenues: dashboard.totalRevenues,
      totalRevenuesFormated: dashboard.totalRevenuesFormated,
      totalExpenses: dashboard.totalExpenses,
      totalExpensesFormated: dashboard.totalExpensesFormated,
      totalUser: dashboard.totalUser,
      revenuePercentage: dashboard.revenuePercentage,
      expensesPercentage: dashboard.expensesPercentage,
      totalPercentage: dashboard.totalPercentage,
      revenuesClasses: dashboard.revenueClasses,
      expensesClasses: dashboard.expensesClasses,
      totalClasses: dashboard.totalClasses,
    });
  }, [data]);

  return (
    <div className="grid grid-cols-12 gap-4 sm:gap-6">
      <div className="col-span-12 xl:col-span-3 order-2 xl:order-1">
        <IncomeExpensesMetrics revenues={revenues} expenses={expenses} kpis={kpis} />
      </div>
      <div className="col-span-12 xl:col-span-9 order-1 xl:order-2">
        <UserMonthlyBalanceChart
          isLoading={isLoading}
          userTotal={kpis.totalUser}
          userData={
            userData?.map((d, idx) => ({
              ...d,
              revenues: revenues.data[idx],
              expenses: expenses.data[idx],
            })) ?? []
          }
        />
      </div>
    </div>
  );
}
