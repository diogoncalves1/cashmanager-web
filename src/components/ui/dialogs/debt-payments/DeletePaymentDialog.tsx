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
import { onDeleteDebtPayment } from "@/services/debtPayment";
import { useTranslations } from "next-intl";
import { DebtPayment } from "@/types/debtPayment";
import { Table as ReactTable } from "@tanstack/react-table";
import { MyPagination } from "@/features/transactions/types";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedId: string;
  mutate?: () => void;
  table?: ReactTable<DebtPayment>;
  pagination?: MyPagination;
};

export default function DeletePaymentDialog({
  isDeleteDialogOpen,
  setIsDeleteOpen,
  mutate,
  table,
  pagination,
  selectedId,
}: Props) {
  const t = useTranslations("DEBT_PAYMENTS");
  const { toast } = useToast();
  const [isSubmiting, setIsSubmiting] = useState(false);

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("DELETE_PAYMENT")}</DialogTitle>
          <DialogDescription>{t("DELETE_PAYMENT_TEXT")}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">{t("DELETE_PAYMENT_WARNING")}</p>
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
              setIsSubmiting(true);
              const res = await onDeleteDebtPayment(selectedId, table, pagination, mutate);
              toast({ description: res.message });
              setIsSubmiting(false);
              setIsDeleteOpen(false);
            }}
          >
            {isSubmiting ? t("DELETING") : t("DELETE")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
