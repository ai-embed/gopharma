"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { PatientShell } from "@/components/PatientShell";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import { apiJsonAuth } from "@/lib/api";
import { useUser } from "@/lib/useUser";

type UpdateMeResponse = {
  firstName: string;
  lastName: string;
  email: string;
  country?: string;
  phoneNumber?: string;
};

export default function EditProfileForm() {
  const { user, loading: userLoading } = useUser();

  const displayName = useMemo(() => {
    if (!user) return "Utilisateur";
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur";
  }, [user]);

  const handlePhotoUpdate = (_url: string | null) => {
    // La mise à jour se fait via le composant ProfilePhotoUpload
    // et le re-fetch du user dans EditProfileFields
  };

  return (
    <PatientShell>
      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user ? (
              <ProfilePhotoUpload
                userId={user._id}
                currentPhotoUrl={user.profilePhotoUrl ?? null}
                firstName={user.firstName}
                lastName={user.lastName}
                size="md"
                onPhotoUpdate={handlePhotoUpdate}
              />
            ) : (
              <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#E5E7EB]" />
            )}
            <div>
              <h1 className="text-lg font-semibold">{displayName}</h1>
              <p className="text-sm text-[#6B7280]">
                {user?.email ?? "utilisateur@example.com"}
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            Retour au profil
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6">
        <EditProfileFields
          key={user?._id ?? "guest"}
          initialFirstName={user?.firstName ?? ""}
          initialLastName={user?.lastName ?? ""}
          initialEmail={user?.email ?? ""}
          initialCountry={user?.country ?? "BENIN"}
          initialPhoneNumber={user?.phoneNumber ?? ""}
          userLoading={userLoading}
        />
      </div>
    </PatientShell>
  );
}

function EditProfileFields({
  initialFirstName,
  initialLastName,
  initialEmail,
  initialCountry,
  initialPhoneNumber,
  userLoading,
}: {
  initialFirstName: string;
  initialLastName: string;
  initialEmail: string;
  initialCountry: string;
  initialPhoneNumber: string;
  userLoading: boolean;
}) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [email, setEmail] = useState(initialEmail);
  const [country, setCountry] = useState(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const normalizePhoneNumber = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    const hasPlus = trimmed.startsWith("+");
    const digitsOnly = trimmed.replace(/\D/g, "");
    return hasPlus ? `+${digitsOnly}` : digitsOnly;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanCountry = country.trim();
    const cleanPhoneNumber = normalizePhoneNumber(phoneNumber);

    if (!cleanFirstName || !cleanLastName || !cleanEmail || !cleanCountry) {
      setError("Veuillez renseigner les champs obligatoires.");
      return;
    }

    if (cleanPhoneNumber && (cleanPhoneNumber.length < 6 || cleanPhoneNumber.length > 30)) {
      setError("Numéro de téléphone invalide. Format attendu: +2290100000000.");
      return;
    }

    setSaving(true);

    const result = await apiJsonAuth<UpdateMeResponse>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        firstName: cleanFirstName,
        lastName: cleanLastName,
        email: cleanEmail,
        country: cleanCountry,
        phoneNumber: cleanPhoneNumber || undefined,
      }),
    });

    setSaving(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "La mise à jour du profil a échoué.");
      return;
    }

    setSuccess("Profil mis à jour avec succès.");
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-sm font-semibold">Modifier le profil</h2>
      <p className="mt-2 text-xs text-[#6B7280]">
        Mettez à jour vos informations personnelles enregistrées dans votre
        compte.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 text-xs text-[#6B7280]">
          <label htmlFor="firstName" className="text-[11px] font-semibold">
            Prénom
          </label>
          <input
            id="firstName"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
            disabled={userLoading || saving}
            required
          />
        </div>
        <div className="space-y-2 text-xs text-[#6B7280]">
          <label htmlFor="lastName" className="text-[11px] font-semibold">
            Nom
          </label>
          <input
            id="lastName"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
            disabled={userLoading || saving}
            required
          />
        </div>
        <div className="space-y-2 text-xs text-[#6B7280]">
          <label htmlFor="email" className="text-[11px] font-semibold">
            Adresse e-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
            disabled={userLoading || saving}
            required
          />
        </div>
        <div className="space-y-2 text-xs text-[#6B7280]">
          <label htmlFor="country" className="text-[11px] font-semibold">
            Pays
          </label>
          <select
            id="country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
            disabled={userLoading || saving}
          >
            <option value="BENIN">Bénin</option>
            <option value="FRANCE">France</option>
            <option value="SENEGAL">Sénégal</option>
          </select>
        </div>
        <div className="space-y-2 text-xs text-[#6B7280] sm:col-span-2">
          <label htmlFor="phoneNumber" className="text-[11px] font-semibold">
            Numéro de téléphone
          </label>
          <input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-2"
            disabled={userLoading || saving}
            placeholder="+229 01 00 00 00 00"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-6">
          <Notice tone="error" message={error} />
        </div>
      ) : null}
      {success ? (
        <div className="mt-6">
          <Notice tone="success" message={success} />
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
        <Link
          href="/profile"
          className="rounded-full border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#6B7280]"
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={userLoading || saving}
          className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
