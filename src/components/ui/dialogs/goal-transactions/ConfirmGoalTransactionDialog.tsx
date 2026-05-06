import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { onConfirmFinancialGoalTransaction } from "@/services/financialGoalTransaction";
import { useTranslations } from "next-intl";

type Props = {
  isConfirmDialogOpen: boolean;
  setIsConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
  mutate?: () => void;
  selectedId: string;
};

export default function ConfirmGoalTransactionDialog({
  isConfirmDialogOpen,
  setIsConfirmOpen,
  mutate,
  selectedId,
}: Props) {
  const t = useTranslations("FINANCIAL_GOAL_TRANSACTIONS");
  return (
    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("CONFIRM_TRANSACTION")}</DialogTitle>
          <DialogDescription>{t("CONFIRM_TRANSACTION_TEXT")}</DialogDescription>
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
              try {
                setIsConfirmOpen(false);
                onConfirmFinancialGoalTransaction(selectedId, mutate);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            {t("CONFIRM_TRANSACTION")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
