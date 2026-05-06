"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import AppFooter from "@/components/AppFooter";
import { clearTokens, getAccessToken, saveRoleCookie } from "@/lib/auth";
import { getRolePostAuthPath } from "@/lib/roles";
import { apiJsonAuth } from "@/lib/api";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/login" && pathname !== "/register") return;
    if (!getAccessToken()) return;

    let cancelled = false;

    const checkSession = async () => {
      const meResult = await apiJsonAuth<{ role?: string }>("/api/users/me");
      if (cancelled) return;

      if (meResult.ok && meResult.data?.role) {
        saveRoleCookie(meResult.data.role);
        router.replace(getRolePostAuthPath(meResult.data.role));
        return;
      }

      clearTokens();
    };

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-6 text-[#1E1E1E] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-105 rounded-[28px] bg-white p-8 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.6)]">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/icons/Untitled design.png"
            alt="GoPharma Logo"
            width={48}
            height={48}
            className="h-12 w-12 rounded-2xl"
          />
          <h1 className="mt-4 text-xl font-semibold">GoPharma</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            {pathname === "/login"
              ? "Veuillez entrer vos coordonnées pour vous connecter"
              : "Votre compagnon de confiance pour la gestion des médicaments."}
          </p>
        </div>

        {pathname === "/login" ? (
          <h2 className="mt-6 text-center text-2xl font-semibold text-[#0B63D1]">
            Connexion
          </h2>
        ) : null}
        {pathname === "/register" ? (
          <h2 className="mt-6 text-center text-2xl font-semibold text-[#0B63D1]">
            Inscription
          </h2>
        ) : null}

        <div className="mt-6">{children}</div>
      </div>
      <div className="mt-6">
        <AppFooter align="center" />
      </div>
    </div>
  );
}
