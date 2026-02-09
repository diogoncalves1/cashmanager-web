"use client";

import { useState } from "react";
import InviteMemberDialog from "@/components/ui/dialogs/InviteMemberDialog";
import { Button } from "@/components/ui/button";

type InviteType = "debts" | "financial-goals" | "accounts";

const InviteMemberButton = ({
  type,
  id,
  isLigth = false,
}: {
  type: InviteType;
  id?: string;
  isLigth?: boolean;
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
          <svg className="w-4 h-4 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          <span className="hidden sm:inline">Invite</span>
        </Button>
      ) : (
        <Button size="sm" onClick={() => setIsInviteOpen(true)}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Invite Member
        </Button>
      )}

      {/* Invite Member Dialog */}
      <InviteMemberDialog
        isInviteOpen={isInviteOpen}
        setIsInviteOpen={setIsInviteOpen}
        type={type}
        id={id}
      />
    </div>
  );
};

export default InviteMemberButton;
