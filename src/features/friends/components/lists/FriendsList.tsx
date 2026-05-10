"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import {
  Friendship,
  onBlockUser,
  onRemoveFriend,
  FriendCard,
  FriendsEmptyState,
  useFriendsContext,
} from "@/features/friends";
import { Search, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import LoadingList from "@/components/ui/loading/LoadingList";

type Page = { data: Friendship[]; nextPage: number | null };

type FetchFriendsParams = {
  pageParam?: number | unknown;
  search?: string;
};

const fetchFriends = async ({ pageParam = 1, search }: FetchFriendsParams): Promise<Page> => {
  const searchTerm = search ?? "";
  const response = await fetch(`/api/friends?page=${pageParam}&size=10&search=${searchTerm}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar amigos");
  }

  return response.json();
};

export function FriendsList() {
  const { loadCounter, setLoadCounter } = useFriendsContext();
  const t = useTranslations("FRIENDS");

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
    hasNextPage,
    refetch,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<Page, Error>({
    queryKey: ["friends", debouncedSearch],
    queryFn: ({ pageParam = 1 }) => fetchFriends({ pageParam: pageParam, search: debouncedSearch }),
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
  }, [loadCounter, refetch]);

  if (isError) {
    return (
      <div className="text-center  py-12 text-red-600">
        Error: {error.message}
        <button onClick={() => window.location.reload()} className="ml-3 underline">
          {t("TRY_AGAIN")}
        </button>
      </div>
    );
  }

  const allFriends = data?.pages.flatMap((page) => page.data) ?? [];
  return (
    <div className="space-y-4 w-full">
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
      ) : allFriends.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2">
          {allFriends.map((f) => (
            <FriendCard
              key={f.id}
              friendship={f}
              onRemove={async () => {
                if (await onRemoveFriend(f.user.id, t)) {
                  refetch();
                  setLoadCounter((prev) => prev + 1);
                }
              }}
              onBlock={async () => {
                if (await onBlockUser(f.user.id, t)) {
                  refetch();
                  setLoadCounter((prev) => prev + 1);
                }
              }}
            />
          ))}
        </div>
      ) : allFriends.length == 0 && debouncedSearch.trim() ? (
        <FriendsEmptyState
          icon={Search}
          title={t("NO_RESULTS")}
          description={t("NO_RESULTS_TEXT", { username: debouncedSearch })}
        />
      ) : (
        <FriendsEmptyState
          icon={Users}
          title={t("NO_FRIENDS_YET")}
          description={t("NO_FRIENDS_YET_TEXT")}
        />
      )}

      <div ref={ref} className="py-8 text-center text-sm text-gray-500">
        {isFetchingNextPage
          ? t("LOADING_MORE_REQUESTS")
          : hasNextPage
            ? t("SCROLL_TO_SEE_MORE")
            : ""}
      </div>
    </div>
  );
}
