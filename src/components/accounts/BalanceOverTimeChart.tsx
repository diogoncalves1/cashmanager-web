"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BalanceOverTimeChartProps {
  chartsData: {
    weekly: {
      date: string;
      amount: number;
      amountFormated: string;
      transactionAmount: number;
    }[];
    monthly: {
      date: string;
      amount: number;
      amountFormated: string;
      transactionAmount: number;
    }[];
    quarterly: {
      date: string;
      amount: number;
      amountFormated: string;
      transactionAmount: number;
    }[];
    annualy: {
      date: string;
      amount: number;
      amountFormated: string;
      transactionAmount: number;
    }[];
  };
  isLoading?: boolean;
  balance: number;
  balanceFormated?: string;
}

const TEAL_500 = "#14b8a6";

export function BalanceOverTimeChart({
  chartsData,
  isLoading,
  balance,
  balanceFormated,
}: BalanceOverTimeChartProps) {
  const t = useTranslations("ACCOUNTS");

  const RANGES = [
    { label: t("7D"), days: 7 },
    { label: t("1M"), days: 30 },
    { label: t("3M"), days: 90 },
    { label: t("1Y"), days: 365 },
  ] as const;

  const [rangeDays, setRangeDays] = useState(7);
  const monthsT = useTranslations("MONTHS");

  const data = useMemo(() => {
    const type: "weekly" | "monthly" | "quarterly" | "annualy" =
      rangeDays === 7
        ? "weekly"
        : rangeDays === 30
          ? "monthly"
          : rangeDays === 90
            ? "quarterly"
            : "annualy";

    const now = new Date();
    const start = new Date(now);
    start.setDate(start.getDate() - rangeDays);

    let transactionsSum = 0;
    for (let d = new Date(now); d >= start; d.setDate(d.getDate() - 1)) {
      const dateStr = d.toISOString().split("T")[0];

      let lastData = {
        amount: balance + Number(transactionsSum.toFixed(2)),
        amountFormated: `${formatCurrency(balance + Number(transactionsSum.toFixed(2)), balanceFormated ?? "$ 0", false, 2)}`,
      };
      const currentData = chartsData[type].find((entry) => entry.date === dateStr);
      if (currentData) {
        transactionsSum -= currentData.transactionAmount || 0;

        const lastChartData =
          chartsData[type][chartsData[type].findIndex((entry) => entry.date === dateStr) - 1];

        lastData = lastChartData
          ? lastChartData
          : {
              amount: balance + Number(transactionsSum.toFixed(2)),
              amountFormated: `${formatCurrency(balance + Number(transactionsSum.toFixed(2)), balanceFormated ?? "$ 0", false, 2)}`,
            };
      } else {
        chartsData[type].unshift({
          date: dateStr,
          amount: lastData?.amount || 0,
          amountFormated:
            `${formatCurrency(lastData?.amount, balanceFormated ?? "$ 0", false, 2)}` || "$0",
          transactionAmount: 0,
        });
      }
      chartsData[type].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return chartsData[type].map((d) => ({
      date: d.date,
      label: formatDate(d.date, monthsT),
      balance: d.amount,
      formated: d.amountFormated,
    }));
  }, [chartsData, rangeDays, balance, balanceFormated, monthsT]);

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm bg-card">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-0 shadow-sm bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">{t("BALANCE_OVER_TIME")}</CardTitle>
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {RANGES.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => setRangeDays(r.days)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                rangeDays === r.days
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ balance: { label: "Balance", color: TEAL_500 } }}
          className="h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={TEAL_500} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={TEAL_500} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                className="fill-muted-foreground"
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => formatCurrency(v, balanceFormated, true, 1)}
                className="fill-muted-foreground"
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => `${item.payload.formated}`}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="balance"
                stroke={TEAL_500}
                strokeWidth={2}
                fill="url(#balanceGradient)"
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, fill: TEAL_500 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
