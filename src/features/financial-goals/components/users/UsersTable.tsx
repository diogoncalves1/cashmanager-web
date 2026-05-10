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
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserContribution } from "@/features/financial-goals/types";
import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import ChangeMemberRoleDialog from "@/features/invitations/components/dialogs/ChangeMemberRoleDialog";
import RemoveMemberDialog from "@/features/invitations/components/dialogs/RemoveMemberDialog";
import InviteMemberButton from "@/features/invitations/components/actions/InviteMemberButton";
import { useAuth } from "@/features/auth";
import { useTranslations } from "next-intl";

type Props = {
  users?: UserContribution[];
  id: string;
  setLoad: React.Dispatch<boolean>;
};

const UsersTable = ({ users, id, setLoad }: Props) => {
  const t = useTranslations("FINANCIAL_GOALS");
  const [removeMember, setRemoveMember] = useState(false);
  const [changeRole, setChageRole] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const { user: userSelf } = useAuth();

  return (
    <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
      <div className="p-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{t("CONTRIBUTORS")}</h2>
          <p className="text-sm text-muted-foreground lowercase">
            {users?.length} {(users?.length ?? 0) > 1 ? t("USERS") : t("USER")}
          </p>
        </div>

        <InviteMemberButton type="financial-goals" id={id} />
      </div>
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
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-secondary">
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
                    "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                    user.sharedRole?.code === "creator"
                      ? "bg-accent/15 text-accent"
                      : "bg-secondary text-secondary-foreground"
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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

export default UsersTable;
