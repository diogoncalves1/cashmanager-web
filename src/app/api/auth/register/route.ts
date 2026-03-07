import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { baseUrl } from "../../config";

export async function POST(req: Request) {
  const { email, password, name, username } = await req.json();

  const res = await fetch(`${baseUrl}register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, username }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message || "Login failed" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });

  const cookieStore = await cookies();

  cookieStore.set("NEXT_LOCALE", data.user.preferences.lang);

  cookieStore.set({
    name: "token",
    value: data.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  response.cookies.set("user", JSON.stringify(data.user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
