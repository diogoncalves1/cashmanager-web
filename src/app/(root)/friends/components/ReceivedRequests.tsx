"use client";

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { Friendship } from "@/models/friendship";
import { Clock, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  onAcceptRequest,
  onCancelRequest,
  onDeclineRequest,
} from "@/services/friend-requests/service";
import { FriendsEmptyState } from "./FriendsEmptyState";
import { PendingRequestCard } from "./PendingRequestCard";
import LoadingList from "@/components/ui/loading/LoadingList";
import { useFriendsContext } from "../context/FriendsContext";

type Page = { data: Friendship[]; nextPage: number | null };

const fetchFriends = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: any[];
}): Promise<Page> => {
  const searchTerm = queryKey[1] || ""; // segundo item da queryKey
  const response = await fetch(
    `/api/friend-requests/received?page=${pageParam}&size=10&search=${searchTerm}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao carregar amigos");
  }

  return response.json();
};

export default function ReceivedRequests() {
  const t = useTranslations("FRIENDS");

  const { loadCounter, setLoadCounter } = useFriendsContext();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "5px",
  });

  const {
    data,
    error,
    fetchNextPage,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<Page, Error>({
    queryKey: ["receivedRequets", debouncedSearch],
    queryFn: fetchFriends,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    refetch();
  }, [loadCounter]);

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        Error: {error.message}
        <button onClick={() => window.location.reload()} className="ml-3 underline">
          {t("TRY_AGAIN")}
        </button>
      </div>
    );
  }

  const allRequests = data?.pages.flatMap((page: any) => page.data) ?? [];

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("SEARCH_BY_USER")}
          className="w-full p-2 border rounded"
        />
      </div>
      {isLoading ? (
        <LoadingList />
      ) : allRequests.length > 0 ? (
        allRequests.map((f) => (
          <PendingRequestCard
            key={f.id}
            friendship={f}
            direction="received"
            onReject={async () => {
              if (await onDeclineRequest(f.user.id, t)) {
                refetch();
                setLoadCounter((prev) => prev + 1);
              }
            }}
            onAccept={async () => {
              if (await onAcceptRequest(f.user.id, t)) {
                refetch();
                setLoadCounter((prev) => prev + 1);
              }
            }}
          />
        ))
      ) : (
        <FriendsEmptyState
          icon={Clock}
          title="No received requests"
          description="You haven't received any friend requests yet."
        />
      )}

      <div ref={ref} className="py-8 text-center text-sm text-gray-500">
        {isFetchingNextPage ? <LoadingList /> : hasNextPage ? <LoadingList /> : ""}
      </div>
    </div>
  );
}
