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
import { Debt } from "@/features/debts";
import { CreditCard, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { onDeleteDebt } from "@/features/debts/server";
import { useToast } from "@/shared/hooks/useToast";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  debt: Debt;
  goBack?: boolean;
};

export function DeleteDebtDialog({
  showDeleteDialog,
  setShowDeleteDialog,
  debt,
  goBack = false,
}: Props) {
  const t = useTranslations("DEBTS");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    setIsSubmiting(true);
    const res = await onDeleteDebt(debt.id);

    setIsSubmiting(false);
    toast({
      description: res.message,
    });

    setShowDeleteDialog(false);

    if (res.success && goBack) {
      router.push("/debts");
      router.refresh();
    }
  };

  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-xl text-foreground">{t("DELETE_DEBT")}</DialogTitle>
          <DialogDescription>{t("DELETE_DEBT_TEXT")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900/60">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-muted-foreground shadow-sm dark:bg-gray-800">
                <CreditCard className="size-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">{debt.name}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {debt.monthsPaid}{" "}
                  {debt.monthsPaid === 1 ? t("PAYMENT_RECORDED") : t("PAYMENTS_RECORDED")}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            {t("YOU_DONT_REVERT_THIS")}
          </div>
        </div>

        <DialogFooter className="mt-2">
          <Button
            type="button"
            variant="app_cancel"
            size="lg"
            onClick={() => setShowDeleteDialog(false)}
            disabled={isSubmiting}
          >
            {t("CANCEL")}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="lg"
            disabled={isSubmiting}
            onClick={() => {
              handleDelete();
            }}
          >
            {isSubmiting ? t("DELETING_DEBT") : t("DELETE_DEBT")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
