"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Wallet,
  CreditCard,
  Banknote,
  Smartphone,
  LucideIcon,
} from "lucide-react";
import Badge from "../ui/badge/Badge";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { Account, AccountType } from "@/lib/models/account";
import React from "react";
import Link from "next/link";


const accountTypeIcons: Record<AccountType, LucideIcon> = {
  cash: Banknote,          
  credit_card: CreditCard, 
  bank_account: Wallet,    
  digital_wallet: Smartphone, 
};

export default function Accounts() {

    const { data, error, isLoading } = useSWR(["/accounts", { method: "GET" }], fetcher);

  console.log(data);

  if (isLoading) return <p>Carregando...</p>;  
  if (error) return <p>Erro ao carregar: {error.message}</p>;
  if (!data) return <p>Nenhum dado disponível</p>;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Orders
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/accounts" className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            See all
          </Link>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Products
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Category
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Price
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Status
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.data.map((account: Account) => (
              <TableRow key={account.id} className="">
                <TableCell className="py-3">
                  <div className="flex items-center gap-3">
                  <div className="h-[30px] w-[30px] overflow-hidden rounded-md">
                     {React.createElement(accountTypeIcons[account.type], {
                        className:"h-[30px] w-[30px]",
                    })}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {account.name}
                      </p>
                      <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                        {account.typeTranslated}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {account.balance}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {account.users?.map(user => user.name)}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      account.active === true
                        ? "success"
                        : "error"
                    }
                  >
                    {account.active === true ? 'Ativa' : 'Inativa'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
