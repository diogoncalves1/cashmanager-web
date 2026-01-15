"use client";

import { FinancialGoal } from "@/lib/models/financialGoal";
import { ApexOptions } from "apexcharts";
import { useTranslations } from "next-intl";
import ReactApexChart from "react-apexcharts";

export type MonthlyValues = {
  monthYear: string;
  balance: number;
};
type MonthlySummaryChartProps = {
  data?: MonthlyValues[];
  financialGoal?: FinancialGoal;
};

export default function MonthlySummaryChart({ data, financialGoal }: MonthlySummaryChartProps) {
  if (!data) {
    return <></>;
  }
  const tMonths = useTranslations("MONTHS");
  const t = useTranslations("FINANCIAL_GOALS");

  const MONTHS = [
    tMonths("JAN"),
    tMonths("FEB"),
    tMonths("MAR"),
    tMonths("APR"),
    tMonths("MAY"),
    tMonths("JUN"),
    tMonths("JUL"),
    tMonths("AUG"),
    tMonths("SEP"),
    tMonths("OCT"),
    tMonths("NOV"),
    tMonths("DEC"),
  ];

  const options: ApexOptions = {
    colors: ["#12b76a"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 518,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: financialGoal?.currencyCode,
        }).format(val),
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.map((item) => {
        return (
          MONTHS[parseInt(String(item.monthYear).split("-")[0]) - 1] +
          " " +
          String(item.monthYear).split(" ")[1]
        );
      }),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    yaxis: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },

    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val: number) =>
          new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: financialGoal?.currencyCode,
          }).format(val),
      },
    },
  };

  const series = [
    {
      name: t("COLLECTED_AMOUNT"),
      data: data.map((item) => item.balance),
    },
  ];

  return (
    <div className="col-span-12 xl:col-span-9">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("MONTHLY_SUMMARY")}
          </h3>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-full xl:min-w-full pl-2">
            <ReactApexChart options={options} series={series} type="bar" height={518} />
          </div>
        </div>
      </div>
    </div>
  );
}
