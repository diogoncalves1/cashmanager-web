"use client";

import {
  MonthlySummary,
  MonthlySummaryChart,
} from "@/components/charts/accounts/MonthlySummaryChart";
import { Account } from "@/lib/models/account";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { memo } from "react";
import { useTranslations } from "next-intl";

type AccountMonthlySummaryProps = {
  account?: Account;
  data: MonthlySummary[];
};

function AccountMonthlySummary({ data, account }: AccountMonthlySummaryProps) {
  const t = useTranslations("ACCOUNTS");
  if (!account) return <></>;

  const exportToExcel = () => {
    if (!data?.length) return;

    const excelData = data.map((item) => {
      const revenue = item.totalRevenue || 0;
      const expense = item.totalExpense || 0;
      const profit = revenue - expense;

      return {
        [t("MONTH")]: item.month,
        [t("REVENUE")]: revenue,
        [t("EXPENSE")]: expense,
        [t("RESULT")]: profit,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resumo Mensal");

    const range = XLSX.utils.decode_range(worksheet["!ref"] ?? "A1");
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      ["B", "C", "D"].forEach((col) => {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: col.charCodeAt(0) - 65 });
        const cell = worksheet[cellAddress];
        if (cell) {
          cell.z = '#,##0.00 "€"'; // formato € português
        }
      });
    }

    XLSX.writeFile(workbook, `monthly-resume-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Resumo Mensal</h2>
      <div className="relative">
        <div className="absolute top-0 right-0 z-10">
          <button
            onClick={exportToExcel}
            disabled={!data?.length}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            title="Exportar resumo completo para Excel"
          >
            <Download size={16} />
            Exportar Excel
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8 pt-14">
          {data.map((monthData, idx) => {
            const profit = monthData.totalRevenue - monthData.totalExpense;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-bold text-center text-gray-800 mb-5">
                    {monthData.month}
                  </h3>

                  <div className="flex justify-center min-h-[280px] items-center">
                    <MonthlySummaryChart account={account} data={monthData || []} />
                  </div>

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-gray-600">Receita</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {monthData.totalRevenueFormated}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-gray-600">Despesa</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {monthData.totalExpenseFormated}
                      </span>
                    </div>

                    <div className="border-t pt-4 mt-3">
                      <div className="flex items-center justify-between text-base">
                        <span className="font-medium text-gray-700">Resultado</span>
                        <span
                          className={`font-bold text-lg ${
                            profit >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {monthData.profit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default memo(AccountMonthlySummary);
