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
import { Account } from "@/features/accounts";
import { onDeleteAccount } from "@/features/accounts/server";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  account: Account;
  back?: boolean;
};

export const DeleteAccountDialog = ({ isOpen, setIsDeleteOpen, account, back = false }: Props) => {
  const t = useTranslations("ACCOUNTS");
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    const res = await onDeleteAccount(account.id);

    toast({
      title: t("ACCOUNT_DELETED"),
      description: res.message,
    });

    setIsDeleteOpen(false);

    if (res.success && back) {
      router.push("/accounts");
      router.refresh();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsDeleteOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("DELETE_ACCOUNT")}?</AlertDialogTitle>
          <AlertDialogDescription>
            {t("DELETE_ACCOUNT_TEXT", { name: account.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("CANCEL")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("DELETE_ACCOUNT")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
