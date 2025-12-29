import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  const token = req.cookies.get("token")?.value;

  const res = await fetch("http://127.0.0.1:8000/api/v1/dashboard-overview", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}