"use client";

import { useState, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "../api/notification.api";
import { Notification } from "../types";

const PAGE_SIZE = 20;

export function useNotifications() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [extraNotifications, setExtraNotifications] = useState<Notification[]>([]);

  const { data: feed = [], isLoading } = useQuery({
    queryKey: ["notifications", "feed"],
    queryFn: async () => {
      const res = await notificationApi.getFeed({ page: 0, limit: PAGE_SIZE });
      setHasMore(res.data.length === PAGE_SIZE);
      return res.data as Notification[];
    },
  });

  const notifications = [...feed, ...extraNotifications];
  const countNotifications = notifications.filter((n) => !n.readAt).length;

  const loadMore = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;

    setIsFetchingMore(true);
    try {
      const res = await notificationApi.getFeed({ page, limit: PAGE_SIZE });
      setExtraNotifications((prev) => [...prev, ...res.data]);
      setHasMore(res.data.length === PAGE_SIZE);
      setPage((prev) => prev + 1);
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
