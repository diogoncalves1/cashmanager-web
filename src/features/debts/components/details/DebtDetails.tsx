"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/shared/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import ActivityTimeline from "@/components/ui/timeline/ActivityTimeline";
import { NewDebtPaymentsButton, TableContainer } from "@/features/debt-payments";
import {
  ActivityIcon,
  BarChart2,
  Calendar,
  Check,
  Clock4Icon,
  CreditCard,
  DoorOpen,
  Edit,
  Landmark,
  MoreVertical,
  Trash2,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  DeleteDebtDialog,
  StatusBadge,
  MarkDebtPaidDialog,
  Debt,
  UsersTab,
  useDebtDetailsContext,
} from "@/features/debts";
import { useAuth } from "@/features/auth";
import { LeaveSubjectDialog } from "@/features/invitations";
import useSWR from "swr";
import { fetcher } from "@/shared/fetcher";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/shared/utils";
import CustomTabList from "@/shared/ui/custom-tab-list";

type DebtDetailsProps = {
  id: string;
};

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  icon: React.ElementType;
  valueClassName?: string;
  iconClassName?: string;
  iconWrapperClassName?: string;
};

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  valueClassName,
  iconClassName,
  iconWrapperClassName,
}: StatCardProps) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        <div
          className={cn(
            "flex size-8 items-center justify-center rounded-lg bg-secondary",
            iconWrapperClassName
          )}
        >
          <Icon className={cn("size-4 text-muted-foreground", iconClassName)} />
        </div>
      </div>
      <div className={cn("mt-3 truncate text-2xl font-semibold text-foreground", valueClassName)}>
        {value}
      </div>
      {subtext && <div className="mt-1 text-xs text-muted-foreground">{subtext}</div>}
    </div>
  );
}

export function DebtDetails({ id }: DebtDetailsProps) {
  const monthsT = useTranslations("MONTHS");
  const t = useTranslations("DEBTS");
  const { user } = useAuth();
  const { loadCounter, setLoadCounter } = useDebtDetailsContext();
  const [debt, setDebt] = useState<Debt | undefined>();
  const router = useRouter();

  const {
    data,
    error,
    isLoading: loading,
    mutate,
  } = useSWR(id ? [`/debts/${id}`, { method: "GET" }] : null, fetcher);

  useEffect(() => {
    if (data) {
      setDebt(data.data);
    }

    if (error) {
      router.push("/debts");
    }
  }, [data, error, router]);

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isMarkPaidOpen, setIsMarkPaidOpen] = useState<boolean>(false);
  const [leaveSubject, setLeaveSubject] = useState(false);

  useEffect(() => {
    mutate();
  }, [loadCounter, mutate]);

  if (loading) {
    return (
      <div className="space-y-6">
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

  if (!debt) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-xl font-semibold">{t("DEBT_NOT_FOUND")}</p>
        <Button asChild className="mt-4">
          <Link href="/debts">{t("BACK_TO_DEBTS")}</Link>
        </Button>
      </div>
    );
  }

  const progress =
    debt.totalAmount > 0 ? Math.round((debt.paidAmount / debt.totalAmount) * 100) : 0;
  const safeProgress = Math.min(progress, 100);
  const monthsRemaining = Math.max(debt.months - debt.monthsPaid, 0);

  const isCreator =
    debt.users?.find((userShare) => userShare.id == user?.id)?.sharedRole?.code === "creator";
  const canLeave = !isCreator;
  const hasTopActions = debt.actions.markPaid || debt.actions.edit;
  const hasBottomActions = canLeave || debt.actions.destroy;

  const statCards: StatCardProps[] = [
    {
      label: t("TOTAL_AMOUNT"),
      value: debt.totalAmountFormatedWithoutSymbol,
      icon: Landmark,
    },
    {
      label: t("PAID_DETAILS"),
      value: debt.paidAmountFormatedWithoutSymbol,
      subtext: `${progress}% ${t("OF_TOTAL")}`,
      icon: Check,
      valueClassName: "text-accent",
      iconClassName: "text-accent",
      iconWrapperClassName: "bg-accent/10",
    },
    {
      label: t("REMAINING"),
      value: debt.remainingAmount,
      subtext: `${monthsRemaining} ${monthsRemaining > 1 ? t("MONTHS_LEFT") : t("MONTH_LEFT")}`,
      icon: Clock4Icon,
    },
    {
      label: t("MONTHLY_PAYMENT"),
      value: debt.monthlyAmountFormated,
      icon: Calendar,
    },
  ];

  const tabs = [
    { icon: CreditCard, label: t("TRANSACTIONS"), value: "transactions" },
    { icon: BarChart2, label: t("OVERVIEW"), value: "overview" },
    { icon: Users, label: t("USERS"), value: "users" },
    { icon: ActivityIcon, label: t("ACTIVITY"), value: "activity" },
  ];

  return (
    <>
      <div className="grid gap-3">
        {/* Header Section */}
        <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
          <div className="flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">{debt.name}</h1>
              <StatusBadge status={debt.status} translate={debt.statusTranslated} />
            </div>
            {debt.description && (
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {debt.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {debt.actions.createTransactions && (
              <NewDebtPaymentsButton
                debtId={id}
                setLoad={() => setLoadCounter((prev) => prev + 1)}
              />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="app" size="icon-lg">
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 bg-card">
                {debt.actions.markPaid && (
                  <DropdownMenuItem onClick={() => setIsMarkPaidOpen(true)}>
                    <Check className="size-4 mr-2" />
                    {t("MARK_PAID")}
                  </DropdownMenuItem>
                )}

                {debt.actions.edit && (
                  <DropdownMenuItem onClick={() => router.push(`/debts/${id}/edit`)}>
                    <Edit className="size-4 mr-2" />
                    {t("EDIT_DEBT")}
                  </DropdownMenuItem>
                )}

                {hasTopActions && hasBottomActions && <DropdownMenuSeparator />}

                {canLeave && (
                  <DropdownMenuItem onClick={() => setLeaveSubject(true)}>
                    <DoorOpen className="size-4 mr-2" />
                    {t("LEAVE_DEBT")}
                  </DropdownMenuItem>
                )}

                {debt.actions.destroy && (
                  <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} variant="destructive">
                    <Trash2 className="size-4 mr-2" />
                    {t("DELETE_DEBT")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* Progress Section */}
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800/60">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Circular Progress */}
            <div className="flex-shrink-0">
              <div className="relative size-32">
                <svg className="size-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-muted"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={`${safeProgress * 3.14} 314`}
                    strokeLinecap="round"
                    className="text-accent transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{safeProgress}%</span>
                </div>
              </div>
            </div>

            {/* Progress Details */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t("PAYMENT_PROGRESS")}</span>
                  <span className="font-medium text-foreground">
                    {debt.monthsPaid} {t("OF")} {debt.months} {t("PAYMENTS")}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t("START_DATE")}</div>
                  <div className="font-medium text-foreground text-sm">
                    {formatDate(debt.startDate, monthsT)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t("DUE_DATE")}</div>
                  <div className="font-medium text-foreground text-sm">
                    {formatDate(debt.dueDate, monthsT)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t("INTEREST_RATE")}</div>
                  <div className="font-medium text-foreground text-sm">
                    {debt.interestRate}% {t("APR")}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">{t("INTEREST_PAID")}</div>
                  <div className="font-medium text-foreground text-sm">
                    {debt.interestPaidFormated}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="transactions" className="grid gap-3">
          <CustomTabList tabs={tabs} />

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="grid gap-3">
            <TableContainer load={loading} debtId={id} />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="grid gap-3">
            <div className="grid gap-3 lg:grid-cols-2">
              {/* Debt Details */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800/60">
                <h3 className="font-semibold text-foreground mb-4">{t("DEBT_DETAILS")}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t("ORIGINAL_AMOUNT")}</span>
                    <span className="font-medium text-foreground">
                      {debt.totalAmountFormatedWithoutSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t("INTEREST_RATE")}</span>
                    <span className="font-medium text-foreground">
                      {debt.interestRate}% {t("APR")}
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-muted-foreground">{t("DEBT_TERM")}</span>
                    <span className="font-medium text-foreground">
                      {debt.months} {debt.months > 1 ? t("MONTHS") : t("MONTH")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800/60">
                <h3 className="font-semibold text-foreground mb-4">{t("PAYMENT_BREAKDOWN")}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t("TOTAL_INTEREST")}</span>
                    <span className="font-medium text-foreground">{debt.interestPaidFormated}</span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t("AMOUNT_PAID")}</span>
                    <span className="font-medium text-accent">
                      {debt.paidAmountFormatedWithoutSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-muted-foreground">{t("REMAINING_AMOUNT")}</span>
                    <span className="font-medium text-foreground">{debt.remainingAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {debt.description && (
              <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800/60">
                <h3 className="font-semibold text-foreground mb-3">{t("DESCRIPTION")}</h3>
                <p className="text-muted-foreground leading-relaxed">{debt.description}</p>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <UsersTab debt={debt} />

          <TabsContent value="activity" className="grid gap-3">
            <ActivityTimeline type="debts" id={id} />
          </TabsContent>
        </Tabs>

        <DeleteDebtDialog
          showDeleteDialog={isDeleteOpen}
          setShowDeleteDialog={setIsDeleteOpen}
          debt={debt}
          goBack={true}
        />
        <MarkDebtPaidDialog
          isMarkPaidDialogOpen={isMarkPaidOpen}
          setIsMarkPaidOpen={setIsMarkPaidOpen}
          selectedId={debt.id}
          mutate={mutate}
        />

        <LeaveSubjectDialog
          isOpen={leaveSubject}
          type="debts"
          id={id}
          setIsOpen={setLeaveSubject}
          goBack={true}
        />
      </div>
    </>
  );
}
