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
import { Button } from "@/components/ui/button";

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
          <Button
            type="button"
            size="lg"
            variant="app_cancel"
            onClick={() => setIsDeleteOpen(false)}
          >
            {t("CANCEL")}
          </Button>
          <Button onClick={handleDelete} type="submit" size="lg" variant="app_danger">
            {t("DELETE_ACCOUNT")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
