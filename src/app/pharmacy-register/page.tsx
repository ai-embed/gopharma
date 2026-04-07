"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Notice } from "@/components/Notice";
import { API_BASE, apiJson, apiJsonAuth } from "@/lib/api";
import { clearTokens, getAccessToken, saveRoleCookie } from "@/lib/auth";
import { getRoleHomePath } from "@/lib/roles";

export const dynamic = "force-dynamic";

type RegisterPharmacyResponse = {
  message?: string;
};

type FileUploadResponse = {
  fileId: string;
  filename: string;
};

type UploadedDocument = {
  fileId: string;
  filename: string;
};

type UserProfile = {
  role: string;
};

export default function PharmacyRegisterPage() {
  const router = useRouter();
  const [managerFirstName, setManagerFirstName] = useState("");
  const [managerLastName, setManagerLastName] = useState("");
  const [pharmacyName, setPharmacyName] = useState("");
  const [ifu, setIfu] = useState("");
  const [pharmacyAddress, setPharmacyAddress] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [country, setCountry] = useState("BENIN");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const documentFileIds = useMemo(
    () => uploadedDocuments.map((doc) => doc.fileId),
    [uploadedDocuments]
  );
  const passwordChecks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z\d]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

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

  const uploadFiles = async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploadError(null);
    setUploadingDocuments(true);

    try {
      const filesArray = Array.from(files);
      const uploaded: UploadedDocument[] = [];

      for (const file of filesArray) {
        const body = new FormData();
        body.append("file", file);

        const response = await fetch(`${API_BASE}/api/files`, {
          method: "POST",
          body,
        });
        const text = await response.text();
        const data = text ? (JSON.parse(text) as Partial<FileUploadResponse>) : null;

        if (!response.ok || !data?.fileId || !data?.filename) {
          throw new Error("Upload échoué");
        }

        uploaded.push({
          fileId: data.fileId,
          filename: data.filename,
        });
      }

      setUploadedDocuments((prev) => {
        const next = [...prev];
        for (const item of uploaded) {
          if (!next.some((doc) => doc.fileId === item.fileId)) {
            next.push(item);
          }
        }
        return next;
      });
    } catch {
      setUploadError("Impossible d'uploader le justificatif. Réessayez.");
    } finally {
      setUploadingDocuments(false);
    }
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadedDocuments((prev) => prev.filter((doc) => doc.fileId !== fileId));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setUploadError(null);

    if (!isPasswordValid) {
      setError(
        "Le mot de passe doit contenir 8+ caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!acceptTerms) {
      setError("Vous devez accepter les conditions pour continuer.");
      return;
    }

    if (uploadingDocuments) {
      setError("Patientez pendant l'upload des justificatifs.");
      return;
    }

    if (documentFileIds.length === 0) {
      setError("Ajoutez au moins un justificatif IFU pour finaliser l'inscription.");
      return;
    }

    setLoading(true);

    const result = await apiJson<RegisterPharmacyResponse>("/api/auth/register-pharmacy", {
      method: "POST",
      body: JSON.stringify({
        managerFirstName: managerFirstName.trim(),
        managerLastName: managerLastName.trim(),
        managerEmail: managerEmail.trim().toLowerCase(),
        password,
        country: country.trim(),
        pharmacyName: pharmacyName.trim(),
        pharmacyAddress: pharmacyAddress.trim(),
        ifu: ifu.trim(),
        documentFileIds,
      }),
    });

    setLoading(false);

    if (!result.ok || !result.data) {
      setError(result.error ?? "Inscription professionnelle impossible.");
      return;
    }

    setSuccess(
      result.data.message ??
        "Compte pharmacie créé. Il reste en attente de validation administrative."
    );

    window.setTimeout(() => {
      router.push("/pharmacy-login");
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-[#F3F6F9] px-6 py-10 text-[#1F1D1B]">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B63D1] text-sm font-semibold text-white">
              +
            </span>
            <span className="text-sm font-semibold">GoPharma Pro</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6B7280]">
            <Link href="/pharmacy-login">Connexion</Link>
            <span className="rounded-full bg-[#0B63D1] px-4 py-2 font-semibold text-white">
              S&apos;inscrire
            </span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <h1 className="text-2xl font-semibold">
            Créez votre compte pharmacie
          </h1>
          <p className="mt-2 text-sm text-[#6B7280]">
            Rejoignez notre réseau pour gérer votre catalogue, vos stocks et
            présenter votre établissement.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#EAF2FF] px-3 py-2 text-[11px] font-semibold text-[#0B63D1]">
            Compte soumis à validation administrative
          </span>
        </div>

        <form
          className="mt-8 rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-8"
          onSubmit={onSubmit}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Prénom du gérant
              </label>
              <input
                value={managerFirstName}
                onChange={(event) => setManagerFirstName(event.target.value)}
                placeholder="Aïcha"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Nom du gérant
              </label>
              <input
                value={managerLastName}
                onChange={(event) => setManagerLastName(event.target.value)}
                placeholder="Adjoua"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-1">
              <label className="text-xs font-semibold text-[#6B7280]">
                Nom de la pharmacie
              </label>
              <input
                value={pharmacyName}
                onChange={(event) => setPharmacyName(event.target.value)}
                placeholder="Pharmacie de la Santé"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Numéro IFU
              </label>
              <input
                value={ifu}
                onChange={(event) => setIfu(event.target.value)}
                placeholder="0000000000000"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Adresse de l&apos;entreprise
              </label>
              <input
                value={pharmacyAddress}
                onChange={(event) => setPharmacyAddress(event.target.value)}
                placeholder="123 Rue de la Pharmacie, Ville, Pays"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                E-mail professionnel
              </label>
              <input
                type="email"
                value={managerEmail}
                onChange={(event) => setManagerEmail(event.target.value)}
                placeholder="contact@pharmacie.com"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Pays
              </label>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
              >
                <option value="BENIN">Bénin</option>
                <option value="FRANCE">France</option>
                <option value="SENEGAL">Sénégal</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                required
              />
              <div className="grid gap-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-[11px] text-[#6B7280] sm:grid-cols-2">
                <span className={passwordChecks.length ? "text-[#0B63D1]" : ""}>
                  8+ caractères
                </span>
                <span className={passwordChecks.upper ? "text-[#0B63D1]" : ""}>
                  1 majuscule
                </span>
                <span className={passwordChecks.lower ? "text-[#0B63D1]" : ""}>
                  1 minuscule
                </span>
                <span className={passwordChecks.digit ? "text-[#0B63D1]" : ""}>
                  1 chiffre
                </span>
                <span className={passwordChecks.special ? "text-[#0B63D1]" : ""}>
                  1 caractère spécial
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#6B7280]">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm"
                required
              />
            </div>
          </div>

          <div
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragOver(false);
              void uploadFiles(event.dataTransfer.files);
            }}
            className={`mt-6 rounded-2xl border-2 border-dashed bg-[#F8FAFC] px-4 py-8 text-center text-xs transition ${
              isDragOver
                ? "border-[#0B63D1] bg-[#EEF5FF]"
                : "border-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0B63D1]">
              +
            </div>
            <p className="mt-3 font-semibold text-[#0B63D1]">
              Déposez vos justificatifs IFU
            </p>
            <p className="mt-1 text-[11px]">
              PDF, JPG, PNG. Vous pouvez aussi cliquer pour sélectionner un fichier.
            </p>
            <label className="mt-4 inline-flex cursor-pointer items-center rounded-full border border-[#D6DFEB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]">
              Choisir des fichiers
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                onChange={(event) => {
                  if (event.target.files) {
                    void uploadFiles(event.target.files);
                  }
                  event.target.value = "";
                }}
              />
            </label>
            {uploadingDocuments ? (
              <p className="mt-2 text-[11px] text-[#0B63D1]">Upload en cours...</p>
            ) : null}
            {uploadedDocuments.length > 0 ? (
              <div className="mt-4 space-y-2 text-left">
                {uploadedDocuments.map((doc) => (
                  <div
                    key={doc.fileId}
                    className="flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-3 py-2"
                  >
                    <p className="truncate pr-2 text-[11px] text-[#1F1D1B]">{doc.filename}</p>
                    <button
                      type="button"
                      onClick={() => removeUploadedFile(doc.fileId)}
                      className="text-[11px] font-semibold text-[#EF4444]"
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {error ? <Notice tone="error" message={error} /> : null}
          {uploadError ? <Notice tone="error" message={uploadError} /> : null}
          {success ? <Notice tone="success" message={success} /> : null}

          <label className="mt-6 flex items-start gap-2 text-xs text-[#6B7280]">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(event) => setAcceptTerms(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#0B63D1]"
            />
            <span>
              J&apos;accepte les conditions générales. Je comprends que mon
              compte restera en attente de validation par un administrateur.
            </span>
          </label>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <Link
              href="/pharmacy-login"
              className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold text-[#1F1D1B]"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#0B63D1] px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Création..." : "Créer le compte"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-[10px] text-[#9CA3AF]">
          © 2026 GoPharma. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
