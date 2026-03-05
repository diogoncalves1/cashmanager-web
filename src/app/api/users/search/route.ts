import { NextRequest, NextResponse } from "next/server";
import { baseUrl } from "../../config";

type ColumnSearch = {
  value?: string;
  regex?: string;
};

type Column = {
  data?: string;
  name?: string;
  searchable?: boolean;
  orderable?: string;
  search?: ColumnSearch;
};

function parseColumns(searchParams: URLSearchParams) {
  const defaultColumns = [{ data: "username", searchable: true }];

  const columns: Column[] = [...defaultColumns];

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

function addColumnsToParams(columns: Column[], searchParams: URLSearchParams) {
  columns.forEach((col, index) => {
    (Object.keys(col) as Array<keyof Column>).forEach((key) => {
      const value = col[key];

      if (key === "search" && value && typeof value === "object") {
        (Object.keys(value) as Array<keyof ColumnSearch>).forEach((searchKey) => {
          const searchValue = value[searchKey];
          if (searchValue !== undefined) {
            searchParams.append(`columns[${index}][search][${searchKey}]`, String(searchValue));
          }
        });
      } else if (value !== undefined) {
        searchParams.append(`columns[${index}][${key}]`, String(value));
      }
    });
  });

  return searchParams;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") || 1);
    const length = Number(url.searchParams.get("pageSize") || 10);

    const params = new URLSearchParams(url.search);
    addColumnsToParams(parseColumns(url.searchParams), params);
    params.set("start", ((page - 1) * length).toString());
    params.set("length", length.toString());

    const sortParam = url.searchParams.get("sort");
    const searchParam = url.searchParams.get("search");

    if (searchParam) params.set("search[value]", String(searchParam));

    const columns = parseColumns(url.searchParams);
    if (sortParam) {
      const columnIndex = columns.findIndex((c) => c.data === sortParam);
      if (columnIndex >= 0) {
        params.set("order[0][column]", String(columnIndex));
        params.set("order[0][dir]", "desc");
      }
    }

    const res = await fetch(`${baseUrl}users/search?${params.toString()}`, {
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
