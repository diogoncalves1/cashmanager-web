"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Transaction } from "@/lib/types";

interface MonthlyIncomeExpensesDoughnutsProps {
  transactions: Transaction[];
  currency: string;
  isLoading?: boolean;
}

const INCOME_COLOR = "#10b981";
const EXPENSE_COLOR = "#ef4444";

interface MonthBucket {
  label: string;
  income: number;
  expenses: number;
}

function formatCompact(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function SingleDoughnut({ data, currency }: { data: MonthBucket; currency: string }) {
  const total = data.income + data.expenses;
  const pieData = [
    { name: "Income", value: data.income },
    { name: "Expenses", value: data.expenses },
  ];

  const hasData = total > 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-28 sm:size-32">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="85%"
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={INCOME_COLOR} />
                <Cell fill={EXPENSE_COLOR} />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex size-full items-center justify-center">
            <div className="size-24 rounded-full border-4 border-dashed border-muted sm:size-28" />
          </div>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px] text-muted-foreground">Total</span>
          <span className="text-xs font-bold text-foreground sm:text-sm">
            {hasData ? formatCompact(total, currency) : "--"}
          </span>
        </div>
      </div>
      <p className="text-sm font-medium text-foreground">{data.label}</p>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[11px]" style={{ color: INCOME_COLOR }}>
          {formatCompact(data.income, currency)}
        </span>
        <span className="text-[11px]" style={{ color: EXPENSE_COLOR }}>
          {formatCompact(data.expenses, currency)}
        </span>
      </div>
    </div>
  );
}

export function MonthlyIncomeExpensesDoughnuts({
  transactions,
  currency,
  isLoading,
}: MonthlyIncomeExpensesDoughnutsProps) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const buckets: MonthBucket[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const monthIdx = d.getMonth();
      const label = d.toLocaleString("en-US", { month: "short" });

      const monthTxns = transactions.filter((t) => {
        const td = new Date(t.date);
        return td.getFullYear() === year && td.getMonth() === monthIdx && t.status === "completed";
      });

      const income = monthTxns
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTxns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      buckets.push({ label, income, expenses });
    }

    return buckets;
  }, [transactions]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="mt-1 h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton className="size-28 rounded-full sm:size-32" />
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Monthly Income vs Expenses</CardTitle>
        <CardDescription>Doughnut breakdown for each of the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-6 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full" style={{ backgroundColor: INCOME_COLOR }} />
            <span className="text-xs text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-2.5 rounded-full" style={{ backgroundColor: EXPENSE_COLOR }} />
            <span className="text-xs text-muted-foreground">Expenses</span>
          </div>
        </div>

        {/* Doughnut grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {monthlyData.map((d) => (
            <SingleDoughnut key={d.label} data={d} currency={currency} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
