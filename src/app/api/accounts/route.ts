// /app/api/accounts/route.ts

import { NextRequest, NextResponse } from "next/server";

function parseColumns(searchParams: URLSearchParams) {
  const defaultColumns = [
    { data: "name", searchable: true },
    { data: "status", searchable: true, orderable: true },
    { data: "type", searchable: true, orderable: true },
    { data: "balance", searchable: true, orderable: true },
  ];

  const columns: {
    data?: string;
    name?: string;
    searchable?: boolean | string;
    orderable?: boolean | string;
    search?: {
      value?: string;
      regex?: string;
    };
  }[] = [...defaultColumns];

  for (const [key, value] of searchParams.entries()) {
    const match = key.match(/^columns\[(\d+)\]\[(.+)\]$/);
    if (!match) continue;

    const index = Number(match[1]);
    const field = match[2] as "search" | "name" | "searchable" | "orderable" | "data";

    if (!columns[index]) columns[index] = {};

    // trata search[value] e search[regex]
    if (field.startsWith("search[")) {
      const searchKey = field.match(/search\[(.+)\]/)?.[1] as "value" | "regex";
      columns[index].search ??= {};
      columns[index].search[searchKey!] = value;
    } else {
      columns[index][field] = value;
    }
  }

  // retorna o array filtrando posições vazias (undefined)
  return columns.filter(Boolean);
}

function addColumnsToParams(
  columns: {
    data?: string;
    name?: string;
    searchable?: boolean | string;
    orderable?: boolean | string;
    search?: {
      value?: string;
      regex?: string;
    };
  }[],
  searchParams: URLSearchParams
) {
  columns.forEach((col, index) => {
    for (const key in col) {
      const value = col[key];

      if (key === "search" && typeof value === "object") {
        // Trata search[value], search[regex] etc
        for (const searchKey in value) {
          searchParams.append(`columns[${index}][search][${searchKey}]`, value[searchKey]);
        }
      } else {
        searchParams.append(`columns[${index}][${key}]`, value);
      }
    }
  });

  return searchParams;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const length = Number(url.searchParams.get("pageSize") || 10);
    const start = page * length;

    const params = new URLSearchParams(url.search);
    addColumnsToParams(parseColumns(url.searchParams), params);
    params.set("start", start.toString());
    params.set("length", length.toString());

    const sortParam = url.searchParams.get("sort");
    const sortOrderParam = url.searchParams.get("sortOrder");
    const searchParam = url.searchParams.get("search");

    if (searchParam) params.set("search[value]", String(searchParam));

    const columns = parseColumns(url.searchParams);
    if (sortParam) {
      const columnIndex = columns.findIndex((c) => c.data === sortParam);
      if (columnIndex >= 0) {
        params.set("order[0][column]", String(columnIndex));
        params.set("order[0][dir]", sortOrderParam as "desc" | "asc");
      }
    }

    const res = await fetch(`${process.env.API_BACKEND_URL}accounts?${params.toString()}`, {
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
