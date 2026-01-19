import type { Metadata } from "next";
import React from "react";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import StockTicker from "@/components/swiper/StockSwiper";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import PortfolioSwiper from "@/components/swiper/PortfolioSwiper";

export const metadata: Metadata = {
  title: "Cash Manager | Dashboard",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <>
      <PageBreadcrumb pageTitle="DASHBOARD" />
      <div className="p-6 grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6">
          <StockTicker />
        </div>

        <div className="col-span-12 md:col-span-3 space-y-6">
          <div className="overflow-hidden h-[250px] xl:h-[445px]">
            <PortfolioSwiper />
          </div>
        </div>

        <div className="col-span-12 md:col-span-9">
          <StatisticsChart />
        </div>

        <div className="col-span-12 space-y-6 xl:col-span-12">
          <DashboardMetrics />
        </div>

        {/* <div className="col-span-12 xl:col-span-0">
          <MonthlyTarget />
        </div> */}
      </div>
    </>
  );
}
