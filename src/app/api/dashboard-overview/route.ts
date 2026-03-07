import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../config";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const params = url.searchParams;

  const token = req.cookies.get("token")?.value;

  const res = await fetch(`${baseUrl}dashboard-overview?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
