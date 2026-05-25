"use client";

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notification.api";

const PAGE_SIZE = 20;

export function useNotifications() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", "feed"],
    queryFn: async () => {
      const res = await notificationApi.getFeed({ page: 0, limit: PAGE_SIZE });
      setHasMore(res.data.length === PAGE_SIZE);
      return res.data;
    },
  });

  const [extraNotifications, setExtraNotifications] = useState<typeof data>([]);

  const notifications = [...(data ?? []), ...(extraNotifications ?? [])];
  const countNotifications = notifications.filter((n) => !n.readAt).length;

  const loadMore = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const res = await notificationApi.getFeed({ page: page, limit: PAGE_SIZE });
      setExtraNotifications((prev) => [...(prev ?? []), ...res.data]);
      setPage(page + 1);
      setHasMore(res.data.length === PAGE_SIZE);
    } finally {
      setIsFetchingMore(false);
    }
  }, [hasMore, isFetchingMore, page]);

  const readAll = useCallback(async () => {
    await notificationApi.readAll();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    setExtraNotifications([]);
    setPage(1);
    setHasMore(true);
  }, [queryClient]);

  return {
    notifications,
    countNotifications,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMore,
    readAll,
  };
}
