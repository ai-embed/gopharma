"use client";

import Link from "next/link";
import AppFooter from "@/components/AppFooter";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/login", label: "Connexion" },
  { href: "/register", label: "Inscription" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-4 py-6 text-[#1E1E1E] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-[420px] rounded-[28px] bg-white p-8 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.6)]">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B63D1] text-white">
            <span className="text-lg font-semibold">GP</span>
          </div>
          <h1 className="mt-4 text-xl font-semibold">GoPharma</h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Votre compagnon de confiance pour la gestion des médicaments.
          </p>
        </div>

        {pathname !== "/verify-email" ? (
          <div className="mt-6 flex border-b border-[#E5E7EB] text-sm">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex-1 pb-3 text-center font-medium transition ${
                    isActive
                      ? "border-b-2 border-[#0B63D1] text-[#0B63D1]"
                      : "text-[#8A8F98]"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>
        ) : null}

        <div className="mt-6">{children}</div>
      </div>
      <div className="mt-6">
        <AppFooter align="center" />
      </div>
    </div>
  );
}
