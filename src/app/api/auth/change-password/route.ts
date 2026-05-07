import { NextResponse } from "next/server";
import { serverApiClient } from "@/lib/api/api-client.server";

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });

  const { currentPassword, newPassword, confirmPassword } = await req.json();

  const res = await serverApiClient.post("change-password", {
    password: newPassword,
    password_confirmation: confirmPassword,
    current_password: currentPassword,
  });

  if (!res.success)
    return NextResponse.json(
      { error: res.message || "Change password failed", success: false },
      { status: 401 }
    );

  return response;
}
