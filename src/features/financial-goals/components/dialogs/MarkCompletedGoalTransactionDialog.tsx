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
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true);
    await onMarkPaidFinancialGoal(selectedId, t, mutate);
    setIsSubmitting(false);
    setIsConfirmOpen(false);
  };

  return (
    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
            <CheckCircle2 className="size-6" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-xl">{t("MARK_COMPLETED_FINANCIAL_GOAL")}</DialogTitle>
          <DialogDescription>{t("MARK_COMPLETED_FINANCIAL_GOAL_TEXT")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-success-200 bg-success-50 p-4 text-sm text-success-700 dark:border-success-900/60 dark:bg-success-900/20 dark:text-success-400">
          {t("GOAL_COMPLETED_MESSAGE")}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="app_cancel"
            size="lg"
            onClick={() => setIsConfirmOpen(false)}
            disabled={isSubmitting}
          >
            {t("CANCEL")}
          </Button>
          <Button
            type="button"
            variant="app_submit"
            size="lg"
            onClick={handleComplete}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("SAVING") : t("MARK_COMPLETED")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
