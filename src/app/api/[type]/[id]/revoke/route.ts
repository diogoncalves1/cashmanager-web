import { baseUrl } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";

type InviteType = "debts" | "financial-goals" | "accounts";

function isInviteType(value: string): value is InviteType {
  return ["debts", "financial-goals", "accounts"].includes(value);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;

    const { type, id } = await context.params;

    if (!isInviteType(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const urlApi = `${baseUrl}${type}/${id}/revoke`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      method: "POST",
    });
    const data = await res.json();

    if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
