"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormTransactionDialog from "./FormTransactionDialog";
import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  setLoad?: Dispatch<SetStateAction<boolean>>;
};

export function NewTransactionButton({ setLoad }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button className="gap-2" onClick={() => setIsOpen(true)}>
        <Plus className="size-4" />
        New Transaction
      </Button>
      <FormTransactionDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mutate={() => {
          if (setLoad) setLoad((prev) => !prev);
        }}
      />
    </>
  );
}
