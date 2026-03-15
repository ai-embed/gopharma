"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { apiJson } from "@/lib/api";
import { Notice } from "@/components/Notice";

function VerifyEmailContent() {
  const params = useSearchParams();
  const initialToken = useMemo(() => params.get("token") ?? "", [params]);
  const email = useMemo(() => params.get("email") ?? "", [params]);

  const [token, setToken] = useState(initialToken);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const result = await apiJson<{ success: boolean }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    setLoading(false);

    if (!result.ok) {
      setStatus("error");
      setMessage(result.error ?? "Code invalide ou expiré.");
      return;
    }

    setStatus("success");
    setMessage("Email vérifié avec succès. Vous pouvez vous connecter.");
  };

  const resend = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Veuillez renseigner votre email pour renvoyer le code.");
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await apiJson<{ success: boolean }>(
      "/api/auth/verify-email/resend",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      }
    );

    setLoading(false);

    if (!result.ok) {
      setStatus("error");
      setMessage(result.error ?? "Impossible de renvoyer le code.");
      return;
    }

    setStatus("success");
    setMessage("Un nouveau code a été envoyé à votre email.");
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#1F2937]">
          Vérification de l&apos;email
        </h2>
        <p className="text-sm text-[#6B7280]">
          Saisissez le code reçu par email pour activer votre compte patient.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="token" className="text-xs font-semibold text-[#6B7280]">
            CODE DE VÉRIFICATION
          </label>
          <input
            id="token"
            name="token"
            type="text"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="123456"
            className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
            required
          />
        </div>

        {message ? (
          <Notice tone={status === "success" ? "success" : "error"} message={message} />
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Validation..." : "Valider le code"}
        </button>
      </form>

      <div className="flex flex-col gap-3 text-sm">
        <button
          type="button"
          onClick={resend}
          className="rounded-2xl border border-[#E5E7EB] px-4 py-3 font-semibold text-[#1F2937]"
          disabled={loading}
        >
          Renvoyer le code
        </button>
        <Link
          href="/login"
          className="text-center text-xs font-semibold text-[#0B63D1]"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-3 text-sm text-[#6B7280]">
          <p>Chargement de la verification...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
