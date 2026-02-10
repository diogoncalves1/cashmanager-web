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
import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";

type InviteType = "debts" | "financial-goals" | "accounts";

type Props = {
  isOpen: boolean;
  setIsOpen: any;
  type: InviteType;
  id: string;
  userId: string;
  mutate: () => void;
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
  const { roles, loading, handleSubmit, formData, setFormData } = useDataForChangeRole({
    type,
    id,
    load: isOpen,
    userId,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  console.log(formData);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    LoadingToast({
      title: t("INVITING_TITLE"),
      message: t("INVITING_MESSAGE"),
    });

    const res = await handleSubmit(mutate);

    setIsSubmitting(false);
    setIsOpen(false);
    if (res.success) {
      return SwalToast({ message: res.message, icon: "success" });
    }
    return SwalToast({ message: res.message, icon: "error" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Change Role</DialogTitle>
            <DialogDescription>Change role someone to contribute to this goal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={formData.shared_role_id || ""}
                onValueChange={(e: string) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    shared_role_id: e,
                  }));
                }}
              >
                <SelectTrigger className="h-14 bg-input border-border text-foreground">
                  <SelectValue placeholder="Choose a role" />
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
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setIsOpen(false);
                setIsSubmitting(true);
              }}
              disabled={!formData.shared_role_id}
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
