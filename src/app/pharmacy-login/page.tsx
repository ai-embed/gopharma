"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Notice } from "@/components/Notice";
import { apiJson, apiJsonAuth } from "@/lib/api";
import { clearTokens, getAccessToken, saveRoleCookie, saveTokens } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roles";

export const dynamic = "force-dynamic";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type UserProfile = {
  role: string;
};

export default function PharmacyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (!getAccessToken()) return;
    let cancelled = false;

    const check = async () => {
      const meResult = await apiJsonAuth<UserProfile>("/api/users/me");
      if (cancelled) return;

      if (!meResult.ok || !meResult.data) {
        clearTokens();
        return;
      }

      saveRoleCookie(meResult.data.role);
      router.replace(getRoleHomePath(meResult.data.role));
    };

    void check();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const result = await apiJson<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!result.ok || !result.data) {
      setLoading(false);
      setError(result.error ?? "Connexion professionnelle impossible.");
      return;
    }

    saveTokens(result.data.accessToken, result.data.refreshToken, rememberMe);

    const meResult = await apiJsonAuth<UserProfile>("/api/users/me");
    setLoading(false);

    if (!meResult.ok || !meResult.data) {
      setError("Connexion réussie, mais le profil n’a pas pu être chargé.");
      router.push("/pharmacy/dashboard");
      return;
    }

    saveRoleCookie(meResult.data.role, rememberMe);
    router.push(getRoleHomePath(meResult.data.role));
  };

  const onForgotPassword = async () => {
    setError(null);
    setInfo(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Renseignez votre e-mail pour recevoir le lien de réinitialisation.");
      return;
    }

    setForgotLoading(true);
    const result = await apiJson<{ success: boolean; message?: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail }),
      }
    );
    setForgotLoading(false);

    if (!result.ok) {
      setError(result.error ?? "Impossible d'envoyer le lien de réinitialisation.");
      return;
    }

    setInfo("E-mail de réinitialisation envoyé.");
  };

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-[#E5E7EB] bg-white shadow-sm">
        <div className="grid md:grid-cols-[1.05fr_0.95fr]">
          <div className="px-6 py-10 md:px-10">
            <div className="flex items-center gap-3">
              <Image
                src="/icons/Untitled design.png"
                alt="GoPharma Logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-2xl"
              />
              <span className="text-sm font-semibold">GoPharma Pro</span>
            </div>

            <div className="mt-6 inline-flex rounded-full bg-[#F3F4F6] p-1 text-xs font-semibold text-[#6B7280]">
              <span className="rounded-full bg-white px-4 py-2 text-[#0B63D1]">
                Connexion pharmacie
              </span>
            </div>

            <h1 className="mt-6 text-2xl font-semibold">Bon retour</h1>
            <p className="mt-2 text-sm text-[#6B7280]">
              Saisissez vos identifiants professionnels pour accéder à votre
              tableau de bord.
            </p>

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-[#6B7280]"
                >
                  E-mail professionnel
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    @
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="pharmacie@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-[#6B7280]"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    *
                  </span>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3 pl-9 pr-4 text-sm outline-none transition focus:border-[#0B63D1] focus:ring-4 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-[#6B7280]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-[#CBD5E1] text-[#0B63D1] focus:ring-blue-200"
                  />
                  Se souvenir de moi
                </label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  disabled={forgotLoading || loading}
                  className="font-semibold text-[#0B63D1] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {forgotLoading ? "Envoi..." : "Mot de passe oublié ?"}
                </button>
              </div>

              {error ? <Notice tone="error" message={error} /> : null}
              {info ? <Notice tone="success" message={info} /> : null}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </button>

              <p className="text-center text-xs text-[#6B7280]">
                Pas encore de compte professionnel ?{" "}
                <Link
                  href="/pharmacy-register"
                  className="font-semibold text-[#0B63D1]"
                >
                  Inscrire votre pharmacie
                </Link>
              </p>
            </form>
          </div>

          <div className="relative flex flex-col justify-between bg-gradient-to-b from-[#F1F8FF] via-[#F7FBFF] to-white px-6 py-10 md:px-10">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white/80 p-4 text-xs text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF2FF] text-[#0B63D1]">
                  i
                </span>
                <p className="font-semibold text-[#1F1D1B]">
                  Validation du compte requise
                </p>
              </div>
              <p className="mt-2">
                Votre compte doit être validé par un administrateur avant votre
                première connexion complète. Cela sécurise la plateforme et la
                vérification des pharmacies professionnelles.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold">
                Gérez votre pharmacie efficacement
              </h2>
              <div className="space-y-3 text-sm text-[#6B7280]">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    ✓
                  </span>
                  Gestion des stocks en temps réel
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    o
                  </span>
                  Mise à jour instantanée des horaires et disponibilités
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    *
                  </span>
                  Vérification IFU et conformité professionnelle
                </div>
              </div>
            </div>

            <div className="mt-10 h-40 w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#BBD3DE] via-[#8DB0C2] to-[#5F7E91]" />
          </div>
        </div>
      </div>
    </div>
  );
}
