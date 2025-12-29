import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../config";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const res = await fetch(baseUrl + "portfolios", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
