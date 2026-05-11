"use client";

import { useState } from "react";
import { InviteMemberDialog } from "@/features/invitations";
import { Button } from "@/components/ui/button";
import { LucideUserPlus2 } from "lucide-react";
import { useTranslations } from "next-intl";

type InviteType = "debts" | "financial-goals" | "accounts";

export const InviteMemberButton = ({
  type,
  id,
  isLigth = false,
  mutate,
}: {
  type: InviteType;
  id?: string;
  isLigth?: boolean;
  mutate?: () => void;
}) => {
  const t = useTranslations("INVITE_MEMBER");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div>
      {isLigth ? (
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent"
          onClick={() => setIsInviteOpen(true)}
        >
          <LucideUserPlus2 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t("INVITE")}</span>
        </Button>
      ) : (
        <Button size="sm" onClick={() => setIsInviteOpen(true)}>
          <LucideUserPlus2 className="w-4 h-4 mr-2" />
          {t("INVITE_MEMBER")}
        </Button>
      )}

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        isInviteOpen={isInviteOpen}
        setIsInviteOpen={setIsInviteOpen}
        type={type}
        id={id}
        mutate={mutate}
      />
    </div>
  );
};
