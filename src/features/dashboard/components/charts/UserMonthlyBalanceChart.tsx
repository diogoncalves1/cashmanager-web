"use client";

import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyBalanceChartLoading } from "@/features/dashboard";
import { useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { useState, useMemo } from "react";
import { cn, formatCurrency } from "@/lib/utils";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ─── Types ────────────────────────────────────────────────────────────────────

interface MonthlyDataItem {
  balance: number;
  monthYear: string;
  revenues?: number;
  expenses?: number;
}

interface UserMonthlyBalanceChartProps {
  isLoading: boolean;
  userData?: MonthlyDataItem[];
  userTotal: string;
}

type Period = "3m" | "ytd" | "12m" | "all";

type MonthMap = { [key: number]: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMonthLabel(raw: string, months: MonthMap): string {
  const trimmed = raw.trim();

  // Format: "MM YYYY"
  const mmYyyy = trimmed.split(" ");
  if (mmYyyy.length === 2) {
    const monthIndex = Math.max(0, Math.min(11, Number(mmYyyy[0]) - 1));
    if (!isNaN(monthIndex) && mmYyyy[1]) return `${months[monthIndex]} ${mmYyyy[1]}`;
  }

  // Fallback: "YYYY-MM" or "YYYY-MM-DD"
  const parts = trimmed.split("-");
  if (parts.length >= 2) {
    const monthIndex = Math.max(0, Math.min(11, Number(parts[1]) - 1));
    if (!isNaN(monthIndex) && parts[0]) return `${months[monthIndex]} ${parts[0]}`;
  }

  return trimmed;
}

function filterByPeriod(data: MonthlyDataItem[], period: Period): MonthlyDataItem[] {
  if (period == "all") return data;

  const months = period === "3m" ? 3 : period == "12m" ? 12 : new Date().getMonth() + 1;
  return data.slice(-months);
}

function buildChartOptions(categories: string[], userTotal: string | undefined): ApexOptions {
  return {
    colors: ["#12b76a", "#f04438", "#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 590,
      toolbar: { show: false },
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: "11px", cssClass: "text-gray-400 dark:text-gray-500" },
      },
    },
    yaxis: { show: false },
    grid: {
      yaxis: { lines: { show: true } },
      borderColor: "rgba(0,0,0,0.06)",
      strokeDashArray: 3,
    },
    fill: { opacity: [0.2, 0.2, 0.85] },
    legend: { show: false },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) => formatCurrency(val, userTotal, false),
      },
    },
  };
}

// ─── Summary row ──────────────────────────────────────────────────────────────

interface SummaryRowProps {
  data: MonthlyDataItem[];
  labels: { best: string; avg: string; worst: string };
  months: MonthMap;
  userTotal: string;
}

function SummaryRow({ data, labels, months, userTotal }: SummaryRowProps) {
  if (!data.length) return null;

  const best = data.reduce((a, b) => (Number(a.balance) > Number(b.balance) ? a : b));
  const worst = data.reduce((a, b) => (Number(a.balance) < Number(b.balance) ? a : b));
  const avg = data.reduce((sum, d) => sum + Number(d.balance), 0) / data.length;

  return (
    <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
      <div className="text-center">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">{labels.best}</p>
        <p className="text-sm font-medium text-success-600 dark:text-success-400 tabular-nums">
          {formatMonthLabel(best.monthYear, months)} ·{" "}
          {formatCurrency(Number(best.balance), userTotal)}
        </p>
      </div>
      <div className="text-center">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">{labels.avg}</p>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 tabular-nums">
          {formatCurrency(avg, userTotal)}
        </p>
      </div>
      <div className="text-center">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-0.5">{labels.worst}</p>
        <p
          className={cn(
            "text-sm font-medium tabular-nums",
            worst.balance < 0
              ? "text-error-600 dark:text-error-400"
              : "text-gray-600 dark:text-gray-400"
          )}
        >
          {formatMonthLabel(worst.monthYear, months)} ·{" "}
          {formatCurrency(Number(worst.balance), userTotal)}
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function UserMonthlyBalanceChart({
  isLoading,
  userData,
  userTotal,
}: UserMonthlyBalanceChartProps) {
  const t = useTranslations("HOME");
  const tMonths = useTranslations("MONTHS");
  const [period, setPeriod] = useState<Period>("ytd");

  const MONTHS: MonthMap = {
    0: tMonths("JAN"),
    1: tMonths("FEB"),
    2: tMonths("MAR"),
    3: tMonths("APR"),
    4: tMonths("MAY"),
    5: tMonths("JUN"),
    6: tMonths("JUL"),
    7: tMonths("AUG"),
    8: tMonths("SEP"),
    9: tMonths("OCT"),
    10: tMonths("NOV"),
    11: tMonths("DEC"),
  };

  const PERIODS: { value: Period; label: string }[] = [
    { value: "3m", label: "3M" },
    { value: "ytd", label: "YTD" },
    { value: "12m", label: "12M" },
    { value: "all", label: "ALL" },
  ];

  const filteredData = useMemo(
    () => (userData ? filterByPeriod(userData, period) : []),
    [userData, period]
  );

  const categories = useMemo(
    () => filteredData.map((item) => formatMonthLabel(String(item.monthYear ?? ""), MONTHS)),
    [filteredData, MONTHS]
  );

  const options = useMemo(() => buildChartOptions(categories, userTotal), [categories, userTotal]);

  const series = useMemo(
    () => [
      {
        name: t("REVENUE"),
        type: "bar" as const,
        data: filteredData.map((d) => d.revenues ?? 0),
      },
      {
        name: t("EXPENSE"),
        type: "bar" as const,
        data: filteredData.map((d) => d.expenses ?? 0),
      },
      {
        name: t("BALANCE"),
        type: "bar" as const,
        data: filteredData.map((d) => d.balance),
      },
    ],
    [filteredData, t]
  );

  // ── Loading state ──
  if (isLoading) return <MonthlyBalanceChartLoading />;

  // ── Empty state ──
  if (!userData?.length) {
    return (
      <Card className="col-span-12 xl:col-span-9 rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t("MONTHLY_BALANCE")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">{t("NO_DATA_AVAILABLE")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="col-span-12 xl:col-span-9">
      <div className="rounded-2xl border border-gray-200 bg-white px-5 pt-5 pb-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            {t("MONTHLY_BALANCE")}
          </h3>

          {/* Period filter */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
            {PERIODS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPeriod(value)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium transition-all",
                  period === value
                    ? "bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-4 mt-2">
          {[
            { color: "#12b76a", label: t("REVENUE") },
            { color: "#f04438", label: t("EXPENSE") },
            { color: "#465fff", label: t("BALANCE") },
          ].map(({ color, label }) => (
            <span
              key={label}
              className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400"
            >
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>

        {/* Chart */}
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-full">
            <ReactApexChart options={options} series={series} type="bar" height={355} />
          </div>
        </div>

        {/* Summary row */}
        <SummaryRow
          data={filteredData}
          userTotal={userTotal}
          months={MONTHS}
          labels={{
            best: t("BEST_MONTH"),
            avg: t("MONTHLY_AVG"),
            worst: t("WORST_MONTH"),
          }}
        />
      </div>
    </div>
  );
}
