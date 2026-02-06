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
