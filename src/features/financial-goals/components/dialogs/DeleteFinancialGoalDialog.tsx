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
import { Target, TriangleAlert } from "lucide-react";

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

  const handleDelete = async () => {
    setIsSubmiting(true);
    const res = await onDeleteFinancialGoal(selectedId);

    setIsDeleteOpen(false);
    setIsSubmiting(false);
    toast({ description: res.message });
    if (res.success && goBack) {
      router.push("/financial-goals");
    }
  };

  return (
    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="pr-8">
          <div className="mb-2 flex size-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <TriangleAlert className="size-6" strokeWidth={1.75} />
          </div>
          <DialogTitle className="text-xl">{t("DELETE_GOAL")}</DialogTitle>
          <DialogDescription>{t("DELETE_GOAL_TEXT")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-900/60">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-muted-foreground shadow-sm dark:bg-gray-800">
                <Target className="size-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-foreground">{t("FINANCIAL_GOAL_DETAILS")}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {t("DELETE_GOAL_WARNING")}
                </div>
              </div>
            </div>
          </div>
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
            disabled={isSubmiting}
            onClick={handleDelete}
          >
            {isSubmiting ? t("DELETING_GOAL") : t("DELETE_GOAL")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
