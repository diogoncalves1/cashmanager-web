import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../config";

type ColumnSearch = {
  value?: string;
  regex?: string;
};

type Column = {
  data?: string;
  name?: string;
  searchable?: string;
  orderable?: string;
  search?: ColumnSearch;
};

function parseColumns(searchParams: URLSearchParams): Column[] {
  const columns: Column[] = [];

  for (const [key, value] of searchParams.entries()) {
    const match = key.match(/^columns\[(\d+)\]\[(.+)\]$/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2];

    if (!columns[index]) columns[index] = {};

    if (field.startsWith("search[")) {
      const searchKey = field.match(/search\[(.+)\]/)?.[1] as keyof ColumnSearch;

      columns[index].search ??= {};
      columns[index].search![searchKey] = value;
    } else {
      (columns[index] as Record<string, string>)[field] = value;
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
    params.set("search[value]", url.searchParams.get("search") || "");

    if (sortParam) {
      const [columnName, direction] = sortParam.split(":");

      const columns = parseColumns(url.searchParams);
      const columnIndex = columns.findIndex((c) => c.data === columnName);

      if (columnIndex >= 0) {
        params.set("order[0][column]", String(columnIndex));
        params.set("order[0][dir]", direction);
      }
    }

    const urlApi = `${baseUrl}financial-goal-transactions?${params.toString()}`;

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
      stats: data.stats,
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

    const urlApi = `${baseUrl}financial-goal-transactions`;

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
