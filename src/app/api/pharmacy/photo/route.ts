/**
 * API pour la gestion de la photo de la pharmacie
 * POST - Upload une nouvelle photo
 * DELETE - Supprime la photo
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UploadSchema = z.object({
  pharmacyId: z.string().min(1, "Pharmacy ID requis"),
});

// Mock storage des photos de pharmacie
const pharmacyPhotos = new Map<string, string>();

/**
 * POST - Upload une photo de pharmacie
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const pharmacyId = formData.get("pharmacyId") as string;
    const photo = formData.get("photo") as File | null;

    if (!pharmacyId || !photo) {
      return NextResponse.json(
        { error: "Pharmacy ID et photo requis" },
        { status: 400 }
      );
    }

    // Validation
    if (!photo.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    if (photo.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "L'image ne doit pas dépasser 5 Mo" },
        { status: 400 }
      );
    }

    // Mock: créer une URL de données
    const bytes = await photo.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const photoUrl = `data:${photo.type};base64,${base64}`;

    pharmacyPhotos.set(pharmacyId, photoUrl);

    console.log(`[PharmacyPhoto] Photo uploadée pour pharmacy ${pharmacyId}`);

    return NextResponse.json({
      success: true,
      photoUrl,
      message: "Photo mise à jour avec succès",
    });
  } catch (error) {
    console.error("[PharmacyPhoto] Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

/**
 * GET - Récupère l'URL de la photo de la pharmacie
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

    const photoUrl = pharmacyPhotos.get(pharmacyId) || null;

    return NextResponse.json({
      success: true,
      photoUrl,
    });
  } catch (error) {
    console.error("[PharmacyPhoto] Erreur GET:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime la photo de la pharmacie
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
    pharmacyPhotos.delete(pharmacyId);

    console.log(`[PharmacyPhoto] Photo supprimée pour pharmacy ${pharmacyId}`);

    return NextResponse.json({
      success: true,
      message: "Photo supprimée avec succès",
    });
  } catch (error) {
    console.error("[PharmacyPhoto] Erreur DELETE:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
