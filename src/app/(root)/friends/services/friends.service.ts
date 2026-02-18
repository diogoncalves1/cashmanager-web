interface ApiResponse<T> {
  data: T;
  recordsFiltered: number;
  page: number;
  pageSize: number;
}

interface Stats {
  friends: number;
  received: number;
  sent: number;
  blocked: number;
}

export async function getFriendsStats(): Promise<ApiResponse<Stats>> {
  const res = await fetch(`/api/friends/stats`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch friend stats");

  const response = await res.json();
  return response;
}
