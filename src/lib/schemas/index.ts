/**
 * Schémas Zod partagés Front ↔ Back
 * Valide les contrats API pour éviter les erreurs de données
 */

import { z } from "zod";

// ============================================
// Schémas de base
// ============================================

export const ObjectIdSchema = z.string().regex(/^[a-f0-9]{24}$/i, "ID MongoDB invalide");

export const EmailSchema = z.string().email("Email invalide");

export const PasswordSchema = z
  .string()
  .min(8, "Le mot de passe doit faire au moins 8 caractères")
  .regex(/[A-Z]/, "Doit contenir une majuscule")
  .regex(/[0-9]/, "Doit contenir un chiffre");

// ============================================
// Utilisateur
// ============================================

export const UserPreferencesSchema = z.object({
  language: z.string().default("fr"),
  timezone: z.string().default("Africa/Porto-Novo"),
  channels: z.array(z.string()).default([]),
  alertsEnabled: z.boolean().default(true),
  theme: z.enum(["light", "dark"]).default("light"),
});

export const UserRoleSchema = z.enum(["PATIENT", "PHARMACY_MANAGER", "ADMIN"]);

export const UserAccountStatusSchema = z.enum([
  "EN_ATTENTE",
  "VALIDE",
  "REJETE",
  "SUSPENDU",
]);

export const UserProfileSchema = z.object({
  _id: ObjectIdSchema,
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
  email: EmailSchema,
  phoneNumber: z.string().optional(),
  profilePhotoUrl: z.string().url().nullable().optional(),
  role: z.string(), // UserRoleSchema ou legacy
  country: z.string().optional(),
  accountStatus: z.string().optional(), // UserAccountStatusSchema
  isActive: z.boolean().optional(),
  emailVerifiedAt: z.string().datetime().nullable().optional(),
  preferences: UserPreferencesSchema.optional(),
});

// ============================================
// Pharmacie
// ============================================

export const PharmacyLocationSchema = z.object({
  coordinates: z.tuple([z.number(), z.number()]), // [lng, lat]
});

export const OperationalStatusSchema = z.enum(["OUVERT", "FERME"]);

export const PharmacyAccountStatusSchema = z.enum([
  "EN_ATTENTE",
  "VALIDE",
  "REJETE",
  "SUSPENDU",
]);

export const PublicPharmacySchema = z.object({
  _id: ObjectIdSchema,
  name: z.string().min(1, "Nom requis"),
  address: z.string().optional(),
  description: z.string().optional(),
  email: z.string().email().optional(),
  services: z.array(z.string()).optional(),
  photoUrl: z.string().url().nullable().optional(),
  bannerUrl: z.string().url().nullable().optional(),
  operationalStatus: OperationalStatusSchema.optional(),
  openNow: z.boolean().optional(),
  nextTransitionAt: z.string().datetime().optional(),
  location: PharmacyLocationSchema.optional(),
});

export const AdminPharmacySchema = z.object({
  _id: ObjectIdSchema,
  name: z.string(),
  address: z.string(),
  ownerId: ObjectIdSchema,
  accountStatus: z.string(),
});

// ============================================
// Produit / Médicament
// ============================================

export const ProductSchema = z.object({
  _id: ObjectIdSchema,
  name: z.string().min(1),
  scientificName: z.string().optional(),
  category: z.string().optional(),
  isMedicine: z.boolean().default(false),
  barcode: z.string().optional(),
});

export const SearchResultSchema = z.object({
  _id: ObjectIdSchema,
  productId: z.object({
    name: z.string(),
    scientificName: z.string().optional(),
    category: z.string().optional(),
    isMedicine: z.boolean(),
  }),
  pharmacyId: PublicPharmacySchema,
  price: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative(),
  isAvailable: z.boolean(),
});

// ============================================
// Inventaire Pharmacien
// ============================================

export const ManagerProductSchema = z.object({
  inventoryId: z.string(),
  price: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative(),
  alertThreshold: z.number().int().nonnegative(),
  isAvailable: z.boolean(),
  expiryDate: z.string().datetime().optional(),
  product: z.object({
    _id: ObjectIdSchema,
    name: z.string(),
    category: z.string().optional(),
    barcode: z.string().optional(),
  }),
});

export const ManagerCategorySchema = z.object({
  _id: ObjectIdSchema,
  name: z.string().min(1),
  normalizedName: z.string(),
  productCount: z.number().int().nonnegative().default(0),
});

// ============================================
// Favoris
// ============================================

export const FavoriteTypeSchema = z.enum(["PHARMACY", "PRODUCT"]);

export const FavoriteSchema = z.object({
  _id: ObjectIdSchema,
  targetType: FavoriteTypeSchema,
  pharmacyId: z.string().optional(),
  productId: z.string().optional(),
});

// ============================================
// Notifications
// ============================================

export const NotificationTypeSchema = z.enum([
  "STOCK_ALERT",
  "ORDER_STATUS",
  "VALIDATION_STATUS",
  "SYSTEM",
]);

export const NotificationSchema = z.object({
  _id: ObjectIdSchema,
  title: z.string(),
  message: z.string(),
  isRead: z.boolean(),
  sentAt: z.string().datetime(),
  type: NotificationTypeSchema,
});

// ============================================
// Admin Validation
// ============================================

export const ValidationStatusSchema = z.enum([
  "EN_ATTENTE",
  "VALIDE",
  "REJETE",
]);

export const AdminValidationSchema = z.object({
  _id: ObjectIdSchema,
  pharmacyId: z.string(),
  requestedByUserId: z.string(),
  status: ValidationStatusSchema,
  comment: z.string().optional(),
  documents: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// ============================================
// API Responses
// ============================================

export const ApiErrorSchema = z.object({
  detail: z.string(),
  code: z.string().optional(),
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export const SuccessResponseSchema = z.object({
  success: z.boolean(),
});

// ============================================
// Type exports (inférés des schémas)
// ============================================

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type PublicPharmacy = z.infer<typeof PublicPharmacySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type ManagerProduct = z.infer<typeof ManagerProductSchema>;
export type ManagerCategory = z.infer<typeof ManagerCategorySchema>;
export type Favorite = z.infer<typeof FavoriteSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type AdminValidation = z.infer<typeof AdminValidationSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
