"use client";

import Link from "next/link";
import { useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJsonAuth } from "@/lib/api";

type AdminCreateUserResponse = {
  success: boolean;
  message: string;
  user?: {
    _id?: string;
    email?: string;
  };
};

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export default function AdminNewUserPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("BENIN");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

    setLoading(true);
    const result = await apiJsonAuth<AdminCreateUserResponse>("/api/admin/users", {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        country: country.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
      }),
    });
    setLoading(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Impossible de créer l'utilisateur.");
      return;
    }

    setSuccess(result.data.message ?? "Utilisateur créé avec succès.");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Ajouter un utilisateur</h1>
          <p className="mt-1 text-xs text-[#6B7280]">
            Création manuelle d&apos;un compte patient.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/users"
            className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
          >
            Annuler
          </Link>
          <button
            form="admin-create-user-form"
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
        id="admin-create-user-form"
        className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6"
        onSubmit={onSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-[11px] text-[#6B7280]">Prénom</p>
            <input
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              placeholder="Aïcha"
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              required
            />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Nom</p>
            <input
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              placeholder="Adjoua"
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              required
            />
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">E-mail</p>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="patient@exemple.com"
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
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
          <div className="md:col-span-2">
            <p className="text-[11px] text-[#6B7280]">Téléphone (optionnel)</p>
            <input
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="+229 01 00 00 00 00"
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
            />
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
            <p className="text-[11px] text-[#6B7280]">Confirmer le mot de passe</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-xs"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
}
