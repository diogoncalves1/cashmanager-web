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
import { Transaction } from "@/features/transactions/types";
import { onDeleteTransaction } from "@/features/transactions/api/transaction.api";
import { useTranslations } from "next-intl";
import { Table as ReactTable } from "@tanstack/react-table";

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
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("DELETE_TRANSACTION")}</AlertDialogTitle>
          <AlertDialogDescription>{t("DELETE_TRANSACTION_TEXT")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("CANCEL")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              const result = await onDeleteTransaction(id, table, pagination);
              if (mutate) mutate();
              toast({
                description: result.message,
              });
              onOpenChange(false);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("DELETE")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
