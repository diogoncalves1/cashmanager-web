"use client";

import { useTranslations } from "next-intl";
import { onSendRequest } from "@/services/friends/service";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Search, UserPlus, Check, Clock, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User } from "@/models/user";
import { useAuth } from "@/context/AuthContext";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useFriendsContext } from "../context/FriendsContext";

type Page = { data: User[]; nextPage: number | null };

const fetchUsers = async ({
  pageParam = 1,
  queryKey,
}: {
  pageParam?: number;
  queryKey: any[];
}): Promise<Page> => {
  const searchTerm = queryKey[1] || "";
  if (searchTerm.trim().length < 2)
    return {
      nextPage: null,
      data: [],
    };
  const response = await fetch(`/api/users/search?page=${pageParam}&size=10&search=${searchTerm}`, {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Erro ao carregar amigos");
  }

  return response.json();
};

export default function AddFriend() {
  const { loadCounter, setLoadCounter } = useFriendsContext();
  const { user } = useAuth();
  const t = useTranslations("FRIENDS");
  const [query, setQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(query);

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
    queryKey: ["search-users", debouncedSearch],
    queryFn: fetchUsers,
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
      setDebouncedSearch(query);
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSend = async (user: User) => {
    setLoadingId(user.id);
    await onSendRequest(user.id, t);
    setLoadCounter((prev) => prev + 1);
    refetch();
    setLoadingId(null);
  };

  useEffect(() => {
    refetch();
  }, [loadCounter]);

  const allUsers = data?.pages.flatMap((page: any) => page.data) ?? [];

  // TODO: ADICIONAR A ATUALIZACAO DOS PEDIDOS ENVIADOS AO ENVIAR PEDIDO + TRADUÇÕES
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Add Friend</CardTitle>
        <CardDescription>Search by username - @{user.username}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {isLoading && (
          <div className="flex justify-center space-x-2 py-4">
            <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce"></span>
            <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-150"></span>
            <span className="w-3 h-3 bg-gray-500 rounded-full animate-bounce delay-300"></span>
          </div>
        )}

        {isError && (
          <div className="text-center py-5 text-red-600">
            Error: {error.message}
            <button onClick={() => window.location.reload()} className="ml-3 underline">
              {t("TRY_AGAIN")}
            </button>
          </div>
        )}

        {!isLoading && !isError && query.trim().length >= 2 && (
          <div className="space-y-2">
            {allUsers.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No users found matching &quot;{debouncedSearch}&quot;
              </p>
            ) : (
              allUsers.map((user) => {
                // const state = getButtonState(user.id);
                const initials = user.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("");

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 transition-colors hover:border-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold leading-none">{user.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">@{user.username}</p>
                      </div>
                    </div>

                    {user.status === "friend" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="gap-1.5 bg-transparent"
                      >
                        <Check className="size-3.5 text-success" />
                        Friends
                      </Button>
                    ) : user.status === "pending" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="gap-1.5 bg-transparent"
                      >
                        <Clock className="size-3.5 text-warning" />
                        Pending
                      </Button>
                    ) : user.status === "blocked" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled
                        className="gap-1.5 bg-transparent"
                      >
                        Blocked
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleSend(user)}
                        disabled={loadingId === user.id}
                        className="gap-1.5"
                      >
                        {loadingId === user.id ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <UserPlus className="size-3.5" />
                        )}
                        Add Friend
                      </Button>
                    )}
                  </div>
                );
              })
            )}

            <div ref={ref} className="py-8 text-center text-sm text-gray-500">
              {isFetchingNextPage
                ? t("LOADING_MORE_BLOCKED_USERS")
                : hasNextPage
                  ? t("SCROLL_TO_SEE_MORE")
                  : ""}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
