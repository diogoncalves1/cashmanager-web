import { NextResponse, NextRequest } from "next/server";
import { baseUrl } from "../config";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const res = await fetch(`${baseUrl}currencies`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
