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
import { onConfirmDebtPayment } from "@/features/debt-payments/server";
import { useTranslations } from "next-intl";
import { useToast } from "@/shared/hooks/useToast";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Props = {
  isConfirmDialogOpen: boolean;
  setIsConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate?: () => void;
  selectedId: string;
};

export function ConfirmPaymentDialog({
  isConfirmDialogOpen,
  setIsConfirmOpen,
  mutate,
  selectedId,
}: Props) {
  const t = useTranslations("DEBT_PAYMENTS");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setIsSubmiting(true);
    const result = await onConfirmDebtPayment(selectedId, mutate);
    setIsSubmiting(false);
    if (mutate) mutate();
    toast({
      description: result.message,
    });
    setIsConfirmOpen(false);
  };

  return (
    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400">
            <CheckCircle2 className="size-6" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-xl">{t("CONFIRM_PAYMENT")}</DialogTitle>
          <DialogDescription>{t("CONFIRM_PAYMENT_TEXT")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-success-200 bg-success-50 p-4 text-sm text-success-700 dark:border-success-900/60 dark:bg-success-900/20 dark:text-success-400">
          {t("CONFIRM_PAYMENT_NOTICE")}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="app_cancel"
            size="lg"
            onClick={() => setIsConfirmOpen(false)}
            disabled={isSubmiting}
          >
            {t("CANCEL")}
          </Button>
          <Button
            type="button"
            variant="app_submit"
            size="lg"
            onClick={handleConfirm}
            disabled={isSubmiting}
          >
            {isSubmiting ? t("CONFIRMING_PAYMENT") : t("CONFIRM_PAYMENT")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
