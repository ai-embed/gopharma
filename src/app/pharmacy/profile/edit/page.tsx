"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";
import { apiJsonAuth } from "@/lib/api";

type UserMe = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePhotoUrl?: string | null;
};

type UpdateMeResponse = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
};

export default function PharmacyProfileEditPage() {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setLoading(true);
    const result = await apiJsonAuth<UserMe>("/api/users/me");
    if (result.ok && result.data) {
      setUser(result.data);
    } else {
      setError(result.error ?? "Impossible de charger le profil");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      void loadUser();
    }, 0);
  }, [loadUser]);

  const handlePhotoUpdate = (url: string | null) => {
    setUser((prev) => (prev ? { ...prev, profilePhotoUrl: url } : null));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Modifier mon profil</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            Gérez vos informations personnelles et votre photo de profil.
          </p>
        </div>
        <Link
          href="/pharmacy/dashboard"
          className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
        >
          Retour au tableau de bord
        </Link>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}

      {/* Photo de profil */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold">Photo de profil</h2>
        {loading ? (
          <div className="h-24 w-24 animate-pulse rounded-2xl bg-gray-200" />
        ) : user ? (
          <ProfilePhotoUpload
            userId={user._id}
            currentPhotoUrl={user.profilePhotoUrl ?? null}
            firstName={user.firstName}
            lastName={user.lastName}
            size="lg"
            onPhotoUpdate={handlePhotoUpdate}
          />
        ) : null}
      </div>

      {/* Informations personnelles */}
      {user && (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold">Informations personnelles</h2>
          <EditProfileForm
            initialData={user}
            onUpdate={loadUser}
          />
        </div>
      )}
    </div>
  );
}

function EditProfileForm({
  initialData,
  onUpdate,
}: {
  initialData: UserMe;
  onUpdate: () => void;
}) {
  const [firstName, setFirstName] = useState(initialData.firstName);
  const [lastName, setLastName] = useState(initialData.lastName);
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasChanges =
    firstName !== initialData.firstName ||
    lastName !== initialData.lastName ||
    phoneNumber !== (initialData.phoneNumber ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const result = await apiJsonAuth<UpdateMeResponse>("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify({
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
      }),
    });

    setSaving(false);

    if (result.ok) {
      setSuccess("Profil mis à jour avec succès.");
      onUpdate();
    } else {
      setError(result.error ?? "Erreur lors de la mise à jour.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-[11px] font-semibold text-[#6B7280]">
            PRÉNOM
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#6B7280]">
            NOM
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#6B7280]">
            E-MAIL
          </label>
          <input
            type="email"
            value={initialData.email}
            disabled
            className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-sm text-[#6B7280]"
          />
          <p className="mt-1 text-[10px] text-[#9CA3AF]">
            L&apos;e-mail ne peut pas être modifié.
          </p>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-[#6B7280]">
            TÉLÉPHONE
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm"
            placeholder="+229 01 XX XX XX XX"
          />
        </div>
      </div>

      {success ? <Notice tone="success" message={success} /> : null}
      {error ? <Notice tone="error" message={error} /> : null}

      <div className="flex items-center gap-3 pt-4">
        <button
          type="submit"
          disabled={saving || !hasChanges}
          className="rounded-xl bg-[#0B63D1] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>

        <button
          type="button"
          onClick={() => {
            setFirstName(initialData.firstName);
            setLastName(initialData.lastName);
            setPhoneNumber(initialData.phoneNumber ?? "");
          }}
          disabled={saving || !hasChanges}
          className="rounded-xl border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#1F1D1B] transition disabled:cursor-not-allowed disabled:opacity-60"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
