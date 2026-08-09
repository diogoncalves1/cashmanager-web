"use client";

import { useEffect, useRef, useState } from "react";
import { cn, formatDate } from "@/shared/utils";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { AlertCircle, History, Loader2 } from "lucide-react";
import LoadingList from "../loading/LoadingList";
import { Activity } from "@/shared/types/activity";

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

  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

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

  const activity = data?.pages.flatMap((page: Page) => page.data) ?? [];

  const toggleExpand = (idx: number) => {
    setExpandedIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="rounded-md bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          <History className="size-4" strokeWidth={1.75} />
        </div>
        <h2 className="text-base font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          {t("ACTIVITY_TIMELINE")}
        </h2>
      </div>

      {isLoading ? (
        <div className="py-10">
          <LoadingList />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
            <AlertCircle className="size-5" strokeWidth={1.75} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("ERROR")}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {t("TRY_AGAIN")}
          </button>
        </div>
      ) : activity.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600">
            <History className="size-5" strokeWidth={1.75} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("WITHOUT_ACTIVITY")}</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute bottom-3 left-[13px] top-3 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent dark:from-gray-800 dark:via-gray-800" />

          <div className="space-y-1">
            {activity.map((item, idx) => {
              const isExpanded = expandedIdx === idx;

              return (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpand(idx)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpand(idx);
                    }
                  }}
                  className={cn(
                    "group relative -mx-2 flex cursor-pointer gap-4 rounded-xl px-2 py-2.5 transition-all duration-150 active:scale-[0.99]",
                    "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
                    isExpanded && "bg-gray-50 dark:bg-gray-800/50"
                  )}
                >
                  <div className="relative z-10 flex shrink-0 items-start pt-0.5">
                    <div
                      className={cn(
                        "flex size-[26px] items-center justify-center rounded-full border-2 border-white shadow-sm transition-all duration-300 ease-out dark:border-gray-900",
                        isExpanded
                          ? "scale-110 bg-accent ring-4 ring-accent/20"
                          : "bg-gray-200 dark:bg-gray-700"
                      )}
                    >
                      <span
                        className={cn(
                          "size-2 rounded-full bg-white transition-all duration-300",
                          isExpanded ? "scale-100 opacity-100" : "scale-0 opacity-0"
                        )}
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex items-start justify-between gap-3">
                      <p
                        className={cn(
                          "truncate font-medium transition-colors",
                          isExpanded
                            ? "text-accent dark:text-accent"
                            : "text-gray-900 dark:text-gray-100"
                        )}
                      >
                        {item.title}
                      </p>
                      <span className="shrink-0 whitespace-nowrap text-xs text-gray-400 dark:text-gray-600">
                        {formatDate(item.createdAt, monthsT)}
                      </span>
                    </div>

                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-600">
                      {t("BY")}{" "}
                      <span className="font-medium text-gray-500 dark:text-gray-500">
                        {item.user.name}
                      </span>
                    </p>

                    {/* Descrição — só aparece ao clicar, animada via grid-rows */}
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        isExpanded
                          ? "mt-2 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="rounded-lg bg-white px-3 py-2 text-sm leading-relaxed text-gray-600 dark:bg-accent/10 dark:text-gray-300">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(hasNextPage || isFetchingNextPage) && (
        <div
          ref={ref}
          className="flex items-center justify-center gap-2 pt-4 text-xs text-gray-400 dark:text-gray-600"
        >
          <Loader2 className="size-3.5 animate-spin" />
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
