"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormTransactionDialog } from "@/features/financial-goal-transactions";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  setLoad?: Dispatch<SetStateAction<boolean>>;
  financialGoalId?: string;
};

export function NewTransactionButton({ setLoad, financialGoalId }: Props) {
  const t = useTranslations("TRANSACTIONS");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="size-4" />
        {t("NEW_TRANSACTION")}
      </Button>
      <FormTransactionDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        financialGoalId={financialGoalId}
        mutate={() => {
          if (setLoad) setLoad((prev) => !prev);
        }}
      />
    </>
  );
}
