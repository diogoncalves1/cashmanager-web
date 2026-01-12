"use client";

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, AlertTriangle, Star, Pencil } from "lucide-react";
import { Transaction } from "@/lib/models/transaction";
import * as LucideIcons from "lucide-react";
import { RelationSection } from "./RelationSection";
import { RelatedTransaction } from "./RelationTransaction";
import Badge from "@/components/ui/badge/Badge";

type Tab = "overview" | "relations" | "actions";

type Props = {
  id: string;
};

export default function TransactionDetails({ id }: Props) {
  const router = useRouter();
  const [transaction, setTransaction] = useState<Transaction>();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { data, error, isLoading } = useSWR(
    id ? [`/transactions/${id}`, { method: "GET" }] : null,
    fetcher
  );

  useEffect(() => {
    if (data?.data) setTransaction(data.data);
    if (error) router.push("/transactions");
  }, [data, error, router]);

  if (isLoading || !transaction) {
    return (
      <div className="p-6 space-y-6 max-w-6xl mx-auto animate-pulse">
        <div className="h-20 bg-gray-100 rounded-2xl" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const Icon = LucideIcons[transaction.category?.icon ?? "Circle"] as any;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row justify-between gap-6"
      >
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm"
            style={{
              color: transaction.category?.color,
              backgroundColor: `${transaction.category?.color}1A`,
            }}
          >
            <Icon size={28} />
          </div>

          {/* Text */}
          <div className="space-y-1">
            <h1 className="text-3xl font-bold leading-tight">{transaction.category?.name}</h1>

            {transaction.description && (
              <p className="text-gray-500 max-w-xl">{stripHtml(transaction.description)}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <span>{transaction.date}</span>
              <span className="text-gray-300">•</span>
              <span className="uppercase tracking-wide">{transaction.typeTranslated}</span>
            </div>
          </div>
        </div>

        <div className="text-right space-y-3">
          <p className="text-3xl font-bold text-indigo-600">{transaction.amountFormated}</p>
          <Badge
            type="rounded"
            size="lg"
            color={transaction.status == "completed" ? "success" : "warning"}
          >
            <LucideIcons.Dot className="size-4" strokeWidth={6} />
            {transaction.statusTranslated}
          </Badge>
        </div>
      </motion.div>

      {/* IMPACTO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Impacto no mês", value: "42%" },
          { label: "Média da categoria", value: "R$ 89,00" },
          { label: "Comparação", value: "+45% acima da média" },
        ].map((item) => (
          <div key={item.label} className="bg-gray-50 rounded-2xl p-6 shadow">
            <p className="text-gray-500">{item.label}</p>
            <p className="text-xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div className="flex gap-6 border-b">
        {["overview", "relations", "actions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as Tab)}
            className={`pb-3 font-medium capitalize ${
              activeTab === tab
                ? "border-b-2 border-indigo-600 text-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="space-y-6"
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-6">
              <InfoCard title="Usuário" value={transaction.userName as string} />
              <InfoCard title="Conta" value={transaction.accountName as string} />
              <InfoCard title="Tipo" value={transaction.typeTranslated as string} />
              <InfoCard title="Categoria" value={transaction.category?.name as string} />
            </div>
          )}

          {activeTab === "relations" && (
            <motion.div
              key="relations"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              {/* Bloco 1 - Transações semelhantes */}
              <RelationSection
                title="Transações semelhantes"
                description="Baseado em categoria, valor e descrição"
              >
                <RelatedTransaction
                  title="Restaurante"
                  date="12 Dez 2025"
                  amount="R$ 92,00"
                  highlight="Mesmo padrão de valor"
                />
                <RelatedTransaction
                  title="Restaurante"
                  date="28 Nov 2025"
                  amount="R$ 105,50"
                  highlight="Categoria idêntica"
                />
              </RelationSection>

              {/* Bloco 3 - Mesmo usuário */}
              <RelationSection
                title="Outras transações do usuário"
                description="Atividades recentes relacionadas"
              >
                <RelatedTransaction
                  title="Supermercado"
                  date="05 Jan 2026"
                  amount="R$ 230,00"
                  highlight="Mesmo usuário"
                />
              </RelationSection>
            </motion.div>
          )}

          {activeTab === "actions" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ActionCard icon={<Pencil />} label="Editar transação" />
              <ActionCard icon={<Star />} label="Favoritar" />
              <ActionCard icon={<AlertTriangle />} label="Reportar problema" />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ======================= */
/* COMPONENTES AUXILIARES */
/* ======================= */

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 shadow">
      <p className="text-gray-500">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function ActionCard({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition flex items-center gap-3">
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
