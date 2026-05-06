# Firebase Cloud Messaging (FCM) - Push Notifications

## 📋 Checklist Configuration

### 1. Créer un projet Firebase

1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Cliquer **"Add project"**
3. Nommer le projet : `gopharma-prod`
4. Désactiver Google Analytics (optionnel)
5. Cliquer **"Create project"**

### 2. Ajouter une app Web

1. Dans le projet Firebase, cliquer **"</>"** (Web)
2. Nommer l'app : `gopharma-web`
3. **Copier la config** qui s'affiche (on en a besoin pour l'étape 4)
4. Cliquer **"Continue"** puis **"Skip"**

### 3. Activer Cloud Messaging

1. Menu latéral → **"Cloud Messaging"** (sous "Engage")
2. Cliquer **"Enable"** si demandé
3. Vérifier que l'API FCM est activée

### 4. Configurer Web Push

1. Dans Cloud Messaging → **"Web certificates"** tab
2. Cliquer **"Generate key pair"**
3. **Copier la VAPID key** (clé publique)

### 5. Mettre à jour les fichiers

**`.env.local` (Frontend)**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gopharma-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gopharma-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gopharma-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_VAPID_KEY=BLxxxxxxxx...
```

**`public/firebase-messaging-sw.js`**
Remplacer les `YOUR_*` par les mêmes valeurs que `.env.local`

### 6. Backend - Clé serveur

1. Firebase Console → ⚙️ **Project settings**
2. Onglet **"Cloud Messaging"**
3. Copier **"Server key"** (ou générer si absent)
4. Ajouter au backend `.env` :
```env
FIREBASE_SERVER_KEY=AAAA...
```

### 7. Backend - API pour envoyer les pushes

```typescript
// Exemple d'envoi push depuis le backend
async function sendPush(userFcmToken: string, title: string, body: string) {
  const response = await fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `key=${process.env.FIREBASE_SERVER_KEY}`,
    },
    body: JSON.stringify({
      to: userFcmToken,
      notification: { title, body },
      data: { type: "ORDER_STATUS", orderId: "123" },
    }),
  });
  return response.ok;
}
```

---

## 📱 Usage dans les composants

```tsx
import { PushNotificationPrompt } from "@/components/PushNotificationPrompt";
import { usePushNotifications } from "@/lib/usePushNotifications";

// 1. Dans la page paramètres/utilisateur
function SettingsPage({ user }) {
  return <PushNotificationPrompt userId={user._id} />;
}

// 2. Dans le layout pour écouter en temps réel
function AppLayout({ user }) {
  const { lastMessage } = usePushNotifications(user?._id);
  
  useEffect(() => {
    if (lastMessage) {
      // Afficher toast ou mettre à jour UI
      toast.info(lastMessage.title + ": " + lastMessage.body);
    }
  }, [lastMessage]);
  
  return <>{children}</>;
}
```

---

## 🧪 Test

1. Ouvrir l'app dans Chrome/Firefox
2. Accepter les notifications
3. Copier le FCM token depuis la console
4. Utiliser [Firebase Console](https://console.firebase.google.com) → Cloud Messaging → **"Send test message"**

---

## 📱 iOS / Android (PWA/Capacitor)

| Plateforme | Support | Notes |
|------------|---------|-------|
| Chrome Android | ✅ Parfait | Natif FCM |
| Safari iOS 16.4+ | ✅ Web Push | Ajouté en 2023 |
| Chrome iOS | ❌ Non | WebKit limitation |
| Capacitor App | ✅ Avec plugin | `capacitor-push-notifications` |

Pour une app native mobile, utiliser **Expo Push** ou **Capacitor FCM plugin**.

---

## 🔧 Troubleshooting

| Problème | Solution |
|----------|----------|
| "Configuration manquante" | Vérifier `.env.local` |
| Service Worker 404 | Vérifier `firebase-messaging-sw.js` dans `public/` |
| Token null | Vérifier VAPID key, permission navigateur |
| Notifs pas reçues (background) | Vérifier Service Worker enregistré dans DevTools → Application |
| Mobile iOS pas reçu | Nécessite PWA installée (Add to Home Screen) |

---

**Besoin d'aide ?** [Documentation FCM](https://firebase.google.com/docs/cloud-messaging/js/client)
