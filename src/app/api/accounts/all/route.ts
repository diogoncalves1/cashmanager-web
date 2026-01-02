// /app/api/accounts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const urlApi = `${baseUrl}accounts/all`;

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

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const body = await req.json();

    const urlApi = `${baseUrl}accounts`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
