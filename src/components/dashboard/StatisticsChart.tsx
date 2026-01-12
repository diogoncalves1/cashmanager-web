"use client";
import React, { useEffect, useState } from "react";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import StatisticsChartLoading from "./StatisticsChartLoading";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StatisticsChart() {
  const options: ApexOptions = {
    legend: { show: false, position: "top", horizontalAlign: "left" },
    colors: ["#12b76a", "#f04438"],
    chart: { fontFamily: "Outfit, sans-serif", height: 310, type: "bar", toolbar: { show: false } },
    stroke: { curve: "smooth", width: [2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: { size: 0, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
    grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } } },
    dataLabels: { enabled: false },
    tooltip: { enabled: true, x: { format: "dd MMM yyyy" } },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      show: false,
    },
  };

  const chartKey = 0;
  const [typeKey, setTypeKey] = useState<"bar" | "area">("area");

  const { data, error, isLoading } = useSWR(
    ["/dashboard-overview?min_date=2025-01-01", { method: "GET" }],
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
    if (!data) return;

    const currentMonth = new Date().getUTCMonth();

    const rev = { name: "Revenues", data: Array(currentMonth + 1).fill(0) ?? [0] };
    const exp = { name: "Expenses", data: Array(currentMonth + 1).fill(0) ?? [0] };

    data.data.charts.monthly.forEach((item: any) => {
      const monthIndex = parseInt(item.month.replace("2025-", "")) - 1;

      rev.data[monthIndex] = parseFloat(item.revenues);
      exp.data[monthIndex] = parseFloat(item.expenses);
    });

    setChartSeries([rev, exp]);
  }, [data]);

  if (isLoading) return <StatisticsChartLoading heigth={chartHeigth} />;
  if (error) return <StatisticsChartLoading heigth={chartHeigth} />;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Statistics</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Target you’ve set for each month
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab
            height={chartHeigth}
            data={data}
            onChangeSeries={setChartSeries}
            onChangeOptions={setChartOptions}
            onChangeType={setTypeKey}
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-full xl:min-w-full">
          <ReactApexChart
            key={chartKey}
            options={chartOptions}
            series={chartSeries}
            type={typeKey}
            height={chartHeigth}
          />
        </div>
      </div>
    </div>
  );
}
