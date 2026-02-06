import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { onConfirmFinancialGoalTransaction } from "@/services/financial-goal-transactions/service";
import { onConfirmDebtPayment } from "@/services/debt-payments/service";

type Props = {
  isConfirmDialogOpen: boolean;
  setIsConfirmOpen: any;
  mutate?: () => void;
  selectedId: string;
};

export default function ConfirmDebtPaymentDialog({
  isConfirmDialogOpen,
  setIsConfirmOpen,
  mutate,
  selectedId,
}: Props) {
  return (
    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogDescription>Are you sure you want to confirm this transaction?</DialogDescription>
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
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={async () => {
              try {
                setIsConfirmOpen(false);
                onConfirmDebtPayment(selectedId, mutate);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
