# GoPharma Frontend

## Branching Strategy
This repo follows: `feature/*` -> `dev` -> `test` -> `main`.
Details are documented in `.github/BRANCHING_STRATEGY.md` and `.github/BRANCH_PROTECTION.md`.

## CI/CD Pipeline
GitHub Actions runs on PRs and pushes for lint, unit tests, integration tests, build, and Docker test environment.
Workflow: `.github/workflows/ci.yml`.

### Environments
- **test** : déploiement automatique sur push vers la branche `test` (secrets: `API_PROXY_TARGET`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`)
- **production** : déploiement automatique sur push vers la branche `main` (mêmes secrets)

### Docker test environment
Le job `docker-test-env` exécute lint, unit tests et integration tests dans un conteneur Docker isolé via `docker-compose.front-test.yml`.

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

## Connexion au backend

Le frontend utilise maintenant un proxy Next.js pour relayer ` /api/* ` vers le backend GoPharma. Cela évite les problèmes de CORS et garde les appels front sur la même origine.

Créez un fichier `.env.local` dans le frontend avec :

```bash
API_PROXY_TARGET=http://localhost:3000
```

Le backend NestJS doit exposer ses routes sous `http://localhost:3000/api/*`.

Le flux de connexion patient/professionnel est branché sur les endpoints réels :
- `POST /api/auth/login`
- `GET /api/users/me`

Le flux d’inscription est partiellement branché :
- patient : `POST /api/auth/register-patient`
- pharmacie : `POST /api/auth/register-pharmacy`

Après connexion, le frontend redirige automatiquement selon le rôle :
- `ADMIN` → `/admin/dashboard`
- `PHARMACY_MANAGER` → `/pharmacy/dashboard`
- `PATIENT` → `/dashboard`

Modules déjà branchés sur l’API backend :
- auth (`/api/auth/*`, `/api/users/me`)
- recherche (`/api/search/*`, `/api/pharmacies/:id`, `/api/pharmacies/:id/schedule`)
- historique, favoris, notifications et rappels
- espaces admin et pharmacie sur leurs endpoints dédiés

Certains écrans restent encore partiellement mockés ou hybrides, mais la base applicative n’est plus limitée au seul login/register.

Option avancée :
- `NEXT_PUBLIC_API_URL` peut être défini si vous voulez forcer des appels directs vers une URL externe.
- Si `NEXT_PUBLIC_API_URL` est vide, le frontend passe automatiquement par le proxy Next.

## Démarrage

```bash
npm run dev
```

Ouvrez l’URL indiquée par Next.js dans le terminal. En local, ce sera souvent :
- `http://localhost:3000` si ce port est libre
- `http://localhost:3001` si le backend utilise déjà `3000`

Si le backend tourne aussi sur la machine locale, relancez Next.js après modification de `.env.local`.

## Tests

```bash
npm run test
npm run test:integration
npx playwright install chromium
npm run test:e2e:browser
npm run lint
npm run build
```

Le script `test:e2e:browser` valide les protections d'accès de routes (patient/pharmacie/admin) en navigateur réel via Playwright.

## Structure
- `src/app`: Routes et pages (App Router)
- `src/components`: Composants UI réutilisables
- `src/lib`: Utilitaires et hooks API
- `docker-compose.front-test.yml`: Environnement de test Dockerisé pour CI
