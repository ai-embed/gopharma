"use client";

import ProfileShell from "@/components/ProfileShell";
import { Notice } from "@/components/Notice";
import { useUser } from "@/lib/useUser";
import { ProfilePhotoUpload } from "@/components/ProfilePhotoUpload";

export default function ProfileView() {
  const { user, loading, error } = useUser();
  const displayName = user
    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Utilisateur"
    : "Utilisateur";
  const email = user?.email ?? "utilisateur@example.com";
  const country = formatCountry(user?.country);
  const language = user?.preferences?.language === "en" ? "English" : "Français";
  const timezone = user?.preferences?.timezone ?? "Africa/Porto-Novo";
  const userId = user?._id ? `#${user._id.slice(-6).toUpperCase()}` : "Non renseigné";
  const phone = user?.phoneNumber ?? "Non renseigné";
  const userIdRaw = user?._id ?? "";
  const photoUrl = user?.profilePhotoUrl;

  return (
    <ProfileShell activeTab="profile">
      <div className="space-y-6">
        {error ? <Notice tone="error" message={error} /> : null}

        {/* Section Photo de profil */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold">Photo de profil</h2>
          <ProfilePhotoUpload
            userId={userIdRaw}
            currentPhotoUrl={photoUrl}
            firstName={user?.firstName ?? ""}
            lastName={user?.lastName ?? ""}
            size="lg"
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Identité</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#9CA3AF]">NOM COMPLET</p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                  ID
                </div>
                <span>{loading ? "Chargement..." : displayName}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#9CA3AF]">PAYS</p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                  GEO
                </div>
                <span>{loading ? "Chargement..." : country}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#9CA3AF]">ID UTILISATEUR</p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                  UID
                </div>
                <span>{loading ? "Chargement..." : userId}</span>
              </div>
            </div>
          </div>
        </section>

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
                <span>{phone}</span>
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
                <span>{loading ? "Chargement..." : email}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3 border-t border-[#E5E7EB] pt-6">
          <h2 className="text-sm font-semibold">Préférences du compte</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#9CA3AF]">LANGUE</p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                  LNG
                </div>
                <span>{loading ? "Chargement..." : language}</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-[#9CA3AF]">FUSEAU HORAIRE</p>
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F3F6F9] text-[10px] font-semibold text-[#6B7280]">
                  TZ
                </div>
                <span>{loading ? "Chargement..." : timezone}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProfileShell>
  );
}

function formatCountry(country?: string) {
  if (!country) return "Bénin";
  const normalized = country.trim().toLowerCase();
  if (normalized === "benin") return "Bénin";
  if (normalized === "france") return "France";
  if (normalized === "senegal") return "Sénégal";
  return country;
}
