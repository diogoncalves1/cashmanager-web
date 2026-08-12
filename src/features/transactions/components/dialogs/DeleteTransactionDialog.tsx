"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/shared/hooks/useToast";
import { Transaction } from "@/features/transactions";
import { onDeleteTransaction } from "@/features/transactions/server";
import { useTranslations } from "next-intl";
import { Table as ReactTable } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type PaginationState = {
  pageIndex: number;
  pageSize: number;
};

interface DeleteTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  table: ReactTable<Transaction>;
  pagination: PaginationState;
  mutate: () => void;
}

export function DeleteTransactionDialog({
  open,
  onOpenChange,
  id,
  table,
  pagination,
  mutate,
}: DeleteTransactionDialogProps) {
  const t = useTranslations("TRANSACTIONS");
  const { toast } = useToast();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("DELETE_TRANSACTION")}</AlertDialogTitle>
          <AlertDialogDescription>{t("DELETE_TRANSACTION_TEXT")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button type="button" size="lg" variant="app_cancel" onClick={() => onOpenChange(false)}>
            {t("CANCEL")}
          </Button>
          <Button
            onClick={async () => {
              const result = await onDeleteTransaction(id, table, pagination);
              if (mutate) mutate();
              toast({
                description: result.message,
              });
              onOpenChange(false);
            }}
            type="submit"
            size="lg"
            variant="app_danger"
          >
            {t("DELETE")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
