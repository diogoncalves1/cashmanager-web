import { NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });

  const { token, newPassword, confirmPassword } = await req.json();

  if (!token) return Response.json({ success: false });

  const res = await fetch(`${baseUrl}reset-change-password`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      password: newPassword,
      password_confirmation: confirmPassword,
    }),
  });

  const data = await res.json();

  if (!res.ok)
    return NextResponse.json(
      { error: data.message || "Change password failed", success: false },
      { status: 401 }
    );

  return response;
}
