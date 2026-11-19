"use client";

import Link from "next/link";
import { useState } from "react";
import { Notice } from "@/components/Notice";
import { apiJson } from "@/lib/api";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const result = await apiJson<{ success: boolean }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: token.trim(), newPassword: password }),
    });
    setLoading(false);

    if (!result.ok || !result.data?.success) {
      setError(result.error ?? "Le code est invalide ou expiré. Demandez-en un nouveau.");
      return;
    }

    setSuccess(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6F9] px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white p-8">
        {success ? (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[#111827]">
              Mot de passe modifié
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Votre nouveau mot de passe est actif. Connectez-vous avec celui-ci.
            </p>
            <div className="mt-6 grid gap-3">
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-xl bg-[#0B63D1] px-4 py-3 text-sm font-semibold text-white"
              >
                Connexion utilisateur
              </Link>
              <Link
                href="/pharmacy-login"
                className="flex w-full items-center justify-center rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm font-semibold text-[#0B63D1]"
              >
                Connexion pharmacie
              </Link>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-center text-2xl font-semibold text-[#111827]">
              Réinitialiser le mot de passe
            </h1>
            <p className="mt-2 text-center text-sm text-[#6B7280]">
              Saisissez le code reçu par e-mail et choisissez un nouveau mot de passe.
              Le code expire après 30 minutes.
            </p>
            {error ? <div className="mt-4"><Notice tone="error" message={error} /></div> : null}
            <form onSubmit={(event) => void handleSubmit(event)} className="mt-6 space-y-4">
              <label className="block text-sm font-medium text-[#374151]">
                Code de réinitialisation
                <input
                  type="text"
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  autoComplete="one-time-code"
                  required
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#0B63D1] focus:outline-none focus:ring-2 focus:ring-[#0B63D1]/20"
                />
              </label>
              <label className="block text-sm font-medium text-[#374151]">
                Nouveau mot de passe
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}"
                  title="Au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
                  required
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#0B63D1] focus:outline-none focus:ring-2 focus:ring-[#0B63D1]/20"
                />
                <span className="mt-1 block text-xs text-[#6B7280]">
                  8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.
                </span>
              </label>
              <label className="block text-sm font-medium text-[#374151]">
                Confirmer le nouveau mot de passe
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#0B63D1] focus:outline-none focus:ring-2 focus:ring-[#0B63D1]/20"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-[#0B63D1] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Modification en cours…" : "Modifier le mot de passe"}
              </button>
            </form>
            <div className="mt-6 flex justify-center gap-4 text-sm">
              <Link href="/login" className="text-[#0B63D1] hover:underline">
                Connexion utilisateur
              </Link>
              <Link href="/pharmacy-login" className="text-[#0B63D1] hover:underline">
                Connexion pharmacie
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
