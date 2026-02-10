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
import { onLeaveSuject, onRemoveMember } from "@/services/invitations/invitations.service";
import { useRouter } from "next/navigation";

type InviteType = "debts" | "financial-goals" | "accounts";

type Props = {
  isOpen: boolean;
  setIsOpen: any;
  type: InviteType;
  id: string;
  goBack: boolean;
  mutate?: () => void;
};

export default function LeaveSubjectDialog({ isOpen, setIsOpen, type, goBack, id, mutate }: Props) {
  const t = useTranslations("INVITE_MEMBER");
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave</DialogTitle>
          <DialogDescription>Leave someone to contribute to this goal.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => setIsOpen(false)}
            className="bg-transparent"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            onClick={async () => {
              setIsSubmitting(true);
              if ((await onLeaveSuject(id, type, t, mutate)) && goBack) router.back();
              setIsSubmitting(false);
              setIsOpen(false);
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Removendo..." : "Remover"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
