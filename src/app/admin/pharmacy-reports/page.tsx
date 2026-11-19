"use client";

import { useCallback, useEffect, useState } from "react";
import { apiJsonAuth } from "@/lib/api";

type PharmacyReport = {
  _id: string;
  name: string;
  address: string;
  phoneNumber?: string;
  location: { coordinates: [number, number] };
  createdAt: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date inconnue"
    : new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export default function PharmacyReportsPage() {
  const [reports, setReports] = useState<PharmacyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await apiJsonAuth<PharmacyReport[]>("/api/admin/pharmacy-reports");
    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible de charger les signalements.");
      setLoading(false);
      return;
    }
    setReports(result.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReports();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadReports]);

  const review = async (report: PharmacyReport, status: "VERIFIED" | "REJECTED") => {
    const comment = window.prompt(
      status === "VERIFIED"
        ? "Commentaire de vérification (facultatif)"
        : "Motif du rejet (facultatif)"
    );
    if (comment === null) return;

    setActingId(report._id);
    setError(null);
    setMessage(null);
    const result = await apiJsonAuth(`/api/admin/pharmacy-reports/${report._id}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status, comment: comment.trim() }),
    });
    setActingId(null);

    if (!result.ok) {
      setError(result.error ?? "Impossible de traiter ce signalement.");
      return;
    }

    setReports((current) => current.filter((item) => item._id !== report._id));
    setMessage(
      status === "VERIFIED"
        ? `${report.name} est vérifiée et apparaît dans le localisateur.`
        : `Le signalement de ${report.name} a été rejeté.`
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Pharmacies signalées</h1>
          <p className="mt-1 text-sm text-[#6B7280]">
            Vérifiez les informations avant leur publication dans le localisateur.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void loadReports()}
          disabled={loading}
          className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold disabled:opacity-60"
        >
          Actualiser
        </button>
      </div>

      <div role="note" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Une pharmacie vérifiée est publiée comme établissement communautaire. Ses horaires,
        son stock et son numéro doivent être confirmés directement auprès de l’établissement.
      </div>
      {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
      {message ? <p role="status" className="text-sm text-emerald-700">{message}</p> : null}
      {loading ? (
        <p className="text-sm text-[#6B7280]">Chargement des signalements…</p>
      ) : reports.length === 0 ? (
        <div className="gp-panel rounded-2xl p-6 text-sm text-[#6B7280]">
          Aucun signalement en attente.
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const [lng, lat] = report.location.coordinates;
            const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
            return (
              <article key={report._id} className="gp-panel rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-semibold">{report.name}</h2>
                    <p className="text-sm text-[#6B7280]">{report.address}</p>
                    {report.phoneNumber ? (
                      <p className="text-sm text-[#6B7280]">Téléphone : {report.phoneNumber}</p>
                    ) : null}
                    <p className="text-xs text-[#9CA3AF]">
                      Signalée le {formatDate(report.createdAt)} · {lat.toFixed(5)}, {lng.toFixed(5)}
                    </p>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-xs font-semibold text-[#0B63D1] underline"
                    >
                      Vérifier sur la carte
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void review(report, "REJECTED")}
                      disabled={actingId === report._id}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 disabled:opacity-60"
                    >
                      Rejeter
                    </button>
                    <button
                      type="button"
                      onClick={() => void review(report, "VERIFIED")}
                      disabled={actingId === report._id}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                    >
                      {actingId === report._id ? "Vérification…" : "Vérifier et publier"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
