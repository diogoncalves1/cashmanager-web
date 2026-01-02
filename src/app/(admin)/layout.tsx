"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Dynamic class for main content margin based on sidebar state
  const mainContentMargin = isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[235px]"
    : "lg:ml-[90px]";

  return (
    <ProtectedRoute>
      <div className="flex">
        {/* Sidebar and Backdrop */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 min-h-dvh transition-all bg-gray-100 dark:bg-gray-900  duration-300 ease-in-out ${mainContentMargin}`}
        >
          <AppHeader />
          {/* Header */}
          {/* Page Content */}
          <div className=" mx-auto max-w-(--breakpoint-4xl)">{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
