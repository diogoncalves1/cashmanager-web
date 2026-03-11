import { NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });

  const { token } = await req.json();

  if (!token) return Response.json({ success: false });

  const res = await fetch(`${baseUrl}verify-email`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json(
      { error: data.message || "Login failed", success: false },
      { status: 401 }
    );

  return response;
}
