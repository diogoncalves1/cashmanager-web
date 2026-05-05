"use client";

import { SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ArrowLeftRight, Wallet } from "lucide-react";
import AppSwiper from "./AppSwiper";
import SwiperLoading from "./SwiperLoading";
import { Currency } from "@/types/currency";
import { useRouter } from "next/navigation";

interface Portfolio {
  id: number;
  profit: number;
  profitFormated?: string;
  profitPercentage?: number;
  name: string;
  totalInvested?: number;
  totalInvestedFormated?: string;
  amountNow?: number;
  amountNowFormated?: string;
  currency?: Currency;
  totalAssets: number;
}

export default function PortfolioSwiper() {
  const { data, error, isLoading } = useSWR(["/portfolios", { method: "GET" }], fetcher);
  const route = useRouter();

  if (isLoading)
    return (
      <div className="overflow-hidden h-[445px]">
        <SwiperLoading direction="vertical" />
      </div>
    );
  if (error) return <SwiperLoading direction="vertical" />;

  const portfolios: Portfolio[] = data; //.data;

  return (
    <AppSwiper direction="vertical">
      {portfolios.map(function (portfolio, idx) {
        return (
          <SwiperSlide
            key={idx}
            className="bg-white min-h-[160px] dark:border-gray-800 dark:bg-white/[0.03] w-full cursor-pointer rounded-xl border-1 text-error p-4"
            onClick={() => {
              route.push(`/portfolios/${portfolio.id}`);
            }}
          >
            <div className="w-full flex flex-col gap-2">
              <div className="h-auto w-full flex gap-2">
                <Wallet />
                <span className="text-lg">{portfolio.name}</span>
              </div>
              <div className="h-auto w-full text-end">
                <span className="text-title-md xl:text-title-sm">
                  {portfolio.amountNowFormated}
                </span>
              </div>
              <div className="h-auto w-full">
                <div className="flex justify-between">
                  <span className="text-sm xl:text-xs">Investimento</span>
                  <span className="text-sm xl:text-xs">Retorno</span>
                </div>
                <div className="flex justify-between">
                  <span
                    className={`text-md xl:text-sm font-light ${
                      portfolio.profit >= 0 ? "text-emerald-600" : "text-error-500"
                    }`}
                  >
                    {portfolio.totalInvestedFormated}
                  </span>
                  <ArrowLeftRight className="size-4 xl:size-3" />
                  <span
                    className={`text-md xl:text-sm font-light ${
                      portfolio.profit >= 0 ? "text-emerald-600" : "text-error-500"
                    }`}
                  >
                    {portfolio.profitFormated}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm xl:text-xs">{portfolio.totalAssets} Ativos</span>
                  <span
                    className={`text-sm xl:text-xs font-light ${
                      portfolio.profit >= 0 ? "text-emerald-600" : "text-error-500"
                    }`}
                  >
                    ({portfolio.profitPercentage}%)
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </AppSwiper>
  );
}
