"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  useFinancialGoal,
  onCancelFinancialGoal,
  onResetFinancialGoal,
} from "@/features/financial-goals/server";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  MarkCompletedGoalTransactionDialog,
  DeleteFinancialGoalDialog,
  StatusBadge,
  PriorityInfo,
} from "@/features/financial-goals";
import {
  CheckCircle2,
  DoorOpen,
  Edit,
  EllipsisVertical,
  History,
  PauseCircle,
  PlayCircle,
  Target,
  Trash2Icon,
  Users,
} from "lucide-react";
import { InviteMemberButton, LeaveSubjectDialog } from "@/features/invitations";
import ActivityTimeline from "@/components/ui/timeline/ActivityTimeline";
import { UsersTable } from "@/features/financial-goals";
import { useAuth } from "@/features/auth";
import { FormTransactionDialog, TableContainer } from "@/features/financial-goal-transactions";
import CreateButton from "@/shared/ui/create-button";
import CustomTabList from "@/shared/ui/custom-tab-list";

type FinancialGoalDetailsProps = {
  id: string;
};

export function FinancialGoalDetails({ id }: FinancialGoalDetailsProps) {
  const monthsT = useTranslations("MONTHS");
  const t = useTranslations("FINANCIAL_GOALS");
  const { user } = useAuth();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmOpen] = useState(false);
  const [leaveSubject, setLeaveSubject] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const { financialGoal, loading, error, setUpdate } = useFinancialGoal({ id: id });

  useEffect(() => {
    if (error) {
      router.back();
    }
  }, [error, router]);

  if (loading) {
    return (
      <div className="grid gap-3 animate-pulse">
        <div className="h-24 rounded-lg bg-white shadow-md dark:bg-gray-800/60" />
        <div className="h-40 rounded-lg bg-white shadow-md dark:bg-gray-800/60" />
        <div className="h-64 rounded-lg bg-white shadow-md dark:bg-gray-800/60" />
      </div>
    );
  }

  if (!financialGoal) return <></>;

  const progress =
    financialGoal.totalAmount > 0
      ? Math.min(
          Math.round((financialGoal.contributedAmount / financialGoal.totalAmount) * 100),
          100
        )
      : 0;
  const daysRemaining = Math.ceil(
    (new Date(financialGoal.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentUserShare = financialGoal.users?.find((userShare) => userShare.id == user?.id);
  const canLeaveGoal = currentUserShare?.sharedRole?.code != "creator";
  const hasDangerActions = financialGoal.actions?.destroy || canLeaveGoal;

  return (
    <div className="grid gap-3">
      <div>
        {/* Header Section */}
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
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
                {t("TARGET")}: {formatDate(financialGoal.dueDate, monthsT)}
              </span>
              <span className="text-muted-foreground">
                {daysRemaining >= 0
                  ? `${daysRemaining} ${t("DAYS_REMAINING")}`
                  : `${-daysRemaining} ${t("DAYS_PASSED")}`}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {financialGoal.actions?.createTransactions && (
              <CreateButton className="ml-auto" onClick={() => setIsOpen(true)}>
                {t("NEW_TRANSACTION")}
              </CreateButton>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="app" size="icon-lg">
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-card">
                {financialGoal.actions?.edit && (
                  <Link href={`${id}/edit`}>
                    <DropdownMenuItem>
                      <Edit className="size-4" />
                      {t("EDIT_GOAL")}
                    </DropdownMenuItem>
                  </Link>
                )}
                {financialGoal.status == "in_progress" && financialGoal.actions?.edit && (
                  <DropdownMenuItem
                    onClick={() => onCancelFinancialGoal(id, t, () => setUpdate(true))}
                  >
                    <PauseCircle className="size-4" />
                    {t("CANCEL_GOAL")}
                  </DropdownMenuItem>
                )}
                {financialGoal.status != "in_progress" && financialGoal.actions?.edit && (
                  <DropdownMenuItem
                    onClick={() => onResetFinancialGoal(id, t, () => setUpdate(true))}
                  >
                    <PlayCircle className="size-4" />
                    {t("RESET_GOAL")}
                  </DropdownMenuItem>
                )}

                {financialGoal.actions?.edit &&
                  financialGoal.contributedAmount >= financialGoal.totalAmount &&
                  financialGoal.status == "in_progress" && (
                    <DropdownMenuItem onClick={() => setIsConfirmOpen(true)}>
                      <CheckCircle2 className="size-4" />
                      {t("COMPLETE_GOAL")}
                    </DropdownMenuItem>
                  )}
                {hasDangerActions && <DropdownMenuSeparator />}
                {canLeaveGoal && (
                  <DropdownMenuItem
                    onClick={async () => {
                      setLeaveSubject(true);
                    }}
                  >
                    <DoorOpen className="size-4" />
                    {t("LEAVE_GOAL")}
                  </DropdownMenuItem>
                )}
                {financialGoal.actions?.destroy && (
                  <DropdownMenuItem variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                    <Trash2Icon className="size-4" />
                    {t("DELETE_GOAL")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Card */}
        <div className="mb-3 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800/60">
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
                  <span className="text-xs text-muted-foreground capitalize">
                    {t("P_COMPLETE")}
                  </span>
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
                    {t("OF")} {financialGoal.totalAmountFormated}
                  </span>
                </div>
                {financialGoal.missingAmount > 0 ? (
                  <span className="text-accent font-medium">
                    {financialGoal.missingAmountFormated} {t("TO_FINISH")}
                  </span>
                ) : (
                  <span className="text-accent font-medium">{t("COMPLETED")}</span>
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
        <div className="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {t("TARGET")}
            </div>
            <div className="text-xl font-bold text-foreground">
              {financialGoal.totalAmountFormated}
            </div>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {t("CONTRIBUTED")}
            </div>
            <div className="text-xl font-bold text-accent">
              {financialGoal.contributedAmountFormated}
            </div>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {t("CURRENCY")}
            </div>
            <div className="text-xl font-bold text-foreground">{financialGoal.currencyCode}</div>
          </div>
          <div className="rounded-lg bg-white p-5 shadow-md dark:bg-gray-800/60">
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
              {t("CONTRIBUTORS")}
            </div>
            <div className="text-xl font-bold text-foreground">{financialGoal.users?.length}</div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="transactions" className="grid gap-3">
          <CustomTabList
            tabs={[
              { icon: Target, label: t("TRANSACTIONS"), value: "transactions" },
              { icon: Users, label: t("CONTRIBUTORS"), value: "contributors" },
              { icon: History, label: t("ACTIVITY"), value: "activity" },
            ]}
          />

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="grid gap-3">
            <TableContainer financialGoalId={id} load={loading} />
          </TabsContent>

          {/* Contributors Tab */}
          <TabsContent value="contributors" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{t("ASSOCIATED_USERS")}</h2>
              <InviteMemberButton type="financial-goals" id={id} />
            </div>
            <UsersTable users={financialGoal.users} id={id} setLoad={setUpdate} />
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="grid gap-3">
            <ActivityTimeline type="financial-goals" id={id} />
          </TabsContent>
        </Tabs>
      </div>

      <FormTransactionDialog
        financialGoalId={id}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        mutate={() => {
          setUpdate(true);
        }}
      />

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
