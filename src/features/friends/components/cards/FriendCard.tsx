"use client";

import { MoreHorizontal, UserMinus, ShieldOff } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Friendship } from "@/features/friends";
import { useTranslations } from "next-intl";

interface FriendCardProps {
  friendship: Friendship;
  onRemove: (id: string) => void;
  onBlock: (id: string) => void;
}

export function FriendCard({ friendship, onRemove, onBlock }: FriendCardProps) {
  const t = useTranslations("FRIENDS");
  const { user } = friendship;
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:border-primary/20">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="size-11">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div>
          <p className="font-semibold leading-none">{user.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">{t("ACTIONS")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => onRemove(friendship.id)}
            className="text-destructive focus:text-destructive"
          >
            <UserMinus className="mr-2 size-4" />
            {t("REMOVE_FRIEND")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onBlock(friendship.id)} className="focus:text-black">
            <ShieldOff className="mr-2 size-4" />
            {t("BLOCK_USER")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
