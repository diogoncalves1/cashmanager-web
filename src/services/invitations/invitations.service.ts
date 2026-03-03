import { InvitationType } from "@/models/invitation";
import { useTranslations } from "next-intl";

export async function onCancelInvite(
  id: string,
  userId: string,
  type: InvitationType,
  t: ReturnType<typeof useTranslations>,
  mutate?: () => void
) {
  try {
    const res = await fetch(`/api/${type}/${id}/invite/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();
    return { message: data.message, success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, success: false };
    }
    return { message: String(err), success: false };
  }
}

export async function onAcceptInvite(id: string, type: InvitationType, mutate?: () => void) {
  try {
    const res = await fetch(`/api/${type}/${id}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    return { message: data.message, success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, success: false };
    }
    return { message: String(err), success: false };
  }
}

export async function onRevokeInvite(id: string, type: InvitationType, mutate?: () => void) {
  try {
    const res = await fetch(`/api/${type}/${id}/revoke`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    return { message: data.message, success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, success: false };
    }
    return { message: String(err), success: false };
  }
}

export async function onRemoveMember(
  id: string,
  type: InvitationType,
  userId: string,
  mutate?: () => void
) {
  try {
    const res = await fetch(`/api/${type}/${id}/revoke-user/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    if (data.success) {
      return { message: data.message, success: true };
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, success: true };
    }
    return { message: String(err), success: true };
  }
}

export async function onLeaveSuject(id: string, type: InvitationType, mutate?: () => void) {
  try {
    const res = await fetch(`/api/${type}/${id}/leave`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    if (mutate) await mutate();

    return { message: data.message, success: true };
  } catch (err: unknown) {
    if (err instanceof Error) {
      return { message: err.message, icon: true };
    }
    return { message: String(err), icon: true };
  }
}

type Summary = {
  sentInvites: number;
  receivedInvites: number;
  pendingInvites: number;
  awaitingInvites: number;
};

interface ApiResponseInvitationStats {
  data: Summary;
  success: number;
  message: number;
}

export async function getInvitationStats(
  type: "accounts" | "debts" | "financial-goals"
): Promise<ApiResponseInvitationStats> {
  const res = await fetch(`/api/${type}/invitations-stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch stats");

  const response = await res.json();
  return response;
}
