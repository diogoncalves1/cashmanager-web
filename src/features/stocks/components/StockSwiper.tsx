"use client";

import { SwiperSlide } from "swiper/react";
import "swiper";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import LineChartOne from "@/components/charts/line/LineChartOne";
import { ApexOptions } from "apexcharts";
import AppSwiper from "@/components/swiper/AppSwiper";
import SwiperLoading from "@/components/swiper/SwiperLoading";

interface Stock {
  change: number;
  changeFormated: string;
  chartData: { value: number }[];
  meta: {
    shortName: string;
    regularMarketPrice: number;
    symbol: string;
    currencySymbol: string;
    currency: string;
  };
}

export function StockSwiper() {
  const { data, error, isLoading } = useSWR(["/assets", { method: "GET" }], fetcher);

  if (isLoading) return <SwiperLoading />;
  if (error) return <SwiperLoading />;

  const stocks: Stock[] = data; //.stocks;

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
    colors: ["#465FFF", "#9CB9FF"],
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

  return (
    <div className="overflow-hidden">
      <AppSwiper>
        {stocks.map(function (stock, idx) {
          const color = stock.change >= 0 ? "#12b76a" : "#f04438";

          const stockOptions: ApexOptions = {
            ...options,
            colors: [color],
            fill: {
              ...options.fill,
              gradient: {
                ...(options.fill?.gradient || {}),
                colorStops: [
                  {
                    offset: 0,
                    color: color,
                    opacity: 0.4,
                  },
                  {
                    offset: 100,
                    color: color,
                    opacity: 0,
                  },
                ],
              },
            },
          };

          return (
            <SwiperSlide
              key={idx}
              className="bg-white dark:border-gray-800 dark:bg-white/[0.03] rounded-xl border-1 text-error p-4"
            >
              <div className=" grid grid-cols-12">
                <div className="col-span-6">
                  <div className="flex gap-2 items-center">
                    <span className="text-sm">{stock.meta.symbol}</span>
                    <Badge color={stock.change >= 0 ? "success" : "error"}>
                      {stock.changeFormated}%
                      {stock.change >= 0 ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
                    </Badge>
                  </div>

                  <div className=" text-xl">
                    {stock.meta.currency == "USD" ? stock.meta.currencySymbol : ""}
                    {stock.meta.regularMarketPrice}
                    {stock.meta.currency != "USD" ? stock.meta.currencySymbol : ""}
                  </div>
                </div>
                <div className="h-15 w-full col-span-6">
                  <LineChartOne
                    options={stockOptions}
                    series={[
                      {
                        name: "Data",
                        data: stock.chartData
                          .filter((data) => data.value !== null)
                          .map((data) => data.value),
                      },
                    ]}
                  />
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </AppSwiper>
    </div>
  );
}
