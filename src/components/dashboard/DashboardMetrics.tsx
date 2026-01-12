"use client";

import { EcommerceMetrics } from "@/components/dashboard/EcommerceMetrics";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";

import React, { useEffect, useState } from "react";
import { BadgeColor } from "../ui/badge/Badge";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

interface KPIClasses {
  value: string;
  unit: string;
}

export type KpiInterface = {
  totalRevenues: KPIClasses;
  totalExpenses: KPIClasses;
  totalUser: KPIClasses;
  revenuePercentage: number;
  expensesPercentage: number;
  totalPercentage: number;
  revenuesClasses: BadgeColor;
  expensesClasses: BadgeColor;
  totalClasses: BadgeColor;
  currency: string;
};

export default function DashboardMetrics() {
  const { data } = useSWR(["/dashboard-overview?min_date=2025-01-01", { method: "GET" }], fetcher);
  const [revenues, setRevenues] = useState({ name: "Revenues", data: [0] });
  const [expenses, setExpenses] = useState({ name: "Expenses", data: [0] });
  const [userData, setUserData] = useState<{ balance: number; monthYear: string }[]>();

  const [kpis, setKpis] = useState<KpiInterface>({
    totalRevenues: { value: "", unit: "" },
    totalExpenses: { value: "", unit: "" },
    totalUser: { value: "", unit: "" },
    revenuePercentage: 0,
    expensesPercentage: 0,
    totalPercentage: 0,
    revenuesClasses: "error",
    expensesClasses: "error",
    totalClasses: "error",
    currency: "",
  });

  useEffect(() => {
    if (!data) return;

    const currentMonth = new Date().getUTCMonth();

    const rev = { name: "Revenues", data: Array(currentMonth + 1).fill(0) };
    const exp = { name: "Expenses", data: Array(currentMonth + 1).fill(0) };

    console.log(data);

    data.data.charts.monthly.forEach((item: any) => {
      const monthIndex = parseInt(item.month.replace("2025-", "")) - 1;

      rev.data[monthIndex] = parseFloat(item.revenues);
      exp.data[monthIndex] = parseFloat(item.expenses);
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
      <MonthlySalesChart userData={userData} />

      <EcommerceMetrics revenues={revenues} expenses={expenses} kpis={kpis} />
    </div>
  );
}
