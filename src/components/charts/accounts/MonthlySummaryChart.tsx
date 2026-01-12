import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Account } from "@/lib/models/account";

export type MonthlySummary = {
  month: string;
  totalRevenue: number;
  totalRevenueFormated: string; // com € e separadores (ex: "1 200,50 €")
  totalRevenueFormatedWithoutSymbol: string; // só valor formatado (ex: "1 200,50")
  totalExpense: number;
  totalExpenseFormated: string;
  totalExpenseFormatedWithoutSymbol: string;
  profit: string; // já formatado com sinal + ou -
  total: string; // total receitas + despesas formatado
};

type MonthlySummaryProps = {
  data: MonthlySummary;
  account: Account;
};

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function MonthlySummaryChart({ data, account }: MonthlySummaryProps) {
  const COLORS = ["#22c55e", "#ef4444"];

  const revenue = data.totalRevenue || 0;
  const expense = data.totalExpense || 0;

  const series = [revenue, expense];

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 280,
      fontFamily: "Outfit, sans-serif",
      toolbar: {
        show: true,
        offsetX: -30,
        offsetY: 0,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    colors: COLORS,
    labels: ["Receita", "Despesa"],
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: "#374151",
              formatter: (val) =>
                `${Number(val).toLocaleString("pt-PT", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ${account.currencySymbol}`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              color: "#6b7280",
              formatter: () => data.total,
            },
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: "light",
      fillSeriesColor: false,
      style: {
        fontSize: "14px",
        fontFamily: "Outfit, sans-serif",
      },
      y: {
        formatter: (val: number) =>
          `${val.toLocaleString("pt-PT", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })} ${account.currencySymbol}`,
      },
    },
    dataLabels: { enabled: false },
    responsive: [
      { breakpoint: 1024, options: { chart: { height: 260 } } },
      { breakpoint: 768, options: { chart: { height: 240 } } },
      { breakpoint: 480, options: { chart: { height: 220 } } },
    ],
  };

  return <ReactApexChart options={options} series={series} type="donut" height={280} width={280} />;
}
