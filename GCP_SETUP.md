# Configuration GCP pour GitHub Actions - Frontend

## 🔴 Problème actuel

Le workflow GitHub Actions `build-and-push-test-image` est **DÉSACTIVÉ** car la service account GCP n'a pas les permissions requises.

```
Error: Permission 'iam.serviceAccounts.getAccessToken' denied on resource
  Service Account: 819623970340-compute@developer.gserviceaccount.com
  Permission: iam.serviceAccountTokenCreator
```

---

## ✅ Solution: Ajouter les rôles GCP

### Prérequis
- Accès à GCP Console (`https://console.cloud.google.com`)
- Rôle: `Project Editor` ou `IAM Admin`
- ID du projet: `819623970340`
- Service Account: `819623970340-compute@developer.gserviceaccount.com`

### Étapes

#### **1. Via GCP Console UI**

1. Aller à: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Cliquer sur `819623970340-compute@developer.gserviceaccount.com`
3. Onglet **"Permissions"** → Ajouter un rôle:
   ```
   - roles/artifactregistry.writer          (Artifact Registry Writer)
   - roles/iam.serviceAccountTokenCreator   (Service Account Token Creator)
   - roles/storage.admin                     (Storage Admin)
   ```

#### **2. Via CLI (gcloud)**

```bash
gcloud config set project 819623970340

# Ajouter les rôles
gcloud iam service-accounts add-iam-policy-binding \
  819623970340-compute@developer.gserviceaccount.com \
  --role=roles/iam.serviceAccountTokenCreator \
  --member=serviceAccount:819623970340-compute@developer.gserviceaccount.com

gcloud iam service-accounts add-iam-policy-binding \
  819623970340-compute@developer.gserviceaccount.com \
  --role=roles/artifactregistry.writer \
  --member=serviceAccount:819623970340-compute@developer.gserviceaccount.com

# Vérifier les rôles
gcloud iam service-accounts get-iam-policy \
  819623970340-compute@developer.gserviceaccount.com
```

---

## 🔓 Activer le workflow

Après configuration des rôles, dans `.github/workflows/ci.yml`:

**Avant (DÉSACTIVÉ):**
```yaml
build-and-push-test-image:
  if: false
```

**Après (ACTIVÉ):**
```yaml
build-and-push-test-image:
  if: github.ref == 'refs/heads/test' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch')
```

---

## 📋 Checklist avant d'activer

- [ ] Rôle `iam.serviceAccountTokenCreator` assigné ✅
- [ ] Rôle `artifactregistry.writer` assigné ✅
- [ ] Artifact Registry créé: `gopharma-test` (region: `europe-west1`)
- [ ] Secret GitHub `GCP_CREDENTIALS` rempli avec credentials JSON valides
- [ ] Secrets GitHub configurés:
  - `GCP_CREDENTIALS` (service account JSON)
  - `API_PROXY_TARGET`
  - `NEXT_PUBLIC_API_URL`
  - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

---

## 🧪 Tester après activation

```bash
# Pousser vers branche 'test' pour déclencher le workflow
git push origin feature/test-gcp-push

# Vérifier GitHub Actions: https://github.com/NXTCV/go_pharma/actions
```

---

## 📞 Ressources

- [Google Cloud IAM Documentation](https://cloud.google.com/iam/docs)
- [Artifact Registry Setup](https://cloud.google.com/artifact-registry/docs)
- [GitHub Actions Google Auth](https://github.com/google-github-actions/auth)
