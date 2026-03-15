"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiJson } from "@/lib/api";
import { Notice } from "@/components/Notice";

type RegisterResponse = {
  success: boolean;
  message?: string;
  developmentToken?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("BENIN");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const result = await apiJson<RegisterResponse>("/api/auth/register-patient", {
      method: "POST",
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        country,
      }),
    });
    setLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Inscription impossible.");
      return;
    }

    setSuccess(
      result.data?.message ??
        "Compte créé. Consultez votre email pour récupérer le code."
    );

    const params = new URLSearchParams();
    params.set("email", email);
    if (result.data?.developmentToken) {
      params.set("token", result.data.developmentToken);
    }

    router.push(`/verify-email?${params.toString()}`);
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-xs font-semibold text-[#6B7280]">
            PRÉNOM
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Amina"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-xs font-semibold text-[#6B7280]">
            NOM
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Kouassi"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-xs font-semibold text-[#6B7280]">
          ADRESSE E-MAIL
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="nom@exemple.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-xs font-semibold text-[#6B7280]">
          MOT DE PASSE
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
          required
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-xs font-semibold text-[#6B7280]"
        >
          CONFIRMER LE MOT DE PASSE
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="country" className="text-xs font-semibold text-[#6B7280]">
          PAYS
        </label>
        <select
          id="country"
          name="country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
        >
          <option value="BENIN">BENIN</option>
          <option value="COTE D'IVOIRE">CÔTE D&apos;IVOIRE</option>
          <option value="TOGO">TOGO</option>
          <option value="SENEGAL">SENEGAL</option>
        </select>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Création..." : "Créer un compte"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">
          Ou s&apos;inscrire avec
        </span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937]"
        >
          Google
        </button>
        <button
          type="button"
          className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937]"
        >
          Apple
        </button>
      </div>

      <p className="text-center text-xs text-[#9CA3AF]">
        Déjà inscrit ?{" "}
        <Link href="/login" className="font-semibold text-[#0B63D1]">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
