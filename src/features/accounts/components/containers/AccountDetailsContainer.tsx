"use client";

import ActivityTimeline from "@/components/ui/timeline/ActivityTimeline";
import { cn } from "@/lib/utils";
import {
  Building2,
  Wallet,
  CreditCard,
  PiggyBank,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Pencil,
  Trash2,
  DoorOpen,
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { NewTransactionButton } from "@/features/transactions/components/actions/NewTransactionButton";
import { Skeleton } from "@/components/ui/skeleton";
import { BalanceOverTimeChart } from "@/features/accounts/components/charts/BalanceOverTimeChart";
import { MonthlySummary } from "@/features/accounts/components/charts/MonthlySummaryChart";
import { CategorySummary } from "@/features/accounts/components/charts/CategoryExpensesChart";
import { AnalyticsTabContent } from "@/features/accounts/components/tabs/AnalyticsTabContent";
import { SettingsTabContent } from "@/features/accounts/components/tabs/SettingsTabContent";
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
import { fetcher } from "@/lib/fetcher";
import TableContainer from "@/features/transactions/components/containers/TableContainer";
import { useRouter } from "next/navigation";
import { Account, AccountType } from "@/features/accounts/types";
import DeleteAccountDialog from "@/features/accounts/components/dialogs/DeleteAccountDialog";
import { FormAccountDialog } from "@/features/accounts/components/dialogs/FormAccountDialog";
import { StatusBadge } from "@/features/accounts/components/ui/StatusBadge";
import { useAccountDetailsContext } from "@/features/accounts/state/account-details.context";
import { useTranslations } from "next-intl";
import { AccountUsersSection } from "@/features/accounts/components/sections/AccountUsersSection";
import { useAuth } from "@/features/auth";
import LeaveSubjectDialog from "@/features/invitations/components/dialogs/LeaveSubjectDialog";

const accountTypeConfig: Record<AccountType, { icon: typeof Building2; className: string }> = {
  bank_account: {
    icon: Building2,
    className: "bg-blue-500/10 text-blue-500",
  },
  cash: { icon: Wallet, className: "bg-accent/10 text-accent" },
  credit_card: {
    icon: CreditCard,
    className: "bg-orange-500/10 text-orange-500",
  },
  digital_wallet: {
    icon: PiggyBank,
    className: "bg-cyan-500/10 text-cyan-500",
  },
};

const AccountDetailsContainer = ({ id }: { id: string }) => {
  const t = useTranslations("ACCOUNTS");
  const { user } = useAuth();
  const { loadCounter } = useAccountDetailsContext();
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
      <div className="space-y-6 max-w-7xl mx-auto py-10 px-4">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
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
    <div className="space-y-6 max-w-7xl mx-auto py-10 px-4">
      {/* Premium Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn("flex size-14 items-center justify-center rounded-2xl", config.className)}
          >
            <Icon className="size-7" />
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
              <NewTransactionButton accountId={id} setLoad={mutate} />
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-8">
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
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="h-10 w-full justify-start rounded-xl bg-muted p-1 sm:w-auto">
          <TabsTrigger value="overview" className="rounded-lg px-4">
            {t("OVERVIEW")}
          </TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg px-4">
            {t("TRANSACTIONS")}
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-lg px-4">
            {t("ACTIVITY")}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-lg px-4">
            {t("ANALYTICS")}
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-lg px-4">
            {t("USERS")}
          </TabsTrigger>
          {(account.actions?.edit || account.actions?.destroy) && (
            <TabsTrigger value="settings" className="rounded-lg px-4">
              {t("SETTINGS")}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          {isLoading ? (
            <div className="grid gap-4 lg:grid-cols-3">
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
            <div className="grid gap-4 lg:grid-cols-3">
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
                <Card
                  key={card.label}
                  className="rounded-2xl border-0 shadow-sm bg-card transition-shadow hover:shadow-md"
                >
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
          <TableContainer accountId={id} includeSummary={false} />
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

        {/* Settings Tab */}
        {(account.actions?.edit || account.actions?.destroy) && (
          <TabsContent value="settings">
            <SettingsTabContent account={account} isLoading={isLoading} />
          </TabsContent>
        )}
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
    </div>
  );
};

export default AccountDetailsContainer;
