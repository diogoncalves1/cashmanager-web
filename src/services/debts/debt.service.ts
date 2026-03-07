import { DebtBasic } from "@/models/debt";

interface ApiResponse<T> {
  data: T;
}

export async function getAllDebts(): Promise<ApiResponse<DebtBasic[]>> {
  const res = await fetch(`/api/debts/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debts");

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
  const res = await fetch(`/api/debts/invitations-stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch debts stats");

  const response = await res.json();
  return response;
}
