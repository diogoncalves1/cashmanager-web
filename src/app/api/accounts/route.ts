// /app/api/accounts/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const length = Number(url.searchParams.get("size") || 10);
    const start = page * length;

    const params = new URLSearchParams(url.search);
    params.set("start", start.toString());
    params.set("length", length.toString());

    const sortParam = url.searchParams.get("sort");

    if (sortParam) {
      const [columnName, direction] = sortParam.split(":");

      params.set("order[0][column]", "0"); // índice da coluna (precisa estar no mesmo índice do columns[])
      params.set("order[0][dir]", direction);

      params.set("columns[0][data]", columnName);
    }

    // let filterIndex = 0;

    // url.searchParams.forEach((value, key) => {
    //   if (!["page", "size", "sort"].includes(key)) {
    //     params.set(`columns[${filterIndex}][data]`, key);
    //     params.set(`columns[${filterIndex}][search][value]`, value);
    //     filterIndex++;
    //   }
    // });

    const urlApi = "http://127.0.0.1:8000/api/v1/accounts?" + params;
    const res = await fetch(urlApi, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`External API error: ${res.status}`);
    const data = await res.json();
    return NextResponse.json({
      page,
      length,
      recordsTotal: data.recordsTotal,
      recordsFiltered: data.recordsFiltered,
      data: data.data,
      url,
      params,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const body = await req.json();

    const urlApi = "http://127.0.0.1:8000/api/v1/accounts";

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
