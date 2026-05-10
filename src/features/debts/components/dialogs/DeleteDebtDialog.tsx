import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Debt } from "@/features/debts/types";
import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import { onDeleteDebt } from "@/features/debts/api/debt.api";
import { useToast } from "@/shared/hooks/useToast";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  debt: Debt;
  goBack?: boolean;
};

export default function DeleteDebtDialog({
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
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">{t("DELETE_DEBT")}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("DELETE_DEBT_TEXT")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <TriangleAlert
                  className="size-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                />
              </div>
              <div>
                <div className="font-medium text-foreground">{debt.name}</div>
                <div className="text-sm text-muted-foreground">
                  {debt.monthsPaid}{" "}
                  {debt.monthsPaid == 1 ? t("PAYMENT_RECORDED") : t("PAYMENTS_RECORDED")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
            {t("CANCEL")}
          </Button>
          <Button
            variant="destructive"
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
