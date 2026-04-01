"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type PublicDrug = {
  id: string;
  name: string;
  form?: string;
  strength?: string;
  laboratory?: string;
  atcCode?: string;
  country?: string;
  source?: string;
};

type SortValue = "NAME_ASC" | "NAME_DESC";

type AdminMedicamentsResponse = {
  items: PublicDrug[];
  total: number;
  limit: number;
  offset: number;
};

function sourceLabel(source?: string) {
  if (!source) return "Interne";
  const value = source.toLowerCase();
  if (value.includes("openfda")) return "OpenFDA";
  if (value.includes("sample")) return "Sample";
  return source;
}

function statusLabel(item: PublicDrug) {
  if (item.atcCode) return "Validé";
  if (item.source?.toLowerCase().includes("sample")) return "Échantillon";
  return "À vérifier";
}

function statusTone(status: string) {
  if (status === "Validé") return "bg-emerald-100 text-emerald-700";
  if (status === "Échantillon") return "bg-sky-100 text-sky-700";
  return "bg-amber-100 text-amber-700";
}

export default function AdminMedicamentsPage() {
  const [items, setItems] = useState<PublicDrug[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [formFilter, setFormFilter] = useState("ALL");
  const [sort, setSort] = useState<SortValue>("NAME_ASC");

  const loadData = useCallback(async (mode: "initial" | "refresh" = "initial") => {
    if (mode === "initial") setLoading(true);
    if (mode === "refresh") setRefreshing(true);
    setError(null);

    const params = new URLSearchParams({
      limit: "50",
      offset: "0",
    });
    if (query.trim()) params.set("q", query.trim());

    const result = await apiJsonAuth<AdminMedicamentsResponse>(
      `/api/admin/medicaments?${params.toString()}`
    );

    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible de charger la base médicaments.");
      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
      return;
    }

    setItems(result.data.items ?? []);
    setTotalAvailable(result.data.total ?? 0);
    if (mode === "initial") setLoading(false);
    if (mode === "refresh") setRefreshing(false);
  }, [query]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const forms = useMemo(() => {
    return Array.from(
      new Set(
        items
          .map((item) => item.form?.trim())
          .filter((item): item is string => Boolean(item))
      )
    ).sort((a, b) => a.localeCompare(b, "fr"));
  }, [items]);

  const filteredItems = useMemo(() => {
    let list = items;

    if (formFilter !== "ALL") {
      list = list.filter((item) => (item.form ?? "") === formFilter);
    }

    const sorted = [...list].sort((a, b) => {
      const left = a.name.toLowerCase();
      const right = b.name.toLowerCase();
      return sort === "NAME_ASC" ? left.localeCompare(right) : right.localeCompare(left);
    });

    return sorted;
  }, [formFilter, items, sort]);

  const total = totalAvailable;
  const validated = items.filter((item) => statusLabel(item) === "Validé").length;
  const formsCount = forms.length;
  const sourcesCount = new Set(items.map((item) => sourceLabel(item.source))).size;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Base Médicaments</h1>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un médicament..."
            className="w-64 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <button
            onClick={() => void loadData("refresh")}
            disabled={refreshing}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
          >
            {refreshing ? "Actualisation..." : "Actualiser"}
          </button>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Médicaments chargés</p>
          <p className="mt-2 text-2xl font-semibold">{total}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Maximum 50 par requête API</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Entrées validées</p>
          <p className="mt-2 text-2xl font-semibold">{validated}</p>
          <p className="mt-2 text-[11px] text-emerald-600">Avec code ATC</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Formes disponibles</p>
          <p className="mt-2 text-2xl font-semibold">{formsCount}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Comprimé, capsule, sirop…</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Sources</p>
          <p className="mt-2 text-2xl font-semibold">{sourcesCount}</p>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">Origines de données</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="text-sm font-semibold">Tous les médicaments</h2>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={formFilter}
              onChange={(event) => setFormFilter(event.target.value)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              <option value="ALL">Toutes les formes</option>
              {forms.map((form) => (
                <option key={form} value={form}>
                  {form}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              <option value="NAME_ASC">Nom (A-Z)</option>
              <option value="NAME_DESC">Nom (Z-A)</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full text-xs">
              <thead className="bg-[#F8FAFC] text-[#6B7280]">
                <tr>
                  <th className="px-4 py-3 text-left">Nom</th>
                  <th className="px-4 py-3 text-left">Forme</th>
                  <th className="px-4 py-3 text-left">Dosage</th>
                  <th className="px-4 py-3 text-left">Laboratoire</th>
                  <th className="px-4 py-3 text-left">ATC</th>
                  <th className="px-4 py-3 text-left">Pays</th>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={8} className="px-4 py-6 text-center text-[#6B7280]">
                      Chargement des médicaments...
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={8} className="px-4 py-6 text-center text-[#6B7280]">
                      Aucun médicament trouvé.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const status = statusLabel(item);
                    return (
                      <tr key={item.id} className="border-t border-[#E5E7EB]">
                        <td className="px-4 py-3 font-semibold text-[#1F1D1B]">{item.name}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{item.form ?? "-"}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{item.strength ?? "-"}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{item.laboratory ?? "-"}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{item.atcCode ?? "-"}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{item.country ?? "-"}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{sourceLabel(item.source)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusTone(status)}`}
                          >
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-4 text-xs text-[#6B7280]">
          <span>
            {filteredItems.length} résultat(s) affiché(s) / {totalAvailable} total
          </span>
          <span>API: `/api/admin/medicaments`</span>
        </div>
      </div>
    </div>
  );
}
