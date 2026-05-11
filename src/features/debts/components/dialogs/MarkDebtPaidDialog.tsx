"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { onMarkPaidDebt } from "@/features/debts/server";
import { useToast } from "@/shared/hooks/useToast";

type Props = {
  isMarkPaidDialogOpen: boolean;
  setIsMarkPaidOpen: (open: boolean) => void;
  mutate?: () => void;
  selectedId: string;
};

export function MarkDebtPaidDialog({
  isMarkPaidDialogOpen,
  setIsMarkPaidOpen,
  mutate,
  selectedId,
}: Props) {
  const t = useTranslations("DEBTS");
  const { toast } = useToast();
  return (
    <Dialog open={isMarkPaidDialogOpen} onOpenChange={setIsMarkPaidOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("MARK_DEBT_PAID")}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsMarkPaidOpen(false)}
            className="bg-transparent"
          >
            {t("CANCEL")}
          </Button>
          <Button
            color="success"
            onClick={async () => {
              setIsMarkPaidOpen(false);

              const res = await onMarkPaidDebt(selectedId, t, mutate);

              toast({ description: res.message });
            }}
          >
            {t("YES_MARK")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
