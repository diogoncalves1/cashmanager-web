import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react";

type AccountTabsProps = {
  activeTab: "overview" | "transactions" | "users" | "others" | "monthly" | "categories";
  setActiveTab: Dispatch<
    SetStateAction<"overview" | "transactions" | "users" | "others" | "monthly" | "categories">
  >;
};

export function AccountTabs({ activeTab, setActiveTab }: AccountTabsProps) {
  const tabs = [
    { id: "overview", label: "Visão Geral" },
    { id: "transactions", label: "Transações" },
    { id: "users", label: "Utilizadores" },
    { id: "monthly", label: "Resumo Mensal" },
    { id: "categories", label: "Categorias" },
    { id: "others", label: "Outros" },
  ];

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
