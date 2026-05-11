"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FinancialGoalTransaction } from "@/features/financial-goal-transactions";
import { onDeleteFinancialGoalTransaction } from "@/features/financial-goal-transactions/server";
import { useRouter } from "next/navigation";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate?: () => void;
  table?: Table<FinancialGoalTransaction>;
  pagination?: PaginationState;
  selectedId: string;
  goBack?: boolean;
};

export function DeleteGoalTransactionDialog({
  isDeleteDialogOpen,
  setIsDeleteOpen,
  mutate,
  table,
  pagination,
  selectedId,
  goBack = false,
}: Props) {
  const router = useRouter();
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("DELETE_TRANSACTION")}</DialogTitle>
          <DialogDescription>{t("DELETE_TRANSACTION_TEXT")}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              {t("DELETE_TRANSACTION_WARNING")}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
            className="bg-transparent"
          >
            {t("CANCEL")}
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                setIsDeleteOpen(false);
                onDeleteFinancialGoalTransaction(selectedId, table, pagination, mutate);
                if (goBack) router.push("/financial-goal-transactions");
              } catch (err) {
                console.error(err);
              }
            }}
          >
            {t("DELETE")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
