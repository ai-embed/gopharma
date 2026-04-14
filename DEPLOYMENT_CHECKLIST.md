# Checklist Déploiement Staging - GoPharma

## 🚀 Résumé des Améliorations à Déployer

| Amélioration | Fichiers Clés | Status |
|--------------|---------------|--------|
| Tests E2E Playwright | `tests/e2e/*.spec.ts` | ✅ Ready |
| Contracts API Zod | `src/lib/schemas/`, `src/lib/api-validated.ts` | ✅ Ready |
| Observabilité | `src/lib/observability/`, `src/app/admin/observability/` | ✅ Ready |
| WebSocket Notifications | `src/lib/useWebSocket.ts`, `src/lib/RealTimeNotificationsProvider.tsx` | ✅ Ready |
| Sécurité Rate Limiting | `src/lib/security/`, `src/app/(auth)/*/LoginForm.tsx` | ✅ Ready |
| FCM Push (disabled) | `src/lib/firebase/` | ⚠️ Config Firebase requise |

---

## ✅ Pré-Déploiement

### 1. Variables d'environnement

Copier dans `.env.local` (staging/production):

```env
# Base
NEXT_PUBLIC_API_BASE_URL=https://api-staging.gopharma.com
NEXT_PUBLIC_APP_URL=https://staging.gopharma.com

# Observabilité (optionnel)
NEXT_PUBLIC_LOG_LEVEL=info

# FCM (désactivé pour l'instant - config plus tard)
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=
# NEXT_PUBLIC_FIREBASE_VAPID_KEY=
```

### 2. Dépendances

```bash
npm ci
npm run build
```

### 3. Tests

```bash
npm run test:e2e:browser  # Déjà validé: 6/6 passed
```

---

## 🏗️ Build Production

```bash
# Build Next.js
npm run build

# Vérifier static export si utilisé
# ou server start pour SSR
```

---

## 📋 Checklist Pré-Déploiement

- [ ] `.env.local` configuré avec URLs staging
- [ ] Build réussi sans erreurs
- [ ] Tests E2E passent (6/6)
- [ ] Pas de secrets/commit dans le code
- [ ] Database migrations à jour (si applicable)
- [ ] Redis/WebSocket server prêt (si utilisé)

---

## 🚀 Déploiement Staging

### Option A: Vercel (recommandé pour Next.js)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel --target=preview

# Ou push sur branche avec Vercel Git integration
```

### Option B: Docker

```bash
# Build image
docker build -t gopharma:staging .

# Run
docker run -p 3000:3000 --env-file .env.local gopharma:staging
```

### Option C: Serveur dédié

```bash
# Build
npm run build

# Start
npm start
# ou
pm2 start npm --name "gopharma-staging" -- start
```

---

## 🔍 Post-Déploiement Vérifications

### 1. Health Check

```bash
curl https://staging.gopharma.com/api/health
# Doit retourner: { "status": "ok" }
```

### 2. Routes Critiques

| Route | Vérification |
|-------|--------------|
| `/` | Page d'accueil charge |
| `/login` | Formulaire login avec rate limiting |
| `/admin/dashboard` | Accès admin (avec mock auth) |
| `/admin/observability` | Dashboard observabilité visible |
| `/search` | Recherche fonctionne |

### 3. Fonctionnalités

- [ ] Login avec rate limiting (5 tentatives max)
- [ ] WebSocket se connecte (dans console browser)
- [ ] Navigation admin sans erreurs
- [ ] Logs structurés visibles (console/server)

---

## ⚠️ Notes Importantes

### WebSocket (Real-time notifications)

Si tu utilises WebSocket réel (pas mock), s'assurer que:
- Le serveur WebSocket est déployé et accessible
- `NEXT_PUBLIC_WS_URL` est configuré
- Le firewall autorise le port WebSocket

### Observabilité

Le dashboard `/admin/observability` lit les logs côté client pour l'instant. Pour production:
- Intégrer avec service de logs (Datadog, LogRocket, Sentry)
- Ou créer endpoint API `/api/logs` pour agrégation

### Rate Limiting

Actuellement stocké dans `localStorage` (client-side uniquement). Pour production robuste:
- Ajouter rate limiting serveur (Redis-based)
- Synchroniser avec backend pour blocage global

---

## 🔄 Rollback Plan

En cas de problème:

```bash
# Vercel
vercel --target=production  # redeploy previous

# Docker
docker stop gopharma-staging
docker run -d --name gopharma-staging-old IMAGE_PRECEDENTE

# Git
git revert HEAD
git push
```

---

## 📞 Support

En cas d'erreur déploiement:

1. Vérifier les logs: `vercel logs` ou `docker logs`
2. Check env vars manquantes
3. Builder en local d'abord: `npm run build`
4. Vérifier les dépendances: `npm ls`

---

**Prêt pour déploiement ?** ✅
