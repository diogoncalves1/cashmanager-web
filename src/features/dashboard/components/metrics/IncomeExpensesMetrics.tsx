"use client";

import React from "react";
import { TrendingUp, ShoppingCart, Wallet } from "lucide-react";
import LineChartOne from "@/components/charts/line/LineChartOne";
import { ApexOptions } from "apexcharts";
import { KpiInterface } from "./DashboardMetrics";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/utils";

interface IncomeExpensesMetricsProps {
  revenues: { name: string; data: number[] };
  expenses: { name: string; data: number[] };
  kpis: KpiInterface;
}

// ─── Chart options ────────────────────────────────────────────────────────────

const BASE_CHART_OPTIONS: ApexOptions = {
  chart: {
    type: "area",
    height: 50,
    sparkline: { enabled: true },
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { enabled: false },
  },
  legend: { show: false },
  tooltip: { enabled: false },
  stroke: { curve: "smooth", width: 1.5 },
  markers: { size: 0, hover: { size: 0 } },
  grid: { show: false },
  dataLabels: { enabled: false },
  xaxis: {
    labels: { show: false },
    axisTicks: { show: false },
    axisBorder: { show: false },
  },
  yaxis: { show: false },
  fill: {
    type: "gradient",
    gradient: { opacityFrom: 0.4, opacityTo: 0 },
  },
};

const CHART_OPTIONS_REVENUES: ApexOptions = {
  ...BASE_CHART_OPTIONS,
  colors: ["#12b76a"],
};

const CHART_OPTIONS_EXPENSES: ApexOptions = {
  ...BASE_CHART_OPTIONS,
  colors: ["#f04438"],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isPositive(percentageStr: string): boolean {
  return Number(percentageStr.replace(",", "")) > 0;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface TrendBadgeProps {
  percentage: string;
  /** true = higher is good (revenues); false = higher is bad (expenses) */
  invertSemantic?: boolean;
}

function TrendBadge({ percentage, invertSemantic = false }: TrendBadgeProps) {
  const positive = isPositive(percentage);
  const isGood = invertSemantic ? !positive : positive;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-medium",
        isGood
          ? "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400"
          : "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400"
      )}
    >
      <svg
        className={cn("h-2.5 w-2.5", !positive && "rotate-180")}
        viewBox="0 0 10 10"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5 2 L9 8 L1 8 Z" />
      </svg>
      {percentage}%
    </span>
  );
}

interface KpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  chartOptions: ApexOptions;
  series: { name: string; data: number[] };
  label: string;
  value: string;
  percentage: string;
  invertSemantic?: boolean;
}

function KpiCard({
  icon,
  iconBg,
  chartOptions,
  series,
  label,
  value,
  percentage,
  invertSemantic,
}: KpiCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header row */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn("flex items-center justify-center w-9 h-9 rounded-xl", iconBg)}>
          {icon}
        </div>
        <TrendBadge percentage={percentage} invertSemantic={invertSemantic} />
      </div>

      {/* Values */}
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-semibold text-gray-800 dark:text-white/90 tabular-nums">{value}</p>

      {/* Sparkline */}
      <div className="h-10 mx-1 mb-1">
        <LineChartOne options={chartOptions} series={[series]} />
      </div>
    </div>
  );
}

interface NetBalanceCardProps {
  totalRevenues: number;
  totalExpenses: number;
  netLabel: string;
  ratioLabel: string;
  userTotal: string;
}

function NetBalanceCard({
  totalRevenues,
  totalExpenses,
  netLabel,
  ratioLabel,
  userTotal,
}: NetBalanceCardProps) {
  const net = totalRevenues - totalExpenses;
  const ratio =
    totalRevenues > 0 ? Math.min(100, Math.round((totalExpenses / totalRevenues) * 100)) : 0;
  const isNetPositive = net >= 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-white/[0.02]">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10">
          <Wallet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{netLabel}</p>
      </div>

      <p
        className={cn(
          "text-xl font-semibold tabular-nums mb-3",
          isNetPositive
            ? "text-success-600 dark:text-success-400"
            : "text-error-600 dark:text-error-400"
        )}
      >
        {!isNetPositive && "−"}
        {userTotal}
      </p>

      {/* Despesa / Receita progress bar */}
      <div>
        <div className="flex justify-between text-[11px] text-gray-400 dark:text-gray-500 mb-1.5">
          <span>{ratioLabel}</span>
          <span className="font-medium text-gray-500 dark:text-gray-400">{ratio}%</span>
        </div>
        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              ratio < 70 ? "bg-success-500" : ratio < 90 ? "bg-warning-500" : "bg-error-500"
            )}
            style={{ width: `${ratio}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const IncomeExpensesMetrics = ({ revenues, expenses, kpis }: IncomeExpensesMetricsProps) => {
  const t = useTranslations("HOME");

  return (
    <div className="col-span-12 xl:col-span-3 flex flex-col gap-4">
      <KpiCard
        icon={<TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
        iconBg="bg-emerald-50 dark:bg-emerald-500/10"
        chartOptions={CHART_OPTIONS_REVENUES}
        series={revenues}
        label={t("REVENUE")}
        value={kpis.totalRevenuesFormated}
        percentage={kpis.revenuePercentage}
        invertSemantic={false}
      />

      <KpiCard
        icon={<ShoppingCart className="w-4 h-4 text-red-500 dark:text-red-400" />}
        iconBg="bg-red-50 dark:bg-red-500/10"
        chartOptions={CHART_OPTIONS_EXPENSES}
        series={expenses}
        label={t("EXPENSE")}
        value={kpis.totalExpensesFormated}
        percentage={kpis.expensesPercentage}
        invertSemantic={true}
      />

      <NetBalanceCard
        totalRevenues={kpis.totalRevenues}
        totalExpenses={kpis.totalExpenses}
        userTotal={kpis.totalUser}
        netLabel={t("NET_BALANCE")}
        ratioLabel={t("EXPENSE_RATIO")}
      />
    </div>
  );
};
