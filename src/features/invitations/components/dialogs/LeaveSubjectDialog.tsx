import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { onLeaveSuject } from "@/features/invitations/api/invitation.api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";

type InviteType = "debts" | "financial-goals" | "accounts";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: InviteType;
  id: string;
  goBack: boolean;
  mutate?: () => void;
};

export default function LeaveSubjectDialog({ isOpen, setIsOpen, type, goBack, id, mutate }: Props) {
  const t = useTranslations("INVITE_MEMBER");
  const { toast } = useToast();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("LEAVE")}</DialogTitle>
          <DialogDescription>{t("LEAVE_TEXT")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-transparent"
          >
            {t("CANCEL")}
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={async () => {
              setIsSubmitting(true);
              const res = await onLeaveSuject(id, type, mutate);
              setIsSubmitting(false);
              setIsOpen(false);
              toast({
                description: res.message,
              });
              if (goBack) router.back();
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("LEAVING") : t("LEAVE")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
