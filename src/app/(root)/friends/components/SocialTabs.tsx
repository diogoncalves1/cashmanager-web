"use client";

import { Users, UserPlus, Inbox, ShieldOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFriendStats } from "../hooks/useFriends";
import FriendsList from "./FriendsList";
import SentRequests from "./SentRequests";
import AddFriend from "./AddFriend";
import ReceivedRequests from "./ReceivedRequests";
import BlockedUsers from "./BlockedUsers";

export default function SocialTabs() {
  const t = useTranslations("FRIENDS");

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
    <div className="space-y-8">
      {/* Add Friend Search Section */}
      <div className="mb-8">
        <AddFriend />
      </div>
      <Tabs defaultValue="friends" className="space-y-6">
        <TabsList>
          <TabsTrigger value="friends" className="gap-2">
            <Users className="size-4" />
            {t("FRIENDS")}
            {stats.friends > 0 && (
              <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                {stats.friends}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="received" className="gap-2">
            <Inbox className="size-4" />
            {t("RECEIVED")}
            {stats.received > 0 && (
              <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-warning/10 text-xs text-warning">
                {stats.received}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <UserPlus className="size-4" />
            {t("SENT")}
            {stats.sent > 0 && (
              <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground">
                {stats.sent}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="blocked" className="gap-2">
            <ShieldOff className="size-4" />
            {t("BLOCKED")}
            {stats.blocked > 0 && (
              <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-destructive/10 text-xs text-destructive">
                {stats.blocked}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Friends Tab */}
        <TabsContent value="friends" className="space-y-4">
          <FriendsList />
        </TabsContent>

        {/* Received Tab */}
        <TabsContent value="received" className="space-y-3">
          <ReceivedRequests />
        </TabsContent>

        {/* Sent Tab */}
        <TabsContent value="sent" className="space-y-3">
          <SentRequests />
        </TabsContent>

        {/* Blocked Tab */}
        <TabsContent value="blocked" className="space-y-3">
          <BlockedUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
