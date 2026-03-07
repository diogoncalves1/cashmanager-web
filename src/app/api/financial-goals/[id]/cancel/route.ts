import { baseUrl } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;

    const { id } = await context.params;

    const urlApi = `${baseUrl}financial-goals/${id}/cancel`;

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
