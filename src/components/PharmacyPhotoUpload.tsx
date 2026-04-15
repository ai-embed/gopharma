"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Notice } from "./Notice";
import Image from "next/image";

interface PharmacyPhotoUploadProps {
  pharmacyId: string;
  currentPhotoUrl?: string | null;
  currentBannerUrl?: string | null;
  pharmacyName: string;
  onPhotoUpdate?: (url: string | null) => void;
  onBannerUpdate?: (url: string | null) => void;
}

export function PharmacyPhotoUpload({
  pharmacyId,
  currentPhotoUrl,
  currentBannerUrl,
  pharmacyName,
  onPhotoUpdate,
  onBannerUpdate,
}: PharmacyPhotoUploadProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoUrl || null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(currentBannerUrl || null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(true);
  const [isLoadingBanner, setIsLoadingBanner] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Charger les photos depuis l'API au montage
  useEffect(() => {
    if (!pharmacyId) return;

    const loadPhotos = async () => {
      setIsLoadingPhoto(true);
      setIsLoadingBanner(true);
      try {
        // Charger la photo
        const photoRes = await fetch(`/api/pharmacy/photo?pharmacyId=${pharmacyId}`);
        if (photoRes.ok) {
          const photoData = await photoRes.json();
          setPhotoUrl(photoData.photoUrl);
        }

        // Charger la bannière
        const bannerRes = await fetch(`/api/pharmacy/banner?pharmacyId=${pharmacyId}`);
        if (bannerRes.ok) {
          const bannerData = await bannerRes.json();
          setBannerUrl(bannerData.bannerUrl);
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoadingPhoto(false);
        setIsLoadingBanner(false);
      }
    };

    void loadPhotos();
  }, [pharmacyId]);

  // Mock storage pour les photos de pharmacie
  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setError(null);
    setIsUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("pharmacyId", pharmacyId);

      const response = await fetch("/api/pharmacy/photo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Échec de l'upload");
      }

      const data = await response.json();
      setPhotoUrl(data.photoUrl);
      onPhotoUpdate?.(data.photoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleBannerUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("La bannière ne doit pas dépasser 10 Mo");
      return;
    }

    setError(null);
    setIsUploadingBanner(true);

    try {
      const formData = new FormData();
      formData.append("banner", file);
      formData.append("pharmacyId", pharmacyId);

      const response = await fetch("/api/pharmacy/banner", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Échec de l'upload");
      }

      const data = await response.json();
      setBannerUrl(data.bannerUrl);
      onBannerUpdate?.(data.bannerUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handlePhotoDelete = async () => {
    try {
      const response = await fetch("/api/pharmacy/photo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pharmacyId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Échec de la suppression");
      }

      setPhotoUrl(null);
      onPhotoUpdate?.(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const handleBannerDelete = async () => {
    try {
      const response = await fetch("/api/pharmacy/banner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pharmacyId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Échec de la suppression");
      }

      setBannerUrl(null);
      onBannerUpdate?.(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
    }
  };

  const handlePhotoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handlePhotoUpload(file);
  };

  const handleBannerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleBannerUpload(file);
  };

  const initials = pharmacyName?.slice(0, 2).toUpperCase() || "PH";

  return (
    <div className="space-y-6">
      {error ? <Notice tone="error" message={error} /> : null}

      {/* Bannière */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Bannière de la pharmacie</h3>
        <div className="relative">
          {/* Zone de bannière */}
          <div
            className={`relative h-32 w-full overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
              bannerUrl
                ? "border-transparent"
                : "border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#0B63D1]"
            }`}
          >
            {isLoadingBanner ? (
              <div className="flex h-full items-center justify-center bg-gray-100">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#0B63D1] border-t-transparent" />
              </div>
            ) : bannerUrl ? (
              <Image
                src={bannerUrl}
                alt="Bannière de la pharmacie"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <svg
                    className="mx-auto h-8 w-8 text-[#9CA3AF]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mt-2 text-xs text-[#6B7280]">
                    Dimensions recommandées : 1200×400
                  </p>
                </div>
              </div>
            )}

            {/* Overlay avec boutons */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                disabled={isUploadingBanner}
                className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#1F1D1B] transition hover:bg-[#F3F4F6] disabled:opacity-50"
              >
                {isUploadingBanner ? "Upload..." : bannerUrl ? "Modifier" : "Ajouter"}
              </button>
              {bannerUrl && (
                <button
                  type="button"
                  onClick={handleBannerDelete}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>

          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={handleBannerInputChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Photo de profil (logo) */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">Photo de la pharmacie</h3>
        <div className="flex items-center gap-4">
          {/* Avatar/Photo */}
          <div
            className={`relative h-24 w-24 overflow-hidden rounded-2xl border-2 border-dashed transition-colors ${
              photoUrl
                ? "border-transparent"
                : "border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#0B63D1]"
            }`}
          >
            {isLoadingPhoto ? (
              <div className="flex h-full w-full items-center justify-center bg-gray-200">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0B63D1] border-t-transparent" />
              </div>
            ) : photoUrl ? (
              <Image
                src={photoUrl}
                alt="Photo de la pharmacie"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#0B63D1] to-[#1B4A7A]">
                <span className="text-xl font-bold text-white">{initials}</span>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="rounded-lg bg-white p-2 text-[#1F1D1B] transition hover:bg-[#F3F4F6] disabled:opacity-50"
                title={photoUrl ? "Modifier" : "Ajouter"}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={isUploadingPhoto}
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#1F1D1B] transition hover:bg-[#F8FAFC] disabled:opacity-50"
            >
              {isUploadingPhoto ? "Upload..." : photoUrl ? "Modifier la photo" : "Ajouter une photo"}
            </button>
            {photoUrl && (
              <button
                type="button"
                onClick={handlePhotoDelete}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Supprimer
              </button>
            )}
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoInputChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
