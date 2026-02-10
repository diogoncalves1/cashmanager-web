import { Mail, Send } from "lucide-react";
import type { InvitationDirection } from "@/models/invitation";

interface InvitationEmptyProps {
  direction: InvitationDirection;
}

export function InvitationEmpty({ direction }: InvitationEmptyProps) {
  const Icon = direction === "sent" ? Send : Mail;

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary mb-4">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">
        {direction === "sent" ? "No invitations sent" : "No invitations received"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        {direction === "sent"
          ? 'You haven\'t sent any invitations yet. Click "Send Invitation" to invite someone to collaborate.'
          : "You don't have any incoming invitations at the moment. Check back later."}
      </p>
    </div>
  );
}
