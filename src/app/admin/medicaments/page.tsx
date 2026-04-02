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
type PageSize = 20 | 50;

type AdminMedicamentsResponse = {
  items: PublicDrug[];
  total: number;
  limit: number;
  offset: number;
};

type MedicamentDraft = {
  name: string;
  form: string;
  strength: string;
  laboratory: string;
  atcCode: string;
  country: string;
  source: string;
};

const EMPTY_DRAFT: MedicamentDraft = {
  name: "",
  form: "",
  strength: "",
  laboratory: "",
  atcCode: "",
  country: "",
  source: "",
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

function draftFromItem(item: PublicDrug): MedicamentDraft {
  return {
    name: item.name ?? "",
    form: item.form ?? "",
    strength: item.strength ?? "",
    laboratory: item.laboratory ?? "",
    atcCode: item.atcCode ?? "",
    country: item.country ?? "",
    source: item.source ?? "",
  };
}

function buildPayload(draft: MedicamentDraft) {
  const payload: Record<string, string> = { name: draft.name.trim() };
  const fields: Array<keyof Omit<MedicamentDraft, "name">> = [
    "form",
    "strength",
    "laboratory",
    "atcCode",
    "country",
    "source",
  ];

  for (const field of fields) {
    const value = draft[field].trim();
    if (value) payload[field] = value;
  }

  return payload;
}

export default function AdminMedicamentsPage() {
  const [items, setItems] = useState<PublicDrug[]>([]);
  const [totalAvailable, setTotalAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [draft, setDraft] = useState<MedicamentDraft>(EMPTY_DRAFT);
  const [query, setQuery] = useState("");
  const [formFilter, setFormFilter] = useState("ALL");
  const [sort, setSort] = useState<SortValue>("NAME_ASC");
  const [limit, setLimit] = useState<PageSize>(20);
  const [page, setPage] = useState(1);

  const loadData = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);
      setError(null);

      const offset = (page - 1) * limit;
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      });
      if (query.trim()) params.set("q", query.trim());
      if (formFilter !== "ALL") params.set("form", formFilter);
      params.set("sort", sort);

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
      setSuccess(null);

      const maxPages = Math.max(1, Math.ceil((result.data.total ?? 0) / limit));
      if (page > maxPages) {
        setPage(maxPages);
      }

      if (mode === "initial") setLoading(false);
      if (mode === "refresh") setRefreshing(false);
    },
    [formFilter, limit, page, query, sort]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData("initial");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const forms = useMemo(() => {
    const fromData = Array.from(
      new Set(
        items
          .map((item) => item.form?.trim())
          .filter((item): item is string => Boolean(item))
      )
    );
    const defaults = ["Comprimé", "Capsule", "Sirop", "Injection", "Gélule", "Sachet"];
    return Array.from(new Set([...fromData, ...defaults])).sort((a, b) =>
      a.localeCompare(b, "fr")
    );
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(totalAvailable / limit));
  const validated = items.filter((item) => statusLabel(item) === "Validé").length;
  const formsCount = forms.length;
  const sourcesCount = new Set(items.map((item) => sourceLabel(item.source))).size;

  const exportCsv = useMemo(() => {
    const header = ["Nom", "Forme", "Dosage", "Laboratoire", "ATC", "Pays", "Source", "Statut"];
    const rows = items.map((item) => [
      item.name,
      item.form ?? "",
      item.strength ?? "",
      item.laboratory ?? "",
      item.atcCode ?? "",
      item.country ?? "",
      sourceLabel(item.source),
      statusLabel(item),
    ]);
    return [header, ...rows]
      .map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
  }, [items]);

  const resetDraft = () => {
    setDraft(EMPTY_DRAFT);
    setEditingId(null);
  };

  const downloadCsv = () => {
    if (!exportCsv) return;
    const blob = new Blob([exportCsv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-medicaments-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const submitDraft = async () => {
    const payload = buildPayload(draft);
    if (!payload.name || payload.name.length < 2) {
      setError("Le nom du médicament doit contenir au moins 2 caractères.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    const isEditing = Boolean(editingId);
    const result = await apiJsonAuth<PublicDrug>(
      isEditing ? `/api/admin/medicaments/${editingId}` : "/api/admin/medicaments",
      {
        method: isEditing ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      }
    );

    setSaving(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible d'enregistrer ce médicament.");
      return;
    }

    setSuccess(
      isEditing
        ? "Médicament mis à jour avec succès."
        : "Médicament ajouté avec succès."
    );
    resetDraft();
    void loadData("refresh");
  };

  const startEdit = (item: PublicDrug) => {
    setEditingId(item.id);
    setDraft(draftFromItem(item));
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeItem = async (item: PublicDrug) => {
    const confirmed = window.confirm(`Supprimer "${item.name}" de la base médicaments ?`);
    if (!confirmed) return;

    setDeletingId(item.id);
    setError(null);
    setSuccess(null);

    const result = await apiJsonAuth<{ success: boolean }>(
      `/api/admin/medicaments/${item.id}`,
      { method: "DELETE" }
    );

    setDeletingId(null);

    if (!result.ok) {
      setError(result.error ?? "Impossible de supprimer ce médicament.");
      return;
    }

    if (editingId === item.id) {
      resetDraft();
    }
    setSuccess("Médicament supprimé avec succès.");
    void loadData("refresh");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-lg font-semibold">Base Médicaments</h1>
        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un médicament..."
            className="w-64 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <button
            type="button"
            onClick={downloadCsv}
            disabled={items.length === 0}
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B] disabled:opacity-60"
          >
            Exporter
          </button>
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
      {success ? <Notice tone="success" message={success} /> : null}

      <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-sm font-semibold">
            {editingId ? "Modifier un médicament" : "Ajouter un médicament"}
          </h2>
          {editingId ? (
            <button
              type="button"
              onClick={resetDraft}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              Annuler la modification
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <input
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Nom *"
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <input
            value={draft.form}
            onChange={(event) => setDraft((current) => ({ ...current, form: event.target.value }))}
            placeholder="Forme"
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <input
            value={draft.strength}
            onChange={(event) =>
              setDraft((current) => ({ ...current, strength: event.target.value }))
            }
            placeholder="Dosage"
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <input
            value={draft.laboratory}
            onChange={(event) =>
              setDraft((current) => ({ ...current, laboratory: event.target.value }))
            }
            placeholder="Laboratoire"
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <input
            value={draft.atcCode}
            onChange={(event) => setDraft((current) => ({ ...current, atcCode: event.target.value }))}
            placeholder="Code ATC"
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <input
            value={draft.country}
            onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))}
            placeholder="Pays"
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <input
            value={draft.source}
            onChange={(event) => setDraft((current) => ({ ...current, source: event.target.value }))}
            placeholder="Source"
            className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs text-[#1F1D1B]"
          />
          <button
            type="button"
            onClick={() => void submitDraft()}
            disabled={saving}
            className="rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            {saving
              ? "Enregistrement..."
              : editingId
                ? "Enregistrer les changements"
                : "Créer le médicament"}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-xs text-[#6B7280]">Médicaments chargés</p>
          <p className="mt-2 text-2xl font-semibold">{totalAvailable}</p>
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
              onChange={(event) => {
                setFormFilter(event.target.value);
                setPage(1);
              }}
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
              onChange={(event) => {
                setSort(event.target.value as SortValue);
                setPage(1);
              }}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              <option value="NAME_ASC">Nom (A-Z)</option>
              <option value="NAME_DESC">Nom (Z-A)</option>
            </select>
            <select
              value={String(limit)}
              onChange={(event) => {
                setLimit(Number(event.target.value) as PageSize);
                setPage(1);
              }}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1080px] w-full text-xs">
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
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={9} className="px-4 py-6 text-center text-[#6B7280]">
                      Chargement des médicaments...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr className="border-t border-[#E5E7EB]">
                    <td colSpan={9} className="px-4 py-6 text-center text-[#6B7280]">
                      Aucun médicament trouvé.
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const status = statusLabel(item);
                    const deleting = deletingId === item.id;
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
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(item)}
                              className="rounded-lg border border-[#0B63D1]/30 px-2 py-1 text-[11px] font-semibold text-[#0B63D1]"
                            >
                              Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => void removeItem(item)}
                              disabled={deleting}
                              className="rounded-lg border border-rose-200 px-2 py-1 text-[11px] font-semibold text-rose-600 disabled:opacity-60"
                            >
                              {deleting ? "Suppression..." : "Supprimer"}
                            </button>
                          </div>
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
            {items.length} résultat(s) affiché(s) / {totalAvailable} total
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] font-semibold text-[#1F1D1B] disabled:opacity-50"
            >
              Préc.
            </button>
            <span className="text-[11px]">
              Page {page}/{totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-[#E5E7EB] bg-white px-2 py-1 text-[11px] font-semibold text-[#1F1D1B] disabled:opacity-50"
            >
              Suiv.
            </button>
            <span>API: `/api/admin/medicaments`</span>
          </div>
        </div>
      </div>
    </div>
  );
}
