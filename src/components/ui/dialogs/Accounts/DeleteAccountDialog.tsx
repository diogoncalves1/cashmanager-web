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
import { useToast } from "@/hooks/useToast";
import { Account } from "@/models/account";
import { onDeleteAccount } from "@/services/accounts/service";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  account: Account;
  back?: boolean;
};

const DeleteAccountDialog = ({ isOpen, setIsDeleteOpen, account, back = false }: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async () => {
    const res = await onDeleteAccount(account.id);

    toast({
      title: "Account deleted",
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
          <AlertDialogTitle>Delete Account</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{account.name}&quot;? All transactions will be
            permanently removed. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccountDialog;
