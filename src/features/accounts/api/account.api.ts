import { Account, ApiResponse, AccountFiltersType, AccountBasic } from "@/features/accounts";
import { ResponseData } from "@/shared/api/api-client";
import { buildUrl } from "@/shared/utils";

export async function getAllAccounts(filters: AccountFiltersType): Promise<ApiResponse<Account>> {
  const url = buildUrl("/api/accounts", { ...filters });

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch accounts");

  const response = await res.json();
  return response;
}

export async function onDeleteAccount(
  id: string,
  mutate?: () => void
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`/api/accounts/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  if (mutate) mutate();

  return data;
}

export async function getAccountsBasic(): Promise<ResponseData<AccountBasic[]>> {
  const res = await fetch(`/api/accounts/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();

  return response;
}
