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
import { useTranslations } from "next-intl";
import { onMarkPaidDebt } from "@/features/debts/server";
import { useToast } from "@/shared/hooks/useToast";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

type Props = {
  isMarkPaidDialogOpen: boolean;
  setIsMarkPaidOpen: (open: boolean) => void;
  mutate?: () => void;
  selectedId: string;
};

export function MarkDebtPaidDialog({
  isMarkPaidDialogOpen,
  setIsMarkPaidOpen,
  mutate,
  selectedId,
}: Props) {
  const t = useTranslations("DEBTS");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkPaid = async () => {
    setIsSubmitting(true);
    const res = await onMarkPaidDebt(selectedId, t, mutate);

    setIsSubmitting(false);
    setIsMarkPaidOpen(false);
    toast({ description: res.message });
  };

  return (
    <Dialog open={isMarkPaidDialogOpen} onOpenChange={setIsMarkPaidOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
            <CheckCircle2 className="size-6" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-xl">{t("MARK_DEBT_PAID")}</DialogTitle>
          <DialogDescription>{t("MARK_DEBT_PAID_TEXT")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-success-200 bg-success-50 p-4 text-sm text-success-700 dark:border-success-900/60 dark:bg-success-900/20 dark:text-success-400">
          {t("MARK_DEBT_PAID_NOTICE")}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="app_cancel"
            size="lg"
            onClick={() => setIsMarkPaidOpen(false)}
            disabled={isSubmitting}
          >
            {t("CANCEL")}
          </Button>
          <Button
            type="button"
            variant="app_submit"
            size="lg"
            onClick={handleMarkPaid}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("MARKING_TITLE") : t("YES_MARK")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
