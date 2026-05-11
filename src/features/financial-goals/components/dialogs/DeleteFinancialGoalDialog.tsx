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
import { onDeleteFinancialGoal } from "@/features/financial-goals/server";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useToast } from "@/shared/hooks/useToast";
import { useState } from "react";

type Props = {
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  selectedId: string;
  goBack?: boolean;
};

export const DeleteFinancialGoalDialog = ({
  isDeleteOpen,
  setIsDeleteOpen,
  selectedId,
  goBack = false,
}: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations("FINANCIAL_GOALS");
  const [isSubmiting, setIsSubmiting] = useState(false);

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("DELETE_GOAL")}</DialogTitle>
          <DialogDescription>{t("DELETE_GOAL_TEXT")}</DialogDescription>
        </DialogHeader>
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
            disabled={isSubmiting}
            onClick={async () => {
              setIsSubmiting(true);
              const res = await onDeleteFinancialGoal(selectedId);

              setIsDeleteOpen(false);
              setIsSubmiting(false);
              toast({ description: res.message });
              if (res.success && goBack) {
                router.push("/financial-goals");
              }
            }}
          >
            {isSubmiting ? t("DELETING_GOAL") : t("DELETE_GOAL")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
