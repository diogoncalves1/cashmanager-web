"use client";

import { ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Friendship } from "@/features/friends";
import { useTranslations } from "next-intl";

interface BlockedUserCardProps {
  friendship: Friendship;
  onUnblock: (id: string) => void;
}

export function BlockedUserCard({ friendship, onUnblock }: BlockedUserCardProps) {
  const t = useTranslations("FRIENDS");
  const { user } = friendship;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-11 opacity-50">
          <AvatarFallback className="bg-muted text-muted-foreground text-sm font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold leading-none text-muted-foreground">{user.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        onClick={() => onUnblock(friendship.id)}
        className="gap-1.5 bg-transparent"
      >
        <ShieldCheck className="size-3.5" />
        {t("UNBLOCK")}
      </Button>
    </div>
  );
}
