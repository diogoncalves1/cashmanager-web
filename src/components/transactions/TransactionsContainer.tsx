"use client";

import { useState } from "react";
import TableContainer from "./TableContainer";
import { NewTransactionButton } from "@/components/transactions/NewTransactionButton";

const TransactionsContainer = () => {
  const [load, setLoad] = useState(false);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all transactions across your accounts.
          </p>
        </div>
        <NewTransactionButton setLoad={setLoad} />
      </div>

      {/* Summary cards */}
      <TableContainer load={load} />
    </div>
  );
};

export default TransactionsContainer;
