# GoPharma Frontend

Frontend Next.js de GoPharma. Ce depot est separe du backend et publie uniquement l'image frontend consommee par les stacks runtime du repo API/infra.

Remote attendu:

```text
NXTCV/go_pharma
```

Images publiees:

```text
ghcr.io/nxtcv/go-pharma-front:test
ghcr.io/nxtcv/go-pharma-front:latest
```

## Role Du Frontend

- Interface patient, pharmacie et admin.
- Recherche medicaments/pharmacies.
- Tableaux de bord patient, pharmacie et admin.
- PWA, notifications, favoris, historique et preferences.
- Proxy Next.js vers l'API NestJS via `API_PROXY_TARGET`.

L'API et l'infrastructure Docker Compose sont dans le repo separe `NXTCV/go_pharma_api`.

## Branches

Strategie:

```text
feature/* -> dev -> test -> main
```

Documentation GitHub:

- `.github/BRANCHING_STRATEGY.md`
- `.github/BRANCH_PROTECTION.md`

## Installation

```bash
npm install
```

## Configuration Locale

Creer `.env.local`:

```env
API_PROXY_TARGET=http://localhost:3000
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
```

`API_PROXY_TARGET` est l'URL interne utilisee par Next.js pour relayer les appels `/api/*` vers le backend.

Si `NEXT_PUBLIC_API_URL` est vide, le frontend utilise le proxy Next.js. Si elle est definie, certains appels peuvent cibler directement cette URL publique.

## Developpement

```bash
npm run dev
```

Selon les ports disponibles:

- Frontend: `http://localhost:3000` ou `http://localhost:3001`.
- API locale attendue: `http://localhost:3000/api/*`.

## Tests Et Build

```bash
npm run lint
npm run test
npm run test:integration
npm run build
```

Tests navigateur:

```bash
npx playwright install chromium
npm run test:e2e:browser
```

## Docker

Build image locale:

```bash
docker build -t go-pharma-front:local .
```

Compose de test CI:

```bash
docker compose --env-file .env.front-test.example -f docker-compose.front-test.yml config
docker compose --env-file .env.front-test.example -f docker-compose.front-test.yml up --build --abort-on-container-exit --exit-code-from front-test-runner front-test-runner
```

Ce compose est uniquement pour les tests frontend. Il ne deploie pas l'application runtime.

## CI/CD

Workflow principal:

```text
.github/workflows/ci.yml
```

Le workflow frontend doit:

- verifier lint/tests/build;
- builder l'image frontend;
- publier `ghcr.io/nxtcv/go-pharma-front:test` depuis la branche `test`;
- publier `ghcr.io/nxtcv/go-pharma-front:latest` depuis la branche `main`.

Le deploiement runtime complet est gere cote repo API/infra par:

```text
Gopharma/deploy/test/docker-compose.yml
Gopharma/deploy/production/docker-compose.yml
```

## Structure

```text
src/app          Routes App Router
src/components   Composants UI
src/lib          API client, schemas, observabilite, helpers
public           Assets statiques
tests            Tests integration et e2e
```

## Documentation Locale

- `FRONTEND_EVOLUTION.md`: historique fonctionnel du frontend.
- `src/lib/observability/README.md`: notes observabilite.
- `src/lib/firebase/README.md`: notes Firebase/FCM.
- `src/lib/schemas/README.md`: schemas Zod et contrats front.
