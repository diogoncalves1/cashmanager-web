import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { baseUrl } from "../../config";

export async function POST(req: Request) {
  const { email, password, remember } = await req.json();

  if (!baseUrl) {
    return NextResponse.json(
      { error: "API_BACKEND_URL não definido no ambiente" },
      { status: 500 }
    );
  }

  const res = await fetch(`${baseUrl}login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message || "Login failed" }, { status: res.status });
  }

  const response = NextResponse.json({ success: true }, { status: res.status });

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

  response.cookies.set("user", JSON.stringify(data.user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: remember ? 60 * 60 * 24 * 365 : 60 * 60 * 24,
  });

  return response;
}
