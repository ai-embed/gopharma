"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { PatientShell } from "@/components/PatientShell";
import { apiJson } from "@/lib/api";
import { useFavorites } from "@/lib/useFavorites";

const dayLabels = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

type PharmacyDetails = {
  _id: string;
  name: string;
  address: string;
  ifu?: string;
  email?: string;
  description?: string;
  services?: string[];
  photoUrl?: string;
  bannerUrl?: string;
  openNow?: boolean;
  operationalStatus?: "OUVERT" | "FERME";
  availabilitySource?: "manual" | "schedule";
  matchedRule?: string;
  validationDate?: string;
  location?: { coordinates: [number, number] };
};

type WeeklySlot = {
  dayOfWeek: number;
  openTime?: string;
  closeTime?: string;
  isClosed: boolean;
  onDuty?: boolean;
};

type PharmacySchedule = {
  weekly: WeeklySlot[];
};

export default function PharmacyDetailPage() {
  const params = useParams<{ slug: string }>();
  const pharmacyId = params?.slug;
  const [pharmacy, setPharmacy] = useState<PharmacyDetails | null>(null);
  const [schedule, setSchedule] = useState<PharmacySchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isPharmacyFavorite, togglePharmacyFavorite, mutating: favoriteMutating } =
    useFavorites();

  useEffect(() => {
    if (!pharmacyId) return;
    let active = true;

    const run = async () => {
      const [detailsRes, scheduleRes] = await Promise.all([
        apiJson<PharmacyDetails>(`/api/pharmacies/${pharmacyId}`),
        apiJson<PharmacySchedule>(`/api/pharmacies/${pharmacyId}/schedule`),
      ]);

      if (!active) return;

      if (!detailsRes.ok || !detailsRes.data) {
        setError(detailsRes.error ?? "Pharmacie introuvable.");
        setLoading(false);
        return;
      }

      setPharmacy(detailsRes.data);
      setSchedule(scheduleRes.ok && scheduleRes.data ? scheduleRes.data : null);
      setLoading(false);
    };

    void run();

    return () => {
      active = false;
    };
  }, [pharmacyId]);

  const coords = pharmacy?.location?.coordinates;
  const lat = coords?.[1];
  const lng = coords?.[0];

  const heroImage = useMemo(() => {
    if (pharmacy?.bannerUrl) {
      return addCloudinaryTransformations(pharmacy.bannerUrl, { width: 1200, height: 400, crop: 'fill' });
    }
    if (pharmacy?.photoUrl) {
      return addCloudinaryTransformations(pharmacy.photoUrl, { width: 1200, height: 400, crop: 'fill' });
    }
    return "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=1200&q=80";
  }, [pharmacy?.bannerUrl, pharmacy?.photoUrl]);

function addCloudinaryTransformations(url: string, options: { width?: number; height?: number; crop?: string }) {
  if (!url.includes('cloudinary.com')) return url;
  const { width, height, crop } = options;
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  
  if (transformations.length === 0) return url;
  
  const transformationString = transformations.join(',');
  return url.replace(/\/upload\//, `/upload/${transformationString}/`);
}

  const statusLabel = pharmacy?.openNow ? "Ouvert" : "Fermé";
  const mapsUrl = lat && lng
    ? `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
    : null;
  const embedMapUrl = lat && lng
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
    : null;

  const services = useMemo(() => {
    const source = pharmacy?.services ?? [];
    return source.map((name) => ({
      title: name,
      desc: "Service disponible dans cette pharmacie",
    }));
  }, [pharmacy?.services]);

  const weeklySchedule = useMemo(() => {
    const slots = schedule?.weekly ?? [];
    if (slots.length === 0) {
      return [] as Array<{ label: string; value: string }>;
    }

    const byDay = new Map<number, WeeklySlot>();
    slots.forEach((slot) => byDay.set(slot.dayOfWeek, slot));

    return dayLabels.map((label, dayOfWeek) => {
      const slot = byDay.get(dayOfWeek);
      if (!slot || slot.isClosed || !slot.openTime || !slot.closeTime) {
        return { label, value: "Fermé" };
      }
      return { label, value: `${slot.openTime} - ${slot.closeTime}` };
    });
  }, [schedule]);

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
                className="relative h-55 bg-cover bg-center"
                style={{ backgroundImage: `url('${heroImage}')` }}
                role="img"
                aria-label={`Bannière de ${pharmacy.name}`}
              >
                <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />
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
              {services.length > 0 ? (
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
              ) : (
                <p className="mt-3 text-xs text-[#6B7280]">
                  Aucun service renseigné pour le moment.
                </p>
              )}
            </div>

          </section>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <div className="mb-4 rounded-2xl border border-[#E5E7EB] bg-[#FAFBFF] p-3">
                <p className="text-xs font-semibold text-[#1F1D1B]">Horaires</p>
                {weeklySchedule.length > 0 ? (
                  <div className="mt-2 grid gap-1 text-xs text-[#6B7280]">
                    {weeklySchedule.map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span>{item.label}</span>
                        <span className="font-medium text-[#1F1D1B]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-[#6B7280]">
                    Horaires non renseignés pour cette pharmacie.
                  </p>
                )}
              </div>
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
              {pharmacy?._id ? (
                <button
                  type="button"
                  onClick={() => {
                    void togglePharmacyFavorite(pharmacy._id);
                  }}
                  disabled={favoriteMutating}
                  className={`mt-3 w-full rounded-full border px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${
                    isPharmacyFavorite(pharmacy._id)
                      ? "border-[#BFDBFE] bg-[#EFF6FF] text-[#0B63D1]"
                      : "border-[#E5E7EB] bg-white text-[#1F1D1B]"
                  }`}
                >
                  {isPharmacyFavorite(pharmacy._id)
                    ? "Retirer des favoris"
                    : "Ajouter aux favoris"}
                </button>
              ) : null}

            </div>

            <div className="rounded-3xl border border-[#E5E7EB] bg-white p-5">
              <h2 className="text-sm font-semibold">Localisation</h2>
              <div className="mt-3 h-40 overflow-hidden rounded-2xl bg-[#E5E7EB]">
                {embedMapUrl ? (
                  <iframe
                    title={`Carte ${pharmacy.name}`}
                    src={embedMapUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#6B7280]">
                    Coordonnées non disponibles
                  </div>
                )}
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
