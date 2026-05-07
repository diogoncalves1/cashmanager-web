"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Mail, Clock, Timer } from "lucide-react";
import { useInvitationStats } from "@/hooks/useInvitationStats";
import InvitationContainerLoading from "./InvitationContainerLoading";
import InvitesList from "./InvitesList";
import ReceivedInvitesList from "./ReceivedInvitesList";
import InviteMemberButton from "@/features/invitations/components/actions/InviteMemberButton";
import { useTranslations } from "next-intl";

const InvitationContainer = ({ type }: { type: "accounts" | "debts" | "financial-goals" }) => {
  const { stats, loading, setLoad, load } = useInvitationStats(type);
  const t = useTranslations("INVITE_MEMBER");

  if (loading) return <InvitationContainerLoading />;

  return (
    <div className="grid grid-cols-12 p-2 md:p-6 gap-4 md:gap-6">
      <div className="col-span-12">
        <div className="max-w-6xl mx-auto px-6 py-10  ">
          <main className="container">
            <div className="space-y-8">
              {/* Page header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {t("INVITATIONS")}
                  </h1>
                  <p className="text-muted-foreground mt-1">{t("INVITATIONS_TEXT")}</p>
                </div>
                <InviteMemberButton
                  type={type}
                  mutate={() => {
                    setLoad(true);
                  }}
                />
              </div>
              <div className="space-y-8">
                {/* Summary cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="flex items-center gap-4 px-5">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Send className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("SENT")}</p>
                        <p className="text-2xl font-bold">{stats.sentInvites}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 px-5">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Mail className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("RECEIVED")}</p>
                        <p className="text-2xl font-bold">{stats.receivedInvites}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 px-5">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="size-5 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("PENDING_SENT")}</p>
                        <p className="text-2xl font-bold">{stats.pendingInvites}</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex items-center gap-4 px-5">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <Timer className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("AWAITING_RESPONSE")}</p>
                        <p className="text-2xl font-bold">{stats.awaitingInvites}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="received" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="received" className="gap-2">
                      {t("RECEIVED")}
                      {stats.awaitingInvites > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                          {stats.awaitingInvites}
                        </span>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="sent" className="gap-2">
                      {t("SENT")}
                      {stats.pendingInvites > 0 && (
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">
                          {stats.pendingInvites}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="received">
                    <ReceivedInvitesList type={type} setLoad={setLoad} load={load} />
                  </TabsContent>

                  <TabsContent value="sent">
                    <InvitesList type={type} setLoad={setLoad} load={load} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default InvitationContainer;
