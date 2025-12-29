"use client";
import React from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";
import LineChartOne from "../charts/line/LineChartOne";
import { ApexOptions } from "apexcharts";
import { DollarSign, ShoppingCart } from "lucide-react";
import { KpiInterface } from "./DashboardMetrics";

interface EcommerceMetricsProps {
  revenues: { name: string; data: number[] };
  expenses: { name: string; data: number[] };
  kpis: KpiInterface;
}

export const EcommerceMetrics = ({ revenues, expenses, kpis }: EcommerceMetricsProps) => {
  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 300,
      toolbar: {
        show: false, // sem toolbar
      },
      zoom: {
        enabled: false, // desativa zoom
      },
      animations: {
        enabled: false, // desativa animações (opcional)
      },
    },
    legend: {
      show: false, // remove legenda
    },
    colors: ["#465FFF"],
    tooltip: {
      enabled: false, // desativa tooltip no hover
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 0, // sem pontos
      hover: {
        size: 0, // sem hover nos pontos
      },
    },
    grid: {
      show: false, // remove linhas de grade
    },
    dataLabels: {
      enabled: false, // sem labels nos pontos
    },
    xaxis: {
      labels: {
        show: false, // remove labels do eixo X
      },
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      show: false, // remove eixo Y completamente
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
  };

  const optionsRevenues = {
    ...options,
    colors: ["#12b76a"],
  };
  const optionsExpenses = {
    ...options,
    colors: ["#f04438"],
  };

  return (
    <div className="col-span-12 md:col-span-3 ">
      <div className="grid grid-cols-3 gap-4 md:gap-6">
        <div className="rounded-2xl col-span-3 md:col-span-6 border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="grid grid-cols-12">
            <div className="flex col-span-3 items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <DollarSign className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="md:flex flex col-span-9 h-10  items-center justify-center rounded-xl ">
              <LineChartOne options={optionsRevenues} series={[revenues]} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Revenues</span>
              <h4 className="mt-2 font-bold text-gray-800 md:text-2xl text-md dark:text-white/90">
                {kpis.totalRevenues.value} {kpis.totalRevenues.unit} {kpis.currency}
              </h4>
            </div>
            <Badge color={kpis.revenuesClasses}>
              {kpis.revenuePercentage > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {kpis.revenuePercentage}%
            </Badge>
          </div>
        </div>

        <div className="rounded-2xl col-span-3 md:col-span-6  border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <div className="grid grid-cols-12">
            <div className="flex col-span-3 items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
              <ShoppingCart className="text-gray-800 size-6 dark:text-white/90" />
            </div>
            <div className="md:flex flex col-span-9 h-10  items-center justify-center rounded-xl ">
              <LineChartOne options={optionsExpenses} series={[expenses]} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Expenses</span>
              <h4 className="mt-2 font-bold text-gray-800 md:text-2xl text-md dark:text-white/90">
                {kpis.totalExpenses.value} {kpis.totalExpenses.unit} {kpis.currency}
              </h4>
            </div>
            <Badge color={kpis.expensesClasses}>
              {kpis.revenuePercentage > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {kpis.expensesPercentage}%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
