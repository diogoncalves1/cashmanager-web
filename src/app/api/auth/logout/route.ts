import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const response = NextResponse.json({ ok: true });

  const token = cookieStore.get("token")?.value;
  cookieStore.delete("user");
  cookieStore.delete("token");

  if (!token) return Response.json({ user: null });

  const res = await fetch(`${process.env.API_BACKEND_URL}logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) return NextResponse.json({ error: data.message || "Login failed" }, { status: 401 });

  return response;
}
