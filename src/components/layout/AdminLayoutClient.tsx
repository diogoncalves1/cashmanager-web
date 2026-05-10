"use client";

import React from "react";
import { ProtectedRoute } from "@/features/auth";
import QueryProvider from "@/lib/providers/QueryProvider";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";
import Backdrop from "@/components/layout/Backdrop";

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
      ? "lg:ml-[235px]"
      : "lg:ml-[90px]";

  return (
    <ProtectedRoute>
      <QueryProvider>
        <div className="flex">
          {/* Sidebar and Backdrop */}
          <AppSidebar />
          <Backdrop />

          {/* Main Content Area */}
          <div
            className={`flex-1 min-h-dvh transition-all duration-300 ease-in-out bg-gray-100 dark:bg-gray-900 ${mainContentMargin}`}
          >
            <AppHeader />

            {/* Page Content */}
            <div className="mx-auto max-w-(--breakpoint-4xl)">{children}</div>
          </div>
        </div>
      </QueryProvider>
    </ProtectedRoute>
  );
}
