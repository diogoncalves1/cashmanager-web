import { ResponseData } from "@/shared/api/api-client";
import { buildUrl } from "@/shared/utils";
import { Notification } from "../types";

export interface GetFeedParams {
  page?: number;
  limit?: number;
}

export interface GetFeedResponse {
  data: Notification[];
  total: number;
  page: number;
  totalPages: number;
}

export const notificationApi = {
  getFeed: async (params?: GetFeedParams): Promise<GetFeedResponse> => {
    const url = buildUrl("/api/notifications/feed", { limit: params?.limit, page: params?.page });

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch notifications");

    const response = await res.json();
    return response;
  },

  readAll: async (): Promise<ResponseData<Notification[]> & { meta: { count: number } }> => {
    const url = buildUrl("/api/notifications/read-all");

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to fetch notifications");

    const response = await res.json();
    return response;
  },
};
