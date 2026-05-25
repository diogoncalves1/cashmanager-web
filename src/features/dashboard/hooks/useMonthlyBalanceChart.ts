"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { ApexOptions } from "apexcharts";
import { formatCurrency } from "@/shared/utils";
import { MonthlyDataItem, MonthMap, Period } from "@/features/dashboard/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatMonthLabel(raw: string, months: MonthMap): string {
  const trimmed = raw.trim();

  const mmYyyy = trimmed.split(" ");
  if (mmYyyy.length === 2) {
    const monthIndex = Math.max(0, Math.min(11, Number(mmYyyy[0]) - 1));
    if (!isNaN(monthIndex) && mmYyyy[1]) return `${months[monthIndex]} ${mmYyyy[1]}`;
  }

  const parts = trimmed.split("-");
  if (parts.length >= 2) {
    const monthIndex = Math.max(0, Math.min(11, Number(parts[1]) - 1));
    if (!isNaN(monthIndex) && parts[0]) return `${months[monthIndex]} ${parts[0]}`;
  }

  return trimmed;
}

export function filterByPeriod(data: MonthlyDataItem[], period: Period): MonthlyDataItem[] {
  if (period === "all") return data;
  const months = period === "3m" ? 3 : period === "12m" ? 12 : new Date().getMonth() + 1;
  return data.slice(-months);
}

export function buildChartOptions(
  categories: string[],
  userTotal: string | undefined
): ApexOptions {
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseMonthlyBalanceChartProps {
  userData?: MonthlyDataItem[];
  userTotal: string;
}

export function useMonthlyBalanceChart({ userData, userTotal }: UseMonthlyBalanceChartProps) {
  const t = useTranslations("HOME");
  const tMonths = useTranslations("MONTHS");

  const [period, setPeriod] = useState<Period>("ytd");
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const observerRef = useRef<ResizeObserver | null>(null);

  const chartContainerRef = useCallback((el: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (!width) return;
      const count = Math.max(2, Math.floor(width / 60));
      setVisibleCount(count);
    });

    observer.observe(el);
    observerRef.current = observer;
  }, []);

  const MONTHS: MonthMap = useMemo(
    () => ({
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
    }),
    [tMonths]
  );

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

  const visibleData = useMemo(() => {
    const total = filteredData.length;
    if (total <= visibleCount) return filteredData;

    const result: MonthlyDataItem[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = Math.round((i / (visibleCount - 1)) * (total - 1));
      result.push(filteredData[index]);
    }
    return result;
  }, [filteredData, visibleCount]);

  const categories = useMemo(
    () => visibleData.map((item) => formatMonthLabel(String(item.monthYear ?? ""), MONTHS)),
    [visibleData, MONTHS]
  );

  const options = useMemo(
    () => buildChartOptions(categories, userTotal),
    [categories, userTotal]
  );

  const series = useMemo(
    () => [
      {
        name: t("REVENUE"),
        type: "bar" as const,
        data: visibleData.map((d) => d.revenues ?? 0),
      },
      {
        name: t("EXPENSE"),
        type: "bar" as const,
        data: visibleData.map((d) => d.expenses ?? 0),
      },
      {
        name: t("BALANCE"),
        type: "bar" as const,
        data: visibleData.map((d) => d.balance),
      },
    ],
    [visibleData, t]
  );

  return {
    t,
    period,
    setPeriod,
    MONTHS,
    PERIODS,
    filteredData,
    options,
    series,
    chartContainerRef,
  };
}
