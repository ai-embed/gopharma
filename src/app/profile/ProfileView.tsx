"use client";

import ProfileShell from "@/components/ProfileShell";
import { useUser } from "@/lib/useUser";

export default function ProfileView() {
  const { user } = useUser();
  const email = user?.email ?? "utilisateur@example.com";

  return (
    <ProfileShell activeTab="profile">
      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Informations de contact</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#9CA3AF]">
                NUMÉRO DE TÉLÉPHONE
              </p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                  TEL
                </div>
                <span>+229 67 12 34 56 78</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#9CA3AF]">
                ADRESSE E-MAIL
              </p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                  MAIL
                </div>
                <span>{email}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3 border-t border-[#E5E7EB] pt-6">
          <h2 className="text-sm font-semibold">Adresse</h2>
          <p className="text-[11px] font-semibold text-[#9CA3AF]">
            ADRESSE PRINCIPALE
          </p>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
              ADR
            </div>
            <div>
              <p>123 Avenue des Champs-Élysées</p>
              <p className="text-xs text-[#6B7280]">Cotonou, Bénin</p>
            </div>
          </div>
        </section>
      </div>
    </ProfileShell>
  );
}
