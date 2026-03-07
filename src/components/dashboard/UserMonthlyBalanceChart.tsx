"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import MonthlyBalanceChartLoading from "./MonthlyBalanceChartLoading";
import { useTranslations } from "next-intl";
import { Currency } from "@/models/currency";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface UserMonthlyBalanceChartProps {
  userData?: {
    balance: number;
    monthYear: string;
  }[];
  currency?: Currency;
}

export default function UserMonthlyBalanceChart({
  userData,
  currency,
}: UserMonthlyBalanceChartProps) {
  const t = useTranslations("HOME");
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

  if (!userData?.length) return <MonthlyBalanceChartLoading />;

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 180,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "39%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      categories: userData.map((item) => {
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
          new Intl.NumberFormat("pt-BR", { style: "currency", currency: currency?.code }).format(
            val
          ),
      },
    },
  };

  const series = [
    {
      name: t("BALANCE"),
      data: userData.map((item) => item.balance),
    },
  ];

  return (
    <div className="col-span-12 xl:col-span-9">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {t("MONTHLY_BALANCE")}
          </h3>
        </div>

        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-full xl:min-w-full pl-2">
            <ReactApexChart options={options} series={series} type="bar" height={318} />
          </div>
        </div>
      </div>
    </div>
  );
}
