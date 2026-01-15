"use client";

import { AppLink } from "@/components/ui/button/AppLink";
import { FinancialGoal } from "@/lib/models/financialGoal";
import { Activity, ArrowRight, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserFinancialGoalTransactionsModal } from "@/components/ui/modal/UserFinancialGoalTransactionsModal";

interface FinancialGoalUsersListProps {
  financialGoal?: FinancialGoal;
}

export default function FinancialGoalUsersList({ financialGoal }: FinancialGoalUsersListProps) {
  if (!financialGoal) return <></>;
  const t = useTranslations("FINANCIAL_GOALS");

  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="border-b px-6 py-4 flex justify-between">
        <h2 className="text-lg font-semibold">{t("USERS")}</h2>
        {financialGoal.actions?.manage && (
          <AppLink
            variant="default"
            path="/financial-goals/users"
            className="bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white text-sm gap-2 rounded-xl px-4 py-2"
          >
            <Plus className="size-5" />
            {t("ADD")}
          </AppLink>
        )}
      </div>

      <div className="divide-y">
        {financialGoal.users?.map((u, i) => (
          <div key={i} className="px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700 transition-transform hover:scale-110">
                {u.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-gray-500">{u.sharedRole?.name}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() =>
                setSelectedUser({
                  id: u.id,
                  name: u.name,
                })
              }
              className="
                        group flex items-center gap-2
                        rounded-full
                        bg-blue-100 px-4 py-2
                        text-sm font-medium text-blue-700
                        transition-all
                        hover:bg-blue-200
                        hover:shadow-sm
                        focus:outline-none
                      "
            >
              <Activity className="size-4 text-blue-600" />
              <span>{t("TRANSACTIONS")}</span>
              <ArrowRight className="size-4 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
            </motion.button>
          </div>
        ))}
        <UserFinancialGoalTransactionsModal
          open={!!selectedUser}
          userId={selectedUser?.id}
          financialGoalId={financialGoal.id}
          userName={selectedUser?.name}
          onClose={() => setSelectedUser(null)}
        />
      </div>
    </div>
  );
}
