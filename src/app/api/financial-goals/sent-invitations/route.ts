import { baseUrl } from "@/app/api/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const length = Number(url.searchParams.get("size") || 10);

    const paramsURL = new URLSearchParams(url.search);
    paramsURL.set("start", ((page - 1) * length).toString());
    paramsURL.set("length", length.toString());
    paramsURL.set("status", url.searchParams.get("status") ?? "");

    const urlApi = `${baseUrl}financial-goals/sent-invitations?${paramsURL.toString()}`;

    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      method: "GET",
    });
    const data = await res.json();

    if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });

    return NextResponse.json({
      data: data.data,
      nextPage: data.recordsTotal > page * length ? page + 1 : null,
    });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
