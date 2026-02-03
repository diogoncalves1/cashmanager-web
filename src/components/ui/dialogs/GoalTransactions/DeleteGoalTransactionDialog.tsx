import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { onDeleteFinancialGoalTransaction } from "@/services/financial-goal-transactions/service";

type Props = {
  isDeleteDialogOpen: boolean;
  setIsDeleteOpen: any;
  mutate: () => void;
  table: any;
  pagination: any;
  selectedId: string;
};

export default function DeleteGoalTransactionDialog({
  isDeleteDialogOpen,
  setIsDeleteOpen,
  mutate,
  table,
  pagination,
  selectedId,
}: Props) {
  return (
    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction? This action cannot be undone and will
            affect the goal balance.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              Warning: Deleting this transaction will remove the amount from the goal balance.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeleteOpen(false)}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              try {
                setIsDeleteOpen(false);
                onDeleteFinancialGoalTransaction(selectedId, table, pagination, mutate);
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Delete Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
