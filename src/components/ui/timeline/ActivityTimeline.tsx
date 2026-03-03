"use client";

import { useEffect, useRef } from "react";
import { cn, formatDate } from "@/lib/utils";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import LoadingList from "../loading/LoadingList";
import { Activity } from "@/models/activity";

type ActivityType = "debts" | "financial-goals" | "accounts";

type Props = {
  type: ActivityType;
  id: string;
};

interface Page {
  data: Activity[];
  pages: [];
  nextPage: number | null;
}

const ActivityTimeline = ({ type, id }: Props) => {
  const t = useTranslations("ACTIVITY");
  const monthsT = useTranslations("MONTHS");

  const fetchActivity = async ({ pageParam = 1 }: { pageParam: number }): Promise<Page> => {
    const response = await fetch(`/api/${type}/${id}/activity?page=${pageParam}&size=10`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar atividade");
    }

    return response.json();
  };

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "5px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteQuery<Page, Error, Page, [string, string, string], number>({
      queryKey: ["activity", type, id],
      queryFn: fetchActivity,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        return lastPage.nextPage ?? undefined;
      },
      staleTime: 1000 * 60 * 5,
    });

  const prevInViewRef = useRef(false);

  useEffect(() => {
    if (inView && !prevInViewRef.current && hasNextPage) {
      fetchNextPage();
    }

    prevInViewRef.current = inView;
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <LoadingList />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-600">
        {t("ERROR")}
        <button onClick={() => window.location.reload()} className="ml-3 underline">
          {t("TRY_AGAIN")}
        </button>
      </div>
    );
  }

  const activity = data?.pages.flatMap((page: Page) => page.data) ?? [];

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-6">{t("ACTIVITY_TIMELINE")}</h2>
      <div className="relative">
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
        <div className="space-y-6">
          {activity.length === 0 ? (
            <p className="text-center py-10 text-gray-500 dark:text-gray-400">
              {t("WITHOUT_ACTIVITY")}
            </p>
          ) : (
            activity.map((activity, idx) => (
              <div key={idx} className="flex gap-4 relative">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 border-card z-10 shrink-0 flex items-center justify-center",
                    idx === 0 ? "bg-accent" : "bg-muted"
                  )}
                >
                  {idx === 0 && <div className="w-2 h-2 rounded-full bg-accent-foreground" />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {formatDate(activity.createdAt, monthsT)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("BY")} {activity.user.name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div ref={ref} className="py-2 text-center text-sm text-gray-500">
        {isFetchingNextPage ? <LoadingList /> : hasNextPage ? <LoadingList /> : ""}
      </div>
    </div>
  );
};

export default ActivityTimeline;
