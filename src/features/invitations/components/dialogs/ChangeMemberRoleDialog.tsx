import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useDataForChangeRole } from "@/hooks/useDataForInvite";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/useToast";

type InviteType = "debts" | "financial-goals" | "accounts";

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: InviteType;
  id: string;
  userId: string;
  mutate?: () => void;
};

export default function ChangeMemberRoleDialog({
  isOpen,
  setIsOpen,
  type,
  id,
  userId,
  mutate,
}: Props) {
  const t = useTranslations("INVITE_MEMBER");
  const { toast } = useToast();
  const { roles, loading, handleSubmit, formData, setFormData } = useDataForChangeRole({
    type,
    id,
    load: isOpen,
    userId,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await handleSubmit(mutate);

    setIsSubmitting(false);
    setIsOpen(false);
    if (res.success) {
      return toast({ description: res.message });
    }
    return toast({ description: res.message });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{t("CHANGE_ROLE")}</DialogTitle>
            <DialogDescription>{t("CHANGE_ROLE_TEXT")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>{t("ROLE")}</Label>
              <Select
                value={formData.shared_role_id || ""}
                onValueChange={(e: string) => {
                  setFormData((prev) => ({
                    ...prev,
                    shared_role_id: e,
                  }));
                }}
              >
                <SelectTrigger className="h-14 bg-input border-border text-foreground">
                  <SelectValue placeholder={t("CHOOSE_A_ROLE")} />
                </SelectTrigger>
                <SelectContent>
                  {!loading &&
                    roles?.map((sharedRole) => (
                      <SelectItem key={sharedRole.id} value={sharedRole.id}>
                        {sharedRole.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-transparent"
            >
              {t("CANCEL")}
            </Button>
            <Button type="submit" disabled={!formData.shared_role_id || isSubmitting}>
              {isSubmitting ? t("CHANGING") : t("CHANGE")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
