import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const token = req.cookies.get("token")?.value;

    const urlApi = `${baseUrl}debts/${id}`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error("");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;

    const { id } = await context.params;

    const body = await req.json();

    const urlApi = `${baseUrl}debts/${id}`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      method: "PUT",
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get("token")?.value;

    const { id } = await context.params;

    if (!id) throw new Error("Id invalido");

    const urlApi = `${baseUrl}debts/${id}`;
    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}` },
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });

    return NextResponse.json(data);
  } catch (err) {
    console.error("API Error:", err);
  }
}
