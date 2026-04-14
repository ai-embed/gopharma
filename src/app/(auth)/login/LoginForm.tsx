"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiJson, apiJsonAuth } from "@/lib/api";
import { saveRoleCookie, saveTokens } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roles";
import { Notice } from "@/components/Notice";
import { useSecureAuth } from "@/lib/security/useSecureAuth";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type UserProfile = {
  role: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Rate limiting protection
  const { authState, checkAuthAttempt, recordAuthAttempt } = useSecureAuth(email || "anonymous");

  const startGoogleAuth = () => {
    if (typeof window === "undefined") return;
    window.location.assign("/api/auth/google");
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    
    // Check rate limiting
    const check = checkAuthAttempt();
    if (!check.canProceed) {
      setError(check.error || "Trop de tentatives. Réessayez plus tard.");
      return;
    }
    
    setLoading(true);

    const result = await apiJson<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, rememberMe }),
    });

    setLoading(false);

    // Record attempt result (success/failure)
    const success = result.ok && !!result.data;
    recordAuthAttempt(success);

    if (!success || !result.data) {
      setError(result.error ?? "Connexion impossible.");
      return;
    }

    const tokens = result.data;
    saveTokens(tokens.accessToken, tokens.refreshToken, rememberMe);

    const meResult = await apiJsonAuth<UserProfile>("/api/users/me");
    let nextPath = "/dashboard";

    if (meResult.ok && meResult.data) {
      saveRoleCookie(meResult.data.role, rememberMe);
      nextPath = getRoleHomePath(meResult.data.role);
    }

    router.push(nextPath);
  };

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
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
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="text-xs font-semibold text-[#6B7280]"
          >
            MOT DE PASSE
          </label>
          <Link
            href="#"
            className="text-xs font-semibold text-[#0B63D1] hover:text-[#0A58BA]"
          >
            Mot de passe oublié ?
          </Link>
        </div>
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

      {error ? <Notice tone="error" message={error} /> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-2xl bg-[#0B63D1] py-3 text-sm font-semibold text-white transition hover:bg-[#0A58BA] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>

      <label className="flex items-center gap-2 text-xs text-[#6B7280]">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(event) => setRememberMe(event.target.checked)}
          className="h-4 w-4 rounded border-[#CBD5E1] text-[#0B63D1] focus:ring-blue-200"
        />
        Se souvenir de moi
      </label>

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
        En continuant, vous acceptez nos{" "}
        <Link href="#" className="font-semibold text-[#0B63D1]">
          Conditions d&apos;utilisation
        </Link>{" "}
        et notre{" "}
        <Link href="#" className="font-semibold text-[#0B63D1]">
          Politique de confidentialite
        </Link>
        .
      </p>
    </form>
  );
}
