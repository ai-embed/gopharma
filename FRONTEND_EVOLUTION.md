# Evolution du Frontend GoPharma

Ce document recense les principales evolutions apportees au frontend.

## Etapes cles
- Mise en place du socle Next.js (App Router) et structure `/src`.
- Pages patient: `login`, `register`, `verify-email`, `search`.
- Ajout des pages profil utilisateur: `profile`, `history`, `favorites`, `preferences`.
- Ajout de l'ecran de modification de profil: `profile/edit`.
- Ajout du formulaire de rappel d'ordonnance: `reminders/new`.
- Ajout des composants UI utilitaires: `TopNav`, `Notice`.
- Mise en place des appels API front (helpers `apiJson` / `apiJsonAuth`).
- Recherche produits: mode simple et multi-produits, suggestions par prefix, filtres (adresse, rayon, prix, openNow, categorie).
- Ecran de recherche aligne avec la maquette map/liste (Body-1).
- Ajout du tableau de bord patient (Tableau de Bord GoPharma FR).
- Ajout de l'ecran Scan code-barres (Scan Code-Barres GoPharma FR).
- Ajout de la page details pharmacie: `pharmacies/[slug]`.
- Ajout du layout pharmacie + ecran inventaire produits: `pharmacy/inventory`.
- Ajout du tableau de bord pharmacie: `pharmacy/dashboard`.
- Ajout de l'historique activite pharmacie: `pharmacy/history`.
- Ajout de la configuration des horaires pharmacie: `pharmacy/plannings`.
- Ajout des parametres pharmacie: `pharmacy/settings`.
- Ajout de la page de connexion pharmacie professionnelle: `pharmacy-login`.
- Ajout de la page d'inscription pharmacie: `pharmacy-register`.
- Ajout de l'enregistrement manuel de produit: `pharmacy/inventory/new`.
- Alignement UI des ecrans inventaire + enregistrement produit selon les maquettes.
- Alignement de l'ecran horaires pharmacie selon la maquette "Pharmacy Operating Hours Setup".
- Ajout de la file de validation admin: `admin/validation-queue`.
- Ajout de la gestion des pharmacies admin: `admin/pharmacies`.
- Ajout de la gestion des utilisateurs admin: `admin/users`.
- Ajout de la base medicaments admin: `admin/medicaments`.
- Ajout des journaux d'audit admin: `admin/audit-logs`.
- Ajout des parametres admin: `admin/settings`.
- Ajout du tableau de bord admin: `admin/dashboard`.
- Ajout des pages analytics admin: `admin/reports`, `admin/growth`.
- Ajout des pages profils/admin creation: `admin/users/new`, `admin/users/[id]`, `admin/pharmacies/new`, `admin/pharmacies/[id]`.
- Ajout de la page localisation patient: `localisation`.
- Ajout de la page assistant: `assistant`.
- Mise en place PWA (manifest, service worker, icones, offline).

## Stabilite et build
- Correction `useSearchParams` avec `Suspense` sur `/verify-email`.
- Ajustements pour eviter les warnings `setState in effect`.
- Build force en webpack (`next build --webpack`) a cause d'une erreur Turbopack dans l'environnement local.
- Remplacement des polices Google pour eviter les fetchs reseau lors du build local.

## Tests
- Ajout de Vitest + React Testing Library.
- Tests unitaires: `Notice`.
- Test d'integration: `SearchPage` (suggestions par prefix).
- Scripts: `test`, `test:integration`, `test:all`.

## CI et Branching
- Ajout d'une pipeline CI GitHub Actions:
  - `lint`, `test`, `test:integration`, `build`.
- Documentation de la strategie de branches:
  - `feature/*` -> `dev` -> `test` -> `main`.

## Fichiers cles
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/app/(auth)/verify-email/page.tsx`
- `src/app/search/page.tsx`
- `src/components/Notice.tsx`
- `src/lib/api.ts`
- `.github/workflows/ci.yml`
- `.github/BRANCHING_STRATEGY.md`
- `.github/BRANCH_PROTECTION.md`
