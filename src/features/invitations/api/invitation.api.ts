import { InvitationSummary, InvitationType } from "@/features/invitations";
import { ResponseData } from "@/shared/api/api-client";

export async function onCancelInvite(
  id: string,
  userId: string,
  type: InvitationType,
  mutate?: () => void
) {
  const res = await fetch(`/api/${type}/${id}/invite/${userId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) await mutate();
  return data;
}

export async function onAcceptInvite(id: string, type: InvitationType, mutate?: () => void) {
  const res = await fetch(`/api/${type}/${id}/accept`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) await mutate();

  return data;
}

export async function onRevokeInvite(id: string, type: InvitationType, mutate?: () => void) {
  const res = await fetch(`/api/${type}/${id}/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) await mutate();

  return data;
}

export async function onRemoveMember(
  id: string,
  type: InvitationType,
  userId: string,
  mutate?: () => void
) {
  const res = await fetch(`/api/${type}/${id}/revoke-user/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) await mutate();

  return data;
}

export async function onLeaveSuject(id: string, type: InvitationType, mutate?: () => void) {
  const res = await fetch(`/api/${type}/${id}/leave`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) await mutate();

  return data;
}

export async function getInvitationStats(
  type: InvitationType
): Promise<ResponseData<InvitationSummary>> {
  const res = await fetch(`/api/${type}/invitations-stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch stats");

  const response = await res.json();
  return response;
}
