"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiJson } from "@/lib/api";
import { Notice } from "@/components/Notice";
import { useSecureAuth } from "@/lib/security/useSecureAuth";

type RegisterResponse = {
  success: boolean;
  message?: string;
  developmentToken?: string;
};

export default function RegisterForm() {
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
  
  // Rate limiting protection
  const { checkAuthAttempt, recordAuthAttempt } = useSecureAuth(email || "anonymous");

  const startGoogleAuth = () => {
    if (typeof window === "undefined") return;
    window.location.assign("/api/auth/google");
  };

  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z\d]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch = password === confirmPassword || confirmPassword.length === 0;

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Check rate limiting
    const check = checkAuthAttempt();
    if (!check.canProceed) {
      setError(check.error || "Trop de tentatives. Réessayez plus tard.");
      return;
    }

    if (!isPasswordValid) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

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
    
    // Record attempt result
    const attemptSuccess = result.ok && !!result.data;
    recordAuthAttempt(attemptSuccess);

    if (!attemptSuccess || !result.data) {
      if (result.error?.toLowerCase().includes("données invalides")) {
        setError(
          "Données invalides. Vérifiez les champs et le mot de passe (8+ caractères, majuscule, minuscule, chiffre, caractère spécial)."
        );
      } else {
        setError(result.error ?? "Une erreur est survenue.");
      }
      return;
    }

    const data = result.data;

    if (!data.success) {
      setError(data.message ?? "Inscription impossible.");
      return;
    }

    setSuccess(
      data.message ??
        "Un code de vérification a été envoyé. Vérifiez votre boîte email."
    );
    if (typeof window !== "undefined") {
      window.localStorage.setItem("gp.pendingEmail", email);
    }
    const params = new URLSearchParams();
    params.set("email", email);
    router.push(`/verify-email?${params.toString()}`);
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="text-xs font-semibold text-[#6B7280]"
          >
            PRENOM
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
            required
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="text-xs font-semibold text-[#6B7280]"
          >
            NOM
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
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
        <label
          htmlFor="password"
          className="text-xs font-semibold text-[#6B7280]"
        >
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
        <div className="grid gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-[11px] text-[#6B7280] sm:grid-cols-2">
          <span className={passwordChecks.length ? "text-[#0B63D1]" : ""}>
            8+ caractères
          </span>
          <span className={passwordChecks.upper ? "text-[#0B63D1]" : ""}>
            1 majuscule
          </span>
          <span className={passwordChecks.lower ? "text-[#0B63D1]" : ""}>
            1 minuscule
          </span>
          <span className={passwordChecks.digit ? "text-[#0B63D1]" : ""}>
            1 chiffre
          </span>
          <span className={passwordChecks.special ? "text-[#0B63D1]" : ""}>
            1 caractère spécial
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-xs font-semibold text-[#6B7280]"
        >
          CONFIRMER MOT DE PASSE
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
        {!passwordsMatch ? (
          <p className="text-[11px] text-[#D14343]">
            Les mots de passe ne correspondent pas.
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="country"
          className="text-xs font-semibold text-[#6B7280]"
        >
          PAYS
        </label>
        <select
          id="country"
          name="country"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
        >
          <option value="BENIN">Bénin</option>
          <option value="FRANCE">France</option>
          <option value="SENEGAL">Sénégal</option>
        </select>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Inscription..." : "S'inscrire"}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-[#9CA3AF]">
          Ou continuer avec
        </span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <div className="grid gap-3">
        <button
          type="button"
          onClick={startGoogleAuth}
          className="rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#1F2937]"
        >
          Google
        </button>
      </div>

      <p className="text-center text-xs text-[#9CA3AF]">
        Deja un compte ?{" "}
        <Link href="/login" className="font-semibold text-[#0B63D1]">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
