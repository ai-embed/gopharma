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
- Historique et favoris
- Profil utilisateur

## Installation

```bash
npm install
```

## Démarrage

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir le résultat.

## Structure
- `src/app`: Routes et pages (App Router)
- `src/components`: Composants UI réutilisables
- `src/lib`: Utilitaires et hooks API
