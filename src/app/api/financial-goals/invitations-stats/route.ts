import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const urlApi = `${baseUrl}financial-goals/invitations-stats`;

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
