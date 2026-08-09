"use client";

import ActivityTimeline from "@/components/ui/timeline/ActivityTimeline";
import { cn } from "@/shared/utils";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  DoorOpen,
  BarChart2,
  ActivityIcon,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FormTransactionDialog, TableContainer } from "@/features/transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { accountTypeConfig, BalanceOverTimeChart } from "@/features/accounts";
import { MonthlySummary } from "@/features/accounts";
import { CategorySummary } from "@/features/accounts";
import { AnalyticsTabContent } from "@/features/accounts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSWR from "swr";
import { fetcher } from "@/shared/fetcher";
import { useRouter } from "next/navigation";
import { Account } from "@/features/accounts";
import { FormAccountDialog, DeleteAccountDialog } from "@/features/accounts";
import { StatusBadge } from "@/features/accounts";
import { useAccountDetailsContext } from "@/features/accounts";
import { useTranslations } from "next-intl";
import { AccountUsersSection } from "@/features/accounts";
import { useAuth } from "@/features/auth";
import { LeaveSubjectDialog } from "@/features/invitations";
import CreateButton from "@/shared/ui/create-button";

export const AccountDetailsContainer = ({ id }: { id: string }) => {
  const tTransactions = useTranslations("TRANSACTIONS");
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("ACCOUNTS");
  const { user } = useAuth();
  const { loadCounter, setLoadCounter } = useAccountDetailsContext();
  const [account, setAccount] = useState<Account | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [leaveSubject, setLeaveSubject] = useState(false);

  const router = useRouter();

  const [pageData, setPageData] = useState<{
    account?: Account;
    monthlySummary: MonthlySummary[];
    categorySummary: CategorySummary;
    balanceChart?: {
      charts: {
        weekly: {
          date: string;
          amount: number;
          amountFormated: string;
          transactionAmount: number;
        }[];
        monthly: {
          date: string;
          amount: number;
          amountFormated: string;
          transactionAmount: number;
        }[];
        quarterly: {
          date: string;
          amount: number;
          amountFormated: string;
          transactionAmount: number;
        }[];
        annualy: {
          date: string;
          amount: number;
          amountFormated: string;
          transactionAmount: number;
        }[];
      };
    };
    extraData?: {
      monthlyRevenues: string;
      monthlyExpenses: string;
      revenuesVsLastMonth: number;
      expensesVsLastMonth: number;
      balanceVsLastMonth: number;
    };
  }>({
    monthlySummary: [],
    categorySummary: { data: [], total: 0, totalFormated: "" },
  });

  const {
    data,
    error,
    isLoading: isAccountLoading,
    mutate,
  } = useSWR(id ? [`/accounts/${id}`, { method: "GET" }] : null, fetcher);

  useEffect(() => {
    mutate();
  }, [loadCounter, mutate]);

  useEffect(() => {
    if (data) {
      setPageData({
        account: data.data,
        monthlySummary: data.meta.monthlyResume,
        categorySummary: data.meta.categorySummary,
        balanceChart: data.meta.balanceChart,
        extraData: data.meta.extraData,
      });
      setAccount(data.data);
    }

    if (error) {
      router.push("/accounts");
    }
  }, [data, error, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAccountLoading) setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [isAccountLoading]);

  const config = accountTypeConfig[account?.type || "bank_account"];
  const Icon = config.icon;

  if (isLoading) {
    return (
      <div className="gap-7 mx-auto py-10 px-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <Skeleton className="size-14 rounded-2xl" />
            <div>
              <Skeleton className="h-6 w-40 mb-2" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
          <div className="flex flex-col items-start gap-3 sm:items-end">
            <Skeleton className="h-8 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>

        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-xl font-semibold">{t("ACCOUNT_NOT_FOUND")}</p>
        <Button asChild className="mt-4">
          <Link href="/accounts">{t("BACK_TO_ACCOUNTS")}</Link>
        </Button>
      </div>
    );
  }

  const isNeg = account.balance < 0;

  return (
    <div className="grid gap-3">
      {/* Premium Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-sm ring-1 transition-transform duration-300 hover:scale-105",
              config.className,
              config.ringClassName
            )}
          >
            <Icon className="size-7" strokeWidth={1.75} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-balance">
                {account.name}
              </h1>
              <StatusBadge active={account.active} />
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">{account.typeTranslated}</p>
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div>
            <p
              className={cn(
                "text-3xl font-bold tracking-tight",
                isNeg ? "text-destructive" : "text-foreground"
              )}
            >
              {account.balanceFormated}
            </p>
            <div className="mt-1 flex items-center gap-1.5 sm:justify-end">
              {(pageData.extraData?.balanceVsLastMonth ?? 0) >= 0 ? (
                <TrendingUp className="size-3.5 text-accent" />
              ) : (
                <TrendingDown className="size-3.5 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm font-medium",
                  (pageData.extraData?.balanceVsLastMonth ?? 0) >= 0
                    ? "text-accent"
                    : "text-destructive"
                )}
              >
                {(pageData.extraData?.balanceVsLastMonth ?? 0) >= 0 ? "+" : ""}
                {pageData.extraData?.balanceVsLastMonth.toFixed(1) || 0}%
              </span>
              <span className="text-sm text-muted-foreground">{t("VS_LAST_MONTH")}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {account.actions?.createTransactions && (
              <CreateButton onClick={() => setIsOpen(true)}>
                {tTransactions("NEW_TRANSACTION")}
              </CreateButton>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="app" size="lg">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {account.actions?.edit && (
                  <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                    <Pencil className="mr-2 size-4" />
                    {t("EDIT_ACCOUNT")}
                  </DropdownMenuItem>
                )}
                {account?.users?.find((userShare) => userShare.id == user?.id)?.sharedRole?.code !=
                  "creator" && (
                  <DropdownMenuItem
                    onClick={async () => {
                      setLeaveSubject(true);
                    }}
                  >
                    <DoorOpen className="size-4 mr-2" />
                    {t("LEAVE_ACCOUNT")}
                  </DropdownMenuItem>
                )}

                {account.actions?.destroy && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setIsDeleteOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 size-4" />
                      {t("DELETE_ACCOUNT")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <Tabs defaultValue="overview" className="gap-3 grid rounded-md">
        <TabsList className="flex h-12 w-full items-center gap-1 overflow-x-auto rounded-md shadow-md bg-white p-1.5 dark:border-gray-800 dark:bg-gray-900 sm:w-auto">
          <TabsTrigger
            value="overview"
            className="flex shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100 md:px-4"
          >
            <BarChart2 className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">{t("OVERVIEW")}</span>
          </TabsTrigger>

          <TabsTrigger
            value="transactions"
            className="flex shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100 md:px-4"
          >
            <CreditCard className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">{t("TRANSACTIONS")}</span>
          </TabsTrigger>

          <TabsTrigger
            value="activity"
            className="flex shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100 md:px-4"
          >
            <ActivityIcon className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">{t("ACTIVITY")}</span>
          </TabsTrigger>

          <TabsTrigger
            value="analytics"
            className="flex shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100 md:px-4"
          >
            <TrendingUp className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">{t("ANALYTICS")}</span>
          </TabsTrigger>

          <TabsTrigger
            value="users"
            className="flex shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-gray-500 transition-all data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:shadow-sm dark:text-gray-400 dark:data-[state=active]:bg-gray-800 dark:data-[state=active]:text-gray-100 md:px-4"
          >
            <Users className="size-4 shrink-0" strokeWidth={1.75} />
            <span className="hidden sm:inline">{t("USERS")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-3">
          {/* Summary Cards */}
          {isLoading ? (
            <div className="grid gap-3 lg:grid-cols-3">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-20 mb-3" />
                    <Skeleton className="h-8 w-28" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-3">
              {[
                {
                  label: t("CURRENT_BALANCE"),
                  code: "current_balance",
                  value: account.balanceFormatedWithoutSymbol,
                  trend: pageData.extraData?.balanceVsLastMonth || 0,
                  color: isNeg ? "text-destructive" : "text-foreground",
                  trendLabel: t("VS_LAST_MONTH"),
                },
                {
                  label: t("MONTHLY_INCOME"),
                  code: "monthly_income",
                  value: pageData.extraData?.monthlyRevenues || "$0",
                  trend: pageData.extraData?.revenuesVsLastMonth || 0,
                  color: "text-accent",
                  trendLabel: t("VS_LAST_MONTH"),
                },
                {
                  label: t("MONTHLY_EXPENSE"),
                  code: "monthly_expenses",
                  value: pageData.extraData?.monthlyExpenses || "$0",
                  trend: pageData.extraData?.expensesVsLastMonth || 0,
                  color: "text-destructive",
                  trendLabel: t("VS_LAST_MONTH"),
                },
              ].map((card) => (
                <Card key={card.label} className="border-0 transition-shadow hover:shadow-lg">
                  <CardContent className="px-6">
                    <p className="text-sm text-muted-foreground">{card.label}</p>
                    <p className={cn("mt-2 text-2xl font-bold tracking-tight", card.color)}>
                      {card.value}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      {card.trend >= 0 ? (
                        <TrendingUp
                          className={`size-3 ${card.code !== "monthly_expenses" ? "text-accent" : "text-destructive"}`}
                        />
                      ) : (
                        <TrendingDown
                          className={`size-3 ${card.code !== "monthly_expenses" ? "text-destructive" : "text-accent"}`}
                        />
                      )}
                      <span
                        className={cn(
                          "text-xs font-medium",
                          card.trend >= 0
                            ? card.code === "monthly_expenses"
                              ? "text-destructive"
                              : "text-accent"
                            : card.code === "monthly_expenses"
                              ? "text-accent"
                              : "text-destructive"
                        )}
                      >
                        {card.trend >= 0 ? "+" : ""}
                        {card.trend.toFixed(1)}%
                      </span>
                      <span className="text-xs text-muted-foreground">{card.trendLabel}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Balance Over Time Area Chart */}
          <BalanceOverTimeChart
            chartsData={
              pageData.balanceChart?.charts || {
                weekly: [],
                monthly: [],
                quarterly: [],
                annualy: [],
              }
            }
            balanceFormated={account.balanceFormatedWithoutSymbol}
            balance={account.balance}
            isLoading={isLoading}
          />
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <TableContainer accountId={id} includeSummary={false} loadMore={loadCounter} />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <ActivityTimeline type="accounts" id={account.id} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsTabContent account={account} pageData={pageData} isLoading={isLoading} />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <AccountUsersSection account={account} isLoading={isLoading} />
        </TabsContent>
      </Tabs>

      <LeaveSubjectDialog
        isOpen={leaveSubject}
        type="accounts"
        id={id}
        setIsOpen={setLeaveSubject}
        goBack={true}
      />
      <DeleteAccountDialog
        isOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        account={account}
        back={true}
      />
      <FormAccountDialog
        id={account.id}
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        account={account}
        mutate={mutate}
      />

      <FormTransactionDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        accountId={id}
        mutate={() => {
          setLoadCounter((prev) => prev + 1);
        }}
      />
    </div>
  );
};
