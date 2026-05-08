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
import { useDataForInvite } from "@/features/invitations/hooks/useDataForInvite";
import { useTranslations } from "next-intl";
import { SwalToast } from "@/components/swal/SwalToast";
import { Account } from "@/features/accounts/types";
import { Debt } from "@/features/debts/types";
import { FinancialGoal } from "@/types/financialGoal";
import { toast } from "@/hooks/useToast";

type InviteType = "debts" | "financial-goals" | "accounts";

type Props = {
  isInviteOpen: boolean;
  setIsInviteOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: InviteType;
  id?: string;
  mutate?: () => void;
};

export default function InviteMemberDialog({
  isInviteOpen,
  setIsInviteOpen,
  type,
  id,
  mutate,
}: Props) {
  const t = useTranslations("INVITE_MEMBER");
  const { roles, friends, loading, handleSubmit, formData, setFormData, subjects } =
    useDataForInvite({
      type,
      id: id,
      load: isInviteOpen,
    });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const res = await handleSubmit();

    setIsSubmitting(false);
    setIsInviteOpen(false);
    toast({ description: res.message });
    if (res.success && mutate) mutate();
  };

  if (!loading && !id && subjects.length == 0) {
    SwalToast({ message: "No subjects", icon: "warning" });
    setIsInviteOpen(false);
    return <></>;
  }

  return (
    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{t("INVITE_MEMBER")}</DialogTitle>
            <DialogDescription>{t("INVITE_MEMBER_TEXT")}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!id && (
              <div className="space-y-2">
                <Label>{t(type.toUpperCase())}</Label>
                {!loading ? (
                  <Select
                    value={formData.subject_id || ""}
                    onValueChange={(e: string) => {
                      setFormData((prev) => ({
                        ...prev,
                        subject_id: e,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-14 bg-input border-border text-foreground">
                      <SelectValue placeholder={t(`CHOOSE_${type.toUpperCase()}`)} />
                    </SelectTrigger>
                    <SelectContent>
                      {!loading &&
                        subjects?.map((subject: Account | Debt | FinancialGoal) => (
                          <SelectItem key={subject.id} value={`${subject.id}`}>
                            {subject.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-2 space-y-2">
                    <div className="h-8 rounded bg-muted animate-pulse" />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>{t("FRIEND")}</Label>
              {!loading ? (
                <Select
                  value={formData.user_id || ""}
                  onValueChange={(e: string) => {
                    setFormData((prev) => ({
                      ...prev,
                      user_id: e,
                    }));
                  }}
                >
                  <SelectTrigger className="h-14 bg-input border-border text-foreground">
                    <SelectValue placeholder={t("CHOOSE_A_FRIEND")} />
                  </SelectTrigger>
                  <SelectContent>
                    {!loading &&
                      friends?.map((friend) => (
                        <SelectItem key={friend.id} value={`${friend.user.id}`}>
                          {friend.user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2 space-y-2">
                  <div className="h-8 rounded bg-muted animate-pulse" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>{t("ROLE")}</Label>
              {!loading ? (
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
              ) : (
                <div className="p-2 space-y-2">
                  <div className="h-8 rounded bg-muted animate-pulse" />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsInviteOpen(false)}
              className="bg-transparent"
            >
              {t("CANCEL")}
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.shared_role_id ||
                !formData.user_id ||
                (!id && !formData.subject_id) ||
                isSubmitting
              }
            >
              {isSubmitting ? t("SENDING") : t("SEND_INVITATION")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
