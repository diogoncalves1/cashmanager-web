import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, remember } = body;

  const res = await fetch(`${baseUrl}login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message || "Login failed" }, { status: 401 });
  }

  const cookieStore = await cookies();

  cookieStore.set("NEXT_LOCALE", data.user.preferences.lang);

  cookieStore.set({
    name: "token",
    value: data.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 365 : 60 * 60 * 24,
  });

  return NextResponse.json({ user: data.user });
}
