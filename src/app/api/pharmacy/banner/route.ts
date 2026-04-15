/**
 * API pour la gestion de la bannière de la pharmacie
 * POST - Upload une nouvelle bannière
 * DELETE - Supprime la bannière
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UploadSchema = z.object({
  pharmacyId: z.string().min(1, "Pharmacy ID requis"),
});

// Mock storage des bannières de pharmacie
const pharmacyBanners = new Map<string, string>();

/**
 * POST - Upload une bannière de pharmacie
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pharmacyId = formData.get("pharmacyId") as string;
    const banner = formData.get("banner") as File | null;

    if (!pharmacyId || !banner) {
      return NextResponse.json(
        { error: "Pharmacy ID et bannière requis" },
        { status: 400 }
      );
    }

    // Validation
    if (!banner.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    if (banner.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La bannière ne doit pas dépasser 10 Mo" },
        { status: 400 }
      );
    }

    // Mock: créer une URL de données
    const bytes = await banner.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const bannerUrl = `data:${banner.type};base64,${base64}`;

    pharmacyBanners.set(pharmacyId, bannerUrl);

    console.log(`[PharmacyBanner] Bannière uploadée pour pharmacy ${pharmacyId}`);

    return NextResponse.json({
      success: true,
      bannerUrl,
      message: "Bannière mise à jour avec succès",
    });
  } catch (error) {
    console.error("[PharmacyBanner] Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

/**
 * GET - Récupère l'URL de la bannière de la pharmacie
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pharmacyId = searchParams.get("pharmacyId");

    if (!pharmacyId) {
      return NextResponse.json(
        { error: "Pharmacy ID requis" },
        { status: 400 }
      );
    }

    const bannerUrl = pharmacyBanners.get(pharmacyId) || null;

    return NextResponse.json({
      success: true,
      bannerUrl,
    });
  } catch (error) {
    console.error("[PharmacyBanner] Erreur GET:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime la bannière de la pharmacie
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const result = UploadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Pharmacy ID requis" },
        { status: 400 }
      );
    }

    const { pharmacyId } = result.data;
    pharmacyBanners.delete(pharmacyId);

    console.log(`[PharmacyBanner] Bannière supprimée pour pharmacy ${pharmacyId}`);

    return NextResponse.json({
      success: true,
      message: "Bannière supprimée avec succès",
    });
  } catch (error) {
    console.error("[PharmacyBanner] Erreur DELETE:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
