"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { FormPaymentDialog } from "@/features/debt-payments";
import CreateButton from "@/shared/ui/create-button";

type Props = {
  setLoad?: Dispatch<SetStateAction<boolean>>;
  debtId?: string;
  className?: string;
};

export function NewDebtPaymentsButton({ setLoad, debtId, className }: Props) {
  const t = useTranslations("DEBT_PAYMENTS");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <CreateButton className={className} onClick={() => setIsOpen(true)}>
        {t("NEW_PAYMENT")}
      </CreateButton>
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
