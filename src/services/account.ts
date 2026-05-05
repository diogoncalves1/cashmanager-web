import { AccountBasic } from "@/types/account";
import { ResponseData } from "@/lib/api/api-client";

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

export async function getAllAccounts(): Promise<ResponseData<AccountBasic[]>> {
  const res = await fetch(`/api/accounts/all`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const response = await res.json();

  return response;
}
