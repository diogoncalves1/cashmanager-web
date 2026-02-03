"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, formatDate } from "@/lib/utils";
import { useFinancialGoalTransaction } from "../hooks/useFinancialGoalTransaction";
import { useTranslations } from "next-intl";
import EditGoalTransactionDialog from "@/components/ui/dialogs/GoalTransactions/EditGoalTransactionDialog";
import { useFinancialGoalTransactionForm } from "@/app/(root)/(menu)/financial-goal-transactions/create/hooks/useFinancialGoalTransactionForm";
import { useRouter } from "next/navigation";
import DeleteGoalTransactionDialog from "@/components/ui/dialogs/GoalTransactions/DeleteGoalTransactionDialog";
import { Check } from "lucide-react";
import ConfirmGoalTransactionDialog from "@/components/ui/dialogs/GoalTransactions/ConfirmGoalTransactionDialog";

const statusConfig = {
  completed: { className: "bg-accent/15 text-accent border-accent/30" },
  pending: {
    className: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  },
};

const typeConfig = {
  contribution: { label: "Contribution", icon: "+" },
  withdrawal: { label: "Withdrawal", icon: "-" },
};

export default function GoalTransactionDetails({ id }: { id: string }) {
  const router = useRouter();
  const { goalTransaction, loading, error, setUpdate } = useFinancialGoalTransaction({ id: id });
  const { formData, setFormData, handleSubmit } = useFinancialGoalTransactionForm(id);

  const monthsT = useTranslations("MONTHS");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (goalTransaction)
      setFormData({
        description: goalTransaction.description,
        amount: goalTransaction.amount,
        date: goalTransaction.date,
      });
    else if (!loading) {
      router.push("/financial-goal-transactions");
    }
  }, [goalTransaction]);

  if (!goalTransaction || loading || error) return <></>;

  const status = statusConfig[goalTransaction.status];
  const type = typeConfig[goalTransaction.type];

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="rounded-2xl bg-card border border-border p-6 md:p-8 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Left: Transaction Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-xl font-semibold",
                    goalTransaction.type === "contribution"
                      ? "bg-accent/15 text-accent"
                      : "bg-destructive/15 text-destructive"
                  )}
                >
                  {type.icon}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">
                    {goalTransaction.typeTranslated}
                  </h1>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span
                  className={cn(
                    "text-4xl font-bold",
                    goalTransaction.type === "contribution" ? "text-accent" : "text-destructive"
                  )}
                >
                  {goalTransaction.type === "contribution" ? "+ " : "- "}
                  {goalTransaction.amountFormated}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                    status.className
                  )}
                >
                  {goalTransaction.statusTranslated}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(goalTransaction.date, monthsT)}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {goalTransaction.actions.edit && (
                <Button
                  onClick={() => setEditDialogOpen(true)}
                  className="h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5"
                >
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
                  Edit
                </Button>
              )}
              {(goalTransaction.actions.destroy || goalTransaction.actions.confirm) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {goalTransaction.actions.confirm && (
                      <DropdownMenuItem
                        onClick={() => setIsConfirmOpen(true)}
                        className=" focus:text-black"
                      >
                        <Check className="size-4 mr-2" />
                        Confirm
                      </DropdownMenuItem>
                    )}
                    {goalTransaction.actions.destroy && (
                      <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-destructive focus:text-destructive"
                      >
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 h-full flex flex-col">
            {/* Balance Breakdown */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm h-full flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-4">Balance Breakdown</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Previous Balance</span>
                  <span className="font-medium text-foreground">
                    {goalTransaction.balanceBefore}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">
                    {goalTransaction.type === "contribution" ? "Amount Added" : "Amount Withdrawn"}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      goalTransaction.type === "contribution" ? "text-accent" : "text-destructive"
                    )}
                  >
                    {goalTransaction.type === "contribution" ? "+" : "-"}
                    {goalTransaction.amountFormated}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="font-medium text-foreground">New Balance</span>
                  <span className="text-xl font-semibold text-foreground">
                    {goalTransaction.balanceAfter}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes / Description */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm h-full flex flex-col">
              <h2 className="text-lg font-semibold text-foreground mb-4">Notes</h2>
              <p className="text-muted-foreground leading-relaxed">
                {goalTransaction.description || "No description provided."}
              </p>
            </div>

            {/* Transaction History */}
            {/* <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Transaction History</h2>
              <div className="relative">
                <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
                <div className="space-y-4">
                  {transaction.history.map((event, index) => (
                    <div key={index} className="relative flex items-start gap-4 pl-8">
                      <div
                        className={cn(
                          "absolute left-0 w-6 h-6 rounded-full flex items-center justify-center",
                          index === transaction.history.length - 1
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary"
                        )}
                      >
                        {index === transaction.history.length - 1 ? (
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{event.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {event.date} by {event.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div> */}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6  h-full flex flex-col">
            {/* User Info */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Created By
              </h2>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-secondary text-foreground font-medium">
                    {goalTransaction.userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{goalTransaction.userName}</p>
                  <p className="text-sm text-muted-foreground">{goalTransaction.sharedRole}</p>
                </div>
              </div>
            </div>

            {/* Goal Info */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm flex flex-col">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Linked Goal
              </h2>
              <Link
                href={`/financial-goals/${goalTransaction.financialGoalId}`}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-foreground">
                    {goalTransaction.financialGoalName}
                  </span>
                </div>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            {/* Account Info */}
            <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                Payment Account
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Account</span>
                  <span className="text-sm font-medium text-foreground">
                    {goalTransaction.accountName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tipo</span>
                  <span className="text-sm font-medium text-foreground">
                    {goalTransaction.accountType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditGoalTransactionDialog
        isEditGoalOpen={editDialogOpen}
        setIsEditGoalOpen={setEditDialogOpen}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        formData={formData}
        mutate={() => setUpdate(true)}
      />

      <DeleteGoalTransactionDialog
        isDeleteDialogOpen={deleteDialogOpen}
        setIsDeleteOpen={setDeleteDialogOpen}
        selectedId={id}
        mutate={() => setUpdate(true)}
        goBack={true}
      />

      <ConfirmGoalTransactionDialog
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmOpen={setIsConfirmOpen}
        mutate={() => setUpdate(true)}
        selectedId={id}
      />
    </>
  );
}
