import { motion } from "framer-motion";
import {
  CategoryExpensesChart,
  CategorySummary,
} from "@/components/charts/accounts/CategoryExpensesChart";
import { Account } from "@/lib/models/account";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { memo } from "react";

type CategoryChartProps = {
  data: CategorySummary;
  account?: Account;
};

function AccountCategoryExpenses({ data, account }: CategoryChartProps) {
  if (!account) return <></>;

  const exportToExcel = () => {
    if (!data || data.data.length === 0) return;

    const excelData = data.data.map((item) => {
      const value = item.valueFormatedWithoutSymbol || 0;

      return {
        Categoria: item.category,
        Valor: value,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      ["B", "C", "D"].forEach((col) => {
        const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: col.charCodeAt(0) - 65 })];
        if (cell) {
          cell.z = "#,##0.00 ";
        }
      });
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Despesas Categoria");

    // Download
    XLSX.writeFile(workbook, `resumo-mensal-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Categorias de Despesa</h2>
      <div className="relative">
        <div className="absolute top-0 right-0 z-10">
          <button
            onClick={exportToExcel}
            disabled={data.data.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
            title="Exportar resumo completo para Excel"
          >
            <Download size={16} />
            Exportar Excel (.xlsx)
          </button>
        </div>

        <div className="grid grid-cols-1 py-8 pt-14">
          <div className=" overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center">
                <CategoryExpensesChart data={data || []} account={account} />
              </div>
              <div className="mt-6 space-y-3">
                {data.data.map((i, id) => (
                  <div key={id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full "
                        style={{ backgroundColor: i.color }}
                      ></div>
                      <span className="text-gray-600">{i.category}</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {i.valueFormatedWithoutSymbol}
                    </span>
                  </div>
                ))}

                <div className="border-t pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Total</span>
                    <span className={`font-bold text-lg text-red-600`}>{data.totalFormated}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default memo(AccountCategoryExpenses);
