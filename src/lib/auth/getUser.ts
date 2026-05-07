import { User } from "@/types/user";
import { serverApiClient } from "../api/api-client.server";

export async function getUser(): Promise<User | null> {
  try {
    const res = await serverApiClient.get<User>("me");

    if (!res.success) return null;

    const user = res.data;

    return user;
  } catch (err: unknown) {
    console.error(err);
    return null;
  }
}
