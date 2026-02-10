"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { useFinancialGoal } from "../hooks/useFinancialGoal";
import { useTranslations } from "next-intl";
import { AppLink } from "@/components/ui/button/AppLink";
import { FinancialGoalTransactionsDataTable } from "../../../financial-goal-transactions/data-table";
import Link from "next/link";
import PriorityInfo from "@/components/financial-goals/PriorityInfo";
import DeleteFinancialGoalDialog from "@/components/ui/dialogs/FinancialGoals/DeleteFinancialGoalDialog";
import StatusBadge from "@/components/financial-goals/StatusBadge";
import MarkCompletedGoalTransactionDialog from "@/components/ui/dialogs/FinancialGoals/MarkCompletedGoalTransactionDialog";
import { onCancelFinancialGoal, onResetFinancialGoal } from "@/services/financial-goals/service";
import {
  CheckCircle2,
  DoorOpen,
  EllipsisVertical,
  PlayCircle,
  Plus,
  Trash2Icon,
} from "lucide-react";
import InviteMemberButton from "@/components/ui/button/InviteMemberButton";
import ActivityTimeline from "@/components/ui/timeline/ActivityTimeline";
import UsersTable from "./UsersTable";
import { useAuth } from "@/context/AuthContext";
import { onLeaveSuject } from "@/services/invitations/invitations.service";
import LeaveSubjectDialog from "@/components/invitations/LeaveSubjectDialog";

type FinancialGoalDetailsProps = {
  id: string;
};

export default function FinancialGoalDetails({ id }: FinancialGoalDetailsProps) {
  const monthsT = useTranslations("MONTHS");
  const t = useTranslations("FINANCIAL_GOAL");
  const { user } = useAuth();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmOpen] = useState(false);
  const [leaveSubject, setLeaveSubject] = useState(false);

  const router = useRouter();

  const { financialGoal, loading, error, setUpdate } = useFinancialGoal({ id: id });

  useEffect(() => {
    if (error) {
      router.back();
    }
  }, [error, router]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-24 rounded-2xl bg-gray-100" />
        <div className="h-40 rounded-3xl bg-gray-100" />
        <div className="h-64 rounded-2xl bg-gray-100" />
      </div>
    );
  }

  if (!financialGoal) return <></>;

  const progress = Math.min(
    Math.round((financialGoal.contributedAmount / financialGoal.totalAmount) * 100),
    100
  );
  const daysRemaining = Math.ceil(
    (new Date(financialGoal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-6 space-y-8">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">
                {financialGoal.name}
              </h1>
              <StatusBadge
                status={financialGoal.status}
                translate={financialGoal.statusTranslated}
              />
            </div>
            <div className="flex items-center gap-4 text-sm flex-wrap">
              <PriorityInfo
                priority={financialGoal.priority}
                translate={financialGoal.priorityTranslated}
              />
              <span className="text-muted-foreground">
                Target: {formatDate(financialGoal.dueDate, monthsT)}
              </span>
              <span className="text-muted-foreground">
                {daysRemaining >= 0
                  ? `${daysRemaining} days remaining`
                  : `${-daysRemaining} days passed`}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <EllipsisVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {financialGoal.actions?.edit && (
                  <Link href={`${id}/edit`}>
                    <DropdownMenuItem>
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
                      Edit Goal
                    </DropdownMenuItem>
                  </Link>
                )}
                {financialGoal.status == "in_progress" && financialGoal.actions?.edit && (
                  <DropdownMenuItem
                    onClick={() => onCancelFinancialGoal(id, t, () => setUpdate(true))}
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
                        d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Cancel Goal
                  </DropdownMenuItem>
                )}
                {financialGoal.status != "in_progress" && financialGoal.actions?.edit && (
                  <DropdownMenuItem
                    onClick={() => onResetFinancialGoal(id, t, () => setUpdate(true))}
                  >
                    <PlayCircle className="size-4 mr-2" />
                    Reset Goal
                  </DropdownMenuItem>
                )}

                {financialGoal.actions?.edit &&
                  financialGoal.contributedAmount >= financialGoal.totalAmount &&
                  financialGoal.status == "in_progress" && (
                    <DropdownMenuItem onClick={() => setIsConfirmOpen(true)}>
                      <CheckCircle2 className="size-4 mr-2" />
                      Complete Goal
                    </DropdownMenuItem>
                  )}

                {financialGoal.actions?.edit && <DropdownMenuSeparator />}

                {financialGoal?.users?.find((userShare) => userShare.id == user?.id)?.sharedRole
                  ?.code != "creator" && (
                  <DropdownMenuItem
                    onClick={async () => {
                      setLeaveSubject(true);
                    }}
                  >
                    <DoorOpen className="size-4 mr-2" />
                    Leave Goal
                  </DropdownMenuItem>
                )}
                {financialGoal.actions?.destroy && (
                  <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                    <Trash2Icon className="size-4 mr-2" />
                    Delete Goal
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <InviteMemberButton isLigth={true} id={id} type="financial-goals" />

            <AppLink path="/financial-goal-transactions/create" size="sm">
              <Plus
                className="w-4 h-4 sm:mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              />
              <span className="hidden sm:inline">Add Transaction</span>
            </AppLink>
          </div>
        </div>

        {/* Progress Card */}
        <div className="rounded-2xl bg-card border border-border p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Circular Progress */}
            <div className="flex items-center justify-center lg:justify-start">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${progress * 3.52} 352`}
                    className="text-accent transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{progress}%</span>
                  <span className="text-xs text-muted-foreground">Complete</span>
                </div>
              </div>
            </div>

            {/* Progress Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <span className="text-3xl font-bold text-foreground">
                    {financialGoal.contributedAmountFormated}
                  </span>
                  <span className="text-muted-foreground ml-2">
                    of {financialGoal.totalAmountFormated}
                  </span>
                </div>
                {financialGoal.missingAmount > 0 ? (
                  <span className="text-accent font-medium">
                    {financialGoal.missingAmountFormated} to go
                  </span>
                ) : (
                  <span className="text-accent font-medium">Completed</span>
                )}
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {financialGoal.description}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Target</div>
            <div className="text-xl font-bold text-foreground">
              {financialGoal.totalAmountFormated}
            </div>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Contributed
            </div>
            <div className="text-xl font-bold text-accent">
              {financialGoal.contributedAmountFormated}
            </div>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Currency
            </div>
            <div className="text-xl font-bold text-foreground">{financialGoal.currencyCode}</div>
          </div>
          <div className="p-5 rounded-xl bg-card border border-border shadow-sm">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              Contributors
            </div>
            <div className="text-xl font-bold text-foreground">{financialGoal.users?.length}</div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-card">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="contributors" className="data-[state=active]:bg-card">
              Contributors
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-card">
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <div className="rounded-2xl bg-card border border-border shadow-sm overflow-hidden">
              <FinancialGoalTransactionsDataTable financialGoalId={id} enableFilters={false} />
            </div>
          </TabsContent>

          {/* Contributors Tab */}
          <TabsContent value="contributors">
            <UsersTable users={financialGoal.users} id={id} setLoad={setUpdate} />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <ActivityTimeline type="financial-goals" id={id} />
          </TabsContent>
        </Tabs>
      </div>

      <MarkCompletedGoalTransactionDialog
        isConfirmDialogOpen={isConfirmDialogOpen}
        setIsConfirmOpen={setIsConfirmOpen}
        selectedId={id}
        mutate={() => setUpdate(true)}
      />

      <LeaveSubjectDialog
        isOpen={leaveSubject}
        type="financial-goals"
        id={id}
        setIsOpen={setLeaveSubject}
        goBack={true}
      />

      <DeleteFinancialGoalDialog
        goBack={true}
        selectedId={id}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
      />
    </div>
  );
}
