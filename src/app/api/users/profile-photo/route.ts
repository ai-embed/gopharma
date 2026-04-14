/**
 * API pour la gestion des photos de profil
 * POST - Upload une nouvelle photo
 * GET - Récupère l'URL de la photo actuelle
 * DELETE - Supprime la photo de profil
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UploadSchema = z.object({
  userId: z.string().min(1, "User ID requis"),
});

// Mock storage des photos (à remplacer par S3/Cloudinary/Supabase Storage)
const userPhotos = new Map<string, string>();

/**
 * POST - Upload une photo de profil
 * En production: uploader vers S3/Cloudinary et stocker l'URL
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const photo = formData.get("photo") as File | null;

    if (!userId || !photo) {
      return NextResponse.json(
        { error: "User ID et photo requis" },
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

    // TODO: En production, uploader vers S3/Cloudinary/Supabase
    // const uploadResult = await uploadToS3(photo, `profiles/${userId}`);
    // const photoUrl = uploadResult.url;

    // Mock: créer une URL de données ou utiliser un placeholder
    const bytes = await photo.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const photoUrl = `data:${photo.type};base64,${base64}`;

    // Stocker l'URL (à remplacer par DB)
    userPhotos.set(userId, photoUrl);

    console.log(`[ProfilePhoto] Photo uploadée pour user ${userId}`);

    return NextResponse.json({
      success: true,
      photoUrl,
      message: "Photo mise à jour avec succès",
    });
  } catch (error) {
    console.error("[ProfilePhoto] Erreur upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    );
  }
}

/**
 * GET - Récupère l'URL de la photo de profil
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID requis" },
        { status: 400 }
      );
    }

    // TODO: Récupérer depuis DB
    const photoUrl = userPhotos.get(userId) || null;

    return NextResponse.json({
      success: true,
      photoUrl,
    });
  } catch (error) {
    console.error("[ProfilePhoto] Erreur GET:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime la photo de profil
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const result = UploadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "User ID requis" },
        { status: 400 }
      );
    }

    const { userId } = result.data;

    // TODO: Supprimer de S3/Cloudinary si applicable
    // await deleteFromS3(`profiles/${userId}`);

    // Supprimer de la DB mock
    userPhotos.delete(userId);

    console.log(`[ProfilePhoto] Photo supprimée pour user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Photo supprimée avec succès",
    });
  } catch (error) {
    console.error("[ProfilePhoto] Erreur DELETE:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
