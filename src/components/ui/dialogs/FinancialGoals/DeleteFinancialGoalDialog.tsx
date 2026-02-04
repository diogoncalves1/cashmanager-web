"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { onDeleteFinancialGoal } from "@/services/financial-goals/service";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type Props = {
  isDeleteOpen: boolean;
  setIsDeleteOpen: any;
  selectedId: string;
  goBack?: boolean;
};

const DeleteFinancialGoalDialog = ({
  isDeleteOpen,
  setIsDeleteOpen,
  selectedId,
  goBack = false,
}: Props) => {
  const router = useRouter();
  const t = useTranslations("FINANCIAL_GOALS");

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Goal</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this goal? This action cannot be undone and all
            transaction history will be lost.
          </DialogDescription>
        </DialogHeader>
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
              setIsDeleteOpen(false);
              if ((await onDeleteFinancialGoal(selectedId, t)) && goBack) {
                router.push("/financial-goals");
              }
            }}
          >
            Delete Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFinancialGoalDialog;
