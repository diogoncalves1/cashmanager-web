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
import { onConfirmDebtPayment } from "@/services/debtPayment";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";

type Props = {
  isConfirmDialogOpen: boolean;
  setIsConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate?: () => void;
  selectedId: string;
};

export default function ConfirmPaymentDialog({
  isConfirmDialogOpen,
  setIsConfirmOpen,
  mutate,
  selectedId,
}: Props) {
  const t = useTranslations("DEBT_PAYMENTS");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { toast } = useToast();
  return (
    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("CONFIRM_PAYMENT")}</DialogTitle>
          <DialogDescription>{t("CONFIRM_PAYMENT_TEXT")}</DialogDescription>
        </DialogHeader>
        {/* <div className="py-4">
          <div className="p-4 rounded-xl bg-success-500/10 border border-success-500/20">
            <p className="text-sm text-accent font-medium">
              Warning: Deleting this transaction will remove the amount from the goal balance.
            </p>
          </div>
        </div> */}
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
              setIsSubmiting(true);
              const result = await onConfirmDebtPayment(selectedId, mutate);
              setIsSubmiting(false);
              if (mutate) mutate();
              toast({
                description: result.message,
              });
              setIsConfirmOpen(false);
            }}
          >
            {isSubmiting ? t("CONFIRMING_PAYMENT") : t("CONFIRM_PAYMENT")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
