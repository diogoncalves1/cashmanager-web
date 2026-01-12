import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";

type AccountTabsProps = {
  activeTab: "overview" | "transactions" | "users" | "others" | "monthly" | "categories";
  setActiveTab: Dispatch<
    SetStateAction<"overview" | "transactions" | "users" | "others" | "monthly" | "categories">
  >;
  enableMonthly: boolean;
  enableCategories: boolean;
};

type Tab = {
  id: string;
  label: string;
};

export function AccountTabs({
  activeTab,
  setActiveTab,
  enableCategories,
  enableMonthly,
}: AccountTabsProps) {
  const t = useTranslations("ACCOUNTS");

  const tabs = [
    { id: "overview", label: t("OVERVIEW") },
    { id: "transactions", label: t("TRANSACTIONS") },
    { id: "users", label: t("USERS") },
    enableMonthly && { id: "monthly", label: t("MONTHLY_RESUME") },
    enableCategories && { id: "categories", label: t("CATEGORIES") },
    { id: "others", label: t("OTHERS") },
  ].filter((tab): tab is Tab => Boolean(tab));

  return (
    <div className="relative border-b border-gray-200">
      <div className="flex gap-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative pb-3 text-sm font-medium ${
              activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}

            {activeTab === tab.id && (
              <motion.span
                layoutId="activeTab"
                className="absolute left-1/4 right-1/4 -bottom-px h-0.5 rounded-full bg-blue-600"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
