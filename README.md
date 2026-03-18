# GoPharma Frontend

## Branching Strategy
This repo follows: `feature/*` -> `dev` -> `test` -> `main`.
Details are documented in `.github/BRANCHING_STRATEGY.md` and `.github/BRANCH_PROTECTION.md`.

## CI Pipeline
GitHub Actions runs on PRs and pushes for lint, unit tests, integration tests, and build.
Workflow: `.github/workflows/ci.yml`.

## Project
Ce projet est une plateforme de recherche et de gestion pharmaceutique bâtie avec [Next.js](https://nextjs.org).

## Fonctionnalités
- Authentification complète (Patient & Professionnel)
- Recherche de médicaments et pharmacies
- Historique, favoris et préférences patient
- Tableau de bord patient + pages profil (profil, historique, favoris, préférences)
- Espace pharmacie (dashboard, inventaire, horaires, historique, paramètres)
- Espace admin (dashboard, file de validation, utilisateurs, pharmacies, base médicaments, rapports, croissance, journaux d'audit)
- PWA (manifest + prompt d'installation)
- PharmaBot flottant sur les pages patient

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## Tests

```bash
npm run test
npm run test:integration
npm run lint
npm run build
```

## Structure
- `src/app`: Routes et pages (App Router)
- `src/components`: Composants UI réutilisables
- `src/lib`: Utilitaires et hooks API
