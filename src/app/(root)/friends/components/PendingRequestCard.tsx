"use client";

import { Check, X, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Friendship } from "@/models/friendship";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface PendingRequestCardProps {
  friendship: Friendship;
  direction: "sent" | "received";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
  isLoading?: boolean;
}

export function PendingRequestCard({
  friendship,
  direction,
  onAccept,
  onReject,
  onCancel,
  isLoading,
}: PendingRequestCardProps) {
  const { user } = friendship;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");
  const monthsT = useTranslations("MONTHS");

  return (
    <div className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-primary/20">
      <div className="flex items-center gap-4">
        <Avatar className="size-11">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold leading-none">{user.name}</p>
            <Badge variant="light" className="bg-warning/10 text-warning border-warning/20 text-xs">
              <Clock className="mr-1 size-3" />
              Pending
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">@{user.username}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDate(friendship.createdAt, monthsT)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {direction === "received" ? (
          <>
            <Button
              size="sm"
              onClick={() => onAccept?.(friendship.id)}
              disabled={isLoading}
              className="gap-1.5"
            >
              <Check className="size-3.5" />
              Accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject?.(friendship.id)}
              disabled={isLoading}
              className="gap-1.5 bg-transparent"
            >
              <X className="size-3.5" />
              Reject
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCancel?.(friendship.id)}
            disabled={isLoading}
            className="gap-1.5 text-destructive hover:text-destructive bg-transparent hover:bg-destructive/10"
          >
            <X className="size-3.5" />
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
