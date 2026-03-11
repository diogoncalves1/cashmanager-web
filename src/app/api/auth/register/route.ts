import { NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function POST(req: Request) {
  const { email, password, name, username } = await req.json();

  const res = await fetch(`${baseUrl}register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, username }),
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    return NextResponse.json(
      { error: data.message || "Login failed", success: false },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ success: true });

  return response;
}
