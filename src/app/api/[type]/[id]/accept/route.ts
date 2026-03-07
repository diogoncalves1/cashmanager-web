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
    const { type, id } = await context.params;

    const token = req.cookies.get("token")?.value;

    if (!isInviteType(type)) {
      return NextResponse.json({ message: "Invalid type" }, { status: 400 });
    }

    const urlApi = `${baseUrl}${type}/${id}/accept`;

    const res = await fetch(urlApi, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ message: data.message }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error " + String(err) }, { status: 500 });
  }
}
