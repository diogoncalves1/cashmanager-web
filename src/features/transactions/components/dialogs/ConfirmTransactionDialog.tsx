"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/shared/hooks/useToast";
import { onConfirmTransaction } from "@/features/transactions/server";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface ConfirmTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  mutate: () => void;
}

export function ConfirmTransactionDialog({
  open,
  onOpenChange,
  id,
  mutate,
}: ConfirmTransactionDialogProps) {
  const { toast } = useToast();
  const t = useTranslations("TRANSACTIONS");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("CONFIRM_TRANSACTION")}</AlertDialogTitle>
          <AlertDialogDescription>{t("CONFIRM_TRANSACTION_TEXT")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button type="button" size="lg" variant="app_cancel" onClick={() => onOpenChange(false)}>
            {t("CANCEL")}
          </Button>
          <Button
            onClick={async () => {
              const result = await onConfirmTransaction(id, mutate);
              if (mutate) mutate();
              toast({
                description: result.message,
              });
              onOpenChange(false);
            }}
            type="submit"
            size="lg"
            variant="app_submit"
          >
            {t("CONFIRM")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
