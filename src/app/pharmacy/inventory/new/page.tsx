"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Notice } from "@/components/Notice";
import { API_BASE, apiJsonAuth } from "@/lib/api";

type FileUploadResponse = {
  fileId: string;
  filename: string;
};

type CreateProductResponse = {
  inventory: {
    _id: string;
  };
  product: {
    _id: string;
    name: string;
  };
};

type ManagerCategory = {
  _id: string;
  name: string;
};

const CATEGORY_PLACEHOLDER = "Sélectionner une catégorie";

export default function PharmacyInventoryNewPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState("");
  const [scientificName, setScientificName] = useState("");
  const [category, setCategory] = useState(CATEGORY_PLACEHOLDER);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([
    CATEGORY_PLACEHOLDER,
  ]);
  const [barcode, setBarcode] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [storageInstructions, setStorageInstructions] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<FileUploadResponse | null>(null);

  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      const result = await apiJsonAuth<ManagerCategory[]>(
        "/api/manager/products/categories"
      );
      if (!result.ok || !result.data) return;
      const names = result.data
        .map((item) => item.name.trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b));
      setCategoryOptions([CATEGORY_PLACEHOLDER, ...names]);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const canSubmit = useMemo(() => {
    return (
      name.trim().length > 0 &&
      stockQuantity.trim().length > 0 &&
      price.trim().length > 0 &&
      !saving &&
      !uploadingPhoto
    );
  }, [name, price, saving, stockQuantity, uploadingPhoto]);

  const uploadPhotoIfNeeded = async () => {
    if (!photoFile || uploadedPhoto) return uploadedPhoto;

    setUploadingPhoto(true);
    const body = new FormData();
    body.append("file", photoFile);

    try {
      const response = await fetch(`${API_BASE}/api/files`, {
        method: "POST",
        body,
      });
      const text = await response.text();
      const data = text ? (JSON.parse(text) as Partial<FileUploadResponse>) : null;

      if (!response.ok || !data?.fileId || !data?.filename) {
        throw new Error("Upload impossible");
      }

      const uploaded = { fileId: data.fileId, filename: data.filename };
      setUploadedPhoto(uploaded);
      return uploaded;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const parsedStock = Number(stockQuantity);
    const parsedPrice = Number(price.replace(",", "."));

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      setError("Quantité initiale invalide.");
      return;
    }

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError("Prix unitaire invalide.");
      return;
    }

    setSaving(true);

    try {
      let noticeUrl: string | undefined;
      if (photoFile) {
        const uploaded = await uploadPhotoIfNeeded();
        if (uploaded?.fileId) {
          noticeUrl = `/api/files/${uploaded.fileId}`;
        }
      }

      const result = await apiJsonAuth<CreateProductResponse>("/api/manager/products", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          scientificName: scientificName.trim() || undefined,
          category: category !== CATEGORY_PLACEHOLDER ? category : undefined,
          barcode: barcode.trim() || undefined,
          stockQuantity: Math.floor(parsedStock),
          price: parsedPrice,
          expiryDate: expiryDate
            ? new Date(`${expiryDate}T00:00:00.000Z`).toISOString()
            : undefined,
          description: storageInstructions.trim() || undefined,
          noticeUrl,
        }),
      });

      if (!result.ok || !result.data) {
        setError(result.error ?? "Enregistrement produit impossible.");
        setSaving(false);
        return;
      }

      setSuccess(`Produit "${result.data.product.name}" enregistré avec succès.`);
      setSaving(false);
      window.setTimeout(() => {
        router.push("/pharmacy/inventory");
      }, 900);
    } catch {
      setSaving(false);
      setError("Enregistrement produit impossible.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Enregistrement Manuel de Produit</h1>
      </div>

      {error ? <Notice tone="error" message={error} /> : null}
      {success ? <Notice tone="success" message={success} /> : null}

      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-[#E5E7EB] bg-white p-6"
      >
        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M7 3.5h7l3 3V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 3.5V7h3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">Informations sur le Produit</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">Nom du produit</label>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="ex: Doliprane 1000mg"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Nom scientifique / Molécule
                </label>
                <input
                  value={scientificName}
                  onChange={(event) => setScientificName(event.target.value)}
                  placeholder="ex: Paracetamol"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">Catégorie</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                >
                  {categoryOptions.map((entry) => (
                    <option key={entry} value={entry}>
                      {entry}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">
                  Code-barres{" "}
                  <span className="text-[10px] font-medium text-[#9CA3AF]">(optionnel)</span>
                </label>
                <input
                  value={barcode}
                  onChange={(event) => setBarcode(event.target.value)}
                  placeholder="Scanner ou saisir le code"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2FF] text-[#0B63D1]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M4.5 8.5h15v9a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-9z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h2 className="text-sm font-semibold">Stock et Prix</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">Quantité initiale</label>
                <input
                  value={stockQuantity}
                  onChange={(event) => setStockQuantity(event.target.value)}
                  type="number"
                  min={0}
                  placeholder="0"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">Prix unitaire (€)</label>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  inputMode="decimal"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#6B7280]">Date d&apos;expiration</label>
                <input
                  value={expiryDate}
                  onChange={(event) => setExpiryDate(event.target.value)}
                  type="date"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Instructions de stockage</h2>
              <textarea
                value={storageInstructions}
                onChange={(event) => setStorageInstructions(event.target.value)}
                placeholder="Ex: Conserver dans un endroit frais et sec, à moins de 25°C."
                maxLength={500}
                className="min-h-[140px] w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#1F1D1B]"
              />
              <p className="text-right text-[10px] text-[#9CA3AF]">
                {storageInstructions.length}/500 caractères
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-semibold">Photo du produit</h2>
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.gif,.webp"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setPhotoFile(file);
                  setUploadedPhoto(null);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-40 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] text-center text-xs text-[#6B7280]"
              >
                <p className="font-semibold text-[#0B63D1]">
                  {photoFile ? "Fichier sélectionné" : "Télécharger un fichier"}
                </p>
                <p className="mt-1 text-[11px]">
                  {photoFile ? photoFile.name : "ou glisser-déposer"}
                </p>
                <p className="text-[10px] text-[#9CA3AF]">PNG, JPG, GIF jusqu&apos;à 10MB</p>
              </button>
              {uploadedPhoto ? (
                <p className="text-[11px] text-emerald-700">
                  Fichier uploadé: {uploadedPhoto.filename}
                </p>
              ) : null}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/pharmacy/inventory")}
              className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            >
              {saving || uploadingPhoto ? "Enregistrement..." : "Enregistrer le Produit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
