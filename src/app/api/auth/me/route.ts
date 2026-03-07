import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  if (!token) return Response.json({ user: null });

  // 1️⃣ tenta pegar do cookie
  const cachedUser = cookieStore.get("user")?.value;
  if (cachedUser) {
    return Response.json({
      token,
      user: cachedUser,
      cached: true,
    });
  }

  // 2️⃣ fallback para backend
  const res = await fetch(`${baseUrl}me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) return Response.json({ user: null }, { status: 401 });

  const { data: user } = await res.json();

  cookieStore.set("NEXT_LOCALE", user.preferences.lang);

  cookieStore.set({
    name: "user",
    value: JSON.stringify(user),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 5, // 5 minutos
  });

  return Response.json({ token, user, cached: false });
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const { lang, currency_id, name, email, username } = await req.json();
  const token = req.cookies.get("token")?.value;

  const res = await fetch(`${baseUrl}me`, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    method: "PUT",
    body: JSON.stringify({ email, currency_id, lang, name, username }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message || "Login failed" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, message: data.message });

  cookieStore.set("NEXT_LOCALE", lang);

  response.cookies.set("user", JSON.stringify(data.data), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
