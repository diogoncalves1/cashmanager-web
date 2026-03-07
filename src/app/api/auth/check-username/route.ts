import { NextResponse, NextRequest } from "next/server";
import { baseUrl } from "../../config";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);

    const username = url.searchParams.get("username");

    const res = await fetch(`${baseUrl}check-username?username=${username}`);

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
