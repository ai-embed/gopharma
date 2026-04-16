"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { apiJsonAuth } from "@/lib/api";
import { Notice } from "./Notice";

interface ProfilePhotoUploadProps {
  userId: string;
  currentPhotoUrl?: string | null;
  firstName: string;
  lastName: string;
  onPhotoUpdate?: (url: string | null) => void;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { container: "h-16 w-16", icon: "h-6 w-6", text: "text-sm" },
  md: { container: "h-24 w-24", icon: "h-8 w-8", text: "text-lg" },
  lg: { container: "h-32 w-32", icon: "h-10 w-10", text: "text-2xl" },
};

export function ProfilePhotoUpload({
  userId,
  currentPhotoUrl,
  firstName,
  lastName,
  onPhotoUpdate,
  size = "md",
}: ProfilePhotoUploadProps) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
  const sizes = sizeClasses[size];

  // Charger la photo depuis le backend au montage
  useEffect(() => {
    if (!userId) return;

    const loadPhoto = async () => {
      setIsLoading(true);
      try {
        // Utiliser le endpoint /api/users/me pour récupérer le profil avec la photo
        const result = await apiJsonAuth<{ profilePhotoUrl: string | null }>(
          "/api/users/me"
        );
        if (result.ok && result.data) {
          setPhotoUrl(result.data.profilePhotoUrl || null);
        }
      } catch {
        // Silently fail - pas de photo = pas d'erreur
      } finally {
        setIsLoading(false);
      }
    };

    void loadPhoto();
  }, [userId]);

  const handleFileChange = async (file: File) => {
    // Validation
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (JPG, PNG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      // Appel direct au backend NestJS
      const response = await apiJsonAuth<{ user: { profilePhotoUrl: string } }>(
        "/api/users/me/photo",
        {
          method: "POST",
          body: formData,
          // Ne pas mettre Content-Type, fetch le fait automatiquement pour FormData
        }
      );

      if (!response.ok) {
        throw new Error(response.error || "Échec de l'upload");
      }

      const photoUrl = response.data?.user?.profilePhotoUrl || null;
      setPhotoUrl(photoUrl);
      onPhotoUpdate?.(photoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  }, [handleFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDelete = async () => {
    if (!photoUrl) return;

    setIsUploading(true);
    try {
      const result = await apiJsonAuth("/api/users/me/photo", {
        method: "DELETE",
      });

      if (result.ok) {
        setPhotoUrl(null);
        onPhotoUpdate?.(null);
      } else {
        setError(result.error || "Échec de la suppression");
      }
    } catch {
      setError("Erreur lors de la suppression");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <Notice tone="error" message={error} />}

      <div className="flex items-center gap-4">
        {/* Photo/Avatar */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            ${sizes.container} relative cursor-pointer overflow-hidden rounded-2xl
            ${isDragging ? "ring-4 ring-blue-400 ring-offset-2" : ""}
            ${photoUrl ? "" : "bg-linear-to-br from-[#0B63D1] to-[#1E40AF]"}
            transition-all hover:scale-105 hover:shadow-lg
          `}
        >
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center bg-gray-200">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0B63D1] border-t-transparent" />
            </div>
          ) : photoUrl ? (
            <Image
              src={photoUrl}
              alt={`${firstName} ${lastName}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className={`${sizes.text} font-bold text-white`}>{initials}</span>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <svg
              className={`${sizes.icon} text-white`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
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
          </div>

          {/* Loading spinner */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="rounded-xl bg-[#0B63D1] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A58BA] disabled:opacity-50"
          >
            {photoUrl ? "Changer la photo" : "Ajouter une photo"}
          </button>

          {photoUrl && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isUploading}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-[#6B7280]">
        JPG, PNG ou WebP. Max 5 Mo. Glissez-déposez ou cliquez pour sélectionner.
      </p>
    </div>
  );
}
