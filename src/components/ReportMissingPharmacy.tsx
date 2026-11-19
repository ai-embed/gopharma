"use client";

import dynamic from "next/dynamic";
import { FormEvent, useState } from "react";
import { apiJson } from "@/lib/api";
import type { Coordinates } from "@/lib/location-preferences";

const LocationPicker = dynamic(
  () => import("@/components/LocationPicker").then((module) => module.LocationPicker),
  { ssr: false }
);

const defaultCenter: Coordinates = { lat: 6.3654, lng: 2.4183 };

export function ReportMissingPharmacy({
  userCoordinates,
}: {
  userCoordinates: Coordinates | null;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coordinates, setCoordinates] = useState(userCoordinates ?? defaultCenter);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const result = await apiJson<{ _id: string }>("/api/pharmacies/reports", {
      method: "POST",
      body: JSON.stringify({
        name: name.trim(),
        address: address.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
      }),
    });

    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Impossible d’envoyer le signalement.");
      return;
    }

    setSuccess(true);
    setName("");
    setAddress("");
    setPhoneNumber("");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setCoordinates(userCoordinates ?? defaultCenter);
          setOpen(true);
        }}
        className="rounded-full border border-[#BFDBFE] bg-white px-4 py-2 text-xs font-semibold text-[#0B63D1] hover:bg-[#EFF6FF]"
      >
        Signaler une pharmacie manquante
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="pharmacy-report-title"
            className="gp-panel max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-5 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="pharmacy-report-title" className="text-lg font-bold">
                  Signaler une pharmacie
                </h2>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Un administrateur vérifiera les informations avant publication.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fermer"
                onClick={() => setOpen(false)}
                className="rounded-full border border-[#E5E7EB] px-3 py-1 text-lg"
              >
                ×
              </button>
            </div>

            {success ? (
              <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
                Merci. Le signalement a été envoyé pour vérification.
              </p>
            ) : null}
            <form onSubmit={(event) => void submit(event)} className="mt-5 space-y-4">
              <label className="block text-xs font-semibold">
                Nom de la pharmacie
                <input
                  required
                  minLength={2}
                  maxLength={150}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-xs font-semibold">
                Adresse, quartier ou ville
                <input
                  required
                  minLength={3}
                  maxLength={300}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
                />
              </label>
              <label className="block text-xs font-semibold">
                Téléphone (facultatif)
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm"
                />
              </label>
              <div>
                <p className="text-xs font-semibold">Emplacement sur la carte</p>
                <p className="mb-2 mt-1 text-xs text-[#6B7280]">
                  Cliquez sur la carte ou déplacez le repère pour préciser l’emplacement.
                </p>
                <LocationPicker coordinates={coordinates} onChange={setCoordinates} />
                <p className="mt-2 text-[11px] text-[#6B7280]">
                  {coordinates.lat.toFixed(5)}, {coordinates.lng.toFixed(5)}
                </p>
              </div>
              {error ? <p role="alert" className="text-sm text-red-700">{error}</p> : null}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  {submitting ? "Envoi…" : "Envoyer pour vérification"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
