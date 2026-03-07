import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../../config";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const length = Number(url.searchParams.get("size") || 10);

    const params = new URLSearchParams(url.search);
    params.set("start", ((page - 1) * length).toString());
    params.set("length", length.toString());
    params.set("search[value]", url.searchParams.get("search") || "");

    const urlApi = `${baseUrl}friendship-requests/received?${params.toString()}`;
    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`External API error: ${res.status}`);
    const data = await res.json();
    return NextResponse.json({
      data: data.data,
      nextPage: data.recordsTotal > page * length ? page + 1 : null,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
