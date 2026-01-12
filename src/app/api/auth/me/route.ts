import { cookies } from "next/headers";

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
  const res = await fetch(`${process.env.API_BACKEND_URL}me`, {
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
