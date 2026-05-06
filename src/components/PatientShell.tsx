"use client";

import { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/TopNav";
import AppFooter from "@/components/AppFooter";
import { Chatbot } from "@/components/Chatbot";
import { clearTokens, getAccessToken } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roles";
import { useUser } from "@/lib/useUser";

type PatientShellProps = {
  children: ReactNode;
};

export function PatientShell({ children }: PatientShellProps) {
  const router = useRouter();
  const { user, loading } = useUser();
  const hasToken = Boolean(getAccessToken());
  const roleHome = user ? getRoleHomePath(user.role) : null;
  const canRenderPatientPage = hasToken && !loading && roleHome === "/dashboard";

  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
      return;
    }

    if (loading) return;

    if (!user) {
      clearTokens();
      router.replace("/login");
      return;
    }

    if (roleHome && roleHome !== "/dashboard") {
      router.replace(roleHome);
    }
  }, [hasToken, loading, roleHome, router, user]);

  if (!canRenderPatientPage) {
    return (
      <div className="min-h-screen bg-[#F3F6F9] px-4 py-6 text-[#1F1D1B] sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white py-16 text-sm text-[#6B7280]">
          Vérification de session…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-6 text-[#1F1D1B] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="sticky top-3 z-40">
          <TopNav />
        </div>
        {children}
        <AppFooter />
      </div>
      <Chatbot />
    </div>
  );
}
