# Schémas Zod Partagés - Contrats Front↔Back

Ce dossier contient les schémas de validation Zod pour garantir les contrats API entre le frontend et le backend.

## Usage

### 1. Schémas disponibles

- `UserProfileSchema` - Profil utilisateur
- `PublicPharmacySchema` - Pharmacie (vue publique)
- `SearchResultSchema` - Résultat de recherche
- `ManagerProductSchema` - Produit en inventaire
- `AdminValidationSchema` - Validation admin
- `LoginResponseSchema` - Réponse login
- Et plus...

### 2. API Validée

Utilisez les fonctions d'API avec validation automatique :

```typescript
import { apiGetValidated, apiPostValidated } from "@/lib/api-validated";
import { UserProfileSchema, LoginResponseSchema } from "@/lib/schemas";

// GET avec validation
const result = await apiGetValidated("/api/users/me", UserProfileSchema);
if (result.ok) {
  console.log(result.data.firstName); // Type-safe!
}

// POST avec validation body + response
const loginResult = await apiPostValidated(
  "/api/auth/login",
  { email, password },
  LoginResponseSchema,
  { bodySchema: LoginBodySchema }
);
```

### 3. Hooks validés

Remplacez les hooks existants par les versions validées :

```typescript
// Avant
import { useUser } from "@/lib/useUser";

// Après
import { useUser } from "@/lib/useUserValidated";
```

## Bénéfices

1. **Détection immédiate** des données API invalides
2. **Type safety** garanti par inférence Zod
3. **Messages d'erreur clairs** pour le debug
4. **Contrat explicite** front↔back

## Migration progressive

1. Les schémas sont **optionnels** - les anciens hooks continuent de fonctionner
2. Migrer un composant à la fois en remplaçant `apiJson` par `apiGetValidated`
3. Ajouter des schémas au besoin dans `schemas/index.ts`
