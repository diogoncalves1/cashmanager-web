import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    await serverApiClient.post("logout");

    const response = NextResponse.json({ ok: true });

    cookieStore.delete("user");
    cookieStore.delete("token");

    return response;
  } catch (err) {
    return NextResponse.json({ error: "Login failed" }, { status: 401 });
  }
}
