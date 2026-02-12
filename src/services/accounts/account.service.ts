import { AccountBasic } from "@/models/account";

interface ApiResponse<T> {
  data: T;
}

export async function getAllAccounts(): Promise<ApiResponse<AccountBasic[]>> {
  const res = await fetch(`/api/accounts/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch financial goals");

  const response = await res.json();
  return response;
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

export async function getInvitationStats(): Promise<ApiResponseInvitationStats> {
  const res = await fetch(`/api/accounts/invitations-stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch accounts stats");

  const response = await res.json();
  return response;
}
