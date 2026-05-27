"use client";

import { Users, UserPlus, Inbox, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useFriendStats,
  AddFriend,
  SentRequests,
  FriendsList,
  ReceivedRequests,
  BlockedUsers,
} from "@/features/friends";
import { useSearchParams } from "next/navigation";

export function SocialTabs() {
  const t = useTranslations("FRIENDS");
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "friends";

  const { error, stats } = useFriendStats();

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-destructive font-medium">{t("ERROR_LOADING_STATS")}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm underline">
          {t("TRY_AGAIN")}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Add Friend Search Section */}
      <div className="mb-8">
        <AddFriend />
      </div>

      <Tabs defaultValue={initialTab} className="space-y-6">
        <TabsList className="flex w-full">
          <TabsTrigger
            value="friends"
            className="flex flex-1 items-center justify-center gap-1 md:gap-2 px-2 md:px-4"
          >
            <Users className="size-4 shrink-0" />
            <span className="hidden sm:inline">{t("FRIENDS")}</span>
            {stats.friends > 0 && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                {stats.friends}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="received"
            className="flex flex-1 items-center justify-center gap-1 md:gap-2 px-2 md:px-4"
          >
            <Inbox className="size-4 shrink-0" />
            <span className="hidden sm:inline">{t("RECEIVED")}</span>
            {stats.received > 0 && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-warning/10 text-xs text-warning">
                {stats.received}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="sent"
            className="flex flex-1 items-center justify-center gap-1 md:gap-2 px-2 md:px-4"
          >
            <UserPlus className="size-4 shrink-0" />
            <span className="hidden sm:inline">{t("SENT")}</span>
            {stats.sent > 0 && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                {stats.sent}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger
            value="blocked"
            className="flex flex-1 items-center justify-center gap-1 md:gap-2 px-2 md:px-4"
          >
            <ShieldOff className="size-4 shrink-0" />
            <span className="hidden sm:inline">{t("BLOCKED")}</span>
            {stats.blocked > 0 && (
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-xs text-destructive">
                {stats.blocked}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          <FriendsList />
        </TabsContent>
        <TabsContent value="received" className="space-y-3">
          <ReceivedRequests />
        </TabsContent>
        <TabsContent value="sent" className="space-y-3">
          <SentRequests />
        </TabsContent>
        <TabsContent value="blocked" className="space-y-3">
          <BlockedUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
