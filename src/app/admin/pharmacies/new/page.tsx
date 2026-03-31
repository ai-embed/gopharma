"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type AdminCreatePharmacyResponse = {
  manager?: { _id?: string; email?: string };
  pharmacy?: { _id?: string; name?: string; ifu?: string };
  message?: string;
};

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function AdminNewPharmacyPage() {
  const router = useRouter();

  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pharmacyName, setPharmacyName] = useState("");
  const [ifu, setIfu] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [country, setCountry] = useState("BENIN");
  const [latitude, setLatitude] = useState("6.3703");
  const [longitude, setLongitude] = useState("2.3912");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!strongPasswordRegex.test(password)) {
      setError(
        "Le mot de passe doit contenir 8+ caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      setError("Latitude invalide.");
      return;
    }
    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      setError("Longitude invalide.");
      return;
    }

    setLoading(true);
    const result = await apiJsonAuth<AdminCreatePharmacyResponse>("/api/admin/pharmacies", {
      method: "POST",
      body: JSON.stringify({
        managerFirstName: managerFirstName.trim(),
        managerLastName: managerLastName.trim(),
        managerEmail: managerEmail.trim().toLowerCase(),
        password,
        country: country.trim(),
        pharmacyName: pharmacyName.trim(),
        pharmacyAddress: pharmacyAddress.trim(),
        ifu: ifu.trim(),
        latitude: lat,
        longitude: lng,
        description: description.trim() || undefined,
      }),
    });
    setLoading(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible d'enregistrer la pharmacie.");
      return;
    }

    setSuccess(
      result.data.message ?? "Pharmacie créée, en attente de validation administrative."
    );

    window.setTimeout(() => {
      router.push("/admin/validation-queue");
    }, 1200);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Ajouter une pharmacie</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            Enregistrement d&apos;une pharmacie et de son gestionnaire.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pharmacies"
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            Annuler
          </Link>
          <button
            form="admin-create-pharmacy-form"
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          >
            Enregistrer
          </button>
        </div>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <form
        id="admin-create-pharmacy-form"
        className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6"
        onSubmit={onSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-[11px] text-[#6B7280]">Prénom gestionnaire</p>
            <input
              value={managerFirstName}
              onChange={(event) => setManagerFirstName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              placeholder="Aïcha"
              required
            />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Nom gestionnaire</p>
            <input
              value={managerLastName}
              onChange={(event) => setManagerLastName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              placeholder="Adjoua"
              required
            />
          </div>

          <div>
            <p className="text-[11px] text-[#6B7280]">Email professionnel</p>
            <input
              type="email"
              value={managerEmail}
              onChange={(event) => setManagerEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              placeholder="contact@pharmacie.com"
              required
            />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Pays</p>
            <select
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
            >
              <option value="BENIN">Bénin</option>
              <option value="TOGO">Togo</option>
              <option value="COTE_DIVOIRE">Côte d&apos;Ivoire</option>
              <option value="SENEGAL">Sénégal</option>
              <option value="NIGERIA">Nigeria</option>
            </select>
          </div>

          <div>
            <p className="text-[11px] text-[#6B7280]">Mot de passe</p>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              required
            />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Confirmer mot de passe</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              required
            />
          </div>

          <div>
            <p className="text-[11px] text-[#6B7280]">Nom de la pharmacie</p>
            <input
              value={pharmacyName}
              onChange={(event) => setPharmacyName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              placeholder="Pharmacie de la Santé"
              required
            />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Numéro IFU</p>
            <input
              value={ifu}
              onChange={(event) => setIfu(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              placeholder="000-000-000"
              required
            />
          </div>
          <div className="md:col-span-2">
            <p className="text-[11px] text-[#6B7280]">Adresse</p>
            <input
              value={pharmacyAddress}
              onChange={(event) => setPharmacyAddress(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              placeholder="123 Rue de la Pharmacie, Ville, Pays"
              required
            />
          </div>

          <div>
            <p className="text-[11px] text-[#6B7280]">Latitude</p>
            <input
              value={latitude}
              onChange={(event) => setLatitude(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              placeholder="6.3703"
              required
            />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Longitude</p>
            <input
              value={longitude}
              onChange={(event) => setLongitude(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              placeholder="2.3912"
              required
            />
          </div>

          <div className="md:col-span-2">
            <p className="text-[11px] text-[#6B7280]">Description (optionnel)</p>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 h-24 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs text-[#1F1D1B]"
              placeholder="Informations complémentaires sur la pharmacie..."
            />
          </div>
        </div>
      </form>
    </div>
  );
}
