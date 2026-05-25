// lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_BACKEND_URL;

export type ResponseData<T, M = unknown> = {
  data: T;
  message: string;
  success: boolean;
  errors: unknown;
  meta?: M;
  recordsTotal?: number;
  recordsFiltered?: number;
};

export type FetcherOptions = RequestInit & {
  revalidate?: number;
};

export async function request<T>(
  endpoint: string,
  token: string | undefined,
  options: FetcherOptions = {}
): Promise<ResponseData<T>> {
  if (!API_URL) throw new Error("NEXT_PUBLIC_API_BACKEND_URL is not defined");

  const { revalidate, headers, ...rest } = options;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    next: revalidate ? { revalidate } : undefined,
  });

  if (res.status === 401) throw new Error("UNAUTHORIZED");

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.message ?? `API error: ${res.status}`);
  }

  return res.json();
}
