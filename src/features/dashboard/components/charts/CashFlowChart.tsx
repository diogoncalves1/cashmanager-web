"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import ChartTab from "@/components/common/ChartTab";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useTranslations } from "next-intl";
import { CashFlowChartLoading } from "@/features/dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function CashFlowChart() {
  const options: ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        height: 310,
        fontFamily: "Outfit, sans-serif",
        toolbar: { show: false },
        responsive: [
          {
            breakpoint: 1200,
            options: {
              chart: { height: 310 },
            },
          },
          {
            breakpoint: 600,
            options: {
              chart: { height: 210 },
            },
          },
        ],
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "20%",
          borderRadius: 4,
        },
      },
      colors: ["#12b76a", "#f04438"], // cores das colunas
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["#12b76a", "#f04438"],
      },
      xaxis: {
        type: "category",
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: true },
      },
      yaxis: {
        show: false,
      },
      grid: {
        padding: {
          left: 10,
          right: 10,
        },
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
      },
      legend: { show: false },
      fill: {
        type: "solid",
      },
    }),
    []
  );
  const t = useTranslations("HOME");
  const monthsT = useTranslations("MONTHS");
  const chartKey = 0;
  const ytDate = new Date();
  ytDate.setUTCFullYear(ytDate.getUTCFullYear() - 1);
  ytDate.setUTCDate(1);
  ytDate.setUTCHours(0, 0, 0, 0);
  const ytDateString = ytDate.toISOString().split("T")[0];

  const { data, error, isLoading } = useSWR(
    [`/dashboard-overview?min_date=${ytDateString}`, { method: "GET" }],
    fetcher
  );

  type ChartSeries = {
    name: string;
    data: number[];
  };

  const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);
  const [chartOptions, setChartOptions] = useState<ApexOptions>(options);
  const [chartHeigth, setChartHeight] = useState<number>(310);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1200) setChartHeight(310);
      else if (window.innerWidth > 600) setChartHeight(310);
      else setChartHeight(210);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const rev = { name: t("REVENUE"), data: [] as number[] };
    const exp = { name: t("EXPENSE"), data: [] as number[] };
    const months: string[] = [];
    if (data) {
      const MONTHS: { [key: number]: string } = {
        0: monthsT("JAN"),
        1: monthsT("FEB"),
        2: monthsT("MAR"),
        3: monthsT("APR"),
        4: monthsT("MAY"),
        5: monthsT("JUN"),
        6: monthsT("JUL"),
        7: monthsT("AUG"),
        8: monthsT("SEP"),
        9: monthsT("OCT"),
        10: monthsT("NOV"),
        11: monthsT("DEC"),
      };

      data?.data.charts.monthly.forEach(
        (item: { month: string; revenues: string; expenses: string }) => {
          months.push(
            MONTHS[parseInt(String(item.month).split("-")[0]) - 1] +
              " " +
              String(item.month).split(" ")[1]
          );

          rev.data.push(parseFloat(item.revenues));
          exp.data.push(parseFloat(item.expenses));
        }
      );
    }

    const series = [rev, exp];

    setChartSeries(series);

    setChartOptions(() => {
      return {
        ...options,
        xaxis: {
          type: "category",
          categories: months,
          axisBorder: { show: false },
          axisTicks: { show: false },
        },
        tooltip: {
          enabled: true,
          shared: true,
          intersect: false,
          y: {
            formatter: (value: number) =>
              new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: data.data.dashboard.currency.code,
              }).format(value),
          },
        },
      };
    });
  }, [data, monthsT, options, t]);

  if (isLoading) return <CashFlowChartLoading heigth={chartHeigth} />;

  if (error) return <CashFlowChartLoading heigth={chartHeigth} />;

  if (!data?.data.charts.annualy.length)
    return (
      <Card className="col-span-12 xl:col-span-9 rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold"> {t("CASH_FLOW_CHART_TITLE")}</CardTitle>
          <CardDescription>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {t("CASH_FLOW_CHART_DESCRIPTION")}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">{t("NO_DATA_AVAILABLE")}</p>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("CASH_FLOW_CHART_TITLE")}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            {t("CASH_FLOW_CHART_DESCRIPTION")}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab
            height={chartHeigth}
            data={data}
            onChangeSeries={setChartSeries}
            onChangeOptions={setChartOptions}
            currency={data.data.dashboard.currency}
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="max-w-full xl:max-w-full px-5">
          <ReactApexChart
            key={chartKey}
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={chartHeigth}
          />
        </div>
      </div>
    </div>
  );
}
