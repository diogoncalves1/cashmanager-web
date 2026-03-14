import type { Metadata } from "next";
import React from "react";
import CashFlowChart from "@/components/dashboard/CashFlowChart";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
// import StockTicker from "@/components/swiper/StockSwiper";
// import PortfolioSwiper from "@/components/swiper/PortfolioSwiper";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("HOME");

  return {
    title: t("META_TITLE"),
    description: t("META_DESCRIPTION"),
  };
}

export default function Dashboard() {
  const t = useTranslations("HOME");
  return (
    <>
      <PageBreadcrumb pageTitle={t("DASHBOARD")} />
      <div className="p-6 grid grid-cols-12 gap-4 md:gap-6">
        {/* <div className="col-span-12 space-y-6">
          <StockTicker />
        </div>

        <div className="col-span-12 md:col-span-3 space-y-6">
          <div className="overflow-hidden h-[250px] xl:h-[445px]">
            <PortfolioSwiper />
          </div>
        </div> */}

        {/*md:col-span-9*/}
        <div className="col-span-12 ">
          <CashFlowChart />
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
