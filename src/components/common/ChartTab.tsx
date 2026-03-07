import { Currency } from "@/models/currency";
import { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";

type MonthlyData = {
  month: Date;
  revenues: string;
  expenses: string;
};

type QuarterlyData = {
  quarter: string;
  revenues: number;
  expenses: number;
};

type AnnualyData = {
  year: string;
  revenues: string;
  expenses: string;
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
  onChangeSeries: (series: ChartSeries[]) => void;
  onChangeOptions: (prev: ApexOptions) => void;
  currency?: Currency;
  height?: number;
}

const options: ApexOptions = {
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
    tooltip: {
      enabled: true,
    },
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
};

function ChartTab({ data, onChangeSeries, onChangeOptions, height = 0, currency }: ChartTabProps) {
  const [chartHeight, setChartHeight] = useState(height);

  const tMonths = useTranslations("MONTHS");
  const MONTHS: { [key: number]: string } = {
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

  const t = useTranslations("HOME");
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
          const rev = { name: t("REVENUE"), data: [] as number[] };
          const exp = { name: t("EXPENSE"), data: [] as number[] };

          const months: string[] = [];

          data?.data.charts.monthly.forEach((item) => {
            months.push(
              MONTHS[parseInt(String(item.month).split("-")[0]) - 1] +
                " " +
                String(item.month).split(" ")[1]
            );

            rev.data.push(parseFloat(item.revenues));
            exp.data.push(parseFloat(item.expenses));
          });

          const series = [rev, exp];

          setSelected("monthly");
          onChangeSeries(series);

          onChangeOptions({
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
                    currency: currency?.code,
                  }).format(value),
              },
            },
          });
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "monthly"
        )}`}
      >
        {t("MONTHLY")}
      </button>
      <button
        onClick={function () {
          const rev = { name: t("REVENUE"), data: [] as number[] };
          const exp = { name: t("EXPENSE"), data: [] as number[] };

          const quartsers: string[] = [];

          data?.data.charts.quarterly?.forEach((item: QuarterlyData) => {
            console.log(item);
            quartsers.push(item.quarter);

            rev.data.push(item.revenues);
            exp.data.push(item.expenses);

            console.log(rev, exp);
          });

          setSelected("quarterly");
          onChangeSeries([rev, exp]);

          onChangeOptions({
            ...options,
            plotOptions: {
              bar: {
                horizontal: false, // vertical (colunas)
                columnWidth: chartHeight < 380 ? "40%" : "20%", // largura das colunas
                borderRadius: 4, // cantos arredondados
              },
            },
            xaxis: {
              type: "category",
              categories: quartsers,
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
                    currency: currency?.code,
                  }).format(value),
              },
            },
          });
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900   dark:hover:text-white ${getButtonClass(
          "quarterly"
        )}`}
      >
        {t("QUARTERLY")}
      </button>
      <button
        onClick={function () {
          const rev = { name: t("REVENUE"), data: Array(1).fill(0) };
          const exp = { name: t("EXPENSE"), data: Array(1).fill(0) };

          const years: string[] = [];

          data?.data.charts.annualy?.forEach((item: AnnualyData, index: number) => {
            years.push(item.year);
            rev.data[index] = item.revenues;
            exp.data[index] = item.expenses;
          });

          setSelected("annualy");
          onChangeSeries([rev, exp]);

          onChangeOptions({
            ...options,
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
            },
            tooltip: {
              enabled: true,
              shared: true,
              intersect: false,
              y: {
                formatter: (value: number) =>
                  new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: currency?.code ?? "USD",
                  }).format(value),
              },
            },
          });
        }}
        className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
          "annualy"
        )}`}
      >
        {t("ANNUALLY")}
      </button>
    </div>
  );
}

export default ChartTab;
