"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth";
import QueryProvider from "@/shared/providers/QueryProvider";
// import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/components/layout/AppHeader";
import Backdrop from "@/components/layout/Backdrop";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  // const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // const mainContentMargin = isMobileOpen
  //   ? "ml-0"
  //   : isExpanded || isHovered
  //     ? "lg:ml-[235px]"
  //     : "lg:ml-[90px]";
  // const mainContentMargin = isMobileOpen
  //   ? "ml-0"
  //   : isExpanded || isHovered
  //     ? "lg:ml-[0px]"
  //     : "lg:ml-[0px]";

  return (
    <ProtectedRoute>
      <QueryProvider>
        <div className="flex">
          {/* Sidebar and Backdrop */}
          {/* <AppSidebar /> */}
          <Backdrop />

          {/* Main Content Area */}
          <div
            className={`flex-1 min-h-dvh transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-900 ${/*mainContentMargin*/ ""}`}
          >
            <AppHeader />

            {/* Page Content */}
            <div className="mx-auto max-w-(--breakpoint-4xl) py-[25px] px-2 sm:px-6 xl:px-60">
              {children}
            </div>
          </div>
        </div>
      </QueryProvider>
    </ProtectedRoute>
  );
}
