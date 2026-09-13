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
import { DebtPayment } from "@/features/debt-payments";
import { onDeleteDebtPayment } from "@/features/debt-payments/server";
import { useTranslations } from "next-intl";
import { Table as ReactTable } from "@tanstack/react-table";
import { MyPagination } from "@/features/debt-payments";
import { useState } from "react";
import { useToast } from "@/shared/hooks/useToast";
import { TriangleAlert } from "lucide-react";

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedId: string;
  mutate?: () => void;
  table?: ReactTable<DebtPayment>;
  pagination?: MyPagination;
};

export function DeletePaymentDialog({
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

  const handleDelete = async () => {
    setIsSubmiting(true);
    const res = await onDeleteDebtPayment(selectedId, table, pagination, mutate);
    toast({ description: res.message });
    setIsSubmiting(false);
    setIsDeleteOpen(false);
  };

  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-xl">{t("DELETE_PAYMENT")}</DialogTitle>
          <DialogDescription>{t("DELETE_PAYMENT_TEXT")}</DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
          {t("DELETE_PAYMENT_WARNING")}
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="app_cancel"
            size="lg"
            onClick={() => setIsDeleteOpen(false)}
            disabled={isSubmiting}
          >
            {t("CANCEL")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            onClick={handleDelete}
            disabled={isSubmiting}
          >
            {isSubmiting ? t("DELETING") : t("DELETE")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
