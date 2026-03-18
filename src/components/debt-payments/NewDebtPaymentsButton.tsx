"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import FormPaymentDialog from "../ui/dialogs/debt-payments/FormPaymentDialog";

type Props = {
  setLoad?: Dispatch<SetStateAction<boolean>>;
  debtId?: string;
};

export function NewDebtPaymentsButton({ setLoad, debtId }: Props) {
  const t = useTranslations("DEBT_PAYMENTS");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="size-4" />
        {t("NEW_PAYMENT")}
      </Button>
      <FormPaymentDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        debtId={debtId}
        mutate={() => {
          if (setLoad) setLoad((prev) => !prev);
        }}
      />
    </>
  );
}
