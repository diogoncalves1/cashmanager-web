import { NextRequest, NextResponse } from "next/server";

function parseColumns(searchParams: URLSearchParams) {
  const columns: any[] = [];

  for (const [key, value] of searchParams.entries()) {
    const match = key.match(/^columns\[(\d+)\]\[(.+)\]$/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!columns[index]) columns[index] = {};

    // trata search[value] e search[regex]
    if (field.startsWith("search[")) {
      const searchKey = field.match(/search\[(.+)\]/)?.[1];
      columns[index].search ??= {};
      columns[index].search[searchKey!] = value;
    } else {
      columns[index][field] = value;
    }
  }

  return columns.filter(Boolean);
}

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

      const columns = parseColumns(url.searchParams);
      const columnIndex = columns.findIndex((c) => c.data === columnName);

      if (columnIndex >= 0) {
        params.set("order[0][column]", String(columnIndex));
        params.set("order[0][dir]", direction);
      }
    }

    const urlApi = "http://127.0.0.1:8000/api/v1/transactions?" + params.toString();

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
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
