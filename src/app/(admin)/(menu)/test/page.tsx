import type { Metadata } from "next";
import { EcommerceMetrics } from "@/components/dashboard/EcommerceMetrics";
import React from "react";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import MonthlySalesChart from "@/components/dashboard/MonthlySalesChart";
import StatisticsChart from "@/components/dashboard/StatisticsChart";
import RecentOrders from "@/components/ecommerce/RecentOrders";
import DemographicCard from "@/components/ecommerce/DemographicCard";

import Accounts from "@/components/dashboard/Accounts";
import BasicTableOne from "@/components/tables/BasicTableOne";
import AccountsTable from "@/components/tables/AccountsTable";

export const metadata: Metadata = {
  title: "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function AccountsPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <AccountsTable />
      </div>
    </div>
  );
}
