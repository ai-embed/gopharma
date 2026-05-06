# Observabilité Production

## Architecture

### 1. Logger Structuré (`logger.ts`)

Génère des logs JSON avec correlation ID pour le tracing.

```typescript
import { logger, getTraceId, setTraceId } from "@/lib/observability/logger";

// Générer un trace ID pour la requête courante
setTraceId(logger.generateTraceId());

// Logger avec contexte
logger.info("Requête API", {
  traceId: getTraceId(),
  path: "/api/users",
  method: "GET",
  userId: "user-123",
});

logger.error("Échec connexion base de données", {
  traceId: getTraceId(),
  path: "/api/search",
}, error);
```

**En production** : Les logs sont output en JSON pour agrégation (ELK, Datadog, etc.)
**En développement** : Console avec couleurs et groupes

### 2. Middleware Trace ID (`middleware.ts`)

Injecte automatiquement un `x-trace-id` dans chaque requête.

```
Requête -> [Middleware] -> Ajoute x-trace-id -> [Route Handler]
         -> Log structuré avec trace ID
```

Le trace ID est propagé via:
- Header HTTP `x-trace-id` (client/server)
- Logs structurés
- Réponses API

### 3. Dashboard Observabilité (`admin/observability`)

Visualisation des erreurs et métriques:
- Total erreurs (24h)
- Taux d'erreur API
- Endpoints affectés
- Liste des événements récents avec trace ID

## Configuration

```env
# Niveau de log (debug, info, warn, error)
NEXT_PUBLIC_LOG_LEVEL=info

# URL WebSocket pour notifications temps réel
NEXT_PUBLIC_WS_URL=wss://ws.gopharma.local
```

## WebSocket Notifications

### Hook `useWebSocket`

```typescript
const { status, send, lastMessage } = useWebSocket({
  url: "wss://ws.gopharma.local?userId=123",
  onMessage: (data) => console.log("Nouveau message:", data),
  autoConnect: true,
  reconnectAttempts: 5,
});
```

### Provider `RealTimeNotificationsProvider`

```tsx
<RealTimeNotificationsProvider userId={user._id}>
  <App />
</RealTimeNotificationsProvider>
```

### Usage dans composant

```tsx
import { useRealTimeNotifications } from "@/lib/RealTimeNotificationsProvider";
import { RealTimeNotificationBadge } from "@/components/RealTimeNotificationBadge";

function Header() {
  const { notifications, unreadCount, markAsRead } = useRealTimeNotifications();
  
  return <RealTimeNotificationBadge />;
}
```

## Migration depuis le polling

**Avant**:
```typescript
useEffect(() => {
  const interval = setInterval(fetchNotifications, 5000);
  return () => clearInterval(interval);
}, []);
```

**Après**:
```typescript
const { notifications, isRealTime } = useRealTimeNotifications();
// Notifications reçues instantanément via WebSocket
```

## Intégration FCM/Expo (prochaine étape)

Le système est prêt pour ajouter:
1. Service Worker pour FCM (Firebase Cloud Messaging)
2. Integration Expo Push pour mobile
3. Fallback polling si WebSocket indisponible
