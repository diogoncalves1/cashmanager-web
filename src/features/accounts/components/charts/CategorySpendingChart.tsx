"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  YAxisTickContentProps,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CategorySummary } from "@/features/accounts/components/charts//CategoryExpensesChart";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, BarChart3, Circle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { iconMap } from "@/types/category";
import { useTranslations } from "next-intl";

interface CategorySpendingChartProps {
  categoriesData: CategorySummary;
  currency: string;
  isLoading?: boolean;
}

const TOP_COUNT = 10;

type CategoryItem = {
  percentage: number;
  color: string;
  category: string;
  value: number;
  icon: keyof typeof iconMap;
  valueFormated: string;
  valueFormatedWithoutSymbol: string;
  count?: number;
};

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: CategoryItem }>;
}) {
  const t = useTranslations("ACCOUNTS");
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-popover px-4 py-3 shadow-xl">
      <div className="flex items-center gap-2">
        <span className="block size-3 rounded-full" style={{ backgroundColor: d.color }} />
        <span className="text-sm font-semibold text-foreground">{d.category}</span>
      </div>
      <div className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-0.5 text-sm">
        <span className="text-muted-foreground">{t("AMOUNT")}</span>
        <span className="text-right font-semibold tabular-nums text-foreground">
          {d.valueFormated}
        </span>
        <span className="text-muted-foreground">{t("SHARE")}</span>
        <span className="text-right font-medium tabular-nums text-foreground">
          {d.percentage.toFixed(1)}%
        </span>
        <span className="text-muted-foreground">{t("TRANSACTIONS")}</span>
        <span className="text-right font-medium tabular-nums text-foreground">{d.count}</span>
      </div>
    </div>
  );
}

export function CategorySpendingChart({ categoriesData, isLoading }: CategorySpendingChartProps) {
  const t = useTranslations("ACCOUNTS");

  const [showOther, setShowOther] = useState(false);
  // const [dateRange, setDateRange] = useState<DateRange>("all");
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const { topCategories, allCategories, otherCategories, otherTotal, grandTotal } = useMemo(() => {
    const total = categoriesData.total;
    if (total === 0)
      return {
        topCategories: [] as CategoryItem[],
        allCategories: [] as CategoryItem[],
        otherCategories: [] as CategoryItem[],
        otherTotal: 0,
        grandTotal: 0,
      };

    const top: CategoryItem[] = categoriesData.data.slice(0, TOP_COUNT).map((c) => ({
      ...c,
      percentage: (c.value / total) * 100,
      color: c.color,
    }));

    const all: CategoryItem[] = categoriesData.data.map((c) => ({
      ...c,
      percentage: (c.value / total) * 100,
      color: c.color,
    }));

    const rest: CategoryItem[] = categoriesData.data.slice(TOP_COUNT).map((c) => ({
      ...c,
      percentage: (c.value / total) * 100,
      color: c.color,
    }));

    const restTotal = rest.reduce((s, c) => s + c.value, 0);

    return {
      topCategories: top,
      allCategories: all,
      otherCategories: rest,
      otherTotal: restTotal,
      grandTotal: total,
    };
  }, [categoriesData]);

  if (isLoading) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (grandTotal === 0) {
    return (
      <Card className="rounded-2xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t("EXPENSES_BY_CATEGORY")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16">
            <BarChart3 className="size-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">{t("NO_DATA_AVAILABLE")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...topCategories.map((c) => c.value));

  return (
    <Card className="rounded-2xl border-0 shadow-sm">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold">{t("EXPENSES_BY_CATEGORY")}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            {topCategories.length + otherCategories.length}{" "}
            {topCategories.length + otherCategories.length > 1 ? t("CATEGORIES") : t("CATEGORY")}{" "}
            &middot; {categoriesData.totalFormated} {t("TOTAL")}
          </p>
        </div>
        {/* <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="h-9 w-[120px] rounded-xl text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Horizontal Bar Chart */}
        <div style={{ height: Math.max(allCategories.length * 52, 280) }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={allCategories}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
              barCategoryGap="20%"
            >
              <XAxis type="number" hide domain={[0, maxValue * 1.15]} />
              <YAxis
                type="category"
                dataKey="category"
                width={120}
                axisLine={false}
                tickLine={false}
                tick={(props: YAxisTickContentProps) => {
                  const { x, y, payload } = props;

                  const item = allCategories.find((c) => c.category === payload.value);
                  const Icon = iconMap[item?.icon as keyof typeof iconMap] ?? Circle;

                  return (
                    <g transform={`translate(${x},${y})`}>
                      <g transform="translate(-120, -8)">
                        <Icon size={16} color={item?.color || "#888"} />
                      </g>

                      <text
                        x={-98}
                        y={0}
                        dy={4}
                        textAnchor="start"
                        className="fill-foreground text-[13px] font-medium"
                      >
                        {payload.value.length > 14
                          ? `${payload.value.slice(0, 14)}...`
                          : payload.value}
                      </text>
                    </g>
                  );
                }}
              />
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3, radius: 6 }}
              />
              <Bar
                dataKey="value"
                radius={[0, 8, 8, 0]}
                cursor="pointer"
                onMouseEnter={(_, index) => setHoveredBar(allCategories[index]?.category || null)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {allCategories.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={entry.color}
                    opacity={hoveredBar && hoveredBar !== entry.category ? 0.4 : 1}
                    style={{ transition: "opacity 200ms" }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Breakdown List */}
        <div className="space-y-1">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">{t("BREAKDOWN")}</p>
            <p className="text-sm font-medium text-muted-foreground">
              {t("AMOUNT")} / {t("SHARE")}
            </p>
          </div>

          {topCategories.map((item) => {
            const Icon = iconMap[item?.icon as keyof typeof iconMap] ?? Circle;

            return (
              <button
                key={item.category}
                type="button"
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all",
                  "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
                onMouseEnter={() => setHoveredBar(item.category)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <Icon className="size-4" color={item?.color || "#888"} />
                <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                  {item.category}
                </span>
                <Badge
                  variant="outline"
                  color="default"
                  className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground lowercase"
                >
                  {item.count} {(item.count ?? 0) > 1 ? t("TRANSACTIONS") : t("TRANSACTION")}
                </Badge>
                <div className="flex items-center gap-3">
                  <div className="hidden w-24 sm:block">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(item.percentage, 3)}%`,
                          backgroundColor: item.color,
                          opacity: hoveredBar === item.category ? 1 : 0.7,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right text-sm font-medium tabular-nums text-muted-foreground">
                    {item.percentage < 1 ? "<1%" : `${item.percentage.toFixed(0)}%`}
                  </span>
                  <span className="w-24 text-right text-sm font-bold tabular-nums text-foreground">
                    {item.valueFormated}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Other expandable group */}
          {otherCategories.length > 0 && (
            <>
              <button
                type="button"
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all",
                  "hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                )}
                onClick={() => setShowOther(!showOther)}
              >
                <span className="block size-3 shrink-0 rounded-full bg-gray-500" />
                <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                  {(otherCategories.length ?? 0) > 1 ? t("OTHERS") : t("OTHER")}
                  <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                    ({otherCategories.length}{" "}
                    {otherCategories.length > 1 ? t("CATEGORIES") : t("CATEGORY")})
                  </span>
                </span>
                <Badge
                  variant="outline"
                  color="default"
                  className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {otherCategories.length}{" "}
                  {(otherCategories.length ?? 0) > 1 ? t("TRANSACTIONS") : t("TRANSACTION")}
                </Badge>
                <div className="flex items-center gap-3">
                  <div className="hidden w-24 sm:block">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-gray-500 transition-all duration-300"
                        style={{
                          width: `${Math.max((otherTotal / grandTotal) * 100, 3)}%`,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                  <span className="w-12 text-right text-sm font-medium tabular-nums text-muted-foreground">
                    {((otherTotal / grandTotal) * 100).toFixed(0)}%
                  </span>
                  <span className="w-24 text-right text-sm font-bold tabular-nums text-foreground">
                    {formatCurrency(otherTotal, categoriesData.totalFormated)}
                  </span>
                </div>
                {showOther ? (
                  <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {showOther && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200 ml-6 border-l-2 border-border/50 pl-3">
                  {otherCategories.map((item) => {
                    const Icon = iconMap[item?.icon as keyof typeof iconMap] ?? Circle;
                    return (
                      <button
                        key={item.category}
                        type="button"
                        className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted/40"
                      >
                        <Icon className="size-4" color={item?.color || "#888"} />
                        <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                          {item.category}
                        </span>
                        <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">
                          {item.percentage < 1 ? "<1%" : `${item.percentage.toFixed(0)}%`}
                        </span>
                        <span className="w-20 text-right text-sm font-semibold tabular-nums text-foreground">
                          {item.valueFormated}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
