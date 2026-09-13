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
import { cn } from "@/shared/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserContribution } from "@/features/financial-goals";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { ChangeMemberRoleDialog, RemoveMemberDialog } from "@/features/invitations";
import { useAuth } from "@/features/auth";
import { useTranslations } from "next-intl";

type Props = {
  users?: UserContribution[];
  id: string;
  setLoad: React.Dispatch<boolean>;
};

export const UsersTable = ({ users, id, setLoad }: Props) => {
  const t = useTranslations("FINANCIAL_GOALS");
  const [removeMember, setRemoveMember] = useState(false);
  const [changeRole, setChageRole] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const { user: userSelf } = useAuth();

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800/60">
      <div className="flex flex-col justify-between gap-4 border-b border-border/60 p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("CONTRIBUTORS")}</h2>
          <p className="text-sm text-muted-foreground lowercase">
            {users?.length} {(users?.length ?? 0) > 1 ? t("USERS") : t("USER")}
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("MEMBER")}</TableHead>
              <TableHead>{t("ROLE")}</TableHead>
              <TableHead>{t("CONTRIBUTIONS")}</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex min-w-40 items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-secondary text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium capitalize",
                      user.sharedRole?.code === "creator"
                        ? "bg-accent/10 text-accent"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {user.sharedRole?.name}
                  </span>
                </TableCell>
                <TableCell className="font-medium text-accent">{user.contribution}</TableCell>
                <TableCell>
                  {user.sharedRole?.code !== "creator" && user.id != userSelf?.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="app" size="icon" className="size-8">
                          <EllipsisVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedId(user.id);
                            setChageRole(true);
                          }}
                        >
                          {t("CHANGE_ROLE")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setSelectedId(user.id);
                            setRemoveMember(true);
                          }}
                        >
                          {t("REMOVE_MEMBER")}
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

      <ChangeMemberRoleDialog
        id={id}
        type="financial-goals"
        userId={selectedId}
        isOpen={changeRole}
        setIsOpen={setChageRole}
        mutate={() => setLoad(true)}
      />

      <RemoveMemberDialog
        id={id}
        type="financial-goals"
        userId={selectedId}
        isOpen={removeMember}
        setIsOpen={setRemoveMember}
        mutate={() => setLoad(true)}
      />
    </div>
  );
};
