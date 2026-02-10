"use client";

import { useState } from "react";
import InviteMemberDialog from "@/components/invitations/InviteMemberDialog";
import { Button } from "@/components/ui/button";
import { LucideUserPlus2 } from "lucide-react";

type InviteType = "debts" | "financial-goals" | "accounts";

const InviteMemberButton = ({
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
          <span className="hidden sm:inline">Invite</span>
        </Button>
      ) : (
        <Button size="sm" onClick={() => setIsInviteOpen(true)}>
          <LucideUserPlus2 className="w-4 h-4 mr-2" />
          Invite Member
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

export default InviteMemberButton;
