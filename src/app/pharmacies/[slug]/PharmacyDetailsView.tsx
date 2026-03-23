"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PatientShell } from "@/components/PatientShell";
import { apiJson } from "@/lib/api";

const services = [
  { title: "Vaccinations", desc: "Grippe, COVID-19, Voyage" },
  { title: "Livraison à domicile", desc: "Gratuite dans le secteur" },
  { title: "Suivi de santé", desc: "Tension, Diabète, Poids" },
  { title: "Préparations magistrales", desc: "Dosages personnalisés" },
  { title: "Synchro. médicaments", desc: "Renouvellement automatique" },
  { title: "Accès PMR", desc: "Rampe et assistance" },
];

type PharmacyDetails = {
  _id: string;
  name: string;
  address: string;
  email?: string;
  description?: string;
  photoFileId?: string;
  openNow?: boolean;
  operationalStatus?: "OUVERT" | "FERME";
  availabilitySource?: "manual" | "schedule";
  matchedRule?: string;
  location?: { coordinates: [number, number] };
};

export default function PharmacyDetailPage() {
  const params = useParams<{ slug: string }>();
  const pharmacyId = params?.slug;
  const [pharmacy, setPharmacy] = useState<PharmacyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pharmacyId) return;
    let active = true;

    apiJson<PharmacyDetails>(`/api/pharmacies/${pharmacyId}`).then((res) => {
      if (!active) return;
      if (!res.ok || !res.data) {
        setError(res.error ?? "Pharmacie introuvable.");
        setLoading(false);
        return;
      }
      setPharmacy(res.data);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [pharmacyId]);

  const coords = pharmacy?.location?.coordinates;
  const lat = coords?.[1];
  const lng = coords?.[0];

  const heroImage = useMemo(() => {
    if (pharmacy?.photoFileId) {
      return `/api/files/${pharmacy.photoFileId}`;
    }
    return "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80";
  }, [pharmacy?.photoFileId]);

  const statusLabel = pharmacy?.openNow ? "Ouvert" : "Fermé";
  const mapsUrl = lat && lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : null;

  return (
    <PatientShell>
      {loading ? (
        <p className="text-sm text-[#6B7280]">Chargement de la pharmacie...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : pharmacy ? (
        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          <section className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white">
              <div
                className="relative h-[220px] bg-cover bg-center"
                style={{ backgroundImage: `url('${heroImage}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h1 className="text-xl font-semibold">{pharmacy.name}</h1>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span
                      className={`rounded-full px-2 py-1 ${
                        pharmacy.openNow ? "bg-emerald-500/80" : "bg-rose-500/80"
                      }`}
                    >
                      {statusLabel}
                    </span>
                    <span>Statut {pharmacy.operationalStatus ?? "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "Adresse",
                  value: pharmacy.address,
                  sub: "",
                },
                {
                  title: "Téléphone",
                  value: "Non renseigné",
                  sub: "",
                },
                {
                  title: "E-mail",
                  value: pharmacy.email ?? "Non renseigné",
                  sub: "",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-sm"
                >
                  <p className="text-xs font-semibold text-[#6B7280]">{item.title}</p>
                  <p className="mt-2 font-semibold">{item.value}</p>
                  {item.sub ? (
                    <p className="text-xs text-[#6B7280]">{item.sub}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">À propos de nous</h2>
              <p className="mt-3 text-xs text-[#6B7280]">
                {pharmacy.description ||
                  "Aucune description n’est disponible pour le moment."}
              </p>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Nos services</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.title}
                    className="rounded-2xl border border-[#E5E7EB] px-4 py-3 text-xs"
                  >
                    <p className="text-sm font-semibold">{service.title}</p>
                    <p className="text-xs text-[#6B7280]">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              {mapsUrl ? (
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white"
                >
                  Obtenir l&apos;itinéraire
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full rounded-full bg-[#CBD5E1] px-4 py-2 text-xs font-semibold text-white"
                >
                  Itinéraire indisponible
                </button>
              )}
              <button
                type="button"
                disabled
                className="mt-3 w-full rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
              >
                Appeler maintenant
              </button>

              <div className="mt-5 space-y-2 text-xs text-[#6B7280]">
                <p className="text-xs font-semibold text-[#1F1D1B]">Statut</p>
                <div className="flex items-center justify-between">
                  <span>Ouverture</span>
                  <span className="text-[#1F1D1B]">{statusLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Source</span>
                  <span className="text-[#1F1D1B]">
                    {pharmacy.availabilitySource ?? "manual"}
                  </span>
                </div>
                {pharmacy.matchedRule ? (
                  <p className="text-[11px] text-[#9CA3AF]">
                    Règle: {pharmacy.matchedRule}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Localisation</h2>
              <div className="mt-3 h-40 rounded-2xl bg-[#E5E7EB]">
                <div className="flex h-full items-center justify-center text-xs text-[#6B7280]">
                  {lat && lng ? `${lat.toFixed(4)}, ${lng.toFixed(4)}` : "Carte"}
                </div>
              </div>
              <p className="mt-3 text-xs text-[#6B7280]">
                {lat && lng
                  ? "Coordonnées basées sur la fiche pharmacie."
                  : "Coordonnées non disponibles."}
              </p>
            </div>
          </aside>
        </div>
      ) : null}
    </PatientShell>
  );
}
