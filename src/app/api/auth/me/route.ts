import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) return Response.json({ user: null });

  const res = await fetch(`${process.env.API_BACKEND_URL}me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  const user = data.data;

  cookieStore.set("NEXT_LOCALE", user.preferences.lang);

  cookieStore.set({
    name: "user",
    value: user,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return Response.json({ token, user });
}
