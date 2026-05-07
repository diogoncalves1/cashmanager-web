"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslations } from "next-intl";
import { FormAccountDialog } from "@/features/accounts/components/dialogs/FormAccountDialog";

type Props = {
  setLoad?: Dispatch<SetStateAction<boolean>>;
};

export function NewAccountButton({ setLoad }: Props) {
  const t = useTranslations("ACCOUNTS");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="size-4" />
        {t("NEW_ACCOUNT")}
      </Button>
      <FormAccountDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mutate={() => {
          if (setLoad) setLoad((prev) => !prev);
        }}
      />
    </>
  );
}
