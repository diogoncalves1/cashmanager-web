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
import { useDataForInvite } from "@/hooks/useDataForInvite";
import { useTranslations } from "next-intl";
import LoadingToast from "@/components/swal/LoadingToast";
import { SwalToast } from "@/components/swal/SwalToast";

type InviteType = "debts" | "financial-goals" | "accounts";

type Props = {
  isInviteOpen: boolean;
  setIsInviteOpen: any;
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
      id,
      load: isInviteOpen,
    });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    LoadingToast({
      title: t("INVITING_TITLE"),
      message: t("INVITING_MESSAGE"),
    });

    const res = await handleSubmit();

    setIsSubmitting(false);
    setIsInviteOpen(false);
    if (res.success) {
      if (mutate) mutate();
      return SwalToast({ message: res.message, icon: "success" });
    }
    return SwalToast({ message: res.message, icon: "error" });
  };

  if (!loading && subjects.length == 0) {
    SwalToast({ message: "No subjects", icon: "warning" });
    setIsInviteOpen(false);
    return <></>;
  }

  return (
    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>Invite someone to contribute to this goal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {!id && (
              <div className="space-y-2">
                <Label>Subject</Label>
                {!loading ? (
                  <Select
                    value={formData.subject_id || ""}
                    onValueChange={(e: string) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        subject_id: e,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-14 bg-input border-border text-foreground">
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {!loading &&
                        subjects?.map((subject: any) => (
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
              <Label>Friend</Label>
              {!loading ? (
                <Select
                  value={formData.user_id || ""}
                  onValueChange={(e: string) => {
                    setFormData((prev: any) => ({
                      ...prev,
                      user_id: e,
                    }));
                  }}
                >
                  <SelectTrigger className="h-14 bg-input border-border text-foreground">
                    <SelectValue placeholder="Choose a friend" />
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
              <Label>Role</Label>
              {!loading ? (
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
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                setIsInviteOpen(false);
                setIsSubmitting(true);
              }}
              disabled={
                !formData.shared_role_id || !formData.user_id || (!id && !formData.subject_id)
              }
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
