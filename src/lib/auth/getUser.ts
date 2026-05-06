import { User } from "@/types/user";
import { serverApiClient } from "../api/api-client.server";

export async function getUser(): Promise<User | null> {
  const res = await serverApiClient.get<User>("me");

  if (!res.success) return null;

  const user = res.data;

  return user;
}
