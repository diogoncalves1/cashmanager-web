import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Debt } from "@/models/debt";

type Props = {
  showDeleteDialog: boolean;
  setShowDeleteDialog: (open: boolean) => void;
  debt: Debt;
};

export default function DeleteDebtDialog({ showDeleteDialog, setShowDeleteDialog, debt }: Props) {
  return (
    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Delete Debt</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete this debt? This action cannot be undone and all
            associated payment history will be lost.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-destructive"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium text-foreground">{debt.name}</div>
                <div className="text-sm text-muted-foreground">
                  {debt.monthsPaid} payments recorded
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteDialog(false)}>
            Delete Debt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
