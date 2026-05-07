import { Mail, Send } from "lucide-react";
import type { InvitationDirection } from "@/types/invitation";
import { useTranslations } from "next-intl";

interface InvitationEmptyProps {
  direction: InvitationDirection;
}

export function InvitationEmpty({ direction }: InvitationEmptyProps) {
  const Icon = direction === "sent" ? Send : Mail;

  const t = useTranslations("INVITE_MEMBER");

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary mb-4">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-1">
        {direction === "sent" ? t("NO_INVITATIONS_SENT") : t("NO_INVITATIONS_RECEIVED")}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
        {direction === "sent" ? t("NO_INVITATIONS_SENT_TEXT") : t("NO_INVITATIONS_RECEIVED_TEXT")}
      </p>
    </div>
  );
}
