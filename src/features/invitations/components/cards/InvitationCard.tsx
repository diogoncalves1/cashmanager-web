"use client";

import { Check, X, Trash2, LinkIcon, Clock, View, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Invitation, InvitationDirection } from "@/features/invitations/types";
import { cn, formatDate } from "@/shared/utils";
import { useTranslations } from "next-intl";

type InviteType = "debts" | "financial-goals" | "accounts";

interface InvitationCardProps {
  invitation: Invitation;
  direction: InvitationDirection;
  type: InviteType;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string, userId: string) => void;
  onResend?: (id: string) => void;
}

const statusConfig = {
  pending: {
    className: "bg-warning-600/10 text-warning-600 border-warning-600/20",
    icon: Clock,
  },
  accepted: {
    className: "bg-success-600/10 text-success-600 border-success-600/20",
    icon: Check,
  },
  revoked: {
    className: "bg-destructive/10 text-destructive border-destructive/20",
    icon: X,
  },
};

const roleConfig = {
  viewer: { icon: View },
  admin: { icon: Shield },
};

export function InvitationCard({
  invitation,
  direction,
  onAccept,
  onReject,
  onCancel,
}: InvitationCardProps) {
  const monthsT = useTranslations("MONTHS");
  const status = statusConfig[invitation.status ?? "accepted"];
  const StatusIcon = status.icon;
  const roleInfo = roleConfig[(invitation.sharedRole?.code as "viewer" | "admin") ?? "viewer"];
  const RoleIcon = roleInfo.icon;
  const t = useTranslations("INVITE_MEMBER");

  const displayName = direction === "sent" ? invitation.receiver.name : invitation.sender.name;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("");

  const handleAccept = () => {
    onAccept?.(invitation.subject.id);
  };

  const handleReject = () => {
    onReject?.(invitation.subject.id);
  };

  const handleCancel = () => {
    onCancel?.(invitation.subject.id, invitation.receiver.id);
  };

  return (
    <Card className="transition-colors hover:border-primary/20">
      <CardContent className="px-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left: User info */}
          <div className="flex items-start gap-4">
            <Avatar className="size-11">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-semibold">{displayName}</h4>
                <Badge className={cn("text-xs font-medium", status.className)}>
                  <StatusIcon className="mr-1 size-3" />
                  {invitation.statusTranslated}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                {invitation.subject.name && (
                  <span className="flex items-center gap-1">
                    <LinkIcon className="size-3" />
                    {invitation.subject.name}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <RoleIcon className="size-3" />
                  {invitation.sharedRole?.name}
                </span>
                <span>{formatDate(invitation.createdAt, monthsT)}</span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          {invitation.status === "pending" && (
            <div className="flex shrink-0 items-center gap-2 sm:ml-4">
              {direction === "received" ? (
                <>
                  <Button size="sm" onClick={handleAccept} className="gap-1.5">
                    <Check className="size-3.5" />
                    {t("ACCEPT")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReject}
                    className="gap-1.5 bg-transparent"
                  >
                    <X className="size-3.5" />
                    {t("REJECT")}
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  className="gap-1.5 text-destructive hover:text-destructive
                  hover:border-error-200
                  hover:bg-error-50 bg-transparent"
                >
                  <Trash2 className="size-3.5" />
                  {t("CANCEL")}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
