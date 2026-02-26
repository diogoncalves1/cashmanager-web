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
import { useToast } from "@/hooks/useToast";
import { onConfirmTransaction } from "@/services/transactions/service";
import { useTranslations } from "next-intl";

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
          <AlertDialogCancel>{t("CANCEL")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const result = await onConfirmTransaction(id, mutate);
              if (mutate) mutate();
              toast({
                description: result.message,
              });
              onOpenChange(false);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("CONFIRM")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
