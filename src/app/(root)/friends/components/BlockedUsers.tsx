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
import { BlockedUserCard } from "./BlockUserCard";
import { onUnblockUser } from "@/services/friends/service";

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
    `/api/friends/blocked?page=${pageParam}&size=10&search=${searchTerm}`,
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

export default function BlockedUsers() {
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
    queryKey: ["blockedUsers", debouncedSearch],
    queryFn: fetchFriends,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPage ?? undefined;
    },
    staleTime: 1000 * 60 * 5,
  });

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

  const allBlocks = data?.pages.flatMap((page: any) => page.data) ?? [];

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
      ) : allBlocks.length > 0 ? (
        allBlocks.map((f) => (
          <BlockedUserCard
            key={f.id}
            friendship={f}
            onUnblock={async () => {
              if (await onUnblockUser(f.user.id, t)) {
                refetch();
                setLoadCounter((prev) => prev + 1);
              }
            }}
          />
        ))
      ) : (
        <FriendsEmptyState
          icon={Clock}
          title="No blocked users"
          description="You haven't blocked anyone. Blocked users cannot interact with you."
        />
      )}

      <div ref={ref} className="py-8 text-center text-sm text-gray-500">
        {isFetchingNextPage ? <LoadingList /> : hasNextPage ? <LoadingList /> : ""}
      </div>
    </div>
  );
}
