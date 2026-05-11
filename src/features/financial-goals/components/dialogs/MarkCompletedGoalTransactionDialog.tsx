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
import { onMarkPaidFinancialGoal } from "@/features/financial-goals/server";
import { useTranslations } from "next-intl";

type Props = {
  isConfirmDialogOpen: boolean;
  setIsConfirmOpen: (open: boolean) => void;
  mutate?: () => void;
  selectedId: string;
};

export function MarkCompletedGoalTransactionDialog({
  isConfirmDialogOpen,
  setIsConfirmOpen,
  mutate,
  selectedId,
}: Props) {
  const t = useTranslations("FINANCIAL_GOALS");
  return (
    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("MARK_COMPLETED_FINANCIAL_GOAL")}</DialogTitle>
          <DialogDescription>{t("MARK_COMPLETED_FINANCIAL_GOAL_TEXT")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsConfirmOpen(false)}
            className="bg-transparent"
          >
            {t("CANCEL")}
          </Button>
          <Button
            color="success"
            onClick={async () => {
              setIsConfirmOpen(false);
              onMarkPaidFinancialGoal(selectedId, t, mutate);
            }}
          >
            {t("MARK_COMPLETED")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
