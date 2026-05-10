"use client";

import { useState } from "react";
import { Users, EllipsisVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getUserColor, getUserInitials } from "@/shared/utils";
import { User } from "@/shared/types/user";
import InviteMemberButton from "@/features/invitations/components/actions/InviteMemberButton";
import { Account } from "@/features/accounts";
import { useAuth } from "@/features/auth";
import ChangeMemberRoleDialog from "@/features/invitations/components/dialogs/ChangeMemberRoleDialog";
import RemoveMemberDialog from "@/features/invitations/components/dialogs/RemoveMemberDialog";
import { useAccountDetailsContext } from "@/features/accounts";
import { onCancelInvite } from "@/features/invitations/api/invitation.api";
import { useToast } from "@/shared/hooks/useToast";
import { useTranslations } from "next-intl";

interface AccountUsersSectionProps {
  isLoading?: boolean;
  account: Account;
}

export function AccountUsersSection({ isLoading, account }: AccountUsersSectionProps) {
  const t = useTranslations("ACCOUNTS");
  const { toast } = useToast();
  const { user } = useAuth();
  const users: User[] = account?.users ?? [];
  const invites: User[] = account?.invites ?? [];

  const statusConfig: Record<string, { label: string; dotColor: string; textClass: string }> = {
    active: { label: t("ACTIVE_USER"), dotColor: "bg-emerald-500", textClass: "text-emerald-500" },
    invited: { label: t("PENDING"), dotColor: "bg-amber-500", textClass: "text-amber-500" },
  };

  // Dialogs
  const { setLoadCounter } = useAccountDetailsContext();

  const [removeMember, setRemoveMember] = useState(false);
  const [changeRole, setChageRole] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const handleCancel = async (id: string, userId: string) => {
    return await onCancelInvite(id, userId, "accounts", () => {
      setLoadCounter((prev) => prev + 1);
    });
  };

  // Skeleton loading
  if (isLoading) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border">
            <div className="p-4 space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-44" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full hidden sm:block" />
                  <Skeleton className="h-6 w-14 rounded-full hidden md:block" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-2xl border-0 shadow-sm bg-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold">{t("USER_MANAGEMENT")}</CardTitle>
            <CardDescription className="mt-1">
              {t("USER_MANAGEMENT_TEXT")}
              <span className="hidden sm:inline lowercase">
                {" "}
                &middot; {users.length} {users.length > 1 ? t("ACTIVE_USERS") : t("ACTIVE_USER")}
                {(invites?.length ?? 0) > 0
                  ? `, ${invites?.length} ${(invites?.length ?? 0) > 1 ? t("PENDING_S") : t("PENDING")}`
                  : ""}
              </span>
            </CardDescription>
          </div>
          {account?.actions?.manage && (
            <InviteMemberButton
              mutate={() => setLoadCounter((prev) => prev + 1)}
              type="accounts"
              id={account.id}
            />
          )}
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 px-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                <Users className="size-7 text-muted-foreground" />
              </div>
              <p className="mt-4 text-base font-semibold text-foreground">{t("NO_MEMBERS_YET")}</p>
              <p className="mt-1 mb-2 text-sm text-muted-foreground text-center max-w-xs">
                {t("NO_MEMBERS_YET_TEXT")}
              </p>
              {account?.actions?.manage && (
                <InviteMemberButton
                  mutate={() => setLoadCounter((prev) => prev + 1)}
                  id={account?.id}
                  type="accounts"
                />
              )}
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[260px]">{t("USER")}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t("ROLE")}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("STATUS")}</TableHead>

                    <TableHead className="w-[60px]">
                      {account.actions?.manage && <span className="sr-only">{t("ACTIONS")}</span>}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((accountUser) => {
                    const initials = getUserInitials(accountUser.name);
                    const colorIdx = getUserColor(accountUser.name);
                    const isOwner = accountUser.sharedRole?.code === "creator";
                    const status = statusConfig["active"];

                    return (
                      <TableRow key={accountUser.username} className="group">
                        {/* Avatar + Name + Username */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex size-10 items-center justify-center rounded-full text-xs font-bold ring-2 shrink-0 transition-shadow group-hover:ring-[3px]",
                                colorIdx
                              )}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate">{accountUser.name}</p>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {accountUser.username}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                              accountUser.sharedRole?.code === "creator"
                                ? "bg-accent/15 text-accent"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {accountUser.sharedRole?.name}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn("size-1.5 rounded-full shrink-0", status.dotColor)}
                            />
                            <span
                              className={cn("text-xs font-medium capitalize", status.textClass)}
                            >
                              {status.label}
                            </span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          {accountUser.id == user.id ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 opacity-50 border-dashed"
                            >
                              {t("YOU")}
                            </Badge>
                          ) : !isOwner && account?.actions?.manage ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <EllipsisVertical />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedId(accountUser.id);
                                    setChageRole(true);
                                  }}
                                >
                                  {t("CHANGE_ROLE")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => {
                                    setSelectedId(accountUser.id);
                                    setRemoveMember(true);
                                  }}
                                >
                                  {t("REMOVE_MEMBER")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <></>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {invites?.map((accountUser) => {
                    const initials = getUserInitials(accountUser.name);
                    const colorIdx = getUserColor(accountUser.name);
                    const status = statusConfig["invited"];

                    return (
                      <TableRow key={accountUser.username} className="group">
                        {/* Avatar + Name + Username */}
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "flex size-10 items-center justify-center rounded-full text-xs font-bold ring-2 shrink-0 transition-shadow group-hover:ring-[3px]",
                                colorIdx
                              )}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate">{accountUser.name}</p>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {accountUser.username}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Role */}
                        <TableCell className="hidden sm:table-cell">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                              accountUser.sharedRole?.code === "creator"
                                ? "bg-accent/15 text-accent"
                                : "bg-secondary text-secondary-foreground"
                            )}
                          >
                            {accountUser.sharedRole?.name}
                          </span>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={cn("size-1.5 rounded-full shrink-0", status.dotColor)}
                            />
                            <span className={cn("text-xs font-medium", status.textClass)}>
                              {status.label}
                            </span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell>
                          {account?.actions?.manage ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <EllipsisVertical />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={async () => {
                                    const res = await handleCancel(account.id, accountUser.id);

                                    toast({ description: res.message });
                                  }}
                                >
                                  {t("CANCEL_INVITE")}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <></>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Summary footer */}
          {users.length > 0 && (
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                {users.length} {users.length > 1 ? t("ACTIVE_USERS") : t("ACTIVE_USER")}
              </span>
              {(invites?.length ?? 0) > 0 && (
                <>
                  <span className="size-1 rounded-full bg-border" />
                  <span className="lowercase">
                    {invites?.length} {(invites?.length ?? 0) > 1 ? t("PENDING_S") : t("PENDING")}
                  </span>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <ChangeMemberRoleDialog
        id={account?.id}
        type="accounts"
        userId={selectedId}
        isOpen={changeRole}
        setIsOpen={setChageRole}
        mutate={() => setLoadCounter((prev) => prev + 1)}
      />

      <RemoveMemberDialog
        id={account.id}
        type="accounts"
        userId={selectedId}
        isOpen={removeMember}
        setIsOpen={setRemoveMember}
        mutate={() => setLoadCounter((prev) => prev + 1)}
      />
    </>
  );
}
