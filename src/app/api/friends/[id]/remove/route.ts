import { baseUrl } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;

    const { id } = await context.params;

    const urlApi = `${baseUrl}friendships/${id}/remove`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      method: "DELETE",
    });
    const data = await res.json();

    if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
