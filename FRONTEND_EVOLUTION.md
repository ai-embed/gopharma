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
