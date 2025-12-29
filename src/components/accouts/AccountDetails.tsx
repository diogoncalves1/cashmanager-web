"use client";

import useSWR from "swr";
import { useRouter } from "next/router";
import { Account } from "@/app/(admin)/(menu)/accounts/data-table";
import { fetcher } from "@/lib/fetcher";
import { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { Button } from "../ui/button";
import { Banknote, Building2Icon, CreditCard, Pencil, Wallet } from "lucide-react";
import Link from "next/link";

type AccountsDetailsProps = {
  id?: string;
};

const TypeIcons = {
  bank_account: <Building2Icon className="size-9" />,
  cash: <Banknote className="size-9" />,
  digital_wallet: <Wallet className="size-9" />,
  credit_card: <CreditCard className="size-9" />,
};

export default function AccountDetails({ id }: AccountsDetailsProps) {
  // const router = useRouter();

  const [account, setAccount] = useState<Account>();
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "users" | "settings">(
    "overview"
  );

  const badge = (active: boolean) =>
    active ? (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
        Ativa
      </span>
    ) : (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
        Inativa
      </span>
    );

  console.log(id);

  const { data, error, isLoading } = useSWR(
    id ? [`/accounts/${id}`, { method: "GET" }] : null,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setAccount(data.data);
    }

    console.log(data);

    if (error) {
      //   router.push("/accounts");
    }
  }, [data, error /*, router*/]);

  if (isLoading) return <></>;
  if (error) return <></>;
  if (!account) return <></>;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-sm">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900">Conta Principal</h1>

              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Ativa
              </span>
            </div>

            <p className="text-sm text-gray-500">Conta Corrente · EUR</p>
          </div>

          <div className="flex gap-3">
            <button className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition">
              Nova Transação
            </button>
            <button className="rounded-xl border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Balance Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />

        <div className="relative">
          <p className="text-sm opacity-80">Saldo Atual</p>
          <p className="mt-2 text-4xl font-bold tracking-tight">€ 12.450,00</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <p className="opacity-80">Entradas</p>
              <p className="font-semibold text-green-300">+ € 3.200</p>
            </div>
            <div>
              <p className="opacity-80">Saídas</p>
              <p className="font-semibold text-red-300">- € 1.850</p>
            </div>
            <div>
              <p className="opacity-80">Moeda</p>
              <p className="font-semibold">EUR</p>
            </div>
            <div>
              <p className="opacity-80">Tipo</p>
              <p className="font-semibold">Corrente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {[
          { id: "overview", label: "Visão Geral" },
          { id: "transactions", label: "Transações" },
          { id: "users", label: "Utilizadores" },
          { id: "settings", label: "Configurações" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative pb-3 text-sm font-medium transition ${
              activeTab === tab.id ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute left-1/4 right-1/4 -bottom-px h-0.5 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Transações", value: "128" },
                { label: "Utilizadores", value: "3" },
                { label: "Criada em", value: "Jan 2024" },
              ].map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl border bg-white p-6 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
                >
                  <p className="text-sm text-gray-500">{m.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border bg-white shadow-sm">
              <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Transações Recentes</h2>
              </div>

              <div className="divide-y">
                <div className="flex justify-between px-6 py-4 hover:bg-gray-50">
                  <span>Salário</span>
                  <span className="font-medium text-green-600">+ € 2.500</span>
                </div>
                <div className="flex justify-between px-6 py-4 hover:bg-gray-50">
                  <span>Spotify</span>
                  <span className="font-medium text-red-500">- € 9,99</span>
                </div>
                <div className="flex justify-between px-6 py-4 hover:bg-gray-50">
                  <span>Supermercado</span>
                  <span className="font-medium text-red-500">- € 76,45</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold">Detalhes da Conta</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Nome</span>
                <span>Conta Principal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tipo</span>
                <span>Corrente</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Moeda</span>
                <span>EUR</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Estado</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Ativa
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTIONS */}
      {activeTab === "transactions" && (
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4 flex justify-between">
            <h2 className="text-lg font-semibold">Todas as Transações</h2>
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white">Nova</button>
          </div>

          <div className="divide-y">
            {["Entrada", "Saída", "Transferência"].map((t, i) => (
              <div key={i} className="px-6 py-4 hover:bg-gray-50 flex justify-between">
                <span>{t}</span>
                <span>€ —</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS */}
      {activeTab === "users" && (
        <div className="rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4 flex justify-between">
            <h2 className="text-lg font-semibold">Utilizadores</h2>
            <button className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white">
              Adicionar
            </button>
          </div>

          <div className="divide-y">
            {[
              { name: "João Silva", role: "Owner", active: true },
              { name: "Maria Costa", role: "Editor", active: true },
              { name: "Pedro Rocha", role: "Viewer", active: false },
            ].map((u, i) => (
              <div key={i} className="px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium text-blue-700">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs text-gray-500">{u.role}</p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    u.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.active ? "Ativo" : "Inativo"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === "settings" && (
        <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">Configurações</h2>

          <div className="flex justify-between items-center">
            <span>Conta ativa</span>
            <input type="checkbox" defaultChecked />
          </div>

          <div className="flex justify-between items-center">
            <span>Permitir transferências</span>
            <input type="checkbox" defaultChecked />
          </div>

          <button className="rounded-xl border border-red-300 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
            Encerrar Conta
          </button>
        </div>
      )}
    </div>
  );
}
