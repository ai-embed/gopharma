"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Notice } from "@/components/Notice";
import { apiJson } from "@/lib/api";

export const dynamic = "force-dynamic";

export default function PharmacyForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await apiJson<{ message?: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setError(res.error ?? "Une erreur est survenue.");
        return;
      }

      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F6F9] px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF2FF]">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#0B63D1]" aria-hidden="true">
                <path
                  d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-[#111827]">
              Email envoyé
            </h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/pharmacy-login"
              className="flex w-full items-center justify-center rounded-xl bg-[#0B63D1] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(11,99,209,0.25)] transition hover:bg-[#0A58B8]"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F3F6F9] px-4">
      <div className="w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white p-8">
        <div className="text-center">
          <Image
            src="/icons/Untitled design.png"
            alt="GoPharma Logo"
            width={32}
            height={32}
            className="mx-auto mb-4 h-8 w-8 rounded-xl"
          />
          <h1 className="text-2xl font-semibold text-[#111827]">
            Mot de passe oublié ?
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Entrez votre adresse email et nous vous enverrons un lien de réinitialisation.
          </p>
        </div>

        {error && <Notice tone="error" message={error} />}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#374151]">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-1 w-full rounded-xl border border-[#E5E7EB] px-4 py-3 text-sm focus:border-[#0B63D1] focus:outline-none focus:ring-2 focus:ring-[#0B63D1]/20"
              placeholder="votre@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[#0B63D1] px-4 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(11,99,209,0.25)] transition hover:bg-[#0A58B8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Envoi en cours..." : "Envoyer le lien"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/pharmacy-login"
            className="text-sm text-[#0B63D1] hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
