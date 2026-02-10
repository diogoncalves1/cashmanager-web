import { baseUrl } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";

type InviteType = "debts" | "financial-goals" | "accounts";
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; type: InviteType } }
) {
  try {
    const token = req.cookies.get("token")?.value;

    const id = params.id;
    const type = params.type;

    const urlApi = `${baseUrl}${type}/${id}/accept`;

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
