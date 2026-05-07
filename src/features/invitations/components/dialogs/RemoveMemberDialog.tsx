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
import { onRemoveMember } from "@/services/invitation";

type InviteType = "debts" | "financial-goals" | "accounts";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: InviteType;
  id: string;
  userId: string;
  mutate?: () => void;
};

export default function RemoveMemberDialog({ isOpen, setIsOpen, type, id, userId, mutate }: Props) {
  const t = useTranslations("INVITE_MEMBER");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("REMOVE_MEMBER")}</DialogTitle>
          <DialogDescription>{t("REMOVE_MEMBER_TEXT")}</DialogDescription>
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
              await onRemoveMember(id, type, userId, mutate);
              setIsSubmitting(false);
              setIsOpen(false);
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("REMOVING") : t("REMOVE")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
