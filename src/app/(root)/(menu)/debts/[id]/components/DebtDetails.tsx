"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";
// import { useRouter } from "next/router";
import TableContainer from "@/components/debt-payments/TableContainer";
import Link from "next/link";
import UsersTab from "./UsersTab";
import StatusBadge from "@/components/debts/StatusBadge";
import ActivityTimeline from "@/components/ui/timeline/ActivityTimeline";
import { NewDebtPaymentsButton } from "@/components/debt-payments/NewDebtPaymentsButton";
import { Calendar, Check, Clock4Icon, DoorOpen, Edit, Trash } from "lucide-react";
import { useDebtDetailsContext } from "../context/DebtDetailsContext";
import { useEffect, useState } from "react";
import DeleteDebtDialog from "./DeleteDebtDialog";
import { useAuth } from "@/context/AuthContext";
import LeaveSubjectDialog from "@/components/invitations/LeaveSubjectDialog";
import MarkDebtPaidDialog from "@/components/ui/dialogs/debts/MarkDebtPaidDialog";
import { Debt } from "@/models/debt";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

type DebtDetailsProps = {
  id: string;
};

export default function DebtDetails({ id }: DebtDetailsProps) {
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

  useEffect(() => {
    mutate();
  }, [loadCounter, mutate]);
  const [leaveSubject, setLeaveSubject] = useState(false);

  if (loading) {
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

  const progress = Math.round((debt.paidAmount / debt.totalAmount) * 100);
  const monthsRemaining = Math.max(debt.months - debt.monthsPaid, 0);

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">{debt.name}</h1>
              <StatusBadge status={debt.status} translate={debt.statusTranslated} />
            </div>
            <p className="text-muted-foreground max-w-xl">{debt.description}</p>
          </div>

          <div className="flex items-center gap-3">
            {debt.actions.createTransactions && (
              <NewDebtPaymentsButton
                debtId={id}
                setLoad={() => setLoadCounter((prev) => prev + 1)}
              />
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="size-9 w bg-transparent">
                  <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                {debt.actions.markPaid && (
                  <DropdownMenuItem
                    onClick={() => {
                      setIsMarkPaidOpen(true);
                    }}
                  >
                    <Check className="size-4 mr-2" />
                    {t("MARK_PAID")}
                  </DropdownMenuItem>
                )}

                {debt.actions.edit && (
                  <Link href={`${id}/edit`}>
                    <DropdownMenuItem>
                      <Edit className="size-4 mr-2" />
                      {t("EDIT_DEBT")}
                    </DropdownMenuItem>
                  </Link>
                )}
                {debt.actions?.destroy ||
                  (debt.users?.find((userShare) => userShare.id == user?.id)?.sharedRole?.code !=
                    "creator" && <DropdownMenuSeparator />)}
                {debt.users?.find((userShare) => userShare.id == user?.id)?.sharedRole?.code !=
                  "creator" && (
                  <DropdownMenuItem
                    onClick={async () => {
                      setLeaveSubject(true);
                    }}
                  >
                    <DoorOpen className="size-4" />
                    {t("LEAVE_DEBT")}
                  </DropdownMenuItem>
                )}
                {debt.actions.destroy && (
                  <DropdownMenuItem
                    onClick={() => {
                      setIsDeleteOpen(true);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash className="size-4 mr-2" />
                    {t("DELETE_DEBT")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("TOTAL_AMOUNT")}
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {debt.totalAmountFormatedWithoutSymbol}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("PAID_DETAILS")}
              </span>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Check className="size-4 text-accent" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-accent">
              {debt.paidAmountFormatedWithoutSymbol}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {progress}% {t("OF_TOTAL")}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("REMAINING")}
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Clock4Icon className="size-4 text-muted-foreground" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground">{debt.remainingAmount}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {monthsRemaining} {monthsRemaining > 1 ? t("MONTHS_LEFT") : t("MONTH_LEFT")}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {t("MONTHLY_PAYMENT")}
              </span>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Calendar className="size-4 text-muted-foreground" />
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {debt.monthlyAmountFormated}
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Circular Progress */}
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
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
                    strokeDasharray={`${progress * 3.14} 314`}
                    strokeLinecap="round"
                    className="text-accent transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{progress}%</span>
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
                    style={{ width: `${progress}%` }}
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
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-card">
              {t("TRANSACTIONS")}
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-card">
              {t("OVERVIEW")}
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-card">
              {t("USERS")}
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-card">
              {t("ACTIVITY")}
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <TableContainer load={loading} debtId={id} />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Debt Details */}
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
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
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">{t("DEBT_TERM")}</span>
                    <span className="font-medium text-foreground">
                      {debt.months} {debt.months > 1 ? t("MONTHS") : t("MONTH")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
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
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-3">{t("DESCRIPTION")}</h3>
                <p className="text-muted-foreground leading-relaxed">{debt.description}</p>
              </div>
            )}
          </TabsContent>

          {/* Users Tab */}
          <UsersTab debt={debt} />

          <TabsContent value="activity">
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
