import Link from "next/link";
import React from "react";
import DashboardMetrics from "../dashboard/DashboardMetrics";
import { LayoutDashboard } from "lucide-react";

interface Breadcrumb {
  title: string;
  path?: string;
}

interface BreadcrumbProps {
  pageTitle?: string;
  breadcrumb?: Breadcrumb[];
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, breadcrumb }) => {
  return (
    <div className="flex flex-wrap items-center border-b border-gray-100 bg-gray-50 px-5 py-1.5 justify-between gap-3 dark:border-gray-800 dark:bg-white/[0.02]">
      <h2 className="text-sm font-semibold text-gray-600 dark:text-white/90" x-text="pageName">
        {pageTitle}
      </h2>
      <nav>
        <ol className="flex items-center gap-1">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400"
              href="/dashboard"
            >
              Dashboard
            </Link>
          </li>
          {breadcrumb?.map((item) => (
            <React.Fragment key={item.title}>
              <svg
                className="stroke-current"
                width="18"
                height="17"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <li>
                {item.path ? (
                  <Link
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-500 dark:text-gray-400"
                    href={item.path}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <p className="inline-flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                    {item.title}
                  </p>
                )}
              </li>
            </React.Fragment>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
