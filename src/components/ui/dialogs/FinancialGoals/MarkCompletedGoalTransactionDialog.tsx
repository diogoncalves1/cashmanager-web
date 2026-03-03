import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { onMarkPaidFinancialGoal } from "@/services/financial-goals/service";
import { useTranslations } from "next-intl";

type Props = {
  isConfirmDialogOpen: boolean;
  setIsConfirmOpen: (open: boolean) => void;
  mutate?: () => void;
  selectedId: string;
};

export default function MarkCompletedGoalTransactionDialog({
  isConfirmDialogOpen,
  setIsConfirmOpen,
  mutate,
  selectedId,
}: Props) {
  const t = useTranslations("FINANCIAL_GOALS");
  return (
    <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Completed Financial Goal</DialogTitle>
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
            color="success"
            onClick={async () => {
              try {
                setIsConfirmOpen(false);
                onMarkPaidFinancialGoal(selectedId, t, mutate);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Mark Completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
