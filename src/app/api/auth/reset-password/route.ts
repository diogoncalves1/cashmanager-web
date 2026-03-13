import { NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });

  const { email } = await req.json();

  if (!email) return Response.json({ success: false });

  const res = await fetch(`${baseUrl}reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json(
      { error: data.message || "Reset failed", success: false },
      { status: 401 }
    );

  return response;
}
