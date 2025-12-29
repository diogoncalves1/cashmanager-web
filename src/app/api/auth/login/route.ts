import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const res = await fetch("http://127.0.0.1:8000/api/v1/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: data.message || "Login failed" }, { status: 401 });
  }

  (await cookies()).set({
    name: "token",
    value: data.token,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return NextResponse.json(
    { user: data.user },
    {
      headers: {
        "Set-Cookie": `token=${data.token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Lax`,
      },
    }
  );
}
