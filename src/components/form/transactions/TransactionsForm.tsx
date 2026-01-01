"use client";

import { Button } from "@/components/ui/button";
import Label from "../Label";
import Form from "../Form";
import Input from "../input/InputField";
import { TransactionTypeSelector } from "./TransactionTypeSelector";
import { TransactionStatusSelect } from "./TransactionStatusSelect";
import { TransactionDatePicker } from "./TransactionDatePicker";
import { CategorySelect } from "./CategorySelect";
import { AccountSelect } from "./AccountSelect";
import RichTextEditor from "../input/RichTextEditor";
import { useTransactionForm } from "@/components/form/transactions/hooks/useTransactionForm";
import { SwalToast } from "@/components/swal/SwalToast";
import { TransactionStatus } from "@/lib/models/transaction";
import Swal from "sweetalert2";
import LoadingToast from "@/components/swal/LoadingToast";

type Props = { id?: string };

export function TransactionsForm({ id }: Props) {
  const {
    formData,
    setFormData,
    dateLimits,
    updateDateLimits,
    isSubmitting,
    handleSubmit,
    isLoadingTransaction,
    isLoadingCategories,
    isLoadingAccounts,
    categoriesData,
    accountsData,
  } = useTransactionForm(id);

  if (isLoadingTransaction) {
    return <div className="h-96 animate-pulse bg-gray-100 rounded" />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    LoadingToast({
      title: id ? "A atualizar..." : "A criar...",
      message: id ? "A atualizar transação..." : "A criar a sua transação...",
    });
    e.preventDefault();
    const result = await handleSubmit();
    SwalToast({
      message: result.message,
      icon: result.success ? "success" : "error",
    });
  };

  return (
    <Form
      onSubmit={onSubmit}
      className="grid-cols-12 xl:mx-20 gap-5 p-5 rounded-sm grid border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/[0.03]"
    >
      {!id && (
        <>
          <TransactionTypeSelector
            type={formData.type}
            onChangeType={(newType: TransactionStatus) =>
              setFormData((prev: any) => ({ ...prev, type: newType, category_id: "" }))
            }
          />

          <div className="md:col-span-6 col-span-12">
            <Label>Account *</Label>
            {isLoadingAccounts ? (
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            ) : (
              <AccountSelect
                accountData={accountsData}
                value={formData.account_id}
                onChange={(id: any) => setFormData((prev) => ({ ...prev, account_id: id }))}
              />
            )}
          </div>

          <div className="md:col-span-6 col-span-12">
            <Label>Estado *</Label>
            <TransactionStatusSelect
              value={formData.status}
              onChange={(status: TransactionStatus) => {
                setFormData((prev) => ({ ...prev, status }));
                updateDateLimits(status);
              }}
            />
          </div>
        </>
      )}

      <div className="md:col-span-6 col-span-12">
        <Label>Amount *</Label>
        <Input
          type="number"
          step={0.01} // ← número literal (sem aspas)
          min="0"
          placeholder="0,00"
          defaultValue={(formData.amount as number) ?? ""}
          onChange={(e) =>
            setFormData((p) => ({ ...p, amount: parseFloat(e.target.value) || undefined }))
          }
          required={true}
        />
      </div>

      <div className="md:col-span-6 col-span-12">
        <Label>Date *</Label>
        <TransactionDatePicker
          date={formData.date}
          onChangeDate={(newDate: any) => setFormData((p) => ({ ...p, date: newDate }))}
          dateLimits={dateLimits}
        />
      </div>

      <div className="col-span-12">
        <Label>Categoria *</Label>
        {isLoadingCategories ? (
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ) : (
          <CategorySelect
            categoriesData={categoriesData}
            value={formData.category_id}
            onChange={(id: any) => setFormData((p) => ({ ...p, category_id: id }))}
          />
        )}
        {formData.category_id === "" ? <>Testeo</> : <></>}
      </div>

      <div className="col-span-12">
        <Label>Descrição</Label>
        <RichTextEditor
          content={formData.description || ""}
          onChange={(html) => setFormData((p) => ({ ...p, description: html }))}
        />
      </div>

      <div className="col-span-12 flex justify-end">
        <Button type="submit" disabled={isSubmitting} className="min-w-32">
          {isSubmitting ? "Salvando..." : id ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </Form>
  );
}
