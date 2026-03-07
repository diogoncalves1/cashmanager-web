import { baseUrl } from "../../../config";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;

    const { id } = await context.params;

    if (!id) throw new Error("Id invalido");

    const urlApi = `${baseUrl}friendship-requests/${id}/cancel`;
    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}` },
      method: "DELETE",
    });
    const data = await res.json();

    if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
