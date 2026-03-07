"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";
// import { useRouter } from "next/router";
import { useDebt } from "../hooks/useDebt";
import { AppLink } from "@/components/ui/button/AppLink";
import TableContainer from "@/components/debt-payments/TableContainer";
import Link from "next/link";
import UsersTab from "./UsersTab";
import StatusBadge from "@/components/debts/StatusBadge";
import ActivityTimeline from "@/components/ui/timeline/ActivityTimeline";

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

type DebtDetailsProps = {
  id: string;
};

export default function DebtDetails({ id }: DebtDetailsProps) {
  const monthsT = useTranslations("MONTHS");

  const { debt } = useDebt(id);

  if (!debt) return null;

  const progress = Math.round((debt.paidAmount / debt.totalAmount) * 100);
  const remaining = debt.totalAmount - debt.paidAmount;
  const monthsRemaining = Math.max(debt.months - debt.monthsPaid, 0);

  const totalWithInterest = debt.monthlyAmount * debt.months;
  const totalInterest = totalWithInterest - debt.totalAmount;

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
            <AppLink path="/debt-payments/create" className="h-11 px-5">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Make Payment
            </AppLink>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-11 w-11 bg-transparent">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <Link href={`${id}/edit`}>
                  <DropdownMenuItem className="cursor-pointer">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Debt
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Amount
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
            <div className="text-2xl font-semibold text-foreground">{debt.totalAmountFormated}</div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Paid</span>
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-semibold text-accent">{debt.paidAmountFormated}</div>
            <div className="text-xs text-muted-foreground mt-1">{progress}% of total</div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Remaining
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(remaining, debt.currencyCode)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{monthsRemaining} months left</div>
          </div>

          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Monthly Payment
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
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
                  <span className="text-muted-foreground">Payment Progress</span>
                  <span className="font-medium text-foreground">
                    {debt.monthsPaid} of {debt.months} payments
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
                  <div className="text-xs text-muted-foreground mb-1">Start Date</div>
                  <div className="font-medium text-foreground text-sm">
                    {formatDate(debt.startDate, monthsT)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Due Date</div>
                  <div className="font-medium text-foreground text-sm">
                    {formatDate(debt.dueDate, monthsT)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Interest Rate</div>
                  <div className="font-medium text-foreground text-sm">
                    {debt.interestRate}% APR
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Interest Paid</div>
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
              Transactions
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-card">
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-card">
              Users
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-card">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <TableContainer debtId={id} />
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Debt Details */}
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Debt Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Original Amount</span>
                    <span className="font-medium text-foreground">{debt.totalAmountFormated}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Interest Rate</span>
                    <span className="font-medium text-foreground">{debt.interestRate}% APR</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Loan Term</span>
                    <span className="font-medium text-foreground">{debt.months} months</span>
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Payment Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(totalInterest, debt.currencyCode)}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-border">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-medium text-accent">{debt.paidAmountFormated}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-muted-foreground">Remaining Balance</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(remaining, debt.currencyCode)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {debt.description && (
              <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                <h3 className="font-semibold text-foreground mb-3">Description</h3>
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
      </div>
    </>
  );
}
