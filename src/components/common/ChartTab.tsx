import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";

type MonthlyData = {
  month: Date;
  revenues: number;
  expenses: number;
};

type QuarterlyData = {
  quarter: number;
  revenues: number;
  expenses: number;
};

type AnnualyData = {
  year: string;
  revenues: number;
  expenses: number;
};

type ChartDataType = {
  data: {
    charts: {
      monthly: MonthlyData[];
      quarterly?: QuarterlyData[];
      annualy?: AnnualyData[];
    };
  };
};

type ChartSeries = {
  name: string;
  data: number[];
};

interface ChartTabProps {
  data?: ChartDataType;
  onChangeSeries?: (series: ChartSeries[]) => void;
  onChangeOptions?: (prev: ApexOptions) => void;
  onChangeType?: (type: "bar" | "area") => void;
  height?: number;
}

const columnChartOptions: ApexOptions = {
  chart: {
    type: "bar", // gráfico de colunas
    height: 310,
    fontFamily: "Outfit, sans-serif",
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false, // vertical (colunas)
      columnWidth: "20%", // largura das colunas
      borderRadius: 4, // cantos arredondados
    },
  },
  colors: ["#12b76a", "#f04438"], // cores das colunas
  dataLabels: {
    enabled: false, // desabilita valores acima das colunas
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["#12b76a", "#f04438"], // sem borda visível
  },
  xaxis: {
    type: "category",
    categories: [],
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
  },
  yaxis: {
    show: false,
  },
  grid: {
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
};

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

function ChartTab({
  data,
  onChangeSeries,
  onChangeOptions,
  onChangeType,
  height = 0,
}: ChartTabProps) {
  const [chartHeight, setChartHeight] = useState(height);
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 1200) setChartHeight(310);
      else if (window.innerWidth > 600) setChartHeight(310);
      else setChartHeight(190);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [selected, setSelected] = useState<"annualy" | "quarterly" | "monthly">("monthly");

  const getButtonClass = (option: "annualy" | "quarterly" | "monthly") =>
    selected === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      <button
        onClick={function () {
          const currentMonth = new Date().getUTCMonth();

          const rev = { name: "Revenues", data: Array(currentMonth + 1).fill(0) };
          const exp = { name: "Expenses", data: Array(currentMonth + 1).fill(0) };

          data?.data.charts.monthly.forEach((item: any) => {
            const monthIndex = parseInt(item.month.replace("2025-", "")) - 1;

            rev.data[monthIndex] = parseFloat(item.revenues);
            exp.data[monthIndex] = parseFloat(item.expenses);
          });
          const series = [rev, exp];

          setSelected("monthly");
          onChangeSeries([rev, exp]);
          onChangeType("area");

          onChangeOptions(() => {
            return {
              ...options,
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
            };
          });
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "monthly"
        )}`}
      >
        Monthly
      </button>
      <button
        onClick={function () {
          const currentMonth = new Date().getUTCMonth();
          const currentQuarter = Math.floor(currentMonth / 3) + 1;

          const rev = { name: "Revenues", data: Array(currentQuarter).fill(0) };
          const exp = { name: "Expenses", data: Array(currentQuarter).fill(0) };

          console.log(data?.data.charts);

          data?.data.charts.quarterly?.forEach((item: QuarterlyData) => {
            console.log(item);
            const quarterIndex = item.quarter - 1;

            rev.data[quarterIndex] = item.revenues;
            exp.data[quarterIndex] = item.expenses;
          });

          setSelected("quarterly");
          onChangeSeries([rev, exp]);
          onChangeType("bar");

          onChangeOptions(() => {
            return {
              ...columnChartOptions,
              plotOptions: {
                bar: {
                  horizontal: false, // vertical (colunas)
                  columnWidth: chartHeight < 380 ? "40%" : "20%", // largura das colunas
                  borderRadius: 4, // cantos arredondados
                },
              },
              xaxis: {
                type: "category",
                categories: ["Q1", "Q2", "Q3", "Q4"],
                axisBorder: { show: false },
                axisTicks: { show: false },
                tooltip: { enabled: false },
              },
            };
          });
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "quarterly"
        )}`}
      >
        Quarterly
      </button>
      <button
        onClick={function () {
          const rev = { name: "Revenues", data: Array(1).fill(0) };
          const exp = { name: "Expenses", data: Array(1).fill(0) };

          console.log(data?.data.charts);
          const years: string[] = [];

          data?.data.charts.annualy?.forEach((item: AnnualyData, index: number) => {
            years.push(item.year);
            rev.data[index] = item.revenues;
            exp.data[index] = item.expenses;
          });

          setSelected("annualy");
          onChangeType("bar");
          onChangeSeries([rev, exp]);

          onChangeOptions(() => {
            return {
              ...columnChartOptions,
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: chartHeight < 380 ? "15%" : "5%",
                  borderRadius: 4,
                },
              },
              xaxis: {
                type: "category",
                categories: years,
                axisBorder: { show: false },
                axisTicks: { show: false },
                tooltip: { enabled: false },
              },
            };
          });
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "annualy"
        )}`}
      >
        Annually
      </button>
    </div>
  );
}

export default ChartTab;
