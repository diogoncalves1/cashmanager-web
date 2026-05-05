import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Account } from "@/types/account";
import { iconMap } from "@/types/category";

export type CategorySummary = {
  data: CategoryExpenses[];
  total: number;
  totalFormated: string;
};

export type CategoryExpenses = {
  category: string;
  icon: keyof typeof iconMap;
  value: number;
  valueFormated: string;
  valueFormatedWithoutSymbol: string;
  color: string;
};
type CategoryExpensesChartProps = {
  data: CategorySummary;
  account: Account;
};

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function CategoryExpensesChart({ data, account }: CategoryExpensesChartProps) {
  const COLORS = data.data.map((i) => i.color);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 1000,
      fontFamily: "Outfit, sans-serif",

      toolbar: {
        show: true,
        offsetX: -20,
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
    labels: data.data.map((i) => i.category),
    legend: { show: false },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: "#374151",
              formatter: (val) =>
                `${Number(val).toLocaleString("pt-PT")} ${account.currencySymbol}`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              color: "#6b7280",
              formatter: () => `${data.totalFormated}`,
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
    },
    dataLabels: { enabled: false },
    responsive: [
      { breakpoint: 1024, options: { chart: { height: 300 } } },
      { breakpoint: 768, options: { chart: { height: 240 } } },
      { breakpoint: 480, options: { chart: { height: 222 } } },
    ],
  };

  const series = data.data.map((i) => i.value);

  return <ReactApexChart options={options} series={series} type="donut" width={500} height={500} />;
}
