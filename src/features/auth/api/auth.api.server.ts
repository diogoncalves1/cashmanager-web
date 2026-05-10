import { serverApiClient } from "@/lib/api/api-client.server";
import { User } from "@/types/user";

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
