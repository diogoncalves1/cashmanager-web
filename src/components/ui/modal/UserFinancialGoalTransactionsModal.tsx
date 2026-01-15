"use client";

import { FinancialGoalTransactionsDataTable } from "@/app/(admin)/(menu)/financial-goal-transactions/data-table";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  userId?: string;
  financialGoalId: string;
  userName?: string;
  open: boolean;
  onClose: () => void;
};

export function UserFinancialGoalTransactionsModal({
  userId,
  financialGoalId,
  userName,
  open,
  onClose,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div
              className="w-full max-w-6xl rounded-2xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Transações — {userName}</h2>

                <button
                  onClick={onClose}
                  className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Body */}
              <FinancialGoalTransactionsDataTable
                enableUser={false}
                userId={userId}
                financialGoalId={financialGoalId}
              />

              {/* Footer */}
              <div className="flex justify-end gap-2 border-t px-6 py-4">
                <button
                  onClick={onClose}
                  className="rounded-xl border px-4 py-2 text-sm hover:bg-gray-50"
                >
                  Fechar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
