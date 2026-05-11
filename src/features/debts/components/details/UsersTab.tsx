"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Debt, useDebtDetailsContext } from "@/features/debts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/shared/utils";
import {
  InviteMemberButton,
  ChangeMemberRoleDialog,
  RemoveMemberDialog,
} from "@/features/invitations";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useAuth } from "@/features/auth";

export function UsersTab({ debt }: { debt: Debt }) {
  const t = useTranslations("DEBTS");
  const { setLoadCounter } = useDebtDetailsContext();
  const { user: userSelf } = useAuth();

  const [removeMember, setRemoveMember] = useState(false);
  const [changeRole, setChageRole] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  return (
    <div>
      <TabsContent value="users" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">{t("ASSOCIATED_USERS")}</h2>
          <InviteMemberButton type="debts" id={debt.id} />
        </div>

        <div className="rounded-xl border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground font-medium">{t("USER")}</TableHead>
                <TableHead className="text-muted-foreground font-medium">{t("ROLE")}</TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  {t("CONTRIBUTION")}
                </TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {debt.users.map((user) => (
                <TableRow key={user.id} className="border-border hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                        user.sharedRole?.code === "creator"
                          ? "bg-accent/15 text-accent"
                          : "bg-secondary text-secondary-foreground"
                      )}
                    >
                      {user.sharedRole?.name}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{user.paid}</TableCell>
                  <TableCell>
                    {user.sharedRole?.code !== "creator" && user.id != userSelf?.id && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                              />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 bg-card border-border">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedId(user.id);
                            }}
                            className="cursor-pointer"
                          >
                            {t("CHANGE_ROLE")}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedId(user.id);
                            }}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            {t("REMOVE_USER")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <ChangeMemberRoleDialog
        id={debt?.id}
        type="debts"
        userId={selectedId}
        isOpen={changeRole}
        setIsOpen={setChageRole}
        mutate={() => setLoadCounter((prev) => prev + 1)}
      />

      <RemoveMemberDialog
        id={debt.id}
        type="debts"
        userId={selectedId}
        isOpen={removeMember}
        setIsOpen={setRemoveMember}
        mutate={() => setLoadCounter((prev) => prev + 1)}
      />
    </div>
  );
}
