/**
 * API client avec validation Zod
 * Valide automatiquement les réponses API pour garantir le contrat
 */

import { z } from "zod";
import { apiJson, apiJsonAuth } from "./api";

export type ValidatedResult<T> =
  | { ok: true; data: T; error?: never }
  | { ok: false; error: string; data?: never };

/**
 * Effectue un appel API GET avec validation Zod
 */
export async function apiGetValidated<T>(
  path: string,
  schema: z.ZodSchema<T>,
  options?: { auth?: boolean }
): Promise<ValidatedResult<T>> {
  const api = options?.auth !== false ? apiJsonAuth : apiJson;
  const result = await api<T>(path, { method: "GET" });

  if (!result.ok) {
    return { ok: false, error: result.error ?? "Erreur API" };
  }

  const parsed = schema.safeParse(result.data);
  if (!parsed.success) {
    console.error(`[API Validation Error] ${path}:`, parsed.error.format());
    return {
      ok: false,
      error: `Données invalides: ${parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", ")}`,
    };
  }

  return { ok: true, data: parsed.data };
}

/**
 * Effectue un appel API POST avec validation Zod
 */
export async function apiPostValidated<T, B = unknown>(
  path: string,
  body: B,
  responseSchema: z.ZodSchema<T>,
  options?: { auth?: boolean; bodySchema?: z.ZodSchema<B> }
): Promise<ValidatedResult<T>> {
  // Valider le body si un schéma est fourni
  if (options?.bodySchema) {
    const bodyCheck = options.bodySchema.safeParse(body);
    if (!bodyCheck.success) {
      console.error(`[Body Validation Error] ${path}:`, bodyCheck.error.format());
      return {
        ok: false,
        error: `Requête invalide: ${bodyCheck.error.issues.map((e: z.ZodIssue) => e.message).join(", ")}`,
      };
    }
  }

  const api = options?.auth !== false ? apiJsonAuth : apiJson;
  const result = await api<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!result.ok) {
    return { ok: false, error: result.error ?? "Erreur API" };
  }

  const parsed = responseSchema.safeParse(result.data);
  if (!parsed.success) {
    console.error(`[API Validation Error] ${path}:`, parsed.error.format());
    return {
      ok: false,
      error: `Données invalides: ${parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", ")}`,
    };
  }

  return { ok: true, data: parsed.data };
}

/**
 * Valide un tableau de données avec Zod
 */
export function validateArray<T>(
  data: unknown,
  itemSchema: z.ZodSchema<T>,
  context?: string
): ValidatedResult<T[]> {
  const arraySchema = z.array(itemSchema);
  const parsed = arraySchema.safeParse(data);

  if (!parsed.success) {
    console.error(`[Array Validation Error] ${context ?? ""}:`, parsed.error.format());
    return {
      ok: false,
      error: `Liste invalide: ${parsed.error.issues.map((e: z.ZodIssue) => e.message).join(", ")}`,
    };
  }

  return { ok: true, data: parsed.data };
}
